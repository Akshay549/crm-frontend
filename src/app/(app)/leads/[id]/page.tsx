"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import ErrorState from "@/components/ErrorState";
import LeadDetailSkeleton from "@/components/lead-detail/LeadDetailSkeleton";
import LeadHeader from "@/components/lead-detail/LeadHeader";
import LeadInfoCard from "@/components/lead-detail/LeadInfoCard";
import LeadNotes from "@/components/lead-detail/LeadNotes";
import { useApi } from "@/hooks/useApi";
import { getLead, updateLeadStatus } from "@/services/leadService";
import { toApiError } from "@/lib/api-error";
import type { LeadStatus } from "@/lib/types";
import "./lead-detail.css";

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, error, update, reload } = useApi(() => getLead(id), [id]);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  if (error?.status === 404) {
    return (
      <main className="page">
        <div className="panel empty-state">
          <h3>Lead not found</h3>
          <p>This lead may have been deleted.</p>
          <Link className="btn" href="/leads">
            <ArrowLeft size={14} /> Back to leads
          </Link>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page">
        <div className="panel">
          <ErrorState
            title="Couldn't load this lead"
            message={error.message}
            onRetry={reload}
          />
        </div>
      </main>
    );
  }

  if (!data) return <LeadDetailSkeleton />;

  const lead = data.data.lead;

  async function changeStatus(status: LeadStatus) {
    setUpdatingStatus(true);
    try {
      const response = await updateLeadStatus(lead.id, status);
      toast.success(response.message);
      update(response);
    } catch (err) {
      toast.error(toApiError(err).message);
    } finally {
      setUpdatingStatus(false);
    }
  }

  return (
    <main className="page">
      <LeadHeader lead={lead} />
      <div className="lead-grid">
        <LeadInfoCard
          lead={lead}
          updating={updatingStatus}
          onStatusChange={changeStatus}
        />
        <LeadNotes key={lead.id} leadId={lead.id} />
      </div>
    </main>
  );
}