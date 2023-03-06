const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*' //делаем разрешение на все кроссдоменные запросы
    },
});

const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions))

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

/* app.get('/api/check', (req, res) => {
    res.send('ok');
});

app.get('/api/example', (req, res) => {
    console.log(req.query);
    const text = Object.keys(req.query).map(key => `key=${key} value= ${req.query[key]}`).join('; ');
    res.send(text);
}); */


app.get('/api/users', async (req, res) => {
    let users = await db.getUsers();
    res.json(users);
});

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
                //io.emit("sendDataMessenger", { data: users });//всем клиентам 
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