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

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
