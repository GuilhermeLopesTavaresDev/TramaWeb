// Configuração centralizada de URLs da API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';
const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3002';

// Debug
if (typeof window !== 'undefined') {
    console.log('🔍 [config] NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
    console.log('🔍 [config] API_BASE_URL:', API_BASE_URL);
    console.log('🔍 [config] SOCKET_URL:', SOCKET_URL);
}

export const config = {
    API_URL: API_BASE_URL,
    SOCKET_URL: SOCKET_URL,
    // Helper para construir URLs de imagens
    getImageUrl: (path: string) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `${SOCKET_URL}${path}`;
    }
};
