import { z } from "zod";
import {
  propertyTypes,
  sources,
  statuses,
  type LeadSource,
  type LeadStatus,
  type PropertyType,
} from "@/lib/types";

// Same rules as the backend, so users get instant feedback.
// The form keeps phone and budget as text; they are converted when sending.
export const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .refine((v) => v.replace(/\D/g, "").length === 10, "Phone number must be 10 digits"),
  email: z
    .string()
    .trim()
    .refine((v) => v === "" || z.string().email().safeParse(v).success, "Enter a valid email address"),
  budget: z
    .string()
    .trim()
    .min(1, "Budget is required")
    .refine((v) => Number(v) > 0, "Budget must be greater than 0")
    .refine((v) => Number(v) <= 10_000_000_000, "Budget is too large"),
  location: z
    .string()
    .trim()
    .min(1, "Location is required")
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location must be at most 100 characters"),
  propertyType: z.enum(propertyTypes as [PropertyType, ...PropertyType[]]),
  source: z.enum(sources as [LeadSource, ...LeadSource[]]),
  status: z.enum(statuses as [LeadStatus, ...LeadStatus[]]),
});

export type LeadFormValues = z.infer<typeof leadSchema>;
