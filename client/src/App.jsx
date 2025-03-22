import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./componets/Login";
import Dashboard from "./componets/Dashboard";
import Admin from "./componets/Admin";
import PublicRoute from "./routes/PublicRoutes";
import ProtectedRoute from "./routes/ProtectedRoutes";
import { UserContext } from "./context/userContext";

const App = () => {
  const { user } = useContext(UserContext);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes (Only accessible when NOT logged in) */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Protected Routes (Dashboard or Admin based on user role) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={user?.role === "Admin" ? <Admin /> : <Dashboard />} />
        </Route>

        {/* Catch-All Route (Redirect unknown routes) */}
        <Route
          path="*"
          element={user ? <Navigate to="/" /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
