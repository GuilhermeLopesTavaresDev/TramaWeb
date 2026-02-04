const db = require('../config/database');

const register = async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    // Validação de senha: min 8 caracteres, 1 maiúscula, 1 caractere especial
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]{8,}$/;
    if (!passwordRegex.test(senha)) {
        return res.status(400).json({
            error: 'A senha deve ter no mínimo 8 caracteres, incluindo uma letra maiúscula e um caractere especial (!@#$%).'
        });
    }
    try {
        const [result] = await db.execute(
            'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
            [nome, email, senha]
        );

        res.status(201).json({
            message: 'Usuário cadastrado com sucesso!',
            userId: result.insertId
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Este e-mail já está cadastrado' });
        }
        console.error('Erro ao registrar usuário:', error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
};

const login = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ error: 'E-mail e senha são obrigatórios' });
    }

    try {
        const [users] = await db.execute(
            'SELECT * FROM usuarios WHERE email = ? AND senha = ?',
            [email, senha]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: 'E-mail ou senha incorretos' });
        }

        const user = users[0];
        res.json({
            message: 'Login realizado com sucesso!',
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Erro ao realizar login:', error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
};

module.exports = {
    register,
    login
};

