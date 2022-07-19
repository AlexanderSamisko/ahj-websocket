export default class API {
    constructor(url) {
        this.url = url;
        this.contentTypeHeader = {'Content-Type': 'application/json'};
    }; 
    
    load(){
        return fetch(this.url);
    };
    
    check() {
        return fetch(`${this.url}/users` , {
            method: 'GET',
            headers: this.contentTypeHeader,
        });
    }

    add(user) {
        return fetch(`${this.url}/users`, {
            body: JSON.stringify(user),
            method: 'POST',
            headers: this.contentTypeHeader,
        });
    };

    log(user) {
        return fetch(`${this.url}/login`, {
            body: JSON.stringify(user),
            method: 'POST',
            headers: this.contentTypeHeader,
        });
    };

    sendMessage(data) {
        return fetch(`${this.url}/log`, {
            body: JSON.stringify(data),
            method: 'POST',
            headers: this.contentTypeHeader,
        });
    }
        
    remove(id) {
        return fetch(`${this.url }/${id}`, {method:'DELETE'});
    };
}