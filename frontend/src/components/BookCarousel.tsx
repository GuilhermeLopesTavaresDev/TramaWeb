'use client';

import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';

interface Book {
    id: number;
    title: string;
    author: string;
    cover: string;
    rating?: number;
}

interface BookCarouselProps {
    title: string;
    books: Book[];
}

export default function BookCarousel({ title, books }: BookCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            if (scrollRef.current && !isPaused) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

                // Se chegou perto do fim, voltar ao início suavemente
                if (scrollLeft + clientWidth >= scrollWidth - 10) {
                    scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    // Scrollar uma quantidade fixa
                    scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
                }
            }
        }, 3000); // Passa a cada 3 segundos

        return () => clearInterval(interval);
    }, [isPaused]);

    return (
        <div
            className="w-full max-w-[95rem] mx-auto py-8 text-left"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="flex items-end justify-between mb-8 px-6 md:px-12">
                <h2 className="text-2xl md:text-3xl font-black text-brand-dark dark:text-zinc-50 uppercase tracking-tighter">
                    {title}
                </h2>
                <div className="hidden md:flex gap-1">
                    <div className={`w-2 h-2 rounded-full ${!isPaused ? 'bg-brand-blue animate-pulse' : 'bg-zinc-300 dark:bg-zinc-700'}`}></div>
                    <div className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700"></div>
                    <div className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700"></div>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-8 overflow-x-auto px-6 md:px-12 pb-12 snap-x snap-mandatory scrollbar-none scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {books.map((book) => (
                    <Link
                        href={`/book/${book.id}`}
                        key={book.id}
                        className="flex-shrink-0 w-44 md:w-56 snap-start group relative transition-all duration-500 hover:scale-105 z-0 hover:z-10"
                    >
                        {/* Efeito de brilho no fundo (Glow) */}
                        <div className="absolute -inset-1 bg-brand-gradient rounded-2xl blur opacity-0 group-hover:opacity-40 transition duration-500"></div>

                        <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-xl transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-brand-blue/20 bg-zinc-200 dark:bg-zinc-800">
                            <img
                                src={book.cover}
                                alt={book.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                loading="lazy"
                            />

                            {/* Overlay Moderno */}
                            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-brand-dark/95 via-brand-dark/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                {book.rating && (
                                    <div className="flex items-center justify-center gap-1 mb-2 text-yellow-400 drop-shadow-md">
                                        <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                                        <span className="text-xs font-black text-white">{book.rating.toFixed(1)}</span>
                                    </div>
                                )}
                                <span className="inline-block w-full py-2 bg-white text-brand-dark text-[0.65rem] font-black uppercase tracking-widest rounded-lg text-center shadow-lg hover:bg-brand-blue hover:text-white transition-colors">
                                    Ver Livro
                                </span>
                            </div>
                        </div>

                        <div className="mt-4 px-1 text-center md:text-left">
                            <h3 className="text-base font-black text-brand-dark dark:text-zinc-50 leading-tight line-clamp-1 group-hover:text-brand-blue transition-colors">
                                {book.title}
                            </h3>
                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest truncate mt-1">
                                {book.author}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
