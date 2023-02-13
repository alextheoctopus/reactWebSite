import React, { useState } from "react";
import { useEffect } from "react";
import '../usersBar/usersBar.css';


const UsersBar = ({ socket }) => {
    //donloading&updating
   // const [data, setData] = useState(null);
    socket.on("sendDataMessenger", (users) => {
        /* setData(users); */
        console.log(users);
    });
    //useEffect((data) => console.log(data), []);
   /*  let test = [
        {
            user_id: 1, name: 'lala', age: 8
        },
        {
            user_id: 2, name: 'lpla', age: 9
        }
    ] */
    return (
        <>
            {/* {test.map(
                function (item) {
                    return <p key={item.user_id}>
                        <span>{item.name}</span>
                    </p>;
                })
            } */}
            {/* {JSON.stringify(data)} */}
        </>
    );
}
export default UsersBar;