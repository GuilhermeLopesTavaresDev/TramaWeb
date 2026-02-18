const db = require('../shared/database');

const register = async (req, res) => {
    const { nome, email, senha } = req.body;
    console.log('[DEBUG] Tentativa de registro:', { nome, email, senha: '***' });

    if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    // Validação de senha: min 8 caracteres, 1 maiúscula, 1 caractere especial
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]{8,}$/;
    const validPassword = passwordRegex.test(senha);
    console.log('[DEBUG] Senha válida:', validPassword);

    if (!validPassword) {
        return res.status(400).json({
            error: 'Sua senha precisa ser mais forte! Use pelo menos 8 caracteres, incluindo uma letra MAIÚSCULA e um caractere especial (como !, @, #, etc).'
        });
    }
    try {
        // 1. Verificação explícita de e-mail duplicado
        const [existingUser] = await db.execute(
            'SELECT id FROM usuarios WHERE email = ?',
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Este e-mail já está em uso por outra conta.' });
        }

        // 2. Inserção do novo usuário
        const [result] = await db.execute(
            'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
            [nome, email, senha]
        );

        res.status(201).json({
            message: 'Usuário cadastrado com sucesso!',
            userId: result.insertId,
            preferences_completed: false
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Este e-mail já está em uso por outra conta.' });
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
                email: user.email,
                preferences_completed: !!user.preferences_completed
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

