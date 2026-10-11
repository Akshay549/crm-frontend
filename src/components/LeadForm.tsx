"use client";
import { useState } from "react";
import { X } from "lucide-react";
import {
  propertyTypes,
  sources,
  statuses,
  type Lead,
  type LeadSource,
  type PropertyType,
  type LeadStatus,
} from "@/lib/types";

type Props = {
  lead?: Lead;
  onClose: () => void;
  onSave: (data: {
    name: string;
    phone: string;
    email: string;
    budget: number;
    location: string;
    propertyType: PropertyType;
    source: LeadSource;
    status: LeadStatus;
  }) => string | null;
};

export default function LeadForm({ lead, onClose, onSave }: Props) {
  const [name, setName] = useState(lead?.name ?? "");
  const [phone, setPhone] = useState(lead?.phone ?? "");
  const [email, setEmail] = useState(lead?.email ?? "");
  const [budget, setBudget] = useState(String(lead?.budget ?? ""));
  const [location, setLocation] = useState(lead?.location ?? "");
  const [propertyType, setPropertyType] = useState<PropertyType>(
    lead?.propertyType ?? "2 BHK",
  );
  const [source, setSource] = useState<LeadSource>(lead?.source ?? "Website");
  const [status, setStatus] = useState<LeadStatus>(lead?.status ?? "New");
  const [phoneError, setPhoneError] = useState("");
  const [sending, setSending] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setPhoneError("");
    setSending(true);
    const error = onSave({
      name,
      phone: phone.replace(/\D/g, ""),
      email,
      budget: Number(budget),
      location,
      propertyType,
      source,
      status,
    });
    setSending(false);
    if (error) {
      setPhoneError(error);
      return;
    }
    onClose();
  }

  return (
    <div
      className="overlay"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-form-title"
      >
        <div className="modal-head">
          <h2 id="lead-form-title">{lead ? "Edit lead" : "Add new lead"}</h2>
          <button
            className="btn btn-small"
            onClick={onClose}
            aria-label="Close form"
          >
            <X size={16} />
          </button>
        </div>
        <form onSubmit={submit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="lead-name">Full name *</label>
                <input
                  id="lead-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Priya Sharma"
                />
              </div>
              <div className="form-field">
                <label htmlFor="lead-phone">Phone number *</label>
                <input
                  id="lead-phone"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setPhoneError("");
                  }}
                  required
                  placeholder="98765 43210"
                  inputMode="tel"
                />
              </div>
              <div className="form-field">
                <label htmlFor="lead-email">Email (optional)</label>
                <input
                  id="lead-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                />
              </div>
              <div className="form-field">
                <label htmlFor="lead-budget">Budget (₹) *</label>
                <input
                  id="lead-budget"
                  type="number"
                  min="1"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  required
                  placeholder="8500000"
                />
              </div>
              <div className="form-field">
                <label htmlFor="lead-location">Preferred location *</label>
                <input
                  id="lead-location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  placeholder="e.g. Thane West"
                />
              </div>
              <div className="form-field">
                <label htmlFor="lead-property">Property type</label>
                <select
                  id="lead-property"
                  value={propertyType}
                  onChange={(e) =>
                    setPropertyType(e.target.value as PropertyType)
                  }
                >
                  {propertyTypes.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="lead-source">Lead source</label>
                <select
                  id="lead-source"
                  value={source}
                  onChange={(e) => setSource(e.target.value as LeadSource)}
                >
                  {sources.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="lead-status">Status</label>
                <select
                  id="lead-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as LeadStatus)}
                >
                  {statuses.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="modal-foot">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={sending}
            >
              {sending ? "Saving…" : lead ? "Save changes" : "Add lead"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
