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
  customerId: number;
  customerAddressId: number;
  serviceTypeId: number;
  scheduledOn: string;
  remarks?: string;
}