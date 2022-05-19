import express from 'express';

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + "/views");

//static setting
app.use("/public", express.static(__dirname+"/public"));

// home router
app.get("/", (req, res) => {
    res.render("home");
});
app.get("/*", (req, res) => {
    res.redirect("/");
}); //catch all

const handleListen = () => console.log(`listening on http://localhost:3000`);

app.listen(3000, handleListen);

//
const livereload = require('livereload');
const connectLiveReload = require('connect-livereload');

const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", ()=> {
    setTimeout(()=>{
        liveReloadServer.refresh("/");
    }, 100);
});
app.use(connectLiveReload);