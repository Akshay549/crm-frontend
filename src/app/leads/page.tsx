"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Plus,
  Search,
  ArrowUpDown,
  Eye,
  Edit2,
  Trash2,
  RefreshCw,
  Users,
} from "lucide-react";
import { useCRM } from "@/context/CRMContext";
import LeadForm from "@/components/LeadForm";
import {
  formatBudget,
  formatPhone,
  statusClass,
  sources,
  statuses,
  type Lead,
} from "@/lib/types";

export default function LeadsPage() {
  const { leads, addLead, updateLead, deleteLead } = useCRM();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const source = params.get("source") ?? "All sources";
  const status = params.get("status") ?? "All statuses";
  const sort = params.get("sort") ?? "date-desc";
  const page = Math.max(1, Number(params.get("page") ?? 1));
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Lead | undefined>();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [loading, setLoading] = useState(false);

  function setParam(key: string, value: string) {
    const p = new URLSearchParams(params.toString());
    if (
      value &&
      value !== "All sources" &&
      value !== "All statuses" &&
      value !== "date-desc" &&
      value !== "1"
    )
      p.set(key, value);
    else p.delete(key);
    if (key !== "page") p.delete("page");
    router.push(`${pathname}?${p.toString()}`, { scroll: false });
  }

  const filtered = useMemo(() => {
    let data = [...leads];
    if (q.trim()) {
      const term = q.toLowerCase();
      data = data.filter(
        (l) => l.name.toLowerCase().includes(term) || l.phone.includes(term),
      );
    }
    if (source !== "All sources")
      data = data.filter((l) => l.source === source);
    if (status !== "All statuses")
      data = data.filter((l) => l.status === status);
    data.sort((a, b) =>
      sort === "budget-asc"
        ? a.budget - b.budget
        : sort === "budget-desc"
          ? b.budget - a.budget
          : sort === "date-asc"
            ? a.createdAt.localeCompare(b.createdAt)
            : b.createdAt.localeCompare(a.createdAt),
    );
    return data;
  }, [leads, q, source, status, sort]);

  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const shown = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  function save(data: Parameters<typeof addLead>[0]) {
    if (editing) {
      if (
        leads.some(
          (l) =>
            l.id !== editing.id &&
            l.phone.replace(/\D/g, "") === data.phone.replace(/\D/g, ""),
        )
      )
        return "This phone number already exists.";
      updateLead(editing.id, data);
      setEditing(undefined);
      return null;
    }
    return addLead(data);
  }

  return (
    <main className="page">
      <div className="page-heading">
        <div>
          <h1>Leads</h1>
          <div className="subtle">
            Manage enquiries and keep every opportunity moving.
          </div>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditing(undefined);
            setFormOpen(true);
          }}
        >
          <Plus size={16} /> Add lead
        </button>
      </div>

      <div className="panel">
        <div className="toolbar">
          <div className="search-wrap">
            <Search className="search-icon" size={16} />
            <input
              className="field-control"
              aria-label="Search by name or phone"
              placeholder="Search name or phone…"
              value={q}
              onChange={(e) => setParam("q", e.target.value)}
            />
          </div>
          <select
            className="field-control"
            aria-label="Filter by source"
            value={source}
            onChange={(e) => setParam("source", e.target.value)}
          >
            <option>All sources</option>
            {sources.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <select
            className="field-control"
            aria-label="Filter by status"
            value={status}
            onChange={(e) => setParam("status", e.target.value)}
          >
            <option>All statuses</option>
            {statuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <select
            className="field-control"
            aria-label="Sort leads"
            value={sort}
            onChange={(e) => setParam("sort", e.target.value)}
          >
            <option value="date-desc">Newest first</option>
            <option value="date-asc">Oldest first</option>
            <option value="budget-desc">Budget: high to low</option>
            <option value="budget-asc">Budget: low to high</option>
          </select>
        </div>
        {loadError ? (
          <div className="error-box">
            <h3>Couldn't load leads</h3>
            <p>Please try again.</p>
            <button
              className="btn"
              onClick={() => {
                setLoadError(false);
                setLoading(true);
                setTimeout(() => setLoading(false), 350);
              }}
            >
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        ) : loading ? (
          <div style={{ padding: 18, display: "grid", gap: 12 }}>
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                style={{ height: 39, background: "#f0f2f5", borderRadius: 5 }}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Users size={20} />
            </div>
            <h3>{leads.length === 0 ? "No leads yet" : "No matching leads"}</h3>
            <p>
              {leads.length === 0
                ? "Add your first lead to start building your pipeline."
                : "Try changing your search or filters."}
            </p>
            {leads.length === 0 ? (
              <button
                className="btn btn-primary"
                onClick={() => setFormOpen(true)}
              >
                <Plus size={15} /> Add your first lead
              </button>
            ) : (
              <button className="btn" onClick={() => router.push("/leads")}>
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Lead</th>
                    <th>Contact</th>
                    <th>
                      <button
                        className="sort-button"
                        onClick={() =>
                          setParam(
                            "sort",
                            sort === "budget-desc"
                              ? "budget-asc"
                              : "budget-desc",
                          )
                        }
                        aria-sort={
                          sort.startsWith("budget")
                            ? sort === "budget-asc"
                              ? "ascending"
                              : "descending"
                            : "none"
                        }
                      >
                        Budget <ArrowUpDown size={12} />
                      </button>
                    </th>
                    <th>Location</th>
                    <th>Source</th>
                    <th>Status</th>
                    <th>Added</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map((lead) => (
                    <tr key={lead.id}>
                      <td>
                        <Link className="lead-name" href={`/leads/${lead.id}`}>
                          {lead.name}
                        </Link>
                        <div
                          className="subtle"
                          style={{ fontSize: 11, marginTop: 4 }}
                        >
                          {lead.id} · {lead.propertyType}
                        </div>
                      </td>
                      <td className="contact-cell">
                        <div>{formatPhone(lead.phone)}</div>
                        <div className="subtle" style={{ fontSize: 11 }}>
                          {lead.email || "No email"}
                        </div>
                      </td>
                      <td className="money">{formatBudget(lead.budget)}</td>
                      <td>{lead.location}</td>
                      <td>
                        <span className="badge source-badge">
                          {lead.source}
                        </span>
                      </td>
                      <td>
                        <span className={statusClass(lead.status)}>
                          {lead.status}
                        </span>
                      </td>
                      <td>
                        {new Date(lead.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "2-digit",
                        })}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 5 }}>
                          <Link
                            className="btn btn-small"
                            href={`/leads/${lead.id}`}
                            aria-label={`View ${lead.name}`}
                          >
                            <Eye size={14} />
                          </Link>
                          <button
                            className="btn btn-small"
                            onClick={() => {
                              setEditing(lead);
                              setFormOpen(true);
                            }}
                            aria-label={`Edit ${lead.name}`}
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            className="btn btn-small btn-danger"
                            onClick={() => setConfirmDelete(lead.id)}
                            aria-label={`Delete ${lead.name}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="table-footer">
              <span></span>
              <div className="pagination">
                <button
                  disabled={safePage <= 1}
                  onClick={() => setParam("page", String(safePage - 1))}
                  aria-label="Previous page"
                >
                  ‹
                </button>
                {Array.from({ length: pageCount }, (_, i) => (
                  <button
                    key={i}
                    className={safePage === i + 1 ? "current" : ""}
                    onClick={() => setParam("page", String(i + 1))}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={safePage >= pageCount}
                  onClick={() => setParam("page", String(safePage + 1))}
                  aria-label="Next page"
                >
                  ›
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {formOpen && (
        <LeadForm
          lead={editing}
          onClose={() => {
            setFormOpen(false);
            setEditing(undefined);
          }}
          onSave={save}
        />
      )}

      {confirmDelete && (
        <div className="overlay">
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            style={{ maxWidth: 420 }}
          >
            <div className="modal-head">
              <h2 id="delete-title">Delete this lead?</h2>
            </div>
            <div className="modal-body">
              <p style={{ margin: 0, color: "#667085", lineHeight: 1.6 }}>
                This will remove the lead and its notes from this demo
                workspace. This action cannot be undone.
              </p>
            </div>
            <div className="modal-foot">
              <button className="btn" onClick={() => setConfirmDelete(null)}>
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  deleteLead(confirmDelete);
                  setConfirmDelete(null);
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
