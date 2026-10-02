// database.js
// Array em memória para Fornecedores
const fornecedores = [
    { id: 1, nome: "Fornecedor Alfa", email: "contato@alfa.com", telefone: "49999999999", endereco: "Rua das Flores, 123" },
    { id: 2, nome: "Fornecedor Beta", email: "contato@beta.com", telefone: "49999999999", endereco: "Rua das Flores, 123" },
    { id: 3, nome: "Fornecedor Gamma", email: "contato@gamma.com", telefone: "49999999999", endereco: "Rua das Flores, 123" },

];

// Array em memória para Produtos
const produtos = [
    { id: 1, nome: "Arroz 5kg", descricao: "Arroz tipo 1", preco: 25.90, estoque: 50, id_fornecedor: 1 },
    { id: 2, nome: "Feijão Carioca 1kg", descricao: "Feijão carioca tipo 1", preco: 25.90, estoque: 50, id_fornecedor: 1 },
    { id: 3, nome: "Macarrão Espaguete 500g", descricao: "Macarrão espaguete tipo 1", preco: 25.90, estoque: 50, id_fornecedor: 1 },
];

// Contadores de ID incremental (iniciando após os dados iniciais) [6]
let proximoIdFornecedor = 4;
let proximoIdProduto = 4;

module.exports = {
    fornecedores,
    produtos, 
    proximoIdFornecedor,
    proximoIdProduto
};