const db = require('../config/database');

const getProfile = async (req, res) => {
    const { userId } = req.params;

    try {
        // Busca dados básicos do usuário
        const [users] = await db.execute(
            'SELECT id, nome, email, bio, foto_url, status FROM usuarios WHERE id = ?',
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const user = users[0];

        // Busca lista de leitura
        const [readingList] = await db.execute(
            'SELECT * FROM listas_leitura WHERE usuario_id = ?',
            [userId]
        );

        // Busca chats ativos
        const [chats] = await db.execute(
            `SELECT c.* FROM chats c 
             JOIN usuarios_chats uc ON c.id = uc.chat_id 
             WHERE uc.usuario_id = ?`,
            [userId]
        );

        res.json({
            user,
            lists: {
                lidos: readingList.filter(item => item.tipo === 'Lido'),
                pretendoLer: readingList.filter(item => item.tipo === 'Pretendo Ler')
            },
            chats
        });
    } catch (error) {
        console.error('--- ERRO NO GET_PROFILE ---');
        console.error('Mensagem:', error.message);
        console.error('Código:', error.code);
        console.error('---------------------------');
        res.status(500).json({ error: 'Erro ao carregar perfil: ' + error.message });
    }
};

const updateProfile = async (req, res) => {
    const { userId } = req.params;
    const { bio, foto_url, status } = req.body;

    console.log('--- REQUISIÇÃO DE ATUALIZAÇÃO ---');
    console.log('ID do Usuário:', userId);
    console.log('Dados recebidos:', { bio, foto_url, status });

    try {
        const [result] = await db.execute(
            'UPDATE usuarios SET bio = ?, foto_url = ?, status = ? WHERE id = ?',
            [bio || null, foto_url || null, status || 'Disponível', userId]
        );

        console.log('Resultado da query:', result);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado para atualização' });
        }

        res.json({ message: 'Perfil atualizado com sucesso!', affectedRows: result.affectedRows });
    } catch (error) {
        console.error('Erro detalhado ao atualizar perfil:', error);
        res.status(500).json({ error: 'Erro ao atualizar perfil: ' + error.message });
    }
};

const addToList = async (req, res) => {
    const { userId } = req.params;
    const { book_id, titulo, capa_url, tipo } = req.body;

    try {
        // Verifica se já existe
        const [exists] = await db.execute(
            'SELECT id FROM listas_leitura WHERE usuario_id = ? AND book_id = ? AND tipo = ?',
            [userId, book_id, tipo]
        );

        if (exists.length > 0) {
            return res.status(400).json({ error: 'Este livro já está na sua lista de ' + tipo });
        }

        await db.execute(
            'INSERT INTO listas_leitura (usuario_id, book_id, titulo, capa_url, tipo) VALUES (?, ?, ?, ?, ?)',
            [userId, book_id, titulo, capa_url, tipo]
        );

        res.status(201).json({ message: 'Livro adicionado à lista!' });
    } catch (error) {
        console.error('Erro ao adicionar à lista:', error);
        res.status(500).json({ error: 'Erro ao adicionar livro' });
    }
};

const removeFromList = async (req, res) => {
    const { userId, bookId } = req.params;

    try {
        await db.execute(
            'DELETE FROM listas_leitura WHERE usuario_id = ? AND book_id = ?',
            [userId, bookId]
        );

        res.json({ message: 'Livro removido da lista!' });
    } catch (error) {
        console.error('Erro ao remover da lista:', error);
        res.status(500).json({ error: 'Erro ao remover livro' });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    addToList,
    removeFromList
};
