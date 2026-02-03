async function testGoogleBooks() {
    const query = 'Harry Potter';
    // Testando o URL exato usado no bookService
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&langRestrict=pt&maxResults=5&orderBy=relevance`;

    console.log(`Buscando: ${url}`);
    try {
        const response = await fetch(url);
        const data = await response.json();

        console.log('Status:', response.status);
        if (!data.items) {
            console.log('Nenhum item encontrado. Resposta completa:', JSON.stringify(data, null, 2));
            return;
        }

        console.log(`Encontrados ${data.items.length} livros.`);
        data.items.forEach((item, index) => {
            console.log(`\n--- Livro ${index + 1} ---`);
            console.log(`Título: ${item.volumeInfo.title}`);
            console.log(`Autores: ${item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'N/A'}`);
            console.log(`Idioma: ${item.volumeInfo.language}`);
        });
    } catch (e) {
        console.error('Erro na requisição:', e);
    }
}

testGoogleBooks();
