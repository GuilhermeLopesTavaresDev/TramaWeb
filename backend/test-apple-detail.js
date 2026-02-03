async function testAppleBooksDetail() {
    const query = 'Harry Potter e a Pedra Filosofal';
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=ebook&country=br&limit=1`;

    console.log(`Buscando detalhes no Apple Books BR: ${url}`);
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.resultCount === 0) {
            console.log('Nenhum livro encontrado.');
            return;
        }

        const item = data.results[0];
        console.log('--- Resposta Completa ---');
        console.log(JSON.stringify(item, null, 2));
    } catch (e) {
        console.error('Erro na requisição:', e);
    }
}

testAppleBooksDetail();
