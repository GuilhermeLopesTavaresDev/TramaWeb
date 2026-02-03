async function testOpenLibraryEditions() {
    const query = 'Harry Potter';
    const url = `https://openlibrary.org/search/editions.json?q=${encodeURIComponent(query)}&language=por&limit=10`;

    console.log(`Buscando edições: ${url}`);
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!data.docs) {
            console.log('Nenhum documento encontrado.');
            return;
        }

        data.docs.forEach((doc, index) => {
            console.log(`\n--- Edição ${index + 1} ---`);
            console.log(`Título: ${doc.title}`);
            console.log(`Autor: ${doc.author_name ? doc.author_name.join(', ') : 'N/A'}`);
            console.log(`Idioma: ${doc.language ? doc.language.join(', ') : 'N/A'}`);
            console.log(`Cover ID: ${doc.cover_i}`);
        });
    } catch (e) {
        console.error('Erro:', e);
    }
}

testOpenLibraryEditions();
