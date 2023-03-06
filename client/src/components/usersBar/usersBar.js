import React, { useState } from "react";
import { useEffect } from "react";
import '../usersBar/usersBar.css';


const UsersBar = () => {
    const [users, setUsers] = useState(null);
    useEffect(() => {
        let fetchData = async () => {
            const response = await fetch('http://192.168.0.107:3003/api/users');
            const answer = await response.json();
            setUsers(answer);
        }
        fetchData();
    },[]);

    return (
        <>
            {users != null ? users.map(
                function (item) {
                    return <p key={item.user_id}>
                        <span>{item.name}</span>
                    </p>;
                }) : 'не работает'
            }

        </>
    );
}
export default UsersBar;