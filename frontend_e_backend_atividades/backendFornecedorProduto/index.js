const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORTA = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());



// 1. READ ALL - Listar todos os fornecedores
app.get('/api/fornecedor', (req, res) => {
  res.status(200).json(db.fornecedores);
});

// 2. READ BY ID - Buscar fornecedor por ID
app.get('/api/fornecedor/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ erro: "O ID deve ser um número inteiro." });
  }

  const fornecedor = db.fornecedores.find(f => f.id === id);
  if (!fornecedor) {
    return res.status(404).json({ erro: `Fornecedor com ID ${id} não encontrado.` });
  }

  res.status(200).json(fornecedor);
});

// 3. CREATE - Cadastrar novo fornecedor
app.post('/api/fornecedor', (req, res) => {
  const { nome, email, telefone, endereco } = req.body;

  if (!nome || !email || !telefone || !endereco) {
    return res.status(400).json({
      erro: "Os campos 'nome', 'email', 'telefone' e 'endereco' são obrigatórios."
    });
  }

  const novoFornecedor = {
    id: db.proximoIdFornecedor++,
    nome,
    email,
    telefone,
    endereco
  };

  db.fornecedores.push(novoFornecedor);   // Adiciona o novo fornecedor no array
  res.status(201).json(novoFornecedor);   // Retorna o fornecedor criado com o seu ID 
});

// 4. UPDATE - Atualizar fornecedor existente
app.put('/api/fornecedor/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ erro: "O ID deve ser um número inteiro." });
  }

  const { nome, email, telefone, endereco } = req.body;
  if (!nome || !email || !telefone || !endereco) {
    return res.status(400).json({
      erro: "Os campos 'nome', 'email', 'telefone' e 'endereco' são obrigatórios."
    });
  }

  const indice = db.fornecedores.findIndex(f => f.id === id);
  if (indice === -1) {
    return res.status(404).json({ erro: `Fornecedor com ID ${id} não encontrado.` });
  }

  db.fornecedores[indice] = { id, nome, email, telefone, endereco };
  res.status(200).json(db.fornecedores[indice]);
});

// 5. DELETE - Remover fornecedor
app.delete('/api/fornecedor/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ erro: "O ID deve ser um número inteiro." });
  }

  const indice = db.fornecedores.findIndex(f => f.id === id);
  if (indice === -1) {
    return res.status(404).json({ erro: `Fornecedor com ID ${id} não encontrado.` });
  }

  db.fornecedores.splice(indice, 1); // Remove o fornecedor do array
  res.status(204).send(); // Envia resposta sem corpo, indicando sucesso
});


// =========================================================================
// ROTAS DO RECURSO: PRODUTO (/api/produto)
// Estrutura: id, nome, descricao, preco, estoque, id_fornecedor
// =========================================================================

// 1. READ ALL - Listar todos os produtos
app.get('/api/produto', (req, res) => {
  res.status(200).json(db.produtos);
});

// 2. READ BY ID - Buscar produto por ID
app.get('/api/produto/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ erro: "O ID deve ser um número inteiro." });
  }

  const produto = db.produtos.find(p => p.id === id);
  if (!produto) {
    return res.status(404).json({ erro: `Produto com ID ${id} não encontrado.` });
  }

  res.status(200).json(produto);
});

// 3. CREATE - Cadastrar novo produto (com validação do id_fornecedor)
app.post('/api/produto', (req, res) => {
  const { nome, descricao, preco, estoque, id_fornecedor } = req.body;

  if (!nome || !descricao || preco === undefined || estoque === undefined || !id_fornecedor) {
    return res.status(400).json({
      erro: "Os campos 'nome', 'descricao', 'preco', 'estoque' e 'id_fornecedor' são obrigatórios."
    });
  }

  // Validação do vínculo com fornecedor
  const fornecedorExiste = db.fornecedores.some(f => f.id === parseInt(id_fornecedor));
  if (!fornecedorExiste) {
    return res.status(400).json({
      erro: `Não é possível cadastrar o produto. O fornecedor com ID ${id_fornecedor} não existe.`
    });
  }

  const novoProduto = {
    id: db.proximoIdProduto++,
    nome,
    descricao,
    preco: Number(preco),
    estoque: Number(estoque),
    id_fornecedor: Number(id_fornecedor)
  };

  db.produtos.push(novoProduto);
  res.status(201).json(novoProduto);
});

// 4. UPDATE - Atualizar produto existente (com validação do id_fornecedor)
app.put('/api/produto/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ erro: "O ID deve ser um número inteiro." });
  }

  const { nome, descricao, preco, estoque, id_fornecedor } = req.body;
  if (!nome || !descricao || preco === undefined || estoque === undefined || !id_fornecedor) {
    return res.status(400).json({
      erro: "Os campos 'nome', 'descricao', 'preco', 'estoque' e 'id_fornecedor' são obrigatórios."
    });
  }

  const indice = db.produtos.findIndex(p => p.id === id);
  if (indice === -1) {
    return res.status(404).json({ erro: `Produto com ID ${id} não encontrado.` });
  }

  // Validação do vínculo com fornecedor
  const fornecedorExiste = db.fornecedores.some(f => f.id === parseInt(id_fornecedor));
  if (!fornecedorExiste) {
    return res.status(400).json({
      erro: `Não é possível atualizar o produto. O fornecedor com ID ${id_fornecedor} não existe.`
    });
  }

  db.produtos[indice] = {
    id,
    nome,
    descricao,
    preco: Number(preco),
    estoque: Number(estoque),
    id_fornecedor: Number(id_fornecedor)
  };

  res.status(200).json(db.produtos[indice]);
});

// 5. DELETE - Remover produto
app.delete('/api/produto/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ erro: "O ID deve ser um número inteiro." });
  }

  const indice = db.produtos.findIndex(p => p.id === id);
  if (indice === -1) {
    return res.status(404).json({ erro: `Produto com ID ${id} não encontrado.` });
  }

  db.produtos.splice(indice, 1);
  res.status(204).send();
});

// Inicialização do servidor
app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});