'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/context/ToastContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { profileService } from '@/services/profileService';
import Link from 'next/link';

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [profileData, setProfileData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [newBio, setNewBio] = useState('');
    const [newStatus, setNewStatus] = useState('');
    const [newFoto, setNewFoto] = useState('');
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [tempImage, setTempImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [zoom, setZoom] = useState(1);
    const router = useRouter();
    const { showToast } = useToast();

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            router.push('/login');
            return;
        }
        const loggedUser = JSON.parse(userStr);
        if (!loggedUser || !loggedUser.id) {
            localStorage.removeItem('user');
            router.push('/login');
            return;
        }
        setUser(loggedUser);
        fetchProfile(loggedUser.id);
    }, []);

    const fetchProfile = async (userId: number) => {
        try {
            const data = await profileService.getProfile(userId);
            setProfileData(data);
            setNewBio(data.user.bio || '');
            setNewStatus(data.user.status || 'Disponível');
            setNewFoto(data.user.foto_url || '');
        } catch (error: any) {
            console.error('Erro ao carregar perfil:', error);
            showToast('Erro ao carregar dados: ' + error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!user) return;

        const updateData = {
            bio: newBio,
            foto_url: newFoto,
            status: newStatus
        };

        try {
            await profileService.updateProfile(user.id, updateData);
            setEditing(false);
            showToast('Perfil atualizado com sucesso!', 'success');

            // Dispara evento para o Navbar atualizar em tempo real
            window.dispatchEvent(new Event('storage'));

            await fetchProfile(user.id);
        } catch (error: any) {
            console.error('Erro ao salvar prefíl:', error);
            showToast('Erro ao salvar perfil: ' + error.message, 'error');
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Limite de 10MB no frontend
        if (file.size > 10 * 1024 * 1024) {
            showToast('O arquivo é muito grande. Escolha uma imagem de até 10MB.', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setTempImage(reader.result as string);
            setSelectedFile(file);
            setShowPreviewModal(true);
            setZoom(1);
        };
        reader.readAsDataURL(file);
    };

    const handleConfirmUpload = async () => {
        if (!selectedFile || !user) return;

        setUploading(true);
        setShowPreviewModal(false);
        try {
            console.log('Iniciando upload do arquivo:', selectedFile.name);
            const data = await profileService.uploadImage(selectedFile);
            console.log('Upload concluído. Nova URL:', data.imageUrl);
            setNewFoto(data.imageUrl);
            showToast('Imagem ajustada e enviada! Clique em Salvar para aplicar.', 'success');
        } catch (error: any) {
            console.error('Erro no upload (frontend):', error);
            showToast(error.message, 'error');
        } finally {
            setUploading(false);
            setTempImage(null);
            setSelectedFile(null);
        }
    };

    const handleRemoveBook = async (bookId: string) => {
        if (!confirm('Deseja remover este livro da sua lista?')) return;
        try {
            await profileService.removeFromList(user.id, bookId);
            showToast('Livro removido da sua estante.', 'info');
            fetchProfile(user.id);
        } catch (error) {
            showToast('Erro ao remover livro', 'error');
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-brand-dark flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
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

                    {/* Lateral Esquerda: Info Básica */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="relative group">
                            <div className="w-full aspect-square rounded-[3rem] overflow-hidden bg-brand-blue/10 border-4 border-white dark:border-brand-dark shadow-2xl relative">
                                {editing ? (
                                    // Durante a edição, prioriza a foto recém-carregada ou a atual
                                    (newFoto || profileData.user.foto_url) ? (
                                        <img src={newFoto || profileData.user.foto_url} alt={user?.nome} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-brand-blue text-6xl font-black">
                                            {user?.nome.charAt(0)}
                                        </div>
                                    )
                                ) : (
                                    // Fora da edição, mostra a foto do banco de dados
                                    profileData.user.foto_url ? (
                                        <img src={profileData.user.foto_url} alt={user?.nome} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-brand-blue text-6xl font-black">
                                            {user?.nome.charAt(0)}
                                        </div>
                                    )
                                )}
                                {uploading && (
                                    <div className="absolute inset-0 bg-brand-dark/60 flex items-center justify-center backdrop-blur-sm">
                                        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </div>
                            <div className={`absolute bottom-6 right-6 w-8 h-8 ${statusColors[profileData.user.status]} rounded-full border-4 border-white dark:border-brand-dark shadow-lg ring-4 ring-brand-blue/20 animate-pulse`}></div>
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-4xl font-black tracking-tighter">{user?.nome}</h1>
                            <div className="flex flex-col gap-6">
                                {editing ? (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
                                        <div className="space-y-2 relative">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-blue ml-2">Seu Status Atual</label>

                                            <button
                                                type="button"
                                                onClick={() => setIsStatusOpen(!isStatusOpen)}
                                                className="w-full bg-zinc-50 dark:bg-brand-dark/80 px-6 py-4 rounded-2xl border-2 border-transparent focus:border-brand-blue/30 outline-none flex items-center justify-between transition-all shadow-inner group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-2.5 h-2.5 rounded-full ${statusColors[newStatus] || 'bg-zinc-300'} shadow-[0_0_10px_rgba(0,0,0,0.1)]`}></div>
                                                    <span className="font-bold text-sm">{newStatus}</span>
                                                </div>
                                                <svg className={`w-4 h-4 text-zinc-400 transition-transform duration-300 ${isStatusOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>

                                            {isStatusOpen && (
                                                <div className="absolute top-full left-0 right-0 mt-2 bg-white/80 dark:bg-brand-dark/90 backdrop-blur-xl border border-brand-blue/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                                    {[
                                                        { val: 'Disponível', label: 'Disponível para conversas', icon: '✅', color: 'bg-green-500' },
                                                        { val: 'Ocupado', label: 'Focado na leitura agora', icon: '🚫', color: 'bg-red-500' },
                                                        { val: 'Lendo', label: 'Lendo uma obra incrível', icon: '📖', color: 'bg-brand-blue' }
                                                    ].map((opt) => (
                                                        <button
                                                            key={opt.val}
                                                            type="button"
                                                            onClick={() => {
                                                                setNewStatus(opt.val);
                                                                setIsStatusOpen(false);
                                                            }}
                                                            className="w-full flex items-center gap-4 px-6 py-4 hover:bg-brand-blue/5 transition-colors border-b border-brand-blue/5 last:border-none group/opt"
                                                        >
                                                            <span className="text-xl">{opt.icon}</span>
                                                            <div className="text-left">
                                                                <p className={`font-bold text-sm ${newStatus === opt.val ? 'text-brand-blue' : 'text-zinc-600 dark:text-zinc-300'}`}>{opt.val}</p>
                                                                <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">{opt.label}</p>
                                                            </div>
                                                            {newStatus === opt.val && (
                                                                <div className="ml-auto w-1.5 h-1.5 bg-brand-blue rounded-full"></div>
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-purple ml-2">Sua Bio (O que te move?)</label>
                                            <textarea
                                                value={newBio}
                                                onChange={(e) => setNewBio(e.target.value)}
                                                placeholder="Conte um pouco sobre sua jornada literária..."
                                                className="w-full h-40 bg-zinc-50 dark:bg-brand-dark/80 p-6 rounded-3xl border-2 border-transparent focus:border-brand-purple/30 outline-none resize-none font-medium text-sm transition-all shadow-inner leading-relaxed"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-blue ml-2">Foto de Perfil</label>
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    onChange={handleImageUpload}
                                                    accept="image/*"
                                                    className="hidden"
                                                    id="photo-upload"
                                                    disabled={uploading}
                                                />
                                                <label
                                                    htmlFor="photo-upload"
                                                    className={`
                                                        w-full border-2 border-dashed border-brand-blue/20 rounded-2xl p-6
                                                        flex flex-col items-center justify-center gap-2 cursor-pointer
                                                        hover:bg-brand-blue/5 hover:border-brand-blue/40 transition-all
                                                        ${uploading ? 'opacity-50 pointer-events-none' : ''}
                                                    `}
                                                >
                                                    <svg className="w-8 h-8 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <span className="text-xs font-black uppercase tracking-widest text-zinc-500">
                                                        {uploading ? 'Enviando...' : 'Fazer upload da foto'}
                                                    </span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="flex gap-3 pt-2">
                                            <button
                                                onClick={handleSave}
                                                className="flex-1 py-4 bg-brand-gradient text-white rounded-2xl font-black shadow-xl shadow-brand-blue/20 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest text-xs"
                                            >
                                                Salvar Alterações
                                            </button>
                                            <button
                                                onClick={() => setEditing(false)}
                                                className="px-6 py-4 bg-zinc-100 dark:bg-brand-dark/50 text-zinc-500 rounded-2xl font-black hover:bg-zinc-200 dark:hover:bg-brand-dark transition-all uppercase tracking-widest text-[10px]"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-3">
                                            <span className="px-4 py-2 bg-brand-blue/10 rounded-xl text-brand-blue text-[10px] font-black uppercase tracking-[0.2em] border border-brand-blue/10">
                                                {profileData.user.status}
                                            </span>
                                        </div>
                                        <p className="text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed italic border-l-4 border-brand-purple/20 pl-6 py-2">
                                            {profileData.user.bio || "Nenhuma descrição adicionada ainda ao seu perfil do TramaWeb."}
                                        </p>
                                        <button
                                            onClick={() => setEditing(true)}
                                            className="w-full py-4 bg-white dark:bg-brand-dark/50 border-2 border-brand-blue/20 text-brand-blue rounded-2xl font-black hover:bg-brand-blue/5 transition-all uppercase tracking-widest text-xs"
                                        >
                                            Personalizar Perfil
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Chats Ativos */}
                        <div className="p-8 bg-zinc-50 dark:bg-brand-dark/50 rounded-[2.5rem] border border-brand-blue/10">
                            <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                                <span className="w-2 h-2 bg-brand-purple rounded-full"></span>
                                Meus Chats
                            </h3>
                            <div className="space-y-4">
                                {profileData.chats.length > 0 ? profileData.chats.map((chat: any) => (
                                    <div key={chat.id} className="flex items-center gap-4 p-3 hover:bg-white dark:hover:bg-brand-dark rounded-2xl transition-all cursor-pointer group">
                                        <div className="w-12 h-12 bg-brand-purple/10 rounded-xl flex items-center justify-center font-black text-brand-purple group-hover:bg-brand-purple group-hover:text-white transition-all">
                                            #
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">{chat.nome}</p>
                                            <p className="text-xs text-zinc-500">Ativo agora</p>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-xs text-zinc-500 italic">Você ainda não entrou em nenhum chat.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Conteúdo Principal: Listas de Leitura */}
                    <div className="lg:col-span-8 space-y-12">

                        {/* Seção: Já Lidos */}
                        <section>
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-3xl font-black tracking-tight">Já Li</h2>
                                <span className="px-4 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full text-xs font-black uppercase tracking-widest text-zinc-500">
                                    {profileData.lists.lidos.length} Livros
                                </span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {profileData.lists.lidos.map((item: any) => (
                                    <div key={item.book_id} className="group relative">
                                        <Link href={`/book/${item.book_id}`} className="space-y-3 block">
                                            <div className="aspect-[2/3] rounded-3xl overflow-hidden bg-zinc-100 dark:bg-brand-dark/50 shadow-lg group-hover:shadow-2xl transition-all group-hover:-translate-y-2">
                                                <img src={item.capa_url} alt={item.titulo} className="w-full h-full object-cover" />
                                            </div>
                                            <p className="font-bold text-sm line-clamp-1 group-hover:text-brand-blue transition-colors">{item.titulo}</p>
                                        </Link>
                                        <button
                                            onClick={() => handleRemoveBook(item.book_id)}
                                            className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110 active:scale-90"
                                            title="Remover da lista"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                                {profileData.lists.lidos.length === 0 && (
                                    <div className="col-span-full py-12 border-2 border-dashed border-zinc-200 dark:border-brand-blue/10 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 grayscale opacity-50">
                                        <div className="text-4xl">📚</div>
                                        <p className="font-bold text-zinc-500">Sua estante de lidos está vazia.</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Seção: Pretendo Ler */}
                        <section>
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-3xl font-black tracking-tight">Pretendo Ler</h2>
                                <span className="px-4 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full text-xs font-black uppercase tracking-widest text-zinc-500">
                                    {profileData.lists.pretendoLer.length} Livros
                                </span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {profileData.lists.pretendoLer.map((item: any) => (
                                    <div key={item.book_id} className="group relative">
                                        <Link href={`/book/${item.book_id}`} className="space-y-3 block">
                                            <div className="aspect-[2/3] rounded-3xl overflow-hidden bg-zinc-100 dark:bg-brand-dark/50 shadow-lg group-hover:shadow-2xl transition-all group-hover:-translate-y-2">
                                                <img src={item.capa_url} alt={item.titulo} className="w-full h-full object-cover" />
                                            </div>
                                            <p className="font-bold text-sm line-clamp-1 group-hover:text-brand-blue transition-colors">{item.titulo}</p>
                                        </Link>
                                        <button
                                            onClick={() => handleRemoveBook(item.book_id)}
                                            className="absolute top-2 right-2 w-8 h-8 bg-brand-purple text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110 active:scale-90"
                                            title="Remover da lista"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                                {profileData.lists.pretendoLer.length === 0 && (
                                    <div className="col-span-full py-12 border-2 border-dashed border-zinc-200 dark:border-brand-blue/10 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 grayscale opacity-50">
                                        <div className="text-4xl">⏳</div>
                                        <p className="font-bold text-zinc-500">Nenhum plano de leitura futuro ainda.</p>
                                    </div>
                                )}
                            </div>
                        </section>

                    </div>
                </div>
            </main>

            {/* Modal de Ajuste de Foto */}
            {showPreviewModal && tempImage && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-brand-dark/90 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-brand-dark/50 border border-brand-blue/20 rounded-[3rem] p-10 max-w-lg w-full shadow-2xl transform animate-in zoom-in-95 duration-300">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-black mb-2">Ajuste seu Perfil</h2>
                            <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest">Encaixe a imagem perfeitamente no círculo</p>
                        </div>

                        <div className="relative aspect-square w-64 mx-auto mb-8 rounded-full overflow-hidden border-4 border-brand-blue/30 shadow-2xl bg-zinc-100 dark:bg-brand-dark">
                            <img
                                src={tempImage}
                                alt="Preview"
                                className="w-full h-full object-cover transition-transform duration-100"
                                style={{ transform: `scale(${zoom})` }}
                            />
                            {/* Overlay de Guia */}
                            <div className="absolute inset-0 border-[20px] border-brand-dark/40 pointer-events-none rounded-full"></div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-brand-blue">
                                    <span>Zoom</span>
                                    <span>{Math.round(zoom * 100)}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="3"
                                    step="0.01"
                                    value={zoom}
                                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-zinc-100 dark:bg-brand-dark/80 rounded-full appearance-none cursor-pointer accent-brand-blue"
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={handleConfirmUpload}
                                    className="flex-1 py-4 bg-brand-gradient text-white rounded-2xl font-black shadow-xl shadow-brand-blue/20 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest text-xs"
                                >
                                    Confirmar e Enviar
                                </button>
                                <button
                                    onClick={() => {
                                        setShowPreviewModal(false);
                                        setTempImage(null);
                                        setSelectedFile(null);
                                    }}
                                    className="px-8 py-4 bg-zinc-100 dark:bg-brand-dark/50 text-zinc-500 rounded-2xl font-black hover:bg-zinc-200 dark:hover:bg-brand-dark transition-all uppercase tracking-widest text-[10px]"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
