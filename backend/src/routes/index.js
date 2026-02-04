const express = require('express');
const router = express.Router();

const bookController = require('../controllers/bookController');

const userController = require('../controllers/userController');
const userProfileController = require('../controllers/userProfileController');
const uploadController = require('../controllers/uploadController');
const chatController = require('../controllers/chatController');
const friendController = require('../controllers/friendController');
const securityController = require('../controllers/securityController');
const privateChatController = require('../controllers/privateChatController');

router.get('/status', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// Rota de Upload
router.post('/upload/image', uploadController.upload.single('image'), uploadController.uploadProfileImage);

router.get('/books', bookController.getBooks);
router.post('/register', userController.register);
router.post('/login', userController.login);

// Rotas de Perfil
router.get('/profile/:userId', userProfileController.getProfile);
router.put('/profile/:userId', userProfileController.updateProfile);
router.post('/profile/:userId/list', userProfileController.addToList);
router.delete('/profile/:userId/list/:bookId', userProfileController.removeFromList);

// Novas rotas de Proxy para iTunes (Evitar CORS)
router.get('/books/search', bookController.proxySearch);
router.get('/books/lookup/:id', bookController.proxyLookup);

// Rotas de Chat
router.get('/chat/:bookId', chatController.getChatHistory);

// Rotas de Amizade
router.get('/friends/:userId', friendController.getFriends);
router.get('/friends/:userId/pending', friendController.getPendingRequests);
router.post('/friends/:userId/request', friendController.sendFriendRequest);
router.post('/friends/:userId/accept', friendController.acceptFriendRequest);
router.post('/friends/:userId/reject', friendController.rejectFriendRequest);

// Rotas de Segurança
router.post('/security/:userId/block', securityController.blockUser);
router.post('/security/:userId/report', securityController.reportUser);

// Rota de Chat Privado
router.get('/chat/private/:userId/:friendId', privateChatController.getHistory);




module.exports = router;
