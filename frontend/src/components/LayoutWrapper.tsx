'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // We need a way to open it from Navbar, but Navbar is inside children.
    // Traditional solution: Provide a Context or pass down.
    // Given we have SocketProvider etc., let's create a simple LayoutContext here.

    return (
        <div className="flex">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="flex-1 w-full overflow-x-hidden min-h-screen">
                {/* Pass the toggle function via a custom event or pattern if we don't want a full new provider yet */}
                {/* But actually, a provider is best for Next.js app structure */}

                {/* For now, let's use a simple state and pass it down somehow, 
            or better: since Navbar is in pages, let's just make Navbar reactive.
            Actually, let's just use the LayoutWrapper.
        */}
                {children}
            </div>
        </div>
    );
}
