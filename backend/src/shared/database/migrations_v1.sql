-- Nova Tabela de Feed para Escala (Fan-out on Write)
CREATE TABLE IF NOT EXISTS user_feed (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    actor_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    reference_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES usuarios (id) ON DELETE CASCADE,
    FOREIGN KEY (actor_id) REFERENCES usuarios (id) ON DELETE CASCADE,
    INDEX idx_user_created (user_id, created_at DESC)
);

-- Tabela de Contadores para evitar COUNT(*)
CREATE TABLE IF NOT EXISTS counters (
    user_id INT PRIMARY KEY,
    followers_count INT DEFAULT 0,
    following_count INT DEFAULT 0,
    books_read_count INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES usuarios (id) ON DELETE CASCADE
);