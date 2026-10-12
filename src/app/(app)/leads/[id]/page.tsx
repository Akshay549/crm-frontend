"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Send,
  Globe,
  HomeIcon,
  Banknote,
} from "lucide-react";
import ErrorState from "@/components/ErrorState";
import Skeleton from "@/components/Skeleton";
import Spinner from "@/components/Spinner";
import { useApi } from "@/hooks/useApi";
import {
  addNote,
  getLead,
  getNotes,
  updateLeadStatus,
} from "@/services/leadService";
import { toApiError } from "@/lib/api-error";
import {
  formatBudget,
  formatPhone,
  statusClass,
  statuses,
  type LeadStatus,
} from "@/lib/types";

const NOTE_MAX_LENGTH = 1000;

/** Label + value pair used in the info card. */
function InfoItem({
  icon: Icon,
  label,
  children,
  className = "",
}: {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`detail-item ${className}`}>
      <div className="label">
        <Icon size={13} />
        {label}
      </div>
      <div className="value">{children}</div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <main className="page">
      <div className="page-heading">
        <div>
          <Skeleton width={220} height={28} />
          <Skeleton width={180} height={13} style={{ marginTop: 10 }} />
        </div>
      </div>
      <div className="detail-grid">
        <section
          className="panel detail-panel"
          style={{ display: "grid", gap: 16 }}
        >
          <Skeleton height={28} />
          <Skeleton height={74} radius={7} />
          <Skeleton height={44} />
        </section>
        <aside
          className="panel detail-panel"
          style={{ display: "grid", gap: 12 }}
        >
          <Skeleton width={150} height={18} />
          <Skeleton height={64} radius={6} />
          <Skeleton height={44} radius={6} />
        </aside>
      </div>
    </main>
  );
}

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const {
    data: leadRes,
    error,
    update: setLeadRes,
    reload,
  } = useApi(() => getLead(id), [id]);
  const {
    data: notesRes,
    error: notesError,
    loading: notesLoading,
    update: setNotesRes,
    reload: reloadNotes,
  } = useApi(() => getNotes(id), [id]);

  const [note, setNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  if (error?.status === 404)
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

  if (error)
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

  if (!leadRes) return <DetailSkeleton />;

  const lead = leadRes.data.lead;
  const notes = notesRes?.data.notes ?? [];

  async function changeStatus(status: LeadStatus) {
    setUpdatingStatus(true);
    try {
      const response = await updateLeadStatus(lead.id, status);
      toast.success(response.message);
      setLeadRes(response); // the response already holds the updated lead
    } catch (err) {
      toast.error(toApiError(err).message);
    } finally {
      setUpdatingStatus(false);
    }
  }

  async function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    const text = note.trim();
    if (!text || addingNote) return;

    setAddingNote(true);
    try {
      const response = await addNote(lead.id, text);
      toast.success(response.message);
      setNote("");
      if (notesRes)
        setNotesRes({
          ...notesRes,
          data: { notes: [response.data.note, ...notes] },
        });
      else reloadNotes();
    } catch (err) {
      toast.error(toApiError(err).message);
    } finally {
      setAddingNote(false);
    }
  }

  return (
    <main className="page">
      <div className="page-heading">
        <div>
          <h1>
            {lead.name}
            <span className={statusClass(lead.status)}>{lead.status}</span>
          </h1>
          <div className="subtle">
            {lead.leadId} · Added{" "}
            {new Date(lead.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>

        <div className="page-heading-actions">
          {lead.email && (
            <a className="btn" href={`mailto:${lead.email}`}>
              <Mail size={14} /> Email
            </a>
          )}
        </div>
      </div>

      <div className="detail-grid">
        {/* ───────── Lead information ───────── */}
        <section className="panel detail-panel">
          <div className="detail-title">
            <div>
              <h2>Lead information</h2>
              <div className="subtle">Property requirements and contact</div>
            </div>

            <div className="status-control">
              <label htmlFor="status-change">Status</label>
              {updatingStatus && <Spinner size={16} />}
              <select
                id="status-change"
                className="field-control"
                value={lead.status}
                disabled={updatingStatus}
                onChange={(e) => changeStatus(e.target.value as LeadStatus)}
              >
                {statuses.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="kpi-strip">
            <InfoItem icon={Banknote} label="Budget" className="kpi accent">
              {formatBudget(lead.budget)}
            </InfoItem>
            <InfoItem icon={HomeIcon} label="Property type" className="kpi">
              {lead.propertyType}
            </InfoItem>
            <InfoItem icon={MapPin} label="Preferred location" className="kpi">
              {lead.location}
            </InfoItem>
          </div>

          <div className="kpi-strip">
            <InfoItem icon={Phone} label="Phone number" className="kpi">
              {lead.phone}
            </InfoItem>
            <InfoItem icon={Mail} label="Email address" className="kpi">
              {lead.email || <span className="subtle">Not provided</span>}
            </InfoItem>
            <InfoItem icon={Globe} label="Lead source" className="kpi">
              {lead.source}
            </InfoItem>
          </div>
        </section>

        {/* ───────── Notes & activity ───────── */}
        <aside className="panel detail-panel">
          <div className="notes-head">
            <MessageSquare size={16} />
            <h2>Notes &amp; activity</h2>
            {notes.length > 0 && (
              <span className="count-pill">{notes.length}</span>
            )}
          </div>

          <form className="note-form" onSubmit={handleAddNote}>
            <label htmlFor="note-input" className="sr-only">
              Add a note
            </label>
            <textarea
              id="note-input"
              className="field-control"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Log a call, preference or next step…"
              rows={2}
              maxLength={NOTE_MAX_LENGTH}
              disabled={addingNote}
            />
            <div className="note-form-foot">
              <span className="char-count">
                {note.length > 0 && `${note.length}/${NOTE_MAX_LENGTH}`}
              </span>
              <button
                className="btn btn-primary"
                type="submit"
                disabled={!note.trim() || addingNote}
              >
                {addingNote ? <Spinner /> : <Send size={14} />}
                {addingNote ? "Adding…" : "Add note"}
              </button>
            </div>
          </form>

          {notesError ? (
            <div className="notes-list">
              <ErrorState
                title="Couldn't load notes"
                message={notesError.message}
                onRetry={reloadNotes}
              />
            </div>
          ) : notesLoading ? (
            <div className="notes-list">
              <Skeleton height={56} />
              <Skeleton height={56} />
            </div>
          ) : notes.length === 0 ? (
            <div className="notes-empty">
              <MessageSquare size={16} />
              <span>No notes yet. Your first note will appear here.</span>
            </div>
          ) : (
            <div className="notes-list">
              {notes.map((n) => (
                <article className="note" key={n.id}>
                  <div className="note-time">
                    {new Date(n.createdAt).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div className="note-text">{n.text}</div>
                </article>
              ))}
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
