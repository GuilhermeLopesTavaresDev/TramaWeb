class CacheManager {
    constructor() {
        this.cache = new Map();
    }

    async get(key) {
        const entry = this.cache.get(key);
        if (!entry) return null;

        if (entry.expiresAt < Date.now()) {
            this.cache.delete(key);
            return null;
        }

        return entry.value;
    }

    async set(key, value, ttlSeconds = 900) { // Default 15 min
        this.cache.set(key, {
            value,
            expiresAt: Date.now() + (ttlSeconds * 1000)
        });
    }

    async delete(key) {
        this.cache.delete(key);
    }

    async flush() {
        this.cache.clear();
    }
}

module.exports = new CacheManager();
