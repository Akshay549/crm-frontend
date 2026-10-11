import api from "@/lib/axios";
import type { LoginFormValues } from "@/lib/validations/auth";
import type { AuthUser } from "@/lib/auth-storage";

type LoginResponse = {
  success: true;
  message: string;
  data: { user: AuthUser };
};

export async function login(values: LoginFormValues) {
  const response = await api.post<LoginResponse>("/auth/login", values);
  return response.data;
}
