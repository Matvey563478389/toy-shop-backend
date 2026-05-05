import { useEffect, useState } from "react";
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Stack, MenuItem,
  FormControlLabel, Checkbox,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import api from "../../shared/api.js";
import { assetUrl } from "../../shared/assetUrl.js";
import { formatRub } from "../../shared/shopConstants.js";

export const AdminToysPage = () => {
  const [toys, setToys] = useState([]);
  const [categories, setCategories] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category_id: '',
    compare_price: '',
    badge: '',
    listing_group: 'featured',
    rating: '5',
    review_count: '14',
    sku: '',
    exp_date: '',
    is_popular: false,
  });
  const [imageFile, setImageFile] = useState(null);

  const fetchToys = async () => {
    try {
      const res = await api.get('/toys', { params: { limit: 500, page: 1 } });
      setToys(res.data.items || res.data);
    } catch (error) {
      console.error("Ошибка загрузки товаров", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories/admin');
      setCategories(res.data || []);
    } catch (error) {
      console.error('Ошибка загрузки категорий', error);
    }
  };

  useEffect(() => {
    void fetchToys();
    void fetchCategories();
  }, []);

  useEffect(() => {
    if (!openDialog || categories.length === 0) return;
    setFormData((prev) => {
      const ids = new Set(categories.map((c) => String(c.id)));
      if (prev.category_id && ids.has(prev.category_id)) return prev;
      return { ...prev, category_id: String(categories[0].id) };
    });
  }, [openDialog, categories]);

  const handleOpen = (toy = null) => {
    if (toy) {
      setEditingId(toy.id);
      setFormData({
        title: toy.title,
        description: toy.description,
        price: String(toy.price),
        category_id: toy.category_id != null ? String(toy.category_id) : '',
        compare_price: toy.compare_price != null ? String(toy.compare_price) : '',
        badge: toy.badge || '',
        listing_group: toy.listing_group || 'featured',
        rating: String(toy.rating ?? 5),
        review_count: String(toy.review_count ?? 14),
        sku: toy.sku || '',
        exp_date: toy.exp_date ? String(toy.exp_date).slice(0, 10) : '',
        is_popular: toy.is_popular === true,
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        description: '',
        price: '',
        category_id: categories[0]?.id != null ? String(categories[0].id) : '',
        compare_price: '',
        badge: '',
        listing_group: 'featured',
        rating: '5',
        review_count: '14',
        sku: '',
        exp_date: '',
        is_popular: false,
      });
    }
    setImageFile(null);
    setOpenDialog(true);
  };

  const handleClose = () => setOpenDialog(false);

  const handleDelete = async (id) => {
    if (!window.confirm("Удалить этот товар?")) return;
    try {
      await api.delete(`/toys/${id}`);
      fetchToys();
    } catch (error) {
      console.error("Ошибка удаления", error);
    }
  };

  const handleSubmit = async () => {
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('price', formData.price);
    if (formData.category_id) data.append('category_id', formData.category_id);
    if (formData.compare_price) data.append('compare_price', formData.compare_price);
    if (formData.badge) data.append('badge', formData.badge);
    data.append('listing_group', formData.listing_group);
    data.append('rating', formData.rating);
    data.append('review_count', formData.review_count);
    if (formData.sku) data.append('sku', formData.sku);
    if (formData.exp_date) data.append('exp_date', formData.exp_date);
    data.append('is_popular', formData.is_popular ? '1' : '0');

    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      if (editingId) {
        await api.put(`/toys/${editingId}`, data);
      } else {
        await api.post('/toys', data);
      }
      handleClose();
      fetchToys();
    } catch (error) {
      console.error("Ошибка сохранения", error);
      const msg = error.response?.data?.message || error.message || "Ошибка сохранения";
      alert(msg);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" fontWeight="bold">Управление товарами</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          disabled={categories.length === 0}
        >
          Добавить товар
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'action.hover' }}>
              <TableCell>ID</TableCell>
              <TableCell>Фото</TableCell>
              <TableCell>Название</TableCell>
              <TableCell>Категория</TableCell>
              <TableCell>Цена</TableCell>
              <TableCell>Популярный</TableCell>
              <TableCell align="right">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {toys.map((toy) => (
              <TableRow key={toy.id}>
                <TableCell>{toy.id}</TableCell>
                <TableCell>
                  {toy.image_url ? (
                    <img src={assetUrl(toy.image_url)} alt="toy" style={{ width: 50, height: 50, objectFit: 'cover' }} />
                  ) : "Нет фото"}
                </TableCell>
                <TableCell>{toy.title}</TableCell>
                <TableCell>{toy.category_name || '—'}</TableCell>
                <TableCell>{formatRub(toy.price)}</TableCell>
                <TableCell>{toy.is_popular ? 'Да' : 'Нет'}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleOpen(toy)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(toy.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? "Редактировать товар" : "Новый товар"}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Название"
              fullWidth
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <TextField
              label="Описание"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <TextField
              label="Цена"
              type="number"
              fullWidth
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
            <TextField
              label="Категория"
              fullWidth
              select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              disabled={categories.length === 0}
              helperText={categories.length === 0 ? 'Сначала создайте категории' : undefined}
              SelectProps={{
                MenuProps: {
                  disablePortal: true,
                  slotProps: {
                    paper: { sx: { maxHeight: 320, zIndex: (theme) => theme.zIndex.modal + 2 } },
                  },
                },
              }}
            >
              {categories.map((c) => (
                <MenuItem key={c.id} value={String(c.id)}>{c.name_ru}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Старая цена"
              type="number"
              fullWidth
              value={formData.compare_price}
              onChange={(e) => setFormData({ ...formData, compare_price: e.target.value })}
            />
            <TextField
              label="Бейдж (sale или new)"
              fullWidth
              value={formData.badge}
              onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
            />
            <TextField
              label="Группа витрины"
              fullWidth
              select
              value={formData.listing_group}
              onChange={(e) => setFormData({ ...formData, listing_group: e.target.value })}
              SelectProps={{
                MenuProps: {
                  disablePortal: true,
                  slotProps: {
                    paper: { sx: { zIndex: (theme) => theme.zIndex.modal + 2 } },
                  },
                },
              }}
            >
              <MenuItem value="featured">Избранное</MenuItem>
              <MenuItem value="bestseller">Хиты продаж</MenuItem>
              <MenuItem value="new">Новинки</MenuItem>
            </TextField>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.is_popular}
                  onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                />
              }
              label="Показывать в блоке «Покупатели выбирают» на главной"
            />
            <TextField
              label="Рейтинг (внутреннее поле)"
              type="number"
              fullWidth
              inputProps={{ step: 0.1, min: 0, max: 5 }}
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
            />
            <TextField
              label="Счётчик отзывов (внутреннее поле)"
              type="number"
              fullWidth
              value={formData.review_count}
              onChange={(e) => setFormData({ ...formData, review_count: e.target.value })}
            />
            <TextField
              label="SKU"
              fullWidth
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            />
            <TextField
              label="EXP (YYYY-MM-DD)"
              fullWidth
              value={formData.exp_date}
              onChange={(e) => setFormData({ ...formData, exp_date: e.target.value })}
            />

            <Button variant="outlined" component="label" fullWidth>
              {imageFile ? imageFile.name : "Загрузить изображение"}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Отмена</Button>
          <Button variant="contained" onClick={handleSubmit}>Сохранить</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
