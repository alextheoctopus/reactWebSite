import { useRef } from "react";
import '../reg/Reg.css';
import { useDispatch } from 'react-redux';
import { logining } from "../../store/features/authStore/authStore";

const Reg = ({ socket, setShowForm, setErr }) => {
    const inputLogin = useRef(null);
    const inputPassword = useRef(null);
    const inputName = useRef(null);
    const dispatch = useDispatch();

    const registrationClickHandler = () => {
        const login = inputLogin.current.value;
        const password = inputPassword.current.value;
        const name = inputName.current.value;
        /* здесь проверить данные и отправить в бэк */
        socket.emit('registration', ({ login, password, name }));
        socket.on("authAnswer", (params) => {
            if (params === 'ошибка') {
                setShowForm(null);
                setErr('loginIsBusy');
            } else {
                localStorage.setItem('name', params.name);
                localStorage.setItem('login', login);
                localStorage.setItem('status', true);
                dispatch(logining(params.name));
                setShowForm(null);
            }
        })
    };

    return (
        <div className="reg-form">
            <input id="name" ref={inputName} placeholder="Ваше имя" />
            <input id="login" ref={inputLogin} placeholder="Логин" />
            <input id="password" ref={inputPassword} placeholder="Пароль" />
            <button id="regSbmBtn" onClick={registrationClickHandler}>Зарегистрироваться</button>
        </div>
    );
}

export default Reg;