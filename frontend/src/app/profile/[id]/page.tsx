'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/context/ToastContext';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { profileService } from '@/services/profileService';
import Link from 'next/link';

export default function PublicProfilePage() {
    const { id } = useParams();
    const userId = Number(id);
    const [profileData, setProfileData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { showToast } = useToast();

    useEffect(() => {
        if (!userId) return;
        fetchProfile(userId);
    }, [userId]);

    const fetchProfile = async (uid: number) => {
        try {
            const data = await profileService.getProfile(uid);
            setProfileData(data);
        } catch (error: any) {
            console.error('Erro ao carregar perfil público:', error);
            showToast('Erro ao carregar dados do usuário', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-brand-dark flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!profileData) return (
        <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center gap-6">
            <h1 className="text-4xl font-black text-white">Usuário não encontrado</h1>
            <Link href="/dashboard" className="px-8 py-3 bg-brand-gradient text-white rounded-2xl font-black uppercase tracking-widest text-xs">Voltar ao Início</Link>
        </div>
    );

    const statusColors: any = {
        'Disponível': 'bg-green-500',
        'Ocupado': 'bg-red-500',
        'Lendo': 'bg-brand-blue'
    };

    return (
        <div className="min-h-screen bg-white dark:bg-brand-dark text-brand-dark dark:text-zinc-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 pt-48 pb-20 transition-all duration-500">
                <div className="grid lg:grid-cols-12 gap-12">

                    {/* Lateral Esquerda */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="relative group">
                            <div className="w-full aspect-square rounded-[3rem] overflow-hidden bg-brand-blue/10 border-4 border-white dark:border-brand-dark shadow-2xl relative">
                                {profileData.user.foto_url ? (
                                    <img src={profileData.user.foto_url} alt={profileData.user.nome} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-brand-blue text-6xl font-black">
                                        {profileData.user.nome.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div className={`absolute bottom-6 right-6 w-8 h-8 ${statusColors[profileData.user.status || 'Disponível']} rounded-full border-4 border-white dark:border-brand-dark shadow-lg ring-4 ring-brand-blue/20`}></div>
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-4xl font-black tracking-tighter">{profileData.user.nome}</h1>
                            <div className="flex flex-col gap-6">
                                <span className="inline-flex px-4 py-2 bg-brand-blue/10 rounded-xl text-brand-blue text-[10px] font-black uppercase tracking-[0.2em] border border-brand-blue/10 self-start">
                                    {profileData.user.status || 'Disponível'}
                                </span>
                                <p className="text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed italic border-l-4 border-brand-purple/20 pl-6 py-2">
                                    {profileData.user.bio || "Este entusiasta da leitura ainda não adicionou uma bio."}
                                </p>
                            </div>
                        </div>

                        {/* Amizade / Estatísticas do Usuário */}
                        <div className="p-8 bg-zinc-50 dark:bg-brand-dark/50 rounded-[2.5rem] border border-brand-blue/10">
                            <h3 className="text-xl font-black mb-6">Rede Literária</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-white dark:bg-brand-dark rounded-2xl border border-zinc-100 dark:border-brand-blue/5">
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Amigos</p>
                                    <p className="text-2xl font-black text-brand-blue">--</p>
                                </div>
                                <div className="p-4 bg-white dark:bg-brand-dark rounded-2xl border border-zinc-100 dark:border-brand-blue/5">
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Lidos</p>
                                    <p className="text-2xl font-black text-brand-purple">{profileData.lists.lidos.length}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Conteúdo Principal */}
                    <div className="lg:col-span-8 space-y-12">
                        <section>
                            <h2 className="text-3xl font-black tracking-tight mb-8">Estante de {profileData.user.nome}</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {profileData.lists.lidos.map((item: any) => (
                                    <Link key={item.book_id} href={`/book/${item.book_id}`} className="group space-y-3 block">
                                        <div className="aspect-[2/3] rounded-3xl overflow-hidden bg-zinc-100 dark:bg-brand-dark/50 shadow-lg group-hover:shadow-2xl transition-all group-hover:-translate-y-2">
                                            <img src={item.capa_url} alt={item.titulo} className="w-full h-full object-cover" />
                                        </div>
                                        <p className="font-bold text-sm line-clamp-1 group-hover:text-brand-blue transition-colors uppercase tracking-tighter">{item.titulo}</p>
                                    </Link>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-3xl font-black tracking-tight mb-8">Na Fila de Espera</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {profileData.lists.pretendoLer.map((item: any) => (
                                    <Link key={item.book_id} href={`/book/${item.book_id}`} className="group space-y-3 block">
                                        <div className="aspect-[2/3] rounded-3xl overflow-hidden bg-zinc-100 dark:bg-brand-dark/50 shadow-lg group-hover:shadow-2xl transition-all group-hover:-translate-y-2">
                                            <img src={item.capa_url} alt={item.titulo} className="w-full h-full object-cover" />
                                        </div>
                                        <p className="font-bold text-sm line-clamp-1 group-hover:text-brand-blue transition-colors uppercase tracking-tighter">{item.titulo}</p>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
