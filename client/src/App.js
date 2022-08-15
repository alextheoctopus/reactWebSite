import React, { useState } from "react";
import { io } from 'socket.io-client';

import Header from './components/header/Header';
import Main from './components/main/Main';
import Reg from "./components/reg/Reg";
import Auth from "./components/auth/Auth";
import PersonalCabinet from "./components/PersonalCabinet/PersonalCabinet";
import Messenger from "./components/messenger/Messenger";

const socket = io('http://localhost:3003');

const App = () => {
/*   const [session, setSession] = useState(null); */
  socket.on('authAnswer', (userData) => {
    setUserData(userData);
    /* setSession(localStorage.setItem('login', userData.login));//короче не знаю */
  });


  const [showForm, setShowForm] = useState(null);
  const [authorized, setAuthorized] = useState(false);
  const [userData, setUserData] = useState(null);
  const [openMessenger, setOpenMessenger] = useState(false);



  return (
    <>
      <Header socket={socket} setAuthorized={setAuthorized} setShowForm={setShowForm} authorized={authorized} userData={userData} />
      <Main />
      {
        showForm === null ? '' :
          showForm === 'auth' ? <Auth socket={socket} key={authorized} setAuthorized={setAuthorized} setShowForm={setShowForm} /> :
            showForm === 'reg' ? <Reg socket={socket} key={authorized} setAuthorized={setAuthorized} setShowForm={setShowForm} /> :
              showForm === 'cabinet' ? <PersonalCabinet userData={userData} setOpenMessenger={setOpenMessenger} /> : ''}
      {
        openMessenger === true ? <Messenger socket={socket}/> : ''}
    </>
  )
}
export default App;