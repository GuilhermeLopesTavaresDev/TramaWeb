const gateway = require('./gateway');
const repository = require('./repository');
const cache = require('../../shared/infra/cache');

class BookService {
    async getHomeData() {
        const cacheKey = 'home_books_data';
        const cached = await cache.get(cacheKey);
        if (cached) return cached;

        // Mocked curation logic moved from Controller
        const curation = {
            "Clássicos": [
                { id: 101, title: 'Dom Quixote', author: 'Miguel de Cervantes', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Publication113/v4/64/7e/1d/647e1d88-29bf-4880-870a-0402a46a9a08/9788595080757.jpg/400x400bb.jpg' },
                { id: 102, title: 'Orgulho e Preconceito', author: 'Jane Austen', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Publication123/v4/9c/61/1a/9c611a2f-6b22-5443-4d43-26bd98687258/9788544001826.jpg/400x400bb.jpg' },
                { id: 104, title: '1984', author: 'George Orwell', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Publication116/v4/65/56/67/655667e4-233c-3677-44dc-c47f7d983446/9788535914111.jpg/400x400bb.jpg' }
            ],
            "Fantasia": [
                { id: 201, title: 'O Hobbit', author: 'J.R.R. Tolkien', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Publication128/v4/28/73/0e/28730e23-74ad-f02a-0639-66c5d6484ce9/9788595086353.jpg/400x400bb.jpg' },
                { id: 202, title: 'Harry Potter e a Pedra Filosofal', author: 'J.K. Rowling', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Publication115/v4/b3/ee/48/b3ee4877-380d-85f0-621d-910408d6d6ce/9788532530789.jpg/400x400bb.jpg' }
            ]
        };

        await cache.set(cacheKey, curation, 3600); // 1 hour home cache
        return curation;
    }

    async search(term, limit) {
        if (!term) return [];
        return await gateway.search(term, limit);
    }

    async getById(id) {
        if (!id) return null;
        return await gateway.lookup(id);
    }
}

module.exports = new BookService();
