'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { bookService } from '@/services/bookService';
import BookCarousel from '@/components/BookCarousel';
import ScrollReveal from '@/components/ScrollReveal';
import Typewriter from '@/components/Typewriter';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [booksByGenre, setBooksByGenre] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
      router.push('/dashboard');
    } else {
      bookService.getHomeBooks().then(data => setBooksByGenre(data));
    }
  }, [router]);

  if (user) return <div className="min-h-screen bg-brand-dark" />;

  // Filtrar apenas o essencial para não poluir
  const featuredGenre = booksByGenre ? booksByGenre['⭐ Mais Bem Avaliados'] : [];
  const secondaryGenre = booksByGenre ? (booksByGenre['Fantasia'] || booksByGenre['Suspense']) : [];

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-start overflow-x-hidden bg-white dark:bg-brand-dark pb-20 selection:bg-brand-blue selection:text-white">

      {/* Background Decorativo */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-brand-purple/20 rounded-full blur-[100px] opacity-50 dark:opacity-20 animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-brand-blue/20 rounded-full blur-[120px] opacity-40 dark:opacity-20"></div>
      </div>

      {/* Navbar Transparente */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center z-50 relative">
        <div className="w-80 h-24 relative opacity-90 hover:opacity-100 transition-opacity cursor-pointer flex items-center">
          <img src="/logo2..png" alt="TramaWeb" className="object-contain" />
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="px-6 py-2.5 rounded-full text-sm font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-brand-dark/50 transition-all">
            Login
          </Link>
          <Link href="/register" className="px-6 py-2.5 rounded-full text-sm font-bold bg-brand-gradient text-white shadow-lg shadow-brand-blue/20 hover:shadow-brand-blue/40 transform hover:scale-105 transition-all">
            Criar Conta
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 w-full max-w-5xl mx-auto px-6 pt-20 pb-20 flex flex-col items-center text-center">
        <ScrollReveal>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-brand-blue text-xs font-bold uppercase tracking-widest mb-8">
            <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse"></span>
            A nova era dos clubes do livro
          </div>
        </ScrollReveal>

        <div className="min-h-[160px] md:min-h-[240px] flex flex-col items-center justify-center mb-6">
          <h1 className="text-5xl md:text-7xl font-black text-brand-dark dark:text-zinc-50 tracking-tighter leading-[1.05] drop-shadow-sm">
            <Typewriter text="Leia. Debata." speed={100} showCursor={true} />
            <br />
            <span className="bg-brand-gradient bg-clip-text text-transparent">
              <Typewriter text="Viva cada página." speed={100} delay={1500} showCursor={false} />
            </span>
          </h1>
        </div>

        <ScrollReveal delay={200}>
          <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed mb-10 mx-auto">
            Não é apenas sobre ler. É sobre compartilhar o impacto de cada história.
            No TramaWeb, sua estante vira uma rede social viva.
          </p>
        </ScrollReveal>
      </section>

      {/* Destaque Principal (Top Rated) */}
      {featuredGenre && featuredGenre.length > 0 && (
        <ScrollReveal className="w-full relative z-10 mb-24">
          <BookCarousel title="Os Preferidos da Comunidade" books={featuredGenre} />
        </ScrollReveal>
      )}

      {/* Seção de Narrativa: A Importância da Interação */}
      <section className="w-full max-w-7xl mx-auto px-6 py-20 relative z-10">

        {/* Bloco 1: Debate e Teorias */}
        <div className="flex flex-col md:flex-row items-center gap-12 mb-32">
          <ScrollReveal className="flex-1 space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 flex items-center justify-center text-brand-purple mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-brand-dark dark:text-white tracking-tight">
              Nenhum leitor é uma ilha.
            </h2>
            <p className="text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Sabe aquele final que te deixou sem ar? Aquela reviravolta que você precisa contar pra alguém?
              Aqui você encontra pessoas que entenderão exatamente o que você sentiu.
              Debata teorias, xingue vilões e celebre heróis em tempo real.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={200} className="flex-1 bg-zinc-100 dark:bg-zinc-800/50 rounded-[2.5rem] p-8 aspect-video flex items-center justify-center relative overflow-hidden group">
            {/* Abstract visual mockup */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            <div className="space-y-4 w-full max-w-sm">
              <div className="bg-white dark:bg-brand-dark p-4 rounded-2xl rounded-tl-none shadow-lg transform translate-x-4">
                <p className="text-xs text-brand-purple font-bold mb-1">@leitora_voraz</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-300">Gente, o capítulo 15 mudou TUDO! Eu não acredito que ele fez isso...</p>
              </div>
              <div className="bg-brand-blue p-4 rounded-2xl rounded-tr-none shadow-lg text-white transform -translate-x-4">
                <p className="text-xs text-blue-200 font-bold mb-1">@bookstan_br</p>
                <p className="text-sm">Eu avisei!!! A pista estava lá desde o começo do livro, ninguém acreditou!</p>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Bloco 2: Conexão e Amizade */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-12 mb-32">
          <ScrollReveal className="flex-1 space-y-6 text-right md:text-left"> {/* Ajuste de alinhamento em mobile pode ser necessário, mantendo right para variedade */}
            <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-brand-blue mb-4 ml-auto md:ml-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-brand-dark dark:text-white tracking-tight">
              Faça amigos literários.
            </h2>
            <p className="text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Sua estante diz muito sobre você. O TramaWeb conecta leitores com gostos compatíveis.
              Encontre sua "book soulmate", troque recomendações que realmente valem a pena
              e construa amizades que vão além da última página.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={200} className="flex-1 bg-zinc-100 dark:bg-zinc-800/50 rounded-[2.5rem] p-8 aspect-video flex items-center justify-center relative overflow-hidden group">
            <div className="grid grid-cols-2 gap-4 w-full max-w-xs transform group-hover:scale-105 transition-transform duration-700">
              <div className="aspect-square rounded-2xl bg-zinc-200 dark:bg-zinc-700 overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center text-4xl">📚</div>
              </div>
              <div className="aspect-square rounded-2xl bg-brand-blue/20 overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center text-4xl">✨</div>
              </div>
              <div className="aspect-square rounded-2xl bg-brand-purple/20 overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center text-4xl">💭</div>
              </div>
              <div className="aspect-square rounded-2xl bg-zinc-200 dark:bg-zinc-700 overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center text-4xl">❤️</div>
              </div>
            </div>
          </ScrollReveal>
        </div>

      </section>

      {/* Segundo Carrossel (Opcional, mais sutil) */}
      {secondaryGenre && secondaryGenre.length > 0 && (
        <ScrollReveal className="w-full relative z-10 mb-24">
          <BookCarousel title="Para Explorar e Discutir" books={secondaryGenre} />
        </ScrollReveal>
      )}

      {/* CTA Final */}
      <section className="w-full max-w-4xl mx-auto px-6 text-center py-20">
        <ScrollReveal>
          <h2 className="text-4xl md:text-6xl font-black text-brand-dark dark:text-white tracking-tighter mb-8">
            Pronto para virar a página?
          </h2>
          <Link href="/register" className="inline-block px-10 py-5 rounded-full text-xl font-black bg-brand-dark dark:bg-white text-white dark:text-brand-dark hover:scale-105 transition-transform shadow-2xl">
            Entrar para o Clube
          </Link>
        </ScrollReveal>
      </section>

      {/* Footer Minimalista */}
      <footer className="w-full max-w-7xl mx-auto mt-24 px-6 py-12 border-t border-zinc-100 dark:border-zinc-800/50 flex flex-col items-center text-center z-10 relative">
        <p className="text-zinc-400 dark:text-zinc-600 text-sm font-medium">© 2026 TramaWeb. Feito para leitores.</p>
        <div className="flex gap-6 mt-4 text-xs font-bold uppercase tracking-widest text-zinc-300 dark:text-zinc-700">
          <Link href="/privacy" className="hover:text-brand-blue transition-colors">Privacidade</Link>
          <Link href="/terms" className="hover:text-brand-blue transition-colors">Termos</Link>
        </div>
      </footer>
    </main>
  );
}
