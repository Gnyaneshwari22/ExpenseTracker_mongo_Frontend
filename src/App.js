import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

// Public Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import ResetPassword from "./pages/ResetPassword";

// Protected Pages
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";
import Payment from "./pages/Payment";
import PaymentStatus from "./pages/PaymentStatus"; // Add this import
import ForgotPasswordRequest from "./pages/ForgotPasswordRequest"; // Import this

function App() {
  const { token } = useContext(AuthContext);

  return (
    <>
      {token && <Header />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ForgotPasswordRequest />} />
        <Route path="/reset-password/:requestId" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment-status" element={<PaymentStatus />} />
        </Route>
      </Routes>
      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
}

export default App;
