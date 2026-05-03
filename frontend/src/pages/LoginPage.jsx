import React, { useState } from "react";
import {
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Stack,
  Link,
  Alert
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {useAuth} from "../context/AuthContext.jsx";

export const LoginPage = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [isLoginView, setIsLoginView] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    phone: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isLoginView) {
        await login(formData.email, formData.password);
      } else {
        await register(formData);
      }

      navigate("/");

    } catch (err) {
      setError(err.response?.data?.message || "Ошибка авторизации");
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom align="center">
          {isLoginView ? "Вход в систему" : "Регистрация"}
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            {!isLoginView && (
              <>
                <TextField
                  label="Имя"
                  name="name"
                  fullWidth
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
                <TextField
                  label="Телефон"
                  name="phone"
                  fullWidth
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+7 (___) ___-__-__"
                />
                <TextField
                  label="Адрес доставки"
                  name="address"
                  fullWidth
                  multiline
                  rows={2}
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Город, улица, дом..."
                />
              </>
            )}

            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              required
              value={formData.email}
              onChange={handleChange}
            />

            <TextField
              label="Пароль"
              name="password"
              type="password"
              fullWidth
              required
              value={formData.password}
              onChange={handleChange}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              sx={{ mt: 1 }}
            >
              {isLoginView ? "Войти" : "Создать аккаунт"}
            </Button>
          </Stack>
        </form>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2">
            {isLoginView ? "Нет аккаунта?" : "Уже есть аккаунт?"}{" "}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            <Link
              component="button"
              variant="body2"
              onClick={() => setIsLoginView(!isLoginView)}
              sx={{ fontWeight: 'bold', textDecoration: 'none' }}
            >
              {isLoginView ? "Зарегистрироваться" : "Войти"}
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};