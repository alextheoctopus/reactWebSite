import React, { useRef } from "react";
import './Auth.css';
import { useSelector, useDispatch } from 'react-redux';
import { logining } from "../../store/features/authStore/authStore";

const Auth = ({ socket, setAuthorized, setShowForm }) => {
    let inputLogin = useRef(null);
    let inputPassword = useRef(null);
    const dispatch = useDispatch();
    const btnOnClickHandler = () => {
        const login = inputLogin.current.value;
        const password = inputPassword.current.value;
        /* отправка данных через сокеты  */
        socket.emit("authorization", ({ login, password }));
        socket.on("authAnswer", () => {
            setAuthorized(true);
            setShowForm(null);
        })

        dispatch(logining(login));
    }

    /* хранилище */
    const auth = useSelector((state) => state.auth.username);
    console.log(auth);
    /* где-то в разметку
    {()=>dispatch(logining( вёть сюда нужно полозить данные)) }*/

    return (
        <div className="authForm">
            <input ref={inputLogin} id="loginAuth" placeholder="Логин" />
            <input ref={inputPassword} id="passwordAuth" placeholder="Пароль" />
            <button id="authSbmBtn" onClick={btnOnClickHandler}>Войти</button>
        </div>
    )
}

export default Auth;