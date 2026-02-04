'use client';

import { LayoutProvider, useLayout } from '@/context/LayoutContext';
import Sidebar from '@/components/Sidebar';
import { ToastProvider } from "@/context/ToastContext";
import { ChatProvider } from "@/context/ChatContext";
import { SocketProvider } from "@/context/SocketContext";
import PrivateChatOverlay from "@/components/PrivateChatOverlay";
import BottomNav from '@/components/BottomNav';
import CookieConsent from '@/components/CookieConsent';

function MainLayoutContent({ children }: { children: React.ReactNode }) {
    const { isSidebarOpen, closeSidebar } = useLayout();

    return (
        <div className="flex">
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
            <div className="flex-1 w-full overflow-x-hidden min-h-screen">
                {children}
            </div>
        </div>
    );
}

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    console.log('[DEBUG] LayoutWrapper Rendering');
    return (
        <ToastProvider>
            <div id="layout-debug" className="hidden">Layout Mounted</div>
            <SocketProvider>
                <ChatProvider>
                    <LayoutProvider>
                        <MainLayoutContent>
                            {children}
                        </MainLayoutContent>
                        <PrivateChatOverlay />
                        <CookieConsent />
                    </LayoutProvider>
                </ChatProvider>
            </SocketProvider>
        </ToastProvider>
    );
}
