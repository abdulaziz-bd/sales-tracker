import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const { ipcRenderer } = window.require("electron");

function AddProduct() {
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (categories.length === 0) {
      setError("Please add at least one category before adding a product.");
      return;
    }
    try {
      //   console.log("Category name from add product page: ", category);
      await ipcRenderer.invoke("add-product", {
        name: productName,
        categoryId: category,
      });
      alert("Product added successfully");
      setProductName("");
      setCategory("");
    } catch (error) {
      console.error("Error adding product:", error);
      setError("Failed to add product. Please try again.");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Add Product
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
      <form onSubmit={handleSubmit}>
        <TextField
          label="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            label="Category"
            disabled={categories.length === 0}
          >
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 2, mr: 2 }}
          disabled={categories.length === 0}
        >
          Add Product
        </Button>
        <Button
          component={Link}
          to="/add-category"
          variant="outlined"
          sx={{ mt: 2 }}
        >
          Add Category
        </Button>
      </form>
    </Box>
  );
}

export default AddProduct;
