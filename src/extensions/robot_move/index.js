const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type')
const socket=require('../../util/socket-connect')
const socketBle = require('../../util/localSocket')
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

        // this.whatSendFun='net'
        // this.isPortConnected = false
        // this.isBleConnected = false
        // this.channelSendIp=new BroadcastChannel('sendIp')
        // this.channelSendIp.addEventListener('message',(event)=>{
        //     console.log('设置ip')
        //     socket.setIp(event.data)
        //     // this.whatSendFun='net'
        //     this.updateSendFun()
        // })

        // this.channelHostPot=new BroadcastChannel('hostpot')
        // this.channelHostPot.addEventListener('message',async(event)=>{
        //     if(!event.data){
                
                
        //     }
            
        // })
        // this.channelPort = new BroadcastChannel('channelPort')
        // this.channelPort.addEventListener('message',(event)=>{
        //     // console.log(event.data)
        //     // if(event.data){
        //     //     this.whatSendFun='port'
        //     // }else{
        //     //     this.whatSendFun='net'
        //     // }
        //     if (typeof event.data === 'boolean') {
        //         this.isPortConnected = event.data;
        //         this.updateSendFun();
        //     }
            
        // })

        // this.channelBle = new BroadcastChannel('isBle')
        // this.channelBle.addEventListener('message',(event)=>{
        //     // if(this.whatSendFun=='port') return
            
        //     // if(event.data){
        //     //     console.log('当前为蓝牙模式')
        //     //     if(!socketBle.getSocket()){
        //     //         socketBle.setSocket()
        //     //     }
        //     //     this.whatSendFun='ble'
        //     // }else{
        //     //     // if(socketBle.getSocket()){
        //     //     //     socketBle.getSocket().close()
        //     //     // }
        //     //     this.whatSendFun='net'
        //     // }
        //      this.isBleConnected = !!event.data

        //     if (this.isBleConnected) {
        //         console.log('当前为蓝牙模式')
        //         if (!socketBle.getSocket()) {
        //             socketBle.setSocket()
        //         }
        //     } else {
        //         // 如果蓝牙断开，这里不要强制回到 net，让优先级逻辑自己决定
        //         // if(socketBle.getSocket()){
        //         //     socketBle.getSocket().close()
        //         // }
        //     }

        //     this.updateSendFun()
        // })

        // this.updateSendFun = () => {
        //     if (this.isPortConnected) {
        //         this.whatSendFun = 'port'
        //     } else if (this.isBleConnected) {
        //         this.whatSendFun = 'ble'
        //     } else {
        //         this.whatSendFun = 'net'
        //     }
        //     console.log('当前发送方式:', this.whatSendFun)
        // }

        this.whatSendFun = 'net' // 默认就是 net
        this.isPortConnected = false
        this.isBleConnected = false
        this.isNetConnected = false
        this.lastHighPriority = null // 默认 net

        // WiFi 设置与连接
        this.channelSendIp = new BroadcastChannel('sendIp')
        this.channelSendIp.addEventListener('message', (event) => {
            console.log('设置ip')
            socket.setIp(event.data)
            this.isNetConnected = true
            this.lastHighPriority = 'net'
            this.updateSendFun()
        })

        // WiFi 断开
        this.channelHostPot = new BroadcastChannel('hostpot')
        this.channelHostPot.addEventListener('message', async (event) => {
            if (!event.data) {
                this.isNetConnected = false
                if (this.whatSendFun === 'net') {
                    if (this.isBleConnected) {
                        this.lastHighPriority = 'ble'
                    } else {
                        this.lastHighPriority = null
                    }
                }
                this.updateSendFun()
            }
        })

        // 串口
        this.channelPort = new BroadcastChannel('channelPort')
        this.channelPort.addEventListener('message', (event) => {
            if (typeof event.data === 'boolean') {
                this.isPortConnected = event.data
                this.updateSendFun()
            }
        })

        // 蓝牙
        this.channelBle = new BroadcastChannel('isBle')
        this.channelBle.addEventListener('message', (event) => {
            this.isBleConnected = !!event.data

            if (this.isBleConnected) {
                console.log('当前为蓝牙模式')
                if (!socketBle.getSocket()) {
                    socketBle.setSocket()
                }
                this.lastHighPriority = 'ble'
            } else {
                if (this.whatSendFun === 'ble') {
                    if (this.isNetConnected) {
                        this.lastHighPriority = 'net'
                    } else {
                        this.lastHighPriority = null
                    }
                }
            }

            this.updateSendFun()
        })

        // 更新逻辑
        this.updateSendFun = () => {
            console.log(this.lastHighPriority)
            if (this.lastHighPriority) {
                this.whatSendFun = this.lastHighPriority
                console.log(this.whatSendFun)
            } else if (this.isPortConnected) {
                this.whatSendFun = 'port'
            } else {
                this.whatSendFun = 'net' // 默认兜底仍然是 net
            }
            console.log('当前发送方式:', this.whatSendFun)
        }

        this.channelSerialData=new BroadcastChannel('serial-data')
        // this.responseQueue = []; // 等待响应的队列

        // // 全局监听器：负责分发返回
        // this.channelSerialData.addEventListener("message", (e) => {
        // const data = e.data;
        // console.log("📩 串口收到数据:", data);

        // if (this.responseQueue.length > 0) {
        //     const { resolve, reject, timer } = this.responseQueue.shift();
        //     clearTimeout(timer);

        //     if (Array.isArray(data) && data.length === 1 && data[0] === 0) {
        //     resolve(true);
        //     } 
        // } else {
        //     console.warn("⚠️ 收到未匹配的响应:", data);
        // }
        // });

        this.distance

        this.channel = new BroadcastChannel('distance_channel');
        // this.channel.addEventListener('message', (event) => {
        //     // console.log(event.data);
        //     this.distance=event.data
        // });


        this.stopAll = new BroadcastChannel('stopAll')
        this.stopAll.addEventListener('message',(event)=>{
            if(event.data && this.whatSendFun == 'ble'){
                socketBle.getSocket().send(JSON.stringify([0XCC,0x03]))
            }
        })

        this.bleChangeMode = new BroadcastChannel('ble-change')
        this.bleChangeMode.addEventListener('message',(event)=>{
            if(event.data=='file'){
                socketBle.getSocket().send(JSON.stringify([0XCC,0x02]))
            }else{
                socketBle.getSocket().send(JSON.stringify([0XCC,0x01]))
            }
        })

        this.responseQueue = []; // 等待中的 Promise 队列
        this.stateBuffer = [];   // 最近 3 个 state
        window.EditorPreload.sendStateData((state) => {
            console.log("📩 收到状态:", state);
            // if (this.responseQueue.length > 0) {
            //     // 只要收到一个 0，就 resolve
            //     if (state === 0) {
            //     const { resolve, timer } = this.responseQueue.shift();
            //     clearTimeout(timer);
            //     resolve(true);
            //     }
            // } else {
            //     console.warn("⚠️ 收到未匹配的响应:", state);
            // }
            if (this.responseQueue.length > 0) {
                // 收到一个 0 就 resolve
                if (state === 0) {
                const { resolve } = this.responseQueue.shift();
                resolve(true);
                }
            } else {
                console.warn("⚠️ 收到未匹配的响应:", state);
            }
        })

        
        
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
                default: '[ONE] at [TWO]% power',
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
            },
        },

        

        {
            opcode: 'moveDirTime',
            blockType: BlockType.COMMAND,
            // text: '[ONE]以[TWO]功率[THREE]秒',
            text: formatMessage({
                id: 'robotmove.moveDirTime',
                default: '[ONE] at [TWO] % power [THREE] secs',
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
                default: '[THREE] at [ONE] % power for [TWO] cm',
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
                default: '[THREE] at [ONE] power for [TWO] ° until done',
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
                default: 'left wheel rotates at [ONE] % power, right wheel rotates at [TWO]% power',
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
                default: 'motor [FOUR] rotates at [ONE] % power for [TWO][THREE]',
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
                default: 'motor [TWO] rotates at [ONE] % power indefinitely',
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
                default: 'stop motors',
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
                    default: 'moves forward',
                    description: 'robotmove.menuDir.forward'
                }),
                value: '2'
            },
            {
            //   text: '后退',
                text: formatMessage({
                    id: 'robotmove.menuDir.backward',
                    default: 'moves backward',
                    description: 'robotmove.menuDir.backward'
                }),
                value: '3'
            },

             {
                // text: '右转',
                text: formatMessage({
                    id: 'robotmove.menuDir.turnright',
                    default: 'turns right',
                    description: 'robotmove.menuDir.turnright'
                }),
                value: '5'
              },
            {
                // text: '左转',
                text: formatMessage({
                    id: 'robotmove.menuDir.turnleft',
                    default: 'turns left',
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
                        default: 'secs',
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
                        default: 'left wheel',
                        description: 'robotmove.menuDir.leftWheel'
                    }),
                    value: '0'
                },
                {
                    // text: '右轮',
                     text: formatMessage({
                        id: 'robotmove.menuDir.rightWheel',
                        default: 'right wheel',
                        description: 'robotmove.menuDir.rightWheel'
                    }),
                    value: '1'
                },
                
            ]
        },
    }
    };
  }


  waitForThreeZeros(timeoutMs = 6000) {
    // return new Promise((resolve, reject) => {
    //     const timer = setTimeout(() => {
    //     // 超时
    //     this.responseQueue = this.responseQueue.filter(item => item.resolve !== resolve);
    //     reject(new Error(`等待超时（>${timeoutMs}ms 未收到连续三个 0）`));
    //     }, timeoutMs);

    //     // 推入队列
    //     this.responseQueue.push({ resolve, reject, timer });
    // });
        return new Promise((resolve) => {
            this.responseQueue.push({ resolve });
        });
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


    waitForArrayMatchInArray(expectedArray, timeout = 6000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();

            console.log('进入阻塞函数')
            // 定义临时监听器
            const handleMessage = (event) => {
                console.log('进入监听')
                const currentArray = event.data; // 来自 BroadcastChannel 的数据

                // 确保是数组并且匹配条件
                if (Array.isArray(currentArray) && currentArray[0] === expectedArray[0]) {
                    if (
                        currentArray.length === expectedArray.length &&
                        currentArray.every((val, i) => val === expectedArray[i])
                    ) {
                        cleanup();
                        resolve(currentArray);
                    }
                }

                // 超时判断
                if (Date.now() - startTime > timeout) {
                    console.log('超时')
                    cleanup();
                    reject(new Error('Timeout waiting for array to match.'));
                }
            };

            // 清理函数：移除监听器
            const cleanup = () => {
                this.channel.removeEventListener('message', handleMessage);
            };

            // 添加临时监听器
            this.channel.addEventListener('message', handleMessage);
        });
    }


    toTwoDigitHexadecimalPair(decimal) {
        if (decimal < 0) {
            throw new Error("Input must be a non-negative integer");
        }

        const rightHex = decimal % 256; // 右边的两位十六进制数表示255以内的数
        const leftHex = Math.floor(decimal / 256); // 左边的两位十六进制数表示右边数满255时往左边进位的次数

        return [
            // leftHex.toString(16).padStart(2, '0'), // 转换为两位十六进制字符串
            // rightHex.toString(16).padStart(2, '0'), // 转换为两位十六进制字符串
            leftHex,
            rightHex
        ];
    }
    signedToHexValue(num, bits = 8) {
        let mask = (1 << bits) - 1;
        return num & mask; // 返回数值
    }
  async move(args){
    if(this.mode){
        

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
            if(socket.getIp().length==0){
                this.showToast('未连接机器人')
                this.runtime.stopAll();
                return
            }
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
            // this.channelPort.postMessage(str)
            await this.sendCommandAndWaitForSuccess(str)
            // this.channelPort.postMessage(str)
            // if(args.ONE=='1'){
            //     this.sendCommandAndWaitForSuccess(JSON.stringify([0XAA,0x01,0x09]))//停止
            // }else if(args.ONE == '2'){
            //     this.sendCommandAndWaitForSuccess(JSON.stringify([0XAA,0x01,0x01,0x01,Number(args.TWO)]))
            // }else if(args.ONE == '3'){
            //     this.sendCommandAndWaitForSuccess(JSON.stringify([0XAA,0x01,0x01,0x02,Number(args.TWO)]))
            // }else if(args.ONE == '4'){
            //     this.sendCommandAndWaitForSuccess(JSON.stringify([0XAA,0x01,0x01,0x03,Number(args.TWO)]))
            // }else if(args.ONE == '5'){
            //     this.sendCommandAndWaitForSuccess(JSON.stringify([0XAA,0x01,0x01,0x04,Number(args.TWO)]))
            // }

        }else if(this.whatSendFun=='ble'){
            const ackPromise = this.waitForThreeZeros(); 
            if(args.ONE=='1'){
                socketBle.getSocket().send(JSON.stringify([0XAA,0x01,0x09]))//停止
            }else if(args.ONE == '2'){
                socketBle.getSocket().send(JSON.stringify([0XAA,0x01,0x01,0x01,this.signedToHexValue(Number(args.TWO))]))
            }else if(args.ONE == '3'){
                socketBle.getSocket().send(JSON.stringify([0XAA,0x01,0x01,0x02,this.signedToHexValue(Number(args.TWO))]))
            }else if(args.ONE == '4'){
                socketBle.getSocket().send(JSON.stringify([0XAA,0x01,0x01,0x03,this.signedToHexValue(Number(args.TWO))]))
            }else if(args.ONE == '5'){
                socketBle.getSocket().send(JSON.stringify([0XAA,0x01,0x01,0x04,this.signedToHexValue(Number(args.TWO))]))
            }

            await ackPromise
            
        }
        

        // this.channelPort.postMessage(str)
        // await new Promise(resolve => setTimeout(resolve, 50));
    }

    
  }


  // 封装 Promise + 超时
//   createPromiseForSerial(timeoutMs = 6000) {
//     return new Promise((resolve, reject) => {
//       const timer = setTimeout(() => {
//         // 超时清理
//         this.responseQueue = this.responseQueue.filter(item => item.resolve !== resolve);
//         reject(new Error(`等待超时（>${timeoutMs}ms 未收到数据）`));
//       }, timeoutMs);

//       this.responseQueue.push({ resolve, reject, timer });
//     });
//   }

  async sendCommandAndWaitForSuccess(command) {
    //  try {
    //   const promise = this.createPromiseForSerial();
    //   this.channelPort.postMessage(command); // 发命令
    //   await promise; // 等待对应返回
    //   return true;
    // } catch (err) {
    //   console.error("❌ 命令执行失败:", err);
    //   throw err;
    // }
  
    return new Promise(async(resolve, reject) => {
      
        let resolved = false; // 防止多次 resolve
  
      // 响应监听器
      const onMessage = (e) => {
        const data = e.data;
        console.log(data)
        if (Array.isArray(data) && data.length==1 && data[0] === 0) {
            if (!resolved) {
                resolved = true;
                this.channelSerialData.removeEventListener('message', onMessage);
                resolve();
            }
        }else if (typeof data === "string" && data.includes("[0]")) {
            if (!resolved) {
                resolved = true;
                this.channelSerialData.removeEventListener('message', onMessage);
                resolve();
            }
      }
      };
  
      this.channelSerialData.addEventListener('message', onMessage);
      await new Promise(resolve => setTimeout(resolve, 80));
      // 发送命令
      this.channelPort.postMessage(command);
  
      // 可选：超时机制（比如 5 秒）
    //   setTimeout(() => {
    //     this.channelSerialData.removeEventListener('message', onMessage);
    //     reject(new Error('超时未收到 success'));
    //   }, 5000);
    });
  }
  async moveDirTime(args){
    if(this.mode){
        

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
            if(socket.getIp().length==0){
                this.showToast('未连接机器人')
                this.runtime.stopAll();
                return
            }
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
        }else if(this.whatSendFun=='port'){
            // this.channelPort.postMessage(str)
            await this.sendCommandAndWaitForSuccess(str)
            // if(args.ONE == '2'){
            //     // socketBle.getSocket().send(JSON.stringify([`icrobot.motor.move_forward(${Number(args.TWO)},duration=${Number(args.THREE)},distance=-1)\n`]))
            //     this.sendCommandAndWaitForSuccess(JSON.stringify([0xAA,0x01,0x02,0x01,Number(args.TWO),this.toTwoDigitHexadecimalPair(Number(args.THREE))[0],this.toTwoDigitHexadecimalPair(Number(args.THREE))[1]]))
            // }else if(args.ONE == '3'){
            //     // socketBle.getSocket().send(JSON.stringify([`icrobot.motor.move_backward(${Number(args.TWO)},duration=${Number(args.THREE)},distance=-1)\n`]))
            //     this.sendCommandAndWaitForSuccess(JSON.stringify([0xAA,0x01,0x02,0x02,Number(args.TWO),this.toTwoDigitHexadecimalPair(Number(args.THREE))[0],this.toTwoDigitHexadecimalPair(Number(args.THREE))[1]]))
            // }else if(args.ONE == '4'){
            //     // socketBle.getSocket().send(JSON.stringify([`icrobot.motor.turn_left(${Number(args.TWO)},duration=${Number(args.THREE)},distance=-1)\n`]))
            //     this.sendCommandAndWaitForSuccess(JSON.stringify([0xAA,0x01,0x02,0x03,Number(args.TWO),this.toTwoDigitHexadecimalPair(Number(args.THREE))[0],this.toTwoDigitHexadecimalPair(Number(args.THREE))[1]]))
            // }else if(args.ONE == '5'){
            //     // socketBle.getSocket().send(JSON.stringify([`icrobot.motor.turn_right(${Number(args.TWO)},duration=${Number(args.THREE)},distance=-1)\n`]))
            //     this.sendCommandAndWaitForSuccess(JSON.stringify([0xAA,0x01,0x02,0x04,Number(args.TWO),this.toTwoDigitHexadecimalPair(Number(args.THREE))[0],this.toTwoDigitHexadecimalPair(Number(args.THREE))[1]]))
            // }
        }else if(this.whatSendFun=='ble'){
            const ackPromise = this.waitForThreeZeros(); 
            if(args.ONE == '2'){
                // socketBle.getSocket().send(JSON.stringify([`icrobot.motor.move_forward(${Number(args.TWO)},duration=${Number(args.THREE)},distance=-1)\n`]))
                socketBle.getSocket().send(JSON.stringify([0xAA,0x01,0x02,0x01,this.signedToHexValue(Number(args.TWO)),this.toTwoDigitHexadecimalPair(Number(args.THREE))[0],this.toTwoDigitHexadecimalPair(Number(args.THREE))[1]]))
            }else if(args.ONE == '3'){
                // socketBle.getSocket().send(JSON.stringify([`icrobot.motor.move_backward(${Number(args.TWO)},duration=${Number(args.THREE)},distance=-1)\n`]))
                socketBle.getSocket().send(JSON.stringify([0xAA,0x01,0x02,0x02,this.signedToHexValue(Number(args.TWO)),this.toTwoDigitHexadecimalPair(Number(args.THREE))[0],this.toTwoDigitHexadecimalPair(Number(args.THREE))[1]]))
            }else if(args.ONE == '4'){
                // socketBle.getSocket().send(JSON.stringify([`icrobot.motor.turn_left(${Number(args.TWO)},duration=${Number(args.THREE)},distance=-1)\n`]))
                socketBle.getSocket().send(JSON.stringify([0xAA,0x01,0x02,0x03,this.signedToHexValue(Number(args.TWO)),this.toTwoDigitHexadecimalPair(Number(args.THREE))[0],this.toTwoDigitHexadecimalPair(Number(args.THREE))[1]]))
            }else if(args.ONE == '5'){
                // socketBle.getSocket().send(JSON.stringify([`icrobot.motor.turn_right(${Number(args.TWO)},duration=${Number(args.THREE)},distance=-1)\n`]))
                socketBle.getSocket().send(JSON.stringify([0xAA,0x01,0x02,0x04,this.signedToHexValue(Number(args.TWO)),this.toTwoDigitHexadecimalPair(Number(args.THREE))[0],this.toTwoDigitHexadecimalPair(Number(args.THREE))[1]]))
            }
            // await this.waitForArrayMatchInArray(() => [0xcc,0]);
            await ackPromise
            
        }
       
        // await new Promise(resolve => setTimeout(resolve, 50));
    }

   
  }

  async moveForwardDistance(args){
    if(this.mode){
        

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
            if(socket.getIp().length==0){
                this.showToast('未连接机器人')
                this.runtime.stopAll();
                return
            }
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
        }else if(this.whatSendFun=='port'){
            await this.sendCommandAndWaitForSuccess(str)
            // if(args.THREE=='2'){
            //     // socketBle.getSocket().send(JSON.stringify([`icrobot.motor.move_forward(${Number(args.ONE)},duration=-1,distance=${Number(args.TWO)})\n`]))
            //     this.sendCommandAndWaitForSuccess(JSON.stringify([0xAA,0x01,0x03,0x01,Number(args.ONE),this.toTwoDigitHexadecimalPair(Number(args.TWO))[0],this.toTwoDigitHexadecimalPair(Number(args.TWO))[1]]))
            // }else{
            //     // socketBle.getSocket().send(JSON.stringify([`icrobot.motor.move_backward(${Number(args.ONE)},duration=-1,distance=${Number(args.TWO)})\n`]))
            //     this.sendCommandAndWaitForSuccess(JSON.stringify([0xAA,0x01,0x03,0x02,Number(args.ONE),this.toTwoDigitHexadecimalPair(Number(args.TWO))[0],this.toTwoDigitHexadecimalPair(Number(args.TWO))[1]]))
            // }
        }else if(this.whatSendFun=='ble'){
            const ackPromise = this.waitForThreeZeros(); 
            if(args.THREE=='2'){
                // socketBle.getSocket().send(JSON.stringify([`icrobot.motor.move_forward(${Number(args.ONE)},duration=-1,distance=${Number(args.TWO)})\n`]))
                socketBle.getSocket().send(JSON.stringify([0xAA,0x01,0x03,0x01,this.signedToHexValue(Number(args.ONE)),this.toTwoDigitHexadecimalPair(Number(args.TWO))[0],this.toTwoDigitHexadecimalPair(Number(args.TWO))[1]]))
            }else{
                // socketBle.getSocket().send(JSON.stringify([`icrobot.motor.move_backward(${Number(args.ONE)},duration=-1,distance=${Number(args.TWO)})\n`]))
                socketBle.getSocket().send(JSON.stringify([0xAA,0x01,0x03,0x02,this.signedToHexValue(Number(args.ONE)),this.toTwoDigitHexadecimalPair(Number(args.TWO))[0],this.toTwoDigitHexadecimalPair(Number(args.TWO))[1]]))
            }
            // await this.waitForArrayMatchInArray(() =>[0xcc,0]);
            await ackPromise
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
            if(socket.getIp().length==0){
                this.showToast('未连接机器人')
                this.runtime.stopAll();
                return
            }
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
        }else if(this.whatSendFun=='port'){
            await this.sendCommandAndWaitForSuccess(str)
            // if(args.THREE=='4'){
            //     // socketBle.getSocket().send(JSON.stringify([`icrobot.motor.turn_left(${Number(args.ONE)},duration=-1,distance=${Number(args.TWO)})\n`]))
            //     this.sendCommandAndWaitForSuccess(JSON.stringify([0xAA,0x01,0x03,0x03,Number(args.ONE),this.toTwoDigitHexadecimalPair(Number(args.TWO))[0],this.toTwoDigitHexadecimalPair(Number(args.TWO))[1]]))
            // }else{
            //     // socketBle.getSocket().send(JSON.stringify([`icrobot.motor.turn_right(${Number(args.ONE)},duration=-1,distance=${Number(args.TWO)})\n`]))
            //     this.sendCommandAndWaitForSuccess(JSON.stringify([0xAA,0x01,0x03,0x04,Number(args.ONE),this.toTwoDigitHexadecimalPair(Number(args.TWO))[0],this.toTwoDigitHexadecimalPair(Number(args.TWO))[1]]))
            // }
        }else if(this.whatSendFun=='ble'){
            const ackPromise = this.waitForThreeZeros(); 
            if(args.THREE=='4'){
                // socketBle.getSocket().send(JSON.stringify([`icrobot.motor.turn_left(${Number(args.ONE)},duration=-1,distance=${Number(args.TWO)})\n`]))
                socketBle.getSocket().send(JSON.stringify([0xAA,0x01,0x03,0x03,this.signedToHexValue(Number(args.ONE)),this.toTwoDigitHexadecimalPair(Number(args.TWO))[0],this.toTwoDigitHexadecimalPair(Number(args.TWO))[1]]))
            }else{
                // socketBle.getSocket().send(JSON.stringify([`icrobot.motor.turn_right(${Number(args.ONE)},duration=-1,distance=${Number(args.TWO)})\n`]))
                socketBle.getSocket().send(JSON.stringify([0xAA,0x01,0x03,0x04,this.signedToHexValue(Number(args.ONE)),this.toTwoDigitHexadecimalPair(Number(args.TWO))[0],this.toTwoDigitHexadecimalPair(Number(args.TWO))[1]]))
            }
            // await this.waitForArrayMatchInArray(() =>[0xcc,0]);
            await ackPromise

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
            if(socket.getIp().length==0){
                this.showToast('未连接机器人')
                this.runtime.stopAll();
                return
            }
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
            await this.sendCommandAndWaitForSuccess(str)
            // this.channelPort.postMessage(str)
            // this.sendCommandAndWaitForSuccess(JSON.stringify([0xAA,0x01,0x04,Number(args.ONE),Number(args.TWO)]))
        }else if(this.whatSendFun=='ble'){
            const ackPromise = this.waitForThreeZeros(); 
            // socketBle.getSocket().send(JSON.stringify([`icrobot.motor.drive(${Number(args.ONE)},${Number(args.TWO)})\n`]))
            socketBle.getSocket().send(JSON.stringify([0xAA,0x01,0x04,this.signedToHexValue(Number(args.ONE)),this.signedToHexValue(Number(args.TWO))]))
            await ackPromise
        }
        
        // await new Promise(resolve => setTimeout(resolve, 50));
    }

    
  }

  async moveLeftSpeed(args){
    if(this.mode){
       
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
             if(socket.getIp().length==0){
                this.showToast('未连接机器人')
                this.runtime.stopAll();
                return
            }
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
        }else if(this.whatSendFun=='port'){
            await this.sendCommandAndWaitForSuccess(str)
            // this.sendCommandAndWaitForSuccess(str)
            // if(args.FOUR=='0'){
            //     if(args.THREE=='cm'){
            //         // socketBle.getSocket().send(JSON.stringify([`icrobot.motor.leftmotor_drive(${Number(args.ONE)},duration=-1,distance=${Number(args.TWO)})\n`]))
            //         this.sendCommandAndWaitForSuccess(JSON.stringify([0xAA,0x01,0x06,0x01,Number(args.ONE),this.toTwoDigitHexadecimalPair(Number(args.TWO))[0],this.toTwoDigitHexadecimalPair(Number(args.TWO))[1]]))
            //     }else if(args.THREE=='秒'){
            //         // socketBle.getSocket().send(JSON.stringify([`icrobot.motor.leftmotor_drive(${Number(args.ONE)},duration=${Math.abs(Number(args.TWO))},distance=-1)\n`]))
            //         this.sendCommandAndWaitForSuccess(JSON.stringify([0xAA,0x01,0x05,0x01,Number(args.ONE),this.toTwoDigitHexadecimalPair(Number(args.TWO))[0],this.toTwoDigitHexadecimalPair(Number(args.TWO))[1]]))
            //     }
            // }else{
            //     if(args.THREE=='cm'){
            //         // socketBle.getSocket().send(JSON.stringify([`icrobot.motor.rightmotor_drive(${Number(args.ONE)},duration=-1,distance=${Number(args.TWO)})\n`]))
            //         this.sendCommandAndWaitForSuccess(JSON.stringify([0xAA,0x01,0x06,0x02,Number(args.ONE),this.toTwoDigitHexadecimalPair(Number(args.TWO))[0],this.toTwoDigitHexadecimalPair(Number(args.TWO))[1]]))
            //     }else if(args.THREE=='秒'){
            //         // socketBle.getSocket().send(JSON.stringify([`icrobot.motor.rightmotor_drive(${Number(args.ONE)},duration=${Math.abs(Number(args.TWO))},distance=-1)\n`]))
            //         this.sendCommandAndWaitForSuccess(JSON.stringify([0xAA,0x01,0x05,0x02,Number(args.ONE),this.toTwoDigitHexadecimalPair(Number(args.TWO))[0],this.toTwoDigitHexadecimalPair(Number(args.TWO))[1]]))
            //     }
            // }
        }else if(this.whatSendFun=='ble'){
            const ackPromise = this.waitForThreeZeros(); 
            if(args.FOUR=='0'){
                if(args.THREE=='cm'){
                    // socketBle.getSocket().send(JSON.stringify([`icrobot.motor.leftmotor_drive(${Number(args.ONE)},duration=-1,distance=${Number(args.TWO)})\n`]))
                    socketBle.getSocket().send(JSON.stringify([0xAA,0x01,0x06,0x01,Number(args.ONE),this.toTwoDigitHexadecimalPair(Number(args.TWO))[0],this.toTwoDigitHexadecimalPair(Number(args.TWO))[1]]))
                }else if(args.THREE=='秒'){
                    // socketBle.getSocket().send(JSON.stringify([`icrobot.motor.leftmotor_drive(${Number(args.ONE)},duration=${Math.abs(Number(args.TWO))},distance=-1)\n`]))
                    socketBle.getSocket().send(JSON.stringify([0xAA,0x01,0x05,0x01,Number(args.ONE),this.toTwoDigitHexadecimalPair(Number(args.TWO))[0],this.toTwoDigitHexadecimalPair(Number(args.TWO))[1]]))
                }
            }else{
                if(args.THREE=='cm'){
                    // socketBle.getSocket().send(JSON.stringify([`icrobot.motor.rightmotor_drive(${Number(args.ONE)},duration=-1,distance=${Number(args.TWO)})\n`]))
                    socketBle.getSocket().send(JSON.stringify([0xAA,0x01,0x06,0x02,this.signedToHexValue(Number(args.ONE)),this.toTwoDigitHexadecimalPair(Number(args.TWO))[0],this.toTwoDigitHexadecimalPair(Number(args.TWO))[1]]))
                }else if(args.THREE=='秒'){
                    // socketBle.getSocket().send(JSON.stringify([`icrobot.motor.rightmotor_drive(${Number(args.ONE)},duration=${Math.abs(Number(args.TWO))},distance=-1)\n`]))
                    socketBle.getSocket().send(JSON.stringify([0xAA,0x01,0x05,0x02,this.signedToHexValue(Number(args.ONE)),this.toTwoDigitHexadecimalPair(Number(args.TWO))[0],this.toTwoDigitHexadecimalPair(Number(args.TWO))[1]]))
                }
            }
            // await this.waitForArrayMatchInArray(() =>[0xcc,0]);
            await ackPromise
        }
        
    }

    socket.setLastPostTime(Date.now())
  }


  async moveLeftForeverSpeed(args){
    if(this.mode){
        
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
            if(socket.getIp().length==0){
                this.showToast('未连接机器人')
                this.runtime.stopAll();
                return
            }
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
            await this.sendCommandAndWaitForSuccess(str)
            // this.channelPort.postMessage(str)
            // if(args.TWO=='0'){
            //     // socketBle.getSocket().send(JSON.stringify([`icrobot.motor.leftmotor_drive(${Number(args.ONE)},duration=-1,distance=-1)\n`]))
            //     this.sendCommandAndWaitForSuccess(JSON.stringify([0xAA,0x01,0x07,0x01,Number(args.ONE)]))
            // }else{
            //     // socketBle.getSocket().send(JSON.stringify([`icrobot.motor.rightmotor_drive(${Number(args.ONE)},duration=-1,distance=-1)\n`]))
            //     this.sendCommandAndWaitForSuccess(JSON.stringify([0xAA,0x01,0x07,0x02,Number(args.ONE)]))
            // }
        }else if(this.whatSendFun=='ble'){
            const ackPromise = this.waitForThreeZeros(); 
            if(args.TWO=='0'){
                // socketBle.getSocket().send(JSON.stringify([`icrobot.motor.leftmotor_drive(${Number(args.ONE)},duration=-1,distance=-1)\n`]))
                socketBle.getSocket().send(JSON.stringify([0xAA,0x01,0x07,0x01,this.signedToHexValue(Number(args.ONE))]))
            }else{
                // socketBle.getSocket().send(JSON.stringify([`icrobot.motor.rightmotor_drive(${Number(args.ONE)},duration=-1,distance=-1)\n`]))
                socketBle.getSocket().send(JSON.stringify([0xAA,0x01,0x07,0x02,this.signedToHexValue(Number(args.ONE))]))
            }
            await ackPromise
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
             if(socket.getIp().length==0){
                this.showToast('未连接机器人')
                this.runtime.stopAll();
                return
            }
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
            // this.channelPort.postMessage(str)
            await this.sendCommandAndWaitForSuccess(str)
            // this.sendCommandAndWaitForSuccess(JSON.stringify([0xAA,0x01,0x08]))
        }else if(this.whatSendFun=='ble'){
            const ackPromise = this.waitForThreeZeros(); 
            // socketBle.getSocket().send(JSON.stringify([`icrobot.motor.move_stop()\n`]))
            socketBle.getSocket().send(JSON.stringify([0xAA,0x01,0x08]))
            await ackPromise
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
