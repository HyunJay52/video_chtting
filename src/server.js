import { WebSocketServer } from 'ws';
import http from 'http';
import express from 'express'; // http

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + "/views");

//static setting
app.use("/public", express.static(__dirname+"/public"));

// home router
app.get("/", (req, res) => {res.render("home");});
app.get("/*", (req, res) => {res.redirect("/");}); //catch all

const handleListen = () => console.log(`listening on ws and http://localhost:3000`);
// app.listen(3000, handleListen); only listen http

// create sever by using express app -> http
const server = http.createServer(app);
// create WebSocket server and pass "http server"
const wss = new WebSocketServer({server});

const sockets = [];

// request connection from front-end
wss.on("connection", (socket) => {
    console.log("connected to brower ✅");

    sockets.push(socket);

    socket.on('close', ()=> console.log("disconnected from browser ❌")); // browser kill the connection
    socket.on('message', (message) => {
        //const msg = isBinary? message: message.toString('utf-8');
        // sending messgae, msg.toString() -> front not BLOB, string
        sockets.forEach(aSocket => aSocket.send(message.toString('utf-8')));
    });
});


// listen
server.listen(3000, handleListen);



// front live-reload setting
const livereload = require('livereload');
const connectLiveReload = require('connect-livereload');

const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", ()=> {
    setTimeout(()=>{
        liveReloadServer.refresh("/");
    }, 100);
});
app.use(connectLiveReload);