import React, { useRef } from "react";
import './Auth.css';

const Auth = ({ socket, setAuthorized, setShowForm }) => {
    let inputLogin = useRef(null);
    let inputPassword = useRef(null);

    const btnOnClickHandler = () => {
        const login = inputLogin.current.value;
        const password = inputPassword.current.value;
        /* отправка данных через сокеты  */
        socket.emit("authorization", ({ login, password }));
        socket.on("authAnswer",()=>{
            setAuthorized(true);
            setShowForm(null); 
        })
    }

    return (
        <div className="authForm">
            <input ref={inputLogin} id="loginAuth" placeholder="Логин" />
            <input ref={inputPassword} id="passwordAuth" placeholder="Пароль" />
            <button id="authSbmBtn" onClick={btnOnClickHandler}>Войти</button>
        </div>
    )
}

export default Auth;