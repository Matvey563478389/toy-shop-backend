import {
  Box,
  Button,
  Container,
  Typography,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { formatRub } from '../shared/shopConstants.js';
import { assetUrl } from '../shared/assetUrl.js';
import { shippingRubForSubtotal } from '../shared/shipping.js';

export const CartPage = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const subtotal = cart.reduce((s, i) => s + Number(i.price) * i.quantity, 0);
  const shipping = cart.length ? shippingRubForSubtotal(subtotal) : 0;
  const total = subtotal + shipping;

  return (
    <Box sx={{ py: 4, bgcolor: '#fafafa', minHeight: '50vh' }}>
      <Container maxWidth="lg">
        <Typography variant="h3" fontWeight={800} gutterBottom sx={{ textAlign: 'left' }}>
          Корзина
        </Typography>

        {cart.length === 0 ? (
          <Typography color="text.secondary" sx={{ py: 4 }}>
            Корзина пуста.{' '}
            <Button component={Link} to="/shop">
              Перейти в каталог
            </Button>
          </Typography>
        ) : (
          <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3} alignItems="flex-start">
            <TableContainer component={Paper} sx={{ flex: 1, borderRadius: 3 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.100' }}>
                    <TableCell>Товар</TableCell>
                    <TableCell>Цена</TableCell>
                    <TableCell>Кол-во</TableCell>
                    <TableCell>Сумма</TableCell>
                    <TableCell align="right"> </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cart.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box
                            component="img"
                            src={item.image_url ? assetUrl(item.image_url) : ''}
                            alt=""
                            sx={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}
                          />
                          <Typography fontWeight={700}>{item.title}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>{formatRub(item.price)}</TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center">
                          <IconButton size="small" onClick={() => updateQuantity(item.id, -1)} aria-label="Уменьшить">
                            <RemoveIcon />
                          </IconButton>
                          <Typography component="span" sx={{ px: 0.5 }}>
                            {item.quantity}
                          </Typography>
                          <IconButton size="small" onClick={() => updateQuantity(item.id, 1)} aria-label="Увеличить">
                            <AddIcon />
                          </IconButton>
                        </Stack>
                      </TableCell>
                      <TableCell>{formatRub(Number(item.price) * item.quantity)}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => removeFromCart(item.id)} aria-label="Удалить">
                          <CloseIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Paper sx={{ width: { xs: '100%', lg: 320 }, p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight={800} gutterBottom>
                Итого
              </Typography>
              <Stack spacing={1} sx={{ mb: 2 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">Товары</Typography>
                  <Typography fontWeight={700}>{formatRub(subtotal)}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">Доставка</Typography>
                  <Typography fontWeight={700}>
                    {shipping === 0 ? 'Бесплатно' : formatRub(shipping)}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography fontWeight={800}>Всего</Typography>
                  <Typography fontWeight={800}>{formatRub(total)}</Typography>
                </Stack>
              </Stack>
              <Button variant="contained" color="secondary" fullWidth size="large" onClick={() => navigate('/checkout')}>
                Оформить заказ
              </Button>
            </Paper>
          </Stack>
        )}
      </Container>
    </Box>
  );
};
