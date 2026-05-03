import React, { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Button,
  CircularProgress
} from "@mui/material";

import ViewListIcon from '@mui/icons-material/ViewList';
import DvrIcon from '@mui/icons-material/Dvr';
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import AppsIcon from '@mui/icons-material/Apps';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import PeopleIcon from '@mui/icons-material/People';
import CategoryIcon from '@mui/icons-material/Category';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { ProfileModal } from "./ProfileModal.jsx";

const drawerWidth = 240;

export const SideBar = () => {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  if (loading) return <CircularProgress />;

  return (
    <>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "background.default",
            display: "flex",
            flexDirection: "column",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            Магазин игрушек
          </Typography>
        </Box>
        <Divider />

        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/")}>
              <ListItemIcon><HomeIcon /></ListItemIcon>
              <ListItemText primary="Главная" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/catalog")}>
              <ListItemIcon><AppsIcon /></ListItemIcon>
              <ListItemText primary="Каталог" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/orders")}>
              <ListItemIcon><ViewListIcon /></ListItemIcon>
              <ListItemText primary="Мои заказы" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/about")}>
              <ListItemIcon><InfoIcon /></ListItemIcon>
              <ListItemText primary="О нас" />
            </ListItemButton>
          </ListItem>

          {user?.role === 'admin' && (
            <>
              <Divider sx={{ my: 1 }} />
              <Typography variant="caption" sx={{ px: 2, color: 'text.secondary' }}>
                АДМИН ПАНЕЛЬ
              </Typography>
              <ListItem disablePadding>
                <ListItemButton onClick={() => navigate("/admin/users")}>
                  <ListItemIcon><PeopleIcon /></ListItemIcon>
                  <ListItemText primary="Пользователи" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={() => navigate("/admin/toys")}>
                  <ListItemIcon><CategoryIcon /></ListItemIcon>
                  <ListItemText primary="Товары" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={() => navigate("/admin/orders")}>
                  <ListItemIcon><DvrIcon /></ListItemIcon>
                  <ListItemText primary="Управление заказами" />
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>

        <Box sx={{ flexGrow: 1 }} />

        <Divider />
        <Box sx={{ p: 2 }}>
          {user ? (
            <Box>
              <Box
                onClick={() => setIsProfileModalOpen(true)} // Открываем модалку по клику
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 1,
                  gap: 1,
                  cursor: 'pointer',
                  '&:hover': { opacity: 0.7 }
                }}
              >
                <AccountCircleIcon color="primary" />
                <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
                  {user.name || "Пользователь"}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                color="error"
                fullWidth
                size="small"
                startIcon={<LogoutIcon />}
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
              >
                Выйти
              </Button>
            </Box>
          ) : (
            <Button
              variant="contained"
              fullWidth
              startIcon={<LoginIcon />}
              onClick={() => navigate("/login")}
            >
              Войти
            </Button>
          )}
        </Box>
      </Drawer>

      <ProfileModal
        open={isProfileModalOpen}
        handleClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
};