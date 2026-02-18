const fs = require('fs');
const path = require('path');

class LocalStorageProvider {
    constructor() {
        const EXTERNAL_PATH = '/var/www/uploads';
        const LOCAL_PATH = path.join(__dirname, '../../../uploads');
        this.uploadDir = fs.existsSync(EXTERNAL_PATH) ? EXTERNAL_PATH : LOCAL_PATH;
    }

    async save(file) {
        // Multer handles the initial write to disk currently.
        // This abstraction would handle moving files or cloud uploads in the future.
        return file.filename;
    }

    async delete(filename) {
        if (!filename) return;
        const filePath = path.join(this.uploadDir, filename);

        if (fs.existsSync(filePath)) {
            return new Promise((resolve, reject) => {
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error(`[Storage] Error deleting ${filename}:`, err);
                        reject(err);
                    } else {
                        console.log(`[Storage] Deleted: ${filename}`);
                        resolve();
                    }
                });
            });
        }
    }

    getPublicUrl(filename) {
        if (!filename) return null;
        if (filename.startsWith('http')) return filename;
        return `/uploads/${filename}`;
    }
}

module.exports = new LocalStorageProvider();
