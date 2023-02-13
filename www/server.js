const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*' //делаем разрешение на все кроссдоменные запросы
    },
});

const { NAME, PORT } = require('./config.js');
const DB = require('./application/modules/DB/DB');
const APP = require('./application/Application');

const db = new DB();

function router(method, params) {
    const app = new APP(params, db);
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



io.on("connection", async (socket) => {



    socket.on('registration', async (params) => {
        let result = await db.getUser(params.login);

        if (!result) {
            router('registration', params);
            let users = await db.getUsers();
            console.log("Вы зарегистрированы!");
            socket.emit('authAnswer', { params, users });
        } else {
            socket.emit('authAnswer', 'ошибка');
        }

    });
    socket.on('authorization', async (params) => {
        let result = await db.getUser(params.login);
        let users = await db.getUsers();

        if (result && users) {
            if (result.login === params.login && result.password === params.password) {
                router('login', params);
                socket.emit('authAnswer', { result, users });
            }
        }
        else {
            socket.emit('authAnswer', 'ошибка');
        }
    });
    socket.on('logOut', (params) => {
        router('logout', params);
    });

});

server.listen(PORT, () => console.log('сервер работает', NAME));