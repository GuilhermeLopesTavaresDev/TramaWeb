'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { io } from 'socket.io-client';
import Navbar from '@/components/Navbar';

interface Message {
    id: number;
    remetente_id: number;
    destinatario_id: number;
    conteudo: string;
    criado_em: string;
}

const SOCKET_URL = 'http://localhost:3002';

export default function PrivateChatPage() {
    const { id: friendId } = useParams();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [friend, setFriend] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [socket, setSocket] = useState<any>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const userData = JSON.parse(userStr);
            setUser(userData);
            fetchHistory(userData.id, Number(friendId));
            fetchFriend(Number(friendId));

            const newSocket = io(SOCKET_URL, {
                path: '/socket.io',
                transports: ['websocket']
            });

            newSocket.emit('join_private_room', {
                userId: userData.id,
                friendId: Number(friendId)
            });

            newSocket.on('receive_private_message', (message: Message) => {
                setMessages(prev => [...prev, message]);
            });

            setSocket(newSocket);

            return () => {
                newSocket.disconnect();
            };
        }
    }, [friendId]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

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

    const fetchFriend = async (fid: number) => {
        try {
            const response = await fetch(`http://localhost:3002/api/profile/${fid}`);
            if (response.ok) {
                const data = await response.json();
                setFriend(data.user);
            }
        } catch (error) {
            console.error('Erro ao buscar amigo:', error);
        }
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket || !user) return;

        socket.emit('send_private_message', {
            remetenteId: user.id,
            destinatarioId: Number(friendId),
            conteudo: newMessage
        });

        setNewMessage('');
    };

    if (!user || !friend) return (
        <div className="min-h-screen bg-brand-dark flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white dark:bg-brand-dark flex flex-col pt-20">
            <Navbar />

            <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col p-6 overflow-hidden">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8 bg-zinc-50 dark:bg-brand-dark/50 p-4 rounded-3xl border border-zinc-100 dark:border-brand-blue/10">
                    {friend.foto_url ? (
                        <img src={`http://localhost:3002${friend.foto_url}`} className="w-12 h-12 rounded-full object-cover border-2 border-brand-blue" alt={friend.nome} />
                    ) : (
                        <div className="w-12 h-12 bg-brand-gradient rounded-full flex items-center justify-center font-black text-white uppercase">{friend.nome[0]}</div>
                    )}
                    <div>
                        <h2 className="font-black text-lg text-brand-dark dark:text-zinc-50 uppercase tracking-tight">{friend.nome}</h2>
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${friend.status === 'Disponível' ? 'bg-green-500' : 'bg-brand-blue'}`}></div>
                            <span className="text-[0.6rem] font-black uppercase tracking-widest text-zinc-400">{friend.status || 'Disponível'}</span>
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-4 scrollbar-thin scrollbar-thumb-brand-blue/20">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.remetente_id === user.id ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] px-6 py-4 rounded-[2rem] text-sm font-medium shadow-sm leading-relaxed ${msg.remetente_id === user.id
                                    ? 'bg-brand-gradient text-white rounded-tr-none'
                                    : 'bg-zinc-100 dark:bg-brand-blue/10 text-brand-dark dark:text-zinc-200 rounded-tl-none'
                                }`}>
                                {msg.conteudo}
                                <p className={`text-[0.6rem] mt-2 opacity-50 font-black uppercase ${msg.remetente_id === user.id ? 'text-right' : 'text-left'}`}>
                                    {new Date(msg.criado_em).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    ))}
                    <div ref={scrollRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSendMessage} className="relative mb-4">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={`Conversar com ${friend.nome}...`}
                        className="w-full bg-zinc-50 dark:bg-brand-dark/80 border-2 border-zinc-100 dark:border-brand-blue/10 rounded-2xl px-6 py-4 text-sm font-bold text-brand-dark dark:text-zinc-50 focus:outline-none focus:border-brand-blue transition-all"
                    />
                    <button
                        type="submit"
                        className="absolute right-3 top-2 px-6 py-2 bg-brand-gradient text-white rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-blue/20"
                    >
                        Enviar
                    </button>
                </form>
            </div>
        </div>
    );
}
