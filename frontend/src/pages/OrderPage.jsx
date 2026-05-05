import { useEffect, useState } from "react";
import { Container, Typography, Card, Stack, Box, Chip, Divider } from "@mui/material";
import api from "../shared/api.js";
import { formatRub } from "../shared/shopConstants.js";
import { orderStatusChipColor, orderStatusLabel } from "../shared/orderStatuses.js";

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/order/my').then(res => setOrders(res.data));
  }, []);

  return (
    <Container sx={{ py: 2 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">Мои заказы</Typography>
      <Stack spacing={3}>
        {orders.map(order => (
          <Card key={order.id} sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="h6">Заказ №{order.id}</Typography>
              <Chip label={orderStatusLabel(order.status)} color={orderStatusChipColor(order.status)} />
            </Box>
            <Typography color="text.secondary" variant="body2">{new Date(order.created_at).toLocaleString('ru-RU')}</Typography>
            <Divider sx={{ my: 2 }} />
            {order.items.map((item, idx) => (
              <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
                <Typography>{item.title} × {item.quantity}</Typography>
                <Typography fontWeight="bold">{formatRub(Number(item.price) * item.quantity)}</Typography>
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" textAlign="right" color="text.secondary" sx={{ mb: 0.5 }}>
              Доставка:{' '}
              {Number(order.shipping_cost) === 0
                ? 'бесплатно'
                : formatRub(order.shipping_cost)}
            </Typography>
            {Number(order.promo_discount) > 0 && order.promo_code && (
              <Typography variant="body2" textAlign="right" color="success.main" sx={{ mb: 1 }}>
                Промокод {order.promo_code}: −{formatRub(order.promo_discount)}
              </Typography>
            )}
            <Typography variant="h6" textAlign="right">Итого: {formatRub(order.total_price)}</Typography>
          </Card>
        ))}
      </Stack>
    </Container>
  );
};
