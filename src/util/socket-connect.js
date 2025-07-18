let flag=false
let socket=null
let socketRecive=null
let robotMessage=[0,0,0,0,0,0,0,0,0]
let messageTime=Date.now()
let lastPostTime=Date.now()
let ip=''

const formatMessage = require('format-message');


function showToast(message, duration = 3000) {
        // 如果 toast 容器不存在，则创建一个
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            Object.assign(container.style, {
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            });
            document.body.appendChild(container);
        }
    
        // 创建 toast 元素
        const toast = document.createElement('div');
        toast.textContent = message;
    
        // 样式设置
        Object.assign(toast.style, {
            background: '#333',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            opacity: '0',
            transform: 'translateY(-20px)',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
            maxWidth: '300px'
        });
    
        // 添加 toast 到容器
        container.appendChild(toast);
    
        // 强制触发重绘以启用动画
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        });
    
        // 3秒后移除
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                toast.remove();
                // 若容器内无子元素则移除容器
                if (container.children.length === 0) {
                    container.remove();
                }
            }, 300); // 等动画结束
        }, duration);
    }

const reciveChannel = new BroadcastChannel('reciveChannel')
async function setSocket(context){

        console.log('11111')

        // 如果已经存在 WebSocket 连接并且状态是 OPEN，就不再创建新的连接
        if (socket && socket.readyState === WebSocket.OPEN) {
            console.log('WebSocket is already open, using existing connection.');
            return;  // 如果连接已经是 OPEN，直接返回
        }
        if(!ip) return

        socket = new WebSocket(`ws://${ip}:8083`);
        console.log(socket)
        // socket.binaryType = 'arraybuffer';
        socket.addEventListener('open', async (event) => {
            showToast(formatMessage({
                id: 'robot.socket',
                default: 'socket connect success',
                description: 'robot.socket'
            }))
            console.log('WebSocket connection opened');
            // let pass='12345\n'
            // pass=pass.replace(/\n/g, "\r")
            // await socket.send(pass)
            // await new Promise(resolve => setTimeout(resolve, 100));
            if(context.length>0){
                for(let i=0;i<context.length;i++){
                    await socket.send(context[i])
                    await new Promise(resolve => setTimeout(resolve, 50));
                }
            }
        });
        socket.addEventListener('close',(event)=>{
            console.log('socket关闭')
            // alert('互动socket连接关闭,如需互动，请重新连接网络')
        })
        // socket.addEventListener('message', async (event) => {
        //     console.log('-----------:'+event.data)

        // });

   
}
function closeSocket(){
    if(socket){
        socket.close()
    }
}
function getSocket(){
    return socket
}

function checkWebSocketStatus() {
    // console.log(socket.readyState)

    if(!socket){
        return 0
    }else if(socket.readyState==WebSocket.CONNECTING){
        return 1
    }else if(socket.readyState==WebSocket.OPEN){
        return 2
    }else if(socket.readyState==WebSocket.CLOSING){
        return 3
    }else if(socket.readyState==WebSocket.CLOSED){
        return 4
    }
}

function setIp(a){
    ip=a
}

function getIp(){
    return ip
}


//接收信息的socket

async function setSocketRecive(){

    // 如果已经存在 WebSocket 连接并且状态是 OPEN，就不再创建新的连接
    if (socketRecive && socketRecive.readyState === WebSocket.OPEN) {
        console.log('WebSocket is already open, using existing connection.');
        socketRecive.close()
        // return;  // 如果连接已经是 OPEN，直接返回
    }

    socketRecive = new WebSocket(`ws://${ip}:8082`)

    socketRecive.addEventListener('error', async (event) => {
        console.log('connected filed');
        
    });
    // socket.binaryType = 'arraybuffer';
    socketRecive.addEventListener('open', async (event) => {
        console.log('WebSocket connection opened');

        messageTime=Date.now()
        // let pass='12345\n'
        // pass=pass.replace(/\n/g, "\r")
        // await socket.send(pass)
        // await new Promise(resolve => setTimeout(resolve, 100));
        
    });
    socketRecive.addEventListener('message', async (event) => {
        // console.log(event.data[0]);
        // console.log(event.data);
        robotMessage=JSON.parse(event.data)
        // console.log(robotMessage)
        reciveChannel.postMessage(robotMessage)

        messageTime=Date.now()

    });

    socketRecive.addEventListener('close',(event)=>{
        console.log('8082socket关闭')
        // alert('互动socket连接关闭,如需互动，请重新连接网络')
    })


}
function closeSocketRecive(){
    if(socketRecive){
        console.log('关闭了8082端口')
        socketRecive.close()
    }
}
function getSocketRecive(){
    return socketRecive
}

function checkWebSocketStatusRecive() {
    // console.log(socket.readyState)

    if(!socketRecive){
        return 0
    }else if(socketRecive.readyState==WebSocket.CONNECTING){
        return 1
    }else if(socketRecive.readyState==WebSocket.OPEN){
        return 2
    }else if(socketRecive.readyState==WebSocket.CLOSING){
        return 3
    }else if(socketRecive.readyState==WebSocket.CLOSED){
        return 4
    }
}


function getMessage(){
    return robotMessage
}

function getMessageTime(){
    return messageTime
}
function getLastPostTime(){
    return lastPostTime
}

function setLastPostTime(a){
    lastPostTime=a
}
module.exports={setSocket,closeSocket,getSocket,checkWebSocketStatus,getMessage,setSocketRecive,closeSocketRecive,getSocketRecive,checkWebSocketStatusRecive,getMessageTime,getLastPostTime,setLastPostTime,getIp,setIp}