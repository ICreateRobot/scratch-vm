const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type')
const socket=require('../../util/socket-connect')
const actuatorIcon = require('./actuator.svg')
const innerHand = require('./innerHand.svg')
const innerPort = require('./innerPort.svg')
const formatMessage = require('format-message');
const socketBle = require('../../util/localSocket')
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

class RobotExtend {
    constructor(runtime){
        this.runtime=runtime


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
            if(!this.mode){
                socket.closeSocket()
                // socket.closeSocketRecive()
            }
        })

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
        this.distance

        this.channel = new BroadcastChannel('distance_channel');
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
        this.channelSerialData=new BroadcastChannel('serial-data')
        
    }
  getInfo() {

    return {
      id: 'robotextend',
      name: formatMessage({
                id: 'robotextend.name',
                default: 'External Microbit',
                description: 'robotextend.name'
            }),
      color1:'#33cccc',
      menuIconURI: actuatorIcon,
      blocks: [
        {
            blockType: BlockType.LABEL,
            text: formatMessage({
                id: 'robotextend.actuator',
                default: 'actuator',
                description: 'robotextend.actuator'
            }),
        },
        {
            opcode: 'motor',
            blockType: BlockType.COMMAND,
            // text: '舵机转动至[ONE]度',
            text: formatMessage({
                id: 'robotactuator.motor',
                default: 'Servo rotates to [ONE] degrees',
                description: 'robotactuator.motor'
            }),
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    defaultValue:90
                },
            }
        },


        {
            blockType: BlockType.LABEL,
            text: formatMessage({
                id: 'robotextend.sensor',
                default: 'sensor',
                description: 'robotextend.sensor'
            }),
        },

         {
            opcode: 'joystickBool',
            blockType: BlockType.BOOLEAN,
            text: formatMessage({
                id: 'robotextend.joystickBool',
                default: 'Joystick detected  [ONE]',
                description: 'robotextend.joystickBool'
            }),
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu:'MENU_DIR'
                }
            },
            disableMonitor: true
        },


        {
            opcode: 'joystickRepo',
            blockType: BlockType.REPORTER,
            text: formatMessage({
                id: 'robotextend.joystickRepo',
                default: 'Joystick [ONE] Direction',
                description: 'robotextend.joystickRepo'
            }),
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu:'MENU_XY'
                }
            },
            disableMonitor: true
        },
        
        

      ],

      menus: {
        MENU_DIR: {
          acceptReporters: false,
          items: [
            {
                text: formatMessage({
                    id: 'robotextend.Dir.up',
                    default: 'up',
                    description: 'robotextend.Dir.up'
                }),
                value: '0'
              },
            {
              text: formatMessage({
                    id: 'robotextend.Dir.down',
                    default: 'down',
                    description: 'robotextend.Dir.down'
                }),
              value: '1'
            },
            {
              text: formatMessage({
                    id: 'robotextend.Dir.left',
                    default: 'left',
                    description: 'robotextend.Dir.left'
                }),
              value: '2'
            },
            {
                text: formatMessage({
                    id: 'robotextend.Dir.right',
                    default: 'right',
                    description: 'robotextend.Dir.right'
                }),
                value: '3'
            },
             
          ]
        },
        MENU_XY: {
          acceptReporters: false,
          items: [
            {
                text: 'X',
                value: '0'
              },
            {
              text: 'Y',
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



    sendCommandAndWaitForSuccess(command) {
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


  async motor(args){
    if(this.mode){
        
        let currentTime=Date.now()


        let jsonData={
            "command":"expand",
            "params":{
                "mode":0,
                "data":Number(args.ONE)
            }
        }
        // let str = `robot.send_fire(${args.ONE},1,${args.TWO})`;
        let str = JSON.stringify(jsonData)
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
                socket.getSocket().send(str);
            }else if(socket.checkWebSocketStatus()==1){
                this.showToast("socket正在连接中，请稍后");
                this.runtime.stopAll();
            }
            socket.setLastPostTime(Date.now())
        }else if(this.whatSendFun=='port'){
            // this.channelPort.postMessage(str)
            await this.sendCommandAndWaitForSuccess(str)
            // this.sendCommandAndWaitForSuccess(JSON.stringify([0XAA,0x01,0x31,0x02,Number(args.ONE),mode]))
        }else if(this.whatSendFun=='ble'){
            // const ackPromise = this.waitForThreeZeros(); 
            // socketBle.getSocket().send(JSON.stringify([0XAA,0x01,0x31,0x02,Number(args.ONE),mode]))
            // await ackPromise
        }
        
        // await new Promise(resolve => setTimeout(resolve, 3000)); 
    }
    

    
  }
    async joystickBool(args){

    }
    async joystickRepo(args){

    }


}


module.exports = RobotExtend;
