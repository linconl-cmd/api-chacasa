import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';

const app = express();
const PORT = process.env.PORT || 3000;

// String de conexão com o MongoDB Atlas
const uri = 'mongodb+srv://<linconllee>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Habilitar CORS para todas as origens
const corsOptions = {
    origin: '*',  // Permitir qualquer origem
    methods: ['GET', 'POST'],  // Métodos permitidos
    allowedHeaders: ['Content-Type'],  // Cabeçalhos permitidos
};

app.use(cors(corsOptions)); // Ativar o middleware CORS com essas opções

// Middleware para interpretar JSON
app.use(express.json());

// Rota de teste
app.get("/", (req, res) => {
    return res.json("hello world");
});

// Função para conectar ao banco de dados
async function connectToDb() {
    try {
        await client.connect();
        console.log('Conectado ao MongoDB Atlas');
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error);
    }
}

// Conectar ao banco de dados
connectToDb();

// Rota para salvar a seleção
app.post('/save-selection', async (req, res) => {
    const selection = req.body;

    try {
        const database = client.db('<dbname>'); // Nome do seu banco de dados
        const collection = database.collection('selections'); // Nome da coleção

        // Insere a seleção no MongoDB
        const result = await collection.insertOne({ selection, date: new Date() });
        res.json({ message: 'Seleção salva com sucesso', result });
    } catch (error) {
        console.error('Erro ao salvar a seleção', error);
        res.status(500).json({ message: 'Erro ao salvar a seleção no MongoDB' });
    }
});

// Rota para carregar a seleção
app.get('/get-selection', async (req, res) => {
    try {
        const database = client.db('<dbname>'); // Nome do seu banco de dados
        const collection = database.collection('selections');

        // Busca todas as seleções salvas
        const selections = await collection.find({}).toArray();
        res.json(selections);
    } catch (error) {
        console.error('Erro ao carregar a seleção', error);
        res.status(500).json({ message: 'Erro ao carregar a seleção' });
    }
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em ${PORT}`);
});
