import Image from "next/image";
import logo from "@/app/assets/logo.png";

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
