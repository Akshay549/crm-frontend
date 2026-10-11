"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
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

export const StandalonePageContext = createContext<Dispatch<SetStateAction<boolean>> | null>(null);

export function useStandalonePage() {
  return useContext(StandalonePageContext);
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [standalone, setStandalone] = useState(false);

  return (
    <StandalonePageContext.Provider value={setStandalone}>
      {pathname === "/login" || standalone ? children : <Workspace>{children}</Workspace>}
    </StandalonePageContext.Provider>
  );
}

// Sidebar + top bar. Only used on pages that need a logged-in user.
function Workspace({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Who is logged in. A 401 here sends the user to the login page (see lib/axios.ts)
  const { data: me } = useApi(getMe, []);
  const user = me?.data.user;

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
                        <span
                          className="breadcrumb-separator"
                          aria-hidden="true"
                        >
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
                          <span
                            className="breadcrumb-current"
                            aria-current="page"
                          >
                            Leads
                          </span>
                        )}
                      </>
                    )}
                  </nav>
                </div>
              </div>

              <div className="topbar-user">
                <CircleUser className="avatar" />
                <span className="user-name">
                  {user ? `${user.name} | ${user.role}` : <Skeleton width={130} />}
                </span>
                <button
                  className="btn btn-small"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  aria-label="Log out"
                >
                  {loggingOut ? <Spinner /> : <LogOut size={14} />} Log out
                </button>
              </div>
            </header>

            <div className="main-content">{children}</div>
          </div>
        </div>
  );
}
