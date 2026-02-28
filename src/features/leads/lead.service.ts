import api from "../../api/axios";
import type { CustomerCreateRequest, CreateLeadRequest } from "./lead.types";

export const fetchCustomerByMobile = async (mobile: string) => {
  const res = await api.get(`/customers/search?mobile=${mobile}`);
  return res.data;
};

 

export const createLead = async (data: CreateLeadRequest) => {
  const res = await api.post("/leads", data);
  return res.data;
};

export const createCustomerAddress = async (data: CustomerCreateRequest) => {
  const res = await api.post("/customer/create", data);
  return res.data;
};
