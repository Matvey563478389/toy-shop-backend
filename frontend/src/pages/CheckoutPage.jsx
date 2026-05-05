import { useMemo, useState, useEffect, useRef } from 'react';
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
  CardMedia,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import api from '../shared/api.js';
import { formatRub } from '../shared/shopConstants.js';
import { assetUrl } from '../shared/assetUrl.js';
import {
  formatRuPhoneMask,
  normalizeRuPhoneDigits,
  isRuPhoneComplete,
  ruPhoneToE164,
  maskPostalCode,
  isValidRuPostal,
  isValidEmail,
  buildRuAddress,
} from '../shared/masks.js';
import {
  shippingRubForSubtotal,
  FREE_SHIPPING_MIN_SUBTOTAL,
} from '../shared/shipping.js';

export const CheckoutPage = () => {
  const { user, logout } = useAuth();
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [building, setBuilding] = useState('');
  const [phoneDisplay, setPhoneDisplay] = useState(() =>
    user?.phone ? formatRuPhoneMask(user.phone) : ''
  );
  const [email, setEmail] = useState(user?.email || '');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoBusy, setPromoBusy] = useState(false);
  const [promoHint, setPromoHint] = useState('');
  const activePromoCodeRef = useRef('');

  useEffect(() => {
    if (user?.phone) setPhoneDisplay(formatRuPhoneMask(user.phone));
    if (user?.email) setEmail(user.email);
  }, [user]);

  const subtotal = useMemo(() => cart.reduce((s, i) => s + Number(i.price) * i.quantity, 0), [cart]);
  const cartSig = useMemo(
    () => cart.map((i) => `${i.id}:${i.quantity}`).join('|'),
    [cart]
  );
  const shipping = useMemo(
    () => (cart.length ? shippingRubForSubtotal(subtotal) : 0),
    [cart.length, subtotal]
  );
  const promoDiscount = appliedPromo ? Number(appliedPromo.discount) || 0 : 0;
  const total = subtotal + shipping - promoDiscount;

  useEffect(() => {
    const code = activePromoCodeRef.current.trim();
    if (!code) return;
    let cancelled = false;
    void (async () => {
      try {
        const res = await api.post('/promo-codes/check', { code, subtotal });
        if (cancelled) return;
        setAppliedPromo({
          code: res.data.code,
          discount: Number(res.data.discount),
        });
        setPromoHint(`Промокод применён: −${formatRub(res.data.discount)}`);
      } catch (e) {
        if (cancelled) return;
        activePromoCodeRef.current = '';
        setAppliedPromo(null);
        setPromoHint(e.response?.data?.message || 'Промокод не принят');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [subtotal, cartSig]);

  const applyPromo = async () => {
    setPromoHint('');
    setFormError('');
    if (!promoInput.trim()) {
      setPromoHint('Введите промокод');
      return;
    }
    setPromoBusy(true);
    try {
      const res = await api.post('/promo-codes/check', {
        code: promoInput.trim(),
        subtotal,
      });
      activePromoCodeRef.current = res.data.code;
      setAppliedPromo({
        code: res.data.code,
        discount: Number(res.data.discount),
      });
      setPromoHint(`Промокод применён: −${formatRub(res.data.discount)}`);
    } catch (e) {
      activePromoCodeRef.current = '';
      setAppliedPromo(null);
      setPromoHint(e.response?.data?.message || 'Промокод не принят');
    } finally {
      setPromoBusy(false);
    }
  };

  const clearPromo = () => {
    activePromoCodeRef.current = '';
    setAppliedPromo(null);
    setPromoInput('');
    setPromoHint('');
  };

  const placeOrder = async () => {
    setFormError('');
    if (!user) {
      navigate('/login');
      return;
    }
    if (cart.length === 0) {
      navigate('/shop');
      return;
    }
    if (!firstName.trim() || !lastName.trim()) {
      setFormError('Укажите имя и фамилию получателя');
      return;
    }
    if (firstName.trim().length < 2 || lastName.trim().length < 2) {
      setFormError('Имя и фамилия — не короче 2 символов');
      return;
    }
    const digits = normalizeRuPhoneDigits(phoneDisplay);
    if (!isRuPhoneComplete(digits)) {
      setFormError('Укажите телефон полностью: +7 (___) ___-__-__');
      return;
    }
    if (!isValidEmail(email)) {
      setFormError('Введите корректный e-mail');
      return;
    }
    if (!isValidRuPostal(postalCode)) {
      setFormError('Индекс — 6 цифр');
      return;
    }
    if (!city.trim() || !street.trim() || !building.trim()) {
      setFormError('Заполните город, улицу и дом');
      return;
    }

    const fullAddress = buildRuAddress({ postalCode, city, street, building });
    const phone = ruPhoneToE164(digits);
    const fio = [lastName, firstName].filter(Boolean).join(' ').trim();
    const notesWithName = fio ? `Получатель: ${fio}. ${notes || ''}`.trim() : notes;

    setSubmitting(true);
    try {
      const promoToSend = String(appliedPromo?.code || promoInput || '').trim();
      await api.post('/order', {
        items: cart,
        address: fullAddress,
        phone,
        shippingCost: shipping,
        notes: notesWithName || null,
        customerEmail: email.trim(),
        promoCode: promoToSend,
      });
      clearCart();
      navigate('/orders');
    } catch (e) {
      console.error(e);
      const status = e.response?.status;
      const msg =
        e.response?.data?.message || 'Не удалось оформить заказ. Попробуйте ещё раз.';
      if (status === 401) {
        await logout();
        navigate('/login', { replace: true, state: { message: msg } });
        return;
      }
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <Container sx={{ py: 6 }}>
        <Typography gutterBottom>Войдите, чтобы оформить заказ.</Typography>
        <Button component={Link} to="/login" variant="contained">
          Вход
        </Button>
      </Container>
    );
  }

  if (cart.length === 0) {
    return (
      <Container sx={{ py: 6 }}>
        <Typography gutterBottom>Корзина пуста.</Typography>
        <Button component={Link} to="/shop" variant="contained">
          В каталог
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ py: 3, bgcolor: '#fafafa' }}>
      <Container maxWidth="lg">
        <Breadcrumbs sx={{ mb: 2 }}>
          <MuiLink component={Link} to="/" underline="hover" color="primary">
            Главная
          </MuiLink>
          <Typography color="text.primary">Оформление</Typography>
        </Breadcrumbs>
        <Typography variant="h3" fontWeight={800} gutterBottom sx={{ textAlign: 'left', fontSize: { xs: '1.75rem', sm: '2.5rem' } }}>
          Оформление заказа
        </Typography>

        {formError && (
          <Typography color="error" sx={{ mb: 2 }}>
            {formError}
          </Typography>
        )}

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="flex-start">
          <Stack spacing={3} sx={{ flex: 2, width: '100%' }}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight={800} gutterBottom>
                Доставка и контакты
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Оплата только при передаче товара — наличными или картой курьеру / в пункте выдачи. Данные банковской карты на сайте не
                вводятся. Доставка от {FREE_SHIPPING_MIN_SUBTOTAL.toLocaleString('ru-RU')} ₽ по товарам — бесплатно.
              </Typography>
              <Stack spacing={2}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField label="Имя *" fullWidth value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Иван" />
                  <TextField label="Фамилия *" fullWidth value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Иванов" />
                </Stack>
                <TextField
                  label="Индекс *"
                  fullWidth
                  value={postalCode}
                  onChange={(e) => setPostalCode(maskPostalCode(e.target.value))}
                  helperText="6 цифр"
                  inputProps={{ inputMode: 'numeric', maxLength: 6 }}
                />
                <TextField label="Город *" fullWidth value={city} onChange={(e) => setCity(e.target.value)} />
                <TextField label="Улица *" fullWidth value={street} onChange={(e) => setStreet(e.target.value)} />
                <TextField label="Дом / корпус *" fullWidth value={building} onChange={(e) => setBuilding(e.target.value)} />
                <TextField
                  label="Телефон *"
                  fullWidth
                  value={phoneDisplay}
                  onChange={(e) => setPhoneDisplay(formatRuPhoneMask(e.target.value))}
                  placeholder="+7 (___) ___-__-__"
                  helperText="Маска: +7 и 10 цифр"
                  inputProps={{ inputMode: 'tel' }}
                />
                <TextField
                  label="E-mail *"
                  fullWidth
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.ru"
                  helperText="Для уведомлений о заказе"
                />
                <TextField
                  label="Комментарий к заказу"
                  fullWidth
                  multiline
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Пожелания по доставке, подъезд, домофон…"
                />
              </Stack>
              <Button variant="contained" size="large" fullWidth sx={{ mt: 3 }} onClick={placeOrder} disabled={submitting}>
                {submitting ? 'Отправка…' : 'Подтвердить заказ'}
              </Button>
            </Paper>
          </Stack>

          <Paper sx={{ flex: 1, p: 3, borderRadius: 3, width: '100%', maxWidth: { md: 400 }, position: { md: 'sticky' }, top: { md: 16 } }}>
            <Typography variant="h6" fontWeight={800} gutterBottom>
              Ваш заказ
            </Typography>
            <Stack spacing={2} sx={{ mb: 2 }}>
              {cart.map((item) => (
                <Stack key={item.id} direction="row" spacing={2} alignItems="center">
                  <CardMedia
                    component="img"
                    image={item.image_url ? assetUrl(item.image_url) : ''}
                    sx={{ width: 56, height: 56, borderRadius: 2, objectFit: 'cover' }}
                  />
                  <Box sx={{ flex: 1, textAlign: 'left' }}>
                    <Typography variant="body2" fontWeight={700}>
                      {item.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Кол-во: {item.quantity}
                    </Typography>
                  </Box>
                  <Typography fontWeight={700}>{formatRub(Number(item.price) * item.quantity)}</Typography>
                </Stack>
              ))}
            </Stack>

            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <TextField
                size="small"
                fullWidth
                label="Промокод"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                disabled={Boolean(appliedPromo)}
                placeholder="Например: WELCOME10"
              />
              {appliedPromo ? (
                <Button variant="outlined" size="small" onClick={clearPromo} sx={{ flexShrink: 0 }}>
                  Сброс
                </Button>
              ) : (
                <Button variant="outlined" size="small" onClick={() => void applyPromo()} disabled={promoBusy} sx={{ flexShrink: 0 }}>
                  Ок
                </Button>
              )}
            </Stack>
            {promoHint && (
              <Typography variant="caption" color={appliedPromo ? 'success.main' : 'text.secondary'} display="block" sx={{ mb: 2 }}>
                {promoHint}
              </Typography>
            )}

            <Stack spacing={1}>
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">Товары</Typography>
                <Typography fontWeight={700}>{formatRub(subtotal)}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">Доставка</Typography>
                <Typography fontWeight={700}>
                  {shipping === 0 ? 'Бесплатно' : formatRub(shipping)}
                </Typography>
              </Stack>
              {promoDiscount > 0 && (
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="success.main">Скидка ({appliedPromo?.code})</Typography>
                  <Typography fontWeight={700} color="success.main">
                    −{formatRub(promoDiscount)}
                  </Typography>
                </Stack>
              )}
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="h6" fontWeight={800}>
                  Итого
                </Typography>
                <Typography variant="h6" fontWeight={800}>
                  {formatRub(Math.max(0, total))}
                </Typography>
              </Stack>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
};
