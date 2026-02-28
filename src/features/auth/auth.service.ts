import api from "../../api/axios";
import type { LoginRequest, LoginResponse } from "./auth.types";

export const loginUser = async (
  data: LoginRequest
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    "/auth/login",
    data
  );
  console.log("Login response:", response.data);
  return response.data;
};