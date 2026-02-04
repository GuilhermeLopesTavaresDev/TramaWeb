'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { config } from '@/config/api';
import { useToast } from '@/context/ToastContext';

interface QuestionnaireProps {
    userId: number;
    userName: string;
}

export default function Questionnaire({ userId, userName }: QuestionnaireProps) {
    const [step, setStep] = useState(1);
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
    const [frequency, setFrequency] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { showToast } = useToast();

    const genres = [
        'Fantasia', 'Ficção Científica', 'Suspense', 'Romance',
        'Terror', 'História', 'Biografia', 'Poesia',
        'Clássicos', 'Drama', 'Aventura', 'Autoajuda'
    ];

    const themes = [
        'Mistérios', 'Magia', 'Distopia', 'Crimes Reais',
        'Amadurecimento', 'Política', 'Filosofia', 'Tecnologia'
    ];

    const frequencies = [
        'Diariamente', 'Algumas vezes por semana', 'Uma vez por semana', 'Raramente'
    ];

    const toggleItem = (item: string, list: string[], setList: (val: string[]) => void) => {
        if (list.includes(item)) {
            setList(list.filter(i => i !== item));
        } else {
            setList([...list, item]);
        }
    };

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const handleSubmit = async () => {
        if (!frequency) {
            showToast('Por favor, selecione sua frequência de leitura', 'error');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${config.API_URL}/profile/preferences`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    generos: selectedGenres,
                    temas: selectedThemes,
                    frequencia: frequency
                })
            });

            if (response.ok) {
                const userStr = localStorage.getItem('user');
                if (userStr) {
                    const userData = JSON.parse(userStr);
                    userData.preferences_completed = true;
                    localStorage.setItem('user', JSON.stringify(userData));
                    window.dispatchEvent(new Event('storage'));
                }

                showToast('Perfil configurado com sucesso! Bem-vindo(a) à sua TRAMA.', 'success');
                // Não redirecionamos, o próprio Navbar vai fechar o modal
            } else {
                throw new Error('Falha ao salvar preferências');
            }
        } catch (error) {
            console.error(error);
            showToast('Erro ao salvar suas preferências. Tente novamente.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-6 bg-brand-dark/95 backdrop-blur-xl animate-in fade-in duration-500">
            <div className="w-full max-w-2xl bg-white dark:bg-brand-dark border border-zinc-100 dark:border-brand-blue/10 rounded-[3rem] p-8 md:p-12 shadow-2xl overflow-y-auto max-h-[90vh] relative">

                {/* Header */}
                <header className="text-center mb-12">
                    <div className="flex justify-center gap-2 mb-6">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${step >= s ? 'w-8 bg-brand-blue' : 'w-4 bg-zinc-200 dark:bg-brand-blue/10'}`} />
                        ))}
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-brand-dark dark:text-zinc-50 uppercase">
                        Olá, <span className="text-brand-purple">{userName}</span>!
                    </h2>
                    <p className="text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest text-[0.7rem] mt-2">
                        Vamos personalizar sua experiência
                    </p>
                </header>

                {/* Step 1: Genres */}
                {step === 1 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="text-center">
                            <h3 className="text-xl font-black text-brand-dark dark:text-zinc-50 uppercase tracking-tight">Quais gêneros mais te atraem?</h3>
                            <p className="text-xs text-zinc-400 font-medium mt-1">Selecione pelo menos 3 para uma recomendação precisa</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {genres.map(genre => (
                                <button
                                    key={genre}
                                    onClick={() => toggleItem(genre, selectedGenres, setSelectedGenres)}
                                    className={`px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 border-2 ${selectedGenres.includes(genre)
                                            ? 'bg-brand-blue border-brand-blue text-white shadow-lg shadow-brand-blue/20'
                                            : 'bg-zinc-50 dark:bg-brand-dark/50 border-zinc-100 dark:border-brand-blue/10 text-zinc-400 hover:border-brand-blue/30'
                                        }`}
                                >
                                    {genre}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 2: Themes */}
                {step === 2 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="text-center">
                            <h3 className="text-xl font-black text-brand-dark dark:text-zinc-50 uppercase tracking-tight">E o que você gosta de encontrar nas histórias?</h3>
                            <p className="text-xs text-zinc-400 font-medium mt-1">Isso nos ajuda a entender o "tom" das tramas</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {themes.map(theme => (
                                <button
                                    key={theme}
                                    onClick={() => toggleItem(theme, selectedThemes, setSelectedThemes)}
                                    className={`px-4 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 border-2 ${selectedThemes.includes(theme)
                                            ? 'bg-brand-purple border-brand-purple text-white shadow-lg shadow-brand-purple/20'
                                            : 'bg-zinc-50 dark:bg-brand-dark/50 border-zinc-100 dark:border-brand-blue/10 text-zinc-400 hover:border-brand-purple/30'
                                        }`}
                                >
                                    {theme}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 3: Frequency */}
                {step === 3 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="text-center">
                            <h3 className="text-xl font-black text-brand-dark dark:text-zinc-50 uppercase tracking-tight">Com que frequência você lê?</h3>
                            <p className="text-xs text-zinc-400 font-medium mt-1">Queremos acompanhar seu ritmo</p>
                        </div>
                        <div className="space-y-3">
                            {frequencies.map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFrequency(f)}
                                    className={`w-full px-6 py-5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all duration-300 border-2 text-left flex items-center justify-between ${frequency === f
                                            ? 'bg-brand-gradient border-transparent text-white shadow-xl'
                                            : 'bg-zinc-50 dark:bg-brand-dark/50 border-zinc-100 dark:border-brand-blue/10 text-zinc-400 hover:border-brand-blue/30'
                                        }`}
                                >
                                    {f}
                                    {frequency === f && (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer Navigation */}
                <footer className="mt-12 flex items-center justify-between gap-4">
                    {step > 1 ? (
                        <button
                            onClick={handleBack}
                            className="px-8 py-4 text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-brand-dark dark:hover:text-zinc-50 transition-colors"
                        >
                            Voltar
                        </button>
                    ) : <div />}

                    {step < 3 ? (
                        <button
                            onClick={handleNext}
                            disabled={step === 1 && selectedGenres.length < 3}
                            className="px-10 py-4 bg-brand-dark dark:bg-brand-blue text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-50 disabled:scale-100"
                        >
                            Próximo
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="px-10 py-4 bg-brand-gradient text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-brand-blue/20 disabled:opacity-50"
                        >
                            {loading ? 'Finalizando...' : 'Começar minha jornada'}
                        </button>
                    )}
                </footer>
            </div>
        </div>
    );
}
