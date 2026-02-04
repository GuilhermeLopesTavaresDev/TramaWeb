const getBooks = (req, res) => {
    // Dados 'Mockados' para a Home - Títulos curados para visual Premium
    const db = {
        "Clássicos": [
            { id: 101, title: 'Dom Quixote', author: 'Miguel de Cervantes', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Publication113/v4/64/7e/1d/647e1d88-29bf-4880-870a-0402a46a9a08/9788595080757.jpg/400x400bb.jpg' },
            { id: 102, title: 'Orgulho e Preconceito', author: 'Jane Austen', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Publication123/v4/9c/61/1a/9c611a2f-6b22-5443-4d43-26bd98687258/9788544001826.jpg/400x400bb.jpg' },
            { id: 103, title: 'O Grande Gatsby', author: 'F. Scott Fitzgerald', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Publication125/v4/a5/58/01/a5580172-1b15-1815-580a-972175051a6d/9788525431659.jpg/400x400bb.jpg' },
            { id: 104, title: '1984', author: 'George Orwell', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Publication116/v4/65/56/67/655667e4-233c-3677-44dc-c47f7d983446/9788535914111.jpg/400x400bb.jpg' },
            { id: 105, title: 'A Metamorfose', author: 'Franz Kafka', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Publication128/v4/80/7e/58/807e583c-1349-8c63-4720-6d080c16940e/9788535911127.jpg/400x400bb.jpg' }
        ],
        "Fantasia": [
            { id: 201, title: 'O Hobbit', author: 'J.R.R. Tolkien', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Publication128/v4/28/73/0e/28730e23-74ad-f02a-0639-66c5d6484ce9/9788595086353.jpg/400x400bb.jpg' },
            { id: 202, title: 'Harry Potter e a Pedra Filosofal', author: 'J.K. Rowling', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Publication115/v4/b3/ee/48/b3ee4877-380d-85f0-621d-910408d6d6ce/9788532530789.jpg/400x400bb.jpg' },
            { id: 203, title: 'O Nome do Vento', author: 'Patrick Rothfuss', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Publication124/v4/b9/01/bf/b901bf4e-9896-bc9b-3a52-9447e127694f/9788580410323.jpg/400x400bb.jpg' },
            { id: 204, title: 'Deuses Americanos', author: 'Neil Gaiman', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Publication126/v4/91/4e/d6/914ed646-a4c3-e847-a841-f597926715f6/9788580579976.jpg/400x400bb.jpg' },
            { id: 205, title: 'A Guerra dos Tronos', author: 'George R.R. Martin', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Publication124/v4/55/e1/9f/55e19f9f-0c4a-6d1a-5c24-4f0120155df9/9788544102929.jpg/400x400bb.jpg' }
        ],
        "Suspense": [
            { id: 301, title: 'O Iluminado', author: 'Stephen King', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Publication114/v4/f5/a8/37/f5a8375e-c760-264d-df79-b88302062635/9788539003835.jpg/400x400bb.jpg' },
            { id: 302, title: 'Garota Exemplar', author: 'Gillian Flynn', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Publication124/v4/44/21/53/442153c3-8f0a-115f-563d-4f0050800720/9788580572885.jpg/400x400bb.jpg' },
            { id: 303, title: 'O Colecionador', author: 'John Fowles', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Publication115/v4/d5/92/7e/d5927e1b-4f51-2491-381c-9c7882260195/9788594540450.jpg/400x400bb.jpg' },
            { id: 304, title: 'Agatha Christie - Box 1', author: 'Agatha Christie', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Publication124/v4/99/34/4d/99344d9f-6821-2e68-0708-4e89f6498871/9788595086575.jpg/400x400bb.jpg' }
        ],
        "Poesia": [
            { id: 401, title: 'Outros Jeitos de Usar a Boca', author: 'Rupi Kaur', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Publication124/v4/d5/d3/18/d5d31848-0c67-6889-1833-8a3962630720/9788542209316.jpg/400x400bb.jpg' },
            { id: 402, title: 'Sentimento do Mundo', author: 'Carlos Drummond', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Publication124/v4/9c/07/70/9c077053-912f-9154-8e3b-9e4513809054/9788535921829.jpg/400x400bb.jpg' },
            { id: 403, title: 'Antologia Poética', author: 'Vinicius de Moraes', cover: 'https://is1-ssl.mzstatic.com/image/thumb/Publication128/v4/4a/01/5e/4a015e58-0056-2e86-3531-15886678287a/9788535913961.jpg/400x400bb.jpg' }
        ]
    };

    res.json(db);
};

const proxySearch = async (req, res) => {
    try {
        const { term, limit = 15 } = req.query;
        const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=ebook&country=br&limit=${limit}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Falha ao buscar no iTunes');

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Erro no proxySearch:', error);
        res.status(500).json({ error: 'Erro ao buscar livros no iTunes' });
    }
};

const proxyLookup = async (req, res) => {
    try {
        const { id } = req.params;
        const url = `https://itunes.apple.com/lookup?id=${id}&country=br&entity=ebook`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Falha ao buscar detalhes no iTunes');

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Erro no proxyLookup:', error);
        res.status(500).json({ error: 'Erro ao buscar detalhes do livro no iTunes' });
    }
};

module.exports = {
    getBooks,
    proxySearch,
    proxyLookup
};
