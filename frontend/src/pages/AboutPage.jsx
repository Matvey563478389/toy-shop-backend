import { Typography, Box, Paper, Grid, Stack } from "@mui/material";
import StorefrontIcon from '@mui/icons-material/Storefront';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VerifiedIcon from '@mui/icons-material/Verified';

export const AboutPage = () => (
  <Box sx={{ maxWidth: 800, mx: "auto", py: 4 }}>
    <Typography variant="h4" gutterBottom fontWeight="bold">
      О нашем магазине
    </Typography>

    <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', color: 'text.secondary' }}>
      Добро пожаловать в «Магазин игрушек»! Мы верим, что каждая игрушка — это не просто предмет,
      а ключ к развитию воображения и созданию счастливых воспоминаний о детстве.
    </Typography>

    <Grid container spacing={3} sx={{ mt: 2 }}>
      <Grid item xs={12} sm={6}>
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <StorefrontIcon color="primary" />
            <Typography variant="subtitle1" fontWeight="bold">Как мы начинали</Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Наш путь начался в 2015 году с маленького семейного отдела. Сегодня мы —
            крупная сеть, которая сотрудничает с ведущими мировыми брендами и локальными
            мастерскими деревянных игрушек.
          </Typography>
        </Stack>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <VerifiedIcon color="success" />
            <Typography variant="subtitle1" fontWeight="bold">Только лучшее</Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Все товары проходят строгий контроль качества. Мы выбираем только гипоаллергенные
            материалы и проверяем наличие сертификатов безопасности.
          </Typography>
        </Stack>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <FavoriteIcon color="error" />
            <Typography variant="subtitle1" fontWeight="bold">С любовью к детям</Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Наша миссия — помогать родителям в развитии детей. В ассортименте вы найдете
            как классических мишек, так и современные развивающие STEM-наборы.
          </Typography>
        </Stack>
      </Grid>
    </Grid>

    <Paper
      elevation={0}
      sx={{
        mt: 6,
        p: 4,
        bgcolor: 'grey.50',
        borderLeft: '5px solid',
        borderColor: 'primary.main',
        borderRadius: '4px'
      }}
    >
      <Typography
        variant="h5"
        align="center"
        sx={{ fontStyle: 'italic', color: 'text.secondary', lineHeight: 1.5 }}
      >
        «Мы не просто продаем игрушки, мы помогаем вырастить любознательное и счастливое поколение»
      </Typography>
    </Paper>
  </Box>
);