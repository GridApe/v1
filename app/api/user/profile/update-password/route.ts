import { handleApiRequest } from "@/lib/api-utils"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    return await handleApiRequest(request, "/user/profile/reset-password", "POST")
  } catch (error) {
    console.error("Password reset error:", error)
    return NextResponse.json(
      {
        status: false,
        message: "Failed to reset password",
        errors: { general: ["An unexpected error occurred"] },
      },
      { status: 500 },
    )
  }
}

