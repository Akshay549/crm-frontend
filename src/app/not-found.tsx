"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import { useEffect } from "react";
import { useStandalonePage } from "@/components/AppShell";

export default function NotFound() {
  const setStandalone = useStandalonePage();

  useEffect(() => {
    setStandalone?.(true);

    return () => {
      setStandalone?.(false);
    };
  }, [setStandalone]);

  return (
    <main className="login-screen" style={{ gridTemplateColumns: "1fr" }}>
      <section
        className="login-main"
        style={{ minHeight: "100vh", textAlign: "center" }}
      >
        <div
          className="login-box"
          style={{ width: "min(440px, 100%)", margin: "0 auto" }}
        >
          <div
            style={{
              fontSize: "64px",
              fontWeight: 750,
              color: "var(--accent)",
              letterSpacing: "-2px",
              lineHeight: 1,
              marginBottom: "12px",
            }}
          >
            404
          </div>

          <h2>Page not found</h2>

          <p>
            The page you are looking for doesn’t exist or has been moved to
            another URL.
          </p>

          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "center",
              marginTop: "24px",
            }}
          >
            <Link
              href="/dashboard"
              className="btn btn-primary"
              style={{ flex: 1 }}
            >
              <Home size={16} />
              Go to Dashboard
            </Link>
          </div>

          <div className="demo-note" style={{ textAlign: "left" }}>
            <strong style={{ color: "#344054" }}>Need assistance?</strong>
            <br />
            Check if the URL is typed correctly, or head back to your active
            workspace dashboard to manage your enquiries and site visits.
          </div>
        </div>
      </section>
    </main>
  );
}
