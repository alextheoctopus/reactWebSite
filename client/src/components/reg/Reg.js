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
            nav("/notes");
        } catch (e) {
            setErr(e?.message || "Ошибка регистрации");
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="pageCenter">
            <div className="authCard">
                <input id="name" ref={inputName} placeholder="Ваше имя" />
                <input id="login" ref={inputLogin} placeholder="Логин" />
                <input id="password" ref={inputPassword} placeholder="Пароль" type="password" />

                {err ? <div className="authError">{err}</div> : null}
                <button id="regSbmBtn" onClick={registrationClickHandler} disabled={busy}>
                    Зарегистрироваться
                </button>

                <div className="authTop">
                    Уже есть аккаунт?
                    <Link to="/login" className="authLink">Войти</Link>
                </div>
            </div>
        </div>
    );
}