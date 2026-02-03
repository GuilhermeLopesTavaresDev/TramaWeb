const db = require('../config/database');

const securityController = {
    async blockUser(req, res) {
        const { userId } = req.params;
        const { blockedId } = req.body;

        if (userId == blockedId) {
            return res.status(400).json({ error: 'Você não pode bloquear a si mesmo' });
        }

        try {
            await db.query(
                'INSERT INTO bloqueios (bloqueador_id, bloqueado_id) VALUES (?, ?)',
                [userId, blockedId]
            );
            res.json({ message: 'Usuário bloqueado com sucesso' });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'Você já bloqueou este usuário' });
            }
            res.status(500).json({ error: 'Erro ao bloquear usuário' });
        }
    },

    async reportUser(req, res) {
        const { userId } = req.params;
        const { reportedId, reason } = req.body;

        if (!reason) {
            return res.status(400).json({ error: 'O motivo da denúncia é obrigatório' });
        }

        try {
            await db.query(
                'INSERT INTO denuncias (denunciante_id, denunciado_id, motivo) VALUES (?, ?, ?)',
                [userId, reportedId, reason]
            );
            res.json({ message: 'Denúncia enviada com sucesso' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao enviar denúncia' });
        }
    }
};

module.exports = securityController;
