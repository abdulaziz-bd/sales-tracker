import { Alert, Box, Button, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const { ipcRenderer } = window.require("electron");

function CategorySelection() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch categories from the database when the component mounts
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const result = await ipcRenderer.invoke("fetch-categories");
      if (result.error) {
        setError(result.error);
      } else {
        setCategories(result.categories || []);
        if (result.message) {
          setMessage(result.message);
        }
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to fetch categories. Please try again.");
    }
  };

  const handleCategorySelect = (categoryId) => {
    // Navigate to the ProductSelection page with the selected category ID
    navigate(`/products/${categoryId}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Select a Category
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {message && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}
      <Grid container spacing={2}>
        {categories?.map((category) => (
          <Grid item xs={6} sm={4} md={3} key={category.id}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => handleCategorySelect(category.id)}
              sx={{ height: "100px" }}
            >
              {category.name}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default CategorySelection;
