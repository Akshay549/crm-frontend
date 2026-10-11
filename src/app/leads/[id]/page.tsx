"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit2,
  Trash2,
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
import { useCRM } from "@/context/CRMContext";
import LeadForm from "@/components/LeadForm";
import {
  formatBudget,
  formatPhone,
  statusClass,
  statuses,
  type Lead,
  type LeadStatus,
} from "@/lib/types";
import Home from "@/app/page";

export default function LeadDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { leads, updateLead, addNote, deleteLead } = useCRM();
  const lead = leads.find((l) => l.id === params.id);
  const [note, setNote] = useState("");
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [loading, setLoading] = useState(false);

  if (loading)
    return (
      <main className="page">
        <div
          className="panel"
          style={{ padding: 24, display: "grid", gap: 12 }}
        >
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{ height: 38, background: "#f0f2f5", borderRadius: 5 }}
            />
          ))}
        </div>
      </main>
    );

  if (loadError)
    return (
      <main className="page">
        <div className="panel error-box">
          <h3>Couldn't load this lead</h3>
          <button
            className="btn"
            onClick={() => {
              setLoadError(false);
              setLoading(true);
              setTimeout(() => setLoading(false), 250);
            }}
          >
            Retry
          </button>
        </div>
      </main>
    );

  if (!lead)
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

  function save(data: Parameters<typeof updateLead>[1]) {
    if (
      leads.some(
        (l) =>
          l.id !== lead?.id &&
          l.phone.replace(/\D/g, "") ===
            String(data.phone ?? lead?.phone).replace(/\D/g, ""),
      )
    )
      return "This phone number already exists.";
    updateLead(lead?.id, data);
    setEditing(false);
    return null;
  }

  return (
    <main className="page">
      <div className="page-heading">
        <div>
          <h1>{lead.name}</h1>
          <div className="subtle">
            {lead.id} · Added{" "}
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
            <select
              id="status-change"
              className="field-control"
              style={{ marginLeft: "auto", minWidth: 145 }}
              value={lead.status}
              onChange={(e) =>
                updateLead(lead.id, { status: e.target.value as LeadStatus })
              }
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
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (note.trim()) {
                addNote(lead.id, note.trim());
                setNote("");
              }
            }}
          >
            <div className="form-field">
              <label htmlFor="note-input">Add a note</label>
              <textarea
                id="note-input"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Write a call summary or next step…"
                rows={3}
              />
            </div>
            <button
              className="btn btn-primary"
              type="submit"
              style={{ marginTop: 9 }}
              disabled={!note.trim()}
            >
              <Send size={14} /> Add note
            </button>
          </form>
          <div className="notes-list">
            {lead.notes.length === 0 ? (
              <div className="empty-state" style={{ padding: "25px 8px" }}>
                <div className="empty-icon">
                  <MessageSquare size={17} />
                </div>
                <h3>No notes yet</h3>
                <p>Add the first activity note above.</p>
              </div>
            ) : (
              lead.notes.map((n) => (
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

      {editing && (
        <LeadForm lead={lead} onClose={() => setEditing(false)} onSave={save} />
      )}

      {confirmDelete && (
        <div className="overlay">
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            style={{ maxWidth: 420 }}
          >
            <div className="modal-head">
              <h2>Delete this lead?</h2>
            </div>
            <div className="modal-body">
              <p>
                This lead and its notes will be removed from the demo workspace.
              </p>
            </div>
            <div className="modal-foot">
              <button className="btn" onClick={() => setConfirmDelete(false)}>
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  deleteLead(lead.id);
                  router.push("/leads");
                }}
              >
                Delete lead
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
