const authService = require('./service');

class AuthController {
    async register(req, res) {
        try {
            const result = await authService.register(req.body);
            res.status(201).json({
                message: 'Usuário cadastrado com sucesso!',
                ...result
            });
        } catch (error) {
            console.error('[AuthController] register error:', error);
            res.status(400).json({ error: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, senha } = req.body;
            const user = await authService.login(email, senha);
            res.json({
                message: 'Login realizado com sucesso!',
                user
            });
        } catch (error) {
            console.error('[AuthController] login error:', error);
            res.status(401).json({ error: error.message });
        }
    }
}

module.exports = new AuthController();
