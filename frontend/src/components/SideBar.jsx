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

import DvrIcon from '@mui/icons-material/Dvr';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import PeopleIcon from '@mui/icons-material/People';
import CategoryIcon from '@mui/icons-material/Category';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
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
            Админ-панель
          </Typography>
          <Button size="small" variant="outlined" onClick={() => navigate("/")} sx={{ mt: 1 }} fullWidth>
            На витрину
          </Button>
        </Box>
        <Divider />

        <List sx={{ flex: 1 }}>
          {user?.role === 'admin' && (
            <>
              <Typography variant="caption" sx={{ px: 2, py: 1, display: 'block', color: 'text.secondary' }}>
                Управление
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
                <ListItemButton onClick={() => navigate("/admin/categories")}>
                  <ListItemIcon><FolderOpenIcon /></ListItemIcon>
                  <ListItemText primary="Категории" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={() => navigate("/admin/orders")}>
                  <ListItemIcon><DvrIcon /></ListItemIcon>
                  <ListItemText primary="Заказы" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={() => navigate("/admin/promo")}>
                  <ListItemIcon><LocalOfferIcon /></ListItemIcon>
                  <ListItemText primary="Промокоды" />
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>

        <Divider />
        <Box sx={{ p: 2 }}>
          {user ? (
            <Box>
              <Box
                onClick={() => setIsProfileModalOpen(true)}
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
