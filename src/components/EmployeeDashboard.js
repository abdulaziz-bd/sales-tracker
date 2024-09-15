import { Box, Button, Grid, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

function EmployeeDashboard() {
  const navigate = useNavigate();

  const buttons = [
    { text: "Sales", route: "/categories" },
    { text: "Add Expense", route: "/add-expense" },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Employee Dashboard
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

export default EmployeeDashboard;
