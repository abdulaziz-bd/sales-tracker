import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { useDrawer } from "../contexts/DrawerContext";

const { ipcRenderer } = window.require("electron");

function CashDrawerSimulator() {
  const { isDrawerOpen, setIsDrawerOpen } = useDrawer();

  const handleToggleDrawer = async () => {
    if (!isDrawerOpen) {
      await ipcRenderer.invoke("open-cash-drawer");
    } else {
      await ipcRenderer.invoke("close-cash-drawer");
    }
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <Box sx={{ p: 2, border: "1px solid #ccc", borderRadius: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Cash Drawer Simulator
      </Typography>
      <Button
        variant="contained"
        onClick={handleToggleDrawer}
        color={isDrawerOpen ? "secondary" : "primary"}
      >
        {isDrawerOpen ? "Close Drawer" : "Open Drawer"}
      </Button>
      <Typography sx={{ mt: 1 }}>
        Status: {isDrawerOpen ? "Open" : "Closed"}
      </Typography>
    </Box>
  );
}

export default CashDrawerSimulator;
