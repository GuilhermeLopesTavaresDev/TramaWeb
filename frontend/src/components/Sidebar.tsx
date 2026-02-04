'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { profileService } from '@/services/profileService';
import { useChat } from '@/context/ChatContext';
import { config } from '@/config/api';

interface BookItem {
    book_id: string;
    titulo: string;
    capa_url: string;
}

interface Friend {
    id: number;
    nome: string;
    foto_url: string | null;
    status_usuario: string;
}

export default function Sidebar({ isOpen, onClose }: { isOpen?: boolean, onClose?: () => void }) {
    const [books, setBooks] = useState<BookItem[]>([]);
    const [friends, setFriends] = useState<Friend[]>([]);
    const [pendingRequests, setPendingRequests] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);
    const { openChat } = useChat();
    const pathname = usePathname();
    const { id: currentBookId } = useParams();

    useEffect(() => {
        const checkAuth = () => {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const userData = JSON.parse(userStr);
                setUser(userData);
                fetchData(userData.id);
            } else {
                setUser(null);
            }
        };

        checkAuth();
        window.addEventListener('storage', checkAuth);
        return () => window.removeEventListener('storage', checkAuth);
    }, [pathname]);

    const fetchData = async (userId: number) => {
        try {
            // Buscar perfil para pegar os livros
            const profile = await profileService.getProfile(userId);
            const allBooks = [...profile.lists.lidos, ...profile.lists.pretendoLer];
            // Remover duplicados por book_id
            const uniqueBooks = allBooks.reduce((acc: BookItem[], current) => {
                const x = acc.find(item => item.book_id === current.book_id);
                if (!x) return acc.concat([current]);
                else return acc;
            }, []);
            setBooks(uniqueBooks);

            // Buscar amigos
            const friendsResponse = await fetch(`${config.API_URL}/friends/${userId}`);
            if (friendsResponse.ok) {
                const friendsData = await friendsResponse.json();
                setFriends(friendsData);
            }

            // Buscar pedidos pendentes
            const pendingResponse = await fetch(`${config.API_URL}/friends/${userId}/pending`);
            if (pendingResponse.ok) {
                const pendingData = await pendingResponse.json();
                setPendingRequests(pendingData);
            }
        } catch (error) {
            console.error('Erro ao buscar dados da sidebar:', error);
        }
    };

    const handleAccept = async (friendId: number) => {
        if (!user) return;
        try {
            const response = await fetch(`${config.API_URL}/friends/${user.id}/accept`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ friendId })
            });
            if (response.ok) {
                fetchData(user.id);
            }
        } catch (error) {
            console.error('Erro ao aceitar amizade:', error);
        }
    };

    const handleReject = async (friendId: number) => {
        if (!user) return;
        try {
            const response = await fetch(`${config.API_URL}/friends/${user.id}/reject`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ friendId })
            });
            if (response.ok) {
                fetchData(user.id);
            }
        } catch (error) {
            console.error('Erro ao recusar amizade:', error);
        }
    };

    if (!user) return null;

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden animate-in fade-in duration-300"
                    onClick={onClose}
                />
            )}

            <aside className={`
                fixed lg:sticky left-0 top-0 h-screen w-80 bg-white dark:bg-brand-dark/95 border-r border-zinc-100 dark:border-brand-blue/10 pt-8 pb-10 px-6 flex flex-col gap-10 overflow-hidden z-[70] lg:z-30 backdrop-blur-xl shrink-0 transition-transform duration-500
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>

                {/* Close button for mobile */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 text-zinc-400 hover:text-brand-blue lg:hidden transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Logo Section */}
                <Link href="/dashboard" className="flex items-center group px-2 mb-2">
                    <div className="relative w-40 h-20 transition-transform duration-500 group-hover:scale-105">
                        <img
                            src="/logo1-.png"
                            alt="TramaWeb Logo"
                            className="w-full h-full object-contain"
                        />
                    </div>
                </Link>

                {/* Meus Chats Section */}
                <div className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex items-center justify-between mb-6 px-2">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">Meus Chats</h3>
                        <span className="text-xs font-black bg-brand-blue/10 text-brand-blue px-3 py-1 rounded-full">{books.length}</span>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-1 scrollbar-none pr-2">
                        {books.length === 0 ? (
                            <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest px-2 leading-relaxed">
                                Adicione livros à sua lista para liberar os chats
                            </p>
                        ) : (
                            books.map((book) => (
                                <Link
                                    key={book.book_id}
                                    href={`/book/${book.book_id}/chat`}
                                    className={`flex items-center gap-3 p-3 rounded-2xl transition-all group ${currentBookId === book.book_id
                                        ? 'bg-brand-gradient text-white shadow-lg shadow-brand-blue/20 rotate-[-1deg]'
                                        : 'hover:bg-zinc-50 dark:hover:bg-brand-blue/5 text-brand-dark dark:text-zinc-400'
                                        }`}
                                >
                                    <div className="relative flex-shrink-0">
                                        <img
                                            src={book.capa_url}
                                            alt={book.titulo}
                                            className="w-12 h-16 object-cover rounded-lg shadow-sm"
                                        />
                                        {currentBookId === book.book_id && (
                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                                                <div className="w-1.5 h-1.5 bg-brand-blue rounded-full animate-pulse"></div>
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-base font-black truncate leading-tight uppercase tracking-tight">
                                        {book.titulo}
                                    </span>
                                </Link>
                            ))
                        )}
                    </div>
                </div>

                {/* Amigos Section */}
                <div className="flex flex-col flex-1 border-t border-zinc-100 dark:border-brand-blue/10 pt-8 overflow-hidden">

                    {/* Solicitações Pendentes (se houver) */}
                    {pendingRequests.length > 0 && (
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4 px-2">
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-brand-blue animate-pulse">Solicitações</h3>
                                <span className="text-xs font-black bg-brand-blue/10 text-brand-blue px-3 py-1 rounded-full">{pendingRequests.length}</span>
                            </div>
                            <div className="space-y-3 px-1">
                                {pendingRequests.map((req) => (
                                    <div key={req.id} className="bg-brand-blue/5 border border-brand-blue/10 rounded-2xl p-3 space-y-3 animate-in slide-in-from-left-2 duration-500">
                                        <div className="flex items-center gap-3">
                                            {req.foto_url ? (
                                                <img src={`http://localhost:3002${req.foto_url}`} className="w-8 h-8 rounded-full border border-brand-blue/20" alt="" />
                                            ) : (
                                                <div className="w-8 h-8 bg-brand-gradient rounded-full flex items-center justify-center font-black text-white text-[0.6rem]">{req.nome[0]}</div>
                                            )}
                                            <span className="text-base font-black text-brand-dark dark:text-zinc-50 truncate uppercase tracking-tight">{req.nome}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleAccept(req.id)}
                                                className="flex-1 py-2 bg-brand-blue text-white rounded-lg text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-lg shadow-brand-blue/20"
                                            >
                                                Aceitar
                                            </button>
                                            <button
                                                onClick={() => handleReject(req.id)}
                                                className="px-4 py-2 bg-zinc-100 dark:bg-brand-dark/50 text-zinc-500 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-red-500/10 hover:text-red-500 transition-colors"
                                            >
                                                X
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-between mb-6 px-2">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">Amigos</h3>
                        <span className="text-xs font-black bg-brand-purple/10 text-brand-purple px-3 py-1 rounded-full">{friends.length}</span>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2 scrollbar-none pr-2">
                        {friends.length === 0 ? (
                            <div className="px-2 space-y-3">
                                <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest leading-relaxed">
                                    Você ainda não tem amigos lendo com você
                                </p>
                            </div>
                        ) : (
                            friends.map((friend) => (
                                <div
                                    key={friend.id}
                                    onClick={() => openChat(friend)}
                                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-brand-blue/5 transition-all cursor-pointer group"
                                >
                                    <div className="relative">
                                        {friend.foto_url ? (
                                            <img
                                                src={`http://localhost:3002${friend.foto_url}`}
                                                alt={friend.nome}
                                                className="w-10 h-10 rounded-full object-cover border border-zinc-100 dark:border-brand-blue/10"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 bg-brand-gradient rounded-full flex items-center justify-center font-black text-white text-xs">
                                                {friend.nome[0]}
                                            </div>
                                        )}
                                        <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-brand-dark ${friend.status_usuario === 'Disponível' ? 'bg-green-500' :
                                            friend.status_usuario === 'Ocupado' ? 'bg-red-500' : 'bg-brand-blue'
                                            }`}></div>
                                    </div>
                                    <div className="flex flex-col overflow-hidden">
                                        <span className="text-base font-black text-brand-dark dark:text-zinc-50 truncate uppercase tracking-tight">{friend.nome}</span>
                                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{friend.status_usuario === 'Lendo' ? 'Lendo agora' : friend.status_usuario}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </aside>
        </>
    );
}
