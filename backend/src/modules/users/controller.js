const profileService = require('./profileService');

class UserController {
    async getProfile(req, res) {
        const { userId } = req.params;
        try {
            const profile = await profileService.getProfile(userId);
            res.json(profile);
        } catch (error) {
            console.error('[UserController] getProfile error:', error);
            const status = error.message === 'User not found' ? 404 : 500;
            res.status(status).json({ error: error.message });
        }
    }

    async updateProfile(req, res) {
        const { userId } = req.params;
        try {
            await profileService.updateProfile(userId, req.body);
            res.json({ message: 'Perfil atualizado com sucesso!' });
        } catch (error) {
            console.error('[UserController] updateProfile error:', error);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new UserController();
