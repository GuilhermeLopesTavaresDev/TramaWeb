const http = require('http');

const data = JSON.stringify({
    nome: 'Teste Segundo',
    email: 'teste2@teste.com',
    senha: 'root'
});

const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/register',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (error) => {
    console.error(error);
});

req.write(data);
req.end();
