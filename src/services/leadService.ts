import api from "@/lib/axios";
import type {
  ApiResponse,
  Lead,
  LeadInput,
  LeadNote,
  LeadStatus,
  Pagination,
} from "@/lib/types";

export type LeadQuery = {
  search?: string;
  source?: string;
  status?: string;
  sort?: string;
  page?: number;
  limit?: number;
};

type LeadData = { lead: Lead };

export const getLeads = (params: LeadQuery) =>
  api
    .get<ApiResponse<{ leads: Lead[]; pagination: Pagination }>>("/leads", {
      params,
    })
    .then((res) => res.data);

export const getLead = (id: string) =>
  api.get<ApiResponse<LeadData>>(`/leads/${id}`).then((res) => res.data);

export const createLead = (input: LeadInput) =>
  api.post<ApiResponse<LeadData>>("/leads", input).then((res) => res.data);

export const updateLead = (id: string, input: LeadInput) =>
  api
    .patch<ApiResponse<LeadData>>(`/leads/${id}`, input)
    .then((res) => res.data);

export const updateLeadStatus = (id: string, status: LeadStatus) =>
  api
    .patch<ApiResponse<LeadData>>(`/leads/${id}/status`, { status })
    .then((res) => res.data);

export const deleteLead = (id: string) =>
  api.delete<ApiResponse>(`/leads/${id}`).then((res) => res.data);

export const getNotes = (id: string) =>
  api
    .get<ApiResponse<{ notes: LeadNote[] }>>(`/leads/${id}/notes`)
    .then((res) => res.data);

export const addNote = (id: string, text: string) =>
  api
    .post<ApiResponse<{ note: LeadNote }>>(`/leads/${id}/notes`, { text })
    .then((res) => res.data);
