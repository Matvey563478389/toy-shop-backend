import { Outlet } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { shopTheme } from '../theme/shopTheme.js';
import { SiteHeader } from '../components/shop/SiteHeader.jsx';
import { SiteFooter } from '../components/shop/SiteFooter.jsx';

export function ShopLayout() {
  return (
    <ThemeProvider theme={shopTheme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          bgcolor: '#fff',
        }}
      >
        <SiteHeader />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: '100%',
            textAlign: 'left',
          }}
        >
          <Outlet />
        </Box>
        <SiteFooter />
      </Box>
    </ThemeProvider>
  );
}
