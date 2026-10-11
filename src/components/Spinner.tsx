import { LoaderCircle } from "lucide-react";

export default function Spinner({ size = 14 }: { size?: number }) {
  return <LoaderCircle className="spin" size={size} aria-hidden="true" />;
}
