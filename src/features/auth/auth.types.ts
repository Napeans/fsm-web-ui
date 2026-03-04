export interface LoginRequest {
  Username: string;
  Password: string;
  DeviceId: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  FullName?: string;
  fullName?: string;
}
