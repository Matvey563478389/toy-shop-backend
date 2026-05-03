import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Button,
  Divider,
  Stack
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import { useCart } from "../context/CartContext.jsx";
import {useAuth} from "../context/AuthContext.jsx";
import api from "../shared/api.js";

export const CartModal = ({ open, onClose }) => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();

  const totalSum = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);


  const handleCreateOrder = async () => {
    if (!user) {
      alert("Пожалуйста, войдите в систему, чтобы оформить заказ");
      return;
    }

    if (!user.address || !user.phone) {
      alert("Пожалуйста, заполните адрес и телефон в профиле");
      return;
    }

    try {
      const orderData = {
        items: cart,
        totalPrice: totalSum,
        address: user.address,
        phone: user.phone
      };

      await api.post('/order', orderData);
      alert("Заказ успешно оформлен!");
      clearCart();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Ошибка при создании заказа");
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: { xs: '100vw', sm: 400 }, p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" fontWeight="bold">Корзина</Typography>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Box>

        <Divider />

        <List sx={{ flexGrow: 1, overflowY: 'auto', mt: 2 }}>
          {cart.length === 0 ? (
            <Typography sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}>
              Корзина пуста
            </Typography>
          ) : (
            cart.map((item) => (
              <ListItem
                key={item.id}
                secondaryAction={
                  <IconButton edge="end" color="error" onClick={() => removeFromCart(item.id)}>
                    <DeleteIcon />
                  </IconButton>
                }
                sx={{ px: 0 }}
              >
                <ListItemAvatar>
                  <Avatar
                    variant="rounded"
                    src={item.image_url ? `http://localhost:3000${item.image_url}` : ''}
                    sx={{ width: 60, height: 60, mr: 2 }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={item.title}
                  secondary={
                    <Box component="span">
                      <Typography variant="body2" color="primary" fontWeight="bold">
                        {item.price} ₽
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
                        <IconButton size="small" onClick={() => updateQuantity(item.id, -1)}>
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography>{item.quantity}</Typography>
                        <IconButton size="small" onClick={() => updateQuantity(item.id, 1)}>
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Box>
                  }
                />
              </ListItem>
            ))
          )}
        </List>

        {cart.length > 0 && (
          <Box sx={{ mt: 'auto', pt: 2 }}>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">Итого:</Typography>
              <Typography variant="h6" fontWeight="bold" color="primary">
                {totalSum} ₽
              </Typography>
            </Box>
            <Button
              variant="contained"
              fullWidth
              size="large"
              sx={{ borderRadius: 2 }}
              onClick={handleCreateOrder}
            >
              Оформить заказ
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};