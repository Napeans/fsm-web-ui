import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});
console.log("API Base URL:", import.meta.env.VITE_API_BASE_URL);

const isUnauthenticatedPayload = (data: unknown) => {
  if (typeof data === "string") {
    return data.toLowerCase().includes("unauthenticated");
  }
  if (data && typeof data === "object") {
    const message = (data as { message?: unknown; Message?: unknown }).message ?? (data as { Message?: unknown }).Message;
    if (typeof message === "string" && message.toLowerCase().includes("unauthenticated")) {
      return true;
    }
  }
  return false;
};

const redirectToLogin = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("fullName");
  if (window.location.pathname !== "/") {
    window.location.href = "/";
  }
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    if (isUnauthenticatedPayload(response.data)) {
      redirectToLogin();
      return Promise.reject(new Error("Unauthenticated"));
    }
    return response;
  },
  (error) => {
    const status = error?.response?.status;
    const data = error?.response?.data;
    if (status === 401 || isUnauthenticatedPayload(data)) {
      redirectToLogin();
    }
    return Promise.reject(error);
  }
);

export default api;
