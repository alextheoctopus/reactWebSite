import { useEffect } from 'react';
import './PersonalCabinet.css';

const PersonalCabinet = ({ setOpenMessenger, auth }) => {

    const onClickOpenMessenger = () => {
        //localStorage.setItem('openMessenger',true);
        setOpenMessenger(true);
    }

    return (
        <div className="cabinet">
            <div id="mainInfo">
                <h1 id="nameInfo">{auth.name}</h1>
                <div id="photo"></div>
                <div id="funcBar">
                    <button id="messenger" onClick={onClickOpenMessenger}>Сообщения</button>
                </div>
            </div>
        </div>
    );
}
export default PersonalCabinet;