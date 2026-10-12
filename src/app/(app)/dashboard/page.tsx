"use client";
import Link from "next/link";
import type { ReactNode } from "react";
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
import ErrorState from "@/components/ErrorState";
import Skeleton, { TableSkeleton } from "@/components/Skeleton";
import { useApi } from "@/hooks/useApi";
import { getDashboardStats } from "@/services/dashboardService";
import { formatBudget, formatPhone, statusClass } from "@/lib/types";

const statusColors: Record<string, string> = {
  New: "#2253a3",
  Contacted: "#d99a24",
  "Site Visit": "#8064c9",
  Closed: "#16805d",
};

const recentHeaders = ["Lead", "Location", "Budget", "Status", "Created"];

function StatCard({
  label,
  value,
  foot,
  icon,
}: {
  label: string;
  value: string | number;
  foot: string;
  icon: ReactNode;
}) {
  return (
    <div className="panel stat">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div className="stat-label">{label}</div>
        {icon}
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-foot">{foot}</div>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="panel stat">
      <Skeleton width={90} height={12} />
      <Skeleton width={60} height={30} style={{ marginTop: 14 }} />
      <Skeleton width={140} height={11} style={{ marginTop: 14 }} />
    </div>
  );
}

export default function DashboardPage() {
  const { data: res, error, reload } = useApi(getDashboardStats, []);
  const stats = res?.data; // null while loading or after an error

  const sourceData = stats?.leadsBySource.filter((s) => s.count > 0) ?? [];
  const loading = !stats && !error;

  return (
    <main className="page">
      <div className="page-heading">
        <div>
          <h1>Dashboard</h1>
          <div className="subtle">
            A quick view of your real estate sales pipeline.
          </div>
        </div>
        {loading ? (
          <Skeleton width={128} height={34} radius={6} />
        ) : (
          <Link href="/leads" className="btn btn-small">
            View all leads <ArrowUpRight size={15} />
          </Link>
        )}
      </div>

      {error ? (
        <div className="panel">
          <ErrorState
            title="Couldn't load the dashboard"
            message={error.message}
            onRetry={reload}
          />
        </div>
      ) : (
        <>
          <div className="stat-grid">
            {!stats ? (
              Array.from({ length: 4 }, (_, i) => <StatCardSkeleton key={i} />)
            ) : (
              <>
                <StatCard
                  label="Total leads"
                  value={stats.totalLeads}
                  foot="All captured enquiries"
                  icon={<Users size={17} color="#2253a3" />}
                />
                <StatCard
                  label="Closed deals"
                  value={stats.closedDeals}
                  foot="Marked as successfully sold"
                  icon={<CheckCircle2 size={17} color="#16805d" />}
                />
                <StatCard
                  label="Conversion rate"
                  value={`${stats.conversionRate}%`}
                  foot="Closed deals ÷ total leads"
                  icon={<TrendingUp size={17} color="#16805d" />}
                />
                <StatCard
                  label="Site visits"
                  value={stats.siteVisits}
                  foot="Leads at visit stage"
                  icon={<CalendarClock size={17} color="#8064c9" />}
                />
              </>
            )}
          </div>

          <div className="dashboard-grid">
            <section className="panel chart-panel">
              <h2>Leads by source</h2>
              {!stats ? (
                <Skeleton height={260} />
              ) : sourceData.length === 0 ? (
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
              {!stats ? (
                <div style={{ display: "grid", gap: 16 }}>
                  <Skeleton height={14} />
                  {Array.from({ length: 4 }, (_, i) => (
                    <Skeleton key={i} height={16} />
                  ))}
                </div>
              ) : (
                <>
                  <div
                    className="segment-bar"
                    role="img"
                    aria-label={stats.statusDistribution
                      .map((s) => `${s.status}: ${s.count}`)
                      .join(", ")}
                  >
                    {stats.statusDistribution.map((s) => (
                      <div
                        key={s.status}
                        className="segment"
                        style={{
                          width: `${stats.totalLeads ? (s.count / stats.totalLeads) * 100 : 0}%`,
                          background: statusColors[s.status],
                        }}
                        title={`${s.status}: ${s.count}`}
                      />
                    ))}
                  </div>
                  <div className="legend-list">
                    {stats.statusDistribution.map((s) => (
                      <div className="legend-row" key={s.status}>
                        <span className="legend-label">
                          <span
                            className="dot"
                            style={{ background: statusColors[s.status] }}
                          />
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
                            {s.percentage}%
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
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

            {!stats ? (
              <TableSkeleton
                headers={recentHeaders}
                rows={5}
                className="custom_border"
              />
            ) : stats.recentLeads.length === 0 ? (
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
                      {recentHeaders.map((h) => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentLeads.map((l) => (
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
                          <span className={statusClass(l.status)}>
                            {l.status}
                          </span>
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
        </>
      )}
    </main>
  );
}
