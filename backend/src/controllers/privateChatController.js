const db = require('../config/database');

const privateChatController = {
    async getHistory(req, res) {
        const { userId, friendId } = req.params;
        try {
            const [rows] = await db.query(
                `SELECT * FROM mensagens_privadas 
                 WHERE (remetente_id = ? AND destinatario_id = ?) 
                    OR (remetente_id = ? AND destinatario_id = ?) 
                 ORDER BY criado_em ASC`,
                [userId, friendId, friendId, userId]
            );
            res.json(rows);
        } catch (error) {
            console.error('Erro ao buscar histórico privado:', error);
            res.status(500).json({ error: 'Erro ao buscar histórico' });
        }
    },

    async saveMessage(remetenteId, destinatarioId, conteudo) {
        try {
            const [result] = await db.query(
                'INSERT INTO mensagens_privadas (remetente_id, destinatario_id, conteudo) VALUES (?, ?, ?)',
                [remetenteId, destinatarioId, conteudo]
            );
            return {
                id: result.insertId,
                remetente_id: remetenteId,
                destinatario_id: destinatarioId,
                conteudo,
                criado_em: new Date()
            };
        } catch (error) {
            console.error('Erro ao salvar mensagem privada:', error);
            throw error;
        }
    }
};

module.exports = privateChatController;
