import { Outlet } from "react-router-dom";
import {
  Box,
  CssBaseline,
} from "@mui/material";
import {SideBar} from "../components/SideBar.jsx";


export const MainLayout = () => {

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <CssBaseline />

      <SideBar/>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.paper",
          p: 3,
          overflowY: "auto",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};