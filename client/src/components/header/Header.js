import "./Header.css";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export default function Header() {
  const { isAuth, user, logout } = useAuth();
  const nav = useNavigate();

  const onLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <div className="header">
      {isAuth ? (
        <>
          <button id="openRoom">{user?.name || user?.login || "User"}</button>
          <button id="logOut" onClick={onLogout}>
            Выйти
          </button>
        </>
      ) : (
        <>
          <Link to="/register">
            <button id="openRegi">Зарегистрироваться</button>
          </Link>
          <Link to="/login">
            <button id="openauth">Войти</button>
          </Link>
        </>
      )}
    </div>
  );
}