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
        multipleStatements: true
    });

    console.log('Conectado ao banco de dados.');

    try {
        const sqlPath = path.join(__dirname, 'database.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        const statements = sql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        console.log(`Executando ${statements.length} comandos de migração...`);

        for (const statement of statements) {
            try {
                await connection.query(statement);
            } catch (err) {
                if (err.code === 'ER_DUP_FIELDNAME' || err.code === 'ER_DUP_KEYNAME' || err.code === 'ER_TABLE_EXISTS_ERROR') {
                    // Ignorar erros esperados de duplicidade
                } else {
                    console.warn(`Aviso no comando [${statement.substring(0, 50)}...]:`, err.message);
                }
            }
        }
        console.log('Migrações concluídas!');
    } catch (error) {
        console.error('Erro fatal na migração:', error);
    } finally {
        await connection.end();
    }
}

migrate();
