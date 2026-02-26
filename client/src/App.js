import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./App.css";

import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

import Header from "./components/header/Header";
import Auth from "./components/auth/Auth";
import Reg from "./components/reg/Reg";
import BoardPage from "./pages/BoardPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />

        <div className="appShell">
          <Routes>
            <Route path="/" element={<Navigate to="/board" replace />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/register" element={<Reg />} />

            <Route
              path="/board"
              element={
                <ProtectedRoute>
                  <BoardPage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/board" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
