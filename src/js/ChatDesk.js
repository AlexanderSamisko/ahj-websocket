import ChatCreater from "./ChatCreater";


export default class Desk {
    constructor() {
        this.createDesk();
        this.chatCreater = new ChatCreater(`http://localhost:7070`);
    }

    createDesk() {
        const body = document.querySelector(`body`);
        
        const desk = document.createElement(`div`);
        desk.className = "desk";
        body.append(desk);

        const deskHeader = document.createElement(`header`);
        deskHeader.className = "desk-header";
        desk.append(deskHeader);

        const deskHeaderDotFirst = document.createElement(`div`);
        deskHeaderDotFirst.className = "desk-header-dot";
        deskHeader.append(deskHeaderDotFirst);

        const deskHeaderDotSecond = document.createElement(`div`);
        deskHeaderDotSecond.className = "desk-header-dot";
        deskHeader.append(deskHeaderDotSecond);

        const deskHeaderDotThird = document.createElement(`div`);
        deskHeaderDotThird.className = "desk-header-dot";
        deskHeader.append(deskHeaderDotThird);

        const deskInfo = document.createElement(`p`);
        deskInfo.className = "desk-info";
        deskInfo.textContent = "Easy-mood 4at 0n!"
        deskHeader.append(deskInfo);

        const deskBody = document.createElement(`div`);
        deskBody.className = "desk-body";
        desk.append(deskBody);
        
        
        const deskChatInvite = document.createElement(`div`);
        deskChatInvite.className = "desk-chat-invite";
        deskChatInvite.textContent = "Войти в чат";
        deskBody.append(deskChatInvite);
        deskChatInvite.addEventListener(`click`, (evt)=> {
            this.chatCreater.IntroWidget();
            evt.target.style.display = "none";
        })

    }
}