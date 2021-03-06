
import API from "./API";

export default class ChatCreater {
    constructor(url) {
        this.url = url;
        this.api = new API(this.url);
        this.socket = new WebSocket("ws://localhost:7070");
        this.listeners();
        this.user = null;
    }

    listeners() {
        this.socket.addEventListener( 'message', (msg) => {
            let data = JSON.parse(msg.data);
            console.log(data);
            if (data.case == "onLogin") {
                const chatUsersBlock = document.querySelector('.chat-users-block');
                let users = [...chatUsersBlock.querySelectorAll(".user-card")];
                if (users.length > 0) users.forEach( item => item.remove());

                const chatWindow = document.querySelector(".chat-window");
                let messages = [...chatWindow.querySelectorAll(".message-body")];
                if (messages.length > 0) messages.forEach( item => item.remove());

                data.users.forEach( item => this.renderUser(item));
                
                if( data.log.length > 0) {
                    data.log.forEach( item => this.renderLog(item, this.user));
                } 

            } else if (data.case == "onChatMessage") {
                const chatWindow = document.querySelector(".chat-window");
                let messages = [...chatWindow.querySelectorAll(".message-body")];

                if (messages.length > 0) messages.forEach( item => item.remove());

                if( data.log.length > 0) {
                    data.log.forEach( item => this.renderLog(item, this.user));
                } 
            } else if (data.case == "onLogOut") {
                const chatUsersBlock = document.querySelector('.chat-users-block');
                let users = [...chatUsersBlock.querySelectorAll(".user-card")];
                if (users.length > 0) users.forEach( item => item.remove());
                data.users.forEach( item => this.renderUser(item));
            }
            
        }
        )
    }
    
    IntroWidget() {
        const desk = document.querySelector('.desk');

        const introWidget = document.createElement('div');
        introWidget.classList = 'intro-widget';
        introWidget.style.position = 'absolute';
        desk.append(introWidget);

        const introTitle = document.createElement('header');
        introTitle.classList = 'intro-title';
        introTitle.textContent = '???????? ????????????????????, ????????????!';
        introWidget.append(introTitle);

        const introContent = document.createElement('div');
        introContent.classList = 'intro-content';
        introWidget.append(introContent);

        const introSelectSignIn = document.createElement('div');
        introSelectSignIn.classList = 'intro-select signin';
        introSelectSignIn.textContent = '???????? ????????????????????!';
        introContent.append(introSelectSignIn);
       

        const introSelectLogIn = document.createElement('div');
        introSelectLogIn.classList = 'intro-select login';
        introSelectLogIn.textContent = '?? ??????????????, ?????? ????????????????, ??????-???? ?? ??????!';
        introContent.append(introSelectLogIn);

        const introFormSpace = document.createElement('div');
        introFormSpace.className = 'intro-form-space';
        introWidget.append(introFormSpace);
        introSelectSignIn.addEventListener('click', this.showRegformListener.bind(this));

        introSelectLogIn.addEventListener('click', ()=> {
            this.logForm();
            introFormSpace.style.backgroundColor = "white";
        })

    }

    showRegformListener() {
        this.regForm();
        let introFormSpace = document.querySelector('.intro-form-space');
        introFormSpace.style.backgroundColor = "white";
        let introSelectSignIn = document.querySelector('.signin');
        introSelectSignIn.removeEventListener('click', this.showRegformListener.bind(this));
    }

    logForm() {
        const formSpace = document.querySelector(".intro-form-space");

        const logFormBlock = document.createElement("div");
        logFormBlock.className = 'log-form-block';
        formSpace.append(logFormBlock);

        const logForm = document.createElement("form");
        logForm.className = 'log-form';
        logFormBlock.append(logForm);

        const logLabelName = document.createElement("label");
        logLabelName.className = 'log-label';
        logLabelName.setAttribute(`to`, `input-name`);
        logLabelName.textContent = '?????? ?????? ?????????';
        logForm.append(logLabelName);

        const logInputName = document.createElement("input");
        logInputName.setAttribute(`name`, `input-name`);
        logInputName.className = 'log-input';
        logForm.append(logInputName);

        const logLabelPass = document.createElement("label");
        logLabelPass.className = 'log-label';
        logLabelPass.setAttribute(`to`, `input-pass`);
        logLabelPass.textContent = '?????? ?? ???????????? ??????????? ???? ??????... ????????????!';
        logForm.append(logLabelPass);

        const logInputPass = document.createElement("input");
        logInputPass.setAttribute(`name`, `input-pass`);
        logInputPass.className = 'log-input';
        logForm.append(logInputPass);

        const logButton = document.createElement("button");
        logButton.className = 'log-button';
        logButton.textContent = '??????????????!'
        logForm.append(logButton);

        logButton.addEventListener('click', async (evt) => {
            evt.preventDefault();
            let user = {
                name: logInputName.value,
                pass: logInputPass.value
            };

            let response = await this.api.log(user);
            let data = await response.json();
            console.log(data);
            
            if (data.key == "???? ???????????? ??????!") {
                this.showNote("???? ???????????? ??????!");
                let introWidget = document.querySelector('.intro-widget');
                introWidget.remove();
            } else if (data.key == "???????????? ???? ????????????!") {
                this.showNote("???????????? ???? ????????????!");
                let introWidget = document.querySelector('.intro-widget');
                introWidget.remove();
            } else if (data.key == "Ok!") {
                this.user = logInputName.value;
                this.showChat(logInputName.value);
                let introWidget = document.querySelector('.intro-widget');
                introWidget.remove();

                if (this.socket.readyState === WebSocket.OPEN) {
                    this.socket.send(
                        JSON.stringify(
                            {
                                case: 'login',
                                name: logInputName.value
                            }));
                } else { 
                    this.socket = new WebSocket("ws://localhost:7070");
                }
                
            }               
        })
    }
    regForm() {
        const formSpace = document.querySelector(".intro-form-space");
        
        const regFormBlock = document.createElement("div");
        regFormBlock.className = 'reg-form-block';
        formSpace.append(regFormBlock);

        const regForm = document.createElement("form");
        regForm.className = 'reg-form';
        regFormBlock.append(regForm);

        const regLabelName = document.createElement("label");
        regLabelName.className = 'reg-label';
        regLabelName.textContent = '???????????? ??????!';
        regForm.append(regLabelName);

        const regInputName = document.createElement("input");
        regInputName.className = 'reg-input';
        regLabelName.append(regInputName);

        const regLabelPass = document.createElement("label");
        regLabelPass.className = 'reg-label';
        regLabelPass.textContent = '???????????????? ????????????!';
        regForm.append(regLabelPass);

        const regInputPass = document.createElement("input");
        regInputPass.className = 'reg-input';
        regLabelPass.append(regInputPass);

        const regButton = document.createElement("button");
        regButton.className = 'reg-button';
        regButton.textContent = '??????????????!'
        regForm.append(regButton);

        regButton.addEventListener('click', async (evt) => {
            evt.preventDefault();
            let response = await this.api.check();
            let data = await response.json();
            let index = await data.findIndex( item => item.name == regInputName.value);
            if (index == -1) {
                let response = await this.api.add({
                    name: regInputName.value,
                    password: regInputPass.value
                });
                let data = await response.json();
                if (data.ok == "ok") {
                    this.user = regInputName.value;
                    this.showChat(regInputName.value);
                    let introWidget = document.querySelector('.intro-widget');
                    introWidget.remove();

                    if (this.socket.readyState === WebSocket.OPEN) {
                        this.socket.send(
                            JSON.stringify(
                                {
                                    case: 'regIn',
                                    name: regInputName.value
                                }));
                    } else { 
                        this.socket = new WebSocket("ws://localhost:7070");
                    }
                }
            } else {
                this.showNote("?????? ?????? ????????????!");
                let introWidget = document.querySelector('.intro-widget');
                introWidget.remove();
            }
        })
    }

    renderUser(value) {
        const chatUsersBlock = document.querySelector('.chat-users-block');

        const userCard = document.createElement('div');
        userCard.className = "user-card";
        chatUsersBlock.append(userCard);

        const userStatusDot = document.createElement('div');
        userStatusDot.className = "user-status-dot";
        userStatusDot.setAttribute('data-status', `${value.status}`);
        userCard.append(userStatusDot);

        const userCardName = document.createElement('p');
        userCardName.className = "user-card-name";
        userCardName.textContent = value.name;
        userCard.append(userCardName);

    }


    showChat(userName) {

        const desk = document.querySelector(".desk");

        const chatDesk = document.createElement("div");
        chatDesk.className = "chat-desk";
        desk.append(chatDesk);

        const chatTitle = document.createElement("header");
        chatTitle.className = "chat-title";
        chatTitle.textContent = "?? ?????? ?? ?????? ??????????, ???????????????? ???????? ?????? ????????!";
        chatDesk.append(chatTitle);

        const middleWrapper = document.createElement("div");
        middleWrapper.className = "middle-wrapper";
        chatDesk.append(middleWrapper);

        const chatUsersBlock = document.createElement("div");
        chatUsersBlock.className = "chat-users-block";
        middleWrapper.append(chatUsersBlock);

        const chatWidget = document.createElement("div");
        chatWidget.className = "chat-widget";
        middleWrapper.append(chatWidget);

        const chatWindow = document.createElement("div");
        chatWindow.className = "chat-window";
        chatWidget.append(chatWindow);

        const chatInputBlock = document.createElement("div");
        chatInputBlock.className = "chat-input-block";
        chatWidget.append(chatInputBlock);
       
        const chatInput =  document.createElement("input");
        chatInput.className = "chat-input";
        chatInput.setAttribute("placeholder", "Type your message here...");
        chatInput.setAttribute("type", "text");
        chatInputBlock.append(chatInput);

        chatInput.addEventListener('keyup', async (evt)=> {
            if(evt.key === "Enter") {

                let date = new Date();
                let dataString = date.toString();
                let dataArr = dataString.split('GMT');
                let messageDate = dataArr[0];

                if (this.socket.readyState === WebSocket.OPEN) {
                    this.socket.send(
                        JSON.stringify(
                            {
                                case: 'ChatMessage',
                                date: messageDate,
                                name: userName,
                                message: chatInput.value
                            }));
                } else { 
                    this.socket = new WebSocket("ws://localhost:7070");
                }

                chatInput.value = "";
            }
        })
    } 

    renderLog(item, userName){

        const chatWindow = document.querySelector(".chat-window");

        const messageBody = document.createElement('article');
        messageBody.className = "message-body";
        chatWindow.append(messageBody);

        const messageHeader = document.createElement('header');
        messageHeader.className = "message-header";
        messageBody.append(messageHeader);

        const messageAuthor = document.createElement('p');
        messageAuthor.className = "message-author";
        if (item.name == userName) {
            messageAuthor.textContent = 'You';
            messageBody.setAttribute("data-author", "you");
        } else {
            messageAuthor.textContent = item.name;
            messageBody.setAttribute("data-author", `${item.name}`);
        }
        messageHeader.append(messageAuthor);

        const messageDate = document.createElement('p');
        messageDate.className = "message-date";
        messageDate.textContent = item.date;
        messageHeader.append(messageDate);

        const messageContent = document.createElement('p');
        messageContent.className = "message-content";
        messageContent.textContent = item.message;
        messageBody.append(messageContent);
    }


    showNote(value) {
        const desk = document.querySelector(`.desk`);

        const note = document.createElement(`div`);
        note.className = "note";

        desk.append(note);

        const noteTitle = document.createElement(`header`);
        noteTitle.className = "note-title";
        if (value == "?????? ?????? ????????????!"){
            noteTitle.textContent = "??????-???? ?????? ?????????????????? ???? ??????(??) ?????? ?? ????... ???? ???????? (??????????????)"; 
        } else if (value == "???? ???????????? ??????!") {
            noteTitle.textContent = "???? ????, ?????????? ???????????? ???? ????????????? ?????? ?????? ?????????????????"; 
        } else if (value == "???????????? ???? ????????????!") {
            noteTitle.textContent = "??????, ?????? ???? ????????????! ?? '??????????????'... ???????????????? ???????? ???? ????????????!"; 
        }
        
        note.append(noteTitle);

        const noteBody = document.createElement(`div`);
        noteBody.className = "note-body";
        note.append(noteBody);

        const noteContent = document.createElement(`p`);
        noteContent.className = "note-content";
        if (value == "?????? ?????? ????????????!"){
            noteContent.textContent = "??????????, ?????????? ?????????????? ???????????? ??????!";
        } else if (value == "???? ???????????? ??????!") {
            noteContent.textContent = "?????????? ???????????? ????????????, ?????? ???????????????????? ?? ???????????????";
        } else if (value == "???????????? ???? ????????????!") {
            noteContent.textContent = "????????... ?????????????? ???????????? ??????????????... ??????, ?????????????";
        }
        
        noteBody.append(noteContent);

        const noteButtonBlock = document.createElement(`div`);
        noteButtonBlock.className = "note-body";
        noteBody.append(noteButtonBlock);

        const noteButtonOk = document.createElement(`div`);
        noteButtonOk.className = "note-button";
        if (value == "?????? ?????? ????????????!"){
            noteButtonOk.textContent = "?????????????? ???????????? ??????";
        } else if (value == "???? ???????????? ??????!") {
            noteButtonOk.textContent = "?????????????????????? ?? ??????????????... ?????? ???? ????????????.";
        } else if (value == "???????????? ???? ????????????!") {
            noteButtonOk.textContent = "???????????????????? ????????????...";
        }
        
        noteButtonBlock.append(noteButtonOk);
        noteButtonOk.addEventListener(`click`, (evt)=> {
            this.IntroWidget();

            if (value == "?????? ?????? ????????????!"){
                this.regForm();
            } else if (value == "???? ???????????? ??????!") {
                this.logForm();
            } else if (value == "???????????? ???? ????????????!") {
                this.logForm();
            }

            const introFormSpace = document.querySelector('.intro-form-space');
            introFormSpace.style.backgroundColor = "white";
            note.remove();
        })

        const noteButtonNo = document.createElement(`div`);
        noteButtonNo.className = "note-button";

        if (value == "?????? ?????? ????????????!"){
            noteButtonNo.textContent = "?????????? ?????????? ?????? ?????????? ??????????. ???????????????? ?????? ??????????????";
        } else if (value == "???? ???????????? ??????!") {
            noteButtonNo.textContent = "???????? ???? ??????????????? ???? ????????????... ???? ??????!";
        } else if (value == "???????????? ???? ????????????!") {
            noteButtonNo.textContent = "?????????? ???????????? ??????????????... ???? ?????? ?????? ????????.";
        }

        noteButtonBlock.append(noteButtonNo);
        noteButtonNo.addEventListener(`click`, (evt) => {
            desk.querySelector(".desk-chat-invite").style.display = "block";
            desk.querySelector(".desk-chat-invite").textContent = "????, ??????????... ????????????????????!";
            note.remove();
        })
    }
} 