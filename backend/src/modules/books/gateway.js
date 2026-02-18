const cache = require('../../shared/infra/cache');

class AppleBooksGateway {
    constructor() {
        this.baseUrl = 'https://itunes.apple.com';
        this.timeout = 5000;
    }

    async search(term, limit = 15) {
        const cacheKey = `apple_search_${term}_${limit}`;
        const cached = await cache.get(cacheKey);
        if (cached) return cached;

        try {
            const url = `${this.baseUrl}/search?term=${encodeURIComponent(term)}&entity=ebook&country=br&limit=${limit}`;
            const response = await this._fetchWithTimeout(url);

            if (!response.ok) throw new Error('Apple Books API failure');

            const data = await response.json();
            const results = this._mapResults(data.results);

            await cache.set(cacheKey, results, 1800); // 30 min search cache
            return results;
        } catch (error) {
            console.error('[AppleBooksGateway] Search error:', error);
            // Fallback to empty or previous cache if possible?
            return [];
        }
    }

    async lookup(id) {
        const cacheKey = `apple_book_${id}`;
        const cached = await cache.get(cacheKey);
        if (cached) return cached;

        try {
            const url = `${this.baseUrl}/lookup?id=${id}&country=br&entity=ebook`;
            const response = await this._fetchWithTimeout(url);

            if (!response.ok) throw new Error('Apple Books API failure');

            const data = await response.json();
            if (!data.results || data.results.length === 0) return null;

            const book = this._mapBookDetail(data.results[0]);
            await cache.set(cacheKey, book, 3600); // 1 hour detail cache
            return book;
        } catch (error) {
            console.error('[AppleBooksGateway] Lookup error:', error);
            return null;
        }
    }

    async _fetchWithTimeout(url) {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), this.timeout);

        try {
            return await fetch(url, { signal: controller.signal });
        } finally {
            clearTimeout(id);
        }
    }

    _mapResults(items) {
        return items.map(item => ({
            id: item.trackId || item.collectionId,
            title: item.trackName,
            author: item.artistName,
            rating: item.averageUserRating,
            cover: item.artworkUrl100 ? item.artworkUrl100.replace('100x100bb', '400x400bb') : null
        }));
    }

    _mapBookDetail(item) {
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
    }
}

module.exports = new AppleBooksGateway();
