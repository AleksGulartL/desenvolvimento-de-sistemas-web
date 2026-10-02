const express = require('express');
const cors = require('cors');
const pgp = require('pg-promise')();


const app = express();
const PORTA = 3001;
const db = pgp('postgres://postgres:postgres@localhost:5432/dev_web');

app.use(cors());
app.use(express.json());

app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});

app.get("/livros-sincrono", (req, res) => {
    const sql = 'select * from livros';
    // db.one - um e apenas um
    // db.any - zero ou mais
    // db.none - nao retorna nada
    db.any(sql)
        .then((livros) => {
            res.status(200).json(livros);
        })
        .catch((erro) => {
            res.status(400).json({ erro: "Erro ao consultar livros: " });
        });
});

app.get("/livros", async (req, res) => {
    const sql = 'select * from livros';
    try {
        const livros = await db.any(sql);
        res.status(200).json(livros);
    } catch (erro) {
        res.status(400).json({ erro: "Erro ao consultar livros: " });
    }
});

app.get("/livros/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ erro: "O ID deve ser um número inteiro." });
    }

    const sql = 'select * from livros where id = $1';
    try {
        const livro = await db.any(sql, [id]);
        if (!livro) {
            return res.status(404).json({ erro: `Livro com ID ${id} não encontrado.` });
        }
        res.status(200).json(livro);
    } catch (erro) {
        res.status(400).json({ erro: "Erro ao consultar livro: " });
    }
});


app.get("/leitores", async (req, res) => {
    const sql = 'select * from livros';
    try {
        const livros = await db.any(sql);
        res.status(200).json(livros);
    } catch (erro) {
        res.status(400).json({ erro: "Erro ao consultar livros: " });
    }
});

app.get("/livros/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ erro: "O ID deve ser um número inteiro." });
    }

    const sql = 'select * from livros where id = $1';
    try {
        const livro = await db.any(sql, [id]);
        if (!livro) {
            return res.status(404).json({ erro: `Livro com ID ${id} não encontrado.` });
        }
        res.status(200).json(livro);
    } catch (erro) {
        res.status(400).json({ erro: "Erro ao consultar livro: " });
    }
});

