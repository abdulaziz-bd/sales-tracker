import { Alert, Box, Button, Typography } from "@mui/material";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDrawer } from "./DrawerContext";

const { ipcRenderer } = window.require("electron");

function ChangeScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const { change, productId, salePrice, buyPrice } = location.state;
  const { isDrawerOpen } = useDrawer();
  const [warning, setWarning] = useState("");

  const handleCompleteSale = async () => {
    try {
      // First, complete the sale in the database
      await ipcRenderer.invoke("complete-sale", {
        productId,
        salePrice,
        buyPrice,
      });

      // Then, open the cash drawer
      await ipcRenderer.invoke("open-cash-drawer");

      // Show warning if drawer is open
      if (isDrawerOpen) {
        setWarning("Please close the drawer to complete the sale.");
        return;
      }

      // If drawer is closed, proceed to navigate
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const dashboardRoute =
        currentUser.role === "admin"
          ? "/admin-dashboard"
          : "/employee-dashboard";
      navigate(dashboardRoute);
    } catch (error) {
      console.error("Error completing sale:", error);
      setWarning("Error completing sale. Please try again.");
    }
  };

  return (
    <Box sx={{ p: 3, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Change Due
      </Typography>
      <Typography variant="h5" gutterBottom>
        Please give the customer: Tk{change.toFixed(2)}
      </Typography>
      {warning && (
        <Alert severity="warning" sx={{ mt: 2, mb: 2 }}>
          {warning}
        </Alert>
      )}
      <Button variant="contained" onClick={handleCompleteSale} sx={{ mt: 2 }}>
        Complete Sale and Open Drawer
      </Button>
      {isDrawerOpen && (
        <Typography variant="body1" sx={{ mt: 2, color: "red" }}>
          Please close the drawer to complete the sale.
        </Typography>
      )}
    </Box>
  );
}

export default ChangeScreen;
