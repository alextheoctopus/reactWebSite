import React, { useRef, useState } from "react";
import "./Auth.css";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export default function Auth() {
  const inputLogin = useRef(null);
  const inputPassword = useRef(null);
  const { login } = useAuth();
  const nav = useNavigate();

  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const btnOnClickHandler = async () => {
    setErr("");
    setBusy(true);
    try {
      await login({
        login: inputLogin.current.value.trim(),
        password: inputPassword.current.value,
      });
      nav("/board");
    } catch (e) {
      setErr(e?.message || "Login error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="pageCenter">
      <div className="authCard">
        <input ref={inputLogin} placeholder="Login" />
        <input ref={inputPassword} placeholder="Password" type="password" />

        {err && <div className="authError">{err}</div>}

        <button onClick={btnOnClickHandler} disabled={busy}>
          Sign in
        </button>

        <div className="authTop">
          No account?
          <Link to="/register" className="authLink">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
