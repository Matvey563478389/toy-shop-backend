import { useEffect, useState } from "react";
import { Container, Typography, Card, Stack, Box, Chip, Divider } from "@mui/material";
import api from "../shared/api.js";

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/order/my').then(res => setOrders(res.data));
  }, []);

  const getStatusColor = (status) => {
    const colors = { pending: 'warning', delivered: 'success', cancelled: 'error' };
    return colors[status] || 'default';
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom fontWeight="bold">Мои заказы</Typography>
      <Stack spacing={3}>
        {orders.map(order => (
          <Card key={order.id} sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Заказ №{order.id}</Typography>
              <Chip label={order.status.toUpperCase()} color={getStatusColor(order.status)} />
            </Box>
            <Typography color="text.secondary" variant="body2">{new Date(order.created_at).toLocaleString()}</Typography>
            <Divider sx={{ my: 2 }} />
            {order.items.map((item, idx) => (
              <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
                <Typography>{item.title} x{item.quantity}</Typography>
                <Typography fontWeight="bold">{item.price * item.quantity} ₽</Typography>
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" textAlign="right">Итого: {order.total_price} ₽</Typography>
          </Card>
        ))}
      </Stack>
    </Container>
  );
};