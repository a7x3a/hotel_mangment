import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./componets/Login/Login";
import Dashboard from "./componets/Dashboard/Dashboard";
import AdminDashboard from "./componets/Admin/Dashboard/Dashboard";
import PublicRoute from "./routes/PublicRoutes";
import ProtectedRoute from "./routes/ProtectedRoutes";
import { UserContext } from "./context/userContext";
import Layout from "./componets/Layout";

// Admin Components
import Rooms from "./componets/Admin/Rooms/Rooms";
import Users from "./componets/Admin/Users/Users";

// Cashier Components
import Guests from "./componets/Cashier/Guests/Guests";
import Reservations from "./componets/Cashier/Reservations/Reservations";
import Payments from "./componets/Cashier/Payments/Payments";
import CheckInOut from "./componets/Cashier/CheckInOut/CheckInOut";

// Shared Components
import Profile from "./componets/Profile/Profile";

const App = () => {
  const { user } = useContext(UserContext);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route 
              path="/" 
              element={user?.role === "Admin" ? <AdminDashboard /> : <Dashboard />} 
            />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/rooms" element={<Rooms />} />
            <Route path="/admin/users" element={<Users />} />
          </Route>
        </Route>

        {/* Cashier Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/cashier/dashboard" element={<Dashboard />} />
            <Route path="/cashier/guests" element={<Guests />} />
            <Route path="/cashier/reservations" element={<Reservations />} />
            <Route path="/cashier/payments" element={<Payments />} />
            <Route path="/cashier/check-in-out" element={<CheckInOut />} />
          </Route>
        </Route>

        {/* Shared Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Catch-All Route */}
        <Route
          path="*"
          element={
            user ? (
              <Navigate to={"/"} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;