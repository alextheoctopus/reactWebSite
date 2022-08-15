import React from "react";
import '../messenger/Messenger.css';
import { useRef, useState } from "react";

const Messenger = ({ socket }) => {
    const [message, setMessage] = useState(null);
    const inputText = useRef(null);
    const onClickSendMessage = () => {
        const messageText = inputText.current.value;
        socket.on("sendMessage", ({ messageText }));
        setMessage(messageText);
    }

    return (
        <div id="messengerForm">
            <div id="chat">
                <input id="messageInput" ref={inputText}></input>
                <button id="sendMessage" onClick={onClickSendMessage}>Отправить</button>
                {message === null ? '' : <h2 id="messageText">{message}</h2>}{/* капец я ленивая... */}
            </div>

        </div>
    )
}
export default Messenger;