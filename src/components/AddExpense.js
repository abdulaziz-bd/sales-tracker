import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";

const { ipcRenderer } = window.require("electron");

function AddExpense() {
  const [details, setDetails] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await ipcRenderer.invoke("add-expense", {
        details,
        amount: parseFloat(amount),
      });
      alert("Expense added successfully");
      setDetails("");
      setAmount("");
    } catch (error) {
      console.error("Error adding expense:", error);
      alert("Failed to add expense");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Add Expense
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Expense Details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Add Expense
        </Button>
      </form>
    </Box>
  );
}

export default AddExpense;
