import { useEffect, useState } from "react";
import {
  Box, Typography, Grid, Card, CardMedia, CardContent, CardActions,
  Button, Pagination, Container, CircularProgress, Fab, Badge
} from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import api from "../shared/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useNavigate } from "react-router-dom";
import { CartModal } from "../components/CartModal.jsx";

export const CatalogPage = () => {
  const [toys, setToys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  const { user } = useAuth();
  const { cart, addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchToys = async () => {
      try {
        const res = await api.get('/toys');
        setToys(res.data);
      } catch (error) {
        console.error("Ошибка загрузки каталога", error);
      } finally {
        setLoading(false);
      }
    };
    fetchToys();
  }, []);

  const handleAddToCart = (toy) => {
    if (user) {
      addToCart(toy);
    } else {
      navigate('/login');
    }
  };

  const pageCount = Math.ceil(toys.length / itemsPerPage);
  const currentToys = toys.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <Container maxWidth="md" sx={{ py: 4, position: 'relative' }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, textAlign: 'center' }}>
        Каталог товаров
      </Typography>

      {cart.length > 0 && (
        <Fab
          color="primary"
          sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}
          onClick={() => setIsCartOpen(true)}
        >
          <Badge badgeContent={cart.reduce((a, b) => a + b.quantity, 0)} color="error">
            <ShoppingCartIcon />
          </Badge>
        </Fab>
      )}

      <Grid container spacing={3} justifyContent="center">
        {currentToys.map((toy) => (
          <Grid item key={toy.id} xs={12} sm={6} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Card sx={{ width: '100%', maxWidth: 280, height: '440px', display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
              <CardMedia
                component="img"
                sx={{ height: 220, objectFit: 'cover' }}
                image={toy.image_url ? `http://localhost:3000${toy.image_url}` : 'https://via.placeholder.com/400x300?text=No+Image'}
              />
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', minHeight: '2.4em' }}>{toy.title}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, height: '3.2em', overflow: 'hidden' }}>
                  {toy.description}
                </Typography>
                <Box sx={{ mt: 'auto' }}>
                  <Typography variant="h6" color="primary" fontWeight="bold">{toy.price} ₽</Typography>
                </Box>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  variant="contained"
                  fullWidth
                  size="small"
                  startIcon={<ShoppingCartIcon />}
                  onClick={() => handleAddToCart(toy)}
                >
                  В корзину
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {pageCount > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <Pagination count={pageCount} page={page} onChange={(e, v) => setPage(v)} color="primary" />
        </Box>
      )}

      <CartModal open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </Container>
  );
};