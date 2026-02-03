async function testAppleBooks() {
    const query = 'Harry Potter';
    // Buscando especificamente na loja brasileira (country=br)
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=ebook&country=br&limit=5`;

    console.log(`Buscando no Apple Books BR: ${url}`);
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.resultCount === 0) {
            console.log('Nenhum livro encontrado.');
            return;
        }

        console.log(`Encontrados ${data.resultCount} livros.`);
        data.results.forEach((item, index) => {
            console.log(`\n--- Livro ${index + 1} ---`);
            console.log(`Título: ${item.trackName}`);
            console.log(`Autor: ${item.artistName}`);
            console.log(`Preço: ${item.formattedPrice}`);
            console.log(`Capa: ${item.artworkUrl100}`);
        });
    } catch (e) {
        console.error('Erro na requisição:', e);
    }
}

testAppleBooks();
