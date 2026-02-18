const EventEmitter = require('events');

class DomainEvents extends EventEmitter {
    constructor() {
        super();
        this.log = []; // Log for re-processing/auditing as requested
    }

    publish(event, data) {
        const eventId = crypto.randomUUID?.() || Date.now().toString();
        const payload = {
            id: eventId,
            event,
            data,
            timestamp: new Date(),
            version: 1
        };

        console.log(`[EventBus] Publishing: ${event}`, payload);
        this.log.push(payload);

        // Keep log size manageable in memory
        if (this.log.length > 1000) this.log.shift();

        this.emit(event, payload);
    }

    subscribe(event, handler) {
        this.on(event, async (payload) => {
            try {
                // Idempotency check could be added here
                await handler(payload);
            } catch (error) {
                console.error(`[EventBus] Error in handler for ${event}:`, error);
            }
        });
    }
}

module.exports = new DomainEvents();
