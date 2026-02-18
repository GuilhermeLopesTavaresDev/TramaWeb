const service = require('./service');

class SocialController {
    async getFriends(req, res) {
        const { userId } = req.params;
        try {
            const data = await service.getFriends(userId);
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getPending(req, res) {
        const { userId } = req.params;
        try {
            const data = await service.getPendingRequests(userId);
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async sendRequest(req, res) {
        const { userId } = req.params;
        const { friendId } = req.body;
        try {
            await service.sendRequest(userId, friendId);
            res.json({ message: 'Pedido de amizade enviado' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async acceptRequest(req, res) {
        const { userId } = req.params;
        const { friendId } = req.body;
        try {
            await service.acceptRequest(userId, friendId);
            res.json({ message: 'Pedido de amizade aceito' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async rejectRequest(req, res) {
        const { userId } = req.params;
        const { friendId } = req.body;
        try {
            await service.rejectRequest(userId, friendId);
            res.json({ message: 'Pedido de amizade recusado' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new SocialController();
