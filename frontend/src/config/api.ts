// Configuração centralizada de URLs da API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';
const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '').replace('http://', 'https://') || 'http://localhost:3002';

// Debug
if (typeof window !== 'undefined') {
    console.log('🔍 [config] NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
    console.log('🔍 [config] API_BASE_URL:', API_BASE_URL);
    console.log('🔍 [config] SOCKET_URL:', SOCKET_URL);
}

export const config = {
    API_URL: API_BASE_URL,
    SOCKET_URL: SOCKET_URL,
    // Helper para construir URLs de imagens (Garante HTTPS e caminhos relativos)
    getImageUrl: (path: string) => {
        if (!path) return '';
        // Se já for um link externo (não do nosso site), retorna ele
        if (path.startsWith('http') && !path.includes('tramaweb.app') && !path.includes('31.97.166.219')) {
            return path;
        }
        // Remove domínios antigos ou inseguros para deixar apenas o caminho
        const cleanPath = path.replace(/^https?:\/\/[^\/]+/, '');
        return `${SOCKET_URL}${cleanPath}`;
    }
};
