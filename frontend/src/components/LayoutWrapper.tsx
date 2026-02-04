import Sidebar from '@/components/Sidebar';
import { ToastProvider } from "@/context/ToastContext";
import { ChatProvider } from "@/context/ChatContext";
import { SocketProvider } from "@/context/SocketContext";
import PrivateChatOverlay from "@/components/PrivateChatOverlay";
import BottomNav from '@/components/BottomNav';

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
    return (
        <ToastProvider>
            <SocketProvider>
                <ChatProvider>
                    <LayoutProvider>
                        <MainLayoutContent>
                            {children}
                        </MainLayoutContent>
                        <PrivateChatOverlay />
                    </LayoutProvider>
                </ChatProvider>
            </SocketProvider>
        </ToastProvider>
    );
}
