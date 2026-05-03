import React, { useState, useEffect, useCallback } from "react";
import { Modal, Box, Typography, TextField, Button, Stack } from "@mui/material";
import { useAuth } from "../context/AuthContext.jsx";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2
};

export const ProfileModal = ({ open, handleClose }) => {
  const { user, updateProfile } = useAuth();
  const [data, setData] = useState({ name: "", address: "", phone: "" });

  const updateFormData = useCallback(() => {
    if (open && user) {
      setData({ name: user.name, address: user.address || "", phone: user.phone || "" });
    }
  }, [open, user]);

  useEffect(() => {
    updateFormData();
  }, [updateFormData]);

  const handleSubmit = async () => {
    try {
      await updateProfile(data.name, data.address, data.phone);
      handleClose();
      // eslint-disable-next-line no-unused-vars
    } catch (e) {
      alert("Ошибка обновления");
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>Редактировать профиль</Typography>
        <Stack spacing={2}>
          <TextField
            label="Имя"
            fullWidth
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />
          <TextField
            label="Телефон"
            fullWidth
            value={data.phone}
            onChange={(e) => setData({ ...data, phone: e.target.value })}
          />
          <TextField
            label="Адрес"
            fullWidth
            multiline
            rows={3}
            value={data.address}
            onChange={(e) => setData({ ...data, address: e.target.value })}
          />
          <Button variant="contained" onClick={handleSubmit}>Сохранить</Button>
        </Stack>
      </Box>
    </Modal>
  );
};