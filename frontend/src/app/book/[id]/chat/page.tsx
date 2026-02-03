'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { bookService } from '@/services/bookService';
import { profileService } from '@/services/profileService';
import Navbar from '@/components/Navbar';
import Chat from '@/components/Chat';
import Link from 'next/link';

export default function BookChatPage() {
    const { id } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [allowed, setAllowed] = useState(false);
    const [bookTitle, setBookTitle] = useState('');

    useEffect(() => {
        if (!id) return;

        const checkAccess = async () => {
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                router.push('/login');
                return;
            }

            const user = JSON.parse(userStr);
            try {
                // 1. Buscar detalhes do livro para o título
                const bookData = await bookService.getBookById(id as string);
                if (!bookData) {
                    router.push('/dashboard');
                    return;
                }
                setBookTitle(bookData.titulo);

                // 2. Verificar se está na lista do usuário
                const profile = await profileService.getProfile(user.id);
                const isInLidos = profile.lists.lidos.some((item: any) => item.book_id === id.toString());
                const isInPretendoLer = profile.lists.pretendoLer.some((item: any) => item.book_id === id.toString());

                if (isInLidos || isInPretendoLer) {
                    setAllowed(true);
                } else {
                    // Redireciona se não tiver acesso
                    router.push(`/book/${id}`);
                }
            } catch (error) {
                console.error('Erro ao verificar acesso ao chat:', error);
                router.push(`/book/${id}`);
            } finally {
                setLoading(false);
            }
        };

        checkAccess();
    }, [id, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-brand-dark flex items-center justify-center text-brand-blue">
                <div className="w-12 h-12 border-4 border-current border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!allowed) return null;

    return (
        <div className="min-h-screen bg-white dark:bg-brand-dark text-brand-dark dark:text-zinc-50">
            <Navbar />

            <main className="max-w-5xl mx-auto px-6 pt-48 pb-20 transition-all duration-500">
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <Link href={`/book/${id}`} className="inline-flex items-center gap-2 text-zinc-400 hover:text-brand-blue transition-colors mb-6 font-black uppercase tracking-widest text-xs">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                            </svg>
                            Voltar para Detalhes
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none text-brand-dark dark:text-zinc-50">
                            Discussão: <span className="text-brand-purple">{bookTitle}</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-3 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full w-fit">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-[0.65rem] font-black text-green-500 uppercase tracking-widest">Chat Ativo</span>
                    </div>
                </div>

                <div className="shadow-2xl shadow-brand-blue/10 rounded-[3rem] overflow-hidden">
                    <Chat bookId={id as string} />
                </div>
            </main>
        </div>
    );
}
