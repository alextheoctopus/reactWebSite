class Users {
    constructor(db) {
        this.db = db;
    }
    async loginMethod(login) {
        let user = await this.db.getUser(login);
        if (user) {
            this.db.updateToken(user.login);
        }
    }

    async logoutMethod(login) {
        let user = await this.db.logout(login);
        if (user) {
            console.log('Вы успешно вышли');
        }
    }
    registration(login, password, name) {
        let user = this.db.registration(login, password, name);
        if (user) {
            console.log('Вы успешно зарегистрированы');
        }
    }
}
module.exports = Users;