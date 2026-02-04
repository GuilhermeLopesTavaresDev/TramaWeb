import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TramaWeb - Seu Clube do Livro",
  description: "Leia, debata e viva cada página.",
};

import { ToastProvider } from "@/context/ToastContext";
import { ChatProvider } from "@/context/ChatContext";
import { SocketProvider } from "@/context/SocketContext";
import Sidebar from "@/components/Sidebar";
import PrivateChatOverlay from "@/components/PrivateChatOverlay";
import { LayoutProvider, useLayout } from "@/context/LayoutContext";

function MainLayout({ children }: { children: React.ReactNode }) {
  const { isSidebarOpen, closeSidebar } = useLayout();
  return (
    <div className="flex">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <div className="flex-1 w-full overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7069836205314537"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastProvider>
          <SocketProvider>
            <ChatProvider>
              <LayoutProvider>
                <MainLayout>
                  {children}
                </MainLayout>
                <PrivateChatOverlay />
              </LayoutProvider>
            </ChatProvider>
          </SocketProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
