'use client'

import Header from "@/components/Header";
import Menu from "@/components/Menu";
import GlobalSessionTracker from "@/components/GlobalSessionTracker";
import { usePathname } from "next/navigation";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";
  const isAuthPage = pathname === "/auth";

  // Hide sidebar/header on landing and auth pages
  const hideLayout = isLandingPage || isAuthPage;

  return (
    <>
      {hideLayout ? (
        <main className="min-h-screen">
          {children}
        </main>
      ) : (
        <div className="h-screen w-full flex flex-col">
          <GlobalSessionTracker />
          <Header />
          <div className="flex-1 relative overflow-hidden">
            <Menu />
            <main className="h-full overflow-y-auto p-4 md:p-6">
              {children}
            </main>
          </div>
        </div>
      )}
    </>
  );
}
