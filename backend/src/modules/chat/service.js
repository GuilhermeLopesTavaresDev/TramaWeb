const repository = require('./repository');
const userRepository = require('../users/repository');

class ChatService {
    async getHistory(bookId) {
        return await repository.getHistory(bookId);
    }

    async saveMessage(bookId, usuarioId, conteudo) {
        const messageId = await repository.saveMessage(bookId, usuarioId, conteudo);
        const user = await userRepository.findById(usuarioId);

        return {
            id: messageId,
            book_id: bookId,
            usuario_id: usuarioId,
            conteudo: conteudo,
            usuario_nome: user.nome,
            usuario_foto: user.foto_url,
            criado_em: new Date()
        };
    }
}

module.exports = new ChatService();
