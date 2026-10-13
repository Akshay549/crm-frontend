import Skeleton from "@/components/Skeleton";

export default function LeadDetailSkeleton() {
  return (
    <main className="page" aria-busy="true">
      <div className="page-heading lead-heading">
        <div>
          <Skeleton width={240} height={30} />
          <Skeleton width={190} height={13} style={{ marginTop: 10 }} />
        </div>
        <div className="lead-actions">
          <Skeleton width={84} height={36} radius={6} />
          <Skeleton width={92} height={36} radius={6} />
        </div>
      </div>

      <div className="lead-grid">
        <section className="panel lead-card">
          <div className="lead-card-head">
            <div>
              <Skeleton width={150} height={18} />
              <Skeleton width={210} height={12} style={{ marginTop: 8 }} />
            </div>
            <Skeleton width={200} height={36} radius={6} />
          </div>
          <div className="lead-info-grid">
            {Array.from({ length: 6 }, (_, i) => (
              <div className="lead-info-field" key={i}>
                <Skeleton width={90} height={12} />
                <Skeleton width="70%" height={18} style={{ marginTop: 10 }} />
              </div>
            ))}
          </div>
        </section>

        <aside className="panel lead-card">
          <Skeleton width={150} height={18} />
          <Skeleton height={64} radius={6} style={{ marginTop: 14 }} />
          <div className="lead-notes-foot">
            <span />
            <Skeleton width={104} height={36} radius={6} />
          </div>
          <div className="lead-notes-list">
            <Skeleton height={56} radius={6} />
            <Skeleton height={56} radius={6} />
          </div>
        </aside>
      </div>
    </main>
  );
}