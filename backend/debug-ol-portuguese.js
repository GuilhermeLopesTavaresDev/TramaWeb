async function testOpenLibraryPortuguese() {
    const query = 'Harry Potter';
    // Testando busca de edições ou busca geral com campos extras
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&language=por&limit=5&fields=key,title,author_name,cover_i,edition_key`;

    console.log(`Buscando: ${url}`);
    try {
        const response = await fetch(url);
        const data = await response.json();

        for (const doc of data.docs) {
            console.log(`\n--- Work: ${doc.title} ---`);

            // Tentar pegar o título de uma edição em português
            if (doc.edition_key && doc.edition_key.length > 0) {
                // Pegar os primeiros 5 edições para ver se alguma é 'por'
                const editionUrl = `https://openlibrary.org/api/books?bibkeys=${doc.edition_key.slice(0, 5).map(k => 'OLID:' + k).join(',')}&format=json&jscmd=data`;
                const edRes = await fetch(editionUrl);
                const edData = await edRes.json();

                for (const key in edData) {
                    const ed = edData[key];
                    // Se a edição tem título e é diferente do original, pode ser a tradução
                    console.log(`  Edição (${key}): ${ed.title}`);
                }
            }
        }
    } catch (e) {
        console.error('Erro:', e);
    }
}

testOpenLibraryPortuguese();
