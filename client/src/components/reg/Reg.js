import { useRef } from "react";
import '../reg/Reg.css';

const Reg = ({ socket, setAuthorized, setShowForm }) => {
    const inputLogin = useRef(null);
    const inputPassword = useRef(null);
    const inputName = useRef(null);

    const registrationClickHandler = () => {
        const login = inputLogin.current.value;
        const password = inputPassword.current.value;
        const name = inputName.current.value;
        /* здесь проверить данные и отправить в бэк */
        socket.emit('registration', ({ login, password, name }));
        socket.on("authAnswer",()=>{
            setAuthorized(true);
            setShowForm(null); 
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