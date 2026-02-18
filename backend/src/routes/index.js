const express = require('express');
const router = express.Router();

const bookController = require('../modules/books/controller');
const authController = require('../modules/auth/controller');
const userController = require('../modules/users/controller');
const readingListController = require('../modules/reading-lists/controller');
const chatController = require('../modules/chat/controller');
const socialController = require('../modules/social/controller');
const feedController = require('../modules/feed/controller');

const uploadController = require('../controllers/uploadController');
const securityController = require('../controllers/securityController');
const privateChatController = require('../controllers/privateChatController');
const preferenceController = require('../controllers/preferenceController');

router.get('/status', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// Rota de Upload
router.post('/upload/image', uploadController.upload.single('image'), uploadController.uploadProfileImage);

router.get('/books', (req, res) => bookController.getHome(req, res));
router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));

// Rotas de Perfil
router.get('/profile/:userId', (req, res) => userController.getProfile(req, res));
router.put('/profile/:userId', (req, res) => userController.updateProfile(req, res));
router.post('/profile/:userId/list', (req, res) => readingListController.addToList(req, res));
router.delete('/profile/:userId/list/:bookId', (req, res) => readingListController.removeFromList(req, res));
router.post('/profile/preferences', preferenceController.savePreferences);
router.get('/recommendations/:userId', preferenceController.getRecommendations);

// Novas rotas de Proxy para iTunes (Evitar CORS)
router.get('/books/search', (req, res) => bookController.search(req, res));
router.get('/books/lookup/:id', (req, res) => bookController.getDetails(req, res));

// Rotas de Chat
router.get('/chat/:bookId', (req, res) => chatController.getHistory(req, res));

// Rotas de Amizade
router.get('/friends/:userId', (req, res) => socialController.getFriends(req, res));
router.get('/friends/:userId/pending', (req, res) => socialController.getPending(req, res));
router.post('/friends/:userId/request', (req, res) => socialController.sendRequest(req, res));
router.post('/friends/:userId/accept', (req, res) => socialController.acceptRequest(req, res));
router.post('/friends/:userId/reject', (req, res) => socialController.rejectRequest(req, res));

// Rota de Feed
router.get('/feed/:userId', (req, res) => feedController.getFeed(req, res));

// Rotas de Segurança
router.post('/security/:userId/block', securityController.blockUser);
router.post('/security/:userId/report', securityController.reportUser);

// Rota de Chat Privado
router.get('/chat/private/:userId/:friendId', privateChatController.getHistory);

module.exports = router;
