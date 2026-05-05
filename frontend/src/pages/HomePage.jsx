import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Stack,
  Grid,
  TextField,
  CardMedia,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HeadsetMicOutlinedIcon from '@mui/icons-material/HeadsetMicOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import RecyclingOutlinedIcon from '@mui/icons-material/RecyclingOutlined';
import api from '../shared/api.js';
import {
  HOME_HERO_IMAGE_URL,
  HOME_ECO_BANNER_IMAGE,
  HOME_GALLERY_IMAGE_URLS,
} from '../shared/shopConstants.js';
import { useShopCategories } from '../context/CategoriesContext.jsx';
import { assetUrl } from '../shared/assetUrl.js';
import { ProductCardShop } from '../components/shop/ProductCardShop.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { isValidEmail } from '../shared/masks.js';

const categoryIcons = ['🧱', '🚗', '🔤', '🌿', '🧸'];

const PROMO_BLOCK_MIN_HEIGHT = 300;

export const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const categories = useShopCategories();
  const [loves, setLoves] = useState([]);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  useEffect(() => {
    api.get('/toys/popular', { params: { limit: 8 } }).then((res) => setLoves(res.data));
  }, []);

  const handleAdd = (toy) => {
    if (!user) {
      navigate('/login');
      return;
    }
    addToCart(toy);
  };

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) {
      alert('Введите e-mail.');
      return;
    }
    if (!isValidEmail(newsletterEmail.trim())) {
      alert('Укажите корректный e-mail.');
      return;
    }
    alert(
      'Спасибо за интерес к рассылке! Мы обязательно с вами свяжемся'
    );
    setNewsletterEmail('');
  };

  const gallerySrc = (url) => (url.startsWith('/') ? assetUrl(url) : url);

  return (
    <Box sx={{ bgcolor: '#f7fbfc' }}>
      <Box sx={{ bgcolor: '#eef8fb', py: { xs: 4, md: 6 } }}>
        <Container maxWidth="lg">
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center">
            <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '2rem', md: '3rem' },
                  color: 'primary.main',
                  lineHeight: 1.1,
                  mb: 2,
                }}
              >
                Играй, учись и расти!
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 3, fontWeight: 500 }}>
                Дарим улыбки с каждой игрушкой — для обучения, веселья и гармоничного развития.
              </Typography>
              <Button variant="contained" color="secondary" size="large" onClick={() => navigate('/shop')} sx={{ px: 4, py: 1.5 }}>
                В каталог
              </Button>
            </Box>
            <Box sx={{ flex: 1, maxWidth: 520, width: '100%' }}>
              <CardMedia
                component="img"
                image={HOME_HERO_IMAGE_URL}
                alt="Ребёнок с игрушками"
                sx={{
                  borderRadius: 4,
                  boxShadow: 3,
                  width: '100%',
                  height: 'auto',
                  maxHeight: { xs: 320, md: 420 },
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </Box>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" textAlign="center" fontWeight={800} gutterBottom>
          Подберите идеальную игрушку
        </Typography>
        <Stack
          direction="row"
          flexWrap="wrap"
          justifyContent="center"
          sx={{
            mt: { xs: 3, md: 5 },
            mb: 1,
            columnGap: { xs: 3, sm: 4, md: 5 },
            rowGap: { xs: 3, sm: 4 },
            px: { xs: 1, sm: 2 },
          }}
        >
          {categories.slice(0, 5).map((c, i) => (
            <Box
              key={c.slug}
              onClick={() => navigate(`/shop?category=${encodeURIComponent(c.slug)}`)}
              sx={{
                width: 148,
                maxWidth: '100%',
                flex: '0 0 auto',
                textAlign: 'center',
                cursor: 'pointer',
              }}
            >
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  mx: 'auto',
                  borderRadius: '50%',
                  bgcolor: i % 2 ? '#F8BBD0' : '#E1F5FE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.2rem',
                  boxShadow: 1,
                }}
              >
                {categoryIcons[i]}
              </Box>
              <Typography
                variant="body2"
                fontWeight={700}
                sx={{
                  mt: 2,
                  px: 0.5,
                  lineHeight: 1.35,
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                }}
              >
                {c.name_ru}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Container>

      <Container maxWidth="lg" sx={{ pb: 6 }}>
        <Grid container spacing={2} sx={{ alignItems: 'stretch' }}>
          <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex' }}>
            <Paper
              elevation={0}
              sx={{
                flex: 1,
                borderRadius: 4,
                p: 4,
                background: 'linear-gradient(135deg, #E3F2FD 0%, #E0F7FA 100%)',
                minHeight: PROMO_BLOCK_MIN_HEIGHT,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                textAlign: { xs: 'center', md: 'left' },
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="h5" fontWeight={800} color="primary.dark" gutterBottom>
                Откройте радость игры
              </Typography>
              <Typography color="text.secondary" sx={{ maxWidth: 420, mx: { xs: 'auto', md: 0 } }}>
                Яркие идеи для любознательных детей — подборки по сезону и возрасту.
              </Typography>
              <Button variant="contained" sx={{ mt: 3, alignSelf: { xs: 'center', md: 'flex-start' } }} onClick={() => navigate('/shop')}>
                Смотреть товары
              </Button>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex' }}>
            <Box
              sx={{
                flex: 1,
                borderRadius: 4,
                overflow: 'hidden',
                position: 'relative',
                minHeight: PROMO_BLOCK_MIN_HEIGHT,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <CardMedia
                component="img"
                image={assetUrl(HOME_ECO_BANNER_IMAGE)}
                alt=""
                sx={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <Box
                sx={{
                  position: 'relative',
                  zIndex: 1,
                  minHeight: PROMO_BLOCK_MIN_HEIGHT,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: { xs: 'center', md: 'flex-start' },
                  textAlign: { xs: 'center', md: 'left' },
                  px: 3,
                  py: 4,
                  background: 'linear-gradient(105deg, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.75) 45%, transparent 100%)',
                }}
              >
                <Typography variant="h5" fontWeight={800}>
                  Эко-игрушки
                </Typography>
                <Typography variant="body2" sx={{ my: 1.5, maxWidth: 360 }}>
                  Безопасные материалы и выгодные комплекты для постоянных клиентов.
                </Typography>
                <Button variant="contained" color="secondary" onClick={() => navigate('/shop')}>
                  В каталог
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Container maxWidth="lg" sx={{ pb: 6 }}>
        <Typography variant="h4" textAlign="center" fontWeight={800} gutterBottom>
          Покупатели выбирают
        </Typography>
        <Typography variant="body2" textAlign="center" color="text.secondary" sx={{ mb: 1 }}>
          Подборка отмечена в админке как «популярная» и загружается с сервера.
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1, alignItems: 'stretch' }}>
          {loves.map((toy) => (
            <Grid key={toy.id} size={{ xs: 12, sm: 6, md: 3 }} sx={{ display: 'flex' }}>
              <Box sx={{ width: '100%', display: 'flex' }}>
                <ProductCardShop toy={toy} onAddToCart={handleAdd} dense />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Container maxWidth="lg" sx={{ pb: 6 }}>
        <Typography variant="h4" textAlign="center" fontWeight={800} gutterBottom>
          Фото с наших поставок
        </Typography>
        <Grid container spacing={1} sx={{ mt: 2 }}>
          {HOME_GALLERY_IMAGE_URLS.map((url) => (
            <Grid key={url} size={{ xs: 6, md: 3 }}>
              <CardMedia
                component="img"
                image={gallerySrc(url)}
                alt=""
                sx={{
                  borderRadius: 2,
                  width: '100%',
                  aspectRatio: '1',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Container>

      <Container maxWidth="lg" sx={{ pb: 6 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          {[
            { icon: <HeadsetMicOutlinedIcon color="primary" />, title: 'Забота о клиентах', sub: 'Ответим в рабочие часы' },
            { icon: <LocalShippingOutlinedIcon color="primary" />, title: 'Доставка', sub: 'Бесплатно от 500 ₽ по товарам' },
            { icon: <RecyclingOutlinedIcon color="primary" />, title: 'Возврат', sub: 'В течение 7 дней по правилам магазина' },
          ].map((s) => (
            <Box
              key={s.title}
              sx={{
                flex: 1,
                bgcolor: '#fff',
                borderRadius: 3,
                p: 3,
                border: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                gap: 2,
                alignItems: 'center',
              }}
            >
              {s.icon}
              <Box sx={{ textAlign: 'left' }}>
                <Typography fontWeight={800}>{s.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {s.sub}
                </Typography>
              </Box>
            </Box>
          ))}
        </Stack>
      </Container>

      <Box sx={{ bgcolor: '#fff', py: 6, borderTop: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="sm">
          <Typography variant="h5" fontWeight={800} textAlign="center" gutterBottom>
            Рассылка
          </Typography>
          <Typography textAlign="center" color="text.secondary" sx={{ mb: 2 }}>
            Подпишитесь и получите скидку 15% на следующий заказ.
          </Typography>
          <Box component="form" onSubmit={handleNewsletter}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              <TextField
                fullWidth
                placeholder="Ваш e-mail"
                size="small"
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                inputProps={{ autoComplete: 'email' }}
              />
              <Button type="submit" variant="contained" sx={{ minWidth: 120 }}>
                Подписаться
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
