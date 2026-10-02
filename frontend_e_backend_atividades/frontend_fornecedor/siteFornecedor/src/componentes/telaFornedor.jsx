import { useState, useEffect } from 'react';
import axios from 'axios';
import './telaFornecedor.css';
import dadosFornecedor from './dadosFornecedor';

export default function TelaFornecedor() {
    const [fornecedores, setFornecedores] = useState([]);
    const [idBusca, setIdBusca] = useState('');
    const [fornecedorBuscado, setFornecedorBuscado] = useState(null);

    const API_URL = 'http://localhost:3001/api/fornecedor';

    // Buscar todos os fornecedores
    async function carregarFornecedores() {
        try {
            const res = await axios.get(API_URL);
            setFornecedores(res.data);
        } catch (erro) {
            console.error('Erro ao buscar fornecedores:', erro);
        }
    }

    useEffect(() => {
        carregarFornecedores();
    }, []);

    async function buscarFornecedor(id) {
        try {
            const res = await axios.get(`${API_URL}/${id}`);
            setFornecedorBuscado(res.data);
        } catch (erro) {
            console.error('Erro ao buscar fornecedor:', erro);
            setFornecedorBuscado(null);
        }
    }

    // Deletar fornecedor
    async function deletarFornecedor(id) {
        try {
            await axios.delete(`${API_URL}/${id}`);
            setFornecedorBuscado(null); // Limpa a exibição
            await carregarFornecedores(); // Recarrega a lista
        } catch (erro) {
            console.error('Erro ao deletar fornecedor:', erro);
        }
    }

    // Limpar busca
    function limparBusca() {
        setFornecedorBuscado(null);
        setIdBusca('');
    }

    return (
        <div className="tela-fornecedor">
            <div className="cabecalho">
                <h1>Sistema de Gestão de Fornecedores</h1>
                <p>Gerencie seus fornecedores com eficiência</p>
            </div>

            <div className="container">
                {/* Seção de Busca */}
                <section className="secao-busca">
                    <h2>Buscar Fornecedor por ID</h2>
                    <form onSubmit={(e) => { e.preventDefault(); buscarFornecedor(idBusca); }}>
                        <input
                            type="number"
                            placeholder="Digite o ID do fornecedor"
                            value={idBusca}
                            onChange={(e) => setIdBusca(e.target.value)}
                        />
                        <button type="submit">Buscar</button>
                        {fornecedorBuscado && (
                            <button type="button" onClick={limparBusca} className="btn-limpar">Limpar Busca</button>
                        )}
                    </form>

                    {fornecedorBuscado && (
                        <div className="resultado-busca">
                            <h3>Dados do Fornecedor</h3>
                            <dadosFornecedor
                                fornecedor={fornecedorBuscado}
                                onDelete={deletarFornecedor}
                                onEdit={(f) => {
                                    setFornecedorBuscado(null);
                                    setIdBusca(f.id.toString());
                                }}
                            />
                        </div>
                    )}
                </section>

                {/* Seção da Lista */}
                <section className="secao-lista">
                    <h2>Lista de Fornecedores</h2>
                    <div className="lista-container">
                        {fornecedores.length === 0 ? (
                            <p className="texto-centralizado">Nenhum fornecedor cadastrado.</p>
                        ) : (
                            <table className="tabela-fornecedores">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nome</th>
                                        <th>Email</th>
                                        <th>Telefone</th>
                                        <th>Endereço</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fornecedores.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.id}</td>
                                            <td>{item.nome}</td>
                                            <td>{item.email}</td>
                                            <td>{item.telefone}</td>
                                            <td>{item.endereco}</td>
                                            <td>
                                                <button onClick={() => buscarFornecedor(item.id)} className="btn-editar">
                                                    Editar
                                                </button>
                                                <button onClick={() => deletarFornecedor(item.id)} className="btn-deletar">
                                                    Deletar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}                                                               