const db = require('../config/database');

const savePreferences = async (req, res) => {
    const { userId, generos, temas, frequencia } = req.body;

    if (!userId || !generos) {
        return res.status(400).json({ error: 'Dados incompletos' });
    }

    try {
        // 1. Salvar as preferências
        await db.execute(
            'INSERT INTO preferencias_usuario (usuario_id, generos, temas, frequencia_leitura) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE generos = ?, temas = ?, frequencia_leitura = ?',
            [userId, JSON.stringify(generos), JSON.stringify(temas || []), frequencia, JSON.stringify(generos), JSON.stringify(temas || []), frequencia]
        );

        // 2. Marcar como completado no perfil do usuário
        await db.execute(
            'UPDATE usuarios SET preferences_completed = TRUE WHERE id = ?',
            [userId]
        );

        res.json({ message: 'Preferências salvas com sucesso!' });
    } catch (error) {
        console.error('Erro ao salvar preferências:', error);
        res.status(500).json({ error: 'Erro interno ao salvar preferências' });
    }
};

const getRecommendations = async (req, res) => {
    const { userId } = req.params;

    try {
        const [prefs] = await db.execute(
            'SELECT generos FROM preferencias_usuario WHERE usuario_id = ?',
            [userId]
        );

        if (prefs.length === 0) {
            return res.status(404).json({ error: 'Preferências não encontradas' });
        }

        const generos = JSON.parse(prefs[0].generos);
        // Aqui poderíamos ter uma lógica mais complexa de recomendação.
        // Por agora, retornamos os gêneros para o frontend fazer a busca.
        res.json({ generos });
    } catch (error) {
        console.error('Erro ao buscar recomendações:', error);
        res.status(500).json({ error: 'Erro interno ao buscar recomendações' });
    }
};

module.exports = {
    savePreferences,
    getRecommendations
};
