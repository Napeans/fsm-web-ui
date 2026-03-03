import api from "../../api/axios";
import type { CreateLeadRequest, CustomerCreateRequest } from "./lead.types";

export const fetchCustomerByMobile = async (mobile: string) => {
  const res = await api.get(`/customers/search?mobile=${mobile}`);
  return res.data;
};

export const createCustomer = async (data: CustomerCreateRequest) => {
  const res = await api.post("/customers/create", data);
  return res.data;
};

export const createLead = async (data: CreateLeadRequest) => {
  const res = await api.post("/leads/create", data);
  return res.data;
};
