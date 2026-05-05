import { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Stack,
  Grid,
  IconButton,
  TextField,
  Card,
  CardMedia,
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import PinterestIcon from '@mui/icons-material/Pinterest';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../shared/api.js';
import { formatRub } from '../shared/shopConstants.js';
import { ProductCardShop } from '../components/shop/ProductCardShop.jsx';
import { assetUrl } from '../shared/assetUrl.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [toy, setToy] = useState(null);
  const [related, setRelated] = useState([]);
  const [qty, setQty] = useState(1);

  const categoryLabel = useMemo(() => {
    if (!toy) return '';
    return toy.category_name || toy.category_slug || '';
  }, [toy]);

  useEffect(() => {
    api.get(`/toys/${id}`).then((res) => setToy(res.data)).catch(() => navigate('/shop'));
  }, [id, navigate]);

  useEffect(() => {
    if (!id) return;
    api.get(`/toys/${id}/related`, { params: { limit: 4 } }).then((res) => setRelated(res.data));
  }, [id]);

  if (!toy) {
    return null;
  }

  const img = toy.image_url ? assetUrl(toy.image_url) : '';

  const handleAdd = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    for (let i = 0; i < qty; i += 1) {
      addToCart(toy);
    }
  };

  const exp = toy.exp_date ? new Date(toy.exp_date).toLocaleDateString('ru-RU') : '—';

  return (
    <Box sx={{ py: 3, bgcolor: '#fafafa' }}>
      <Container maxWidth="lg">
        <Breadcrumbs sx={{ mb: 2 }}>
          <MuiLink component={Link} to="/" underline="hover" color="primary">
            Главная
          </MuiLink>
          <Typography color="text.primary">{toy.title}</Typography>
        </Breadcrumbs>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
              <CardMedia
                component="img"
                image={img}
                alt={toy.title}
                sx={{
                  width: '100%',
                  aspectRatio: '4/3',
                  objectFit: 'cover',
                  bgcolor: '#fafafa',
                }}
              />
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={{ textAlign: 'left' }}>
            <Typography variant="h4" fontWeight={800} gutterBottom>
              {toy.title}
            </Typography>
            <Typography variant="h5" fontWeight={800} gutterBottom>
              {formatRub(toy.price)}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              {toy.description}
            </Typography>
            <Typography variant="body2" fontWeight={700} gutterBottom>
              Поделиться:
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              {[InstagramIcon, TwitterIcon, FacebookIcon, PinterestIcon].map((Icon, i) => (
                <IconButton key={i} size="small" sx={{ border: '1px solid', borderColor: 'divider' }} aria-label="Соцсеть">
                  <Icon fontSize="small" />
                </IconButton>
              ))}
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap" sx={{ mb: 2 }}>
              <Stack direction="row" alignItems="center" sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <IconButton onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Меньше">
                  <RemoveIcon />
                </IconButton>
                <TextField
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  size="small"
                  sx={{ width: 56, '& input': { textAlign: 'center' } }}
                />
                <IconButton onClick={() => setQty((q) => q + 1)} aria-label="Больше">
                  <AddIcon />
                </IconButton>
              </Stack>
              <Button variant="contained" size="large" startIcon={<AddShoppingCartIcon />} onClick={handleAdd}>
                В корзину
              </Button>
            </Stack>
            <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2, mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {toy.description?.slice(0, 120)}…
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Артикул
                  </Typography>
                  <Typography fontWeight={700}>{toy.sku || '—'}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Категория
                  </Typography>
                  <Typography fontWeight={700}>{categoryLabel}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Возраст
                  </Typography>
                  <Typography fontWeight={700}>2–5 лет</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Годен до
                  </Typography>
                  <Typography fontWeight={700}>{exp}</Typography>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2, bgcolor: 'rgba(34,134,169,0.06)' }}>
              <Typography fontWeight={800} gutterBottom>
                Оплата при получении
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Оплата наличными или картой курьеру (или при самовывозе) — только когда вы получите игрушки. Онлайн-оплата на сайте не
                требуется.
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 6 }}>
          <Typography variant="h6" fontWeight={800} gutterBottom>
            Описание
          </Typography>
          <Typography color="text.secondary" textAlign="left">
            {toy.description}
          </Typography>
        </Box>

        <Typography variant="h5" fontWeight={800} textAlign="center" sx={{ mt: 4, mb: 2 }}>
          Похожие товары
        </Typography>
        <Grid container spacing={2}>
          {related.map((t) => (
            <Grid key={t.id} size={{ xs: 12, sm: 6, md: 3 }}>
              <ProductCardShop
                toy={t}
                onAddToCart={(item) => {
                  if (!user) navigate('/login');
                  else addToCart(item);
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};
