import { Box, Button, Grid, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const buttons = [
    { text: "Add Product", route: "/add-product" },
    { text: "Manage Employees", route: "/manage-employees" },
    { text: "Sales", route: "/categories" },
    { text: "Show Report", route: "/report" },
    { text: "Add Expense", route: "/add-expense" },
    { text: "Add Service", route: "/add-service" },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Grid container spacing={2}>
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
      <Button
        variant="outlined"
        onClick={() => {
          localStorage.removeItem("currentUser");
          navigate("/");
        }}
        sx={{ mt: 2 }}
      >
        Logout
      </Button>
    </Box>
  );
}

export default AdminDashboard;
