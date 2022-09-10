import React from "react";
/* import { useEffect, useState } from "react"; */
import '../usersBar/usersBar.css';

const UsersBar = ({ socket }) => {
    socket.on('getUsers',async (params) => { console.log(params); })
    const massive = [1, 2, 3, 4, 5];
    const Numbs = massive.map((number) =>
        <button>{number}</button>
    )

    return (
        <div className="usersBar">
            {Numbs}        </div>
    );
}
export default UsersBar;