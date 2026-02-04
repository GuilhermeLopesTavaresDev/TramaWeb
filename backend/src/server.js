require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const path = require('path');
const fs = require('fs');

const app = express();
app.set('trust proxy', 1); // Confia no Nginx para identificar HTTPS
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
    path: '/socket.io'
});

const chatController = require('./controllers/chatController');
const privateChatController = require('./controllers/privateChatController');
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use((req, res, next) => {
    console.log(`[DEBUG] Request: ${req.method} ${req.url}`);
    next();
});
app.use(express.json());

// Servir arquivos de upload (Fora do repositório em produção)
const EXTERNAL_PATH = '/var/www/uploads';
const LOCAL_PATH = path.join(__dirname, '../uploads');
const finalUploadDir = fs.existsSync(EXTERNAL_PATH) ? EXTERNAL_PATH : LOCAL_PATH;

console.log('[DEBUG] Servindo /uploads de:', finalUploadDir);
app.use('/uploads', express.static(finalUploadDir));

// Routes
app.use('/api', routes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            error: 'O arquivo é muito grande. O limite máximo é de 10MB.'
        });
    }

    if (err.message === 'Apenas imagens (JPG, PNG, WEBP) são permitidas!') {
        return res.status(400).json({
            error: err.message
        });
    }

    console.error('Erro não tratado:', err);
    res.status(500).json({
        error: 'Ocorreu um erro interno no servidor.'
    });
});

app.get('/', (req, res) => {
    res.send('TramaWeb API Running');
});


// Socket.io Logic
io.on('connection', (socket) => {
    console.log('Um usuário se conectou:', socket.id);

    socket.on('join_room', (bookId) => {
        socket.join(bookId);
        console.log(`Usuário ${socket.id} entrou na sala do livro: ${bookId}`);
    });

    socket.on('send_message', async (data) => {
        const { bookId, usuarioId, conteudo } = data;
        try {
            const savedMessage = await chatController.saveMessage(bookId, usuarioId, conteudo);
            io.to(bookId).emit('receive_message', savedMessage);
        } catch (error) {
            console.error('Erro ao processar mensagem socket:', error);
        }
    });

    // Salas Pessoais para Notificações Gerais
    socket.on('join_personal_room', (data) => {
        const userId = Number(data.userId);
        if (isNaN(userId)) return;
        const personalRoom = `user_${userId}`;
        socket.join(personalRoom);
        console.log(`[DEBUG] Usuário ${socket.id} (ID: ${userId}) entrou na sala de notificações: ${personalRoom}`);
    });

    // Chat Privado
    socket.on('join_private_room', (data) => {
        const userId = Number(data.userId);
        const friendId = Number(data.friendId);
        if (isNaN(userId) || isNaN(friendId)) return;

        const id1 = Math.min(userId, friendId);
        const id2 = Math.max(userId, friendId);
        const roomId = `p2p_${id1}_${id2}`;
        socket.join(roomId);
        console.log(`[DEBUG] Usuário ${socket.id} (ID: ${userId}) entrou na sala privada: ${roomId}`);
    });

    socket.on('send_private_message', async (data) => {
        const remetenteId = Number(data.remetenteId);
        const destinatarioId = Number(data.destinatarioId);
        const { conteudo } = data;

        if (isNaN(remetenteId) || isNaN(destinatarioId)) {
            console.error('[ERRO] IDs inválidos na mensagem privada:', data);
            return;
        }

        const id1 = Math.min(remetenteId, destinatarioId);
        const id2 = Math.max(remetenteId, destinatarioId);
        const roomId = `p2p_${id1}_${id2}`;
        const recipientRoom = `user_${destinatarioId}`;

        console.log(`[DEBUG] Mensagem de ${remetenteId} para ${destinatarioId} (Sala: ${roomId}, Destinatário: ${recipientRoom})`);

        try {
            const savedMessage = await privateChatController.saveMessage(remetenteId, destinatarioId, conteudo);

            // Envia para a sala P2P (para quem está com o chat aberto)
            io.to(roomId).emit('receive_private_message', savedMessage);

            // Envia para a sala pessoal do destinatário (notificação global)
            io.to(recipientRoom).emit('private_message_notification', {
                ...savedMessage,
                from_id: remetenteId
            });

            console.log(`[DEBUG] Mensagem entregue via ${roomId} e ${recipientRoom}`);
        } catch (error) {
            console.error('[ERRO] Falha ao processar mensagem privada socket:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('Usuário desconectado:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
