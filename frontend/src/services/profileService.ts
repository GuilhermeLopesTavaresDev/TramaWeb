import { config } from '../config/api';

const API_URL = config.API_URL;

export const profileService = {
    async getProfile(userId: number) {
        // Adiciona timestamp para evitar cache do navegador (browser caching issue fix)
        const response = await fetch(`${API_URL}/profile/${userId}?t=${Date.now()}`);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Falha ao buscar perfil');
        }
        return response.json();
    },


    async updateProfile(userId: number, data: { bio: string; foto_url: string; status: string }) {
        const response = await fetch(`${API_URL}/profile/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Falha ao atualizar perfil');
        return response.json();
    },

    async addToList(userId: number, bookData: { book_id: string; titulo: string; capa_url: string; tipo: 'Lido' | 'Pretendo Ler' }) {
        const response = await fetch(`${API_URL}/profile/${userId}/list`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookData)
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Falha ao adicionar livro');
        }
        return response.json();
    },


    async removeFromList(userId: number, bookId: string) {
        const response = await fetch(`${API_URL}/profile/${userId}/list/${bookId}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Falha ao remover livro');
        return response.json();
    },

    async uploadImage(file: File) {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch(`${API_URL}/upload/image`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Falha no upload da imagem');
        }

        return response.json();
    }
};
