const db = require('../../shared/database');

class FeedRepository {
    async addToFeed(userId, actorId, type, referenceId) {
        await db.query(
            'INSERT INTO user_feed (user_id, actor_id, type, reference_id) VALUES (?, ?, ?, ?)',
            [userId, actorId, type, referenceId]
        );
    }

    async getFeed(userId, limit = 20, cursor = null) {
        let query = `
            SELECT f.*, u.nome as actor_nome, u.foto_url as actor_foto 
            FROM user_feed f
            JOIN usuarios u ON f.actor_id = u.id
            WHERE f.user_id = ?
        `;
        const params = [userId];

        if (cursor) {
            query += ' AND (f.created_at < ? OR (f.created_at = ? AND f.id < ?))';
            params.push(cursor.created_at, cursor.created_at, cursor.id);
        }

        query += ' ORDER BY f.created_at DESC, f.id DESC LIMIT ?';
        params.push(limit);

        const [rows] = await db.query(query, params);
        return rows;
    }
}

module.exports = new FeedRepository();
