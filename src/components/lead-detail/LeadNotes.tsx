"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { MessageSquare, Send } from "lucide-react";
import ErrorState from "@/components/ErrorState";
import Skeleton from "@/components/Skeleton";
import Spinner from "@/components/Spinner";
import { useApi } from "@/hooks/useApi";
import { addNote, getNotes } from "@/services/leadService";
import { toApiError } from "@/lib/api-error";
import { formatDateTime } from "@/lib/format";
import type { LeadNote } from "@/lib/types";

const NOTE_MAX_LENGTH = 1000;

function NotesList({ notes }: { notes: LeadNote[] }) {
  if (notes.length === 0) {
    return (
      <div className="lead-notes-empty">
        <MessageSquare size={16} />
        <span>No notes yet. Your first note will appear here.</span>
      </div>
    );
  }

  return (
    <div className="lead-notes-list">
      {notes.map((note) => (
        <article className="lead-note" key={note.id}>
          <div className="lead-note-meta">
            <span>{note.authorName}</span>
            <span>{formatDateTime(note.createdAt)}</span>
          </div>
          <div className="lead-note-text">{note.text}</div>
        </article>
      ))}
    </div>
  );
}

export default function LeadNotes({ leadId }: { leadId: string }) {
  const { data, error, loading, update, reload } = useApi(
    () => getNotes(leadId),
    [leadId],
  );
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);

  const notes = data?.data.notes ?? [];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || adding) return;

    setAdding(true);
    try {
      const response = await addNote(leadId, trimmed);
      toast.success(response.message);
      setText("");
      if (data) {
        update({ ...data, data: { notes: [response.data.note, ...notes] } });
      } else {
        reload();
      }
    } catch (err) {
      toast.error(toApiError(err).message);
    } finally {
      setAdding(false);
    }
  }

  return (
    <aside className="panel lead-card">
      <div className="lead-notes-head">
        <MessageSquare size={16} />
        <h2>Notes &amp; activity</h2>
        {notes.length > 0 && (
          <span className="lead-notes-count">{notes.length}</span>
        )}
      </div>

      <form className="lead-notes-form" onSubmit={handleSubmit}>
        <label htmlFor="note-input" className="sr-only">
          Add a note
        </label>
        <textarea
          id="note-input"
          className="field-control"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Log a call, preference or next step…"
          rows={2}
          maxLength={NOTE_MAX_LENGTH}
          disabled={adding}
        />
        <div className="lead-notes-foot">
          <span className="lead-notes-chars">
            {text.length > 0 && `${text.length}/${NOTE_MAX_LENGTH}`}
          </span>
          <button
            className="btn btn-primary"
            type="submit"
            disabled={!text.trim() || adding}
          >
            {adding ? <Spinner /> : <Send size={14} />}
            {adding ? "Adding…" : "Add note"}
          </button>
        </div>
      </form>

      {error ? (
        <ErrorState
          title="Couldn't load notes"
          message={error.message}
          onRetry={reload}
          className="lead-notes-error"
        />
      ) : loading ? (
        <div className="lead-notes-list">
          <Skeleton height={56} radius={6} />
          <Skeleton height={56} radius={6} />
        </div>
      ) : (
        <NotesList notes={notes} />
      )}
    </aside>
  );
}