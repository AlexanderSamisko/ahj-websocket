class Handler {
    constructor() {
        this.users = [
            {
                name: "Dima",
                pass: '1234',
                status: 'offline'
            }
        ];

        this.log = [];
    }

    verify(value) {
        let userIndex = this.findUserUserByName(value.name);
        if (userIndex == -1) {
            return "Не верное имя!"
        } else {
            if (this.users[userIndex].pass == value.pass){
                this.users[userIndex].status = "online";
                return "Ok!"
            } else {
                return "Пароль не пароль!"
            }
        }
    }

    registerUser(value) {
        
        let user = {
            name: value.name,
            pass: value.password,
            status: 'online'
        }

        this.users.push(user);
    }

    findUser(value) {

        let id = value.id;
        for(let i = 0; i < this.users.length; i++) {
            if(this.users[i].id == id) {
                return i;
            }
        }
        
    }

    findUserUserByName(username) {
        if (this.users.length > 0) {
            let id = this.users.findIndex( item => item.name == username)
            return id
        } else {
            return -1
        }
    }

    removeUser(value) {
        let id = value.id;
        for(let i = 0; i < this.tickets.length; i++) {
            if(this.users[i].id == id) {
                this.users.splice(i, 1);
            }
        }
    }

    editlog(value) {
        this.log.push(value);
    }

}

module.exports = {
    Handler
}