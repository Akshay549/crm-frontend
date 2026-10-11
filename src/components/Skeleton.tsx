import type { CSSProperties } from "react";

type SkeletonProps = {
  width?: number | string;
  height?: number | string;
  style?: CSSProperties;
};

export default function Skeleton({ width = "100%", height = 14, style }: SkeletonProps) {
  return <span className="skeleton" style={{ width, height, ...style }} aria-hidden="true" />;
}

// Placeholder rows that use the real table headers, so the layout does not jump when data arrives
export function TableSkeleton({
  headers,
  rows = 6,
  className,
}: {
  headers: string[];
  rows?: number;
  className?: string;
}) {
  return (
    <div className="table-scroll" aria-busy="true" aria-label="Loading">
      <table className={className}>
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }, (_, row) => (
            <tr key={row}>
              {headers.map((h, col) => (
                <td key={h}>
                  <Skeleton width={col === 0 ? "75%" : "55%"} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
