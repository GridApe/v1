import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Constants
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.gridape.com/api/v1"
const CSRF_COOKIE_URL = `${process.env.NEXT_PUBLIC_CSRF_COOKIE_URL}` || "https://api.gridape.com/sanctum/csrf-cookie"
const REQUEST_TIMEOUT = 30000 // 30 seconds
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second

// Types
interface ApiResponse<T = any> {
  status: boolean
  message: string
  data?: T
  errors?: Record<string, string[]>
}

interface ApiError {
  message: string
  errors?: Record<string, string[]>
  status?: number
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  timeout?: number
  retries?: number
  retryDelay?: number
  cache?: boolean
  cacheDuration?: number
  body?: any
  headers?: Record<string, string>
}

// Cache implementation
const cache = new Map<string, { data: any; timestamp: number }>()

function getCachedData(key: string): any | null {
  const cached = cache.get(key)
  if (!cached) return null

  const now = Date.now()
  if (now - cached.timestamp > 5 * 60 * 1000) {
    // 5 minutes default cache
    cache.delete(key)
    return null
  }

  return cached.data
}

function setCachedData(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() })
}

// Utility functions
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function isNetworkError(error: any): boolean {
  return error instanceof TypeError && error.message === "Failed to fetch"
}

function parseError(error: any): ApiError {
  if (error instanceof Error) {
    try {
      const parsedError = JSON.parse(error.message)
      if (typeof parsedError === "object") {
        return {
          message: parsedError.message || "Validation failed.",
          errors: parsedError.errors || null,
          status: parsedError.status || 500,
        }
      }
    } catch {
      return {
        message: error.message,
        status: 500,
      }
    }
  }
  return {
    message: "An unexpected error occurred",
    status: 500,
  }
}

// CSRF token handling
async function ensureCsrfToken(): Promise<string> {
  try {
    const response = await fetch(CSRF_COOKIE_URL, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch CSRF token")
    }

    const cookieHeader = response.headers.get("set-cookie")
    const csrfTokenMatch = cookieHeader?.match(/XSRF-TOKEN=([^;]+)/)
    const csrfToken = csrfTokenMatch ? csrfTokenMatch[1] : ""

    if (!csrfToken) {
      throw new Error("CSRF token not found in response")
    }

    return csrfToken
  } catch (error) {
    console.error("Error fetching CSRF token:", error)
    throw new Error("Failed to fetch CSRF token")
  }
}

// Main API request handler
export async function handleApiRequest<T = any>(
  request: NextRequest,
  endpoint: string,
  methodOrOptions: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | RequestOptions = "GET",
): Promise<NextResponse<ApiResponse<T>>> {
  // Handle both old and new usage patterns
  const options: RequestOptions = typeof methodOrOptions === "string" ? { method: methodOrOptions } : methodOrOptions

  const {
    method = "GET",
    timeout = REQUEST_TIMEOUT,
    retries = MAX_RETRIES,
    retryDelay = RETRY_DELAY,
    cache = false,
    cacheDuration = 5 * 60 * 1000, // 5 minutes
    body,
    headers: customHeaders,
  } = options

  let csrfToken: string | undefined
  let lastError: Error | null = null

  // Check cache for GET requests
  if (method === "GET" && cache) {
    const cacheKey = `${endpoint}-${request.url}`
    const cachedData = getCachedData(cacheKey)
    if (cachedData) {
      return NextResponse.json(cachedData)
    }
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      csrfToken = await ensureCsrfToken()
      const cookieStore = cookies()
      const access_token = cookieStore.get("token")?.value

      // Check if the request is multipart/form-data
      const contentType = request.headers.get("content-type") || ""
      const isMultipart = contentType.includes("multipart/form-data")

      // Set up base headers
      const headers: HeadersInit = {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "X-XSRF-TOKEN": csrfToken,
        Authorization: `Bearer ${access_token}`,
        ...customHeaders,
      }

      let requestBody

      if (isMultipart) {
        // For multipart/form-data, extract the FormData
        try {
          const clonedRequest = request.clone()
          const formData = await clonedRequest.formData()
          requestBody = formData
          // Don't set Content-Type for FormData
        } catch (formError) {
          console.error("Error processing form data:", formError)
          throw new Error("Failed to process form data")
        }
      } else {
        // For JSON and other requests
        headers["Content-Type"] = "application/json"
        requestBody = body || (method !== "GET" ? await request.text().catch(() => "{}") : undefined)
      }

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        headers,
        ...(method !== "DELETE" && { body: requestBody }),
        credentials: "include",
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      // Check if the response is a file download
      const responseContentType = response.headers.get("content-type")
      if (
        responseContentType &&
        (responseContentType.includes("application/vnd.ms-excel") ||
          responseContentType.includes("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") ||
          responseContentType.includes("text/csv") ||
          responseContentType.includes("application/octet-stream"))
      ) {
        return new NextResponse(response.body, {
          status: response.status,
          headers: {
            "Content-Type": responseContentType,
            "Content-Disposition": response.headers.get("content-disposition") || "attachment",
          },
        })
      }

      // For JSON responses, parse and handle as before
      // let data;

      // try {
     const   data = await response.json();
      // } catch (parseError) {
      //   return NextResponse.json(
      //     {
      //       status: false,
      //       message: "Failed to parse server response",
      //       errors: { parsing: ["The server response was not valid JSON"] },
      //     },
      //     { status: 500 },
      //   );
      // }
      
      if (!response.ok) {
        throw new Error(JSON.stringify(data));
      }

      // Cache successful GET responses
      if (method === "GET" && cache) {
        const cacheKey = `${endpoint}-${request.url}`
        setCachedData(cacheKey, data)
      }

      return NextResponse.json(data)
    } catch (error: any) {
      lastError = error

      // Handle network errors and retry
      if (isNetworkError(error) && attempt < retries) {
        await sleep(retryDelay * (attempt + 1)) // Exponential backoff
        continue
      }

      // Handle timeout errors
      if (error.name === "AbortError") {
        return NextResponse.json(
          {
            status: false,
            message: "Request timeout",
            errors: { timeout: ["The request took too long to complete"] },
          },
          { status: 408 },
        )
      }

      // Parse and return other errors
      const parsedError = parseError(error)
      return NextResponse.json(
        {
          status: false,
          message: parsedError.message,
          errors: parsedError.errors,
          csrfToken,
        },
        { status: parsedError.status || 500 },
      )
    }
  }

  // If all retries failed, return the last error
  const parsedError = parseError(lastError)
  return NextResponse.json(
    {
      status: false,
      message: parsedError.message,
      errors: parsedError.errors,
      csrfToken,
    },
    { status: parsedError.status || 500 },
  )
}

