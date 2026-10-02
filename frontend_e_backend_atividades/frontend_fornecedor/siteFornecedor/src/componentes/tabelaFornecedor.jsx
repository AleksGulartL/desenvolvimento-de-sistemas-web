import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  Stack
} from '@mui/material';

export default function TabelaFornecedor({
  fornecedores = [],
  onEditar,
  onDeletar,
  idEmEdicao,
  carregando = false,
  onRecarregar
}) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Lista de Fornecedores ({fornecedores.length})
          </Typography>
          {onRecarregar && (
            <Button
              variant="outlined"
              size="small"
              onClick={onRecarregar}
              disabled={carregando}
            >
              {carregando ? 'Atualizando...' : 'Recarregar'}
            </Button>
          )}
        </Box>

        {fornecedores.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ py: 3 }}>
            Nenhum fornecedor cadastrado no momento.
          </Typography>
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#fafafa' }}>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>Nome</strong></TableCell>
                  {(onEditar || onDeletar) && (
                    <TableCell align="center"><strong>Ações</strong></TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {fornecedores.map((item) => (
                  <TableRow
                    key={item.id}
                    sx={idEmEdicao === item.id ? { bgcolor: '#e3f2fd' } : undefined}
                  >
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.nome}</TableCell>
                    {(onEditar || onDeletar) && (
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          {onEditar && (
                            <Button
                              size="small"
                              variant="contained"
                              color="warning"
                              onClick={() => onEditar(item)}
                            >
                              Editar
                            </Button>
                          )}
                          {onDeletar && (
                            <Button
                              size="small"
                              variant="contained"
                              color="error"
                              onClick={() => onDeletar(item.id, item.nome)}
                            >
                              Deletar
                            </Button>
                          )}
                        </Stack>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
}
