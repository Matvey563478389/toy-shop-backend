import { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Link as MuiLink,
  IconButton,
  Badge,
  Button,
  Container,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
} from '@mui/material';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { BrandTitle } from './BrandTitle.jsx';

const nav = [
  { label: 'Главная', to: '/' },
  { label: 'Каталог', to: '/shop' },
  { label: 'Контакты', to: '/contact' },
];

export function SiteHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const cartCount = cart.reduce((a, b) => a + b.quantity, 0);

  const closeMobile = () => setMobileOpen(false);

  const drawer = (
    <Box sx={{ width: 280, pt: 2 }} role="presentation">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, pb: 1 }}>
        <Typography variant="subtitle1" fontWeight={800}>
          Меню
        </Typography>
        <IconButton onClick={closeMobile} aria-label="Закрыть меню">
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {nav.map((item) => (
          <ListItemButton
            key={item.to}
            component={Link}
            to={item.to}
            selected={location.pathname === item.to}
            onClick={closeMobile}
          >
            <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 700 }} />
          </ListItemButton>
        ))}
        <ListItemButton component={Link} to="/cart" onClick={closeMobile}>
          <ListItemText primary="Корзина" primaryTypographyProps={{ fontWeight: 700 }} />
        </ListItemButton>
        {user && (
          <ListItemButton component={Link} to="/orders" onClick={closeMobile}>
            <ListItemText primary="Мои заказы" primaryTypographyProps={{ fontWeight: 700 }} />
          </ListItemButton>
        )}
        {user?.role === 'admin' && (
          <ListItemButton component={Link} to="/admin/toys" onClick={closeMobile}>
            <ListItemText primary="Админка" primaryTypographyProps={{ fontWeight: 700 }} />
          </ListItemButton>
        )}
        {!user ? (
          <>
            <ListItemButton component={Link} to="/login" onClick={closeMobile}>
              <ListItemText primary="Вход" />
            </ListItemButton>
            <ListItemButton component={Link} to="/login?register=1" onClick={closeMobile}>
              <ListItemText primary="Регистрация" />
            </ListItemButton>
          </>
        ) : (
          <ListItemButton
            onClick={() => {
              logout();
              closeMobile();
              navigate('/');
            }}
          >
            <ListItemText primary="Выйти" />
          </ListItemButton>
        )}
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexShrink: 0 }}>
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: '#fff',
          position: 'relative',
          pt: 0.75,
          pb: 2,
          '&::after': {
            content: '""',
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: -1,
            height: 14,
            background: 'radial-gradient(ellipse 120% 100% at 50% 0, transparent 60%, #fff 61%)',
            backgroundSize: '24px 14px',
            backgroundRepeat: 'repeat-x',
            opacity: 0.95,
          },
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 1,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
              <LocalShippingOutlinedIcon sx={{ fontSize: 20, opacity: 0.95, flexShrink: 0 }} />
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                Бесплатная доставка при сумме товаров от 500 ₽
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 600, display: { xs: 'block', sm: 'none' } }}>
                От 500 ₽ по товарам — доставка бесплатно
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              {user ? (
                <>
                  <MuiLink
                    component={Link}
                    to="/orders"
                    color="inherit"
                    underline="hover"
                    variant="body2"
                    sx={{ fontWeight: 600, display: { xs: 'none', sm: 'inline' } }}
                  >
                    Мои заказы
                  </MuiLink>
                  <Button
                    color="inherit"
                    size="small"
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                    sx={{ fontWeight: 700, display: { xs: 'none', sm: 'inline-flex' } }}
                  >
                    Выйти
                  </Button>
                </>
              ) : (
                <>
                  <MuiLink
                    component={Link}
                    to="/login"
                    color="inherit"
                    underline="hover"
                    variant="body2"
                    sx={{ fontWeight: 600, display: { xs: 'none', sm: 'inline' } }}
                  >
                    Вход
                  </MuiLink>
                  <MuiLink
                    component={Link}
                    to="/login?register=1"
                    color="inherit"
                    underline="hover"
                    variant="body2"
                    sx={{ fontWeight: 600, display: { xs: 'none', sm: 'inline' } }}
                  >
                    Регистрация
                  </MuiLink>
                </>
              )}
              {user?.role === 'admin' && (
                <MuiLink
                  component={Link}
                  to="/admin/toys"
                  color="inherit"
                  underline="hover"
                  variant="body2"
                  sx={{ fontWeight: 600, display: { xs: 'none', sm: 'inline' } }}
                >
                  Админка
                </MuiLink>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      <AppBar
        position="static"
        color="inherit"
        elevation={0}
        sx={{
          bgcolor: '#fff',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ py: 1.5, gap: 1, flexWrap: 'nowrap' }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMobileOpen(true)}
              sx={{ display: { md: 'none' }, color: 'text.primary' }}
              aria-label="Открыть меню"
            >
              <MenuIcon />
            </IconButton>

            <Box sx={{ mr: { xs: 0, md: 2 }, cursor: 'pointer', display: 'flex', alignItems: 'center', minWidth: 0 }} onClick={() => navigate('/')}>
              <BrandTitle />
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', gap: 0.5 }}>
              {nav.map((item) => (
                <Button
                  key={item.label}
                  component={Link}
                  to={item.to}
                  color="inherit"
                  sx={{
                    fontWeight: 700,
                    color: location.pathname === item.to ? 'primary.main' : 'text.primary',
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
              <IconButton component={Link} to="/cart" color="primary" sx={{ border: '1px solid', borderColor: 'divider' }} aria-label="Корзина">
                <Badge badgeContent={cartCount} color="secondary" max={99}>
                  <ShoppingCartOutlinedIcon />
                </Badge>
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer anchor="left" open={mobileOpen} onClose={closeMobile} ModalProps={{ keepMounted: true }}>
        {drawer}
      </Drawer>
    </Box>
  );
}
