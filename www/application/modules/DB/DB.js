const sqlite3 = require('sqlite3').verbose();
const { resolve } = require('path');
const path = require('path');

class DB {
    constructor() {
        this.db = new sqlite3.Database(path.join(__dirname, 'courseWork.db'));
        this.token;
    }

    destructor() {
        if (this.db) this.db.close();
    }

    generateToken() {
        let token = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < 10; i++)
            token += possible.charAt(Math.floor(Math.random() * possible.length));
        return token;
    }

    registration(login, password, name) {
        let token = this.generateToken();
        const query = "INSERT INTO USERS ( name,token,login, password) VALUES( '" + name + "','" + token + "','" +
            login + "','" + password + "')";

        this.db.run(query);
    }

    logout(login) {
        let token='';
        const query = " UPDATE USERS SET token ='" + token + "' WHERE login='" + login + "'";
        this.db.run(query);
        console.log('hehe');
    }

    getUser(login) {
        const query = "SELECT name, token, login, password FROM USERS WHERE login='" + login + "';";
        return new Promise(resolve => this.db.get(query, (err, row) => resolve(err ? null : row)));
    }
    updateToken(login) {
        let token = this.generateToken();
        const query = "UPDATE USERS SET token ='" + token + "' WHERE login='" + login + "'";
        this.db.run(query);
    }
}

module.exports = DB;