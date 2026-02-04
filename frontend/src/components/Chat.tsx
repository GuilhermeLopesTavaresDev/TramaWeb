'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';
import { useSocket } from '@/context/SocketContext';
import { config } from '@/config/api';

interface Message {
    id: number;
    book_id: string;
    usuario_id: number;
    conteudo: string;
    usuario_nome: string;
    usuario_foto: string | null;
    criado_em: string;
}

interface ChatProps {
    bookId: string;
}

const SOCKET_URL = config.SOCKET_URL;

export default function Chat({ bookId }: ChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [user, setUser] = useState<any>(null);
    const [menuVisible, setMenuVisible] = useState(false);
    const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
    const [selectedUser, setSelectedUser] = useState<{ id: number; nome: string } | null>(null);
    const { socket } = useSocket();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { showToast } = useToast();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleRequestFriend = async (friendId: number, friendNome: string) => {
        if (!user || user.id === friendId) return;

        try {
            const response = await fetch(`${SOCKET_URL}/api/friends/${user.id}/request`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ friendId })
            });

            const data = await response.json();

            if (response.ok) {
                showToast(`Pedido de amizade enviado para ${friendNome}!`, 'success');
            } else {
                showToast(data.error || 'Erro ao enviar pedido', 'error');
            }
        } catch (error) {
            console.error('Erro ao pedir amizade:', error);
            showToast('Erro ao conectar ao servidor', 'error');
        }
    };

    const handleOpenMenu = (e: React.MouseEvent, userId: number, userNome: string) => {
        if (!user || user.id === userId) return;
        e.preventDefault();
        e.stopPropagation();

        setMenuPos({ x: e.clientX, y: e.clientY });
        setSelectedUser({ id: userId, nome: userNome });
        setMenuVisible(true);
    };

    const handleBlockUser = async () => {
        if (!user || !selectedUser) return;
        try {
            const response = await fetch(`${SOCKET_URL}/api/security/${user.id}/block`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ blockedId: selectedUser.id })
            });
            if (response.ok) {
                showToast(`${selectedUser.nome} bloqueado(a)`, 'success');
                setMenuVisible(false);
            } else {
                const data = await response.json();
                showToast(data.error || 'Erro ao bloquear', 'error');
            }
        } catch (error) {
            showToast('Erro ao conectar ao servidor', 'error');
        }
    };

    const handleReportUser = async () => {
        if (!user || !selectedUser) return;
        const reason = window.prompt(`Qual o motivo da denúncia contra ${selectedUser.nome}?`);
        if (!reason) return;

        try {
            const response = await fetch(`${SOCKET_URL}/api/security/${user.id}/report`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reportedId: selectedUser.id, reason })
            });
            if (response.ok) {
                showToast('Denúncia enviada. Analisaremos em breve.', 'success');
                setMenuVisible(false);
            } else {
                showToast('Erro ao enviar denúncia', 'error');
            }
        } catch (error) {
            showToast('Erro ao conectar ao servidor', 'error');
        }
    };

    useEffect(() => {
        const handleClickOutside = () => setMenuVisible(false);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!socket || !bookId) return;

        // Entrar na sala
        socket.emit('join_room', bookId);

        const handleNewMessage = (message: Message) => {
            console.log('Nova mensagem recebida via socket no livro:', message);
            setMessages((prev) => [...prev, message]);
        };

        socket.on('receive_message', handleNewMessage);

        return () => {
            socket.off('receive_message', handleNewMessage);
        };
    }, [socket, bookId]);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            setUser(JSON.parse(userStr));
        }

        // Carregar histórico
        const fetchHistory = async () => {
            console.log(`Buscando histórico para o livro: ${bookId}`);
            try {
                const response = await fetch(`${SOCKET_URL}/api/chat/${bookId}`);
                if (!response.ok) throw new Error('Falha ao carregar histórico');
                const data = await response.json();
                setMessages(data);
            } catch (error) {
                console.error('Erro ao carregar histórico:', error);
            }
        };

        fetchHistory();
    }, [bookId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user) return;

        socket?.emit('send_message', {
            bookId,
            usuarioId: user.id,
            conteudo: newMessage
        });

        setNewMessage('');
    };

    const getInitials = (name: string) => name.charAt(0).toUpperCase();

    return (
    return (
        <div className="flex flex-col h-[70vh] md:h-[800px] bg-zinc-50 dark:bg-brand-dark/40 rounded-[2rem] md:rounded-[2.5rem] border border-zinc-100 dark:border-brand-blue/10 overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="px-8 py-6 border-b border-zinc-100 dark:border-brand-blue/10 bg-white/50 dark:bg-brand-dark/50 backdrop-blur-sm">
                <h3 className="text-xl font-black uppercase tracking-tighter text-brand-dark dark:text-zinc-50">
                    Discussão em <span className="text-brand-purple">Tempo Real</span>
                </h3>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">Conectado ao chat da trama</p>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-thin scrollbar-thumb-brand-blue/20">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                        <div className="w-16 h-16 bg-brand-blue/10 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <p className="font-bold text-zinc-500 uppercase tracking-widest text-xs">Seja o primeiro a comentar sobre esta trama!</p>
                    </div>
                ) : (
                    messages.map((m, i) => (
                        <div
                            key={i}
                            className={`flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300 ${m.usuario_id === user?.id ? 'flex-row-reverse' : ''}`}
                        >
                            <div
                                className={`flex-shrink-0 cursor-pointer hover:scale-110 transition-transform ${m.usuario_id === user?.id ? 'pointer-events-none' : ''}`}
                                onClick={(e) => handleOpenMenu(e, m.usuario_id, m.usuario_nome)}
                                title={m.usuario_id !== user?.id ? `Opções para ${m.usuario_nome}` : ''}
                            >
                                {m.usuario_foto ? (
                                    <img
                                        src={`http://localhost:3002${m.usuario_foto}`}
                                        alt={m.usuario_nome}
                                        className="w-10 h-10 rounded-full object-cover border-2 border-brand-blue/20"
                                    />
                                ) : (
                                    <div className="w-10 h-10 bg-brand-gradient rounded-full flex items-center justify-center font-black text-white text-xs shadow-lg">
                                        {getInitials(m.usuario_nome)}
                                    </div>
                                )}
                            </div>
                            <div className={`max-w-[70%] space-y-1 ${m.usuario_id === user?.id ? 'items-end' : ''}`}>
                                <div className={`flex items-center gap-2 ${m.usuario_id === user?.id ? 'flex-row-reverse' : ''}`}>
                                    <span
                                        className={`font-black text-xs text-brand-dark dark:text-zinc-50 uppercase tracking-widest ${m.usuario_id !== user?.id ? 'cursor-pointer hover:text-brand-blue' : ''}`}
                                        onClick={(e) => handleOpenMenu(e, m.usuario_id, m.usuario_nome)}
                                    >
                                        {m.usuario_nome}
                                    </span>
                                    <span className="text-[0.65rem] font-bold text-zinc-400 uppercase tracking-widest">
                                        {new Date(m.criado_em).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <div className={`p-5 rounded-[1.5rem] text-base font-medium leading-relaxed ${m.usuario_id === user?.id
                                    ? 'bg-brand-gradient text-white rounded-tr-none shadow-lg shadow-brand-blue/20'
                                    : 'bg-white dark:bg-brand-dark/60 text-zinc-600 dark:text-zinc-400 rounded-tl-none border border-zinc-100 dark:border-brand-blue/10'
                                    }`}>
                                    {m.conteudo}
                                </div>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 md:p-6 bg-white/50 dark:bg-brand-dark/50 backdrop-blur-sm border-t border-zinc-100 dark:border-brand-blue/10">
                {user ? (
                    <form onSubmit={handleSendMessage} className="relative flex gap-2 md:gap-3">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Sua teoria..."
                            className="flex-1 px-4 md:px-8 py-3.5 md:py-5 bg-white dark:bg-brand-dark/60 border-2 border-transparent focus:border-brand-blue/30 rounded-xl md:rounded-2xl outline-none transition-all text-sm md:text-base font-medium shadow-inner"
                        />
                        <button
                            type="submit"
                            disabled={!newMessage.trim()}
                            className="px-5 md:px-8 py-3.5 md:py-5 bg-brand-gradient text-white rounded-xl md:rounded-2xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all text-[0.65rem] md:text-sm uppercase tracking-widest disabled:opacity-50 disabled:scale-100"
                        >
                            Enviar
                        </button>
                    </form>
                ) : (
                    <div className="text-center py-2">
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                            Faça login para participar da discussão
                        </p>
                    </div>
                )}
            </div>

            {/* User Context Menu */}
            {menuVisible && selectedUser && (
                <div
                    className="fixed z-[100] w-64 md:w-56 bg-white dark:bg-brand-dark rounded-2xl shadow-2xl border border-zinc-100 dark:border-brand-blue/20 p-2 animate-in fade-in zoom-in duration-200 bottom-24 left-1/2 -translate-x-1/2 md:bottom-auto md:left-auto"
                    style={window.innerWidth > 768 ? { left: menuPos.x, top: menuPos.y } : {}}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="px-4 py-3 mb-1 border-b border-zinc-50 dark:border-brand-blue/10">
                        <p className="text-[0.6rem] font-black uppercase tracking-widest text-zinc-400">Opções para</p>
                        <p className="text-xs font-black text-brand-dark dark:text-zinc-50 truncate">{selectedUser.nome}</p>
                    </div>
                    <button
                        onClick={() => { handleRequestFriend(selectedUser.id, selectedUser.nome); setMenuVisible(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-[0.65rem] font-black uppercase tracking-widest text-brand-blue hover:bg-brand-blue/5 rounded-xl transition-all"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                        Adicionar Amigo
                    </button>
                    <Link
                        href={`/profile/${selectedUser.id}`}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-[0.65rem] font-black uppercase tracking-widest text-brand-dark dark:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-brand-blue/5 rounded-xl transition-all"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        Ver Perfil
                    </Link>
                    <button
                        onClick={handleBlockUser}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-[0.65rem] font-black uppercase tracking-widest text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/5 rounded-xl transition-all"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                        Bloquear
                    </button>
                    <button
                        onClick={handleReportUser}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-[0.65rem] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-500/5 rounded-xl transition-all"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        Denunciar
                    </button>
                </div>
            )}
        </div>
    );
}
