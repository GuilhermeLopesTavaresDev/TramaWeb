const db = require('../config/database');

const chatController = {
    async getChatHistory(req, res) {
        const { bookId } = req.params;
        try {
            const [rows] = await db.query(
                `SELECT m.*, u.nome as usuario_nome, u.foto_url as usuario_foto 
                 FROM mensagens_chat m 
                 JOIN usuarios u ON m.usuario_id = u.id 
                 WHERE m.book_id = ? 
                 ORDER BY m.criado_em ASC 
                 LIMIT 100`,
                [bookId]
            );
            res.json(rows);
        } catch (error) {
            console.error('Erro ao buscar histórico de chat:', error);
            res.status(500).json({ error: 'Erro ao buscar histórico de chat' });
        }
    },

    async saveMessage(bookId, usuarioId, conteudo) {
        console.log(`Backend: Salvando mensagem para o livro ${bookId}, usuário ${usuarioId}`);
        try {
            const [result] = await db.query(
                'INSERT INTO mensagens_chat (book_id, usuario_id, conteudo) VALUES (?, ?, ?)',
                [bookId, usuarioId, conteudo]
            );

            console.log('Backend: Mensagem salva no BD. Buscando dados do usuário...');
            // Buscar dados do usuário para retornar no socket
            const [userRows] = await db.query(
                'SELECT nome as usuario_nome, foto_url as usuario_foto FROM usuarios WHERE id = ?',
                [usuarioId]
            );

            if (userRows.length === 0) {
                throw new Error('Usuário não encontrado ao salvar mensagem no chat');
            }

            const message = {
                id: result.insertId,
                book_id: bookId,
                usuario_id: usuarioId,
                conteudo: conteudo,
                usuario_nome: userRows[0].usuario_nome,
                usuario_foto: userRows[0].usuario_foto,
                criado_em: new Date()
            };
            console.log('Backend: Mensagem pronta para emitir:', message);
            return message;
        } catch (error) {
            console.error('Erro ao salvar mensagem no chat:', error);
            throw error;
        }
    }
};

module.exports = chatController;
