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

    const input = room.querySelector("input");
    const msg = input.value;
    socket.emit("new_msg", input.value, roomName, () => {
        addMessage(`Me : ${msg}`);
        //input.value = "";
    });
    input.value = "";
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

        const msg_form = room.querySelector("form");

        msg_form.addEventListener("submit", handleMessageSubmit);
    });
    roomName = input.value;
    input.value = ""
})


// callback이 아니라 바로 실행 ? socket.on("welcome", addMessage("someone jsut joined!"));
socket.on("welcome", () => {
    addMessage("someone jsut joined!");
});

socket.on("bye", () => {
    addMessage("someone just left...🥲");
})

socket.on("new_msg", (msg) => {
    addMessage(msg);
})