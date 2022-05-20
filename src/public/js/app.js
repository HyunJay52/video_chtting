console.log("!!!!!!!!!boo ya!");

// ws : event + fn
// = btn.addEventListenr('click', fn)
const url = window.location.host;
const socket = new WebSocket(`ws://${url}`);
socket.send("hello ~ ");