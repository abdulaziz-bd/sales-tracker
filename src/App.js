import { Box, Button } from "@mui/material";
import React from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useNavigate,
} from "react-router-dom";
import AddExpense from "./components/AddExpense";
import AddProduct from "./components/AddProduct";
import AddService from "./components/AddService";
import AdminDashboard from "./components/AdminDashboard";
import CategoryManagement from "./components/CategoryManagement";
import CategorySelection from "./components/CategorySelection";
import ChangeScreen from "./components/ChangeScreen";
import { DrawerProvider } from "./components/DrawerContext";
import EmployeeDashboard from "./components/EmployeeDashboard";
import LanguageToggle from "./components/LanguageToggle";
import LoginPage from "./components/LoginPage";
import ManageEmployees from "./components/ManageEmployees";
import PaymentScreen from "./components/PaymentScreen";
import ProductSelection from "./components/ProductSelection";
import Report from "./components/Report";
import SaleDetails from "./components/SaleDetails";

function BackButton() {
  const navigate = useNavigate();
  return (
    <Button variant="outlined" onClick={() => navigate(-1)} sx={{ m: 1 }}>
      Back
    </Button>
  );
}

function PrivateRoute({ children, allowedRoles }) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return (
      <Navigate
        to={
          currentUser.role === "admin"
            ? "/admin-dashboard"
            : "/employee-dashboard"
        }
        replace
      />
    );
  }
  return children;
}

function App() {
  return (
    <DrawerProvider>
      <Router>
        <Box sx={{ p: 2 }}>
          <LanguageToggle />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/admin-dashboard"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/employee-dashboard"
              element={
                <PrivateRoute allowedRoles={["employee"]}>
                  <EmployeeDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/categories"
              element={
                <PrivateRoute>
                  <BackButton />
                  <CategorySelection />
                </PrivateRoute>
              }
            />
            <Route
              path="/products/:categoryId"
              element={
                <PrivateRoute>
                  <BackButton />
                  <ProductSelection />
                </PrivateRoute>
              }
            />
            <Route
              path="/sale-details/:productId"
              element={
                <PrivateRoute>
                  <BackButton />
                  <SaleDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="/payment"
              element={
                <PrivateRoute>
                  <BackButton />
                  <PaymentScreen />
                </PrivateRoute>
              }
            />
            <Route
              path="/change"
              element={
                <PrivateRoute>
                  <ChangeScreen />
                </PrivateRoute>
              }
            />
            <Route
              path="/add-product"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <BackButton />
                  <AddProduct />
                </PrivateRoute>
              }
            />
            <Route
              path="/add-category"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <BackButton />
                  <CategoryManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="/add-expense"
              element={
                <PrivateRoute>
                  <BackButton />
                  <AddExpense />
                </PrivateRoute>
              }
            />
            <Route
              path="/add-service"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <BackButton />
                  <AddService />
                </PrivateRoute>
              }
            />
            <Route
              path="/report"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <BackButton />
                  <Report />
                </PrivateRoute>
              }
            />
            <Route
              path="/manage-employees"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <BackButton />
                  <ManageEmployees />
                </PrivateRoute>
              }
            />
          </Routes>
        </Box>
      </Router>
    </DrawerProvider>
  );
}

export default App;
