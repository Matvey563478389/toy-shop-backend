import { Box, Container, Typography, Link as MuiLink, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import { BrandTitle } from './BrandTitle.jsx';
import { BRAND_NAME, SHOP_ADDRESS_LINE, SHOP_PHONE_DISPLAY, SHOP_PHONE_TEL } from '../../shared/shopConstants.js';

const footerBg = 'linear-gradient(180deg, #E8F6F3 0%, #d4f0ea 100%)';

export function SiteFooter() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        background: footerBg,
        pt: 6,
        pb: 4,
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(34,134,169,0.12)',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 10,
          background: 'radial-gradient(ellipse 120% 100% at 50% 100%, transparent 60%, rgba(255,255,255,0.9) 61%)',
          backgroundSize: '20px 10px',
          backgroundRepeat: 'repeat-x',
          opacity: 0.6,
        }}
      />
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={4}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'flex-start' }}
        >
          <Box sx={{ maxWidth: 360 }}>
            <BrandTitle />
            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
              Детские игрушки с доставкой по России. Безопасные материалы, радость и развитие для вашего малыша.
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle1" fontWeight={800} gutterBottom>
              Личный кабинет
            </Typography>
            {[
              ['Отследить заказ', '/orders'],
              ['Пользовательского соглашение', '/contact'],
              ['Обратная связь', '/contact'],
            ].map(([label, to]) => (
              <MuiLink
                key={label}
                component={Link}
                to={to}
                display="block"
                variant="body2"
                sx={{ mb: 1, color: 'text.secondary', fontWeight: 600 }}
                underline="hover"
              >
                {label}
              </MuiLink>
            ))}
          </Box>

          <Box sx={{ minWidth: 220 }}>
            <Typography variant="subtitle1" fontWeight={800} gutterBottom>
              Поддержка клиентов
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
              Пн–Пт
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              10:00 – 18:00 (МСК)
            </Typography>
            <MuiLink href={`tel:${SHOP_PHONE_TEL}`} variant="body2" sx={{ fontWeight: 700, color: 'primary.main', display: 'block' }} underline="hover">
              Телефон: {SHOP_PHONE_DISPLAY}
            </MuiLink>
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
              Email: info@toyshop.ru
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
              {SHOP_ADDRESS_LINE}
            </Typography>
          </Box>
        </Stack>
        <Typography variant="caption" display="block" sx={{ mt: 4, color: 'text.secondary' }}>
          © {new Date().getFullYear()} {BRAND_NAME}
        </Typography>
      </Container>
    </Box>
  );
}
