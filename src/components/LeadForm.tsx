"use client";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import Spinner from "@/components/Spinner";
import { toApiError } from "@/lib/api-error";
import { leadSchema, type LeadFormValues } from "@/lib/validations/lead";
import { propertyTypes, sources, statuses, type Lead, type LeadInput } from "@/lib/types";

type Props = {
  lead?: Lead;
  onClose: () => void;
  // Should throw when the API call fails
  onSave: (data: LeadInput) => Promise<void>;
};

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      {children}
      {error && (
        <span className="error-text" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

export default function LeadForm({ lead, onClose, onSave }: Props) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: lead?.name ?? "",
      phone: lead?.phone ?? "",
      email: lead?.email ?? "",
      budget: lead ? String(lead.budget) : "",
      location: lead?.location ?? "",
      propertyType: lead?.propertyType ?? "2 BHK",
      source: lead?.source ?? "Website",
      status: lead?.status ?? "New",
    },
  });

  async function submit(values: LeadFormValues) {
    try {
      await onSave({
        ...values,
        phone: values.phone.replace(/\D/g, ""),
        budget: Number(values.budget),
      });
      onClose();
    } catch (error) {
      const { message, fieldErrors } = toApiError(error);

      // Backend validation errors go under the matching field
      let shownOnField = false;
      fieldErrors.forEach((e) => {
        if (e.field in leadSchema.shape) {
          setError(e.field as keyof LeadFormValues, { message: e.message });
          shownOnField = true;
        }
      });

      // Anything else (network error, server error) becomes a toast
      if (!shownOnField) toast.error(message);
    }
  }

  return (
    <div
      className="overlay"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
    >
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="lead-form-title">
        <div className="modal-head">
          <h2 id="lead-form-title">{lead ? "Edit lead" : "Add new lead"}</h2>
          <button
            className="btn btn-small"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close form"
          >
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit(submit)} noValidate>
          <div className="modal-body">
            <div className="form-grid">
              <Field id="lead-name" label="Full name *" error={errors.name?.message}>
                <input id="lead-name" placeholder="e.g. Priya Sharma" {...register("name")} />
              </Field>
              <Field id="lead-phone" label="Phone number *" error={errors.phone?.message}>
                <input id="lead-phone" placeholder="98765 43210" inputMode="tel" {...register("phone")} />
              </Field>
              <Field id="lead-email" label="Email (optional)" error={errors.email?.message}>
                <input id="lead-email" type="email" placeholder="name@example.com" {...register("email")} />
              </Field>
              <Field id="lead-budget" label="Budget (₹) *" error={errors.budget?.message}>
                <input id="lead-budget" type="number" min="1" placeholder="8500000" {...register("budget")} />
              </Field>
              <Field id="lead-location" label="Preferred location *" error={errors.location?.message}>
                <input id="lead-location" placeholder="e.g. Thane West" {...register("location")} />
              </Field>
              <Field id="lead-property" label="Property type" error={errors.propertyType?.message}>
                <select id="lead-property" {...register("propertyType")}>
                  {propertyTypes.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </Field>
              <Field id="lead-source" label="Lead source" error={errors.source?.message}>
                <select id="lead-source" {...register("source")}>
                  {sources.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </Field>
              <Field id="lead-status" label="Status" error={errors.status?.message}>
                <select id="lead-status" {...register("status")}>
                  {statuses.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </Field>
            </div>
          </div>
          <div className="modal-foot">
            <button type="button" className="btn" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting && <Spinner />}
              {isSubmitting ? "Saving…" : lead ? "Save changes" : "Add lead"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
