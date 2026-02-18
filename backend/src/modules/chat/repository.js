const db = require('../../shared/database');

class ChatRepository {
    async findUserChats(userId) {
        const [rows] = await db.execute(
            `SELECT c.* FROM chats c 
             JOIN usuarios_chats uc ON c.id = uc.chat_id 
             WHERE uc.usuario_id = ?`,
            [userId]
        );
        return rows;
    }

    async getHistory(bookId, limit = 100) {
        const [rows] = await db.query(
            `SELECT m.*, u.nome as usuario_nome, u.foto_url as usuario_foto 
             FROM mensagens_chat m 
             JOIN usuarios u ON m.usuario_id = u.id 
             WHERE m.book_id = ? 
             ORDER BY m.criado_em ASC 
             LIMIT ?`,
            [bookId, limit]
        );
        return rows;
    }

    async saveMessage(bookId, usuarioId, conteudo) {
        const [result] = await db.query(
            'INSERT INTO mensagens_chat (book_id, usuario_id, conteudo) VALUES (?, ?, ?)',
            [bookId, usuarioId, conteudo]
        );
        return result.insertId;
    }
}

module.exports = new ChatRepository();
