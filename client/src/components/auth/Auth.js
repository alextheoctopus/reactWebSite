import React, { useRef } from "react";
import './Auth.css';
import { useDispatch } from 'react-redux';
import { logining } from "../../store/features/authStore/authStore";

const Auth = ({ socket, setShowForm,setUsers, setErr }) => {

    let inputLogin = useRef(null);
    let inputPassword = useRef(null);
    const dispatch = useDispatch();
    const btnOnClickHandler = () => {
        const login = inputLogin.current.value;
        const password = inputPassword.current.value;
        /* отправка данных через сокеты  */
        socket.emit("authorization", ({ login, password }));

        socket.on("authAnswer", (params) => {
            if (params === 'ошибка') {
                setShowForm(null);
                setErr('notFinded');
            } else {
                localStorage.setItem('name', params.result.name);
                localStorage.setItem('login', login);
                localStorage.setItem('status', true);
                
                dispatch(logining(params.result.name));
                setShowForm(null);
                setUsers(params.users);
            }

        });
    }

    return (
        <>
            <div className="authForm">
                <input ref={inputLogin} id="loginAuth" placeholder="Логин" />
                <input ref={inputPassword} id="passwordAuth" placeholder="Пароль" />
                <button id="authSbmBtn" onClick={btnOnClickHandler}>Войти</button>
            </div>
        </>

    )
}

export default Auth;