export interface Customer {
  customerId: number;
  customerName: string;
  mobileNo: string;
}

export interface CustomerAddress {
  customerAddressId: number;
  addressType: string;
  addressLine1: string;
  latitude: number;
  longitude: number;
}

export interface CreateLeadRequest {
  customerId?: number;
  customerAddressId?: number;
  customerName?: string;
  mobileNo?: string;
  whatsappNo?: string;
  emailId?: string;
  addresse?: CreateCustomerAddressRequest;
  serviceTypeId: number;
  scheduledOn: string;
  remarks?: string;
}

export interface CreateCustomerAddressRequest {
  customerAddressId?: number;
  addressType?: string;
  addressLine1?: string;
  area?: string;
  city?: string;
  state?: string;
  pincode?: string;
  latitude?: number | null;
  longitude?: number | null;
  isDefault?: boolean;
}

export interface CustomerCreateRequest {
  customerId?: number | null;
  customerName?: string;
  mobileNo?: string;
  whatsappNo?: string;
  emailId?: string;
  addresse: CreateCustomerAddressRequest;
}
