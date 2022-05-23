const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#msg");

// ws : event + fn
// = btn.addEventListenr('click', fn)
const url = window.location.host;
const socket = new WebSocket(`ws://${url}`);

socket.addEventListener("open", ()=> {
    console.log("connected to Sever ✅")
});
socket.addEventListener("message", async (msg) => {
    // if(typeof msg.data === 'string') {
    //     console.log("message from server 👉 ", msg.data);      
    // }else {
    //     const serverMsg = await msg.data.text();
    //     console.log("message from server 👉 ", serverMsg);
    // }

    // print message
    const li = document.createElement("li");
    li.innerText = msg.data;

    messageList.append(li);
})
socket.addEventListener("close", ()=>{ // server goes offline
    console.log("disconnected from server ❌");
});


function sendData(type, payload) {
    const newData = {type, payload};
    return JSON.stringify(newData); // do not send object to server, socekt = brower api
}

nickForm.addEventListener("submit", (event) =>{
    event.preventDefault();
    const input = nickForm.querySelector("input");

    socket.send(sendData("nickname", input.value));
    
    input.value = "";
});
messageForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = messageForm.querySelector("input");

    socket.send(sendData("new_message", input.value));

    input.value = "";    
})