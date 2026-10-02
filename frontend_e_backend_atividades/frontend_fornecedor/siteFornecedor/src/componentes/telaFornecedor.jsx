import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Stack,
  TextField,
  Button,
  Alert
} from '@mui/material';
import TabelaFornecedor from './tabelaFornecedor';

const API_URL = 'http://localhost:3001/api/fornecedor';

export default function TelaFornecedor() {
  const [fornecedores, setFornecedores] = useState([]);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');

  const [idEmEdicao, setIdEmEdicao] = useState(null);
  const [idBusca, setIdBusca] = useState('');
  const [fornecedorBuscado, setFornecedorBuscado] = useState(null);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
  const [carregando, setCarregando] = useState(false);

  function exibirMensagem(tipo, texto) {
    setMensagem({ tipo, texto });
  }

  function limparFormulario() {
    setNome('');
    setEmail('');
    setTelefone('');
    setEndereco('');
    setIdEmEdicao(null);
  }

  // GET ALL - Buscar todos os fornecedores
  async function carregarFornecedores() {
    setCarregando(true);
    try {
      const res = await axios.get(API_URL);
      setFornecedores(res.data);
    } catch (erro) {
      console.error('Erro ao buscar fornecedores:', erro);
      exibirMensagem('erro', 'Erro ao carregar a lista de fornecedores do servidor.');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarFornecedores();
  }, []);

  // GET ID - Buscar fornecedor por ID
  async function buscarFornecedorPorId(e) {
    if (e) e.preventDefault(); // impede o refresh da página para não perder dados ao clicar em buscar 
    if (!idBusca) {
      exibirMensagem('erro', 'Informe um ID para realizar a busca.');
      return;
    }

    try {
      const res = await axios.get(`${API_URL}/${idBusca}`);
      setFornecedorBuscado(res.data);
      exibirMensagem('sucesso', `Fornecedor ID ${res.data.id} encontrado!`);
    } catch (erro) {
      setFornecedorBuscado(null);
      exibirMensagem('erro', erro.response?.data?.erro || `Fornecedor com ID ${idBusca} não encontrado.`);
    }
  }

  function limparBusca() {
    setIdBusca('');
    setFornecedorBuscado(null);
    setMensagem({ tipo: '', texto: '' });
  }

  // POST - Cadastrar fornecedor
  async function cadastrarFornecedor() {
    if (!nome || !email || !telefone || !endereco) {
      exibirMensagem('erro', 'Preencha todos os campos para cadastrar.');
      return;
    }

    try {
      const res = await axios.post(API_URL, {
        nome: nome,
        email: email,
        telefone: telefone,
        endereco: endereco
      });
      exibirMensagem('sucesso', `Fornecedor "${res.data.nome}" cadastrado com sucesso (ID: ${res.data.id})`);
      limparFormulario();
      carregarFornecedores();
    } catch (erro) {
      console.error('Erro ao cadastrar fornecedor:', erro);
      exibirMensagem('erro', erro.response?.data?.erro || 'Erro ao cadastrar fornecedor.');
    }
  }

  // PUT - Atualizar fornecedor
  async function atualizarFornecedor() {
    if (!idEmEdicao) return; // garante que o idEmEdicao existe antes de atualizar

    if (!nome || !email || !telefone || !endereco) {
      exibirMensagem('erro', 'Preencha todos os campos para atualizar.');
      return;
    }

    try {
      const res = await axios.put(`${API_URL}/${idEmEdicao}`, {
        nome: nome,
        email: email,
        telefone: telefone,
        endereco: endereco
      });
      exibirMensagem('sucesso', `Fornecedor ID ${idEmEdicao} atualizado com sucesso!`);
      limparFormulario();
      carregarFornecedores();

      if (fornecedorBuscado && fornecedorBuscado.id === idEmEdicao) {
        setFornecedorBuscado(res.data);
      }
    } catch (erro) {
      console.error('Erro ao atualizar fornecedor:', erro);
      exibirMensagem('erro', erro.response?.data?.erro || 'Erro ao atualizar fornecedor.');
    }
  }

  function salvarFornecedor(e) {
    if (e) e.preventDefault(); // impede o refresh da página para não perder dados ao clicar em salvar 
    if (idEmEdicao) {
      atualizarFornecedor();
    } else {
      cadastrarFornecedor();
    }
  }

  function iniciarEdicao(item) {
    setIdEmEdicao(item.id);
    setNome(item.nome);
    setEmail(item.email);
    setTelefone(item.telefone);
    setEndereco(item.endereco);
    exibirMensagem('info', `Editando fornecedor ID ${item.id}. Modifique os campos abaixo e clique em Salvar.`);
  }

  function cancelarEdicao() {
    limparFormulario();
    exibirMensagem('info', 'Edição cancelada.');
  }

  // DELETE - Deletar fornecedor
  async function deletarFornecedor(id, nomeFornecedor) {
    try {
      await axios.delete(`${API_URL}/${id}`);
      exibirMensagem('sucesso', `Fornecedor "${nomeFornecedor}" (ID: ${id}) deletado com sucesso.`);

      if (idEmEdicao === id) {
        limparFormulario();
      }
      if (fornecedorBuscado && fornecedorBuscado.id === id) {
        setFornecedorBuscado(null);
      }

      carregarFornecedores(); // chamar novamente a função para atualizar a lista
    } catch (erro) {
      console.error('Erro ao deletar fornecedor:', erro);
      exibirMensagem('erro', erro.response?.data?.erro || `Erro ao deletar fornecedor ID ${id}.`);
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold">
        Fornecedores
      </Typography>

      {mensagem.texto && (
        <Alert
          severity={mensagem.tipo === 'erro' ? 'error' : mensagem.tipo === 'info' ? 'info' : 'success'}
          onClose={() => setMensagem({ tipo: '', texto: '' })}
          sx={{ mb: 3 }}
        >
          {mensagem.texto}
        </Alert>
      )}

      <Card sx={{ mb: 3 }} variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Buscar Fornecedor por ID
          </Typography>
          <Box component="form" onSubmit={buscarFornecedorPorId} sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              label="ID do Fornecedor"
              type="number"
              size="small"
              value={idBusca}
              onChange={(e) => setIdBusca(e.target.value)}
              sx={{ minWidth: 200 }}
            />
            <Button type="submit" variant="contained" color="primary">
              Buscar
            </Button>
            <Button type="button" variant="outlined" color="inherit" onClick={limparBusca}>
              Limpar Busca
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }} variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {idEmEdicao ? "Editar Fornecedor" : "Cadastrar Novo Fornecedor"} 
          </Typography>
          <Box component="form" onSubmit={salvarFornecedor}>
            <Stack spacing={2}>
              <TextField
                label="Nome"
                variant="outlined"
                size="small"
                fullWidth
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
              <TextField
                label="E-mail"
                type="email"
                variant="outlined"
                size="small"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <TextField
                label="Telefone"
                variant="outlined"
                size="small"
                fullWidth
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                required
              />
              <TextField
                label="Endereço"
                variant="outlined"
                size="small"
                fullWidth
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                required
              />
              <Stack direction="row" spacing={2}> 
                <Button type="submit" variant="contained" color={idEmEdicao ? 'success' : 'primary'}>
                  {idEmEdicao ? 'Salvar Alterações' : 'Cadastrar Fornecedor'}
                </Button>
                {idEmEdicao && (
                  <Button type="button" variant="outlined" color="inherit" onClick={cancelarEdicao}>
                    Cancelar Edição
                  </Button>
                )}
              </Stack>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      {fornecedorBuscado ? (
        <Card variant="outlined" sx={{ bgcolor: '#fafafa' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              Informações do Fornecedor #{fornecedorBuscado.id}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, my: 2 }}>
              <Typography variant="body1"><strong>ID:</strong> {fornecedorBuscado.id}</Typography>
              <Typography variant="body1"><strong>Nome:</strong> {fornecedorBuscado.nome}</Typography>
              <Typography variant="body1"><strong>E-mail:</strong> {fornecedorBuscado.email}</Typography>
              <Typography variant="body1"><strong>Telefone:</strong> {fornecedorBuscado.telefone}</Typography>
              <Typography variant="body1"><strong>Endereço:</strong> {fornecedorBuscado.endereco}</Typography>
            </Box>

            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <Button variant="outlined" onClick={limparBusca}>
                Voltar para a Tabela
              </Button>
              <Button variant="contained" color="warning" onClick={() => iniciarEdicao(fornecedorBuscado)}>
                Editar
              </Button>
              <Button variant="contained" color="error" onClick={() => deletarFornecedor(fornecedorBuscado.id, fornecedorBuscado.nome)}>
                Deletar
              </Button>
            </Stack>
          </CardContent>
        </Card>
      ) : (
        <TabelaFornecedor
          fornecedores={fornecedores}
          onEditar={iniciarEdicao}
          onDeletar={deletarFornecedor}
          idEmEdicao={idEmEdicao}
          carregando={carregando}
          onRecarregar={carregarFornecedores}
        />
      )}
    </Container>
  );
}
