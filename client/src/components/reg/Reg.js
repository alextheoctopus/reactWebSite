import { useRef, useState } from "react";
import "./Reg.css";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export default function Reg() {
  const inputLogin = useRef(null);
  const inputPassword = useRef(null);
  const inputName = useRef(null);
  const { register } = useAuth();
  const nav = useNavigate();

  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const registrationClickHandler = async () => {
    setErr("");
    setBusy(true);
    try {
      await register({
        name: inputName.current.value.trim(),
        login: inputLogin.current.value.trim(),
        password: inputPassword.current.value,
      });
      nav("/board");
    } catch (e) {
      setErr(e?.message || "Registration error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="pageCenter">
      <div className="authCard">
        <input id="name" ref={inputName} placeholder="Your name" />
        <input id="login" ref={inputLogin} placeholder="Login" />
        <input id="password" ref={inputPassword} placeholder="Password" type="password" />

        {err ? <div className="authError">{err}</div> : null}

        <button id="regSbmBtn" onClick={registrationClickHandler} disabled={busy}>
          Register
        </button>

        <div className="authTop">
          Already have account?
          <Link to="/login" className="authLink">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
