let socket=null
function setSocket(){
    socket = new WebSocket('ws://localhost:8084');
    socket.addEventListener('open', (event) => {
        console.log('WebSocket connection opened22222');
    });
}

function getSocket(){
    return socket
}

module.exports={setSocket,getSocket}