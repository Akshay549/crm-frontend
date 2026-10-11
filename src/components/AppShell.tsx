// "use client";

// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   type Dispatch,
//   type SetStateAction,
// } from "react";
// import {
//   Building2,
//   LayoutDashboard,
//   Funnel,
//   LogOut,
//   Menu,
//   X,
//   CircleUser,
// } from "lucide-react";

// export const StandalonePageContext = createContext<Dispatch<SetStateAction<boolean>> | null>(null);

// export function useStandalonePage() {
//   return useContext(StandalonePageContext);
// }

// export default function AppShell({ children }: { children: React.ReactNode }) {
//   const pathname = usePathname();
//   const router = useRouter();
//   const [open, setOpen] = useState(false);
//   const [standalone, setStandalone] = useState(false);

//   const nav = [
//     { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
//     { href: "/leads", label: "Leads", icon: Funnel },
//   ];

//   const sidebar = (
//     <aside className={`sidebar ${open ? "open" : ""}`}>
//       <Link href="/dashboard" className="brand" onClick={() => setOpen(false)}>
//         <span className="brand-mark">
//           <Building2 size={17} />
//         </span>
//         EstateFlow{" "}
//         <span style={{ fontSize: 10, color: "#8a93a2", fontWeight: 500 }}>
//           CRM
//         </span>
//       </Link>

//       <nav className="nav">
//         {nav.map((item) => {
//           const Icon = item.icon;
//           const active =
//             pathname === item.href ||
//             (pathname.startsWith("/leads/") && item.href === "/leads");

//           return (
//             <Link
//               key={item.href}
//               href={item.href}
//               className={active ? "active" : ""}
//               onClick={() => setOpen(false)}
//             >
//               <Icon size={17} />
//               {item.label}
//             </Link>
//           );
//         })}
//       </nav>

//       <div className="side-foot">
//         REAL ESTATE SALES
//         <br />
//         <span>Workspace · Demo</span>
//       </div>
//     </aside>
//   );

//   return (
//     <StandalonePageContext.Provider value={setStandalone}>
//       {pathname === "/login" || standalone ? (
//         children
//       ) : (
//         <div className="app-shell">
//           {sidebar}

//           <div
//             className={`mobile-overlay ${open ? "show" : ""}`}
//             onClick={() => setOpen(false)}
//           />

//           <div className="main-area">
//             <header className="topbar">
//               <div style={{ display: "flex", alignItems: "center" }}>
//                 <button
//                   className="mobile-menu"
//                   aria-label={open ? "Close navigation" : "Open navigation"}
//                   onClick={() => setOpen(!open)}
//                 >
//                   {open ? <X size={20} /> : <Menu size={20} />}
//                 </button>

//                 <div className="topbar-heading">
//                   <nav className="breadcrumb" aria-label="Breadcrumb">
//                     <Link href="/dashboard" className="breadcrumb-link">
//                       Dashboard
//                     </Link>

//                     {pathname !== "/dashboard" && (
//                       <>
//                         <span
//                           className="breadcrumb-separator"
//                           aria-hidden="true"
//                         >
//                           /
//                         </span>

//                         {pathname.startsWith("/leads/") ? (
//                           <>
//                             <Link href="/leads" className="breadcrumb-link">
//                               Leads
//                             </Link>
//                             <span
//                               className="breadcrumb-separator"
//                               aria-hidden="true"
//                             >
//                               /
//                             </span>
//                             <span
//                               className="breadcrumb-current"
//                               aria-current="page"
//                             >
//                               Lead details
//                             </span>
//                           </>
//                         ) : (
//                           <span
//                             className="breadcrumb-current"
//                             aria-current="page"
//                           >
//                             Leads
//                           </span>
//                         )}
//                       </>
//                     )}
//                   </nav>
//                 </div>
//               </div>

//               <div className="topbar-user">
//                 <CircleUser className="avatar" />
//                 <span className="user-name">Akshay | Sales Executive</span>
//                 <button
//                   className="btn btn-small"
//                   onClick={() => router.push("/login")}
//                   aria-label="Log out"
//                 >
//                   <LogOut size={14} /> Log out
//                 </button>
//               </div>
//             </header>

//             <div className="main-content">{children}</div>
//           </div>
//         </div>
//       )}
//     </StandalonePageContext.Provider>
//   );
// }


"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  Building2,
  LayoutDashboard,
  Funnel,
  LogOut,
  Menu,
  X,
  CircleUser,
} from "lucide-react";
import {
  clearUser,
  getStoredUser,
  parseUser,
  subscribeUser,
} from "@/lib/auth-storage";

export const StandalonePageContext = createContext<Dispatch<SetStateAction<boolean>> | null>(null);

export function useStandalonePage() {
  return useContext(StandalonePageContext);
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [standalone, setStandalone] = useState(false);

  // Logged-in user (name + role) saved at login. Empty on the server render.
  const rawUser = useSyncExternalStore(subscribeUser, getStoredUser, () => null);
  const user = useMemo(() => parseUser(rawUser), [rawUser]);

  function handleLogout() {
    // TODO: call POST /auth/logout once that endpoint is built
    clearUser();
    router.push("/login");
  }

  const nav = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/leads", label: "Leads", icon: Funnel },
  ];

  const sidebar = (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <Link href="/dashboard" className="brand" onClick={() => setOpen(false)}>
        <span className="brand-mark">
          <Building2 size={17} />
        </span>
        EstateFlow{" "}
        <span style={{ fontSize: 10, color: "#8a93a2", fontWeight: 500 }}>
          CRM
        </span>
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
    <StandalonePageContext.Provider value={setStandalone}>
      {pathname === "/login" || standalone ? (
        children
      ) : (
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
                  {user ? `${user.name} | ${user.role}` : ""}
                </span>
                <button
                  className="btn btn-small"
                  onClick={handleLogout}
                  aria-label="Log out"
                >
                  <LogOut size={14} /> Log out
                </button>
              </div>
            </header>

            <div className="main-content">{children}</div>
          </div>
        </div>
      )}
    </StandalonePageContext.Provider>
  );
}

