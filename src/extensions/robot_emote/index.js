const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type')
const socket=require('../../util/socket-connect')
class robotemote {

    constructor(runtime){
        this.runtime=runtime


        this.flag='0'
        this.channel = new BroadcastChannel('flag_channel');
        this.channel.addEventListener('message', (event) => {
            console.log('Received flag data:', event.data);
            this.flag=event.data
            // if(event.data=='1'){
            //     eventSource = new EventSource('http://192.168.4.1:8083/stream');
            //     eventSource.onerror = function(error) {
            //         console.error('Error:', error);
            //         eventSource.close();
            //     };
            //     eventSource.onmessage = function(event) {
            //         // output.innerHTML = "Received from server: " + event.data;
            //         // console.log(event.data)
            //         // console.log(Date.now())

            //         scratchGet=JSON.parse(event.data)
                    
            //     };
            // }else if(event.data=='0'){
            //     try{
            //         eventSource.close();
            //     }catch(e){

            //     }
            // }
        });
        this.mode=true
        this.channelMode=new BroadcastChannel('mode')
        this.channelMode.addEventListener('message',(event)=>{
            this.mode=event.data
        })


        this.line;


        this.whatSendFun='net'
        this.channelPort = new BroadcastChannel('channelPort')
        this.channelPort.addEventListener('message',(event)=>{
            console.log(event.data)
            if(event.data){
                this.whatSendFun='port'
            }else{
                this.whatSendFun='net'
            }
            
        })



    }
    getInfo() {
    return {
        id: 'robotemote',
        name: 'emote',
        color1: '#ff1493',
        blocks: [
            {
                opcode: 'showEmote',
                blockType: BlockType.COMMAND,
                text: '显示表情[ONE]',
                arguments:{
                    ONE:{
                        type: ArgumentType.STRING,
                        menu:'SHOW_EMOTE'
                    },
                },
            },


        ],
        menus: {
            SHOW_EMOTE:{
                acceptReporters: false,
                items: [
                    {
                        text: '1',
                        value: '1'
                    },
                    {
                        text: '2',
                        value: '2'
                    },
                    {
                        text: '3',
                        value: '3'
                    },
                    {
                        text: '4',
                        value: '4'
                    },
                    {
                        text: '5',
                        value: '5'
                    }
                    
                ]
            }
        }
  
    };
    }


    showToast(message, duration = 3000) {
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
    async showEmote(args){
            if(this.mode){
    
    
                let jsonData={
                    "command":"display",
                    "params":{
                        "mode":4,
                        "lum":1,
                        "image":[],
                        "var":"",
                        "pos_x":0,
                        "pos_y":0,
                        "num":Number(args.ONE),
                        "way":0
                    }
                }
                // let str = `robot.send_OLED(1,[${hexArr}])\r\r`;
                let str = JSON.stringify(jsonData)
            
                if(this.whatSendFun=='net'){
                    if(socket.checkWebSocketStatus()==4 || socket.checkWebSocketStatus()==0){
                        console.log('断开连接，尝试重连')
                        this.showToast("⚠️ socket断开，尝试重连......");
                        let context=[]
                        context.push(str)
                        await socket.setSocket(context)
                    }else if(socket.checkWebSocketStatus()==2){
                        socket.getSocket().send(str);
                        await new Promise(resolve => setTimeout(resolve, 50));  // 等待1秒
                    }else if(socket.checkWebSocketStatus()==1){
                        this.showToast("⚠️ socket正在连接中，请稍后");
                        this.runtime.stopAll();
                    }
        
                    socket.setLastPostTime(Date.now())
                }else if(this.whatSendFun=='port'){
                    this.channelPort.postMessage(str)
                }
            
                
                
            }
        }

}


module.exports = robotemote;
