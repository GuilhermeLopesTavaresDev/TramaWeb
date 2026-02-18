const service = require('./service');

class FeedController {
    async getFeed(req, res) {
        const { userId } = req.params;
        const { limit = 20, last_id, last_date } = req.query;

        let cursor = null;
        if (last_id && last_date) {
            cursor = { id: parseInt(last_id), created_at: last_date };
        }

        try {
            const feed = await service.getFeed(userId, parseInt(limit), cursor);
            res.json(feed);
        } catch (error) {
            console.error('[FeedController] getFeed error:', error);
            res.status(500).json({ error: 'Erro ao carregar feed' });
        }
    }
}

module.exports = new FeedController();
