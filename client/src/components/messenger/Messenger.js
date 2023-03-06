import React from "react";
import '../messenger/Messenger.css';
import { useRef, useState } from "react";
import UsersBar from "../usersBar/usersBar";

const Messenger = ({ socket, users }) => {
    const [message, setMessage] = useState(null);

    const inputText = useRef(null);
    const onClickSendMessage = () => {
        const messageText = inputText.current.value;
        // socket.emit("sendMessage", ({ messageText }));
        setMessage(messageText);
    }

    return (
        <div id="messengerForm">
            <UsersBar  />
            <div id="chat">
                <input id="messageInput" ref={inputText}></input>
                <button id="sendMessage" onClick={onClickSendMessage}>Отправить</button>
                {message === null ? '' : <h2 id="messageText">{message}</h2>}{/* капец я ленивая... */}
            </div>

        </div>
    )
}
export default Messenger;