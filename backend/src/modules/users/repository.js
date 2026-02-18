const db = require('../../shared/database');

class UserRepository {
    async findById(id) {
        const [rows] = await db.execute(
            'SELECT id, nome, email, bio, foto_url, status, preferences_completed FROM usuarios WHERE id = ?',
            [id]
        );
        return rows[0] || null;
    }

    async findByEmail(email) {
        const [rows] = await db.execute(
            'SELECT * FROM usuarios WHERE email = ?',
            [email]
        );
        return rows[0] || null;
    }

    async create(data) {
        const { nome, email, senha } = data;
        const [result] = await db.execute(
            'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
            [nome, email, senha]
        );
        return result.insertId;
    }

    async update(id, data) {
        const fields = Object.keys(data).map(k => `${k} = ?`).join(', ');
        const values = [...Object.values(data), id];
        const [result] = await db.execute(
            `UPDATE usuarios SET ${fields} WHERE id = ?`,
            values
        );
        return result.affectedRows > 0;
    }

    async checkPreferences(userId) {
        const [rows] = await db.execute(
            'SELECT 1 FROM preferencias_usuario WHERE usuario_id = ? LIMIT 1',
            [userId]
        );
        return rows.length > 0;
    }
}

module.exports = new UserRepository();
