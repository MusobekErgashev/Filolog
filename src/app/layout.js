import "./globals.css";
import Header from "@/components/Header";
import Menu from "@/components/Menu";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="h-screen w-full flex flex-col">
          <Header />
          <div className="flex flex-1 overflow-hidden">
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