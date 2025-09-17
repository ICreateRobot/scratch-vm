const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type')
const socket=require('../../util/socket-connect')

const soundIcon = require('./sound.svg')
const socketBle = require('../../util/localSocket')
const formatMessage = require('format-message');

const innerBlock = require('./innerBlock.svg')
let newSocket;
let isConnectEventSource=false
let eventSource
let scratchGet=[]
let socketSound

class RobotSound {
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


        this.currentVol=0

        this.musicTime={
            'alarm.wav':1000,
            'ambulance.wav':2000,
            'background.wav':15000,
            'bicycle.wav':1000,
            'bird.wav':1000,
            'car.wav':1000,
            'cat.wav':1000,
            'cock.wav':1000,
            'cow.wav':1000,
            'dog.wav':1000,
            'failure.wav':1000,
            'fireEngine.wav':5000,
            'gunfire.wav':1000,
            'hit.wav':1000,
            'horse.wav':1000,
            'pig.wav':1000,
            'police.wav':1000,
            'sheep.wav':1000,
            'tiger.wav':1000,
            'train.wav':1000,
            'victory.wav':1000,
            'wowu_.wav':1000,

        }

        this.upLoadSound=[]
        this.isSendEnd=true
        this.shouldStopSending = false; // 默认不停止

        // this.whatSendFun='net'
        // this.channelPort = new BroadcastChannel('channelPort')
        // this.channelPort.addEventListener('message',(event)=>{
        //     console.log(event.data)
        //     if(event.data){
        //         this.whatSendFun='port'
        //     }else{
        //         this.whatSendFun='net'
        //     }
            
        // })

        // this.channelBle = new BroadcastChannel('isBle')
        // this.channelBle.addEventListener('message',(event)=>{
            
        //     if(event.data){
        //         console.log('当前为蓝牙模式')
        //         if(!socketBle.getSocket()){
        //             socketBle.setSocket()
        //         }
        //         this.whatSendFun='ble'
        //     }else{
        //         // if(socketBle.getSocket()){
        //         //     socketBle.getSocket().close()
        //         // }
        //         this.whatSendFun='net'
        //     }
        // })
        // this.whatSendFun='net'
        // this.isPortConnected = false
        // this.isBleConnected = false
        // this.channelSendIp=new BroadcastChannel('sendIp')
        // this.channelSendIp.addEventListener('message',(event)=>{
        //     console.log('设置ip')
        //     // socket.setIp(event.data)
        //     // this.whatSendFun='net'
        //     this.updateSendFun()
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
        //         this.isBleConnected = !!event.data

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
      id: 'robotsound',
      name: formatMessage({
            id: 'robotsound.name',
            default: 'Playback',
            description: 'robotsound.name'
        }),
      color1: '#6a5acd',
    //   color3: '#ff0000',
    menuIconURI: soundIcon,
    blockIconURI:innerBlock,
      blocks: [

        {
            func:'selectSound',
            blockType:BlockType.BUTTON,
            // text:'选择上传音频文件'
            text: formatMessage({
                id: 'robotsound.selectSound',
                default: 'Select audio file to upload',
                description: 'robotsound.selectSound'
            }),
        },

        // {
        //     func:'downLoadSound',
        //     blockType:BlockType.BUTTON,
        //     text:'下载音频文件至机器人'
        // },

        {
            opcode: 'setVol',
            blockType: BlockType.COMMAND,
            // text: '音量设置为[ONE]',
            text: formatMessage({
                id: 'robotsound.setVol',
                default: 'Set volume to [ONE]',
                description: 'robotsound.setVol'
            }),
            arguments:{
                ONE:{
                    type: ArgumentType.NUMRES0_10,
                    defaultValue:7
                },
            },
        },

        {
            opcode: 'musicUntil',
            blockType: BlockType.COMMAND,
            // text: '播放音乐[ONE] 直到播放完毕',
            text: formatMessage({
                id: 'robotsound.musicUntil',
                default: 'Play music [ONE] until finished',
                description: 'robotsound.musicUntil'
            }),
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu:'MENU_MUSIC'
                },
            },
        },

        {
            opcode: 'music',
            blockType: BlockType.COMMAND,
            // text: '播放音乐[ONE]',
            text: formatMessage({
                id: 'robotsound.music',
                default: 'Play music [ONE]',
                description: 'robotsound.music'
            }),
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu:'MENU_MUSIC'
                },
            },
        },

        {
            opcode: 'musicStop',
            blockType: BlockType.COMMAND,
            // text: '停止播放',
            text: formatMessage({
                id: 'robotsound.musicStop',
                default: 'Stop playback',
                description: 'robotsound.musicStop'
            }),
            arguments:{
                
            },
        },

        {
            opcode: 'playLocalMusic',
            blockType: BlockType.COMMAND,
            // text: '[TWO]本地声音[ONE]',
            text: formatMessage({
                id: 'robotsound.playLocalMusic',
                default: '[TWO] local sound [ONE]',
                description: 'robotsound.playLocalMusic'
            }),
            arguments:{
                ONE:{
                    type:ArgumentType.STRING,
                    menu:'MENU_SOUND'
                },
                TWO:{
                    type:ArgumentType.STRING,
                    menu:'MENU_LOCAL_STATE'
                }
            },
        },

        // {
        //     opcode: 'soundTurbo',
        //     blockType: BlockType.COMMAND,
        //     text: '本地声音[ONE]',
        //     arguments:{
        //         ONE:{
        //             type:ArgumentType.SOUND,
        //         },
        //     },
        // },

        // {
        //     opcode: 'sendMusic',
        //     blockType: BlockType.COMMAND,
        //     text: '开始发送声音',
        //     arguments:{
                
        //     },
        // },
        // {
        //     opcode: 'stopSendMusic',
        //     blockType: BlockType.COMMAND,
        //     text: '结束发送声音',
        //     arguments:{
                
        //     },
        // },

        // {
        //     opcode: 'tts',
        //     blockType: BlockType.COMMAND,
        //     text: '将[ONE]转为语音并发送',
        //     arguments:{
        //         ONE:{
        //             type: ArgumentType.STRING,
        //             defaultValue:'hello'
        //         },
        //     },
        // },


        // {
        //     opcode: 'addSound',
        //     blockType: BlockType.COMMAND,
        //     text: '将音量增加1',
        //     arguments:{
                
        //     },
        // },

        // {
        //     opcode: 'subSound',
        //     blockType: BlockType.COMMAND,
        //     text: '将音量减少1',
        //     arguments:{
                
        //     },
        // },
        

      ],

      menus: {
       
        MENU_COMPARE: {
            acceptReporters: false,
            items: [
                {
                    text: '>',
                    value: '>'
                },
                {
                    text: '<',
                    value: '<'
                },
                {
                    text: '=',
                    value: '='
                }
                
            ]
        },

        MENU_SOUND:{
            acceptReporters: false,
            items:'getSoundList'
        },

        MENU_LOCAL_STATE:{
            acceptReporters: false,
            items: [
                {
                    text: formatMessage({
                        id: 'robotsound.menuLocalState.start',
                        default: 'Play',
                        description: 'robotsound.menuLocalState.start'
                    }),
                    value: '0'
                },
                {
                    text: formatMessage({
                        id: 'robotsound.menuLocalState.stop',
                        default: 'Stop',
                        description: 'robotsound.menuLocalState.stop'
                    }),
                    value: '1'
                },
            ]
        },

       
        MENU_MUSIC:{
            acceptReporters: false,
            items: [
                {
                    text: formatMessage({
                        id: 'robotsound.menuMusic.car',
                        default: 'Car',
                        description: 'robotsound.menuMusic.car'
                    }),
                    value: 'car.wav'
                },
                {
                    text: formatMessage({
                        id: 'robotsound.menuMusic.cat',
                        default: 'Cat',
                        description: 'robotsound.menuMusic.cat'
                    }),
                    value: 'cat.wav'
                },
                {
                    text: formatMessage({
                        id: 'robotsound.menuMusic.dog',
                        default: 'Dog',
                        description: 'robotsound.menuMusic.dog'
                    }),
                    value: 'dog.wav'
                },

                {
                    text: formatMessage({
                        id: 'robotsound.menuMusic.alarm',
                        default: 'Alarm',
                        description: 'robotsound.menuMusic.alarm'
                    }),
                    value: 'alarm.wav'
                },
                {
                    text: formatMessage({
                        id: 'robotsound.menuMusic.ambulance',
                        default: 'Ambulance',
                        description: 'robotsound.menuMusic.ambulance'
                    }),
                    value: 'ambulance.wav'
                },
                {
                    text: formatMessage({
                        id: 'robotsound.menuMusic.background',
                        default: 'Background Music',
                        description: 'robotsound.menuMusic.background'
                    }),
                    value: 'background.wav'
                },


                {
                    text: formatMessage({
                        id: 'robotsound.menuMusic.bicycle',
                        default: 'Bicycle',
                        description: 'robotsound.menuMusic.bicycle'
                    }),
                    value: 'bicycle.wav'
                },
                {
                    text: formatMessage({
                        id: 'robotsound.menuMusic.bird',
                        default: 'Bird',
                        description: 'robotsound.menuMusic.bird'
                    }),
                    value: 'bird.wav'
                },
                {
                    text: formatMessage({
                        id: 'robotsound.menuMusic.cock',
                        default: 'Rooster',
                        description: 'robotsound.menuMusic.cock'
                    }),
                    value: 'cock.wav'
                },


                {
                    text: formatMessage({
                        id: 'robotsound.menuMusic.cow',
                        default: 'Cow',
                        description: 'robotsound.menuMusic.cow'
                    }),
                    value: 'cow.wav'
                },
                {
                    text: formatMessage({
                        id: 'robotsound.menuMusic.failure',
                        default: 'Failure',
                        description: 'robotsound.menuMusic.failure'
                    }),
                    value: 'failure.wav'
                },
                {
                    text: formatMessage({
                        id: 'robotsound.menuMusic.fireEngine',
                        default: 'Fire Truck',
                        description: 'robotsound.menuMusic.fireEngine'
                    }),
                    value: 'fireEngine.wav'
                },

                {
                    text: formatMessage({
                        id: 'robotsound.menuMusic.gunfire',
                        default: 'Shoot',
                        description: 'robotsound.menuMusic.gunfire'
                    }),
                    value: 'gunfire.wav'
                },
                {
                    text: formatMessage({
                        id: 'robotsound.menuMusic.hit',
                        default: 'Hit',
                        description: 'robotsound.menuMusic.hit'
                    }),
                    value: 'hit.wav'
                },
                {
                    text: formatMessage({
                        id: 'robotsound.menuMusic.horse',
                        default: 'Horse',
                        description: 'robotsound.menuMusic.horse'
                    }),
                    value: 'horse.wav'
                },

                {
                    text: formatMessage({
                        id: 'robotsound.menuMusic.pig',
                        default: 'Pig',
                        description: 'robotsound.menuMusic.pig'
                    }),
                    value: 'pig.wav'
                },
                {
                    text: formatMessage({
                        id: 'robotsound.menuMusic.police',
                        default: 'Police',
                        description: 'robotsound.menuMusic.police'
                    }),
                    value: 'police.wav'
                },
                {
                    text: formatMessage({
                        id: 'robotsound.menuMusic.sheep',
                        default: 'Sheep',
                        description: 'robotsound.menuMusic.sheep'
                    }),
                    value: 'sheep.wav'
                },
                {
                    text: formatMessage({
                        id: 'robotsound.menuMusic.train',
                        default: 'Train',
                        description: 'robotsound.menuMusic.train'
                    }),
                    value: 'train.wav'
                },
                {
                    text: formatMessage({
                        id: 'robotsound.menuMusic.victory',
                        default: 'Victory',
                        description: 'robotsound.menuMusic.victory'
                    }),
                    value: 'victory.wav'
                },
                {
                    text: formatMessage({
                        id: 'robotsound.menuMusic.wowu',
                        default: 'Cheer',
                        description: 'robotsound.menuMusic.wowu'
                    }),
                    value: 'wowu_.wav'
                },
                // {
                //     text: formatMessage({
                //         id: 'robotsound.menuMusic.customize',
                //         default: 'Custom Audio',
                //         description: 'robotsound.menuMusic.customize'
                //     }),
                //     value: 'customize.wav'
                // }


                
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
    }else if(message == "未与机器人建立wifi连接"){
        toast.textContent = formatMessage({
            id: 'robotimg.showToast.haveWifiCamera',
            default: 'Wi-Fi connection to the robot is not established.',
            description: 'robotimg.showToast.haveWifiCamera'
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
    async setVol(args){
        if(this.mode){
            this.currentVol=args.ONE
            

            let vol=Number(args.ONE)
            if(vol<0){
                vol=0
            }else if(vol>10){
                vol=10
            }
            let jsonData={
                "command":"speaker",
                "params":{
                    "mode":1,
                    "vol":vol,
                    "name":''
                }
            }
            // let str0=`${args.TWO.split('.')[0]} = robot.read_wav('/flash/${args.TWO}')\r`
            // let str = `robot.play_music(${args.ONE},${args.TWO.split('.')[0]})\r`;

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
                    // context.push(str0)
                    context.push(str)
                    await socket.setSocket(context)
                }else if(socket.checkWebSocketStatus()==2){
                    // socket.getSocket().send(str0);
                    // await new Promise(resolve => setTimeout(resolve, 50));  // 等待1秒
                    socket.getSocket().send(str);
                    await new Promise(resolve => setTimeout(resolve, 50));  // 等待1秒
                }else if(socket.checkWebSocketStatus()==1){
                    this.showToast("socket正在连接中，请稍后");
                    this.runtime.stopAll();
                }
                socket.setLastPostTime(Date.now())
            }else if(this.whatSendFun=='port'){
                // this.channelPort.postMessage(str)
                await this.sendCommandAndWaitForSuccess(str)
                // this.sendCommandAndWaitForSuccess(JSON.stringify([0XAA,0x01,0x20,vol]))
            }else if(this.whatSendFun=='ble'){
                const ackPromise = this.waitForThreeZeros();
                socketBle.getSocket().send(JSON.stringify([0XAA,0x01,0x20,vol]))
                await ackPromise
            }
           
        }
    }

    stringToBinary(str) {
        const encoder = new TextEncoder();
        const uint8Array = encoder.encode(str);
        return uint8Array;
    }
    async musicUntil(args){
        if(this.mode){

            

            let jsonData={
                "command":"speaker",
                "params":{
                    "mode":2,
                    "vol":0,
                    "name":`/flash/${args.ONE}`
                }
            }
            // let str0=`${args.TWO.split('.')[0]} = robot.read_wav('/flash/${args.TWO}')\r`
            // let str = `robot.play_music(${args.ONE},${args.TWO.split('.')[0]})\r`;

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
                    // context.push(str0)
                    context.push(str)
                    await socket.setSocket(context)
                }else if(socket.checkWebSocketStatus()==2){
                    // socket.getSocket().send(str0);
                    // await new Promise(resolve => setTimeout(resolve, 50));  // 等待1秒
                    socket.getSocket().send(str);
                    await new Promise(resolve => setTimeout(resolve, 50));  // 等待1秒
                }else if(socket.checkWebSocketStatus()==1){
                    this.showToast("socket正在连接中，请稍后");
                    this.runtime.stopAll();
                }
                await new Promise(resolve => setTimeout(resolve, this.musicTime[args.ONE]));  // 等待1秒
                socket.setLastPostTime(Date.now())
            }else if(this.whatSendFun=='port'){
                this.channelPort.postMessage(str)
                // this.channelPort.postMessage(JSON.stringify([0XAA,0x01,0x21,0x02,...this.stringToBinary(`/flash/${args.ONE}`)]))
                await new Promise(resolve => setTimeout(resolve, this.musicTime[args.ONE]));  

            }else if(this.whatSendFun=='ble'){
                const ackPromise = this.waitForThreeZeros();
                socketBle.getSocket().send(JSON.stringify([0XAA,0x01,0x21,0x02,...this.stringToBinary(`/flash/${args.ONE}`)]))
                // await this.waitForArrayMatchInArray(() => [0xcc,0]);
                await ackPromise
            }
           
        }
    }

    async music(args){
        if(this.mode){

             

            let jsonData={
                "command":"speaker",
                "params":{
                    "mode":3,
                    "vol":0,
                    "name":`/flash/${args.ONE}`
                }
            }
            // let str0=`${args.TWO.split('.')[0]} = robot.read_wav('/flash/${args.TWO}')\r`
            // let str = `robot.play_music(${args.ONE},${args.TWO.split('.')[0]})\r`;

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
                    // context.push(str0)
                    context.push(str)
                    await socket.setSocket(context)
                }else if(socket.checkWebSocketStatus()==2){
                    // socket.getSocket().send(str0);
                    // await new Promise(resolve => setTimeout(resolve, 50));  // 等待1秒
                    socket.getSocket().send(str);
                    await new Promise(resolve => setTimeout(resolve, 50));  // 等待1秒
                }else if(socket.checkWebSocketStatus()==1){
                    this.showToast("socket正在连接中，请稍后");
                    this.runtime.stopAll();
                }
                // await new Promise(resolve => setTimeout(resolve, 1000));  // 等待1秒
                socket.setLastPostTime(Date.now())
            }else if(this.whatSendFun=='port'){
                // this.channelPort.postMessage(str)
                await this.sendCommandAndWaitForSuccess(str)
                // this.sendCommandAndWaitForSuccess(JSON.stringify([0XAA,0x01,0x21,0x01,...this.stringToBinary(`/flash/${args.ONE}`)]))
            }else if(this.whatSendFun=='ble'){
                const ackPromise = this.waitForThreeZeros();
                socketBle.getSocket().send(JSON.stringify([0XAA,0x01,0x21,0x01,...this.stringToBinary(`/flash/${args.ONE}`)]))
                await ackPromise
            }
            
        }
    }

    async musicStop(){
        if(this.mode){


             
            this.shouldStopSending = true;
            let jsonData={
                "command":"speaker",
                "params":{
                    "mode":4,
                    "vol":0,
                    "name":''
                }
            }
            // let str0=`${args.TWO.split('.')[0]} = robot.read_wav('/flash/${args.TWO}')\r`
            // let str = `robot.play_music(${args.ONE},${args.TWO.split('.')[0]})\r`;

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
                    // context.push(str0)
                    context.push(str)
                    await socket.setSocket(context)
                }else if(socket.checkWebSocketStatus()==2){
                    // socket.getSocket().send(str0);
                    // await new Promise(resolve => setTimeout(resolve, 50));  // 等待1秒
                    socket.getSocket().send(str);
                    await new Promise(resolve => setTimeout(resolve, 50));  // 等待1秒
                }else if(socket.checkWebSocketStatus()==1){
                    this.showToast("socket正在连接中，请稍后");
                    this.runtime.stopAll();
                }
                socket.setLastPostTime(Date.now())
            }else if(this.whatSendFun=='port'){
                // this.channelPort.postMessage(str)
                await this.sendCommandAndWaitForSuccess(str)
                // this.sendCommandAndWaitForSuccess(JSON.stringify([0XAA,0x01,0x22]))
            }else if(this.whatSendFun=='ble'){
                const ackPromise = this.waitForThreeZeros();
                socketBle.getSocket().send(JSON.stringify([0XAA,0x01,0x22]))
                await ackPromise
            }
           

            

            //  const Socket = new WebSocket(`ws://${socket.getIp()}:8084`);
                                
            // Socket.addEventListener('open', async (event) => {
            //     console.log('连接成功');
            //     Socket.send(str)
            //     await new Promise(resolve => setTimeout(resolve, 100));
            //     Socket.close()
    
                    
            // });
        }
    }


    async selectAndProcessAudio() {
        return new Promise((resolve, reject) => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = '.wav';
          input.style.display = 'none';
      
          input.addEventListener('change', async (event) => {
            const file = event.target.files[0];
            if (!file) {
              reject(new Error('未选择文件'));
              input.remove();
              return;
            }

             // ✅ 严格检查文件扩展名和 MIME 类型
            const isValid = file.name.toLowerCase().endsWith('.wav') &&
                            (file.type === 'audio/wav' || file.type === 'audio/x-wav');

            if (!isValid) {
                reject(new Error('只能选择 WAV 格式音频文件'));
                input.remove();
                return;
            }
      
            try {
              const processed = await this.processAudioFile(file);
              resolve(processed);
            } catch (err) {
              reject(err);
            } finally {
              input.remove(); // 清除 input
            }
          });
      
          document.body.appendChild(input);
          input.click(); // 自动触发文件选择
        });
    }

    async processAudioFile(file) {
        const arrayBuffer = await file.arrayBuffer();
        const audioContext = new AudioContext();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
        const inputData = audioBuffer.getChannelData(0); // 单通道
        const originalSampleRate = audioBuffer.sampleRate;
        const resampledData = this.resampleAudio(inputData, originalSampleRate, 16000);
        const pcm16 = this.floatTo16BitPCM(resampledData);
        return pcm16;
    }
      
    resampleAudio(inputData, srcRate, targetRate) {
        const ratio = srcRate / targetRate;
        const newLength = Math.floor(inputData.length / ratio);
        const output = new Float32Array(newLength);
        
        for (let i = 0; i < newLength; i++) {
            const idx = Math.floor(i * ratio);
            output[i] = inputData[idx];
        }
        
        return output;
    }
      
    floatTo16BitPCM(input) {
        const buffer = new ArrayBuffer(input.length * 2);
        const view = new DataView(buffer);
        
        for (let i = 0; i < input.length; i++) {
            const sample = Math.max(-1, Math.min(1, input[i]));
            view.setInt16(i * 2, sample * 0x7FFF, true);
        }
        
        return new Blob([view], { type: 'audio/wav' });
    }
      
      

    async selectSound(){
        try {
            const processedBlob = await this.selectAndProcessAudio();
            console.log('✅ 音频处理完成，Blob:', processedBlob);

            const arrayBuffer = await processedBlob.arrayBuffer();
            console.log(arrayBuffer)

            let name = await new Promise(resolve => {
                resolve(prompt('请输入音频名称'));  // 在异步函数中包装 prompt
            });

            this.upLoadSound.push({
                name:name,
                data:arrayBuffer
            })

            

        } catch (err) {
            console.error('❌ 处理失败:', err.message);
            alert('音频上传失败，请选择其他音频')
        }
    }
    async playLocalMusic(args){
        if(this.whatSendFun=='net'){
             if(args.TWO=='0'){
                if(socket.getIp().length==0){
                    this.showToast('未连接机器人')
                    this.runtime.stopAll();
                    return
                }
                console.log('执行了')
                console.log(this.isSendEnd)
                this.shouldStopSending = false;
                if(this.isSendEnd){
                    try {
                        // const processedBlob = await this.selectAndProcessAudio();
                        // console.log('✅ 音频处理完成，Blob:', processedBlob);
            
                        // const arrayBuffer = await processedBlob.arrayBuffer();
                        // console.log(arrayBuffer)
            
            
                        this.isSendEnd=false
                        console.log(this.upLoadSound[Number(args.ONE)].data)
                        let arrayBuffer=this.upLoadSound[Number(args.ONE)].data
            
                        socketSound = new WebSocket(`ws://${socket.getIp()}:8080`)
                        

                        socketSound.addEventListener('error', (e) => {
                            console.error('❌ WebSocket 连接出错:', e);
                            this.isSendEnd = true;
                        });
                        
                        socketSound.addEventListener('close', (e) => {
                            console.warn('🔌 WebSocket 已断开:', e.code, e.reason);
                            this.shouldStopSending = true;
                            if (!this.isSendEnd) {
                                this.isSendEnd = true;
                            }
                        });
                    
                        socketSound.addEventListener('open',async()=>{
                            
                            console.log('连接成功')
                            this.shouldStopSending = false;
                            this.isSendEnd=false
                            const chunkSize = 2048;
                            let offset = 44; // ✅ 跳过 WAV 头部 44 字节

                            let lastSendTime = performance.now(); // 初始化时间戳
                        
                            const sendChunk = () => {

                                if (this.shouldStopSending) {
                                    console.warn('⛔️ 发送被手动中断');
                                    const SocketDisMusic = new WebSocket(`ws://${socket.getIp()}:8084`);
                        
                                    SocketDisMusic.addEventListener('open', async (event) => {
                                        console.log('连接成功');
                                        SocketDisMusic.send('music')
                                        await new Promise(resolve => setTimeout(resolve, 100));
                                        SocketDisMusic.close()
                        
                                            
                                    });
                                    socketSound.close();
                                    this.isSendEnd = true;
                                    return;
                                }


                            if (offset >= arrayBuffer.byteLength) {
                                console.log('📤 所有音频数据发送完毕');

                                const SocketDisMusic = new WebSocket(`ws://${socket.getIp()}:8084`);
                        
                                SocketDisMusic.addEventListener('open', async (event) => {
                                    console.log('连接成功');
                                    SocketDisMusic.send('music')
                                    await new Promise(resolve => setTimeout(resolve, 100));
                                    SocketDisMusic.close()
                    
                                        
                                });
                                socketSound.close()
                                this.isSendEnd=true
                                return;
                            }
                        
                            const end = Math.min(offset + chunkSize, arrayBuffer.byteLength);
                            const chunk = arrayBuffer.slice(offset, end);
                            //   console.log(chunk)
                            // const now = performance.now(); // 获取当前时间戳（毫秒，浮点数）
                            // const interval = now - lastSendTime;
                            // lastSendTime = now;
                            // console.log(`📦 Chunk sent, size: ${chunk.byteLength}, interval: ${interval.toFixed(2)} ms`);

                            socketSound.send(chunk);
                            offset = end;
                        
                            setTimeout(sendChunk, 60); // 控制发送节奏
                            
                            };
                        
                            sendChunk();
                        })
            
                    } catch (err) {
                        console.error('❌ 处理失败:', err.message);
                        this.isSendEnd = true;
                    }
                }
            }else if(args.TWO=='1'){
                this.shouldStopSending = true;
            }
        }else{
            this.showToast('未与机器人建立wifi连接')
        }
       
       
        
    }


    // async playLocalMusic(args) {
    //     // 停止当前播放
    //     if (args.TWO === '1') {
    //         this.shouldStopSending = true;
    //         return;
    //     }

    //     // 正在播放中，强制中断
    //     if (!this.isSendEnd) {
    //         console.warn('⚠️ 中断当前音频播放，准备播放新的');
    //         this.shouldStopSending = true;

    //         // 清除定时器（防止多次发送）
    //         if (this.sendTimer) {
    //             clearTimeout(this.sendTimer);
    //             this.sendTimer = null;
    //         }

    //         // 通知停止播放
    //         const stopSocket = new WebSocket(`ws://${socket.getIp()}:8084`);
    //         stopSocket.addEventListener('open', async () => {
    //             stopSocket.send('music');
    //             await new Promise(r => setTimeout(r, 100));
    //             stopSocket.close();
    //         });

    //         // 主连接关闭
    //         if (this.socketSound && this.socketSound.readyState === WebSocket.OPEN) {
    //             this.socketSound.close();
    //         }

    //         this.isSendEnd = true;
    //         // await new Promise(r => setTimeout(r, 1200));
    //     }

    //     // 开始新的播放
    //     if (socket.getIp().length === 0) {
    //         this.showToast('未连接机器人');
    //         this.runtime.stopAll();
    //         return;
    //     }

    //     console.log('🎵 开始播放音频');
    //     this.shouldStopSending = false;
    //     this.isSendEnd = false;

    //     const arrayBuffer = this.upLoadSound[Number(args.ONE)].data;

    //     this.socketSound = new WebSocket(`ws://${socket.getIp()}:8080`);

    //     this.socketSound.addEventListener('error', (e) => {
    //         console.error('❌ WebSocket 出错:', e);
    //         this.isSendEnd = true;
    //     });

    //     this.socketSound.addEventListener('close', (e) => {
    //         console.warn('🔌 WebSocket 断开:', e.code, e.reason);
    //         // this.shouldStopSending = true;
    //         this.isSendEnd = true;
    //     });

    //     this.socketSound.addEventListener('open', () => {
    //         console.log('已连接')
    //         const chunkSize = 2048;
    //         let offset = 44; // 跳过WAV头部

    //         const sendChunk = () => {
    //             if (this.shouldStopSending || !this.socketSound || this.socketSound.readyState !== WebSocket.OPEN) {
    //                 console.warn('⛔️ 已停止发送');
    //                 this.isSendEnd = true;
    //                 return;
    //             }

    //             if (offset >= arrayBuffer.byteLength) {
    //                 console.log('✅ 音频发送完毕');

    //                 const finishSocket = new WebSocket(`ws://${socket.getIp()}:8084`);
    //                 finishSocket.addEventListener('open', async () => {
    //                     finishSocket.send('music');
    //                     await new Promise(r => setTimeout(r, 100));
    //                     finishSocket.close();
    //                 });

    //                 this.socketSound.close();
    //                 this.isSendEnd = true;
    //                 return;
    //             }

    //             const end = Math.min(offset + chunkSize, arrayBuffer.byteLength);
    //             const chunk = arrayBuffer.slice(offset, end);
    //             this.socketSound.send(chunk);
    //             offset = end;

    //             this.sendTimer = setTimeout(sendChunk, 60); // 控制节奏
    //         };

    //         sendChunk();
    //     });
    // }

    getSoundList(){
        let item=[];
        if(this.upLoadSound && this.upLoadSound.length > 0){
            console.log('新菜单')
            for(let i=0;i<this.upLoadSound.length;i++){
                let content={
                    text:this.upLoadSound[i].name,
                    value:`${i}`
                }
                item.push(content)
            }
        }else{
            console.log('旧菜单')
            item.push({
                text:' ',
                value:' '
            })
        }

        console.log(item)
        
        return item
    }

    async downLoadSound(){
        try {
            const processedBlob = await this.selectAndProcessAudio();
            console.log('✅ 音频处理完成，Blob:', processedBlob);

            const arrayBuffer = await processedBlob.arrayBuffer();
            console.log(arrayBuffer)


            socketSound = new WebSocket(`ws://${socket.getIp()}:8084`)
            let reciveData=''
            socketSound.addEventListener('open',async()=>{
                console.log('连接成功')
                const waitForMessage = () => {
                    return new Promise(resolve => {
                        const listener = (event) => {
                            console.log('收到消息:', event.data);
                            socketSound.removeEventListener('message', listener);
                            resolve(event.data);
                        };
                        socketSound.addEventListener('message', listener);
                    });
                };
            
                socketSound.send('music');
            
                let res = await waitForMessage();
                if (res === 'success') {
                    console.log('可以开始发送音乐')
                    const chunkSize = 1024;
                    let offset = 44;
            
                    // while (offset < arrayBuffer.byteLength) {
                    //     const end = Math.min(offset + chunkSize, arrayBuffer.byteLength);
                    //     const chunk = arrayBuffer.slice(offset, end);
                    //     socketSound.send(chunk);
            
                    //     const result = await waitForMessage(); // 等待服务器回复
                    //     if (result !== 'success') {
                    //         alert('某段发送失败');
                    //         socketSound.close();
                    //         return;
                    //     }
            
                    //     offset = end;
                    // }

                    socketSound.send(arrayBuffer)
                    let result=await waitForMessage();
                    if(result=='success'){
                        console.log('📤 所有音频数据发送完毕');
                        socketSound.send('finished');
                
                        const finalRes = await waitForMessage();
                        if (finalRes === 'success') {
                            alert('下载完成');
                        } else {
                            alert('下载失败');
                        }
                        socketSound.close();
                    }else{
                        alert('数据发送失败')
                        socketSound.close();
                    }
            
                    
            
                    
                }
                
            })
    
            

            

        } catch (err) {
            console.error('❌ 处理失败:', err.message);
            alert('音频上传失败，请选择其他音频')
        }
    }

    async sendMusic(){

    }

    async stopSendMusic(){

    }

    async tts(args){
        // const text = args.ONE;
        // const utterance = new SpeechSynthesisUtterance(text);
        // utterance.lang = 'zh-CN';
        
        // // 创建一个新的 AudioContext
        // const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // // 创建一个音频源，允许从 SpeechSynthesis 输出音频
        // const source = audioContext.createMediaStreamDestination();
        
        // // 通过 MediaRecorder 捕获音频
        // const mediaRecorder = new MediaRecorder(source.stream);
        // let audioChunks = [];
        
        // mediaRecorder.ondataavailable = function(event) {
        //     audioChunks.push(event.data);
        // };
        
        // mediaRecorder.onstop = function() {
        //     const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        //     const audioUrl = URL.createObjectURL(audioBlob);
            
        //     // 将音频 URL 保存到变量
        //     console.log("音频已保存:", audioUrl);
            
        //     // 你可以通过音频 URL 创建一个 <audio> 元素进行播放
        //     const audioElement = new Audio(audioUrl);
        //     audioElement.play();
        // };
        
        // // 开始录制音频
        // mediaRecorder.start();
        
        // // 开始合成语音
        // speechSynthesis.speak(utterance);
        
        // // 停止录制后
        // utterance.onend = function() {
        //     mediaRecorder.stop();
        // };
    }

    async addSound(){
        if(this.mode){
            // this.currentVol+=args.ONE
            let jsonData={
                "command":"speaker",
                "params":{
                    "mode":5,
                    "vol":0,
                    "name":''
                }
            }
            // let str0=`${args.TWO.split('.')[0]} = robot.read_wav('/flash/${args.TWO}')\r`
            // let str = `robot.play_music(${args.ONE},${args.TWO.split('.')[0]})\r`;

            let str = JSON.stringify(jsonData)
            if(socket.checkWebSocketStatus()==4 || socket.checkWebSocketStatus()==0){
                console.log('断开连接，尝试重连')
                let context=[]
                // context.push(str0)
                context.push(str)
                await socket.setSocket(context)
            }else if(socket.checkWebSocketStatus()==2){
                // socket.getSocket().send(str0);
                // await new Promise(resolve => setTimeout(resolve, 50));  // 等待1秒
                socket.getSocket().send(str);
                await new Promise(resolve => setTimeout(resolve, 50));  // 等待1秒
            }
            socket.setLastPostTime(Date.now())
        }
    }


    async subSound(){
        if(this.mode){
            // this.currentVol+=args.ONE
            let jsonData={
                "command":"speaker",
                "params":{
                    "mode":6,
                    "vol":0,
                    "name":''
                }
            }
            // let str0=`${args.TWO.split('.')[0]} = robot.read_wav('/flash/${args.TWO}')\r`
            // let str = `robot.play_music(${args.ONE},${args.TWO.split('.')[0]})\r`;

            let str = JSON.stringify(jsonData)
            if(socket.checkWebSocketStatus()==4 || socket.checkWebSocketStatus()==0){
                console.log('断开连接，尝试重连')
                let context=[]
                // context.push(str0)
                context.push(str)
                await socket.setSocket(context)
            }else if(socket.checkWebSocketStatus()==2){
                // socket.getSocket().send(str0);
                // await new Promise(resolve => setTimeout(resolve, 50));  // 等待1秒
                socket.getSocket().send(str);
                await new Promise(resolve => setTimeout(resolve, 50));  // 等待1秒
            }
            socket.setLastPostTime(Date.now())
        }
    }

}


module.exports = RobotSound;
