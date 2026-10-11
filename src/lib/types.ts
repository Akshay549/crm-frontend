export type LeadStatus = "New" | "Contacted" | "Site Visit" | "Closed";

export type LeadSource =
  | "Facebook"
  | "Google"
  | "Referral"
  | "Walk-in"
  | "Website"
  | "Other";

export type PropertyType =
  | "1 BHK"
  | "2 BHK"
  | "3 BHK"
  | "4+ BHK"
  | "Plot"
  | "Commercial";

export type LeadNote = {
  id: string;
  text: string;
  authorName: string;
  createdAt: string;
};

export type Lead = {
  id: string; // database id: used in URLs and API calls
  leadId: string; // readable id shown in the UI, e.g. LD-1001
  name: string;
  phone: string;
  email: string;
  budget: number;
  location: string;
  propertyType: PropertyType;
  source: LeadSource;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
};

// What the lead form sends to the API
export type LeadInput = Omit<Lead, "id" | "leadId" | "createdAt" | "updatedAt">;

export type AuthUser = { id: string; name: string; email: string; role: string };

// Shape of every successful API response
export type ApiResponse<T = null> = { success: true; message: string; data: T };

export type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type DashboardStats = {
  totalLeads: number;
  closedDeals: number;
  siteVisits: number;
  conversionRate: number;
  leadsBySource: { source: LeadSource; count: number }[];
  statusDistribution: { status: LeadStatus; count: number; percentage: number }[];
  recentLeads: Lead[];
};

export const statuses: LeadStatus[] = [
  "New",
  "Contacted",
  "Site Visit",
  "Closed",
];

export const sources: LeadSource[] = [
  "Facebook",
  "Google",
  "Referral",
  "Walk-in",
  "Website",
  "Other",
];

export const propertyTypes: PropertyType[] = [
  "1 BHK",
  "2 BHK",
  "3 BHK",
  "4+ BHK",
  "Plot",
  "Commercial",
];

export function formatBudget(amount: number) {
  return amount >= 10000000
    ? `₹${(amount / 10000000).toLocaleString("en-IN", { maximumFractionDigits: 1 })} Cr`
    : amount >= 100000
      ? `₹${(amount / 100000).toLocaleString("en-IN", { maximumFractionDigits: 1 })} L`
      : `₹${amount.toLocaleString("en-IN")}`;
}

export function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10
    ? `${digits.slice(0, 5)} ${digits.slice(5)}`
    : phone;
}

export function statusClass(status: LeadStatus) {
  return `badge status-${status.toLowerCase().replaceAll(" ", "-")}`;
}
