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

export type LeadNote = { id: string; text: string; createdAt: string };

export type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  budget: number;
  location: string;
  propertyType: PropertyType;
  source: LeadSource;
  status: LeadStatus;
  createdAt: string;
  notes: LeadNote[];
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
