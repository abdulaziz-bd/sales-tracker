import DeleteIcon from "@mui/icons-material/Delete";
import {
  Alert,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

const { ipcRenderer } = window.require("electron");

function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
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
        setCategories([]);
      } else {
        setError("");
        setCategories(result.categories || []);
        if (result.message) {
          setMessage(result.message);
        } else {
          setMessage("");
        }
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("An unexpected error occurred while fetching categories.");
      setCategories([]);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await ipcRenderer.invoke("add-category", { name: newCategory });
      setNewCategory("");
      fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error);
      setError("Failed to add category. Please try again.");
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await ipcRenderer.invoke("delete-category", id);
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      setError("Failed to delete category. Please try again.");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Manage Categories
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

      <form onSubmit={handleAddCategory}>
        <TextField
          label="Category Name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Add Category
        </Button>
      </form>

      {categories.length > 0 ? (
        <List sx={{ mt: 4 }}>
          {categories.map((category) => (
            <ListItem key={category.id}>
              <ListItemText primary={category.name} />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteCategory(category.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography sx={{ mt: 4 }}>
          No categories found. Add a category using the form above.
        </Typography>
      )}
    </Box>
  );
}

export default CategoryManagement;
