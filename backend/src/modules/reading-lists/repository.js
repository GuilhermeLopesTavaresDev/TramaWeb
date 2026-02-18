const db = require('../../shared/database');

class ReadingListRepository {
    async findByUserId(userId) {
        const [rows] = await db.execute(
            'SELECT * FROM listas_leitura WHERE usuario_id = ?',
            [userId]
        );
        return rows;
    }

    async exists(userId, bookId, type) {
        const [rows] = await db.execute(
            'SELECT id FROM listas_leitura WHERE usuario_id = ? AND book_id = ? AND tipo = ?',
            [userId, bookId, type]
        );
        return rows.length > 0;
    }

    async add(userId, book) {
        const { book_id, titulo, capa_url, tipo } = book;
        await db.execute(
            'INSERT INTO listas_leitura (usuario_id, book_id, titulo, capa_url, tipo) VALUES (?, ?, ?, ?, ?)',
            [userId, book_id, titulo, capa_url, tipo]
        );
    }

    async remove(userId, bookId) {
        await db.execute(
            'DELETE FROM listas_leitura WHERE usuario_id = ? AND book_id = ?',
            [userId, bookId]
        );
    }
}

module.exports = new ReadingListRepository();
