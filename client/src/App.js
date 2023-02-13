import React, { useState } from "react";
import { io } from 'socket.io-client';
import { connect } from 'react-redux';

import Header from './components/header/Header';
import Main from './components/main/Main';
import Reg from "./components/reg/Reg";
import Auth from "./components/auth/Auth";
import PersonalCabinet from "./components/PersonalCabinet/PersonalCabinet";
import Messenger from "./components/messenger/Messenger";
import Err from "./components/error/Err";

/* const socket = io('http://192.168.0.107:3003'); */
const socket = io('http://localhost:3003');

socket.on("connect", /* async */ () => {
  console.log('22');
  /* let users = await db.getUsers();
  socket.emit("sendDataMessenger", users); */
}); 
const mapStateToProps = (state) => {
  const { auth } = state;
  return { auth };
}

const App = ({ auth }) => {

  const [showForm, setShowForm] = useState(null);
  const [openMessenger, setOpenMessenger] = useState(false);
  const [err, setErr] = useState(null);
  const [users, setUsers] = useState({});
  return (
    <>
      <Header socket={socket} auth={auth} setShowForm={setShowForm} setOpenMessenger={setOpenMessenger} setErr={setErr} />
      <Main />
      {
        showForm === null ? '' :
          showForm === 'auth' ? <Auth socket={socket} setShowForm={setShowForm} setUsers={setUsers} setErr={setErr} /> :
            showForm === 'reg' ? <Reg socket={socket} setShowForm={setShowForm} setUsers={setUsers} setErr={setErr} /> : ''}
      {localStorage.getItem('enter') === 'entered' ? <PersonalCabinet auth={auth} setOpenMessenger={setOpenMessenger} /> : ''}
      {openMessenger === true ? <Messenger socket={socket} users={users} /> : ''}
      {err === 'notFinded' ? <Err info={'Введён неверный логин или пароль!'} /> :
        err === 'loginIsBusy' ? <Err info={'Логин занят!'} /> : ''}
    </>

  )
}

export default connect(mapStateToProps)(App);