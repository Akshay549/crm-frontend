"use client";
import Link from "next/link";
import { useMemo } from "react";
import {
  Users,
  CheckCircle2,
  TrendingUp,
  CalendarClock,
  ArrowUpRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useCRM } from "@/context/CRMContext";
import {
  formatBudget,
  formatPhone,
  statusClass,
  sources,
  statuses,
} from "@/lib/types";

const statusColors: Record<string, string> = {
  New: "#2253a3",
  Contacted: "#d99a24",
  "Site Visit": "#8064c9",
  Closed: "#16805d",
};

export default function DashboardPage() {
  const { leads } = useCRM();

  const closed = leads.filter((l) => l.status === "Closed").length;

  const conversion = leads.length
    ? Math.round((closed / leads.length) * 100)
    : 0;

  const sourceData = useMemo(
    () =>
      sources
        .map((source) => ({
          source,
          count: leads.filter((l) => l.source === source).length,
        }))
        .filter((x) => x.count > 0),
    [leads],
  );

  const statusData = statuses.map((status) => ({
    status,
    count: leads.filter((l) => l.status === status).length,
    color: statusColors[status],
    percent: leads.length
      ? (leads.filter((l) => l.status === status).length / leads.length) * 100
      : 0,
  }));

  const recent = [...leads]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  return (
    <main className="page">
      <div className="page-heading">
        <div>
          <h1>Dashboard ddd</h1>
          <div className="subtle">
            A quick view of your real estate sales pipeline.
          </div>
        </div>
        <Link href="/leads" className="btn btn-small">
          View all leads <ArrowUpRight size={15} />
        </Link>
      </div>

      <div className="stat-grid">
        <div className="panel stat">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div className="stat-label">Total leads</div>
            <Users size={17} color="#2253a3" />
          </div>
          <div className="stat-value">{leads.length}</div>
          <div className="stat-foot">All captured enquiries</div>
        </div>
        <div className="panel stat">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div className="stat-label">Closed deals</div>
            <CheckCircle2 size={17} color="#16805d" />
          </div>
          <div className="stat-value">{closed}</div>
          <div className="stat-foot">Marked as successfully sold</div>
        </div>
        <div className="panel stat">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div className="stat-label">Conversion rate</div>
            <TrendingUp size={17} color="#16805d" />
          </div>
          <div className="stat-value">{conversion}%</div>
          <div className="stat-foot">Closed deals ÷ total leads</div>
        </div>
        <div className="panel stat">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div className="stat-label">Site visits</div>
            <CalendarClock size={17} color="#8064c9" />
          </div>
          <div className="stat-value">
            {leads.filter((l) => l.status === "Site Visit").length}
          </div>
          <div className="stat-foot">Leads at visit stage</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="panel chart-panel">
          <h2>Leads by source</h2>
          {sourceData.length === 0 ? (
            <div className="empty-state">
              <h3>No source data yet</h3>
              <p>Add leads to see source performance.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={sourceData}
                margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e9edf3"
                />
                <XAxis
                  dataKey="source"
                  tick={{ fontSize: 11, fill: "#667085" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "#667085" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "#f5f7fa" }}
                  contentStyle={{
                    border: "1px solid #e3e7ee",
                    borderRadius: 6,
                    fontSize: 12,
                  }}
                />
                <Bar
                  dataKey="count"
                  name="Leads"
                  fill="#2253a3"
                  radius={[3, 3, 0, 0]}
                  maxBarSize={38}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </section>
        <section className="panel chart-panel">
          <h2>Status distribution</h2>
          <div
            className="segment-bar"
            role="img"
            aria-label={statusData
              .map((s) => `${s.status}: ${s.count}`)
              .join(", ")}
          >
            {statusData.map((s) => (
              <div
                key={s.status}
                className="segment"
                style={{ width: `${s.percent}%`, background: s.color }}
                title={`${s.status}: ${s.count}`}
              />
            ))}
          </div>
          <div className="legend-list">
            {statusData.map((s) => (
              <div className="legend-row" key={s.status}>
                <span className="legend-label">
                  <span className="dot" style={{ background: s.color }} />
                  {s.status}
                </span>
                <span
                  style={{
                    fontWeight: 700,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {s.count}
                  <span
                    className="subtle"
                    style={{ marginLeft: 8, fontWeight: 400 }}
                  >
                    {Math.round(s.percent)}%
                  </span>
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="panel recent-panel">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            marginBottom: 15,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 14 }}>Recently added leads</h2>
      
        </div>

        {recent.length === 0 ? (
          <div className="empty-state">
            <h3>No leads yet</h3>
            <p>New enquiries will appear here.</p>
            <Link href="/leads" className="btn btn-primary">
              Add a lead
            </Link>
          </div>
        ) : (
          <div className="table-scroll">
            <table className="custom_border">
              <thead>
                <tr>
                  <th>Lead</th>
                  <th>Location</th>
                  <th>Budget</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((l) => (
                  <tr key={l.id}>
                    <td>
                      <Link className="lead-name" href={`/leads/${l.id}`}>
                        {l.name}
                      </Link>
                      <div
                        className="subtle"
                        style={{ fontSize: 11, marginTop: 3 }}
                      >
                        {formatPhone(l.phone)}
                      </div>
                    </td>
                    <td>{l.location}</td>
                    <td className="money">{formatBudget(l.budget)}</td>
                    <td>
                      <span className={statusClass(l.status)}>{l.status}</span>
                    </td>
                    <td>
                      {new Date(l.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
