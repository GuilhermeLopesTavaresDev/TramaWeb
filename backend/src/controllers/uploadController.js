const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuração da pasta de uploads (Fora do repositório em produção)
console.log('--- DIAGNÓSTICO DE ARMAZENAMENTO ---');
const EXTERNAL_PATH = '/var/www/uploads';
const LOCAL_PATH = path.join(__dirname, '../../uploads');

// Se a pasta externa existir, usa ela. Caso contrário, usa a local.
const uploadDir = fs.existsSync(EXTERNAL_PATH) ? EXTERNAL_PATH : LOCAL_PATH;

console.log('Ambiente:', process.env.NODE_ENV || 'não definido');
console.log('Pasta Destino:', uploadDir);

if (!fs.existsSync(uploadDir)) {
    console.log('Criando pasta:', uploadDir);
    try {
        fs.mkdirSync(uploadDir, { recursive: true });
    } catch (err) {
    }
}
console.log('-----------------------------------');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Nome único para evitar conflitos: timestamp-nomeoriginal
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB conforme solicitado
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Apenas imagens (JPG, PNG, WEBP) são permitidas!'));
        }
    }
});

const uploadProfileImage = async (req, res) => {
    console.log('--- REQUISIÇÃO DE UPLOAD RECEBIDA ---');
    try {
        if (!req.file) {
            console.error('Nenhum arquivo enviado no req.file');
            return res.status(400).json({ error: 'Nenhum arquivo enviado' });
        }

        console.log('Arquivo salvo:', req.file.filename);
        console.log('Caminho:', req.file.path);

        // Gera a URL completa para o banco de dados
        const protocol = req.protocol;
        const host = req.get('host');
        const imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

        console.log('URL Gerada:', imageUrl);
        res.json({ imageUrl });
    } catch (error) {
        console.error('Erro no upload:', error);
        res.status(500).json({ error: 'Erro interno no upload' });
    }
};

module.exports = {
    upload,
    uploadProfileImage
};
