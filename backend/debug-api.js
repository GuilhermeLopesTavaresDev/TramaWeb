async function testOpenLibrary() {
    const query = 'Harry Potter';
    // Testando com q=language:por e lang=pt
    const url = `https://openlibrary.org/search.json?q=harry+potter+language:por&lang=pt&limit=5`;

    console.log(`Buscando: ${url}`);
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!data.docs) {
            console.log('Nenhum documento encontrado.');
            return;
        }

        data.docs.forEach((doc, index) => {
            console.log(`\n--- Livro ${index + 1} ---`);
            console.log(`Título Principal (title): ${doc.title}`);
            console.log(`Sugestão (title_suggest): ${doc.title_suggest}`);
            // Verificar se existe algum outro campo de título
            console.log(`Linguagens Disponíveis: ${doc.language ? doc.language.join(', ') : 'N/A'}`);
            if (doc.edition_key) console.log(`Número de Edições: ${doc.edition_key.length}`);
        });
    } catch (e) {
        console.error('Erro na requisição:', e);
    }
}

testOpenLibrary();
