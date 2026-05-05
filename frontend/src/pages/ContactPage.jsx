import {
  Box,
  Button,
  Container,
  Typography,
  Stack,
  TextField,
  Paper,
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { SHOP_ADDRESS_LINE, SHOP_PHONE_DISPLAY, SHOP_PHONE_TEL } from '../shared/shopConstants.js';
import {
  formatRuPhoneMask,
  normalizeRuPhoneDigits,
  isRuPhoneComplete,
  isValidEmail,
} from '../shared/masks.js';

export const ContactPage = () => {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState('');
  const [phoneDisplay, setPhoneDisplay] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    setError('');
    const digits = normalizeRuPhoneDigits(phoneDisplay);
    if (!isRuPhoneComplete(digits)) {
      setError('Введите телефон полностью в формате +7 (___) ___-__-__');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Укажите корректный e-mail');
      return;
    }
    if (!name.trim() || !comment.trim()) {
      setError('Заполните имя и текст сообщения');
      return;
    }
    setSent(true);
  };

  return (
    <Box sx={{ py: 4, bgcolor: '#fafafa' }}>
      <Container maxWidth="lg">
        <Breadcrumbs sx={{ mb: 2 }}>
          <MuiLink component={Link} to="/" underline="hover" color="primary">
            Главная
          </MuiLink>
          <Typography color="text.primary">Контакты</Typography>
        </Breadcrumbs>
        <Typography variant="h3" fontWeight={800} gutterBottom sx={{ textAlign: 'left' }}>
          Контакты
        </Typography>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 4 }}>
          {[
            {
              icon: <PhoneOutlinedIcon color="primary" />,
              title: 'Телефон',
              line: (
                <MuiLink href={`tel:${SHOP_PHONE_TEL}`} color="inherit" underline="hover">
                  {SHOP_PHONE_DISPLAY}
                </MuiLink>
              ),
            },
            { icon: <EmailOutlinedIcon color="primary" />, title: 'E-mail', line: 'info@toyshop.ru' },
            { icon: <PlaceOutlinedIcon color="primary" />, title: 'Адрес', line: SHOP_ADDRESS_LINE },
          ].map((c) => (
            <Paper key={c.title} sx={{ flex: 1, p: 3, borderRadius: 3, textAlign: 'center' }}>
              <Box sx={{ mb: 1 }}>{c.icon}</Box>
              <Typography fontWeight={800} gutterBottom>
                {c.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {c.line}
              </Typography>
            </Paper>
          ))}
        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          <Paper sx={{ flex: 1, borderRadius: 3, overflow: 'hidden', minHeight: 360 }}>
            <Box
              component="iframe"
              title="Карта"
              sx={{ border: 0, width: '100%', height: 400 }}
              loading="lazy"
              src="https://www.google.com/maps?q=ул.+Каширская,+4%2F2,+Ростов-на-Дону,+Россия&hl=ru&z=17&output=embed"
            />
          </Paper>
          <Paper sx={{ flex: 1, p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={800} gutterBottom>
              Напишите нам
            </Typography>
            {sent ? (
              <Typography color="success.main">Спасибо! Мы свяжемся с вами в ближайшее время.</Typography>
            ) : (
              <Box component="form" onSubmit={onSubmit}>
                {error && (
                  <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                    {error}
                  </Typography>
                )}
                <Stack spacing={2}>
                  <TextField label="Ваше имя" fullWidth required value={name} onChange={(e) => setName(e.target.value)} />
                  <TextField
                    label="Телефон"
                    fullWidth
                    required
                    value={phoneDisplay}
                    onChange={(e) => setPhoneDisplay(formatRuPhoneMask(e.target.value))}
                    placeholder="+7 (___) ___-__-__"
                    helperText="Маска: +7 (999) 999-99-99"
                    inputProps={{ inputMode: 'tel' }}
                  />
                  <TextField
                    label="E-mail"
                    fullWidth
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@mail.ru"
                  />
                  <TextField
                    label="Ваше сообщение"
                    fullWidth
                    multiline
                    rows={4}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <Button type="submit" variant="contained" size="large" sx={{ alignSelf: 'flex-start' }}>
                    Отправить
                  </Button>
                </Stack>
              </Box>
            )}
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
};
