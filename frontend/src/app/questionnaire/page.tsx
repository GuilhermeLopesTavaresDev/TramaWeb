'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Questionnaire from '@/components/Questionnaire';
import Navbar from '@/components/Navbar';

export default function QuestionnairePage() {
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            router.push('/login');
            return;
        }

        const userData = JSON.parse(userStr);

        // Se já completou, não precisa estar aqui
        if (userData.preferences_completed) {
            router.push('/dashboard');
            return;
        }

        setUser(userData);
    }, [router]);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-white dark:bg-brand-dark flex flex-col pt-20">
            <Navbar />

            <main className="flex-1 flex items-center justify-center p-6 bg-zinc-50/50 dark:bg-brand-dark/20">
                <Questionnaire userId={user.id} userName={user.nome} />
            </main>

            {/* Decoração sutil de fundo */}
            <div className="fixed -bottom-24 -left-24 w-96 h-96 bg-brand-blue/10 dark:bg-brand-blue/5 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
            <div className="fixed -top-24 -right-24 w-96 h-96 bg-brand-purple/10 dark:bg-brand-purple/5 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
        </div>
    );
}
