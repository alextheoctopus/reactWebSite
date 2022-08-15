import './PersonalCabinet.css';
const PersonalCabinet = ({ setOpenMessenger, userData }) => {
    if (userData) { var { name,token, login, password } = userData; }
    const onClickOpenMessenger = () => {
        setOpenMessenger(true);
    }
    return (
        <div className="cabinet">
            <div id="mainInfo">
                <h1 id="nameInfo">{name}</h1>
                <div id="photo"></div>
                <div id="funcBar">
                    <button id="messenger" onClick={onClickOpenMessenger}>Сообщения</button>
                </div>
            </div>
        </div>
    );
}
export default PersonalCabinet;