import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/Dashboard";
import Login from "./auth/Login";
import PrivateRoute from "./auth/PrivateRoute";
import Register from "./auth/Register";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-bg text-text transition-colors duration-300">
        {/* 🔔 Global Toast Notifications */}
        <Toaster position="top-center" reverseOrder={false} />

        {/* 🔁 Routes */}
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
