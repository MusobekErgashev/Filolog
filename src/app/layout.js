import "./globals.css";
import Header from "@/components/Header";
import Menu from "@/components/Menu";
import { Geist, Geist_Mono } from "next/font/google";

export const metadata = {
  title: "Filolog - Onlayn Ta'lim",
  description: "Qisqa muddatda Milliy sertifikat",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="h-screen w-full flex flex-col">
          <Header />
          <div className="flex-1 relative overflow-hidden">
            <Menu />
            <main className="h-full overflow-y-auto p-4 md:p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}