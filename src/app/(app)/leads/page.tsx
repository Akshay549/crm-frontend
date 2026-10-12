"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  Plus,
  Search,
  ArrowUpDown,
  Eye,
  Edit2,
  Trash2,
  Users,
} from "lucide-react";
import LeadForm from "@/components/LeadForm";
import ErrorState from "@/components/ErrorState";
import Spinner from "@/components/Spinner";
import Skeleton, { TableSkeleton } from "@/components/Skeleton";
import { useApi } from "@/hooks/useApi";
import { useDebounce } from "@/hooks/useDebounce";
import {
  createLead,
  deleteLead,
  getLeads,
  updateLead,
} from "@/services/leadService";
import { toApiError } from "@/lib/api-error";
import {
  formatBudget,
  formatPhone,
  statusClass,
  sources,
  statuses,
  type Lead,
  type LeadInput,
} from "@/lib/types";

const PAGE_SIZE = 10;
const ALL_SOURCES = "All sources";
const ALL_STATUSES = "All statuses";
const DEFAULT_SORT = "date-desc";

const apiSort: Record<string, string> = {
  "date-desc": "newest",
  "date-asc": "oldest",
  "budget-desc": "budget_desc",
  "budget-asc": "budget_asc",
};

const tableHeaders = [
  "Lead",
  "Contact",
  "Budget",
  "Location",
  "Source",
  "Status",
  "Added",
  "Actions",
];

function ToolbarSkeleton() {
  return (
    <div className="toolbar" aria-hidden="true">
      <div className="search-wrap">
        <Skeleton height={36} radius={6} />
      </div>
      <Skeleton width={130} height={36} radius={6} />
      <Skeleton width={130} height={36} radius={6} />
      <Skeleton width={150} height={36} radius={6} />
    </div>
  );
}

function LeadsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const source = params.get("source") ?? ALL_SOURCES;
  const status = params.get("status") ?? ALL_STATUSES;
  const sort = params.get("sort") ?? DEFAULT_SORT;
  const page = Math.max(1, Number(params.get("page")) || 1);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Lead | undefined>();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [searchText, setSearchText] = useState(q);
  const debouncedSearch = useDebounce(searchText);

  function setParam(key: string, value: string) {
    const p = new URLSearchParams(params.toString());
    if (
      value &&
      value !== ALL_SOURCES &&
      value !== ALL_STATUSES &&
      value !== DEFAULT_SORT &&
      value !== "1"
    )
      p.set(key, value);
    else p.delete(key);
    if (key !== "page") p.delete("page");
    router.push(`${pathname}?${p.toString()}`, { scroll: false });
  }

  useEffect(() => {
    if (debouncedSearch !== q) setParam("q", debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const {
    data: res,
    error,
    loading,
    initialLoading,
    reload,
  } = useApi(
    () =>
      getLeads({
        search: q.trim() || undefined,
        source: source === ALL_SOURCES ? undefined : source,
        status: status === ALL_STATUSES ? undefined : status,
        sort: apiSort[sort] ?? "newest",
        page,
        limit: PAGE_SIZE,
      }),
    [q, source, status, sort, page],
  );

  const leads = res?.data.leads ?? [];
  const totalPages = res?.data.pagination.totalPages ?? 1;
  const budgetSort = !sort.startsWith("budget")
    ? "none"
    : sort === "budget-asc"
      ? "ascending"
      : "descending";
  const hasFilters =
    Boolean(q.trim()) || source !== ALL_SOURCES || status !== ALL_STATUSES;

  function clearFilters() {
    setSearchText("");
    router.push("/leads");
  }

  async function handleSave(values: LeadInput) {
    const response = editing
      ? await updateLead(editing.id, values)
      : await createLead(values);
    toast.success(response.message);
    reload();
  }

  async function handleDelete() {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      const response = await deleteLead(confirmDelete);
      toast.success(response.message);
      setConfirmDelete(null);
      if (leads.length === 1 && page > 1) setParam("page", String(page - 1));
      else reload();
    } catch (err) {
      toast.error(toApiError(err).message);
    } finally {
      setDeleting(false);
    }
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
        {initialLoading ? (
          <Skeleton width={112} height={38} radius={6} />
        ) : (
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditing(undefined);
              setFormOpen(true);
            }}
          >
            <Plus size={16} /> Add lead
          </button>
        )}
      </div>

      <div className="panel">
        {initialLoading ? (
          <ToolbarSkeleton />
        ) : (
          <div className="toolbar">
            <div className="search-wrap">
              <Search className="search-icon" size={16} />
              <input
                className="field-control"
                aria-label="Search by name or phone"
                placeholder="Search name or phone…"
                maxLength={50}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <select
              className="field-control"
              aria-label="Filter by source"
              value={source}
              onChange={(e) => setParam("source", e.target.value)}
            >
              <option>{ALL_SOURCES}</option>
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
              <option>{ALL_STATUSES}</option>
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
        )}

        {error ? (
          <ErrorState
            title="Couldn't load leads"
            message={error.message}
            onRetry={reload}
          />
        ) : loading ? (
          <TableSkeleton headers={tableHeaders} />
        ) : leads.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Users size={20} />
            </div>
            <h3>{hasFilters ? "No matching leads" : "No leads yet"}</h3>
            <p>
              {hasFilters
                ? "Try changing your search or filters."
                : "Add your first lead to start building your pipeline."}
            </p>
            {hasFilters ? (
              <button className="btn" onClick={clearFilters}>
                Clear filters
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => setFormOpen(true)}
              >
                <Plus size={15} /> Add your first lead
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
                    <th aria-sort={budgetSort}>
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
                  {leads.map((lead) => (
                    <tr key={lead.id}>
                      <td>
                        <Link className="lead-name" href={`/leads/${lead.id}`}>
                          {lead.name}
                        </Link>
                        <div
                          className="subtle"
                          style={{ fontSize: 11, marginTop: 4 }}
                        >
                          {lead.leadId} · {lead.propertyType}
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
                  disabled={page <= 1}
                  onClick={() => setParam("page", String(page - 1))}
                  aria-label="Previous page"
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    className={page === i + 1 ? "current" : ""}
                    onClick={() => setParam("page", String(i + 1))}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={page >= totalPages}
                  onClick={() => setParam("page", String(page + 1))}
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
          onSave={handleSave}
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
              <button
                className="btn"
                onClick={() => setConfirmDelete(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting && <Spinner />}
                {deleting ? "Deleting…" : "Delete lead"}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default function LeadsPage() {
  return (
    <Suspense
      fallback={
        <main className="page">
          <div className="panel">
            <ToolbarSkeleton />
            <TableSkeleton headers={tableHeaders} />
          </div>
        </main>
      }
    >
      <LeadsContent />
    </Suspense>
  );
}
