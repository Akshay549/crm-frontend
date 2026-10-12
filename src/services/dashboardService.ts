import api from "@/lib/axios";
import type { ApiResponse, DashboardStats } from "@/lib/types";

export const getDashboardStats = () =>
  api
    .get<ApiResponse<DashboardStats>>("/dashboard/stats")
    .then((res) => res.data);
