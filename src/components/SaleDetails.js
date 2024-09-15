import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const { ipcRenderer } = window.require("electron");

function SaleDetails() {
  const [product, setProduct] = useState(null);
  const [salePrice, setSalePrice] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const { productId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const result = await ipcRenderer.invoke("fetch-product", productId);
      setProduct(result);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (salePrice && buyPrice) {
      navigate("/payment", { state: { productId, salePrice, buyPrice } });
    }
  };

  if (!product) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Sale Details for {product.name}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Sale Price"
          type="number"
          value={salePrice}
          onChange={(e) => setSalePrice(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Buy Price"
          type="number"
          value={buyPrice}
          onChange={(e) => setBuyPrice(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Proceed to Payment
        </Button>
      </form>
    </Box>
  );
}

export default SaleDetails;
