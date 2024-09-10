const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();

const PORT = process.env.PORT || 3000;


app.get("/", (req, res) => {
    return res.json("hello world")
})

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em {PORT}`);
});

// Habilitar CORS para todas as origens
app.use(cors());

// Middleware para interpretar JSON
app.use(express.json());

// Rota para salvar a seleção
app.post('/save-selection', (req, res) => {
    const selection = req.body;

    // Salvar a seleção em um arquivo db.json
    fs.writeFile('db.json', JSON.stringify(selection, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao salvar a seleção' });
        }
        res.json({ message: 'Seleção salva com sucesso' });
    });
});

// Rota para carregar a seleção
app.get('/get-selection', (req, res) => {
    fs.readFile('db.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao carregar a seleção' });
        }
        res.json(JSON.parse(data));
    });
});


