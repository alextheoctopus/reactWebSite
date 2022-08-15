import './Header.css';


const Header = ({ socket, setAuthorized, setShowForm, authorized, userData }) => {
    if (userData) { var { name, token, login, password } = userData; }//иначе будет userData=undefined

    const onClickHandlerLogOut = () => {
        setAuthorized(false);
        socket.emit('logOut', { name, token, login, password });
    }

    const onClickHandlerShowRoom = () => setShowForm('cabinet');

    return (
        <div className='header'>
            {(authorized && userData) ?
                <>
                    <button id="logOut" onClick={onClickHandlerLogOut}></button>
                    <button id="openRoom" onClick={onClickHandlerShowRoom}>{name}</button>
                </> :
                <>
                    {/* {localStorage.clear()} */}
                    <button id="openauth" onClick={() => setShowForm('auth')}>Войти</button>
                    <button id="openRegi" onClick={() => setShowForm('reg')}>Зарегистрироваться</button>
                </>
            }
        </div >
    );
};

export default Header;