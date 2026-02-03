async function testOpenLibraryFields() {
    const q = 'O Pequeno Príncipe';
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=10`;

    console.log(`Buscando: ${url}`);
    try {
        const response = await fetch(url);
        const data = await response.json();

        data.docs?.forEach((doc, i) => {
            console.log(`\n--- Livro ${i + 1} ---`);
            console.log(`Title: ${doc.title}`);
            console.log(`Title Suggest: ${doc.title_suggest}`);
            console.log(`Language: ${doc.language?.join(', ')}`);
            // Verificar se o título pesquisado aparece em algum lugar
            console.log(`Publish Year: ${doc.first_publish_year}`);
        });
    } catch (e) {
        console.error(e);
    }
}

testOpenLibraryFields();
