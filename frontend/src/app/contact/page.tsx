'use client';

import { useState } from 'react';
import type { Metadata } from 'next';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');

        // Simular envio (você pode implementar backend depois)
        setTimeout(() => {
            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
            setTimeout(() => setStatus('idle'), 3000);
        }, 1000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
            <div className="max-w-5xl mx-auto px-4 py-16">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                        Entre em Contato
                    </h1>
                    <p className="text-xl text-gray-600">
                        Estamos aqui para ajudar! Envie sua mensagem e responderemos em breve.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Formulário */}
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Envie uma Mensagem</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Nome Completo *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                    placeholder="Seu nome"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                    placeholder="seu@email.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                    Assunto *
                                </label>
                                <select
                                    id="subject"
                                    name="subject"
                                    required
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                >
                                    <option value="">Selecione um assunto</option>
                                    <option value="suporte">Suporte Técnico</option>
                                    <option value="sugestao">Sugestão</option>
                                    <option value="parceria">Parceria</option>
                                    <option value="duvida">Dúvida</option>
                                    <option value="outro">Outro</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                    Mensagem *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={6}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition resize-none"
                                    placeholder="Escreva sua mensagem aqui..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'sending'}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-bold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {status === 'sending' ? 'Enviando...' : 'Enviar Mensagem 📧'}
                            </button>

                            {status === 'success' && (
                                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                                    ✅ Mensagem enviada com sucesso! Responderemos em breve.
                                </div>
                            )}

                            {status === 'error' && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                                    ❌ Erro ao enviar mensagem. Tente novamente ou envie um email diretamente.
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Informações de Contato */}
                    <div className="space-y-6">
                        {/* Email */}
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <div className="flex items-start gap-4">
                                <div className="text-4xl">📧</div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">Email</h3>
                                    <a
                                        href="mailto:noreply@tramaweb.com"
                                        className="text-purple-600 hover:text-purple-800 transition text-lg"
                                    >
                                        noreply@tramaweb.com
                                    </a>
                                    <p className="text-gray-600 mt-2 text-sm">
                                        Respondemos em até 24 horas úteis
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Redes Sociais */}
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <div className="flex items-start gap-4">
                                <div className="text-4xl">🌐</div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">Redes Sociais</h3>
                                    <p className="text-gray-600 mb-3">Siga-nos para novidades e atualizações</p>
                                    <div className="space-y-2">
                                        <a href="https://tramaweb.app" className="block text-purple-600 hover:text-purple-800 transition">
                                            🌍 tramaweb.app
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Horário de Atendimento */}
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <div className="flex items-start gap-4">
                                <div className="text-4xl">⏰</div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">Horário de Atendimento</h3>
                                    <div className="space-y-1 text-gray-700">
                                        <p>Segunda a Sexta: 9h às 18h</p>
                                        <p className="text-sm text-gray-500">Horário de Brasília (GMT-3)</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FAQ */}
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg p-8 text-white">
                            <h3 className="text-2xl font-bold mb-3">Perguntas Frequentes?</h3>
                            <p className="mb-4">
                                Antes de entrar em contato, confira nossa página de FAQ.
                                Talvez sua dúvida já esteja respondida!
                            </p>
                            <a
                                href="/faq"
                                className="inline-block bg-white text-purple-600 px-6 py-3 rounded-lg font-bold hover:shadow-xl hover:scale-105 transition-all duration-300"
                            >
                                Ver FAQ 📚
                            </a>
                        </div>
                    </div>
                </div>

                {/* Informações Adicionais */}
                <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Outras Formas de Contato</h2>
                    <div className="grid md:grid-cols-3 gap-6 text-center">
                        <div>
                            <div className="text-4xl mb-2">🐛</div>
                            <h3 className="font-bold text-gray-800 mb-1">Reportar Bug</h3>
                            <p className="text-sm text-gray-600">
                                Encontrou um problema técnico? Envie um email com o assunto "Bug Report"
                            </p>
                        </div>
                        <div>
                            <div className="text-4xl mb-2">💡</div>
                            <h3 className="font-bold text-gray-800 mb-1">Sugestões</h3>
                            <p className="text-sm text-gray-600">
                                Tem uma ideia para melhorar o TramaWeb? Adoraríamos ouvir!
                            </p>
                        </div>
                        <div>
                            <div className="text-4xl mb-2">🤝</div>
                            <h3 className="font-bold text-gray-800 mb-1">Parcerias</h3>
                            <p className="text-sm text-gray-600">
                                Interessado em parceria? Entre em contato pelo email
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
