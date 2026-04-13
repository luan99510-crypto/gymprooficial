const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());
app.use(express.static('.'));

// Conexão com o Banco de Dados
mongoose.connect('mongodb://127.0.0.1:27017/gym_ultimate')
    .then(() => console.log("✅ BANCO DE DADOS CONECTADO!"))
    .catch(err => console.error("❌ ERRO NO BANCO:", err));

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

// Rota de Cadastro
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

// Rota de Login
app.post('/api/login', async (req, res) => {
    const { user, senha } = req.body;
    const u = await Usuario.findOne({ user, senha });
    if (u) {
        res.json({ autorizado: true, id: u._id, user: u.user });
    } else {
        res.status(401).json({ autorizado: false });
    }
});

// Rotas de Dieta e Treino
app.post('/api/refeicoes', async (req, res) => { await new Refeicao(req.body).save(); res.json({ok:true}); });
app.get('/api/refeicoes/:userId', async (req, res) => { res.json(await Refeicao.find({usuarioId: req.params.userId})); });
app.post('/api/treinos', async (req, res) => { await new Treino(req.body).save(); res.json({ok:true}); });
app.get('/api/treinos/:userId', async (req, res) => { res.json(await Treino.find({usuarioId: req.params.userId})); });

app.listen(3000, () => {
    console.log("-----------------------------------------");
    console.log("🚀 GYM PRO OFICIAL RODANDO!");
    console.log("🌐 ACESSE: http://localhost:3000");
    console.log("-----------------------------------------");
});