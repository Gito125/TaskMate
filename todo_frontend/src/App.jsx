import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { applyTheme, getInitialTheme } from "./utils/theme";
import Dashboard from "./pages/Dashboard";
import Login from "./auth/Login";
import PrivateRoute from "./auth/PrivateRoute";


function App() {

  return (
    <Router>
      <div className="min-h-screen bg-bg text-text transition-colors duration-300">
        {/* 🔔 Global Toast Notifications */}
        <Toaster position="top-center" reverseOrder={false} />

        {/* 🔁 Routes */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route
            path="/login"
            element={
              <PrivateRoute>
                <Login />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;