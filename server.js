import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient();

// Habilitar CORS para todas as origens
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));

// Middleware para interpretar JSON
app.use(express.json());

// Rota de teste
app.get("/", (req, res) => {
    return res.json("hello world");
});

// Rota para salvar a seleção no banco de dados
app.post('/save-selection', async (req, res) => {
    const selections = req.body;

    if (!Array.isArray(selections)) {
        return res.status(400).json({ message: 'Formato de dados inválido. Esperado um array.' });
    }

    try {
        for (const selection of selections) {
            const { name, item } = selection;

            // Verifica se o item já está no banco de dados
            const existingSelection = await prisma.selection.findFirst({
                where: { item }
            });

            if (!existingSelection) {
                // Se não existir, insere a nova seleção
                await prisma.selection.create({
                    data: { name, item }
                });
            }
        }

        res.json({ message: 'Seleção salva com sucesso' });
    } catch (error) {
        console.error('Erro ao salvar a seleção:', error);
        res.status(500).json({ message: 'Erro ao salvar a seleção' });
    }
});

// Rota para carregar a seleção do banco de dados
app.get('/get-selection', async (req, res) => {
    try {
        const selections = await prisma.selection.findMany();
        res.json(selections);
    } catch (error) {
        console.error('Erro ao carregar a seleção:', error);
        res.status(500).json({ message: 'Erro ao carregar a seleção' });
    }
});

// Fechar conexão com o banco de dados quando o servidor for interrompido
process.on('SIGINT', async () => {
    console.log("Fechando a conexão com o banco de dados...");
    await prisma.$disconnect();
    process.exit(0);
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em ${PORT}`);
});
