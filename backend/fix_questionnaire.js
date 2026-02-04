const mysql = require('mysql2/promise');
require('dotenv').config();

async function fix() {
    console.log('Iniciando script de reparo manual...');
    let connection;
    try {
        console.log('Conectando ao banco de dados...');
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        const userId = 6; // ID do Gui

        console.log(`Verificando usuário ${userId}...`);

        // 1. Forçar update na tabela de usuários
        console.log('Passo 1: Forçando users.preferences_completed = 1');
        const [resultUser] = await connection.execute(
            'UPDATE usuarios SET preferences_completed = 1 WHERE id = ?',
            [userId]
        );
        console.log('Resultado Update User:', resultUser);

        // 2. Garantir que existam preferências (dummy data se precisar)
        console.log('Passo 2: Inserindo preferências padrão para evitar erros');
        const dummyGenres = JSON.stringify(['Aventura', 'Mistério']);
        const dummyThemes = JSON.stringify(['Superação']);

        const [resultPrefs] = await connection.execute(
            'INSERT INTO preferencias_usuario (usuario_id, generos, temas, frequencia_leitura) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE generos = ?, temas = ?, frequencia_leitura = ?',
            [userId, dummyGenres, dummyThemes, 'Diariamente', dummyGenres, dummyThemes, 'Diariamente']
        );
        console.log('Resultado Update Prefs:', resultPrefs);

        console.log('--- SUCESSO! O usuário agora deve estar desbloqueado. ---');
    } catch (error) {
        console.error('--- ERRO FATAL ---');
        console.error(error);
    } finally {
        if (connection) await connection.end();
    }
}

fix();
