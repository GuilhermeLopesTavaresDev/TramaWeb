const service = require('./service');

class ReadingListController {
    async addToList(req, res) {
        const { userId } = req.params;
        try {
            await service.addToList(userId, req.body);
            res.status(201).json({ message: 'Livro adicionado à lista!' });
        } catch (error) {
            console.error('[ReadingListController] addToList error:', error);
            res.status(400).json({ error: error.message });
        }
    }

    async removeFromList(req, res) {
        const { userId, bookId } = req.params;
        try {
            await service.removeFromList(userId, bookId);
            res.json({ message: 'Livro removido da lista!' });
        } catch (error) {
            console.error('[ReadingListController] removeFromList error:', error);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new ReadingListController();
