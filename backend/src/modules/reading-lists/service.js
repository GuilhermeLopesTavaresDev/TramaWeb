const repository = require('./repository');
const events = require('../../shared/events');

class ReadingListService {
    async addToList(userId, book) {
        const exists = await repository.exists(userId, book.book_id, book.tipo);
        if (exists) {
            throw new Error(`Este livro já está na sua lista de ${book.tipo}`);
        }

        await repository.add(userId, book);

        // Publish event for Feed and Stats
        events.publish('list_added', { userId, bookId: book.book_id, type: book.tipo });

        if (book.tipo === 'Lido') {
            events.publish('book_finished', { userId, bookId: book.book_id });
        }
    }

    async removeFromList(userId, bookId) {
        await repository.remove(userId, bookId);
        events.publish('list_removed', { userId, bookId });
    }
}

module.exports = new ReadingListService();
