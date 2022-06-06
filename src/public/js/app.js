const socket = io(); // running socket io, connect front and back

const welcome = document.getElementById("welcome")
const form = welcome.querySelector("form")

const room = document.getElementById("room")
room.hidden = true

let roomName;

function addMessage(msg) {
    const ul = room.querySelector("ul");
    const li = document.createElement("li");

    li.innerText = msg;

    ul.appendChild(li);
}

function handleMessageSubmit(event) {
    event.preventDefault();

    const input = room.querySelector("#msg input");
    const msg = input.value;
    socket.emit("new_msg", input.value, roomName, () => {
        addMessage(`Me : ${msg}`);
        //input.value = "";
    });
    input.value = "";
}
function handleNameSubmit(event) {
    event.preventDefault();

    const input = room.querySelector("#name input");
    const name = input.value;

    socket.emit("new_name", {payload: name}, () => {
        console.log("set a nickname!");
    });
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = form.querySelector("input")
    //    send ftn to server

    socket.emit("enter_room", {payload: input.value}, (roomName) => {
                            // args : event name, arg, cb, ... able to toss a lot of info to server
        console.log("server is done");

        const room_title = room.querySelector("span");
        room_title.innerText = `Room 👉 ${roomName}`;
        welcome.hidden = true;
        room.hidden = false;

        const msg_form = room.querySelector("#msg");
        const name_form = room.querySelector('#name');

        msg_form.addEventListener("submit", handleMessageSubmit);
        name_form.addEventListener("submit", handleNameSubmit);
    });
    roomName = input.value;
    input.value = ""
})


// callback이 아니라 바로 실행 ? socket.on("welcome", addMessage("someone jsut joined!"));
socket.on("welcome", (user) => {
    addMessage(`${user} just joined ! 🆕`);
});

socket.on("bye", (left) => {
    addMessage(`${left} just left 👋`);
})

socket.on("new_msg", (msg) => {
    addMessage(msg);
})