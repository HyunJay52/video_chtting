const messageList = document.querySelector("ul");
const messageForm = document.querySelector("form");

// ws : event + fn
// = btn.addEventListenr('click', fn)
const url = window.location.host;
const socket = new WebSocket(`ws://${url}`);

socket.addEventListener("open", ()=> {
    console.log("connected to Sever ✅")
});
socket.addEventListener("message", async (msg) => {
    if(typeof msg.data === 'string') {
        console.log("message from server 👉 "+ msg.data);      
    }else {
        const serverMsg = await msg.text();
        console.log("message from server 👉 "+ serverMsg);
    }
})
socket.addEventListener("close", ()=>{ // server goes offline
    console.log("disconnected from server ❌");
});





messageForm.addEventListener("submit", (event)=> {
    event.preventDefault();
    const input = messageForm.querySelector("input");

    socket.send(input.value);

    input.value = "";    
})