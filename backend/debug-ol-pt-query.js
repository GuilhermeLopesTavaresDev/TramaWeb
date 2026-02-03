async function testOpenLibraryQueryPT() {
    const queries = ['Harry Potter e a Pedra Filosofal', 'O Pequeno Príncipe', 'Dom Casmurro'];

    for (const q of queries) {
        const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=3`;
        console.log(`\nBuscando: ${q}`);
        try {
            const response = await fetch(url);
            const data = await response.json();

            data.docs?.forEach(doc => {
                console.log(`  - Title: ${doc.title}`);
                console.log(`  - Title Suggest: ${doc.title_suggest}`);
                console.log(`  - Language: ${doc.language?.join(', ')}`);
            });
        } catch (e) {
            console.error(e);
        }
    }
}

testOpenLibraryQueryPT();
