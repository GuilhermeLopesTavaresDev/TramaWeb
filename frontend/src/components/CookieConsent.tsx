'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        console.log('[DEBUG] CookieConsent Component Mounted');
        const consent = Cookies.get('tramaweb_consent_v1');
        console.log('[DEBUG] Cookie consent status:', consent);
        if (!consent) {
            console.log('[DEBUG] Showing cookie banner now');
            setIsVisible(true);
        }
    }, []);
    const handleAcceptAll = () => {
        Cookies.set('tramaweb_consent_v1', 'all', { expires: 365, path: '/' });
        setIsVisible(false);
    };

    const handleDecline = () => {
        Cookies.set('tramaweb_consent_v1', 'essential', { expires: 365, path: '/' });
        setIsVisible(false);
    };

    if (!isVisible) {
        console.log('[DEBUG] CookieConsent suppressed: isVisible is false');
        return null;
    }

    console.log('[DEBUG] Rendering CookieConsent UI');

    return (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] md:w-auto md:max-w-md z-[9999] opacity-100 visible">
            <div className="bg-white dark:bg-brand-dark border-4 border-red-500 rounded-[2.5rem] p-8 shadow-[0_0_50px_rgba(239,68,68,0.3)]">
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-brand-gradient rounded-2xl flex items-center justify-center p-3 shadow-lg shadow-brand-blue/20">
                            <svg className="w-full h-full text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-black uppercase tracking-tighter text-brand-dark dark:text-zinc-50">Sua Privacidade</h3>
                            <p className="text-[10px] font-bold text-brand-blue uppercase tracking-widest">Controle de Experiência</p>
                        </div>
                    </div>

                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                        Utilizamos cookies para personalizar sua jornada literária, analisar o tráfego e melhorar a fluidez da sua navegação na <span className="text-brand-purple">TramaWeb</span>.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={handleAcceptAll}
                            className="flex-1 px-6 py-4 bg-brand-gradient text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-brand-blue/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            Aceitar Tudo
                        </button>
                        <button
                            onClick={handleDecline}
                            className="px-6 py-4 bg-zinc-100 dark:bg-brand-dark/50 text-zinc-400 dark:text-zinc-500 border border-transparent dark:border-brand-blue/10 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-200 dark:hover:bg-brand-dark transition-all"
                        >
                            Recusar
                        </button>
                    </div>

                    <button className="text-[10px] font-bold text-zinc-400 hover:text-brand-blue transition-colors uppercase tracking-[0.2em] text-center">
                        Personalizar Preferências
                    </button>
                </div>
            </div>
        </div>
    );
}
