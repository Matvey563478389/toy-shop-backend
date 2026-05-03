import {
  Box,
  Typography,
  Button,
  Container,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ overflowX: 'hidden', backgroundColor: 'background.default' }}>

      <Box sx={{
        position: 'relative',
        background: 'linear-gradient(135deg, #e0f2f1 0%, #e1f5fe 100%)',
        height: '60vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'text.primary',
        borderBottomLeftRadius: '50% 10%',
        borderBottomRightRadius: '50% 10%',
      }}>
        <Box sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.6)',
          filter: 'blur(50px)',
          zIndex: 0
        }} />

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Stack spacing={1} alignItems="center" sx={{ mb: 4 }}>
            <AutoAwesomeIcon color="primary" sx={{ fontSize: 40, opacity: 0.8 }} />
            <Typography
              variant="h2"
              fontWeight="900"
              gutterBottom
              sx={{ color: '#263238', lineHeight: 1.1 }}
            >
              МИР ВОЛШЕБНЫХ ИГРУШЕК
            </Typography>
          </Stack>

          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ mb: 5, maxWidth: '600px', mx: 'auto', fontWeight: 400 }}
          >
            Откройте дверь в мир фантазии, улыбок и безопасных приключений для вашего ребенка.
          </Typography>

          <Button
            variant="contained"
            size="large"
            color="primary"
            onClick={() => navigate('/catalog')}
            sx={{ px: 5, py: 1.8, borderRadius: 10, fontWeight: 'bold', fontSize: '1.1rem', boxShadow: 3 }}
          >
            Выбрать подарок
          </Button>
        </Container>
      </Box>

    </Box>
  );
};