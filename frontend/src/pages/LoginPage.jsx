import React, { useState } from "react";
import {
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Stack,
  Link,
  Alert,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import {
  formatRuPhoneMask,
  normalizeRuPhoneDigits,
  isRuPhoneComplete,
  ruPhoneToE164,
  isValidEmail,
} from "../shared/masks.js";

export const LoginPage = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const sessionHint = location.state?.message;

  const [isLoginView, setIsLoginView] = useState(
    () => new URLSearchParams(window.location.search).get("register") !== "1"
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phoneDisplay: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phoneDisplay") {
      setFormData({ ...formData, phoneDisplay: formatRuPhoneMask(value) });
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isLoginView) {
      const digits = normalizeRuPhoneDigits(formData.phoneDisplay);
      if (!isRuPhoneComplete(digits)) {
        setError("Введите номер телефона полностью в формате +7 (___) ___-__-__");
        return;
      }
      if (!isValidEmail(formData.email)) {
        setError("Введите корректный e-mail, например: name@mail.ru");
        return;
      }
    }

    try {
      if (isLoginView) {
        await login(formData.email.trim(), formData.password);
      } else {
        await register({
          email: formData.email.trim(),
          password: formData.password,
          phone: ruPhoneToE164(normalizeRuPhoneDigits(formData.phoneDisplay)),
        });
      }

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Ошибка авторизации");
    }
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        py: { xs: 5, sm: 7 },
        px: 2,
        width: "100%",
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: isLoginView ? 420 : 440, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom align="center">
          {isLoginView ? "Вход" : "Регистрация"}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {sessionHint && (
          <Alert severity="warning" sx={{ mb: 2 }} onClose={() => navigate(location.pathname + location.search, { replace: true, state: {} })}>
            {sessionHint}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            {!isLoginView && (
              <>
                <TextField
                  label="Телефон"
                  name="phoneDisplay"
                  fullWidth
                  required
                  value={formData.phoneDisplay}
                  onChange={handleChange}
                  placeholder="+7 (___) ___-__-__"
                  helperText="Маска: +7 и 10 цифр номера"
                  inputProps={{ inputMode: "tel", autoComplete: "tel" }}
                />
                <TextField
                  label="E-mail"
                  name="email"
                  type="email"
                  fullWidth
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.ru"
                  helperText="Формат: логин@домен.зона"
                  inputProps={{ autoComplete: "email" }}
                />
              </>
            )}

            {isLoginView && (
              <TextField
                label="E-mail"
                name="email"
                type="email"
                fullWidth
                required
                value={formData.email}
                onChange={handleChange}
                inputProps={{ autoComplete: "email" }}
              />
            )}

            <TextField
              label="Пароль"
              name="password"
              type="password"
              fullWidth
              required
              value={formData.password}
              onChange={handleChange}
              inputProps={{ autoComplete: isLoginView ? "current-password" : "new-password" }}
            />

            <Button type="submit" variant="contained" size="large" fullWidth sx={{ mt: 1 }}>
              {isLoginView ? "Войти" : "Создать аккаунт"}
            </Button>
          </Stack>
        </form>

        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography variant="body2">{isLoginView ? "Нет аккаунта?" : "Уже есть аккаунт?"} </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            <Link
              component="button"
              variant="body2"
              onClick={() => setIsLoginView(!isLoginView)}
              sx={{ fontWeight: "bold", textDecoration: "none" }}
            >
              {isLoginView ? "Зарегистрироваться" : "Войти"}
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};
