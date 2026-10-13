import { Mail } from "lucide-react";
import { formatDate } from "@/lib/format";
import { statusClass, type Lead } from "@/lib/types";

export default function LeadHeader({ lead }: { lead: Lead }) {
  return (
    <div className="page-heading lead-heading">
      <div>
        <h1 className="lead-title">
          {lead.name}
          <span className={statusClass(lead.status)}>{lead.status}</span>
        </h1>
        <div className="subtle">
          {lead.leadId} · Added {formatDate(lead.createdAt)}
        </div>
      </div>

      <div className="lead-actions">
        {lead.email && (
          <a className="btn" href={`mailto:${lead.email}`}>
            <Mail size={14} /> Email
          </a>
        )}
      </div>
    </div>
  );
}