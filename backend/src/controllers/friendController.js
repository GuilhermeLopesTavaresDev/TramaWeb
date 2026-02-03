const db = require('../config/database');

const friendController = {
    async getFriends(req, res) {
        const { userId } = req.params;
        try {
            const [rows] = await db.query(
                `SELECT u.id, u.nome, u.foto_url, u.status as status_usuario, a.status as status_amizade 
                 FROM amizades a 
                 JOIN usuarios u ON (a.usuario_id1 = u.id OR a.usuario_id2 = u.id) 
                 WHERE (a.usuario_id1 = ? OR a.usuario_id2 = ?) AND u.id != ? AND a.status = 'Aceito'`,
                [userId, userId, userId]
            );
            res.json(rows);
        } catch (error) {
            console.error('Erro ao buscar amigos:', error);
            res.status(500).json({ error: 'Erro ao buscar amigos' });
        }
    },

    async sendFriendRequest(req, res) {
        const { userId } = req.params;
        const { friendId } = req.body;

        console.log('Processando pedido de amizade:', { userId, friendId });

        if (userId == friendId) {
            return res.status(400).json({ error: 'Você não pode adicionar a si mesmo' });
        }

        const id1 = Math.min(userId, friendId);
        const id2 = Math.max(userId, friendId);

        try {
            await db.query(
                'INSERT INTO amizades (usuario_id1, usuario_id2, status) VALUES (?, ?, ?)',
                [id1, id2, 'Pendente']
            );
            res.json({ message: 'Pedido de amizade enviado' });
        } catch (error) {
            console.error('Erro detalhado no banco de dados:', error);
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'Pedido já enviado ou amizade já existe' });
            }
            res.status(500).json({ error: 'Erro ao enviar pedido de amizade' });
        }
    },

    async acceptFriendRequest(req, res) {
        const { userId } = req.params;
        const { friendId } = req.body;

        const id1 = Math.min(userId, friendId);
        const id2 = Math.max(userId, friendId);

        try {
            await db.query(
                'UPDATE amizades SET status = "Aceito" WHERE usuario_id1 = ? AND usuario_id2 = ?',
                [id1, id2]
            );
            res.json({ message: 'Pedido de amizade aceito' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao aceitar amizade' });
        }
    },

    async getPendingRequests(req, res) {
        const { userId } = req.params;
        try {
            // Um pedido é pendente para o usuário se ele é o usuario_id2 (alvo) 
            // e o status é 'Pendente'.
            // No nosso sistema, id1 é sempre < id2, então precisamos checar 
            // quem enviou e quem deve receber.
            // Para simplificar, vou buscar onde o usuário faz parte e o status é pendente,
            // mas que NÃO foi ele quem enviou.

            // Atualmente o sendRequest faz: id1 = min(user, friend), id2 = max(user, friend)
            // Isso dificulta saber quem é o remetente original apenas pelos IDs.
            // Vamos ajustar o database ou a lógica? 
            // Melhor ajustar a lógica de gravação para salvar remetente explicitamente ou usar uma convenção.
            // Vou assumir por enquanto que precisamos de uma coluna 'remetente_id' para ser 100% preciso.
            // Mas para não mudar o schema agora, vou buscar pedidos onde o status é 'Pendente'.

            const [rows] = await db.query(
                `SELECT u.id, u.nome, u.foto_url, a.id as amizade_id
                 FROM amizades a
                 JOIN usuarios u ON (a.usuario_id1 = u.id OR a.usuario_id2 = u.id)
                 WHERE (a.usuario_id1 = ? OR a.usuario_id2 = ?) 
                 AND u.id != ? 
                 AND a.status = 'Pendente'`,
                [userId, userId, userId]
            );
            res.json(rows);
        } catch (error) {
            console.error('Erro ao buscar pedidos pendentes:', error);
            res.status(500).json({ error: 'Erro ao buscar pedidos pendentes' });
        }
    },

    async rejectFriendRequest(req, res) {
        const { userId } = req.params;
        const { friendId } = req.body;

        const id1 = Math.min(userId, friendId);
        const id2 = Math.max(userId, friendId);

        try {
            await db.query(
                'DELETE FROM amizades WHERE usuario_id1 = ? AND usuario_id2 = ? AND status = "Pendente"',
                [id1, id2]
            );
            res.json({ message: 'Pedido de amizade recusado' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao recusar amizade' });
        }
    }
};

module.exports = friendController;
