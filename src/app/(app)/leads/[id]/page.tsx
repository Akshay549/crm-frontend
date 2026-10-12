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
  CalendarDays,
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
          style={{ display: "grid", gap: 20 }}
        >
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} height={38} />
          ))}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Skeleton width={90} height={14} />
            <Skeleton width={145} height={36} radius={6} />
          </div>
        </section>
        <aside
          className="panel detail-panel"
          style={{ display: "grid", gap: 14 }}
        >
          <Skeleton width={150} height={18} />
          <Skeleton height={85} radius={6} />
          <Skeleton width={104} height={36} radius={6} />
          <Skeleton height={70} radius={6} />
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
          <h1>{lead.name}</h1>
          <div className="subtle">
            {lead.leadId} · Added{" "}
            {new Date(lead.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>
      </div>

      <div className="detail-grid">
        <section className="panel detail-panel">
          <div className="detail-title">
            <div>
              <h2>Lead information</h2>
              <div className="subtle">Contact and property preferences</div>
            </div>
            <span className={statusClass(lead.status)}>{lead.status}</span>
          </div>

          <div className="detail-fields">
            <div className="detail-item">
              <div className="label">
                <Phone
                  size={13}
                  style={{ display: "inline", marginRight: 5 }}
                />
                Phone number
              </div>
              <div className="value">{formatPhone(lead.phone)}</div>
            </div>

            <div className="detail-item">
              <div className="label">
                <Mail size={13} style={{ display: "inline", marginRight: 5 }} />
                Email address
              </div>
              <div className="value">{lead.email || "Not provided"}</div>
            </div>

            <div className="detail-item">
              <div className="label">
                <Banknote
                  size={13}
                  style={{ display: "inline", marginRight: 5 }}
                />
                Budget
              </div>
              <div className="value" style={{ color: "#2253a3" }}>
                {formatBudget(lead.budget)}
              </div>
            </div>

            <div className="detail-item">
              <div className="label">
                <MapPin
                  size={13}
                  style={{ display: "inline", marginRight: 5 }}
                />
                Preferred location
              </div>
              <div className="value">{lead.location}</div>
            </div>

            <div className="detail-item">
              <div className="label">
                <HomeIcon
                  size={13}
                  style={{ display: "inline", marginRight: 5 }}
                />
                Property type
              </div>
              <div className="value">{lead.propertyType}</div>
            </div>

            <div className="detail-item">
              <div className="label">
                <Globe
                  size={13}
                  style={{ display: "inline", marginRight: 5 }}
                />
                Lead source
              </div>
              <div className="value">{lead.source}</div>
            </div>

            <div className="detail-item">
              <div className="label">
                <CalendarDays
                  size={13}
                  style={{ display: "inline", marginRight: 5 }}
                />
                Created on
              </div>
              <div className="value">
                {new Date(lead.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>

          <div className="status-row">
            <label
              htmlFor="status-change"
              style={{ fontWeight: 650, fontSize: 12 }}
            >
              Update status
            </label>
            {updatingStatus && (
              <span style={{ marginLeft: "auto", display: "flex" }}>
                <Spinner size={16} />
              </span>
            )}
            <select
              id="status-change"
              className="field-control"
              style={{ marginLeft: updatingStatus ? 0 : "auto", minWidth: 145 }}
              value={lead.status}
              disabled={updatingStatus}
              onChange={(e) => changeStatus(e.target.value as LeadStatus)}
            >
              {statuses.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </section>

        <aside className="panel detail-panel">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <MessageSquare size={17} />
            <h2 style={{ margin: 0, fontSize: 15 }}>Notes & activity</h2>
          </div>
          <p className="subtle" style={{ lineHeight: 2.6 }}>
            Keep a record of calls, preferences and site visits.
          </p>
          <form onSubmit={handleAddNote}>
            <div className="form-field">
              <label htmlFor="note-input">Add a note</label>
              <textarea
                id="note-input"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Write a call summary or next step…"
                rows={3}
                maxLength={NOTE_MAX_LENGTH}
                disabled={addingNote}
              />
            </div>
            <button
              className="btn btn-primary"
              type="submit"
              style={{ marginTop: 9 }}
              disabled={!note.trim() || addingNote}
            >
              {addingNote ? <Spinner /> : <Send size={14} />}{" "}
              {addingNote ? "Adding…" : "Add note"}
            </button>
          </form>

          <div className="notes-list">
            {notesError ? (
              <ErrorState
                title="Couldn't load notes"
                message={notesError.message}
                onRetry={reloadNotes}
              />
            ) : notesLoading ? (
              <div style={{ display: "grid", gap: 10 }}>
                <Skeleton height={70} />
                <Skeleton height={70} />
              </div>
            ) : notes.length === 0 ? (
              <div className="empty-state" style={{ padding: "25px 8px" }}>
                <div className="empty-icon">
                  <MessageSquare size={17} />
                </div>
                <h3>No notes yet</h3>
                <p>Add the first activity note above.</p>
              </div>
            ) : (
              notes.map((n) => (
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
              ))
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
