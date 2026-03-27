import "./globals.css";
import Header from "@/components/Header";
import Menu from "@/components/Menu";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
          <div className="flex flex-col-reverse sm:flex-row flex-1 overflow-hidden">
            <Menu />
            <main className="flex-1 overflow-y-auto p-5">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}