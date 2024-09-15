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

function ManageEmployees() {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const result = await ipcRenderer.invoke("fetch-employees");
      if (result.error) {
        setError(result.error);
        setEmployees([]);
      } else {
        setError("");
        setEmployees(result.employees || []);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError("An unexpected error occurred while fetching employees.");
      setEmployees([]);
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    await ipcRenderer.invoke("add-employee", newEmployee);
    setNewEmployee({ name: "", username: "", password: "" });
    fetchEmployees();
  };

  const handleDeleteEmployee = async (id) => {
    await ipcRenderer.invoke("delete-employee", id);
    fetchEmployees();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Manage Employees
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleAddEmployee}>
        <TextField
          label="Name"
          value={newEmployee.name}
          onChange={(e) =>
            setNewEmployee({ ...newEmployee, name: e.target.value })
          }
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Username"
          value={newEmployee.username}
          onChange={(e) =>
            setNewEmployee({ ...newEmployee, username: e.target.value })
          }
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Password"
          type="password"
          value={newEmployee.password}
          onChange={(e) =>
            setNewEmployee({ ...newEmployee, password: e.target.value })
          }
          fullWidth
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Add Employee
        </Button>
      </form>

      <List sx={{ mt: 4 }}>
        {employees.map((employee) => (
          <ListItem key={employee.id}>
            <ListItemText
              primary={employee.name}
              secondary={employee.username}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDeleteEmployee(employee.id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default ManageEmployees;
