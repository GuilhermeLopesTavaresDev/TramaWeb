'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { profileService } from '@/services/profileService';
import { useLayout } from '@/context/LayoutContext';
import Questionnaire from './Questionnaire';

export default function Navbar() {
    const { toggleSidebar } = useLayout();
    const [userName, setUserName] = useState('');
    const [userFoto, setUserFoto] = useState('');
    const [user, setUser] = useState<any>(null);
    const router = useRouter();
    const pathname = usePathname();

    const [hasSidebar, setHasSidebar] = useState(false);

    useEffect(() => {
        const handleSync = () => {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const userData = JSON.parse(userStr);
                setUser(userData);
                setUserName(userData.nome);
                setHasSidebar(!!userData.preferences_completed);
                fetchProfileData(userData.id);
            } else {
                setUser(null);
                setHasSidebar(false);
            }
        };

        handleSync();

        console.log('[DEBUG-NAVBAR] Usuário atual no sync:', localStorage.getItem('user'));

        // Escuta mudanças de storage para atualizar em tempo real
        window.addEventListener('storage', handleSync);
        return () => window.removeEventListener('storage', handleSync);
    }, [pathname]);

    const fetchProfileData = async (userId: number) => {
        try {
            const data = await profileService.getProfile(userId);
            if (data?.user) {
                if (data.user.foto_url) {
                    setUserFoto(data.user.foto_url);
                }

                // Sincroniza o estado de completude do questionário com o DB
                const preferences_completed = !!data.user.preferences_completed;
                console.log('[DEBUG-NAVBAR] Status de preferências no DB:', preferences_completed);

                setUser(prev => {
                    if (!prev) return prev;
                    const newUser = { ...prev, preferences_completed };

                    // Atualiza o localStorage se houver mudança ou se estiver faltando
                    if (prev.preferences_completed !== preferences_completed) {
                        localStorage.setItem('user', JSON.stringify(newUser));
                    }
                    return newUser;
                });

                setHasSidebar(preferences_completed);
            }
        } catch (error) {
            console.error('Erro ao buscar perfil no Navbar:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        setHasSidebar(false);
        window.dispatchEvent(new Event('storage'));
        router.push('/login');
    };

    if (!user) return null;

    return (
        <nav className={`fixed top-0 ${hasSidebar ? 'lg:left-80' : 'left-0'} left-0 right-0 z-[2000] bg-white/80 dark:bg-brand-dark/80 backdrop-blur-md border-b border-zinc-200 dark:border-brand-blue/20 transition-all duration-500`}>
            <div className="w-full px-4 md:px-8 h-20 md:h-32 flex items-center justify-between">

                {/* Hamburger menu for mobile */}
                {hasSidebar && (
                    <button
                        onClick={toggleSidebar}
                        className="p-2 -ml-2 text-brand-dark dark:text-zinc-50 lg:hidden hover:bg-zinc-100 dark:hover:bg-brand-dark/50 rounded-xl transition-colors"
                    >
                        <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                )}

                {!hasSidebar && (
                    <Link href="/dashboard" className="flex items-center group">
                        <div className="relative w-40 h-40 transition-transform duration-500 group-hover:scale-110">
                            <img
                                src="/logo1-.png"
                                alt="TramaWeb Logo"
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </Link>
                )}
                <div className="flex-1" />


                <div className="flex items-center gap-3 md:gap-8">
                    {user?.preferences_completed ? (
                        <Link href="/profile" className="flex items-center gap-2 md:gap-4 py-1.5 md:py-2.5 px-3 md:px-5 bg-zinc-100 dark:bg-brand-dark/50 rounded-full border border-zinc-200 dark:border-brand-blue/30 hover:bg-white dark:hover:bg-brand-dark transition-all group">
                            <div className="w-8 h-8 md:w-12 md:h-12 bg-brand-blue/20 rounded-full overflow-hidden flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm flex-shrink-0">
                                {userFoto ? (
                                    <img src={userFoto} alt={userName} className="w-full h-full object-cover" />
                                ) : (
                                    <svg className="w-8 h-8 text-brand-blue" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                    </svg>
                                )}
                            </div>
                            <span className="text-xs md:text-base font-black text-brand-dark dark:text-zinc-50 truncate max-w-[100px] md:max-w-[200px] uppercase tracking-tighter">
                                {userName}
                            </span>
                        </Link>
                    ) : (
                        <div className="flex items-center gap-2 md:gap-4 py-1.5 md:py-2.5 px-3 md:px-5 bg-zinc-50 dark:bg-brand-dark/20 rounded-full border border-zinc-100 dark:border-brand-blue/10 opacity-50 cursor-not-allowed">
                            <div className="w-8 h-8 md:w-12 md:h-12 bg-zinc-200 dark:bg-brand-blue/10 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-zinc-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                </svg>
                            </div>
                            <span className="text-xs md:text-base font-black text-zinc-400 uppercase tracking-tighter">
                                {userName}
                            </span>
                        </div>
                    )}


                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-3 md:px-6 py-2 md:py-3.5 text-[0.6rem] md:text-xs font-black uppercase tracking-widest md:tracking-[0.2em] text-red-500 hover:text-red-600 bg-red-500/5 hover:bg-red-500/10 rounded-xl md:rounded-2xl transition-all border border-red-500/10"
                    >
                        <span className="hidden sm:inline">Sair</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Modal de Questionário para usuários que não completaram */}
            {user && !user.preferences_completed && (
                <Questionnaire userId={user.id} userName={user.nome} />
            )}
        </nav>
    );
}
