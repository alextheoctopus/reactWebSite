import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./App.css"; // ✅ можно тут (или в index.js)

import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

import Header from "./components/header/Header";
import Auth from "./components/auth/Auth";
import Reg from "./components/reg/Reg";
import NotesPage from "./pages/NotesPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />

        {/* ✅ ВОТ СЮДА */}
        <div className="appShell">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/register" element={<Reg />} />

            <Route
              path="/notes"
              element={
                <ProtectedRoute>
                  <NotesPage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}