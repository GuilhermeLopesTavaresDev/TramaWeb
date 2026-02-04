'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { bookService } from '@/services/bookService';
import Typewriter from '@/components/Typewriter';
import Cookies from 'js-cookie';
import { useLayout } from '@/context/LayoutContext';
import { config } from '@/config/api';

interface Book {
    id: string | number;
    title: string;
    author: string;
    cover: string | null;
}

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);
    const [books, setBooks] = useState<Book[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [recentBooks, setRecentBooks] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            router.push('/login');
            return;
        }
        const userData = JSON.parse(userStr);
        setUser(userData);

        // Se não completou o questionário, redireciona
        if (!userData.preferences_completed) {
            router.push('/questionnaire');
            return;
        }

        // Carregar do cookie
        const recentStr = Cookies.get('recent_books');
        if (recentStr) {
            setRecentBooks(JSON.parse(recentStr));
        }

        const fetchInitialBooks = async () => {
            try {
                let searchTerms = 'literatura brasileira';

                // Buscar recomendações se existirem
                if (userData.id) {
                    try {
                        const recResponse = await fetch(`${config.API_URL}/recommendations/${userData.id}`);
                        if (recResponse.ok) {
                            const recData = await recResponse.json();
                            if (recData.generos && recData.generos.length > 0) {
                                // Pega 2 gêneros aleatórios para a busca inicial
                                const shuffled = recData.generos.sort(() => 0.5 - Math.random());
                                searchTerms = shuffled.slice(0, 2).join(' ');
                            }
                        }
                    } catch (e) {
                        console.error('Erro ao buscar recomendações:', e);
                    }
                }

                const data = await bookService.searchBooks(searchTerms);
                setBooks(data);
            } catch (error) {
                console.error('Erro ao carregar livros:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialBooks();
    }, [router]);

    const debouncedSearch = useCallback(
        debounce(async (query: string) => {
            if (!query.trim()) {
                const data = await bookService.searchBooks('literatura brasileira');
                setBooks(data);
                setSuggestions([]);
                return;
            }

            setIsSearching(true);
            try {
                const data = await bookService.searchBooks(query);
                setBooks(data);
                setSuggestions(data.slice(0, 5));
            } catch (error) {
                console.error('Erro na busca em tempo real:', error);
            } finally {
                setIsSearching(false);
            }
        }, 500),
        []
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        setShowSuggestions(value.length > 2);
        debouncedSearch(value);
    };

    const selectSuggestion = (book: Book) => {
        setSearchQuery(book.title);
        setBooks([book]);
        setShowSuggestions(false);
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-white dark:bg-brand-dark text-brand-dark dark:text-zinc-50" onClick={() => setShowSuggestions(false)}>
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 pt-48 pb-20 transition-all duration-500">

                <header className="mb-16">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 mb-8 md:mb-12">
                        <div className="flex-1">
                            <h1 className="text-fluid-h1 font-black tracking-tighter mb-4">
                                <Typewriter text="Sua próxima" speed={100} showCursor={false} /> <br />
                                <span className="bg-brand-gradient bg-clip-text text-transparent">
                                    <Typewriter text="história." speed={100} delay={1200} showCursor={false} />
                                </span>
                            </h1>
                            <div className="text-zinc-500 dark:text-zinc-400 text-sm md:text-xl max-w-xl leading-relaxed">
                                <Typewriter
                                    text="Pesquisa em tempo real integrada à iTunes API. Comece a digitar e veja a mágica."
                                    speed={30}
                                    delay={2500}
                                    showCursor={true}
                                />
                            </div>
                        </div>

                        <div className="w-full md:max-w-md relative group" onClick={(e) => e.stopPropagation()}>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleInputChange}
                                    onFocus={() => searchQuery.length > 2 && setShowSuggestions(true)}
                                    placeholder="Pesquise por título ou autor..."
                                    className="w-full pl-12 md:pl-14 pr-6 py-4 md:py-5 bg-zinc-100 dark:bg-brand-dark/50 border-2 border-transparent focus:border-brand-blue dark:focus:border-brand-blue focus:bg-white dark:focus:bg-brand-dark rounded-2xl md:rounded-3xl outline-none transition-all text-sm md:text-lg font-medium shadow-sm group-hover:shadow-xl"
                                />
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-brand-blue transition-colors">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                    </svg>
                                </div>
                                {isSearching && (
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2">
                                        <div className="w-5 h-5 border-2 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </div>

                            {showSuggestions && suggestions.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-brand-dark border border-zinc-200 dark:border-brand-blue/30 rounded-3xl shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="p-4 border-b border-zinc-100 dark:border-brand-blue/20 bg-zinc-50/50 dark:bg-brand-dark/80">
                                        <span className="text-[0.65rem] font-black uppercase tracking-widest text-brand-blue">Sugestões rápidas</span>
                                    </div>
                                    {suggestions.map((book) => (
                                        <div
                                            key={book.id}
                                            onClick={() => selectSuggestion(book)}
                                            className="flex items-center gap-4 p-4 hover:bg-brand-blue/5 dark:hover:bg-brand-blue/10 cursor-pointer transition-colors group/item"
                                        >
                                            <div className="w-10 h-14 bg-zinc-100 dark:bg-brand-dark rounded-lg overflow-hidden flex-shrink-0">
                                                {book.cover && <img src={book.cover} className="w-full h-full object-cover" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-sm text-brand-dark dark:text-zinc-50 truncate group-hover/item:text-brand-blue">{book.title}</h4>
                                                <p className="text-xs text-zinc-400 truncate uppercase tracking-wider">{book.author}</p>
                                            </div>
                                            <svg className="w-4 h-4 text-brand-blue opacity-0 group-hover/item:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path>
                                            </svg>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full ${isSearching ? 'bg-brand-blue animate-ping' : 'bg-brand-blue'}`}></span>
                        <span className="text-xs font-black uppercase tracking-widest text-brand-blue/60">
                            {searchQuery ? `Explorando: ${searchQuery}` : 'Mais buscados hoje'}
                        </span>
                    </div>
                </header>

                {recentBooks.length > 0 && !searchQuery && (
                    <section className="mb-16 animate-in fade-in slide-in-from-left-4 duration-700">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-brand-dark dark:text-zinc-50">
                                Vistos <span className="text-brand-purple">Recentemente</span>
                            </h2>
                            <button
                                onClick={() => { Cookies.remove('recent_books'); setRecentBooks([]); }}
                                className="text-[10px] font-bold text-zinc-400 hover:text-red-500 transition-colors uppercase tracking-[0.2em]"
                            >
                                Limpar histórico
                            </button>
                        </div>
                        <div className="flex gap-4 md:gap-8 overflow-x-auto pb-6 scrollbar-none">
                            {recentBooks.map((book) => (
                                <Link
                                    key={book.id}
                                    href={`/book/${book.id}`}
                                    className="flex-shrink-0 w-24 md:w-32 group"
                                >
                                    <div className="aspect-[2/3] rounded-2xl overflow-hidden mb-3 shadow-lg group-hover:shadow-2xl group-hover:scale-105 transition-all bg-zinc-100 dark:bg-brand-dark/50">
                                        <img src={book.capa} alt={book.titulo} className="w-full h-full object-cover" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-tighter truncate group-hover:text-brand-blue transition-colors text-center">
                                        {book.titulo}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {loading && !isSearching ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                            <div key={i} className="space-y-5 animate-pulse">
                                <div className="aspect-[2/3] bg-zinc-100 dark:bg-brand-dark/50 rounded-[2.5rem]"></div>
                                <div className="space-y-2">
                                    <div className="h-6 bg-zinc-100 dark:bg-brand-dark/50 rounded-xl w-3/4 mx-auto"></div>
                                    <div className="h-4 bg-zinc-50 dark:bg-brand-dark/20 rounded-xl w-1/2 mx-auto"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : books.length > 0 ? (
                    <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-8 lg:gap-12">
                        {books.map((book) => (
                            <Link key={book.id} href={`/book/${book.id}`} className="group cursor-pointer">
                                <div className="relative aspect-[2/3] mb-3 md:mb-6 overflow-hidden rounded-2xl md:rounded-[2.5rem] shadow-xl md:shadow-2xl transition-all duration-700 group-hover:scale-[1.05] group-hover:shadow-brand-blue/20 bg-zinc-100 dark:bg-brand-dark">
                                    {book.cover ? (
                                        <img
                                            src={book.cover}
                                            alt={book.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-zinc-100 dark:bg-brand-dark/80 border-2 border-dashed border-brand-blue/20 rounded-[2.5rem]">
                                            <svg className="w-12 h-12 text-zinc-300 dark:text-brand-dark mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                                            </svg>
                                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Sem Capa</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/95 via-brand-dark/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8 text-left">
                                        <p className="text-white text-[0.6rem] font-bold uppercase tracking-[0.2em] mb-2 opacity-60">Apple Books</p>
                                        <div className="w-full py-3.5 bg-brand-gradient text-white rounded-2xl font-black text-sm transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-xl text-center">
                                            Ver Detalhes
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center px-1">
                                    <h3 className="font-black text-[10px] sm:text-xs md:text-lg leading-[1.2] mb-1 group-hover:text-brand-blue transition-colors uppercase tracking-tight line-clamp-2 min-h-[1.5rem] sm:min-h-[2.5rem] md:min-h-[3rem]">
                                        {book.title}
                                    </h3>
                                    <p className="text-[8px] md:text-[0.7rem] font-bold text-zinc-400 uppercase tracking-widest md:tracking-[0.15em] line-clamp-1">
                                        {book.author}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </section>
                ) : (
                    <div className="py-20 text-center space-y-4">
                        <h3 className="text-2xl font-black text-brand-dark dark:text-zinc-50">Nenhum livro encontrado</h3>
                        <p className="text-zinc-500 dark:text-zinc-400">Tente pesquisar por outro título ou um autor diferente.</p>
                    </div>
                )}
            </main>

            {/* Decoração sutil */}
            <div className="fixed -bottom-24 -left-24 w-96 h-96 bg-brand-blue/10 dark:bg-brand-blue/5 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
            <div className="fixed -top-24 -right-24 w-96 h-96 bg-brand-purple/10 dark:bg-brand-purple/5 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
        </div>
    );
}

function debounce(func: Function, wait: number) {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
