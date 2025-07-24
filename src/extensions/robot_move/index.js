const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type')
const socket=require('../../util/socket-connect')
const BLE = require('../../io/ble');
const moveIcon = require('./move.svg')
const formatMessage = require('format-message');

const innerIcon = require('./innerMove.svg')

const currentMode = require('../../util/mode')

let preMove='-1'
let preTime=Date.now()
let currentController = null;
let firstTime
let NUM=0
let lastTime

let preL;
let preR;

let preCatch='-1'
let preFortTime=Date.now()
let preDisTime=Date.now()
// let lastPostTime=Date.now()

//  // 创建 WebSocket 连接
//  const socket1 = new WebSocket('ws://' + '192.168.4.1' + ':80');

//  socket1.onopen = function() {
//      console.log("WebSocket connected");
//  };

//  socket1.onmessage = function(event) {
//      // 当接收到消息时更新页面内容
//      console.log(event.data)
//  };

//  socket1.onerror = function(error) {
//      console.error("WebSocket Error:", error);
//  };

//  socket1.onclose = function() {
//      console.log("WebSocket closed");
//  };

// window.addEventListener('keydown', (event) => {
//     socket1.send(event.key)
// })

class RobotMove {
    constructor(runtime){
        this.runtime=runtime

        // this.runtime.on('PROJECT_STOP_ALL', () => {
        //     alert("Scratch 项目停止，清理 WiFi 连接...");
        //     // 这里可以调用 WiFi 断开函数
        // });

        // console.log(this.runtime)
        // this.runtime.on('RUNTIME_STOPPED', ()=>{
        //     console.log('程序停止了')
        // });

        this.flag='0'
        this.channel = new BroadcastChannel('flag_channel');
        this.channel.addEventListener('message', (event) => {
            console.log('Received flag data:', event.data);
            this.flag=event.data
            // if(this.flag=='1'){
                
            // }
        });

        this.mode=true
        this.channelMode=new BroadcastChannel('mode')
        this.channelMode.addEventListener('message',(event)=>{
            this.mode=event.data
            currentMode.setMode(event.data)
            if(!this.mode){
                socket.closeSocket()
                // socket.closeSocketRecive()
            }
            // window.location.reload()
        })


        this.isConnectSocket=false
        this.channelSocket=new BroadcastChannel('startRobotSocket')
        this.channelSocket.addEventListener('message',async (event)=>{

            if(!socket.getSocketRecive()){
                if(event.data){
                    await socket.setSocketRecive()
                }
            }else if( socket.checkWebSocketStatusRecive()==4){
                if(event.data){
                    await socket.setSocketRecive()
                }
            }
            if(!socket.getSocket()){
                if(event.data){
                    await socket.setSocket([])
                    socket.setLastPostTime(Date.now())
                    // socket.setSocketRecive()
                }
            }else if( socket.checkWebSocketStatus()==4){
                if(event.data){
                    await socket.setSocket([])
                    socket.setLastPostTime(Date.now())
                    // socket.setSocketRecive()
                }
            }


            
            this.channelSocket.postMessage('response')
            
        })
        setInterval(()=>{
            // console.log(socket.checkWebSocketStatus())
            
            if(Date.now()-socket.getLastPostTime()>5000 && socket.checkWebSocketStatus()==2){
                socket.getSocket().send('1')
                console.log('跳动一次')
                console.log('当前时间：', new Date().toLocaleString());
            }
        },3000)

    
        window.addEventListener('offline',()=>{
            alert('网络连接已断开')
        })

        this.whatSendFun='net'
        this.channelSendIp=new BroadcastChannel('sendIp')
        this.channelSendIp.addEventListener('message',(event)=>{
            console.log('设置ip')
            socket.setIp(event.data)
            // this.whatSendFun='net'
        })
        this.channelPort = new BroadcastChannel('channelPort')
        this.channelPort.addEventListener('message',(event)=>{
            console.log(event.data)
            if(event.data){
                this.whatSendFun='port'
            }else{
                this.whatSendFun='net'
            }
            
        })

        this.channelSerialData=new BroadcastChannel('serial-data')

        
    }
  getInfo() {

    return {
      id: 'robotmove',
      name: formatMessage({
            id: 'robotmove.name',
            default: 'Movement',
            description: 'robotmove.name'
        }),
      color1:'#7b68ee',
    //   showStatusButton: true,
    menuIconURI: moveIcon,
    blockIconURI:innerIcon,
      blocks: [

        //以下为新协议块

        {
            opcode: 'move',
            blockType: BlockType.COMMAND,
            // text: '[ONE]以[TWO]功率',
            text: formatMessage({
                id: 'robotmove.move',
                default: '[ONE] with [TWO] power',
                description: 'robotmove.move'
            }),
            arguments:{
                ONE:{

                    type:ArgumentType.STRING,
                    menu:'MENU_DIR',
                    
                },
                TWO:{
                    type: ArgumentType.NUMRES_100_100,
                    defaultValue:50,
                    max:100
                }
            }
        },

        

        {
            opcode: 'moveDirTime',
            blockType: BlockType.COMMAND,
            // text: '[ONE]以[TWO]功率[THREE]秒',
            text: formatMessage({
                id: 'robotmove.moveDirTime',
                default: '[ONE] with [TWO] power [THREE] second',
                description: 'robotmove.moveDirTime'
            }),
            arguments:{
                ONE:{

                    type:ArgumentType.STRING,
                    menu:'MENU_DIR',
                    
                },
                TWO:{
                    type: ArgumentType.NUMRES_100_100,
                    defaultValue:50
                },
                THREE:{
                    type: ArgumentType.STRING,
                    defaultValue:1
                }
            }
        },

        {
            opcode: 'moveForwardDistance',
            blockType: BlockType.COMMAND,
            // text: '[THREE]以[ONE]功率[TWO]cm',
            text: formatMessage({
                id: 'robotmove.moveForwardDistance',
                default: '[THREE] with [ONE] power [TWO] cm',
                description: 'robotmove.moveForwardDistance'
            }),
            arguments:{
                ONE:{
                    type: ArgumentType.NUMRES_100_100,
                    defaultValue:50
                },
                TWO:{
                    type: ArgumentType.STRING,
                    defaultValue:10
                },
                THREE:{
                    type: ArgumentType.STRING,
                    menu:'MOVE_YDIR'
                },
            }
        },


        // {
        //     opcode: 'moveBackwardDistance',
        //     blockType: BlockType.COMMAND,
        //     text: '后退以[ONE]功率[TWO]mm',
        //     arguments:{
        //         ONE:{
        //             type: ArgumentType.STRING,
        //             defaultValue:50
        //         },
        //         TWO:{
        //             type: ArgumentType.STRING,
        //             defaultValue:100
        //         }
        //     }
        // },


        {
            opcode: 'moveLeftDegree',
            blockType: BlockType.COMMAND,
            // text: '[THREE]以[ONE]功率转动[TWO]度直到结束',
            text: formatMessage({
                id: 'robotmove.moveLeftDegree',
                default: '[THREE] rotate [ONE] power to [TWO] degrees until finished',
                description: 'robotmove.moveLeftDegree'
            }),
            arguments:{
                ONE:{
                    type: ArgumentType.NUMRES_100_100,
                    defaultValue:50
                },
                TWO:{
                    type: ArgumentType.STRING,
                    defaultValue:90
                },
                THREE:{
                    type: ArgumentType.STRING,
                    menu:'MOVE_XDIR'
                },
            }
        },


        // {
        //     opcode: 'moveRightDegree',
        //     blockType: BlockType.COMMAND,
        //     text: '右转以[ONE]功率转动[TWO]度直到结束',
        //     arguments:{
        //         ONE:{
        //             type: ArgumentType.STRING,
        //             defaultValue:50
        //         },
        //         TWO:{
        //             type: ArgumentType.STRING,
        //             defaultValue:100
        //         }
        //     }
        // },

        {
            opcode: 'moveSpeed',
            blockType: BlockType.COMMAND,
            // text: '移动 左轮以[ONE]功率 右轮以[TWO]功率',
            text: formatMessage({
                id: 'robotmove.moveSpeed',
                default: 'Move left wheel with [ONE] power, right wheel with [TWO] power',
                description: 'robotmove.moveSpeed'
            }),
            arguments:{
                ONE:{
                    type: ArgumentType.NUMRES_100_100,
                    defaultValue:50
                },
                TWO:{
                    type: ArgumentType.NUMRES_100_100,
                    defaultValue:50
                }
            }
        },

        {
            opcode: 'moveLeftSpeed',
            blockType: BlockType.COMMAND,
            // text: '移动[FOUR]以[ONE]功率运动[TWO][THREE]',
            text: formatMessage({
                id: 'robotmove.moveLeftSpeed',
                default: 'Move [FOUR] with [ONE] power to move [TWO][THREE]',
                description: 'robotmove.moveLeftSpeed'
            }),
            arguments:{
                ONE:{
                    type: ArgumentType.NUMRES_100_100,
                    defaultValue:50
                },
                TWO:{
                    type: ArgumentType.STRING,
                    defaultValue:2
                },
                THREE:{
                    type: ArgumentType.STRING,
                    menu:'MOVE_MODE'
                },
                FOUR:{
                    type: ArgumentType.STRING,
                    menu:'MOVE_WHEEL'
                }
            }
        },

        {
            opcode: 'moveLeftForeverSpeed',
            blockType: BlockType.COMMAND,
            // text: '移动[TWO]以[ONE]功率一直运动',
            text: formatMessage({
                id: 'robotmove.moveLeftForeverSpeed',
                default: 'Move [TWO] with [ONE] power continuously',
                description: 'robotmove.moveLeftForeverSpeed'
            }),
            arguments:{
                ONE:{
                    type: ArgumentType.NUMRES_100_100,
                    defaultValue:50
                },
                TWO:{
                    type: ArgumentType.STRING,
                    menu:'MOVE_WHEEL'
                }
            }
        },

        // {
        //     opcode: 'moveRightSpeed',
        //     blockType: BlockType.COMMAND,
        //     text: '机器人右轮以[ONE]速度运动[TWO][THREE]',
        //     arguments:{
        //         ONE:{
        //             type: ArgumentType.STRING,
        //             defaultValue:50
        //         },
        //         TWO:{
        //             type: ArgumentType.STRING,
        //             defaultValue:2
        //         },
        //         THREE:{
        //             type: ArgumentType.STRING,
        //             menu:'MOVE_MODE'
        //         }

        //     }
        // },

        // {
        //     opcode: 'moveRightForeverSpeed',
        //     blockType: BlockType.COMMAND,
        //     text: '机器人右轮以[ONE]速度一直运动',
        //     arguments:{
        //         ONE:{
        //             type: ArgumentType.STRING,
        //             defaultValue:50
        //         },
        //     }
        // },

        {
            opcode: 'moveStop',
            blockType: BlockType.COMMAND,
            // text: '停止运动',
            text: formatMessage({
                id: 'robotmove.moveStop',
                default: 'stop Move',
                description: 'robotmove.moveStop'
            }),
            arguments:{
                
            }
        },

      



        
        

      ],

      menus: {
        MENU_DIR: {
          acceptReporters: false,
          items: [
           
            {
            //   text: '前进',
                text: formatMessage({
                    id: 'robotmove.menuDir.forward',
                    default: 'forward',
                    description: 'robotmove.menuDir.forward'
                }),
                value: '2'
            },
            {
            //   text: '后退',
                text: formatMessage({
                    id: 'robotmove.menuDir.backward',
                    default: 'backward',
                    description: 'robotmove.menuDir.backward'
                }),
                value: '3'
            },

             {
                // text: '右转',
                text: formatMessage({
                    id: 'robotmove.menuDir.turnright',
                    default: 'turn right',
                    description: 'robotmove.menuDir.turnright'
                }),
                value: '5'
              },
            {
                // text: '左转',
                text: formatMessage({
                    id: 'robotmove.menuDir.turnleft',
                    default: 'turn left',
                    description: 'robotmove.menuDir.turnleft'
                }),
                value: '4'
            },
           
             
          ]
        },
        MOVE_YDIR: {
            acceptReporters: false,
            items: [
             
              {
                // text: '前进',
                 text: formatMessage({
                    id: 'robotmove.menuDir.forward',
                    default: '前进',
                    description: 'robotmove.menuDir.forward'
                }),
                value: '2'
              },
              {
                // text: '后退',
                text: formatMessage({
                    id: 'robotmove.menuDir.backward',
                    default: '后退',
                    description: 'robotmove.menuDir.backward'
                }),
                value: '3'
              },
               
            ]
          },

          MOVE_XDIR: {
            acceptReporters: false,
            items: [
             


                {
                // text: '右转',
                text: formatMessage({
                    id: 'robotmove.menuDir.turnright',
                    default: '右转',
                    description: 'robotmove.menuDir.turnright'
                }),
                value: '5'
              },
              {
                // text: '左转',
                text: formatMessage({
                    id: 'robotmove.menuDir.turnleft',
                    default: '左转',
                    description: 'robotmove.menuDir.turnleft'
                }),
                value: '4'
              },
              
               
            ]
          },
        MENU_PORT: {
            acceptReporters: false,
            items: [
                {
                    text: '上',
                    value: '1'
                },
                {
                    text: '前',
                    value: '2'
                },
                {
                    text: '后左',
                    value: '3'
                },
                {
                    text: '后右',
                    value: '4'
                },
                
            ]
        },

        MENU_STATE: {
            acceptReporters: false,
            items: [
                {
                    text: '抓取',
                    value: '0'
                },
                {
                    text: '松开',
                    value: '1'
                },
                
            ]
        },
        MOVE_MODE:{
            acceptReporters: false,
            items: [
                {
                    // text: '秒',
                    text: formatMessage({
                        id: 'robotmove.menuDir.second',
                        default: 'second',
                        description: 'robotmove.menuDir.second'
                    }),
                    value: '秒'
                },
                {
                    // text: 'cm',
                    text: formatMessage({
                        id: 'robotmove.menuDir.cm',
                        default: 'cm',
                        description: 'robotmove.menuDir.cm'
                    }),
                    value: 'cm'
                },
                
            ]
        },
        MOVE_WHEEL:{
            acceptReporters: false,
            items: [
                {
                    // text: '左轮',
                     text: formatMessage({
                        id: 'robotmove.menuDir.leftWheel',
                        default: 'revolver',
                        description: 'robotmove.menuDir.leftWheel'
                    }),
                    value: '0'
                },
                {
                    // text: '右轮',
                     text: formatMessage({
                        id: 'robotmove.menuDir.rightWheel',
                        default: 'Right wheel',
                        description: 'robotmove.menuDir.rightWheel'
                    }),
                    value: '1'
                },
                
            ]
        },
    }
    };
  }



  async waitForSuccess() {
        return new Promise((resolve) => {
            function messageHandler(event) {
                try {
                    let data = event.data;
                    if (data === "success") {
                        console.log("收到 success 响应");
                        socket.getSocket().removeEventListener('message', messageHandler); // 解除监听
                        resolve(); // 继续执行
                    }
                } catch (error) {
                    console.error("解析 WebSocket 消息出错", error);
                }
            }

            socket.getSocket().addEventListener('message', messageHandler);
        });
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
        if(message=='未连接机器人'){
            toast.textContent = formatMessage({
                id: 'robotactuator.showToast.dontConnect',
                default: 'Robot not connected',
                description: 'robotactuator.showToast.dontConnect'
            })
        }else if(message=="socket断开，尝试重连......"){
            toast.textContent = formatMessage({
                id: 'robotactuator.showToast.reconnect',
                default: 'Socket disconnected, attempting to reconnect...',
                description: 'robotactuator.showToast.reconnect'
            })
        }else if(message == "socket正在连接中，请稍后"){
            toast.textContent = formatMessage({
                id: 'robotactuator.showToast.connecting',
                default: 'Socket is connecting, please wait',
                description: 'robotactuator.showToast.connecting'
            })
        }
        // toast.textContent = message;
    
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


  async move(args){
    if(this.mode){
        if(socket.getIp().length==0){
            this.showToast('未连接机器人')
            this.runtime.stopAll();
            return
        }

        // console.log(Number(args.TWO))
        let jsonData={
            "command":"motor",
            "params":{
                "mode":Number(args.ONE),
                "speed":Number(args.TWO),
                "l_speed":0,
                "r_speed":0,
                "time":-1,
                "distance":-1
            }
        }
        // let str = `robot.send_move(${args.ONE},${args.TWO})`;
        let str=JSON.stringify(jsonData)
        if(this.whatSendFun=='net'){
            if(socket.checkWebSocketStatus()==4 || socket.checkWebSocketStatus()==0){
                console.log('断开连接，尝试重连')
                this.showToast("socket断开，尝试重连......");
                let context=[]
                context.push(str)
                await socket.setSocket(context)
            }else if(socket.checkWebSocketStatus()==2){
                await socket.getSocket().send(str);
            }else if(socket.checkWebSocketStatus()==1){
                this.showToast("socket正在连接中，请稍后");
                this.runtime.stopAll();
            }else if(socket.checkWebSocketStatus()==3){
                this.showToast("socket正在断开，请稍后");
            }
            socket.setLastPostTime(Date.now())
        }else if(this.whatSendFun=='port'){
            this.channelPort.postMessage(str)
        }
        

        // this.channelPort.postMessage(str)
        // await new Promise(resolve => setTimeout(resolve, 50));
    }

    
  }


  sendCommandAndWaitForSuccess(command) {
    return new Promise((resolve, reject) => {
      // 发送命令
      this.channelPort.postMessage(command);
  
      // 响应监听器
      const onMessage = (e) => {
        const data = e.data;
        if (data.length==1 && data[0] === 'success') {
            this.channelSerialData.removeEventListener('message', onMessage); // 清除监听器
          resolve(); // 完成Promise
        }
      };
  
      this.channelSerialData.addEventListener('message', onMessage);
  
      // 可选：超时机制（比如 5 秒）
    //   setTimeout(() => {
    //     this.channelSerialData.removeEventListener('message', onMessage);
    //     reject(new Error('超时未收到 success'));
    //   }, 5000);
    });
  }
  async moveDirTime(args){
    if(this.mode){
        if(socket.getIp().length==0){
            this.showToast('未连接机器人')
            this.runtime.stopAll();
            return
        }

        // let time=Number(args.THREE)/100

        let jsonData={
            "command":"motor",
            "params":{
                "mode":Number(args.ONE),
                "speed":Number(args.TWO),
                "l_speed":0,
                "r_speed":0,
                "time":Math.abs(Number(args.THREE)),
                "distance":-1
            }
        }
        // let str = `robot.send_move(${args.ONE},${args.TWO})`;
        let str=JSON.stringify(jsonData)
        if(this.whatSendFun=='net'){
            if(socket.checkWebSocketStatus()==4 || socket.checkWebSocketStatus()==0){
                console.log('断开连接，尝试重连')
                this.showToast("socket断开，尝试重连......");
                let context=[]
                context.push(str)
                await socket.setSocket(context)
            }else if(socket.checkWebSocketStatus()==2){
                await socket.getSocket().send(str);
            }else if(socket.checkWebSocketStatus()==1){
                this.showToast("socket正在连接中，请稍后");
                this.runtime.stopAll();
            }
            await this.waitForSuccess()
            socket.setLastPostTime(Date.now())
        }else{
            // this.channelPort.postMessage(str)
            await this.sendCommandAndWaitForSuccess(str)
        }
       
        // await new Promise(resolve => setTimeout(resolve, 50));
    }

   
  }

  async moveForwardDistance(args){
    if(this.mode){
        if(socket.getIp().length==0){
            this.showToast('未连接机器人')
            this.runtime.stopAll();
            return
        }

        let jsonData={
            "command":"motor",
            "params":{
                "mode":Number(args.THREE),
                "speed":Number(args.ONE),
                "l_speed":0,
                "r_speed":0,
                "time":-1,
                "distance":Number(args.TWO)
            }
        }
        // let str = `robot.send_move(${args.ONE},${args.TWO})`;
        let str=JSON.stringify(jsonData)

        if(this.whatSendFun=='net'){
            if(socket.checkWebSocketStatus()==4 || socket.checkWebSocketStatus()==0){
                console.log('断开连接，尝试重连')
                this.showToast("socket断开，尝试重连......");
                let context=[]
                context.push(str)
                await socket.setSocket(context)
            }else if(socket.checkWebSocketStatus()==2){
                await socket.getSocket().send(str);
            }else if(socket.checkWebSocketStatus()==1){
                this.showToast("socket正在连接中，请稍后");
                this.runtime.stopAll();
            }
            // await new Promise(resolve => setTimeout(resolve, 50));
            await this.waitForSuccess()

            socket.setLastPostTime(Date.now())
        }else{
            await this.sendCommandAndWaitForSuccess(str)
        }
       
    }

    
  }

//   async moveBackwardDistance(args){
//     if(this.mode){

//         let jsonData={
//             "command":"motor",
//             "params":{
//                 "mode":3,
//                 "speed":Math.abs(Number(args.ONE)),
//                 "l_speed":0,
//                 "r_speed":0,
//                 "time":-1,
//                 "distance":Math.abs(Number(args.TWO))
//             }
//         }
//         // let str = `robot.send_move(${args.ONE},${args.TWO})`;
//         let str=JSON.stringify(jsonData)
//         if(socket.checkWebSocketStatus()==4 || socket.checkWebSocketStatus()==0){
//             console.log('断开连接，尝试重连')
//             let context=[]
//             context.push(str)
//             await socket.setSocket(context)
//         }else if(socket.checkWebSocketStatus()==2){
//             await socket.getSocket().send(str);
//         }
//         // await new Promise(resolve => setTimeout(resolve, 50));
//         await this.waitForSuccess()
//     }

//     socket.setLastPostTime(Date.now())
//   }

  async moveLeftDegree(args){
    if(this.mode){

        if(socket.getIp().length==0){
            this.showToast('未连接机器人')
            this.runtime.stopAll();
            return
        }
        let jsonData={
            "command":"motor",
            "params":{
                "mode":Number(args.THREE),
                "speed":Number(args.ONE),
                "l_speed":0,
                "r_speed":0,
                "time":-1,
                "distance":Number(args.TWO)
            }
        }
        // let str = `robot.send_move(${args.ONE},${args.TWO})`;
        let str=JSON.stringify(jsonData)

        if(this.whatSendFun=='net'){
            if(socket.checkWebSocketStatus()==4 || socket.checkWebSocketStatus()==0){
                console.log('断开连接，尝试重连')
                this.showToast("socket断开，尝试重连......");
                let context=[]
                context.push(str)
                await socket.setSocket(context)
            }else if(socket.checkWebSocketStatus()==2){
                await socket.getSocket().send(str);
            }else if(socket.checkWebSocketStatus()==1){
                this.showToast("socket正在连接中，请稍后");
                this.runtime.stopAll();
            }
            // await new Promise(resolve => setTimeout(resolve, 50));
            await this.waitForSuccess()
            socket.setLastPostTime(Date.now())
        }else{
            await this.sendCommandAndWaitForSuccess(str)
        }
        
    }

    
  }


//   async moveRightDegree(args){
//     if(this.mode){

//         let jsonData={
//             "command":"motor",
//             "params":{
//                 "mode":5,
//                 "speed":Math.abs(Number(args.ONE)),
//                 "l_speed":0,
//                 "r_speed":0,
//                 "time":-1,
//                 "distance":Math.abs(Number(args.TWO))
//             }
//         }
//         // let str = `robot.send_move(${args.ONE},${args.TWO})`;
//         let str=JSON.stringify(jsonData)
//         if(socket.checkWebSocketStatus()==4 || socket.checkWebSocketStatus()==0){
//             console.log('断开连接，尝试重连')
//             let context=[]
//             context.push(str)
//             await socket.setSocket(context)
//         }else if(socket.checkWebSocketStatus()==2){
//             await socket.getSocket().send(str);
//         }
//         // await new Promise(resolve => setTimeout(resolve, 50));
//         await this.waitForSuccess()
//     }

//     socket.setLastPostTime(Date.now())
//   }

  async moveSpeed(args){
    if(this.mode){

        if(socket.getIp().length==0){
            this.showToast('未连接机器人')
            this.runtime.stopAll();
            return
        }
        let jsonData={
            "command":"motor",
            "params":{
                "mode":6,
                "speed":0,
                "l_speed":Number(args.ONE),
                "r_speed":Number(args.TWO),
                "time":-1,
                "distance":-1
            }
        }
        // let str = `robot.send_move(${args.ONE},${args.TWO})`;
        let str=JSON.stringify(jsonData)
        if(this.whatSendFun=='net'){
            if(socket.checkWebSocketStatus()==4 || socket.checkWebSocketStatus()==0){
                console.log('断开连接，尝试重连')
                this.showToast("socket断开，尝试重连......");
                let context=[]
                context.push(str)
                await socket.setSocket(context)
            }else if(socket.checkWebSocketStatus()==2){
                await socket.getSocket().send(str);
            }else if(socket.checkWebSocketStatus()==1){
                this.showToast("socket正在连接中，请稍后");
                this.runtime.stopAll();
            }
            socket.setLastPostTime(Date.now())
        }else if(this.whatSendFun=='port'){
            this.channelPort.postMessage(str)
        }
        
        // await new Promise(resolve => setTimeout(resolve, 50));
    }

    
  }

  async moveLeftSpeed(args){
    if(this.mode){
        if(socket.getIp().length==0){
            this.showToast('未连接机器人')
            this.runtime.stopAll();
            return
        }
        let jsonData;
        if(args.FOUR=='0'){
            if(args.THREE=='cm'){
                jsonData={
                    "command":"motor",
                    "params":{
                        "mode":7,
                        "speed":Number(args.ONE),
                        "l_speed":0,
                        "r_speed":0,
                        "time":-1,
                        "distance":Number(args.TWO)
                    }
                }
            }else if(args.THREE=='秒'){
                jsonData={
                    "command":"motor",
                    "params":{
                        "mode":7,
                        "speed":Number(args.ONE),
                        "l_speed":0,
                        "r_speed":0,
                        "time":Math.abs(Number(args.TWO)),
                        "distance":-1
                    }
                }
            }
        }else{
            if(args.THREE=='cm'){
                jsonData={
                    "command":"motor",
                    "params":{
                        "mode":8,
                        "speed":Number(args.ONE),
                        "l_speed":0,
                        "r_speed":0,
                        "time":-1,
                        "distance":Number(args.TWO)
                    }
                }
            }else if(args.THREE=='秒'){
                jsonData={
                    "command":"motor",
                    "params":{
                        "mode":8,
                        "speed":Number(args.ONE),
                        "l_speed":0,
                        "r_speed":0,
                        "time":Math.abs(Number(args.TWO)),
                        "distance":-1
                    }
                }
            }
        }
        

        
        // let str = `robot.send_move(${args.ONE},${args.TWO})`;
        let str=JSON.stringify(jsonData)

        if(this.whatSendFun=='net'){
            if(socket.checkWebSocketStatus()==4 || socket.checkWebSocketStatus()==0){
                console.log('断开连接，尝试重连')
                this.showToast("socket断开，尝试重连......");
                let context=[]
                context.push(str)
                await socket.setSocket(context)
            }else if(socket.checkWebSocketStatus()==2){
                await socket.getSocket().send(str);
            }else if(socket.checkWebSocketStatus()==1){
                this.showToast("socket正在连接中，请稍后");
                this.runtime.stopAll();
            }
            // await new Promise(resolve => setTimeout(resolve, 50));
            await this.waitForSuccess()
        }else{
            this.sendCommandAndWaitForSuccess(str)
        }
        
    }

    socket.setLastPostTime(Date.now())
  }


  async moveLeftForeverSpeed(args){
    if(this.mode){
        if(socket.getIp().length==0){
            this.showToast('未连接机器人')
            this.runtime.stopAll();
            return
        }
        let jsonData;
        if(args.TWO=='0'){
            jsonData={
                "command":"motor",
                "params":{
                    "mode":7,
                    "speed":Number(args.ONE),
                    "l_speed":0,
                    "r_speed":0,
                    "time":-1,
                    "distance":-1
                }
            }
        }else{
            jsonData={
                "command":"motor",
                "params":{
                    "mode":8,
                    "speed":Number(args.ONE),
                    "l_speed":0,
                    "r_speed":0,
                    "time":-1,
                    "distance":-1
                }
            }
        }
        

        
        // let str = `robot.send_move(${args.ONE},${args.TWO})`;
        let str=JSON.stringify(jsonData)
        if(this.whatSendFun=='net'){
            if(socket.checkWebSocketStatus()==4 || socket.checkWebSocketStatus()==0){
                console.log('断开连接，尝试重连')
                this.showToast("socket断开，尝试重连......");
                let context=[]
                context.push(str)
                await socket.setSocket(context)
            }else if(socket.checkWebSocketStatus()==2){
                await socket.getSocket().send(str);
            }else if(socket.checkWebSocketStatus()==1){
                this.showToast("socket正在连接中，请稍后");
                this.runtime.stopAll();
            }
            socket.setLastPostTime(Date.now())
        }else if(this.whatSendFun=='port'){
            this.channelPort.postMessage(str)
        }
        
        // await new Promise(resolve => setTimeout(resolve, 50));
    }

    
  }


  async moveRightSpeed(args){
    if(this.mode){
        if(socket.getIp().length==0){
            this.showToast('未连接机器人')
            this.runtime.stopAll();
            return
        }
        let jsonData;
        if(args.THREE=='cm'){
            jsonData={
                "command":"motor",
                "params":{
                    "mode":8,
                    "speed":Number(args.ONE),
                    "l_speed":0,
                    "r_speed":0,
                    "time":-1,
                    "distance":Number(args.TWO)
                }
            }
        }else if(args.THREE=='秒'){
            jsonData={
                "command":"motor",
                "params":{
                    "mode":8,
                    "speed":Number(args.ONE),
                    "l_speed":0,
                    "r_speed":0,
                    "time":Math.abs(Number(args.TWO)),
                    "distance":-1
                }
            }
        }

        
        // let str = `robot.send_move(${args.ONE},${args.TWO})`;
        let str=JSON.stringify(jsonData)
        if(socket.checkWebSocketStatus()==4 || socket.checkWebSocketStatus()==0){
            console.log('断开连接，尝试重连')
            this.showToast("socket断开，尝试重连......");
            let context=[]
            context.push(str)
            await socket.setSocket(context)
        }else if(socket.checkWebSocketStatus()==2){
            await socket.getSocket().send(str);
        }else if(socket.checkWebSocketStatus()==1){
            this.showToast("socket正在连接中，请稍后");
            this.runtime.stopAll();
        }
        // await new Promise(resolve => setTimeout(resolve, 50));
        await this.waitForSuccess()
    }

    socket.setLastPostTime(Date.now())
  }



  async moveRightForeverSpeed(args){
    if(this.mode){
        if(socket.getIp().length==0){
            this.showToast('未连接机器人')
            this.runtime.stopAll();
            return
        }
        let jsonData={
            "command":"motor",
            "params":{
                "mode":8,
                "speed":Number(args.ONE),
                "l_speed":0,
                "r_speed":0,
                "time":-1,
                "distance":-1
            }
        }

        
        // let str = `robot.send_move(${args.ONE},${args.TWO})`;
        let str=JSON.stringify(jsonData)
        if(socket.checkWebSocketStatus()==4 || socket.checkWebSocketStatus()==0){
            console.log('断开连接，尝试重连')
            this.showToast("socket断开，尝试重连......");
            let context=[]
            context.push(str)
            await socket.setSocket(context)
        }else if(socket.checkWebSocketStatus()==2){
            await socket.getSocket().send(str);
        }else if(socket.checkWebSocketStatus()==1){
            this.showToast("socket正在连接中，请稍后");
            this.runtime.stopAll();
        }
        // await new Promise(resolve => setTimeout(resolve, 50));
    }

    socket.setLastPostTime(Date.now())
  }

  async moveStop(args){
    if(this.mode){
        if(socket.getIp().length==0){
            this.showToast('未连接机器人')
            this.runtime.stopAll();
            return
        }

        let jsonData={
            "command":"motor",
            "params":{
                "mode":1,
                "speed":0,
                "l_speed":0,
                "r_speed":0,
                "time":-1,
                "distance":-1
            }
        }
        // let str = `robot.send_move(${args.ONE},${args.TWO})`;
        let str=JSON.stringify(jsonData)
        if(this.whatSendFun=='net'){
            if(socket.checkWebSocketStatus()==4 || socket.checkWebSocketStatus()==0){
                console.log('断开连接，尝试重连')
                this.showToast("socket断开，尝试重连......");
                let context=[]
                context.push(str)
                await socket.setSocket(context)
            }else if(socket.checkWebSocketStatus()==2){
                await socket.getSocket().send(str);
            }else if(socket.checkWebSocketStatus()==1){
                this.showToast("socket正在连接中，请稍后");
                this.runtime.stopAll();
            }
            socket.setLastPostTime(Date.now())
        }else if(this.whatSendFun=='port'){
            this.channelPort.postMessage(str)
        }
        
        // await new Promise(resolve => setTimeout(resolve, 50));
    }


    

   
  }
  
  //-------------------------------------------------------------

  async gripperOpen(args){
    if(this.mode){


        let jsonData={
            "command":"gripper",
            "params":{
                "port":Number(args.ONE),
                "status":1
            }
        }
        // let str = `robot.send_paw(${args.ONE},${args.TWO})`;
        let str = JSON.stringify(jsonData)
        if(socket.checkWebSocketStatus()==4 || socket.checkWebSocketStatus()==0){
            console.log('断开连接，尝试重连')
            let context=[]
            context.push(str)
            await socket.setSocket(context)
        }else if(socket.checkWebSocketStatus()==2){
            socket.getSocket().send(str);
        }

        socket.setLastPostTime(Date.now())
       
    }
  }

  async gripperClose(args){
    if(this.mode){


        let jsonData={
            "command":"gripper",
            "params":{
                "port":Number(args.ONE),
                "status":0
            }
        }
        // let str = `robot.send_paw(${args.ONE},${args.TWO})`;
        let str = JSON.stringify(jsonData)
        if(socket.checkWebSocketStatus()==4 || socket.checkWebSocketStatus()==0){
            console.log('断开连接，尝试重连')
            let context=[]
            context.push(str)
            await socket.setSocket(context)
        }else if(socket.checkWebSocketStatus()==2){
            socket.getSocket().send(str);
        }

        socket.setLastPostTime(Date.now())
       
    }
  }

  gripperIsDown(){

  }

  async gunFire(args){
    if(this.mode){
        let currentTime=Date.now()


        let jsonData={
            "command":"gun",
            "params":{
                "port":Number(args.ONE),
                "num":Number(args.TWO)
            }
        }
        // let str = `robot.send_fire(${args.ONE},1,${args.TWO})`;
        let str = JSON.stringify(jsonData)
        if(socket.checkWebSocketStatus()==4 || socket.checkWebSocketStatus()==0){
            console.log('断开连接，尝试重连')
            let context=[]
            context.push(str)
            await socket.setSocket(context)
        }else if(socket.checkWebSocketStatus()==2){
            socket.getSocket().send(str);
        }
       
    }

    socket.setLastPostTime(Date.now())
  }
  gunFireIsDown(){

  }

//   async move(args){
    
//     if(this.mode){
//         let l_speed=args.ONE
//         let r_speed=args.ONE
//         if(args.TWO=='2'){
//             l_speed=(-1)*l_speed
//             r_speed=(-1)*r_speed
//         }else if(args.TWO=='3'){
//             l_speed=(-1)*l_speed
//         }else if(args.TWO=='4'){
//             r_speed=(-1)*r_speed
//         }else if(args.TWO=='0'){
//             l_speed=0
//             r_speed=0
//         }
    
//         // console.log(l_speed)
//         // console.log(r_speed)
//         // console.log(args.TWO)
//         // console.log(preMove)
    
//         let jsonData={
//             "command":"motor",
//             "params":{
//                 "l_speed":l_speed,
//                 "r_speed":r_speed,
//                 "duration":0,
//                 "distance":0
//             }
//         }

//         // let str = `robot.send_move(${l_speed},${r_speed})`;
//         let str=JSON.stringify(jsonData)
//         if(socket.checkWebSocketStatus()==4 || socket.checkWebSocketStatus()==0){
//             console.log('断开连接，尝试重连')
//             let context=[]
//             context.push(str)
//             await socket.setSocket(context)
//         }else if(socket.checkWebSocketStatus()==2){
//             console.log('发送数据')
//             socket.getSocket().send(str);
//         }else if(socket.checkWebSocketStatus()==1){
//             alert('正在连接')
//         }else if(socket.checkWebSocketStatus()==3){
//             alert('正在关闭连接')
//         }

//         await new Promise(resolve => setTimeout(resolve, 200));

//         // if(args.TWO!=preMove){
//         //     preMove=args.TWO
//         //     let str = `robot.send_move(${l_speed},${r_speed})\r`;
//         //     if(socket.checkWebSocketStatus()==4 || socket.checkWebSocketStatus()==0){
//         //         console.log('断开连接，尝试重连')
//         //         let context=[]
//         //         context.push(str)
//         //         await socket.setSocket(context)
//         //     }else if(socket.checkWebSocketStatus()==2){
//         //         socket.getSocket().send(str);
//         //     }
            
           
//         //     // await new Promise(resolve => setTimeout(resolve, 500));  // 等待1秒
//         // }
//     }

//     socket.setLastPostTime(Date.now())
    
   
//   }
//   async catchHand(args){
//     if(this.mode){


//         let jsonData={
//             "command":"gripper",
//             "params":{
//                 "port":Number(args.ONE),
//                 "status":Number(args.TWO)
//             }
//         }
//         // let str = `robot.send_paw(${args.ONE},${args.TWO})`;
//         let str = JSON.stringify(jsonData)
//         if(socket.checkWebSocketStatus()==4 || socket.checkWebSocketStatus()==0){
//             console.log('断开连接，尝试重连')
//             let context=[]
//             context.push(str)
//             await socket.setSocket(context)
//         }else if(socket.checkWebSocketStatus()==2){
//             socket.getSocket().send(str);
//         }
//         // if(preCatch!=args.TWO){
//         //     preCatch=args.TWO
//         //     let str = `robot.send_paw(${args.ONE},${args.TWO})\r`;
//         //     if(socket.checkWebSocketStatus()==4 || socket.checkWebSocketStatus()==0){
//         //         console.log('断开连接，尝试重连')
//         //         let context=[]
//         //         context.push(str)
//         //         await socket.setSocket(context)
//         //     }else if(socket.checkWebSocketStatus()==2){
//         //         socket.getSocket().send(str);
//         //     }
//         // }

//         socket.setLastPostTime(Date.now())
       
//     }
   


    
    
//     // if(this.flag=='1'){
//     //     await fetch(`http://192.168.4.1:8082/scratch_paw?location=${args.ONE}&mode=${args.TWO}`)
//     //     .then(response => {
//     //         if (!response.ok) {
//     //             throw new Error('Network response was not ok');
//     //         }
//     //         return response.text();
//     //     })
//     //     .then(data => {
//     //         console.log('Success:', data);
//     //     })
//     //     .catch(error => {
//     //         console.error('There was an error with the fetch operation:', error);
//     //     });
//     // }
   
//   }
//   async fort(args){
//     if(this.mode){
//         let currentTime=Date.now()


//         let jsonData={
//             "command":"gun",
//             "params":{
//                 "port":Number(args.ONE),
//                 "num":Number(args.TWO)
//             }
//         }
//         // let str = `robot.send_fire(${args.ONE},1,${args.TWO})`;
//         let str = JSON.stringify(jsonData)
//         if(socket.checkWebSocketStatus()==4 || socket.checkWebSocketStatus()==0){
//             console.log('断开连接，尝试重连')
//             let context=[]
//             context.push(str)
//             await socket.setSocket(context)
//         }else if(socket.checkWebSocketStatus()==2){
//             socket.getSocket().send(str);
//         }
//         // if(currentTime-preFortTime>200){
//         //     preFortTime=currentTime
//         //     if(socket.checkWebSocketStatus()==4 || socket.checkWebSocketStatus()==0){
//         //         console.log('断开连接，尝试重连')
//         //         let context=[]
//         //         context.push(str)
//         //         await socket.setSocket(context)
//         //     }else if(socket.checkWebSocketStatus()==2){
//         //         socket.getSocket().send(str);
//         //     }
//         // }
//         // preFortTime=currentTime
       
//     }

//     socket.setLastPostTime(Date.now())
    

    
    
//     // if(this.flag=='1'){
//     //     await fetch(`http://192.168.4.1:8082/scratch_fire?location=${args.ONE}&mode=1&num=${args.TWO}`)
//     //     .then(response => {
//     //         if (!response.ok) {
//     //             throw new Error('Network response was not ok');
//     //         }
//     //         return response.text();
//     //     })
//     //     .then(data => {
//     //         console.log('Success:', data);
//     //     })
//     //     .catch(error => {
//     //         console.error('There was an error with the fetch operation:', error);
//     //     });
//     // }
   

//   }
//   async movetime(args){
    
//     if(this.mode){
//         let l_speed=args.ONE
//         let r_speed=args.ONE
//         if(args.TWO=='2'){
//             l_speed=(-1)*l_speed
//             r_speed=(-1)*r_speed
//         }else if(args.TWO=='3'){
//             l_speed=(-1)*l_speed
//         }else if(args.TWO=='4'){
//             r_speed=(-1)*r_speed
//         }else if(args.TWO=='0'){
//             l_speed=0
//             r_speed=0
//         }
    
//         let time=args.THREE*10

//         let jsonData={
//             "command":"motor",
//             "params":{
//                 "l_speed":l_speed,
//                 "r_speed":r_speed,
//                 "duration":time,
//                 "distance":0
//             }
//         }
    
        
//         // let str = `robot.send_move_time(${l_speed}, ${r_speed},${time})`;
//         let str=JSON.stringify(jsonData)
//         if(socket.checkWebSocketStatus()==4 || socket.checkWebSocketStatus()==0){
//             console.log('断开连接，尝试重连')
//             let context=[]
//             context.push(str)
//             await socket.setSocket(context)
//         }else if(socket.checkWebSocketStatus()==2){
//             socket.getSocket().send(str);
//         }

//         await new Promise(resolve => setTimeout(resolve, 200));
//         // let currentTime=Date.now()
//         // if(currentTime-preTime>200){
//         //     preTime=currentTime
//         //     if(socket.checkWebSocketStatus()==4 || socket.checkWebSocketStatus()==0){
//         //         console.log('断开连接，尝试重连')
//         //         let context=[]
//         //         context.push(str)
//         //         await socket.setSocket(context)
//         //     }else if(socket.checkWebSocketStatus()==2){
//         //         socket.getSocket().send(str);
//         //     }
//         // }
//         // preTime=currentTime
        
//     }

//     socket.setLastPostTime(Date.now())
    
    
    
//     // if(this.flag=='1'){
//     //     await fetch(`http://192.168.4.1:8082/scratch_move?mode=2&l_speed=${l_speed}&r_speed=${r_speed}&num=${args.THREE}`)
//     //     .then(response => {
//     //         if (!response.ok) {
//     //             throw new Error('Network response was not ok');
//     //         }
//     //         return response.text();
//     //     })
//     //     .then(data => {
//     //         console.log('Success:', data);
//     //     })
//     //     .catch(error => {
//     //         console.error('There was an error with the fetch operation:', error);
//     //     });
//     // }
   
//   }
//   async movedistance(args){
    
//     if(this.mode){
//         let l_speed=args.ONE
//         let r_speed=args.ONE
//         if(args.TWO=='2'){
//             l_speed=(-1)*l_speed
//             r_speed=(-1)*r_speed
//         }else if(args.TWO=='3'){
//             l_speed=(-1)*l_speed
//         }else if(args.TWO=='4'){
//             r_speed=(-1)*r_speed
//         }else if(args.TWO=='0'){
//             l_speed=0
//             r_speed=0
//         }
    

//         let jsonData={
//             "command":"motor",
//             "params":{
//                 "l_speed":l_speed,
//                 "r_speed":r_speed,
//                 "duration":0,
//                 "distance":args.THREE
//             }
//         }
//         // let str = `robot.send_move_distance(${l_speed}, ${r_speed}, ${args.THREE})`;
//         let str=JSON.stringify(jsonData)

//         if(socket.checkWebSocketStatus()==4 || socket.checkWebSocketStatus()==0){
//             console.log('断开连接，尝试重连')
//             let context=[]
//             context.push(str)
//             await socket.setSocket(context)
//         }else if(socket.checkWebSocketStatus()==2){
//             socket.getSocket().send(str);
//         }

//         await new Promise(resolve => setTimeout(resolve, 200));
//         // let currentTime=Date.now()
//         // if(currentTime-preDisTime>200){
//         //     preDisTime=currentTime
//         //     if(socket.checkWebSocketStatus()==4 || socket.checkWebSocketStatus()==0){
//         //         console.log('断开连接，尝试重连')
//         //         let context=[]
//         //         context.push(str)
//         //         await socket.setSocket(context)
//         //     }else if(socket.checkWebSocketStatus()==2){
//         //         socket.getSocket().send(str);
//         //     }
//         // }
//         // preDisTime=currentTime
        
        
//     }
   
    

//     socket.setLastPostTime(Date.now())


//     // if(this.flag=='1'){
//     //     await fetch(`http://192.168.4.1:8082/scratch_move?mode=3&l_speed=${l_speed}&r_speed=${r_speed}&num=${args.THREE}`)
//     //     .then(response => {
//     //         if (!response.ok) {
//     //             throw new Error('Network response was not ok');
//     //         }
//     //         return response.text();
//     //     })
//     //     .then(data => {
//     //         console.log('Success:', data);
//     //     })

//     //     .catch(error => {
//     //         console.error('There was an error with the fetch operation:', error);
//     //     });
//     // }
    
//   }



}


module.exports = RobotMove;
