import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";

const { ipcRenderer } = window.require("electron");

function AddService() {
  const [date, setDate] = useState("");
  const [hardwareService, setHardwareService] = useState("");
  const [softwareService, setSoftwareService] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!date) {
      setError("Please select a date");
      return;
    }

    try {
      const result = await ipcRenderer.invoke("add-service", {
        date,
        hardwareService: parseFloat(hardwareService) || 0,
        softwareService: parseFloat(softwareService) || 0,
      });

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess("Service added/updated successfully");
        setHardwareService("");
        setSoftwareService("");
      }
    } catch (error) {
      console.error("Error adding/updating service:", error);
      setError("Failed to add/update service. Please try again.");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Add/Update Service
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          fullWidth
          margin="normal"
          required
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Hardware Service Amount"
          type="number"
          value={hardwareService}
          onChange={(e) => setHardwareService(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Software Service Amount"
          type="number"
          value={softwareService}
          onChange={(e) => setSoftwareService(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Add/Update Service
        </Button>
      </form>
    </Box>
  );
}

export default AddService;
