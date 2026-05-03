import { useEffect, useState } from "react";
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Stack
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import api from "../../shared/api.js";
import { assetUrl } from "../../shared/assetUrl.js";

export const AdminToysPage = () => {
  const [toys, setToys] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: ''
  });
  const [imageFile, setImageFile] = useState(null);

  const fetchToys = async () => {
    try {
      const res = await api.get('/toys');
      setToys(res.data);
    } catch (error) {
      console.error("Ошибка загрузки товаров", error);
    }
  };

  useEffect(() => {
    fetchToys();
  }, []);

  const handleOpen = (toy = null) => {
    if (toy) {
      setEditingId(toy.id);
      setFormData({ title: toy.title, description: toy.description, price: toy.price });
    } else {
      setEditingId(null);
      setFormData({ title: '', description: '', price: '' });
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
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" fontWeight="bold">Управление товарами</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
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
              <TableCell>Цена</TableCell>
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
                <TableCell>{toy.price} ₽</TableCell>
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

            <Button variant="outlined" component="label" fullWidth>
              {imageFile ? imageFile.name : "Загрузить изображение"}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  console.log("Выбранный файл:", e.target.files[0]); // Добавь этот лог
                  setImageFile(e.target.files[0]);
                }}
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