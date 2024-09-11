import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

// Configurar o middleware CORS
const corsOptions = {
    origin: '*', // Permite qualquer origem; ajuste conforme necessário
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions)); // Certifique-se de que o middleware CORS é usado antes das rotas

// Middleware para interpretar JSON
app.use(express.json());

app.get("/", (req, res) => {
    return res.json("hello world");
});

app.post('/save-selection', async (req, res) => {
    const { name, item } = req.body;

    if (!name || !item) {
        return res.status(400).json({ message: 'Nome e item são obrigatórios' });
    }

    try {
        const newSelection = await prisma.selection.create({
            data: {
                name,
                item,
            },
        });
        res.json({ message: 'Seleção salva com sucesso', newSelection });
    } catch (error) {
        console.error('Erro ao salvar a seleção:', error);
        res.status(500).json({ message: 'Erro ao salvar a seleção' });
    }
});

app.get('/get-selection', async (req, res) => {
    try {
        const selections = await prisma.selection.findMany();
        res.json(selections);
    } catch (error) {
        console.error('Erro ao carregar as seleções:', error);
        res.status(500).json({ message: 'Erro ao carregar as seleções' });
    }
});

process.on('SIGINT', async () => {
    console.log("Fechando a conexão com o banco de dados...");
    await prisma.$disconnect();
    process.exit(0);
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em ${PORT}`);
});
