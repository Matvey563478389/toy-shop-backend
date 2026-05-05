import { Outlet } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { shopTheme } from '../theme/shopTheme.js';
import { SideBar } from '../components/SideBar.jsx';

export function AdminLayout() {
  return (
    <ThemeProvider theme={shopTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <SideBar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: 'background.paper',
            p: 3,
            overflowY: 'auto',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
