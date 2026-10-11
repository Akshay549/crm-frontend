// import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import "./globals.css";
// import { CRMProvider } from "@/context/CRMContext";
// import AppShell from "@/components/AppShell";

// const inter = Inter({
//   subsets: ["latin"],
//   display: "swap",
//   variable: "--font-inter",
// });

// export const metadata: Metadata = {
//   title: "EstateFlow CRM",
//   description: "Real estate lead management workspace",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         <CRMProvider>
//           <AppShell>{children}</AppShell>
//         </CRMProvider>
//       </body>
//     </html>
//   );
// }



import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { CRMProvider } from "@/context/CRMContext";
import AppShell from "@/components/AppShell";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "EstateFlow CRM",
  description: "Real estate lead management workspace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CRMProvider>
          <AppShell>{children}</AppShell>
        </CRMProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
