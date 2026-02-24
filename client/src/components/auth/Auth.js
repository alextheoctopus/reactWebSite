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
            nav("/notes");
        } catch (e) {
            setErr(e?.message || "Ошибка входа");
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="pageCenter">
            <div className="authCard">


                <input ref={inputLogin} placeholder="Логин" />
                <input ref={inputPassword} placeholder="Пароль" type="password" />

                {err && <div className="authError">{err}</div>}

                <button onClick={btnOnClickHandler} disabled={busy}>
                    Войти
                </button>
                <div className="authTop">
                    Нет аккаунта?
                    <Link to="/register" className="authLink">
                        Регистрация
                    </Link>
                </div>
            </div>
        </div>
    );
}