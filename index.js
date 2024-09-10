import express from 'express';
import cors from 'cors';
import { promises as fs } from 'fs';

const app = express();
const PORT = process.env.PORT || 3000;

// Habilitar CORS para todas as origens
app.use(cors());

// Middleware para interpretar JSON
app.use(express.json());

app.get("/", (req, res) => {
    return res.json("hello world");
});

// Rota para salvar a seleção
app.post('/save-selection', async (req, res) => {
    const selection = req.body;

    try {
        // Salvar a seleção em um arquivo db.json
        await fs.writeFile('db.json', JSON.stringify(selection, null, 2));
        res.json({ message: 'Seleção salva com sucesso' });
    } catch (err) {
        return res.status(500).json({ message: 'Erro ao salvar a seleção' });
    }
});

// Rota para carregar a seleção
app.get('/get-selection', async (req, res) => {
    try {
        const data = await fs.readFile('db.json', 'utf8');
        res.json(JSON.parse(data));
    } catch (err) {
        return res.status(500).json({ message: 'Erro ao carregar a seleção' });
    }
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em ${PORT}`);
});
