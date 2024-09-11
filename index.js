import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

// Inicializar o Prisma Client
const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 3000;

// Habilitar CORS para todas as origens
const corsOptions = {
    origin: '*',  // Permite todas as origens
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
};
app.use(cors(corsOptions));

// Middleware para interpretar JSON
app.use(express.json());

// Rota de teste
app.get("/", (req, res) => {
    return res.json("hello world");
});

// Rota para salvar a seleção no PostgreSQL
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

// Rota para carregar as seleções do PostgreSQL
app.get('/get-selection', async (req, res) => {
    try {
        const selections = await prisma.selection.findMany();
        res.json(selections);
    } catch (error) {
        console.error('Erro ao carregar as seleções:', error);
        res.status(500).json({ message: 'Erro ao carregar as seleções' });
    }
});

// Fechar a conexão com o Prisma quando o servidor for interrompido
process.on('SIGINT', async () => {
    console.log("Fechando a conexão com o banco de dados...");
    await prisma.$disconnect();
    process.exit(0);
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em ${PORT}`);
});
