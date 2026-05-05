import { createTheme } from '@mui/material/styles';

export const shopTheme = createTheme({
  palette: {
    primary: {
      main: '#2286A9',
      dark: '#1a6985',
      light: '#4BB7D3',
    },
    secondary: {
      main: '#FDE910',
      contrastText: '#1a1a1a',
    },
    success: {
      main: '#7CB342',
    },
  },
  typography: {
    fontFamily: '"Quicksand", "Roboto", "Helvetica Neue", Arial, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: { fontWeight: 700, textTransform: 'none' },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
  },
});
