import { Box, Button, Grid, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useDrawer } from "../contexts/DrawerContext";
import CashDrawerSimulator from "./CashDrawerSimulator";

function Dashboard() {
  const navigate = useNavigate();
  const { isDrawerOpen } = useDrawer();

  const buttons = [
    { text: "Add Product", route: "/add-product" },
    { text: "Show Report", route: "/report" },
    { text: "Add Expense", route: "/add-expense" },
    { text: "Add Service", route: "/add-service" },
  ];

  const handleSalesClick = () => {
    if (!isDrawerOpen) {
      navigate("/categories");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={2}>
        {/* Sales button with drawer check */}
        <Grid item xs={6} sm={4} md={3}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleSalesClick}
            disabled={isDrawerOpen}
            sx={{
              height: "100px",
              backgroundColor: isDrawerOpen ? "grey.400" : "primary.main",
            }}
          >
            {isDrawerOpen ? "Close Drawer to Start Sale" : "Sales"}
          </Button>
        </Grid>

        {/* Other buttons */}
        {buttons.map((button, index) => (
          <Grid item xs={6} sm={4} md={3} key={index}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => navigate(button.route)}
              sx={{ height: "100px" }}
            >
              {button.text}
            </Button>
          </Grid>
        ))}
      </Grid>
      <Button variant="outlined" onClick={() => navigate("/")} sx={{ mt: 2 }}>
        Logout
      </Button>

      {/* Cash Drawer Simulator */}
      <CashDrawerSimulator />
    </Box>
  );
}

export default Dashboard;
