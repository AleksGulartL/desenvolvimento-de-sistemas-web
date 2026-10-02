import { Card, CardContent, Typography, Button, Stack } from '@mui/material';

export default function DadosFornecedor({ fornecedor, onEdit, onDelete }) {
  if (!fornecedor) return null;

  return (
    <Card variant="outlined" sx={{ mt: 2, bgcolor: '#f9f9f9' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Dados do Fornecedor #{fornecedor.id}
        </Typography>
        <Typography variant="body1"><strong>Nome:</strong> {fornecedor.nome}</Typography>
        <Typography variant="body2"><strong>Email:</strong> {fornecedor.email}</Typography>
        <Typography variant="body2"><strong>Telefone:</strong> {fornecedor.telefone}</Typography>
        <Typography variant="body2"><strong>Endereço:</strong> {fornecedor.endereco}</Typography>

        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          {onEdit && (
            <Button size="small" variant="contained" color="warning" onClick={() => onEdit(fornecedor)}>
              Editar
            </Button>
          )}
          {onDelete && (
            <Button size="small" variant="contained" color="error" onClick={() => onDelete(fornecedor.id, fornecedor.nome)}>
              Delet
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}