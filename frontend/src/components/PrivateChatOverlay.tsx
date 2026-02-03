'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useChat } from '@/context/ChatContext';
import { useSocket } from '@/context/SocketContext';

const SOCKET_URL = 'http://localhost:3002';

export default function PrivateChatOverlay() {
    const { activeFriend, isOpen, isMinimized, openChat, closeChat, toggleMinimize } = useChat();
    const { socket } = useSocket();
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [user, setUser] = useState<any>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    useEffect(() => {
        const checkAuth = () => {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                setUser(JSON.parse(userStr));
            } else {
                setUser(null);
                closeChat();
            }
        };

        checkAuth();
        window.addEventListener('storage', checkAuth);
        return () => window.removeEventListener('storage', checkAuth);
    }, [pathname]);

    // Listener Global para Notificações (mesmo com chat fechado)
    useEffect(() => {
        if (!socket || !user) return;

        const handleNotification = (data: any) => {
            console.log('[DEBUG] Notificação de mensagem recebida:', data);

            // Se o chat está aberto com essa pessoa, adiciona a mensagem
            if (isOpen && activeFriend && Number(activeFriend.id) === Number(data.remetente_id)) {
                setMessages(prev => [...prev, data]);
            } else {
                // Caso contrário, abre o chat automaticamente!
                // Precisamos dos dados básicos do amigo (o backend enviou simplified)
                // Para simplificar agora, vamos apenas garantir que se o chat já estava aberto 
                // e minimizado, ele receba. 
                // Futuro: abrir o chat com os dados do autor.
            }
        };

        socket.on('private_message_notification', handleNotification);
        return () => {
            socket.off('private_message_notification', handleNotification);
        };
    }, [socket, user, isOpen, activeFriend]);

    // Listener de Sala Específica (P2P)
    useEffect(() => {
        if (isOpen && activeFriend && user && socket) {
            fetchHistory(user.id, activeFriend.id);

            socket.emit('join_private_room', {
                userId: Number(user.id),
                friendId: Number(activeFriend.id)
            });

            const handleNewMessage = (message: any) => {
                console.log('[DEBUG] Mensagem recebida na sala P2P:', message);
                setMessages(prev => [...prev, message]);
            };

            socket.on('receive_private_message', handleNewMessage);

            return () => {
                socket.off('receive_private_message', handleNewMessage);
            };
        }
    }, [isOpen, activeFriend, user, socket]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isMinimized]);

    const fetchHistory = async (userId: number, fid: number) => {
        try {
            const response = await fetch(`http://localhost:3002/api/chat/private/${userId}/${fid}`);
            if (response.ok) {
                const data = await response.json();
                setMessages(data);
            }
        } catch (error) {
            console.error('Erro ao buscar histórico:', error);
        }
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket || !user || !activeFriend) return;

        console.log('[DEBUG] Enviando mensagem privada:', {
            remetenteId: Number(user.id),
            destinatarioId: Number(activeFriend.id),
            conteudo: newMessage
        });

        socket.emit('send_private_message', {
            remetenteId: Number(user.id),
            destinatarioId: Number(activeFriend.id),
            conteudo: newMessage
        });

        setNewMessage('');
    };

    if (!user || !isOpen || !activeFriend) return null;

    return (
        <div className={`fixed bottom-0 right-8 z-[100] w-96 bg-white dark:bg-brand-dark rounded-t-2xl shadow-2xl border-x border-t border-zinc-100 dark:border-brand-blue/20 transition-all duration-300 transform ${isMinimized ? 'translate-y-[calc(100%-48px)]' : 'translate-y-0'}`}>

            {/* Header */}
            <div
                onClick={toggleMinimize}
                className="h-12 flex items-center justify-between px-4 bg-brand-gradient text-white rounded-t-2xl cursor-pointer select-none"
            >
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"></div>
                    <span className="text-xs font-black uppercase tracking-widest truncate max-w-[180px]">
                        {activeFriend.nome}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); toggleMinimize(); }}
                        className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={isMinimized ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                        </svg>
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); closeChat(); }}
                        className="p-1 hover:bg-red-500 rounded-lg transition-colors group"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Content Area (Hidden if minimized, but we keep it for height) */}
            <div className={`h-96 flex flex-col bg-white dark:bg-brand-dark p-4 overflow-hidden ${isMinimized ? 'invisible' : 'visible'}`}>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1 scrollbar-thin scrollbar-thumb-brand-blue/10">
                    {messages.map((msg, idx) => (
                        <div key={msg.id || idx} className={`flex ${msg.remetente_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm font-bold leading-tight ${msg.remetente_id === user?.id
                                ? 'bg-brand-blue text-white rounded-tr-none'
                                : 'bg-zinc-100 dark:bg-brand-blue/10 text-brand-dark dark:text-zinc-200 rounded-tl-none'
                                }`}>
                                {msg.conteudo}
                            </div>
                        </div>
                    ))}
                    <div ref={scrollRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSendMessage} className="relative">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Escreva algo..."
                        className="w-full bg-zinc-50 dark:bg-brand-dark/50 border border-zinc-100 dark:border-brand-blue/10 rounded-xl px-4 py-3 text-sm font-bold text-brand-dark dark:text-zinc-50 focus:outline-none focus:border-brand-blue transition-all"
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-1.5 p-1 bg-brand-blue text-white rounded-lg hover:scale-110 active:scale-95 transition-all"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
}
