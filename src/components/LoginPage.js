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
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const { ipcRenderer } = window.require("electron");

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    console.log("Fetching users...");
    try {
      const result = await ipcRenderer.invoke("fetch-users");
      //   console.log("Fetch users result:", result);
      if (result.error) {
        setError(result.error);
      } else {
        setUsers(result.users || []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users. Please try again.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    // console.log("Login attempt with:", { username, password });
    try {
      const result = await ipcRenderer.invoke("login", { username, password });
      //   console.log("Login result:", result);
      if (result.user) {
        localStorage.setItem("currentUser", JSON.stringify(result.user));
        navigate(
          result.user.role === "admin"
            ? "/admin-dashboard"
            : "/employee-dashboard"
        );
      } else if (result.error) {
        setError(result.error);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t("appTitle")}
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <form onSubmit={handleLogin}>
        <FormControl fullWidth margin="normal" required>
          <InputLabel>{t("Username")}</InputLabel>
          <Select
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            label={t("Username")}
          >
            {users.map((user) => (
              <MenuItem key={user.id} value={user.username}>
                {user.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label={t("Password")}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          {t("Login")}
        </Button>
      </form>
    </Box>
  );
}

export default LoginPage;
