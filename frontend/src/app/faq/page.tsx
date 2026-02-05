'use client';

import { useState } from 'react';

interface FAQItem {
    question: string;
    answer: string;
    category: string;
}

const faqs: FAQItem[] = [
    {
        category: 'Conta e Cadastro',
        question: 'Como criar uma conta no TramaWeb?',
        answer: 'Para criar sua conta, clique em "Criar Conta" na página inicial, preencha seus dados (nome, email e senha) e pronto! Você receberá um email de confirmação para ativar sua conta.',
    },
    {
        category: 'Conta e Cadastro',
        question: 'Esqueci minha senha. O que fazer?',
        answer: 'Na página de login, clique em "Esqueci minha senha". Digite seu email cadastrado e enviaremos um link para redefinir sua senha.',
    },
    {
        category: 'Conta e Cadastro',
        question: 'Posso alterar meu email cadastrado?',
        answer: 'Sim! Acesse "Configurações" no menu do seu perfil e clique em "Editar Perfil". Lá você pode atualizar seu email e outras informações.',
    },
    {
        category: 'Funcionalidades',
        question: 'Como adiciono livros à minha estante?',
        answer: 'Vá até a página "Livros", pesquise o título desejado e clique em "Adicionar à Estante". Você pode marcar como "Lido", "Lendo" ou "Quero Ler".',
    },
    {
        category: 'Funcionalidades',
        question: 'Como funciona o sistema de recomendações?',
        answer: 'Nosso algoritmo analisa seus livros favoritos, avaliações e preferências para sugerir títulos que combinam com seu gosto. Quanto mais você usa o TramaWeb, melhores ficam as recomendações!',
    },
    {
        category: 'Funcionalidades',
        question: 'Posso criar grupos de leitura privados?',
        answer: 'Sim! Vá em "Comunidades" e clique em "Criar Grupo". Você pode definir se será público ou privado e convidar amigos para participar.',
    },
    {
        category: 'Funcionalidades',
        question: 'Como encontro pessoas com gostos similares?',
        answer: 'Use a ferramenta "Descobrir Leitores" no menu. Ela mostra usuários com estantes parecidas com a sua. Você também pode filtrar por gêneros favoritos.',
    },
    {
        category: 'Privacidade e Segurança',
        question: 'Meus dados estão seguros?',
        answer: 'Sim! Utilizamos criptografia SSL e seguimos as melhores práticas de segurança. Seus dados nunca são compartilhados com terceiros sem seu consentimento. Leia nossa Política de Privacidade para mais detalhes.',
    },
    {
        category: 'Privacidade e Segurança',
        question: 'Posso tornar meu perfil privado?',
        answer: 'Sim! Nas configurações de privacidade, você pode escolher quem pode ver sua estante, avaliações e atividades. As opções são: Público, Apenas Amigos ou Privado.',
    },
    {
        category: 'Privacidade e Segurança',
        question: 'Como denuncio conteúdo inadequado?',
        answer: 'Clique nos três pontos (...) ao lado do conteúdo e selecione "Denunciar". Nossa equipe analisará em até 24 horas.',
    },
    {
        category: 'Assinatura e Pagamento',
        question: 'O TramaWeb é gratuito?',
        answer: 'Sim! O TramaWeb é 100% gratuito. Todas as funcionalidades principais estão disponíveis sem custo.',
    },
    {
        category: 'Assinatura e Pagamento',
        question: 'Existe plano premium?',
        answer: 'Atualmente não temos planos pagos, mas estamos trabalhando em recursos exclusivos para o futuro. Fique ligado nas novidades!',
    },
    {
        category: 'Suporte Técnico',
        question: 'O site não está carregando. O que fazer?',
        answer: 'Primeiro, tente limpar o cache do navegador e fazer login novamente. Se o problema persistir, entre em contato conosco pelo email noreply@tramaweb.com.',
    },
    {
        category: 'Suporte Técnico',
        question: 'Encontrei um bug. Como reporto?',
        answer: 'Envie um email para noreply@tramaweb.com com o assunto "Bug Report" descrevendo o problema, o navegador que está usando e, se possível, um print da tela.',
    },
    {
        category: 'Suporte Técnico',
        question: 'O TramaWeb funciona no celular?',
        answer: 'Sim! Nosso site é totalmente responsivo e funciona perfeitamente em smartphones e tablets. Em breve teremos aplicativos nativos para iOS e Android.',
    },
    {
        category: 'Comunidade',
        question: 'Quais são as regras da comunidade?',
        answer: 'Respeito é fundamental! Não toleramos discurso de ódio, spam, spoilers sem aviso ou qualquer comportamento que prejudique a experiência de outros leitores. Veja nossos Termos de Uso para detalhes.',
    },
    {
        category: 'Comunidade',
        question: 'Como evito spoilers?',
        answer: 'Use sempre a tag [SPOILER] antes de comentários que revelam partes importantes da história. Também recomendamos configurar filtros de spoiler nas suas preferências.',
    },
    {
        category: 'Comunidade',
        question: 'Posso promover meu livro/blog no TramaWeb?',
        answer: 'Autores e blogueiros são bem-vindos! Você pode compartilhar seu trabalho nos grupos apropriados, mas evite spam. Para parcerias oficiais, entre em contato conosco.',
    },
];

const categories = Array.from(new Set(faqs.map(faq => faq.category)));

export default function FAQPage() {
    const [activeCategory, setActiveCategory] = useState<string>('Todas');
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const filteredFAQs = activeCategory === 'Todas'
        ? faqs
        : faqs.filter(faq => faq.category === activeCategory);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
            <div className="max-w-5xl mx-auto px-4 py-16">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                        Perguntas Frequentes
                    </h1>
                    <p className="text-xl text-gray-600">
                        Encontre respostas rápidas para as dúvidas mais comuns
                    </p>
                </div>

                {/* Categorias */}
                <div className="mb-8 flex flex-wrap gap-3 justify-center">
                    <button
                        onClick={() => setActiveCategory('Todas')}
                        className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${activeCategory === 'Todas'
                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                                : 'bg-white text-gray-700 hover:shadow-md hover:scale-105'
                            }`}
                    >
                        📚 Todas
                    </button>
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${activeCategory === category
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                                    : 'bg-white text-gray-700 hover:shadow-md hover:scale-105'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* FAQs */}
                <div className="space-y-4">
                    {filteredFAQs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-purple-50 transition"
                            >
                                <div className="flex-1">
                                    <span className="text-xs font-semibold text-purple-600 mb-1 block">
                                        {faq.category}
                                    </span>
                                    <h3 className="text-lg font-bold text-gray-800">
                                        {faq.question}
                                    </h3>
                                </div>
                                <div className={`text-2xl transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''
                                    }`}>
                                    ⌄
                                </div>
                            </button>

                            {openIndex === index && (
                                <div className="px-6 pb-5 text-gray-700 leading-relaxed border-t border-gray-100 pt-4">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Não encontrou? */}
                <div className="mt-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg p-8 text-white text-center">
                    <h2 className="text-3xl font-bold mb-4">Não encontrou sua resposta?</h2>
                    <p className="text-lg mb-6">
                        Nossa equipe está pronta para ajudar! Entre em contato conosco.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/contact"
                            className="inline-block bg-white text-purple-600 px-8 py-4 rounded-full font-bold hover:shadow-xl hover:scale-105 transition-all duration-300"
                        >
                            📧 Enviar Mensagem
                        </a>
                        <a
                            href="mailto:noreply@tramaweb.com"
                            className="inline-block bg-purple-700 text-white px-8 py-4 rounded-full font-bold hover:shadow-xl hover:scale-105 transition-all duration-300"
                        >
                            ✉️ Email Direto
                        </a>
                    </div>
                </div>

                {/* Links Úteis */}
                <div className="mt-8 text-center text-gray-600">
                    <p className="mb-3">Veja também:</p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <a href="/privacy" className="text-purple-600 hover:text-purple-800 font-medium transition">
                            Política de Privacidade
                        </a>
                        <span>•</span>
                        <a href="/terms" className="text-purple-600 hover:text-purple-800 font-medium transition">
                            Termos de Uso
                        </a>
                        <span>•</span>
                        <a href="/about" className="text-purple-600 hover:text-purple-800 font-medium transition">
                            Sobre Nós
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
