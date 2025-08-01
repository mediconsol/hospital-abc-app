import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { UtilitySidebar } from "@/components/utility-sidebar";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "병원 ABC 시스템",
  description: "병원 활동기준원가 계산 및 관리 시스템",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex h-screen bg-background relative">
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <Topbar />
              <main className="flex-1 overflow-auto bg-main-content">
                {children}
              </main>
            </div>
            <UtilitySidebar />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
