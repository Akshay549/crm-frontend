import type { CSSProperties } from "react";

type SkeletonProps = {
  width?: number | string;
  height?: number | string;
  radius?: number;
  style?: CSSProperties;
};

export default function Skeleton({
  width = "100%",
  height = 14,
  radius = 5,
  style,
}: SkeletonProps) {
  return (
    <span
      className="skeleton"
      style={{ width, height, borderRadius: radius, ...style }}
      aria-hidden="true"
    />
  );
}

type TableSkeletonProps = {
  headers: string[];
  rows?: number;
  className?: string;
};

export function TableSkeleton({
  headers,
  rows = 6,
  className,
}: TableSkeletonProps) {
  return (
    <div className="table-scroll" aria-busy="true" aria-label="Loading">
      <table className={className}>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }, (_, row) => (
            <tr key={row}>
              {headers.map((header, col) => (
                <td key={header}>
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
