'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@/context/ToastContext';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { bookService } from '@/services/bookService';
import { profileService } from '@/services/profileService';
import Link from 'next/link';

interface BookDetail {
    id: number;
    titulo: string;
    autor: string;
    capa: string;
    sinopse: string;
    generos: string[];
    avaliacao: number;
    totalAvaliacoes: number;
    preco: string;
    urlLoja: string;
}

export default function BookDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [book, setBook] = useState<BookDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [isInLidos, setIsInLidos] = useState(false);
    const [isInPretendoLer, setIsInPretendoLer] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        const fetchBook = async () => {
            if (!id) return;
            try {
                const data = await bookService.getBookById(id as string);
                if (!data) {
                    router.push('/dashboard');
                    return;
                }
                setBook(data);
            } catch (error) {
                console.error('Erro ao carregar livro:', error);
            } finally {
                setLoading(false);
            }
        };

        const checkListStatus = async () => {
            const userStr = localStorage.getItem('user');
            if (userStr && id) {
                const user = JSON.parse(userStr);
                try {
                    const profile = await profileService.getProfile(user.id);
                    const lidos = profile.lists.lidos.some((item: any) => item.book_id === id.toString());
                    const pretendo = profile.lists.pretendoLer.some((item: any) => item.book_id === id.toString());
                    setIsInLidos(lidos);
                    setIsInPretendoLer(pretendo);
                } catch (error) {
                    console.error('Erro ao verificar status da lista:', error);
                }
            }
        };

        fetchBook();
        checkListStatus();
    }, [id, router]);

    const handleSaveToList = async (tipo: 'Lido' | 'Pretendo Ler') => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            router.push('/login');
            return;
        }

        const userObj = JSON.parse(userStr);
        try {
            if (!book) return;
            await profileService.addToList(userObj.id, {
                book_id: id as string,
                titulo: book.titulo,
                capa_url: book.capa,
                tipo: tipo
            });

            if (tipo === 'Lido') setIsInLidos(true);
            else setIsInPretendoLer(true);

            showToast(`Adicionado aos ${tipo === 'Lido' ? 'lidos' : 'interesses'}!`, 'success');
        } catch (error: any) {
            showToast(error.message || 'Erro ao salvar.', 'error');
        }
    };

    const handleRemoveFromList = async (tipo: 'Lido' | 'Pretendo Ler') => {
        const userStr = localStorage.getItem('user');
        if (!userStr) return;
        const userObj = JSON.parse(userStr);

        try {
            await profileService.removeFromList(userObj.id, id as string);
            if (tipo === 'Lido') setIsInLidos(false);
            else setIsInPretendoLer(false);
            showToast('Removido da sua lista.', 'info');
        } catch (error) {
            showToast('Erro ao remover livro.', 'error');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-brand-dark flex items-center justify-center text-brand-blue">
                <div className="w-12 h-12 border-4 border-current border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!book) return null;

    return (
        <div className="min-h-screen bg-white dark:bg-brand-dark text-brand-dark dark:text-zinc-50 relative pb-32 lg:pb-0">
            <Navbar />

            <main className="max-w-7xl mx-auto fluid-px fluid-pt pb-10 transition-all duration-500">
                <Link href="/dashboard" className="inline-flex items-center gap-2 text-zinc-400 hover:text-brand-blue transition-colors mb-8 md:mb-12 font-black uppercase tracking-widest text-[10px] md:text-xs">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    Voltar para Biblioteca
                </Link>

                <div className="grid lg:grid-cols-12 gap-8 lg:gap-20">
                    <div className="lg:col-span-3 lg:sticky lg:top-48 h-fit">

                        <div className="relative aspect-[2/3] max-w-[280px] mx-auto lg:mx-0 rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_-15px_rgba(37,99,235,0.2)] bg-zinc-100 dark:bg-brand-dark/50 group">
                            <img src={book.capa} alt={book.titulo} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        </div>

                        <div className="mt-8 hidden lg:flex flex-col gap-4 max-w-[280px] mx-auto lg:mx-0">
                            <a href={book.urlLoja} target="_blank" className="w-full py-5 bg-brand-gradient text-white rounded-3xl font-black text-center text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-brand-blue/20">
                                Comprar
                            </a>
                            <div className="grid grid-cols-1 gap-4">
                                {isInLidos ? (
                                    <button
                                        onClick={() => handleRemoveFromList('Lido')}
                                        className="w-full py-4 bg-red-500/10 text-red-500 border-2 border-red-500/20 rounded-2xl font-black text-sm hover:bg-red-500 hover:text-white transition-all"
                                    >
                                        Remover de Lidos
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleSaveToList('Lido')}
                                        className="w-full py-4 bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 rounded-2xl font-black text-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
                                    >
                                        Já li este
                                    </button>
                                )}

                                {isInPretendoLer ? (
                                    <button
                                        onClick={() => handleRemoveFromList('Pretendo Ler')}
                                        className="w-full py-4 bg-brand-purple/10 text-brand-purple border-2 border-brand-purple/20 rounded-2xl font-black text-sm hover:bg-brand-purple hover:text-white transition-all"
                                    >
                                        Remover de Interesses
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleSaveToList('Pretendo Ler')}
                                        className="w-full py-4 bg-white dark:bg-brand-dark/50 border-2 border-brand-blue/20 text-brand-dark dark:text-zinc-50 rounded-2xl font-black text-sm hover:bg-brand-blue/5 transition-all outline-none"
                                    >
                                        Quero ler
                                    </button>
                                )}
                            </div>
                        </div>

                    </div>

                    <div className="lg:col-span-9 space-y-12">
                        <section>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {book.generos?.slice(0, 3).map((g, i) => (
                                    <span key={i} className="px-3 py-1 bg-brand-blue/5 dark:bg-brand-blue/10 rounded-full text-[0.65rem] font-black uppercase tracking-widest text-brand-blue border border-brand-blue/10">
                                        {g}
                                    </span>
                                ))}
                            </div>
                            <h1 className="text-fluid-h1 font-black tracking-tighter mb-4 leading-[0.9] text-brand-dark dark:text-zinc-50">
                                {book.titulo}
                            </h1>
                            <p className="text-lg md:text-3xl font-bold text-zinc-400 tracking-tight mb-8">
                                por {book.autor}
                            </p>

                            <div className="flex items-center gap-4 md:gap-6 p-4 md:p-6 bg-zinc-50 dark:bg-brand-dark/40 rounded-2xl md:rounded-[2rem] border border-zinc-100 dark:border-brand-blue/10 w-full md:w-fit">
                                <div className="flex gap-0.5 md:gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <svg
                                            key={star}
                                            className={`w-5 h-5 md:w-6 md:h-6 ${star <= Math.round(book.avaliacao || 0) ? 'text-brand-purple fill-brand-purple' : 'text-zinc-200 dark:text-brand-dark'}`}
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <div className="text-sm font-black">
                                    <span className="text-lg md:text-xl text-brand-purple">{book.avaliacao || '0.0'}</span>
                                    <span className="text-zinc-400 ml-2 uppercase tracking-widest text-[0.6rem] md:text-[0.65rem]">{book.totalAvaliacoes || 0} avaliações</span>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-2xl font-black uppercase tracking-tighter text-brand-dark dark:text-zinc-50 underline decoration-brand-blue decoration-4 underline-offset-8">Sinopse</h2>
                            <div
                                className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium space-y-4"
                                dangerouslySetInnerHTML={{ __html: book.sinopse }}
                            />
                        </section>

                        <hr className="border-zinc-100 dark:border-brand-blue/10" />

                        <section className="space-y-8 bg-zinc-50 dark:bg-brand-dark/40 p-10 rounded-[3rem] border border-zinc-100 dark:border-brand-blue/10">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="space-y-2 text-center md:text-left">
                                    <h2 className="text-3xl font-black uppercase tracking-tighter text-brand-dark dark:text-zinc-50">Discussão da <span className="text-brand-purple">Trama</span></h2>
                                    <p className="text-zinc-500 dark:text-zinc-400 font-medium">Participe do chat exclusivo para leitores e compartilhe suas teorias.</p>
                                </div>

                                {isInLidos || isInPretendoLer ? (
                                    <Link
                                        href={`/book/${id}/chat`}
                                        className="px-10 py-5 bg-brand-gradient text-white rounded-2xl font-black shadow-2xl shadow-brand-blue/20 hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-widest whitespace-nowrap"
                                    >
                                        Entrar no Chat da Trama
                                    </Link>
                                ) : (
                                    <div className="flex flex-col items-center md:items-end gap-3">
                                        <button
                                            disabled
                                            className="px-10 py-5 bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 rounded-2xl font-black text-sm uppercase tracking-widest cursor-not-allowed opacity-70"
                                        >
                                            Chat Bloqueado
                                        </button>
                                        <p className="text-[0.65rem] font-black text-brand-blue uppercase tracking-widest animate-pulse">
                                            Adicione à sua lista para liberar o acesso
                                        </p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            {/* Mobile Actions Bottom Bar */}
            <div className="lg:hidden fixed bottom-16 left-0 right-0 p-4 bg-white/70 dark:bg-brand-dark/70 backdrop-blur-xl border-t border-zinc-100 dark:border-brand-blue/10 flex items-center gap-3 z-40">
                <a href={book.urlLoja} target="_blank" className="flex-1 py-4 bg-brand-gradient text-white rounded-xl font-black text-center text-sm shadow-xl shadow-brand-blue/20">
                    Comprar
                </a>
                {isInLidos ? (
                    <button onClick={() => handleRemoveFromList('Lido')} className="p-4 bg-red-500/10 text-red-500 rounded-xl">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                ) : (
                    <button onClick={() => handleSaveToList('Lido')} className="p-4 bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 rounded-xl">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                    </button>
                )}
                {isInPretendoLer ? (
                    <button onClick={() => handleRemoveFromList('Pretendo Ler')} className="p-4 bg-brand-purple/10 text-brand-purple rounded-xl">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                ) : (
                    <button onClick={() => handleSaveToList('Pretendo Ler')} className="p-4 bg-white dark:bg-brand-dark/50 border-2 border-brand-blue/20 text-brand-blue rounded-xl">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                    </button>
                )}
            </div>
        </div>
    );
}
