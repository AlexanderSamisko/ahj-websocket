const { Handler } = require('./Handler');

const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const cors = require('koa2-cors');
const app = new Koa();
const handler = new Handler();
const Router = require(`koa-router`);
const router = new Router;
const WS = require('ws');

const port = process.env.PORT||7070;
const server = http.createServer(app.callback());
const wss = new WS.Server({server});

app.use( koaBody({
    urlencoded: true,
    multipart: true,
    json: true,
}));

app.use(cors({
  origin: "*",
  exposeHeaders: ['application/json'],
  maxAge: 5000,
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type'],
}));

app.use( async(ctx,next) => {
    const origin = ctx.request.get('Origin');
    if(!origin){ 
        return await next();
    } 
    const headers = {'Access-Control-Allow-Origin':'*',};
    
    if( ctx.request.method !== 'OPTIONS'){
        ctx.response.set({...headers});
        try{
            return await next();
        } catch(e){
            e.headers = {...e.headers,...headers};
            throw e;
        }
    } 
    
    if(ctx.request.get('Access-Control-Request-Method')){
        ctx.response.set( {
            ...headers,
            'Access-Control-Allow-Methods':'GET, POST, PUT, DELETE, PATCH',
        });
        
        if(ctx.request.get('Access-Control-Request-Headers')){
            ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Allow-Request-Headers'));
        } 

        ctx.response.status = 204;
    }
});


router.get('/users', async(ctx, next) => {

    ctx.response.body = handler.users;   
});

router.post('/users', async(ctx, next) => {
    handler.registerUser(ctx.request.body);
    
    ctx.response.body = {
        ok: 'ok'
    }
});

router.post('/log', async(ctx, next) => {

    handler.editlog(ctx.request.body);
    ctx.response.body = handler.log;
});

router.post('/login', async(ctx, next) => {
    console.log(`вход фетч: ${JSON.stringify(ctx.request.body)}`);
    let existence = handler.verify(ctx.request.body);
    if (existence == "Не верное имя!") {
        ctx.response.body = {
            key: "Не верное имя!",
        }
    } else if (existence == "Пароль не пароль!") {
        ctx.response.body = {
            key: "Пароль не пароль!",
        }
    } else {
        ctx.response.body = {
            key: "Ok!"
        }
    }
});

wss.on('connection', (ws, req) =>{
    
    let pairs = new Map();
    
    ws.addEventListener('message', msg => {

        let data = JSON.parse(msg.data);
        console.log(data);
        if (data.case == "login") {

            pairs.set(ws, data.name);

            let userIndex = handler.findUserUserByName(data.name);
            if (userIndex !== -1) {


                Array.from(wss.clients)
                    .filter(o => o.readyState === WS.OPEN)
                    .forEach( o => o.send(JSON.stringify({
                        case: "onLogin",
                        users: handler.users,
                        log: handler.log
                    })));

            } else {
                ws.close([1006], ["Такого пользователя нет"]);
            }
        } else if (data.case == "regIn") {

            pairs.set(ws, data.name);


            Array.from(wss.clients)
                .filter(o => o.readyState === WS.OPEN)
                .forEach( o => o.send(JSON.stringify({
                    case: "onLogin",
                    users: handler.users,
                    log: handler.log
                })));
            // }
        } else if (data.case == "ChatMessage") {

            let userIndex = handler.findUserUserByName(data.name);
            if (userIndex !== -1) {

                handler.editlog({
                    name: data.name,
                    date: data.date,
                    message: data.message
                });

                Array.from(wss.clients)
                    .filter(o => o.readyState === WS.OPEN)
                    .forEach( o => o.send(JSON.stringify({
                        case: "onChatMessage",
                        log: handler.log
                    })));
            } else {
                ws.close([1006], ["Такого пользователя нет"]);
            }
        }
        
        ws.on('close', ()=> {
            
            let name = pairs.get(ws);

            let userIndex = handler.findUserUserByName(name);

            handler.users[userIndex].status = 'offline';

                Array.from(wss.clients)
                    .filter(o => o.readyState === WS.OPEN)
                    .forEach( o => o.send(JSON.stringify({
                        case: "onLogOut",
                        users: handler.users
                    })));
            }
        )
    });

});
    
app.use(router.routes());
app.use(router.allowedMethods());

server.listen(port);