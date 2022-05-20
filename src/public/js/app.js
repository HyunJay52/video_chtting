// ws : event + fn
// = btn.addEventListenr('click', fn)
const url = window.location.host;
const socket = new WebSocket(`ws://${url}`);

socket.addEventListener("open", ()=> {
    console.log("connected to Sever ✅")
});
socket.addEventListener("message", (msg) => {
    console.log("message from server 👉 "+ msg.data);
})
socket.addEventListener("close", ()=>{ // server goes offline
    console.log("disconnected from server ❌");
});

setTimeout(() => {
    socket.send("hello from the browser 🤓")
} , 100);