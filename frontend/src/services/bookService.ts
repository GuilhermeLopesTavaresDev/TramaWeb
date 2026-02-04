import { config } from '../config/api';

const API_URL = config.API_URL;

export const bookService = {
    async getBooks() {
        try {
            const response = await fetch(`${API_URL}/books`);
            if (!response.ok) throw new Error('Falha ao buscar livros');
            return await response.json();
        } catch (error) {
            console.error('Erro no bookService:', error);
            return [];
        }
    },

    async getHomeBooks() {
        // Buscar livros bem avaliados
        const topRatedRaw = await this.searchBooks('Best Seller', 50);
        const topRated = topRatedRaw
            .filter((book: any) => book.rating && book.rating >= 4.5)
            .sort((a: any, b: any) => b.rating - a.rating)
            .slice(0, 10);

        // Gêneros para a Home
        const genres = ['Clássicos', 'Fantasia', 'Suspense', 'Poesia', 'Ficção Científica'];
        const results = await Promise.all(
            genres.map(async (genre) => {
                const books = await this.searchBooks(genre);
                return { [genre]: books };
            })
        );

        return Object.assign({ '⭐ Mais Bem Avaliados': topRated }, ...results);
    },

    async searchBooks(query: string = 'literatura brasileira', limit: number = 15) {
        try {
            const url = `${API_URL}/books/search?term=${encodeURIComponent(query)}&limit=${limit}`;
            const response = await fetch(url);

            if (!response.ok) throw new Error('Falha ao buscar no Apple Books via Proxy');

            const data = await response.json();

            if (!data.results) return [];

            return data.results.map((item: any) => ({
                id: item.trackId || item.collectionId,
                title: item.trackName,
                author: item.artistName,
                rating: item.averageUserRating,
                // Aumentando a resolução da capa
                cover: item.artworkUrl100 ? item.artworkUrl100.replace('100x100bb', '400x400bb') : null
            }));
        } catch (error) {
            console.error('Erro ao buscar livros:', error);
            return [];
        }
    },

    async getStatus() {
        const response = await fetch(`${API_URL}/status`);
        return await response.json();
    },

    async getBookById(id: string) {
        try {
            const url = `${API_URL}/books/lookup/${id}`;
            const response = await fetch(url);

            if (!response.ok) throw new Error('Falha ao buscar detalhes do livro via Proxy');

            const data = await response.json();

            if (!data.results || data.results.length === 0) return null;

            const item = data.results[0];
            return {
                id: item.trackId,
                titulo: item.trackName,
                autor: item.artistName,
                capa: item.artworkUrl100 ? item.artworkUrl100.replace('100x100bb', '600x600bb') : null,
                sinopse: item.description,
                generos: item.genres,
                avaliacao: item.averageUserRating,
                totalAvaliacoes: item.userRatingCount,
                preco: item.formattedPrice,
                urlLoja: item.trackViewUrl
            };
        } catch (error) {
            console.error('Erro ao buscar detalhes do livro:', error);
            return null;
        }
    }
};

