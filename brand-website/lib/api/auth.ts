import { apiClient } from "./client";
import type { User, AuthTokens } from "@/types";
import Cookies from "js-cookie";

interface LoginPayload { email: string; password: string; }
interface RegisterPayload { name: string; email: string; phone: string; password: string; }

export const authApi = {
  login: async (payload: LoginPayload): Promise<User> => {
    const { data } = await apiClient.post<{ user: User } & AuthTokens>(
      "/auth/login",
      payload
    );
    Cookies.set("accessToken", data.accessToken, { secure: true, sameSite: "strict" });
    Cookies.set("refreshToken", data.refreshToken, { secure: true, sameSite: "strict" });
    return data.user;
  },

  register: async (payload: RegisterPayload): Promise<User> => {
    const { data } = await apiClient.post<{ user: User } & AuthTokens>(
      "/auth/register",
      payload
    );
    Cookies.set("accessToken", data.accessToken, { secure: true, sameSite: "strict" });
    Cookies.set("refreshToken", data.refreshToken, { secure: true, sameSite: "strict" });
    return data.user;
  },

  me: () => apiClient.get<User>("/auth/me").then((r) => r.data),

  logout: () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    return apiClient.post("/auth/logout");
  },
};
