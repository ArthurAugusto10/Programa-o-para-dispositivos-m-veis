// backend/src/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json()); // Essencial para ler dados JSON enviados pelo App [cite: 25]

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('API Scholar_Net Online!');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});