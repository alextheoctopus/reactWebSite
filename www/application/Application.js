const USERS = require('./modules/users/Users');
//const DB = require('./modules/DB/DB');

class Application {
    constructor(params, db) {
        this.db = db;
        this.user = new USERS(db);
        this.login = params.login;
        this.password = params.password;
        this.name = params.name;
    }
    registration() {
        if (this.login && this.password && this.name) {
            return this.user.registration(this.login, this.password, this.name);
        }
    }
    loginMethod() {
        if (this.login) {
            return this.user.loginMethod(this.login);
        }
    }
    logoutMethod() {
        if (this.login) {
            return this.user.logoutMethod(this.login); 
        }
    }
}
module.exports = Application;