import { useEffect, useState } from "react";
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import api from "../../shared/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

export const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const { user: currentUser } = useAuth();

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (error) {
      console.error("Ошибка при загрузке пользователей", error);
    }
  };

  useEffect(() => {
    void fetchUsers();
  }, []);

  const handleDelete = async (row) => {
    if (row.id === currentUser?.id) {
      alert("Нельзя удалить свою учётную запись.");
      return;
    }
    if (!window.confirm(`Удалить пользователя ${row.email}?`)) return;
    try {
      await api.delete(`/users/${row.id}`);
      await fetchUsers();
    } catch (error) {
      const msg = error.response?.data?.message || "Не удалось удалить пользователя";
      alert(msg);
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Пользователи
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Удаление недоступно для собственного аккаунта и для последнего администратора (ограничение сервера).
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'action.hover' }}>
              <TableCell>ID</TableCell>
              <TableCell>Имя</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Адрес</TableCell>
              <TableCell>Телефон</TableCell>
              <TableCell>Роль</TableCell>
              <TableCell align="right">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.id}</TableCell>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.address}</TableCell>
                <TableCell>{u.phone}</TableCell>
                <TableCell>{u.role}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="error"
                    aria-label="Удалить пользователя"
                    onClick={() => handleDelete(u)}
                    disabled={u.id === currentUser?.id}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
