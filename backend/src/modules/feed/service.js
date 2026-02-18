const repository = require('./repository');
const socialRepository = require('../social/repository');
const events = require('../../shared/events');

class FeedService {
    constructor() {
        this._setupHandlers();
    }

    _setupHandlers() {
        events.subscribe('list_added', async (payload) => {
            const { userId, bookId, type } = payload.data;
            await this.fanOut(userId, 'list_added', bookId);
        });

        events.subscribe('book_finished', async (payload) => {
            const { userId, bookId } = payload.data;
            await this.fanOut(userId, 'book_finished', bookId);
        });

        events.subscribe('user_followed', async (payload) => {
            const { userId, friendId } = payload.data;
            // Notify the followed user
            await repository.addToFeed(friendId, userId, 'new_follower', userId);
        });
    }

    async fanOut(actorId, type, referenceId) {
        const friends = await socialRepository.getFriends(actorId);
        const fanOutPromises = friends.map(friend =>
            repository.addToFeed(friend.id, actorId, type, referenceId)
        );

        await Promise.allSettled(fanOutPromises);
        console.log(`[FeedService] Fan-out complete for ${type} by ${actorId} to ${friends.length} friends`);
    }

    async getFeed(userId, limit, cursor) {
        return await repository.getFeed(userId, limit, cursor);
    }
}

module.exports = new FeedService();
