const repository = require('./repository');
const events = require('../../shared/events');
const cache = require('../../shared/infra/cache');

class SocialService {
    async getFriends(userId) {
        return await repository.getFriends(userId);
    }

    async getPendingRequests(userId) {
        return await repository.getPendingRequests(userId);
    }

    async sendRequest(userId, friendId) {
        if (userId == friendId) throw new Error('Você não pode adicionar a si mesmo');

        const existing = await repository.getFriendship(userId, friendId);
        if (existing) throw new Error('Pedido já enviado ou amizade já existe');

        const id1 = Math.min(userId, friendId);
        const id2 = Math.max(userId, friendId);

        await repository.addFriendship(id1, id2, 'Pendente');

        events.publish('friend_request_sent', { userId, friendId });
    }

    async acceptRequest(userId, friendId) {
        const id1 = Math.min(userId, friendId);
        const id2 = Math.max(userId, friendId);

        await repository.updateStatus(id1, id2, 'Aceito');

        // Invalidate cache
        await cache.delete(`profile_${userId}`);
        await cache.delete(`profile_${friendId}`);

        events.publish('user_followed', { userId, friendId }); // For feed
    }

    async rejectRequest(userId, friendId) {
        const id1 = Math.min(userId, friendId);
        const id2 = Math.max(userId, friendId);
        await repository.deleteFriendship(id1, id2);
    }
}

module.exports = new SocialService();
