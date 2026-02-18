const service = require('./service');

class BookController {
    async getHome(req, res) {
        try {
            const data = await service.getHomeData();
            res.json(data);
        } catch (error) {
            console.error('[BookController] Error in getHome:', error);
            res.status(500).json({ error: 'Erro ao carregar página inicial' });
        }
    }

    async search(req, res) {
        const { term, limit } = req.query;
        try {
            const results = await service.search(term, limit);
            res.json({ results });
        } catch (error) {
            console.error('[BookController] Error in search:', error);
            res.status(500).json({ error: 'Erro ao buscar livros' });
        }
    }

    async getDetails(req, res) {
        const { id } = req.params;
        try {
            const book = await service.getById(id);
            if (!book) return res.status(404).json({ error: 'Livro não encontrado' });
            res.json({ results: [book] }); // Keep compatibility with existing frontend
        } catch (error) {
            console.error('[BookController] Error in getDetails:', error);
            res.status(500).json({ error: 'Erro ao carregar detalhes do livro' });
        }
    }
}

module.exports = new BookController();
