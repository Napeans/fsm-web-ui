export interface LoginRequest {
  mobileNumber: string;
  pin: string;
}

export interface LoginResponse {
  token: string;
}

export interface CreateLeadRequest {
  customerId: number;
  customerAddressId: number;
  serviceTypeId: number;
  scheduledOn: string;
}