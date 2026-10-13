import type { ReactNode } from "react";
import {
  Banknote,
  Globe,
  HomeIcon,
  Mail,
  MapPin,
  Phone,
  type LucideIcon,
} from "lucide-react";
import Spinner from "@/components/Spinner";
import {
  formatBudget,
  formatPhone,
  statuses,
  type Lead,
  type LeadStatus,
} from "@/lib/types";

type LeadInfoCardProps = {
  lead: Lead;
  updating: boolean;
  onStatusChange: (status: LeadStatus) => void;
};

type InfoFieldProps = {
  icon: LucideIcon;
  label: string;
  highlight?: boolean;
  children: ReactNode;
};

function InfoField({ icon: Icon, label, highlight, children }: InfoFieldProps) {
  return (
    <div
      className={
        highlight
          ? "lead-info-field lead-info-field-highlight"
          : "lead-info-field"
      }
    >
      <dt>
        <Icon size={13} /> {label}
      </dt>
      <dd>{children}</dd>
    </div>
  );
}

export default function LeadInfoCard({
  lead,
  updating,
  onStatusChange,
}: LeadInfoCardProps) {
  return (
    <section className="panel lead-card">
      <div className="lead-card-head">
        <div>
          <h2>Lead information</h2>
          <div className="subtle">Property requirements and contact</div>
        </div>

        <div className="lead-status">
          <label htmlFor="lead-status">Status</label>
          {updating && <Spinner size={16} />}
          <select
            id="lead-status"
            className="field-control"
            value={lead.status}
            disabled={updating}
            onChange={(e) => onStatusChange(e.target.value as LeadStatus)}
          >
            {statuses.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      <dl className="lead-info-grid">
        <InfoField icon={Banknote} label="Budget" highlight>
          {formatBudget(lead.budget)}
        </InfoField>
        <InfoField icon={HomeIcon} label="Property type">
          {lead.propertyType}
        </InfoField>
        <InfoField icon={MapPin} label="Preferred location">
          {lead.location}
        </InfoField>
        <InfoField icon={Phone} label="Phone number">
          <a href={`tel:${lead.phone}`}>{formatPhone(lead.phone)}</a>
        </InfoField>
        <InfoField icon={Mail} label="Email address">
          {lead.email ? (
            <a href={`mailto:${lead.email}`}>{lead.email}</a>
          ) : (
            <span className="subtle">Not provided</span>
          )}
        </InfoField>
        <InfoField icon={Globe} label="Lead source">
          {lead.source}
        </InfoField>
      </dl>
    </section>
  );
}