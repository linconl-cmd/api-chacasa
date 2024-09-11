import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';

// Configurações do MongoDB Atlas
const uri = 'mongodb+srv://linconllee:w1biz2HNzZoMrNK8@my-mongodb.i1yn3.mongodb.net/?retryWrites=true&w=majority&appName=my-mongodb';
const client = new MongoClient(uri);
let db;

// Conectando ao MongoDB
async function connectToDb() {
    try {
        await client.connect();
        db = client.db('my-mongodb'); // Substitua pelo nome do seu banco de dados
        console.log('Conectado ao MongoDB Atlas');
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error);
    }
}

// Chame a função de conexão
connectToDb();

// Criando servidor Express
const app = express();
const PORT = process.env.PORT || 3000;

// Habilitar CORS para todas as origens
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
};
app.use(cors(corsOptions));

// Middleware para interpretar JSON
app.use(express.json());

app.get("/", (req, res) => {
    return res.json("hello world");
});

// Rota para salvar a seleção no MongoDB
app.post('/save-selection', async (req, res) => {
    const selection = req.body;
    try {
        const result = await db.collection('selections').insertOne(selection);  // Substitua 'selections' pelo nome da sua coleção
        res.json({ message: 'Seleção salva com sucesso', result });
    } catch (error) {
        console.error('Erro ao salvar a seleção:', error);
        res.status(500).json({ message: 'Erro ao salvar a seleção' });
    }
});

// Rota para carregar a seleção do MongoDB
app.get('/get-selection', async (req, res) => {
    try {
        const selections = await db.collection('selections').find().toArray();  // Substitua 'selections' pelo nome da sua coleção
        res.json(selections);
    } catch (error) {
        console.error('Erro ao carregar a seleção:', error);
        res.status(500).json({ message: 'Erro ao carregar a seleção' });
    }
});

// Fechar conexão com o MongoDB quando o servidor for interrompido
process.on('SIGINT', async () => {
    console.log("Fechando a conexão com o MongoDB...");
    await client.close();
    process.exit(0);
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em ${PORT}`);
});
