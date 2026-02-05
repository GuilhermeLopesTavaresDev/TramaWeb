import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sobre Nós | TramaWeb',
    description: 'Conheça o TramaWeb - a rede social para leitores apaixonados. Conecte-se, compartilhe e descubra novas histórias.',
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
            <div className="max-w-4xl mx-auto px-4 py-16">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                        Sobre o TramaWeb
                    </h1>
                    <p className="text-xl text-gray-600">
                        Transformando a experiência de leitura em uma jornada social
                    </p>
                </div>

                {/* Nossa Missão */}
                <section className="mb-12 bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                        <span className="text-4xl">🎯</span>
                        Nossa Missão
                    </h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        O TramaWeb nasceu da paixão pela leitura e da crença de que as melhores histórias
                        são aquelas que compartilhamos. Nossa missão é criar uma comunidade vibrante onde
                        leitores de todo o Brasil possam se conectar, debater suas obras favoritas e
                        descobrir novas paixões literárias através de recomendações personalizadas e
                        discussões autênticas.
                    </p>
                </section>

                {/* Quem Somos */}
                <section className="mb-12 bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                        <span className="text-4xl">📚</span>
                        Quem Somos
                    </h2>
                    <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                        <p>
                            Fundado em 2026, o TramaWeb é uma plataforma brasileira dedicada a revolucionar
                            a forma como os leitores interagem com livros e entre si. Somos uma equipe de
                            desenvolvedores, designers e, acima de tudo, leitores apaixonados que acreditam
                            no poder transformador da literatura.
                        </p>
                        <p>
                            Diferente de outras plataformas, o TramaWeb foi construído especificamente para
                            o público brasileiro, com recursos que facilitam discussões em tempo real,
                            recomendações baseadas em preferências pessoais e uma comunidade acolhedora
                            para todos os tipos de leitores.
                        </p>
                    </div>
                </section>

                {/* O Que Oferecemos */}
                <section className="mb-12 bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                        <span className="text-4xl">✨</span>
                        O Que Oferecemos
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                            <h3 className="text-xl font-bold text-purple-800 mb-2">🤝 Conexões Reais</h3>
                            <p className="text-gray-700">
                                Encontre leitores com gostos similares e faça amizades que vão além das páginas.
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-xl">
                            <h3 className="text-xl font-bold text-pink-800 mb-2">💬 Discussões Vivas</h3>
                            <p className="text-gray-700">
                                Participe de debates em tempo real sobre seus livros favoritos.
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                            <h3 className="text-xl font-bold text-blue-800 mb-2">🎯 Recomendações Personalizadas</h3>
                            <p className="text-gray-700">
                                Descubra sua próxima leitura favorita com nosso sistema inteligente.
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                            <h3 className="text-xl font-bold text-green-800 mb-2">📖 Estante Virtual</h3>
                            <p className="text-gray-700">
                                Organize seus livros e compartilhe sua jornada literária.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Nossos Valores */}
                <section className="mb-12 bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                        <span className="text-4xl">💎</span>
                        Nossos Valores
                    </h2>
                    <ul className="space-y-4 text-lg text-gray-700">
                        <li className="flex items-start gap-3">
                            <span className="text-2xl">🌟</span>
                            <div>
                                <strong>Comunidade em Primeiro Lugar:</strong> Priorizamos a criação de um
                                ambiente acolhedor e respeitoso para todos os leitores.
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-2xl">🔒</span>
                            <div>
                                <strong>Privacidade e Segurança:</strong> Seus dados são protegidos e nunca
                                compartilhados sem seu consentimento.
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-2xl">🚀</span>
                            <div>
                                <strong>Inovação Constante:</strong> Estamos sempre evoluindo para oferecer
                                a melhor experiência possível.
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-2xl">📚</span>
                            <div>
                                <strong>Amor pela Leitura:</strong> Acreditamos no poder transformador dos
                                livros e na importância de compartilhar histórias.
                            </div>
                        </li>
                    </ul>
                </section>

                {/* Contato */}
                <section className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg p-8 text-white text-center">
                    <h2 className="text-3xl font-bold mb-4">Entre em Contato</h2>
                    <p className="text-lg mb-6">
                        Tem dúvidas, sugestões ou quer fazer parte da nossa comunidade?
                        Adoraríamos ouvir você!
                    </p>
                    <div className="space-y-3">
                        <p className="text-xl">
                            📧 <a href="mailto:noreply@tramaweb.com" className="underline hover:text-purple-200 transition">
                                noreply@tramaweb.com
                            </a>
                        </p>
                        <p className="text-lg opacity-90">
                            🌐 <a href="https://tramaweb.app" className="underline hover:text-purple-200 transition">
                                tramaweb.app
                            </a>
                        </p>
                    </div>
                </section>

                {/* CTA */}
                <div className="mt-12 text-center">
                    <a
                        href="/register"
                        className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300"
                    >
                        Junte-se ao TramaWeb 📚
                    </a>
                </div>
            </div>
        </div>
    );
}
