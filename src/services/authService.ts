import api from "@/lib/axios";
import type { ApiResponse, AuthUser } from "@/lib/types";
import type { LoginFormValues } from "@/lib/validations/auth";

type UserData = { user: AuthUser };

export const login = (values: LoginFormValues) =>
  api
    .post<ApiResponse<UserData>>("/auth/login", values)
    .then((res) => res.data);

export const getMe = () =>
  api.get<ApiResponse<UserData>>("/auth/me").then((res) => res.data);

export const logout = () =>
  api.post<ApiResponse>("/auth/logout").then((res) => res.data);
