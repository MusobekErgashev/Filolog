import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import LayoutWrapper from "@/components/LayoutWrapper";

export const metadata = {
  title: "Filolog - Onlayn Ta'lim",
  description: "Qisqa muddatda Milliy sertifikat",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}