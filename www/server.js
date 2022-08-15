const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { //сокеты втыкаем в порт бэка
    cors: {
        origin: '*' //делаем разрешение на все кроссдоменные запросы
    },
});

const { NAME, PORT, DATABASE } = require('./config.js');
const DB = require('./application/modules/DB/DB');
const APP = require('./application/Application');
const { Router } = require('express');
const db = new DB();

function router(method, params) {
    const app = new APP(params, db); //в параметрах будет метод + логин + пароль
    if (method) {
        switch (method) {
            case 'registration':
                return app.registration();
            case 'login':
                return app.loginMethod();
            case 'logout':
                 return app.logoutMethod();
        }
    }
}

io.on("connection", (socket) => {
    socket.on('registration', async (params) => {
        let { login, password, name } = params;
        let result = await db.getUser(login);
        if (!result) {
            router('registration', params);
            console.log("Вы зарегистрированы!");
            socket.emit('authAnswer', params);
        } else {
            console.log("Логин занят!");
        }

    });
    socket.on('authorization', async (params) => {
        let result = await db.getUser(params.login);
        if (result.login===params.login&&result.password===params.password) {
            router('login', params);
            socket.emit('authAnswer', result);
        } else {
            console.log("Проверьте правильность введенных данных");
        }
    });
    socket.on('logOut', (login) => {
        router('logout', login);
    })
});



server.listen(PORT, () => console.log('все ок, работаем над', NAME));