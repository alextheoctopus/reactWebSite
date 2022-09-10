import './Header.css';
import { useDispatch } from 'react-redux';
import { logouting } from "../../store/features/authStore/authStore";

const Header = ({ socket, auth, setShowForm, setOpenMessenger, setErr }) => {

    const dispatch = useDispatch();

    const onClickHandlerLogOut = () => {
        dispatch(logouting());
        socket.emit('logOut', auth);
        setOpenMessenger(false);
        setShowForm(null);

    }

    const onClickHandlerShowRoom = () => {
        setShowForm('cabinet');
    }

    return (
        <div className='header'>
            {(auth.status && auth.login) ?
                <>
                    <button id="logOut" onClick={onClickHandlerLogOut}>Выйти</button>
                    <button id="openRoom" onClick={onClickHandlerShowRoom}>{auth.name}</button>
                </> :
                <>
                    <button id="openauth" onClick={() => { setShowForm('auth'); setErr(null); }}>Войти</button>
                    <button id="openRegi" onClick={() => { setShowForm('reg'); setErr(null); }}>Зарегистрироваться</button>
                </>
            }
        </div >
    );
};

export default Header;