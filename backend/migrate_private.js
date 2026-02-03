require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function migrate() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'tramaweb',
    });

    try {
        console.log('Criando tabela de mensagens privadas...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS mensagens_privadas (
                id INT AUTO_INCREMENT PRIMARY KEY,
                remetente_id INT NOT NULL,
                destinatario_id INT NOT NULL,
                conteudo TEXT NOT NULL,
                criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (remetente_id) REFERENCES usuarios(id) ON DELETE CASCADE,
                FOREIGN KEY (destinatario_id) REFERENCES usuarios(id) ON DELETE CASCADE
            )
        `);
        console.log('Tabela criada com sucesso!');
    } catch (error) {
        console.error('Erro na migração:', error);
    } finally {
        await connection.end();
    }
}

migrate();
