const socket = io(); // running socket io, connect front and back

const welcome = document.getElementById("welcome")
const form = welcome.querySelector("form")

const room = document.getElementById("room")

room.hidden = true

function addMessage(msg) {
    const ul = room.querySelector("ul");
    const li = document.createElement("li");

    li.innerText = msg;

    ul.appendChild(li);
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
    });

    input.value = ""
})


// callback이 아니라 바로 실행 ? socket.on("welcome", addMessage("someone jsut joined!"));
socket.on("welcome", () => {
    addMessage("someone jsut joined!")
});