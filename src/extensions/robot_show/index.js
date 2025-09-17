const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type')
const socket=require('../../util/socket-connect')
const showIcon = require('./show.svg')
const socketBle = require('../../util/localSocket')

const matrixIcon = require('./matrix.svg')
const formatMessage = require('format-message');

let newSocket;
let isConnectEventSource=false
let eventSource
let scratchGet=[]

class RobotShow {
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
      id: 'robotshow',
      name: formatMessage({
            id: 'robotshow.name',
            default: 'Display',
            description: 'robotshow.name'
        }),
    //   color1: '#ffe4e1',
    //   color3: '#ff0000',
    menuIconURI: showIcon,
      blocks: [

        

        {
            opcode: 'brightness',
            blockType: BlockType.COMMAND,
            // text: '设置显示亮度[ONE]',
            text: formatMessage({
                id: 'robotshow.brightness',
                default: 'Set display brightness [ONE]',
                description: 'robotshow.brightness'
            }),
            blockIconURI: matrixIcon,
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu:'MENU_BRIGHTNESS',
                    defaultValue:'5'
                },
            },
        },

        {
            opcode: 'showImageTime',
            blockType: BlockType.COMMAND,
            // text: '[THREE]显示[ONE] [TWO]秒',
            text: formatMessage({
                id: 'robotshow.showImageTime',
                default: '[THREE] display [ONE] for [TWO] seconds',
                description: 'robotshow.showImageTime'
            }),
            blockIconURI: matrixIcon,
            arguments:{
                ONE:{
                    type: ArgumentType.MATRIXCUSTOM,
                    defaultValue:'000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
                    
                },
                TWO:{
                    type: ArgumentType.NUMRES0_300,
                    defaultValue:2
                },
                THREE:{
                    type: ArgumentType.STRING,
                    menu:'SHOW_MODE'
                },
            },
        },
        {
            opcode: 'showImage',
            blockType: BlockType.COMMAND,
            // text: '[TWO]显示[ONE]',
            text: formatMessage({
                id: 'robotshow.showImage',
                default: '[TWO] display [ONE]',
                description: 'robotshow.showImage'
            }),
            blockIconURI: matrixIcon,
            arguments:{
                ONE:{
                    type: ArgumentType.MATRIXCUSTOM,
                    defaultValue:'000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'

                },
                TWO:{
                    type: ArgumentType.STRING,
                    menu:'SHOW_MODE'
                },
            },
        },


        {
            opcode: 'showTextNoPlace',
            blockType: BlockType.COMMAND,
            // text: '显示文本[ONE]',
            text: formatMessage({
                id: 'robotshow.showTextNoPlace',
                default: 'Display text [ONE]',
                description: 'robotshow.showTextNoPlace'
            }),
            blockIconURI: matrixIcon,
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    defaultValue:'12:12'
                },
                // TWO:{
                //     type: ArgumentType.STRING,
                //     menu:'SHOW_MODE'
                // },
            },
        },

       
        // {
        //     opcode: 'showText',
        //     blockType: BlockType.COMMAND,
        //     text: '显示字符串 [ONE] 在x[TWO] y[THREE]',
        //     arguments:{
        //         ONE:{
        //             type: ArgumentType.STRING,
        //             defaultValue:'hello'
        //         },
        //         TWO:{
        //             type: ArgumentType.STRING,
        //             defaultValue:0
        //         },
        //         THREE:{
        //             type: ArgumentType.STRING,
        //             defaultValue:0
        //         },
                
        //     },
        // },

        {
            opcode: 'setPixelSave',
            blockType: BlockType.COMMAND,
            // text: '点亮 x:[TWO] y:[THREE]',
            text: formatMessage({
                id: 'robotshow.setPixelSave',
                default: 'Light up x:[TWO] y:[THREE]',
                description: 'robotshow.setPixelSave'
            }),
            blockIconURI: matrixIcon,
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu:'MENU_PIXEL'
                },
                TWO:{
                    type: ArgumentType.STRING,
                    defaultValue:0
                },
                THREE:{
                    type: ArgumentType.STRING,
                    defaultValue:0
                },
            },
        },

        {
            opcode: 'setPixel',
            blockType: BlockType.COMMAND,
            // text: '只点亮 x:[TWO] y:[THREE]',
            text: formatMessage({
                id: 'robotshow.setPixel',
                default: 'Light only x:[TWO] y:[THREE]',
                description: 'robotshow.setPixel'
            }),
            blockIconURI: matrixIcon,
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu:'MENU_PIXEL'
                },
                TWO:{
                    type: ArgumentType.STRING,
                    defaultValue:0
                },
                THREE:{
                    type: ArgumentType.STRING,
                    defaultValue:0
                },
            },
        },

        {
            opcode: 'clearPixel',
            blockType: BlockType.COMMAND,
            // text: '熄灭 x:[TWO] y:[THREE]',
            text: formatMessage({
                id: 'robotshow.clearPixel',
                default: 'Turn off x:[TWO] y:[THREE]',
                description: 'robotshow.clearPixel'
            }),
            blockIconURI: matrixIcon,
            arguments:{
                TWO:{
                    type: ArgumentType.STRING,
                    defaultValue:0
                },
                THREE:{
                    type: ArgumentType.STRING,
                    defaultValue:0
                },
            },
        },

        {
            opcode: 'changePixel',
            blockType: BlockType.COMMAND,
            // text: '切换点亮与熄灭 x:[TWO] y:[THREE]',
            text: formatMessage({
                id: 'robotshow.changePixel',
                default: 'Toggle light on/off x:[TWO] y:[THREE]',
                description: 'robotshow.changePixel'
            }),
            blockIconURI: matrixIcon,
            arguments:{
                TWO:{
                    type: ArgumentType.STRING,
                    defaultValue:0
                },
                THREE:{
                    type: ArgumentType.STRING,
                    defaultValue:0
                },
            },
        },

         {
            opcode: 'clear',
            blockType: BlockType.COMMAND,
            // text: '熄屏',
            blockIconURI: matrixIcon,
            text: formatMessage({
                id: 'robotshow.clear',
                default: 'Turn off display',
                description: 'robotshow.clear'
            }),
            arguments:{
               
            },
        },

        {
            opcode: 'taillight',
            blockType: BlockType.COMMAND,
            // text: '设置尾灯颜色为 [ONE]',
            text: formatMessage({
                id: 'robotshow.taillight',
                default: 'Set tail light color to [ONE]',
                description: 'robotshow.taillight'
            }),
            arguments:{
                ONE:{
                    type:ArgumentType.COLOR,
                    defaultValue:'#ff0000'
                },
            },
        },

        {
            opcode: 'taillightrgb',
            blockType: BlockType.COMMAND,
            // text: '设置尾灯颜色为 R:[ONE] G:[TWO] B:[THREE]',
            text: formatMessage({
                id: 'robotshow.taillightrgb',
                default: 'Set tail light color R:[ONE] G:[TWO] B:[THREE]',
                description: 'robotshow.taillightrgb'
            }),
            arguments:{
                ONE:{
                    type:ArgumentType.NUMRES0_255,
                    defaultValue:'0'
                },
                TWO:{
                    type:ArgumentType.NUMRES0_255,
                    defaultValue:'0'
                },
                THREE:{
                    type:ArgumentType.NUMRES0_255,
                    defaultValue:'0'
                },
            },
        },

        // {
        //     opcode: 'isPixel',
        //     blockType: BlockType.BOOLEAN,
        //     text: 'x:[TWO] y:[THREE]是点亮状态？',
        //     arguments:{
        //         TWO:{
        //             type: ArgumentType.STRING,
        //             defaultValue:0
        //         },
        //         THREE:{
        //             type: ArgumentType.STRING,
        //             defaultValue:0
        //         },
        //     },
        // },

       

        

      ],

      menus: {
        MENU_PIXEL: {
            acceptReporters: false,
            items: [
              {
                  text: '点亮',
                  value: '0'
                },
              {
                text: '熄灭',
                value: '1'
              },
               
            ]
          },
        MENU_BRIGHTNESS: {
            acceptReporters: false,
            items: [
                {
                    text: '0',
                    value: '0'
                },
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
                },
                {
                    text: '6',
                    value: '6'
                },
                {
                    text: '7',
                    value: '7'
                },
                {
                    text: '8',
                    value: '8'
                },
                {
                    text: '9',
                    value: '9'
                },
                {
                    text: '10',
                    value: '10'
                },
                // {
                //     text: '11',
                //     value: '11'
                // },
                // {
                //     text: '12',
                //     value: '12'
                // },
                // {
                //     text: '13',
                //     value: '13'
                // },
                // {
                //     text: '14',
                //     value: '14'
                // },
                // {
                //     text: '15',
                //     value: '15'
                // },
                
                
            ]
        },
        MENU_LINE_PORT: {
          acceptReporters: false,
          items: [
            {
                text: '0',
                value: '0'
              },
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
              },
             
          ]
        },
       
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
        SHOW_MODE:{
            acceptReporters: false,
            items: [
                {
                    text: formatMessage({
                        id: 'robotshow.showMode.static',
                        default: 'Static',
                        description: 'robotshow.showMode.static'
                    }),
                    value: '0'
                },
                {
                    text: formatMessage({
                        id: 'robotshow.showMode.righttoleft',
                        default: 'Right to Left',
                        description: 'robotshow.showMode.righttoleft'
                    }),
                    value: '1'
                },
                {
                    text: formatMessage({
                        id: 'robotshow.showMode.lefttoright',
                        default: 'Left to Right',
                        description: 'robotshow.showMode.lefttoright'
                    }),
                    value: '2'
                },
                {
                    // text: '自上往下',
                    text: formatMessage({
                        id: 'robotshow.showMode.toptobottom',
                        default: 'Top to Bottom',
                        description: 'robotshow.showMode.toptobottom'
                    }),
                    value: '3'
                },
                {
                    // text: '自下往上',
                    text: formatMessage({
                        id: 'robotshow.showMode.bottomtotop',
                        default: 'Bottom to Top',
                        description: 'robotshow.showMode.bottomtotop'
                    }),
                    value: '4'
                },
                
                
            ]
        },
        
    }
    };
  }

//   taillight(){

//   }

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
    convertBinaryTo2DArray(binaryData) {
        // 确保输入的数据长度是192
        if (binaryData.length !== 192) {
            throw new Error("输入的二进制数据长度必须为 192 位");
        }

        const result = [];
        // 将数据每24位分为一组
        for (let i = 0; i < 8; i++) {
            // 从第 i * 24 位开始，取出 24 位数据
            const group = binaryData.slice(i * 24, (i + 1) * 24);
            // 将每组数据转为数组并添加到结果数组中
            result.push(group.split('').map(Number));
        }

        return result;
    }
    convertToHex(binary2DArray) {
        // 结果数组，用来存储每一列的十六进制值
        const hexArray = [];
    
        // 遍历每一列
        for (let col = 0; col < binary2DArray[0].length; col++) {
            // 获取这一列的所有行的二进制数据
            let binaryString = '';
            for (let row = binary2DArray.length-1; row >=0; row--) {
                binaryString += binary2DArray[row][col];  // 将该列的每一行元素拼接成二进制字符串
            }
    
            // 将二进制字符串转为十六进制
            let hexValue = parseInt(binaryString, 2).toString(16).toUpperCase();  // 转为十六进制并大写

            
    
            // 将结果加入到 hexArray 中
            // let HEX='0x'+hexValue
            // let HEX = `0x${hexValue}`
            // HEX=HEX.replace(/['"]/g, "")
            // console.log(hexValue)
            // console.log(typeof hexValue)
            // hexValue=hexValue.replace(/['"]/g, "")
            
            hexArray.push(parseInt(hexValue, 16));
        }
    
        return hexArray;
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

    async brightness(args){
        if(this.mode){

            
            let jsonData={
                "command":"display",
                "params":{
                    "mode":1,
                    "lum":Number(args.ONE),
                    "image":[],
                    "var":"",
                    "pos_x":0,
                    "pos_y":0,
                    "num":1,
                    "way":0
                }
            }
            // let str = `robot.send_OLED(1,[${hexArr}])\r\r`;
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
                    await new Promise(resolve => setTimeout(resolve, 50));  // 等待1秒
                }else if(socket.checkWebSocketStatus()==1){
                    this.showToast("socket正在连接中，请稍后");
                    this.runtime.stopAll();
                }
    
                socket.setLastPostTime(Date.now())
            }else if(this.whatSendFun=='port'){
                // this.channelPort.postMessage(str)
                await this.sendCommandAndWaitForSuccess(str)
                // this.sendCommandAndWaitForSuccess(JSON.stringify([0XAA,0x01,0x11,Number(args.ONE)]))
            }else if(this.whatSendFun=='ble'){
                const ackPromise = this.waitForThreeZeros();
                socketBle.getSocket().send(JSON.stringify([0XAA,0x01,0x11,Number(args.ONE)]))
                await ackPromise
            }
            
            
        }
    }

    async showImage(args){
        if(this.mode){
            

            // console.log(args.ONE)
            const result=this.convertBinaryTo2DArray(args.ONE)
            let hexArr=this.convertToHex(result)

            let jsonData={
                "command":"display",
                "params":{
                    "mode":2,
                    "lum":1,
                    "image":hexArr,
                    "var":"",
                    "pos_x":0,
                    "pos_y":0,
                    "num":1,
                    "way":Number(args.TWO)
                }
            }
            // let str = `robot.send_OLED(1,[${hexArr}])\r\r`;
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
                    await new Promise(resolve => setTimeout(resolve, 50));  // 等待1秒
                }else if(socket.checkWebSocketStatus()==1){
                    this.showToast("socket正在连接中，请稍后");
                    this.runtime.stopAll();
                }
    
                socket.setLastPostTime(Date.now())
            }else if(this.whatSendFun=='port'){
                // this.channelPort.postMessage(str)
                await this.sendCommandAndWaitForSuccess(str)
                // this.sendCommandAndWaitForSuccess(JSON.stringify([0XAA,0x01,0x12,Number(args.TWO),...hexArr]))
            }else if(this.whatSendFun=='ble'){
                const ackPromise = this.waitForThreeZeros();
                socketBle.getSocket().send(JSON.stringify([0XAA,0x01,0x12,Number(args.TWO),...hexArr]))
                await ackPromise
            }
            
            
        }
    }


    async showImageTime(args){
        if(this.mode){

            
            const result=this.convertBinaryTo2DArray(args.ONE)
            let hexArr=this.convertToHex(result)

            let jsonData={
                "command":"display",
                "params":{
                    "mode":2,
                    "lum":1,
                    "image":hexArr,
                    "var":"",
                    "pos_x":0,
                    "pos_y":0,
                    "num":1,
                    "way":Number(args.THREE)
                }
            }
            // let str = `robot.send_OLED(1,[${hexArr}])\r\r`;
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
                    await new Promise(resolve => setTimeout(resolve, 50));  // 等待1秒
                }else if(socket.checkWebSocketStatus()==1){
                    this.showToast("socket正在连接中，请稍后");
                    this.runtime.stopAll();
                }
                
    
                await new Promise(resolve => setTimeout(resolve, Number(args.TWO)*1000));
    
                this.clear()
    
                socket.setLastPostTime(Date.now())
            }else if(this.whatSendFun=='port'){
                this.channelPort.postMessage(str)
                // this.sendCommandAndWaitForSuccess(JSON.stringify([0XAA,0x01,0x12,Number(args.THREE),...hexArr]))
                await new Promise(resolve => setTimeout(resolve, Number(args.TWO)*1000));
                this.clear()
            }else if(this.whatSendFun=='ble'){
                socketBle.getSocket().send(JSON.stringify([0XAA,0x01,0x12,Number(args.THREE),...hexArr]))
                await new Promise(resolve => setTimeout(resolve, Number(args.TWO)*1000));
    
                this.clear()
            }
        
            
            
        }
    }

    containsChinese(text) {
        // return /[\u4e00-\u9fa5]/.test(text);
        return /[\u4e00-\u9fa5\u3400-\u4dbf\u3000-\u303f\uff00-\uffef]/.test(text);
    }

    stringToBinary(str) {
        const encoder = new TextEncoder();
        const uint8Array = encoder.encode(str);
        return uint8Array;
    }
    async showTextNoPlace(args){
        if(this.mode){
           

            if(this.containsChinese(args.ONE)){
                return
            }
            console.log(args.ONE)

            let jsonData={
                "command":"display",
                "params":{
                    "mode":3,
                    "lum":1,
                    "image":[],
                    "var":args.ONE.toString().slice(0,30),
                    "pos_x":0,
                    "pos_y":0,
                    "num":1,
                    "way":0
                }
            }
            // let str = `robot.send_OLED(1,[${hexArr}])\r\r`;
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
                    await new Promise(resolve => setTimeout(resolve, 50));  // 等待1秒
                }else if(socket.checkWebSocketStatus()==1){
                    this.showToast("socket正在连接中，请稍后");
                    this.runtime.stopAll();
                }
    
                socket.setLastPostTime(Date.now())
            }else if(this.whatSendFun=='port'){
                // this.channelPort.postMessage(str)
                await this.sendCommandAndWaitForSuccess(str)
                // this.sendCommandAndWaitForSuccess(JSON.stringify([0XAA,0x01,0x13,...this.stringToBinary(args.ONE.toString().slice(0,30))]))
            }else if(this.whatSendFun=='ble'){
                const ackPromise = this.waitForThreeZeros();
                socketBle.getSocket().send(JSON.stringify([0XAA,0x01,0x13,...this.stringToBinary(args.ONE.toString().slice(0,30))]))
                await ackPromise
            }
           
            
        }
    }

    async showText(args){
        if(this.mode){


            if(socket.getIp().length==0){
                this.showToast('未连接机器人')
                this.runtime.stopAll();
                return
            }
            let jsonData={
                "command":"display",
                "params":{
                    "mode":3,
                    "lum":1,
                    "image":[],
                    "var":args.ONE,
                    "pos_x":Number(args.TWO),
                    "pos_y":Number(args.THREE),
                    "status":0
                }
            }
            // let str = `robot.send_OLED(1,[${hexArr}])\r\r`;
            let str = JSON.stringify(jsonData)
        
        
            if(socket.checkWebSocketStatus()==4 || socket.checkWebSocketStatus()==0){
                console.log('断开连接，尝试重连')
                this.showToast("socket断开，尝试重连......");
                let context=[]
                context.push(str)
                await socket.setSocket(context)
            }else if(socket.checkWebSocketStatus()==2){
                socket.getSocket().send(str);
                await new Promise(resolve => setTimeout(resolve, 50));  // 等待1秒
            }else if(socket.checkWebSocketStatus()==1){
                this.showToast("socket正在连接中，请稍后");
                this.runtime.stopAll();
            }

            socket.setLastPostTime(Date.now())
            
        }
    }
    
    async setPixelSave(args){
        if(this.mode){

            


            let jsonData={
                "command":"display",
                "params":{
                    "mode":5,
                    "lum":1,
                    "image":[],
                    "var":"",
                    "pos_x":Number(args.TWO),
                    "pos_y":Number(args.THREE),
                    "num":1,
                    "way":0
                }
            }
            // let str = `robot.send_OLED(1,[${hexArr}])\r\r`;
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
                    await new Promise(resolve => setTimeout(resolve, 50));  // 等待1秒
                }else if(socket.checkWebSocketStatus()==1){
                    this.showToast("socket正在连接中，请稍后");
                    this.runtime.stopAll();
                }
    
                socket.setLastPostTime(Date.now())
            }else if(this.whatSendFun=='port'){
                // this.channelPort.postMessage(str)
                await this.sendCommandAndWaitForSuccess(str)
                // this.sendCommandAndWaitForSuccess(JSON.stringify([0XAA,0x01,0x14,Number(args.TWO),Number(args.THREE)]))
            }else if(this.whatSendFun=='ble'){
                const ackPromise = this.waitForThreeZeros();
                socketBle.getSocket().send(JSON.stringify([0XAA,0x01,0x14,Number(args.TWO),Number(args.THREE)]))
                await ackPromise
            }
            
            
        }
    }

    async setPixel(args){
        if(this.mode){

            

            let jsonData={
                "command":"display",
                "params":{
                    "mode":6,
                    "lum":1,
                    "image":[],
                    "var":"",
                    "pos_x":Number(args.TWO),
                    "pos_y":Number(args.THREE),
                    "num":1,
                    "way":0
                }
            }
            // let str = `robot.send_OLED(1,[${hexArr}])\r\r`;
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
                    await new Promise(resolve => setTimeout(resolve, 50));  // 等待1秒
                }else if(socket.checkWebSocketStatus()==1){
                    this.showToast("socket正在连接中，请稍后");
                    this.runtime.stopAll();
                }
    
                socket.setLastPostTime(Date.now())
            }else if(this.whatSendFun=='port'){
                // this.channelPort.postMessage(str)
                await this.sendCommandAndWaitForSuccess(str)
                // this.sendCommandAndWaitForSuccess(JSON.stringify([0XAA,0x01,0x15,Number(args.TWO),Number(args.THREE)]))
            }else if(this.whatSendFun=='ble'){
                const ackPromise = this.waitForThreeZeros();
                socketBle.getSocket().send(JSON.stringify([0XAA,0x01,0x15,Number(args.TWO),Number(args.THREE)]))
                await ackPromise
            }
            
            
        }
    }

    async clearPixel(args){
        if(this.mode){

            

            let jsonData={
                "command":"display",
                "params":{
                    "mode":7,
                    "lum":1,
                    "image":[],
                    "var":"",
                    "pos_x":Number(args.TWO),
                    "pos_y":Number(args.THREE),
                    "num":1,
                    "way":0
                }
            }
            // let str = `robot.send_OLED(1,[${hexArr}])\r\r`;
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
                    await new Promise(resolve => setTimeout(resolve, 50));  // 等待1秒
                }else if(socket.checkWebSocketStatus()==1){
                    this.showToast("socket正在连接中，请稍后");
                    this.runtime.stopAll();
                }
    
                socket.setLastPostTime(Date.now())
            }else if(this.whatSendFun=='port'){
                // this.channelPort.postMessage(str)
                await this.sendCommandAndWaitForSuccess(str)
                // this.sendCommandAndWaitForSuccess(JSON.stringify([0XAA,0x01,0x16,Number(args.TWO),Number(args.THREE)]))
            }else if(this.whatSendFun=='ble'){
                const ackPromise = this.waitForThreeZeros();
                socketBle.getSocket().send(JSON.stringify([0XAA,0x01,0x16,Number(args.TWO),Number(args.THREE)]))
                await ackPromise
            }
            
            
        }
    }

    async changePixel(args){
        if(this.mode){

            

            let jsonData={
                "command":"display",
                "params":{
                    "mode":8,
                    "lum":1,
                    "image":[],
                    "var":"",
                    "pos_x":Number(args.TWO),
                    "pos_y":Number(args.THREE),
                    "num":1,
                    "way":0
                }
            }
            // let str = `robot.send_OLED(1,[${hexArr}])\r\r`;
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
                    await new Promise(resolve => setTimeout(resolve, 50));  // 等待1秒
                }else if(socket.checkWebSocketStatus()==1){
                    this.showToast("socket正在连接中，请稍后");
                    this.runtime.stopAll();
                }
    
                socket.setLastPostTime(Date.now())
            }else if(this.whatSendFun=='port'){
                // this.channelPort.postMessage(str)
                await this.sendCommandAndWaitForSuccess(str)
                // this.sendCommandAndWaitForSuccess(JSON.stringify([0XAA,0x01,0x17,Number(args.TWO),Number(args.THREE)]))
            }else if(this.whatSendFun=='ble'){
                const ackPromise = this.waitForThreeZeros();
                socketBle.getSocket().send(JSON.stringify([0XAA,0x01,0x17,Number(args.TWO),Number(args.THREE)]))
                await ackPromise
            }
        
            
            
        }
    }



    hexToRgb(hex) {
        // 检查颜色值是否以井号开头
        if (hex.startsWith('#')) {
        // 移除井号
        hex = hex.slice(1);
        }

        // 如果是3位十六进制（例如 #FFF），则扩展为6位十六进制（#FFFFFF）
        if (hex.length === 3) {
        hex = hex.split('').map(function (char) {
            return char + char;
        }).join('');
        }

        // 提取红色、绿色和蓝色部分，并将它们转换为十进制
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);

        let result=[r,g,b]
        // 返回 RGB 格式的颜色字符串
        return result;
    }

    async taillight(args){
        if(this.mode){


            

            // console.log(typeof args.ONE)
            let rgb=this.hexToRgb(args.ONE)
            let jsonData={
                "command":"taillight",
                "params":{
                    "r":rgb[0],
                    "g":rgb[1],
                    "b":rgb[2],
                }
            }
            // let str = `robot.send_OLED(1,[${hexArr}])\r\r`;
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
                    await new Promise(resolve => setTimeout(resolve, 50));  // 等待1秒
                }else if(socket.checkWebSocketStatus()==1){
                    this.showToast("socket正在连接中，请稍后");
                    this.runtime.stopAll();
                }
    
                socket.setLastPostTime(Date.now())
            }else if(this.whatSendFun=='port'){
                // this.channelPort.postMessage(str)
                await this.sendCommandAndWaitForSuccess(str)
                // this.sendCommandAndWaitForSuccess(JSON.stringify([0XAA,0x01,0x19,rgb[0],rgb[1],rgb[2]]))
            }else if(this.whatSendFun=='ble'){
                const ackPromise = this.waitForThreeZeros();
                socketBle.getSocket().send(JSON.stringify([0XAA,0x01,0x19,rgb[0],rgb[1],rgb[2]]))
                await ackPromise
            }
        
            
            
        }
    }


    async taillightrgb(args){
        if(this.mode){

            

           
            let jsonData={
                "command":"taillight",
                "params":{
                    "r":Number(args.ONE),
                    "g":Number(args.TWO),
                    "b":Number(args.THREE),
                }
            }
            // let str = `robot.send_OLED(1,[${hexArr}])\r\r`;
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
                    await new Promise(resolve => setTimeout(resolve, 50));  // 等待1秒
                }else if(socket.checkWebSocketStatus()==1){
                    this.showToast("socket正在连接中，请稍后");
                    this.runtime.stopAll();
                }
    
                socket.setLastPostTime(Date.now())
            }else if(this.whatSendFun=='port'){
                // this.channelPort.postMessage(str)
                await this.sendCommandAndWaitForSuccess(str)
                // this.sendCommandAndWaitForSuccess(JSON.stringify([0XAA,0x01,0x19,Number(args.ONE),Number(args.TWO),Number(args.THREE)]))
            }else if(this.whatSendFun=='ble'){
                const ackPromise = this.waitForThreeZeros();
                socketBle.getSocket().send(JSON.stringify([0XAA,0x01,0x19,Number(args.ONE),Number(args.TWO),Number(args.THREE)]))
                await ackPromise
            }
        
            
            
        }
    }
    

    async clear(){
        if(this.mode){

            

            let jsonData={
                "command":"display",
                "params":{
                    "mode":9,
                    "lum":1,
                    "image":[],
                    "var":"",
                    "pos_x":0,
                    "pos_y":0,
                    "num":1,
                    "way":0
                }
            }
            // let str = `robot.send_OLED(1,[${hexArr}])\r\r`;
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
                    await new Promise(resolve => setTimeout(resolve, 50));  // 等待1秒
                }else if(socket.checkWebSocketStatus()==1){
                    this.showToast("socket正在连接中，请稍后");
                    this.runtime.stopAll();
                }
    
                socket.setLastPostTime(Date.now())
            }else if(this.whatSendFun=='port'){
                // this.channelPort.postMessage(str)
                await this.sendCommandAndWaitForSuccess(str)
                // this.sendCommandAndWaitForSuccess(JSON.stringify([0XAA,0x01,0x18]))
            }else if(this.whatSendFun=='ble'){
                const ackPromise = this.waitForThreeZeros();
                socketBle.getSocket().send(JSON.stringify([0XAA,0x01,0x18]))
                await ackPromise
            }
            
            
        }
    }

}


module.exports = RobotShow;
