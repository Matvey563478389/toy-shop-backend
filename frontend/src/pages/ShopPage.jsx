import { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Stack,
  Grid,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Card,
  CardMedia,
  Chip,
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../shared/api.js';
import { DEFAULT_CATEGORY_SLUG, formatRub } from '../shared/shopConstants.js';
import { ProductCardShop } from '../components/shop/ProductCardShop.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { assetUrl } from '../shared/assetUrl.js';
import { useShopCategories } from '../context/CategoriesContext.jsx';

const PAGE_SIZE = 9;

export const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const categories = useShopCategories();

  const rawCategory = searchParams.get('category');
  const category = useMemo(() => {
    if (!categories.length) return rawCategory || DEFAULT_CATEGORY_SLUG;
    if (rawCategory && categories.some((c) => c.slug === rawCategory)) return rawCategory;
    return categories[0].slug;
  }, [categories, rawCategory]);

  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);

  const [view, setView] = useState('grid');
  const [sort, setSort] = useState('default');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [appliedRange, setAppliedRange] = useState([0, 5000]);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [popular, setPopular] = useState([]);

  const categoryTitle = useMemo(() => {
    const c = categories.find((x) => x.slug === category);
    return c?.name_ru || category;
  }, [categories, category]);

  useEffect(() => {
    if (!categories.length) return;
    if (rawCategory === category) return;
    const next = new URLSearchParams(searchParams);
    next.set('category', category);
    next.delete('page');
    setSearchParams(next, { replace: true });
  }, [categories, rawCategory, category, searchParams, setSearchParams]);

  useEffect(() => {
    api.get('/toys/popular', { params: { limit: 3, category } }).then((res) => setPopular(res.data));
  }, [category]);

  useEffect(() => {
    const params = {
      page,
      limit: PAGE_SIZE,
      sort,
      category,
      minPrice: appliedRange[0],
      maxPrice: appliedRange[1],
    };
    api.get('/toys', { params }).then((res) => {
      setItems(res.data.items || []);
      setTotal(res.data.total ?? 0);
    });
  }, [category, page, sort, appliedRange]);

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

  const setPage = (p) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(p));
    setSearchParams(next);
  };

  const selectCategory = (slug) => {
    const next = new URLSearchParams(searchParams);
    next.set('category', slug);
    next.delete('page');
    setSearchParams(next);
  };

  const applyPrice = () => {
    setAppliedRange(priceRange);
    const next = new URLSearchParams(searchParams);
    next.set('page', '1');
    setSearchParams(next);
  };

  const handleAdd = (toy) => {
    if (!user) {
      navigate('/login');
      return;
    }
    addToCart(toy);
  };

  return (
    <Box sx={{ bgcolor: '#fafafa', py: 3 }}>
      <Container maxWidth="lg">
        <Breadcrumbs sx={{ mb: 2 }}>
          <MuiLink component={Link} to="/" underline="hover" color="primary">
            Главная
          </MuiLink>
          <Typography color="text.primary">Каталог</Typography>
        </Breadcrumbs>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="subtitle1" fontWeight={800} gutterBottom>
              Категории
            </Typography>
            <Stack spacing={0.5} sx={{ mb: 3 }}>
              {categories.map((c) => (
                <Button
                  key={c.slug}
                  fullWidth
                  onClick={() => selectCategory(c.slug)}
                  sx={{
                    justifyContent: 'flex-start',
                    fontWeight: 700,
                    color: c.slug === category ? 'primary.main' : 'text.secondary',
                    bgcolor: c.slug === category ? 'rgba(34,134,169,0.08)' : 'transparent',
                  }}
                >
                  + {c.name_ru}
                </Button>
              ))}
            </Stack>

            <Typography variant="subtitle1" fontWeight={800} gutterBottom>
              Фильтр по цене
            </Typography>
            <Slider
              value={priceRange}
              onChange={(e, v) => setPriceRange(v)}
              valueLabelDisplay="auto"
              min={0}
              max={20000}
              sx={{ color: 'primary.main', mt: 1 }}
            />
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2">{formatRub(priceRange[0])}</Typography>
              <Typography variant="body2">{formatRub(priceRange[1])}</Typography>
            </Stack>
            <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={applyPrice}>
              Применить
            </Button>

            <Typography variant="subtitle1" fontWeight={800} sx={{ mt: 4 }} gutterBottom>
              Популярное
            </Typography>
            <Stack spacing={2}>
              {popular.map((toy) => (
                <Stack
                  key={toy.id}
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/product/${toy.id}`)}
                >
                  <CardMedia
                    component="img"
                    image={toy.image_url ? assetUrl(toy.image_url) : ''}
                    sx={{ width: 56, height: 56, borderRadius: 2, objectFit: 'cover' }}
                  />
                  <Box>
                    <Typography variant="body2" fontWeight={700} noWrap sx={{ maxWidth: 160 }}>
                      {toy.title}
                    </Typography>
                    <Typography variant="body2" fontWeight={800}>
                      {formatRub(toy.price)}
                    </Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 9 }}>
            <Typography variant="h4" fontWeight={800} gutterBottom>
              {categoryTitle}
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              alignItems={{ sm: 'center' }}
              justifyContent="space-between"
              sx={{ mb: 2 }}
            >
              <ToggleButtonGroup value={view} exclusive size="small" onChange={(e, v) => v && setView(v)}>
                <ToggleButton value="grid" aria-label="Сетка">
                  <ViewModuleIcon />
                </ToggleButton>
                <ToggleButton value="list" aria-label="Список">
                  <ViewListIcon />
                </ToggleButton>
              </ToggleButtonGroup>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Сортировка</InputLabel>
                <Select label="Сортировка" value={sort} onChange={(e) => setSort(e.target.value)}>
                  <MenuItem value="default">По умолчанию</MenuItem>
                  <MenuItem value="price_asc">Цена: по возрастанию</MenuItem>
                  <MenuItem value="price_desc">Цена: по убыванию</MenuItem>
                  <MenuItem value="newest">Сначала новые</MenuItem>
                </Select>
              </FormControl>
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                Показано {from}–{to} из {total}
              </Typography>
            </Stack>

            {view === 'grid' ? (
              <Grid container spacing={2}>
                {items.map((toy) => (
                  <Grid key={toy.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <ProductCardShop toy={toy} onAddToCart={handleAdd} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Stack spacing={2}>
                {items.map((toy) => (
                  <Card key={toy.id} sx={{ p: 2, borderRadius: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                    <Box sx={{ position: 'relative', width: { xs: '100%', sm: 160 }, flexShrink: 0 }}>
                      {toy.badge === 'sale' && (
                        <Chip label="СКИДКА" size="small" sx={{ position: 'absolute', top: 8, left: 8, bgcolor: '#E53935', color: '#fff', zIndex: 1 }} />
                      )}
                      <CardMedia
                        component="img"
                        image={toy.image_url ? assetUrl(toy.image_url) : ''}
                        sx={{ height: 160, borderRadius: 2, objectFit: 'cover', cursor: 'pointer' }}
                        onClick={() => navigate(`/product/${toy.id}`)}
                      />
                    </Box>
                    <Box sx={{ flex: 1, textAlign: 'left' }}>
                      <Typography variant="h6" fontWeight={800} onClick={() => navigate(`/product/${toy.id}`)} sx={{ cursor: 'pointer' }}>
                        {toy.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {toy.description?.slice(0, 140)}…
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
                        <Typography variant="h6" color="success.main" fontWeight={800}>
                          {formatRub(toy.price)}
                        </Typography>
                        {toy.compare_price != null && Number(toy.compare_price) > Number(toy.price) && (
                          <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                            {formatRub(toy.compare_price)}
                          </Typography>
                        )}
                      </Stack>
                      <Stack direction="row" spacing={1} sx={{ mt: 2 }} flexWrap="wrap">
                        <Button variant="contained" startIcon={<AddShoppingCartIcon />} onClick={() => handleAdd(toy)}>
                          В корзину
                        </Button>
                      </Stack>
                    </Box>
                  </Card>
                ))}
              </Stack>
            )}

            {pageCount > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={pageCount}
                  page={page}
                  onChange={(e, v) => setPage(v)}
                  color="primary"
                  shape="rounded"
                />
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
