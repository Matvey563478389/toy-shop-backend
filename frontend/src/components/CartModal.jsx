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
  Stack,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { assetUrl } from '../shared/assetUrl.js';
import { formatRub } from '../shared/shopConstants.js';

export const CartModal = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();

  const totalSum = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  const goCheckout = () => {
    if (!user) {
      alert('Войдите, чтобы оформить заказ');
      return;
    }
    onClose();
    navigate('/checkout');
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: { xs: '100vw', sm: 400 }, p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" fontWeight="bold">
            Корзина
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        <List sx={{ flexGrow: 1, overflowY: 'auto', mt: 2 }}>
          {cart.length === 0 ? (
            <Typography sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}>Корзина пуста</Typography>
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
                  <Avatar variant="rounded" src={item.image_url ? assetUrl(item.image_url) : ''} sx={{ width: 60, height: 60, mr: 2 }} />
                </ListItemAvatar>
                <ListItemText
                  primary={item.title}
                  secondary={
                    <Box component="span">
                      <Typography variant="body2" color="primary" fontWeight="bold">
                        {formatRub(item.price)}
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="h6">Товары:</Typography>
              <Typography variant="h6" fontWeight="bold" color="primary">
                {formatRub(totalSum)}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
              Доставка и промокод — на странице оформления
            </Typography>
            <Button variant="contained" fullWidth size="large" sx={{ borderRadius: 2 }} onClick={goCheckout}>
              Перейти к оформлению
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};
