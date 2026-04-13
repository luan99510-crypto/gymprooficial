const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('.'));

// --- CONEXÃO COM O BANCO DE DADOS (MONGODB ATLAS) ---
const mongoURI = 'mongodb+srv://luan99510_db_user:FZTztwpU0eeqsQgz@cluster0.fe9uvtc.mongodb.net/gym_ultimate?appName=Cluster0';

mongoose.connect(mongoURI)
    .then(() => console.log("✅ BANCO DE DADOS CONECTADO NO ATLAS!"))
    .catch(err => console.error("❌ ERRO NO BANCO:", err));

// Rota principal para garantir que o site abra
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Modelos dos Dados
const Usuario = mongoose.model('Usuario', new mongoose.Schema({
    user: { type: String, unique: true, required: true },
    senha: { type: String, required: true }
}));

const Refeicao = mongoose.model('Refeicao', new mongoose.Schema({
    usuarioId: String,
    alimento: String,
    calorias: Number,
    horario: String
}));

const Treino = mongoose.model('Treino', new mongoose.Schema({
    usuarioId: String,
    exercicio: String,
    series: String
}));

// --- ROTAS DE API ---

// Cadastro
app.post('/api/cadastro', async (req, res) => {
    try {
        const { user, senha } = req.body;
        if (!user || !senha) return res.status(400).json({ erro: "Preencha todos os campos" });
        const novo = new Usuario({ user, senha });
        await novo.save();
        res.status(201).json({ mensagem: "Sucesso!" });
    } catch (e) {
        res.status(400).json({ erro: "Este usuário já existe!" });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    try {
        const { user, senha } = req.body;
        const u = await Usuario.findOne({ user, senha });
        if (u) {
            res.json({ autorizado: true, id: u._id, user: u.user });
        } else {
            res.status(401).json({ autorizado: false });
        }
    } catch (e) {
        res.status(500).json({ erro: "Erro no servidor" });
    }
});

// Dieta e Treino
app.post('/api/refeicoes', async (req, res) => { await new Refeicao(req.body).save(); res.json({ok:true}); });
app.get('/api/refeicoes/:userId', async (req, res) => { res.json(await Refeicao.find({usuarioId: req.params.userId})); });
app.post('/api/treinos', async (req, res) => { await new Treino(req.body).save(); res.json({ok:true}); });
app.get('/api/treinos/:userId', async (req, res) => { res.json(await Treino.find({usuarioId: req.params.userId})); });

// --- PORTA DINÂMICA ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("-----------------------------------------");
    console.log(`🚀 GYM PRO OFICIAL RODANDO NA PORTA ${PORT}!`);
    console.log("-----------------------------------------");
});
