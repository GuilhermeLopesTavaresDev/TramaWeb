const userRepository = require('./repository');
const events = require('../../shared/events');

class AuthService {
    async register(data) {
        const { nome, email, senha } = data;

        const existing = await userRepository.findByEmail(email);
        if (existing) throw new Error('E-mail já está em uso.');

        const userId = await userRepository.create({ nome, email, senha });

        events.publish('user_registered', { userId, email, nome });

        return {
            userId,
            preferences_completed: false
        };
    }

    async login(email, senha) {
        const user = await userRepository.findByEmail(email);

        if (!user || user.senha !== senha) {
            throw new Error('E-mail ou senha incorretos');
        }

        return {
            id: user.id,
            nome: user.nome,
            email: user.email,
            preferences_completed: !!user.preferences_completed
        };
    }
}

module.exports = new AuthService();
