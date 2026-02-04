'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLayout } from '@/context/LayoutContext';

export default function BottomNav() {
    const pathname = usePathname();
    const { toggleSidebar } = useLayout();

    const navItems = [
        {
            label: 'Home', icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ), href: '/dashboard'
        },
        {
            label: 'Busca', icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            ), href: '/search'
        }, // Assuming a search page or we can trigger focus
        {
            label: 'Chats', icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            ), onClick: toggleSidebar
        },
        {
            label: 'Perfil', icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ), href: '/profile'
        },
    ];

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-brand-dark/95 backdrop-blur-xl border-t border-zinc-100 dark:border-brand-blue/10 px-4 py-2 pb-safe z-[60] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
            <div className="flex justify-between items-center max-w-md mx-auto">
                {navItems.map((item, i) => {
                    const isActive = pathname === item.href;

                    if (item.onClick) {
                        return (
                            <button
                                key={i}
                                onClick={item.onClick}
                                className="flex flex-col items-center gap-1.5 transition-all text-zinc-400"
                            >
                                <div className="p-1 rounded-xl transition-colors">
                                    {item.icon}
                                </div>
                                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                            </button>
                        );
                    }

                    return (
                        <Link
                            key={i}
                            href={item.href || '#'}
                            className={`flex flex-col items-center gap-1.5 transition-all ${isActive ? 'text-brand-blue' : 'text-zinc-400'
                                }`}
                        >
                            <div className={`p-1 rounded-xl transition-colors ${isActive ? 'bg-brand-blue/10' : ''}`}>
                                {item.icon}
                            </div>
                            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
