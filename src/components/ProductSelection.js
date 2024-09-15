import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Grid, Typography, Box } from '@mui/material';

const { ipcRenderer } = window.require('electron');

function ProductSelection() {
  const [products, setProducts] = useState([]);
  const { categoryId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [categoryId]);

  const fetchProducts = async () => {
    try {
      const result = await ipcRenderer.invoke('fetch-products', categoryId);
      setProducts(result);
    } catch (error) {
      console.error('Error fetching products:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleProductSelect = (productId) => {
    navigate(`/sale-details/${productId}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Select a Product
      </Typography>
      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item xs={6} sm={4} md={3} key={product.id}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => handleProductSelect(product.id)}
              sx={{ height: '100px' }}
            >
              {product.name}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default ProductSelection;