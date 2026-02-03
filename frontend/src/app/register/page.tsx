'use client';

import { useState } from 'react';
import Link from 'next/link';
import { authService } from '@/services/authService';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const [formData, setFormData] = useState({ nome: '', email: '', senha: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await authService.register(formData);
            setShowSuccess(true);
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-brand-dark p-6 relative overflow-hidden text-brand-dark dark:text-zinc-50">
            {/* Elementos Decorativos */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-blue/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-purple/10 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Overlay de Sucesso */}
            {showSuccess && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/90 dark:bg-brand-dark/95 backdrop-blur-md animate-in fade-in duration-500">
                    <div className="bg-white dark:bg-brand-dark border border-brand-blue/20 rounded-[3rem] p-12 shadow-2xl text-center max-w-sm w-full transform scale-100 animate-in zoom-in-95 duration-300 shadow-brand-blue/10">
                        <div className="w-20 h-20 bg-brand-gradient rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-brand-blue/30">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h2 className="text-3xl font-black mb-2 tracking-tighter">Bem-vindo ao Clube!</h2>
                        <p className="text-zinc-500 dark:text-zinc-400 font-medium mb-8">Sua trama começa agora. Redirecionando para o login...</p>
                        <div className="flex justify-center">
                            <div className="w-12 h-1 bg-zinc-100 dark:bg-brand-blue/10 rounded-full overflow-hidden">
                                <div className="h-full bg-brand-gradient animate-[loading_3s_linear_forwards]"></div>
                            </div>
                        </div>
                        <style jsx>{`
                            @keyframes loading {
                                from { width: 0%; }
                                to { width: 100%; }
                            }
                        `}</style>
                    </div>
                </div>
            )}

            <div className={`w-full max-w-md bg-white dark:bg-brand-dark/50 border border-brand-blue/10 dark:border-brand-blue/20 rounded-[2.5rem] p-10 shadow-2xl transition-all duration-500 backdrop-blur-xl ${showSuccess ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
                <div className="mb-10 text-center">
                    <div className="w-64 h-64 mx-auto transition-transform duration-700 hover:rotate-6">
                        <img src="/logo1-.png" alt="TramaWeb" className="w-full h-full object-contain filter drop-shadow-2xl" />
                    </div>
                    <p className="text-zinc-500 dark:text-zinc-400 font-medium">Inicie sua história em nosso clube.</p>
                </div>


                <form className="space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-2xl text-sm font-bold animate-in slide-in-from-top-2">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-brand-blue mb-2 ml-1">Nome Completo</label>
                        <input
                            type="text"
                            required
                            value={formData.nome}
                            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                            placeholder="Como quer ser chamado?"
                            className="w-full px-6 py-4 bg-zinc-50 dark:bg-brand-dark/80 border-2 border-transparent focus:border-brand-blue/30 rounded-2xl outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-brand-dark font-medium"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-brand-blue mb-2 ml-1">E-mail</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="seu@email.com"
                            className="w-full px-6 py-4 bg-zinc-50 dark:bg-brand-dark/80 border-2 border-transparent focus:border-brand-blue/30 rounded-2xl outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-brand-dark font-medium"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-brand-blue mb-2 ml-1">Senha</label>
                        <input
                            type="password"
                            required
                            value={formData.senha}
                            onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                            placeholder="••••••••"
                            className="w-full px-6 py-4 bg-zinc-50 dark:bg-brand-dark/80 border-2 border-transparent focus:border-brand-blue/30 rounded-2xl outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-brand-dark font-medium"
                        />
                    </div>

                    <button
                        disabled={loading}
                        className="w-full py-5 bg-brand-gradient text-white rounded-2xl font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-brand-blue/20 mt-4 disabled:opacity-50 relative overflow-hidden"
                    >
                        <span className={loading ? 'opacity-0' : 'opacity-100'}>
                            Criar Conta
                        </span>
                        {loading && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-zinc-100 dark:border-brand-blue/10 text-center text-sm">
                    <span className="text-zinc-500 font-medium">Já possui uma conta?</span>{' '}
                    <Link href="/login" className="text-brand-purple font-black hover:underline transition-all uppercase tracking-tighter">
                        Fazer Login
                    </Link>
                </div>

                <div className="mt-6 text-center">
                    <Link href="/" className="text-zinc-400 hover:text-brand-blue transition-all text-[10px] font-black uppercase tracking-[0.2em]">
                        ← Voltar ao Início
                    </Link>
                </div>
            </div>
        </div>
    );
}
