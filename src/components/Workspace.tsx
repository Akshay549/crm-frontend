"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  LayoutDashboard,
  Funnel,
  LogOut,
  Menu,
  X,
  CircleUser,
} from "lucide-react";
import Logo from "@/components/Logo";
import Skeleton from "@/components/Skeleton";
import Spinner from "@/components/Spinner";
import { useApi } from "@/hooks/useApi";
import { getMe, logout } from "@/services/authService";
import { toApiError } from "@/lib/api-error";

export default function Workspace({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const { data: me, error: meError } = useApi(getMe, []);
  const user = me?.data.user;
  const userLoading = !me && !meError;

  async function handleLogout() {
    setLoggingOut(true);
    try {
      const res = await logout();
      toast.success(res.message);
      router.push("/login");
    } catch (error) {
      toast.error(toApiError(error).message);
      setLoggingOut(false);
    }
  }

  const nav = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/leads", label: "Leads", icon: Funnel },
  ];

  const sidebar = (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <Link href="/dashboard" className="brand" onClick={() => setOpen(false)}>
        <Logo className="logo-sidebar" />
      </Link>

      <nav className="nav">
        {nav.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (pathname.startsWith("/leads/") && item.href === "/leads");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={active ? "active" : ""}
              onClick={() => setOpen(false)}
            >
              <Icon size={17} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="side-foot">
        REAL ESTATE SALES
        <br />
        <span>Workspace · Demo</span>
      </div>
    </aside>
  );

  return (
    <div className="app-shell">
      {sidebar}

      <div
        className={`mobile-overlay ${open ? "show" : ""}`}
        onClick={() => setOpen(false)}
      />

      <div className="main-area">
        <header className="topbar">
          <div style={{ display: "flex", alignItems: "center" }}>
            <button
              className="mobile-menu"
              aria-label={open ? "Close navigation" : "Open navigation"}
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className="topbar-heading">
              <nav className="breadcrumb" aria-label="Breadcrumb">
                <Link href="/dashboard" className="breadcrumb-link">
                  Dashboard
                </Link>

                {pathname !== "/dashboard" && (
                  <>
                    <span className="breadcrumb-separator" aria-hidden="true">
                      /
                    </span>

                    {pathname.startsWith("/leads/") ? (
                      <>
                        <Link href="/leads" className="breadcrumb-link">
                          Leads
                        </Link>
                        <span
                          className="breadcrumb-separator"
                          aria-hidden="true"
                        >
                          /
                        </span>
                        <span
                          className="breadcrumb-current"
                          aria-current="page"
                        >
                          Lead details
                        </span>
                      </>
                    ) : (
                      <span className="breadcrumb-current" aria-current="page">
                        Leads
                      </span>
                    )}
                  </>
                )}
              </nav>
            </div>
          </div>

          <div className="topbar-user">
            {userLoading ? (
              <>
                <Skeleton width={24} height={24} radius={12} />
                <Skeleton width={130} height={14} />
                <Skeleton width={84} height={30} radius={6} />
              </>
            ) : (
              <>
                <CircleUser className="avatar" />
                <span className="user-name">
                  {user ? `${user.name} | ${user.role}` : ""}
                </span>
                <button
                  className="btn btn-small"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  aria-label="Log out"
                >
                  {loggingOut ? <Spinner /> : <LogOut size={14} />} Log out
                </button>
              </>
            )}
          </div>
        </header>

        <div className="main-content">{children}</div>
      </div>
    </div>
  );
}
