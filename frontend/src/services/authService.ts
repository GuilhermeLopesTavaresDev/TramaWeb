const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';

// Debug: Log API URL configuration
console.log('🔍 [authService] NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
console.log('🔍 [authService] Final API_URL:', API_URL);
console.log('🔍 [authService] All env vars:', Object.keys(process.env).filter(k => k.startsWith('NEXT_PUBLIC')));

export const authService = {
    async register(userData: { nome: string; email: string; senha: string }) {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro ao realizar cadastro');
        }

        return data;
    },

    async login(credentials: { email: string; senha: string }) {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro ao realizar login');
        }

        return data;
    }
};
