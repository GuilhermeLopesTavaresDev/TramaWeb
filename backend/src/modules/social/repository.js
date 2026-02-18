const db = require('../../shared/database');

class SocialRepository {
    async getFriends(userId) {
        const [rows] = await db.query(
            `SELECT u.id, u.nome, u.foto_url, u.status as status_usuario, a.status as status_amizade 
             FROM amizades a 
             JOIN usuarios u ON (a.usuario_id1 = u.id OR a.usuario_id2 = u.id) 
             WHERE (a.usuario_id1 = ? OR a.usuario_id2 = ?) AND u.id != ? AND a.status = 'Aceito'`,
            [userId, userId, userId]
        );
        return rows;
    }

    async getPendingRequests(userId) {
        const [rows] = await db.query(
            `SELECT u.id, u.nome, u.foto_url, a.id as amizade_id
             FROM amizades a
             JOIN usuarios u ON (a.usuario_id1 = u.id OR a.usuario_id2 = u.id)
             WHERE (a.usuario_id1 = ? OR a.usuario_id2 = ?) 
             AND u.id != ? 
             AND a.status = 'Pendente'`,
            [userId, userId, userId]
        );
        return rows;
    }

    async addFriendship(id1, id2, status = 'Pendente') {
        await db.query(
            'INSERT INTO amizades (usuario_id1, usuario_id2, status) VALUES (?, ?, ?)',
            [id1, id2, status]
        );
    }

    async updateStatus(id1, id2, status) {
        await db.query(
            'UPDATE amizades SET status = ? WHERE usuario_id1 = ? AND usuario_id2 = ?',
            [status, id1, id2]
        );
    }

    async deleteFriendship(id1, id2) {
        await db.query(
            'DELETE FROM amizades WHERE usuario_id1 = ? AND usuario_id2 = ?',
            [id1, id2]
        );
    }

    async getFriendship(userId, friendId) {
        const id1 = Math.min(userId, friendId);
        const id2 = Math.max(userId, friendId);
        const [rows] = await db.query(
            'SELECT * FROM amizades WHERE usuario_id1 = ? AND usuario_id2 = ?',
            [id1, id2]
        );
        return rows[0] || null;
    }
}

module.exports = new SocialRepository();
