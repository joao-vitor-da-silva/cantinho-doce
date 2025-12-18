const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000; // Vercel injeta a porta automaticamente

// --- CORREÇÃO AQUI ---
// Usa __dirname para garantir que o Vercel ache a pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

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

// Exportação para o Vercel (Necessário)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
}

module.exports = app;