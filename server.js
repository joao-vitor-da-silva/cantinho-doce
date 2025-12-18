const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Configuração de arquivos estáticos (CSS, JS, Imagens)
app.use(express.static('public'));

// Rotas das Páginas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/catalogo', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'catalogo.html'));
});

app.get('/montar', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'montar.html'));
});

app.get('/sobre', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'sobre.html'));
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Servidor rodando em: http://localhost:${PORT}`);
    });
}

module.exports = app;