import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  FormControlLabel,
  Switch,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import api from '../../shared/api.js';
import { useRefreshShopCategories } from '../../context/CategoriesContext.jsx';

const emptyForm = {
  slug: '',
  name_ru: '',
  sort_order: '0',
  active: true,
};

export const AdminCategoriesPage = () => {
  const refreshShopCategories = useRefreshShopCategories();
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    const res = await api.get('/categories/admin');
    setRows(res.data);
  };

  useEffect(() => {
    void load().catch(() => {});
  }, []);

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (row) => {
    setEditingId(row.id);
    setForm({
      slug: row.slug,
      name_ru: row.name_ru,
      sort_order: String(row.sort_order ?? 0),
      active: row.active !== false,
    });
    setOpen(true);
  };

  const save = async () => {
    const payload = {
      slug: form.slug.trim().toLowerCase(),
      name_ru: form.name_ru.trim(),
      sort_order: parseInt(form.sort_order, 10) || 0,
      active: form.active,
    };
    if (editingId) {
      await api.put(`/categories/${editingId}`, payload);
    } else {
      await api.post('/categories', payload);
    }
    setOpen(false);
    await load();
    void refreshShopCategories();
  };

  const remove = async (id) => {
    if (!window.confirm('Удалить категорию?')) return;
    try {
      await api.delete(`/categories/${id}`);
      await load();
      void refreshShopCategories();
    } catch (e) {
      alert(e.response?.data?.message || 'Не удалось удалить');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" fontWeight={800}>
          Категории
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openNew}>
          Добавить
        </Button>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Код (slug) — латиница в нижнем регистре и дефисы, например: <code>razvivayushchie</code>. Его использует каталог в адресе и API.
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell>Код</TableCell>
              <TableCell>Название</TableCell>
              <TableCell>Порядок</TableCell>
              <TableCell>Товаров</TableCell>
              <TableCell>Активна</TableCell>
              <TableCell align="right">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell sx={{ fontWeight: 700 }}>{r.slug}</TableCell>
                <TableCell>{r.name_ru}</TableCell>
                <TableCell>{r.sort_order}</TableCell>
                <TableCell>{r.toys_count ?? 0}</TableCell>
                <TableCell>{r.active ? 'Да' : 'Нет'}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" color="primary" onClick={() => openEdit(r)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => void remove(r.id)}>
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? 'Редактировать категорию' : 'Новая категория'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Код (slug)"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              fullWidth
              disabled={Boolean(editingId)}
              helperText={editingId ? 'Код нельзя менять через форму (создайте новую категорию)' : 'Только a-z, 0-9 и дефис'}
            />
            <TextField
              label="Название на русском"
              value={form.name_ru}
              onChange={(e) => setForm({ ...form, name_ru: e.target.value })}
              fullWidth
            />
            <TextField
              label="Порядок сортировки"
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
              fullWidth
            />
            <FormControlLabel
              control={<Switch checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />}
              label="Активна (видна в витрине)"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Отмена</Button>
          <Button variant="contained" onClick={() => void save().catch((e) => alert(e.response?.data?.message || 'Ошибка'))}>
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
