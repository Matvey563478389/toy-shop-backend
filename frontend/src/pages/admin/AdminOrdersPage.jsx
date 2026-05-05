import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Select, MenuItem, Typography } from "@mui/material";
import api from "../../shared/api.js";
import { formatRub } from "../../shared/shopConstants.js";
import { ORDER_STATUS_LABELS } from "../../shared/orderStatuses.js";

const STATUS_KEYS = Object.keys(ORDER_STATUS_LABELS);

export const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = () => api.get('/order/all').then(res => setOrders(res.data));

  useEffect(() => { void fetchOrders(); }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/order/${id}`, { status: newStatus });
      await fetchOrders();
    } catch (e) {
      const msg = e.response?.data?.message || "Ошибка обновления статуса";
      alert(msg);
    }
  };

  return (
    <Paper sx={{ p: 3, overflowX: 'auto' }}>
      <Typography variant="h5" mb={3} fontWeight={800}>Управление заказами</Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Клиент</TableCell>
            <TableCell sx={{ minWidth: 200 }}>Товары</TableCell>
            <TableCell>Сумма</TableCell>
            <TableCell>Промо</TableCell>
            <TableCell sx={{ minWidth: 180 }}>Статус</TableCell>
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
                {order.items.map(i => `${i.title} (×${i.quantity})`).join(', ')}
              </TableCell>
              <TableCell>{formatRub(order.total_price)}</TableCell>
              <TableCell>
                {order.promo_code ? (
                  <>
                    {order.promo_code}
                    <Typography variant="caption" display="block" color="text.secondary">
                      −{formatRub(order.promo_discount || 0)}
                    </Typography>
                  </>
                ) : (
                  '—'
                )}
              </TableCell>
              <TableCell>
                <Select
                  value={order.status || 'pending'}
                  size="small"
                  fullWidth
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                >
                  {STATUS_KEYS.map((key) => (
                    <MenuItem key={key} value={key}>
                      {ORDER_STATUS_LABELS[key]}
                    </MenuItem>
                  ))}
                  {order.status && !STATUS_KEYS.includes(order.status) && (
                    <MenuItem value={order.status}>{order.status}</MenuItem>
                  )}
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};
