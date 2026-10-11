import Image from "next/image";
import logo from "@/app/assets/logo.png";

// A static import gives Next the real width and height, so the aspect ratio is kept
// and nothing jumps while the image loads. The CSS class sets the displayed size.
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Image
      src={logo}
      alt="EstateFlow CRM"
      priority
      sizes="(max-width: 760px) 140px, 170px"
      className={`logo ${className}`}
    />
  );
}
