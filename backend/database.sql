-- 1. Garante que as colunas novas existam na tabela de usuários
ALTER TABLE usuarios ADD COLUMN bio TEXT AFTER senha;
ALTER TABLE usuarios ADD COLUMN foto_url VARCHAR(255) AFTER bio;
ALTER TABLE usuarios ADD COLUMN status ENUM('Disponível', 'Ocupado', 'Lendo') DEFAULT 'Disponível' AFTER foto_url;

-- 2. Tabela para gerenciar livros lidos e interesses
CREATE TABLE IF NOT EXISTS listas_leitura (
    id INT AUTO_INCREMENT,
    usuario_id INT,
    book_id VARCHAR(100) NOT NULL,
    titulo VARCHAR(255),
    capa_url VARCHAR(255),
    tipo ENUM('Lido', 'Pretendo Ler') NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- 3. Tabela de chats de leitura
CREATE TABLE IF NOT EXISTS chats (
    id INT AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    PRIMARY KEY (id)
);

-- 4. Relacionamento usuário <-> chat
CREATE TABLE IF NOT EXISTS usuarios_chats (
    usuario_id INT,
    chat_id INT,
    PRIMARY KEY (usuario_id, chat_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE
);

-- 5. Tabela de mensagens do chat por livro
CREATE TABLE IF NOT EXISTS mensagens_chat (
    id INT AUTO_INCREMENT PRIMARY KEY,
    book_id VARCHAR(100) NOT NULL,
    usuario_id INT NOT NULL,
    conteudo TEXT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- 6. Tabela de amizades
CREATE TABLE IF NOT EXISTS amizades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id1 INT NOT NULL,
    usuario_id2 INT NOT NULL,
    status ENUM('Pendente', 'Aceito') DEFAULT 'Pendente',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id1) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id2) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE KEY (usuario_id1, usuario_id2)
);

-- 7. Tabela de bloqueios
CREATE TABLE IF NOT EXISTS bloqueios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bloqueador_id INT NOT NULL,
    bloqueado_id INT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bloqueador_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (bloqueado_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE KEY (bloqueador_id, bloqueado_id)
);

-- 8. Tabela de denúncias
CREATE TABLE IF NOT EXISTS denuncias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    denunciante_id INT NOT NULL,
    denunciado_id INT NOT NULL,
    motivo TEXT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (denunciante_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (denunciado_id) REFERENCES usuarios(id) ON DELETE CASCADE
);