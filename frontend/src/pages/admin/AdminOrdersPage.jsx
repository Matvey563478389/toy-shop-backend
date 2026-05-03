import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Select, MenuItem, Typography } from "@mui/material";
import api from "../../shared/api.js";

export const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = () => api.get('/order/all').then(res => setOrders(res.data));

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/order/${id}`, { status: newStatus });
      fetchOrders();
    } catch (e) { alert("Ошибка обновления статуса"); }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" mb={3}>Управление заказами</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Клиент</TableCell>
            <TableCell>Товары</TableCell>
            <TableCell>Сумма</TableCell>
            <TableCell>Статус</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>
                {order.user_name} <br />
                <Typography variant="caption">{order.phone}</Typography>
              </TableCell>
              <TableCell>
                {order.items.map(i => `${i.title} (x${i.quantity})`).join(', ')}
              </TableCell>
              <TableCell>{order.total_price} ₽</TableCell>
              <TableCell>
                <Select
                  value={order.status}
                  size="small"
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                >
                  <MenuItem value="pending">Ожидает</MenuItem>
                  <MenuItem value="processing">В работе</MenuItem>
                  <MenuItem value="delivered">Доставлен</MenuItem>
                  <MenuItem value="cancelled">Отменен</MenuItem>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};