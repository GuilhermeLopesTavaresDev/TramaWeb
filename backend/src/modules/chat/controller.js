const service = require('./service');

class ChatController {
    async getHistory(req, res) {
        const { bookId } = req.params;
        try {
            const data = await service.getHistory(bookId);
            res.json(data);
        } catch (error) {
            console.error('[ChatController] getHistory error:', error);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new ChatController();
