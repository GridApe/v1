import { CampaignTypes, ContactTypes, TemplateTypes } from '@/types/interface';
import axios, { AxiosError, AxiosInstance } from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = 'http://localhost:8000/api/v1';
// const BASE_URL = "https:api.gridape.com/api/v1";

class ApiService {
  private api: AxiosInstance;
  private csrfTokenFetched: boolean = false;

  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
      withCredentials: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.api.interceptors.request.use(async (config) => {
      // Ensure CSRF token is fetched only once
      if (!this.csrfTokenFetched) {
        await this.getCsrfToken();
      }

      const token = Cookies.get('XSRF-TOKEN');
      const access_token = localStorage.getItem('token');

      if (access_token) {
        config.headers['Authorization'] = `Bearer ${access_token}`;
      }
      if (token) {
        config.headers['X-XSRF-TOKEN'] = token;
      }
      return config;
    });

    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Only retry once if it's a 419 CSRF token error
        if (error.response?.status === 419 && !originalRequest._retry) {
          originalRequest._retry = true;
          await this.getCsrfToken();
          return this.api(originalRequest);
        }

        return Promise.reject(error);
      }
    );
  }

  private async getCsrfToken() {
    try {
      await axios.get(`${BASE_URL.split('/api/v1')[0]}/sanctum/csrf-cookie`, {
        withCredentials: true,
      });

      const csrfToken = Cookies.get('XSRF-TOKEN');
      if (!csrfToken) {
        throw new Error('CSRF token not set after request');
      }

      this.csrfTokenFetched = true;
    } catch (error) {
      this.csrfTokenFetched = false;
      console.error('Error fetching CSRF token:', error);
      throw this.handleApiError(error);
    }
  }

  private handleApiError(error: unknown): ApiError {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        console.error('API Error Response:', axiosError.response.data);
        return new ApiError(
          axiosError.response.status,
          axiosError.message || 'An error occurred',
          axiosError.response.data
        );
      } else if (axiosError.request) {
        console.error('API Error Request:', axiosError.request);
        return new ApiError(500, 'No response received from the server');
      } else {
        console.error('API Error:', axiosError.message);
        return new ApiError(500, axiosError.message || 'An unexpected error occurred');
      }
    } else {
      console.error('Unexpected Error:', error);
      return new ApiError(500, 'An unexpected error occurred');
    }
  }

  // Generic method to handle repeated API call pattern
  private async executeApiCall<T>(
    method: 'get' | 'post' | 'put' | 'delete',
    endpoint: string,
    data?: any
  ): Promise<T> {
    try {
      const response =
        method === 'get'
          ? await this.api.get(endpoint)
          : method === 'post'
            ? await this.api.post(endpoint, data)
            : method === 'put'
              ? await this.api.put(endpoint, data)
              : method === 'delete'
                ? await this.api.delete(endpoint, { data })
                : null;

      if (response) {
        return response.data;
      }

      throw new Error('Unsupported HTTP method');
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  // Authentication Methods
  async login(data: LoginData) {
    return this.executeApiCall<any>('post', '/auth/login', data);
  }

  async register(data: RegisterData) {
    return this.executeApiCall<any>('post', '/auth/register', data);
  }

  async verifyEmail(data: VerifyOtpData) {
    return this.executeApiCall<any>('post', 'auth/email/verify', data);
  }

  async resendOtp(email: string) {
    return this.executeApiCall<any>('post', 'auth/resend-verification-mail', {
      email,
    });
  }

  async submitBasicInfo(data: BasicInfoData) {
    return this.executeApiCall<any>('post', '/auth/basic-info', data);
  }

  async submitBusinessInfo(data: BusinessInfoData) {
    return this.executeApiCall<any>('post', '/auth/business-info', data);
  }

  async getCurrentUser() {
    return this.executeApiCall<any>('get', '/user/profile/');
  }

  async logout() {
    return this.executeApiCall<any>('post', '/auth/logout');
  }

  //Contacts
  async listAllContacts() {
    return this.executeApiCall<any>('get', '/user/contacts/');
  }

  async addContact(data: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
  }) {
    return this.executeApiCall<any>('post', '/user/contacts/', data);
  }

  async createCampaign(data: CampaignTypes) {
    return this.executeApiCall<any>('post', '/auth/campaigns', data);
  }

  //templates
  async listAllEmailTemplate() {
    return this.executeApiCall<any>('get', '/user/templates');
  }
  async savedEmailTemplates() {
    return this.executeApiCall<any>('get', '/user/email-templates');
  }
  async updateEmailTemplate(data: TemplateTypes) {
    return this.executeApiCall<any>('put', '/auth/campaigns', data);
  }
  async deleteEmailTemplate(data: TemplateTypes) {
    return this.executeApiCall<any>('delete', '/auth/campaigns', data);
  }
  async saveEmailTemplate(data: TemplateTypes) {
    return this.executeApiCall<any>('post', '/user/email-templates', data);
  }

  // Notifications
  async listNotifications() {
    return this.executeApiCall<any>("get", "/user/notifications/");
  }

  async markNotificationAsRead(notificationId: string) {
    return this.executeApiCall<any>(
      "post",
      `/user/notifications/${notificationId}/read`
    );
  }

  async markAllNotificationsAsRead() {
    return this.executeApiCall<any>("post", "/user/notifications/mark-all-read");
  }

  async deleteNotification(notificationId: string) {
    return this.executeApiCall<any>(
      "delete",
      `/user/notifications/${notificationId}`
    );
  }
}
// Error class remains the same
class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Interfaces remain the same as in the original file
export interface LoginData {
  /* ... */
}
export interface RegisterData {
  /* ... */
}
export interface VerifyOtpData {
  /* ... */
}
export interface BasicInfoData {
  /* ... */
}
export interface BusinessInfoData {
  /* ... */
}

export default new ApiService();
// Interfaces
export interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  password_confirmation: string;
}

export interface VerifyOtpData {
  email: string;
  token: string;
}

export interface BasicInfoData {
  fullName: string;
  phoneNumber: string;
  country: string;
  state: string;
}

export interface BusinessInfoData {
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
}
