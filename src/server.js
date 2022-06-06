//import { WebSocketServer } from 'ws';
import SocketIO from 'socket.io';
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
const httpServer = http.createServer(app);
// create WebSocket server and pass "http server"
//const wss = new WebSocketServer({server});
// create SocketIO server
const wsServer = SocketIO(httpServer); 

wsServer.on("connection", (socket) => {
    socket["nickname"] = "Anon"

    socket.onAny((event) => { // init on every event
        console.log(`Socket Event: ${event}`); // name of event
    })
    // able to create own function
    socket.on("enter_room", (roomName, cb) => {
        // no need to parse JSON data
        socket.join(roomName.payload); // create chatting room
        const room_title = roomName.payload;
        setTimeout(() => { cb(room_title); }, 100);

        socket.to(roomName.payload).emit("welcome", socket.nickname); // send message to everybody except for me
    });

    // 방에서 나감
    socket.on("disconnecting", () => {
        socket.rooms.forEach((room) => socket.to(room).emit("bye"), socket.nickname);
    });

    socket.on("new_msg", (msg, room, cb) => {
        socket.to(room).emit("new_msg", `${socket.nickname} : ${msg}`);
        cb();
    });

    socket.on("new_name", (name, cb) => {
        socket["nickname"] = name.payload;
        socket.emit(name.payload);
        cb();
    });
})

/* request connection from front-end
const sockets = [];
wss.on("connection", (socket) => {
    console.log("connected to brower ✅");

    sockets.push(socket);
    socket["nickname"] = "Anon"; // not set a nickname yet!

    socket.on('close', ()=> console.log("disconnected from browser ❌")); // browser kill the connection
    socket.on('message', (msg) => {
        //const msg = isBinary? message: message.toString('utf-8');
        // sending messgae, msg.toString() -> front not BLOB, string

        console.log(msg.toString('utf-8')); // to parse Object
        console.log(JSON.parse(msg)); // js object
        const newData = JSON.parse(msg);

        switch(newData.type) {
            case "new_message" :
                return sockets.forEach(aSocket => aSocket.send(`${socket.nickname} : ${newData.payload}`));
            case "nickname" :
                console.log(newData.payload);
                socket["nickname"] = newData.payload;

                break;
            default :
                break;
        }
        
    });
});     */


// listen
httpServer.listen(3000, handleListen);



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