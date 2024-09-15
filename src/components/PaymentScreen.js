import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box } from '@mui/material';

function PaymentScreen() {
  const [amountReceived, setAmountReceived] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { productId, salePrice, buyPrice } = location.state;

  const handlePayment = (e) => {
    e.preventDefault();
    const received = parseFloat(amountReceived);
    const due = parseFloat(salePrice);
    if (received >= due) {
      const change = received - due;
      navigate('/change', { state: { change, productId, salePrice, buyPrice } });
    } else {
      alert('Insufficient payment amount');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Payment
      </Typography>
      <Typography variant="h5" gutterBottom>
        Total Due: Tk{parseFloat(salePrice).toFixed(2)}
      </Typography>
      <form onSubmit={handlePayment}>
        <TextField
          label="Amount Received"
          type="number"
          value={amountReceived}
          onChange={(e) => setAmountReceived(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Process Payment
        </Button>
      </form>
    </Box>
  );
}

export default PaymentScreen;