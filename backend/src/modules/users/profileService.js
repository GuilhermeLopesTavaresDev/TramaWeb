const userRepository = require('./repository');
const readingListRepository = require('../reading-lists/repository');
const chatRepository = require('../chat/repository');
const storage = require('../../shared/infra/storage');
const cache = require('../../shared/infra/cache');

class ProfileService {
    async getProfile(userId) {
        const cacheKey = `profile_${userId}`;
        const cached = await cache.get(cacheKey);
        if (cached) return cached;

        const user = await userRepository.findById(userId);
        if (!user) throw new Error('User not found');

        // Business Rule: Direct check on prefs
        user.preferences_completed = (await userRepository.checkPreferences(userId)) ? 1 : 0;

        const readingList = await readingListRepository.findByUserId(userId);
        const chats = await chatRepository.findUserChats(userId);

        const profileData = {
            user,
            lists: {
                lidos: readingList.filter(item => item.tipo === 'Lido'),
                pretendoLer: readingList.filter(item => item.tipo === 'Pretendo Ler')
            },
            chats
        };

        await cache.set(cacheKey, profileData, 300); // 5 min cache
        return profileData;
    }

    async updateProfile(userId, data) {
        const { bio, foto_url, status } = data;
        const user = await userRepository.findById(userId);
        if (!user) throw new Error('User not found');

        // Cleanup old photo if new one is provided
        if (foto_url && user.foto_url && user.foto_url !== foto_url) {
            const oldFilename = user.foto_url.split('/').pop();
            await storage.delete(oldFilename);
        }

        const success = await userRepository.update(userId, {
            bio: bio || null,
            foto_url: foto_url || user.foto_url,
            status: status || 'Disponível'
        });

        if (success) {
            await cache.delete(`profile_${userId}`);
        }

        return success;
    }
}

module.exports = new ProfileService();
