'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextData {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 5000);
    }, []);

    const removeToast = (id: number) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-8 right-8 z-[9999] flex flex-col gap-4">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        onClick={() => removeToast(toast.id)}
                        className={`
                            group relative overflow-hidden flex items-center gap-4 px-6 py-4 
                            rounded-2xl shadow-2xl backdrop-blur-xl border cursor-pointer
                            transform transition-all duration-500 animate-in slide-in-from-right-10
                            ${toast.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : ''}
                            ${toast.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-500' : ''}
                            ${toast.type === 'info' ? 'bg-brand-blue/10 border-brand-blue/20 text-brand-blue' : ''}
                        `}
                    >
                        {/* Indicador de Barra Lateral */}
                        <div className={`
                            absolute left-0 top-0 bottom-0 w-1.5
                            ${toast.type === 'success' ? 'bg-green-500' : ''}
                            ${toast.type === 'error' ? 'bg-red-500' : ''}
                            ${toast.type === 'info' ? 'bg-brand-blue' : ''}
                        `} />

                        <div className="flex-1">
                            <p className="font-black text-sm uppercase tracking-widest mb-0.5">
                                {toast.type === 'success' ? 'Sucesso' : toast.type === 'error' ? 'Erro' : 'Notificação'}
                            </p>
                            <p className="font-bold text-sm text-zinc-600 dark:text-zinc-300">
                                {toast.message}
                            </p>
                        </div>

                        <svg className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export const useToast = () => useContext(ToastContext);
