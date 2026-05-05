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
  MenuItem,
  FormControlLabel,
  Switch,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import api from '../../shared/api.js';
import { formatRub } from '../../shared/shopConstants.js';

const emptyForm = {
  code: '',
  description: '',
  discount_type: 'percent',
  discount_value: '10',
  min_order_subtotal: '0',
  max_uses: '',
  active: true,
  valid_from: '',
  valid_until: '',
};

export const AdminPromoPage = () => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    const res = await api.get('/promo-codes');
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
      code: row.code,
      description: row.description || '',
      discount_type: row.discount_type,
      discount_value: String(row.discount_value),
      min_order_subtotal: String(row.min_order_subtotal ?? 0),
      max_uses: row.max_uses != null ? String(row.max_uses) : '',
      active: row.active !== false,
      valid_from: row.valid_from ? String(row.valid_from).slice(0, 10) : '',
      valid_until: row.valid_until ? String(row.valid_until).slice(0, 10) : '',
    });
    setOpen(true);
  };

  const save = async () => {
    const payload = {
      code: form.code.trim(),
      description: form.description.trim() || null,
      discount_type: form.discount_type,
      discount_value: Number(form.discount_value),
      min_order_subtotal: Number(form.min_order_subtotal || 0),
      max_uses: form.max_uses === '' ? null : parseInt(form.max_uses, 10),
      active: form.active,
      valid_from: form.valid_from || null,
      valid_until: form.valid_until || null,
    };
    if (editingId) {
      await api.put(`/promo-codes/${editingId}`, payload);
    } else {
      await api.post('/promo-codes', payload);
    }
    setOpen(false);
    await load();
  };

  const remove = async (id) => {
    if (!window.confirm('Удалить промокод?')) return;
    await api.delete(`/promo-codes/${id}`);
    await load();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" fontWeight={800}>
          Промокоды
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openNew}>
          Добавить
        </Button>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Ввод промокода для покупателей только на странице оформления заказа. Здесь — настройка скидок на сервере.
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell>Код</TableCell>
              <TableCell>Тип</TableCell>
              <TableCell>Значение</TableCell>
              <TableCell>Мин. сумма</TableCell>
              <TableCell>Использований</TableCell>
              <TableCell>Активен</TableCell>
              <TableCell align="right">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell sx={{ fontWeight: 700 }}>{r.code}</TableCell>
                <TableCell>{r.discount_type === 'percent' ? '%' : '₽'}</TableCell>
                <TableCell>
                  {r.discount_type === 'percent' ? `${r.discount_value}%` : formatRub(r.discount_value)}
                </TableCell>
                <TableCell>{formatRub(r.min_order_subtotal)}</TableCell>
                <TableCell>
                  {r.uses_count}
                  {r.max_uses != null ? ` / ${r.max_uses}` : ''}
                </TableCell>
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
        <DialogTitle>{editingId ? 'Редактировать промокод' : 'Новый промокод'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Код"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              fullWidth
              helperText="Будет сохранён в верхнем регистре"
            />
            <TextField
              label="Описание (необязательно)"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              fullWidth
            />
            <TextField
              select
              label="Тип скидки"
              value={form.discount_type}
              onChange={(e) => setForm({ ...form, discount_type: e.target.value })}
              fullWidth
            >
              <MenuItem value="percent">Процент от суммы товаров</MenuItem>
              <MenuItem value="fixed">Фиксированная сумма (₽)</MenuItem>
            </TextField>
            <TextField
              label={form.discount_type === 'percent' ? 'Процент' : 'Сумма скидки (₽)'}
              type="number"
              value={form.discount_value}
              onChange={(e) => setForm({ ...form, discount_value: e.target.value })}
              fullWidth
              inputProps={{ step: form.discount_type === 'percent' ? 1 : 50, min: 0.01 }}
            />
            <TextField
              label="Мин. сумма товаров (₽)"
              type="number"
              value={form.min_order_subtotal}
              onChange={(e) => setForm({ ...form, min_order_subtotal: e.target.value })}
              fullWidth
            />
            <TextField
              label="Лимит активаций (пусто = без лимита)"
              type="number"
              value={form.max_uses}
              onChange={(e) => setForm({ ...form, max_uses: e.target.value })}
              fullWidth
            />
            <Stack direction="row" spacing={2}>
              <TextField
                label="Действует с"
                type="date"
                value={form.valid_from}
                onChange={(e) => setForm({ ...form, valid_from: e.target.value })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Действует до"
                type="date"
                value={form.valid_until}
                onChange={(e) => setForm({ ...form, valid_until: e.target.value })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Stack>
            <FormControlLabel
              control={<Switch checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />}
              label="Активен"
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
