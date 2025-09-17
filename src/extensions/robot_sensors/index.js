const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type')
const socket=require('../../util/socket-connect')
const sensorIcon = require('./sensors.svg')
const lineIcon = require('./line.svg')
const formatMessage = require('format-message');
const socketBle = require('../../util/localSocket')

let newSocket;
let isConnectEventSource=false
let eventSource
let scratchGet=[]
let socketSound
let stream

let audioContext, processor;
let audioChunks = [];
let isSSRecording = false;
const CHUNK_SIZE = 1024; // 每块的帧数

class RobotSensors {
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

        this.message=[0,0,0,0,0,0,0,0,0]
        this.reciveChannel = new BroadcastChannel('reciveChannel')
        this.reciveChannel.addEventListener('message',(event)=>{
            if(this.whatSendFun=='net'){
                this.message=event.data
            }
           
            // console.log(event.data)
        })

        this.line;

        setInterval(async()=>{
            if(this.mode && socket.getIp().length>0 && Date.now()-socket.getMessageTime()>5000){
                console.log('断开连接，尝试重连----')

                const Socket = new WebSocket(`ws://${socket.getIp()}:8084`);

                Socket.addEventListener('open', async(event) => {
                    console.log('连接成功');
                    Socket.send('disConnect')

                    await new Promise(resolve => setTimeout(resolve, 1000));

                    await socket.setSocketRecive()

                    await new Promise(resolve => setTimeout(resolve, 500));

                    Socket.close()
                });

                // Socket.addEventListener('message', (event) => {
                //     if(event.data=='success'){
                //         isRecive=true
                //     }
                // })
                
            }

            
        },8000)

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

        this.distanceBle;

        this.channel = new BroadcastChannel('distance_channel');

        this.channelSerialData=new BroadcastChannel('serial-data')
        this.channelSerialData.addEventListener('message',(event)=>{
            // console.log(JSON.parse(event.data))
            // console.log(event.data)
            if(this.whatSendFun=='port'){
                if(Array.isArray(event.data) && event.data.length>1){
                    this.message=event.data
                }else{
                    // console.log(event.data)
                }
                
            }

            if(!this.mode &&event.data.length==1){
                if(event.data[0]=='success'){
                    alert('下载成功')
                }
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

        // this.robotData=window.EditorWindow.getRobotDate()


    }
  getInfo() {

    return {
      id: 'robotsensors',
      name: formatMessage({
            id: 'robotsensors.name',
            default: 'Sensors',
            description: 'robotsensors.name'
        }),
      color1: '#3366ff',
    //   color3: '#ff0000',
    menuIconURI: sensorIcon,
    blockIconURI: lineIcon,
      blocks: [

        //以下为新协议块

        {
            opcode: 'key',
            blockType: BlockType.BOOLEAN,
            // text: '按键[ONE]被按下',
            text: formatMessage({
                id: 'robotsensors.key',
                default: 'Button [ONE] pressed',
                description: 'robotsensors.key'
            }),
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu:'MENU_KEY'
                }
            },
            disableMonitor: true
        },


        {
            opcode: 'soundComp',
            blockType: BlockType.BOOLEAN,
            // text: '声音 [ONE] [TWO]',
            text: formatMessage({
                id: 'robotsensors.soundComp',
                default: 'Sound [ONE] [TWO]',
                description: 'robotsensors.soundComp'
            }),
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu:'MENU_COMPARE'
                },
                TWO:{
                    type: ArgumentType.STRING,
                    defaultValue:80
                }
            }
        },

        {
            opcode: 'sound',
            blockType: BlockType.REPORTER,
            // text: '当前声音大小',
            text: formatMessage({
                id: 'robotsensors.sound',
                default: 'Current sound level',
                description: 'robotsensors.sound'
            }),
            arguments:{
                
            },
            disableMonitor: true
        },

        {
            opcode: 'elector',
            blockType: BlockType.REPORTER,
            // text: '当前电量',
            text: formatMessage({
                id: 'robotsensors.elector',
                default: 'Current battery level',
                description: 'robotsensors.elector'
            }),
            arguments:{
                
            },
            disableMonitor: true
        },

        {
            opcode: 'speed',
            blockType: BlockType.REPORTER,
            // text: '[ONE]当前速度',
            text: formatMessage({
                id: 'robotsensors.speed',
                default: '[ONE] current speed',
                description: 'robotsensors.speed'
            }),
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu:'MENU_WHAT'
                },
            },
            disableMonitor: true
        },

        {
            opcode: 'private',
            blockType: BlockType.REPORTER,
            // text: '隐私开关',
            text: formatMessage({
                id: 'robotsensors.private',
                default: 'Privacy switch',
                description: 'robotsensors.private'
            }),
            arguments:{
                
            },
            disableMonitor: true
        },

        {
            opcode: 'distance',
            blockType: BlockType.REPORTER,
            // text: '[ONE]移动距离',
            text: formatMessage({
                id: 'robotsensors.distance',
                default: '[ONE] movement distance',
                description: 'robotsensors.distance'
            }),
            arguments:{

                ONE:{
                    type: ArgumentType.STRING,
                    menu:'MENU_WHAT'
                },
                
            },
            disableMonitor: true
        },

        {
            opcode: 'moveClearDistance',
            blockType: BlockType.COMMAND,
            // text: '停止运动',
            text: formatMessage({
                id: 'robotmove.moveClearDistance',
                default: 'Clear the travel distance',
                description: 'robotmove.moveClearDistance'
            }),
            arguments:{
                
            }
        },

        {
            opcode: 'linemode',
            blockType: BlockType.COMMAND,
            // text: '设置巡线传感器为[ONE]模式',
            text: formatMessage({
                id: 'robotsensors.linemode',
                default: 'Set line sensor to [ONE] mode',
                description: 'robotsensors.linemode'
            }),
            blockIconURI: lineIcon,
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu:'MENU_LINE'
                }
            }
        },

        {
            opcode: 'grayLearning',
            blockType: BlockType.COMMAND,
            // text: '运行巡线传感器二值学习',
            text: formatMessage({
                id: 'robotsensors.grayLearning',
                default: 'Run line sensor binary learning',
                description: 'robotsensors.grayLearning'
            }),
            blockIconURI: lineIcon,
            arguments:{
                
            },
        },

        {
            opcode: 'graystudycolor',
            blockType: BlockType.COMMAND,
            // text: '运行巡线传感器学习[ONE]颜色',
            text: formatMessage({
                id: 'robotsensors.graystudycolor',
                default: 'Run line sensor learn [ONE] color',
                description: 'robotsensors.graystudycolor'
            }),
            blockIconURI: lineIcon,
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu:'MENU_COLOR'
                }
            }
        },
        
        
        {
            opcode: 'lineportresult',
            blockType: BlockType.REPORTER,
            // text: '巡线传感器探头[ONE]检测到的值',
            text: formatMessage({
                id: 'robotsensors.lineportresult',
                default: 'Line sensor probe [ONE] detected value',
                description: 'robotsensors.lineportresult'
            }),
            blockIconURI: lineIcon,
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu:'MENU_LINE_PORT'
                }
            },
            disableMonitor: true
        },
        {
            opcode: 'lineportcolor',
            blockType: BlockType.BOOLEAN,
            // text: '巡线传感器探头[ONE]检测到[TWO]',
            text: formatMessage({
                id: 'robotsensors.lineportcolor',
                default: 'Line sensor probe [ONE] detected [TWO]',
                description: 'robotsensors.lineportcolor'
            }),
            blockIconURI: lineIcon,
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu:'MENU_LINE_PORT'
                },
                TWO:{
                    type: ArgumentType.STRING,
                    menu:'MENU_COLOR'
                }
            },
            disableMonitor: true
        },

        {
            opcode: 'islineport',
            blockType: BlockType.BOOLEAN,
            // text: '巡线传感器探头[ONE]检测到的值[TWO][THREE]',
            text: formatMessage({
                id: 'robotsensors.islineport',
                default: 'Line sensor probe [ONE] value [TWO][THREE]',
                description: 'robotsensors.islineport'
            }),
            blockIconURI: lineIcon,
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu:'MENU_LINE_PORT'
                },
                TWO:{
                    type: ArgumentType.STRING,
                    menu:'MENU_COMPARE'
                },
                THREE:{
                    type: ArgumentType.STRING,
                    defaultValue:50
                }
            },
            disableMonitor: true
        },

        


        {
            opcode: 'closeLight',
            blockType: BlockType.COMMAND,
            // text: '关闭巡线传感器',
            text: formatMessage({
                id: 'robotsensors.closeLight',
                default: 'Turn off line sensor',
                description: 'robotsensors.closeLight'
            }),
            blockIconURI: lineIcon,
            arguments:{
                
            },
        },


         {
            opcode: 'startLine',
            blockType: BlockType.COMMAND,
            // text: '以[ONE]开始自动巡线',
            text: formatMessage({
                id: 'robotsensors.startLine',
                default: 'Start auto line following at [ONE]',
                description: 'robotsensors.startLine'
            }),
            blockIconURI: lineIcon,
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu:'MENU_AUTO_LINE_SPEED'
                },
            },
        },


        {
            opcode: 'startLineUntil',
            blockType: BlockType.COMMAND,
            // text: '以[TWO]开始自动巡线 直到 状态为[ONE]',
            text: formatMessage({
                id: 'robotsensors.startLineUntil',
                default: 'Start auto line following at [TWO] until state [ONE]',
                description: 'robotsensors.startLineUntil'
            }),
            blockIconURI: lineIcon,
            arguments:{
                // ONE:{
                //     type: ArgumentType.STRING,
                //     menu:'MENU_AUTO_LINE_UNTIL',
                //     defaultValue:'00000'
                // },
                ONE:{
                    type:ArgumentType.MATRIXONEROW,
                    defaultValue:'00000'
                },
                TWO:{
                    type: ArgumentType.STRING,
                    menu:'MENU_AUTO_LINE_SPEED'
                },
            },
        },
        {
            opcode: 'stopLine',
            blockType: BlockType.COMMAND,
            blockIconURI: lineIcon,
            // text: '停止自动巡线',
            text: formatMessage({
                id: 'robotsensors.stopLine',
                default: 'Stop auto line following',
                description: 'robotsensors.stopLine'
            }),
            arguments:{
            },
        },

        // {
        //     opcode: 'asrStart',
        //     blockType: BlockType.COMMAND,
        //     text: '开始离线语音识别',
        //     arguments:{
        //     },
        // },

        // {
        //     opcode: 'asrStop',
        //     blockType: BlockType.COMMAND,
        //     text: '停止离线语音识别',
        //     arguments:{
        //     },
        // },

        // {
        //     opcode: 'asrResult',
        //     blockType: BlockType.BOOLEAN,
        //     text: '识别结果为[ONE]',
        //     arguments:{
        //         ONE:{
        //             type: ArgumentType.STRING,
        //             menu:'MENU_SOUND',
        //         },
        //     },
        //     disableMonitor: true
        // },


        // {
        //     opcode: 'startPreDown',
        //     blockType: BlockType.COMMAND,
        //     text: '以[ONE]安全距离开始防跌落',
        //     arguments:{
        //         ONE:{
        //             type: ArgumentType.STRING,
        //             defaultValue:'10'
        //         },
        //     },
        // },

        // {
        //     opcode: 'stopPreDown',
        //     blockType: BlockType.COMMAND,
        //     text: '停止防跌落',
        //     arguments:{
               
        //     },
        // },

        // {
        //     opcode: 'cstartsound',
        //     blockType: BlockType.COMMAND,
        //     text: '[ONE]实时喊话',
        //     arguments:{
        //         ONE:{
        //             type: ArgumentType.STRING,
        //             menu:'MENU_IMGCON'
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
        MENU_WHAT: {
        acceptReporters: false,
        items: [
            {
                text: formatMessage({
                    id: 'robotsensors.menuWhat.left',
                    default: 'Left Wheel',
                    description: 'robotsensors.menuWhat.left'
                }),
                value: '0'
            },
            {
                text: formatMessage({
                    id: 'robotsensors.menuWhat.right',
                    default: 'Right Wheel',
                    description: 'robotsensors.menuWhat.right'
                }),
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
                {
                    text: '11',
                    value: '11'
                },
                {
                    text: '12',
                    value: '12'
                },
                {
                    text: '13',
                    value: '13'
                },
                {
                    text: '14',
                    value: '14'
                },
                {
                    text: '15',
                    value: '15'
                },
                
                
            ]
        },
        MENU_LINE_PORT: {
          acceptReporters: false,
          items: [
            {
              text: 'L1',
              value: '0'
            },
            {
              text: 'L2',
              value: '1'
            },
            {
                text: 'M',
                value: '2'
            },
            {
                text: 'R2',
                value: '3'
              },
              {
                text: 'R1',
                value: '4'
              },
             
          ]
        },

         MENU_AUTO_LINE_SPEED: {
          acceptReporters: false,
          items: [
            {
              text: formatMessage({
                    id: 'robotsensors.menuAutoLineSpeed.lowSpeed',
                    default: 'Low',
                    description: 'robotsensors.menuAutoLineSpeed.lowSpeed'
                }),
              value: '1'
            },
            {
              text: formatMessage({
                    id: 'robotsensors.menuAutoLineSpeed.middleSpeed',
                    default: 'Medium',
                    description: 'robotsensors.menuAutoLineSpeed.middleSpeed'
                }),
              value: '2'
            },
            {
                text: formatMessage({
                    id: 'robotsensors.menuAutoLineSpeed.heightSpeed',
                    default: 'High',
                    description: 'robotsensors.menuAutoLineSpeed.heightSpeed'
                }),
                value: '3'
            },

             
          ]
        },
        MENU_AUTO_LINE_UNTIL: {
            acceptReporters: false,
            items: [
                {
                    text: '00000',
                    value: '00000'
                },
                {
                    text: '00001',
                    value: '00001'
                },
                {
                    text: '00010',
                    value: '00010'
                },
                {
                    text: '00011',
                    value: '00011'
                },
                {
                    text: '00100',
                    value: '00100'
                },

                {
                    text: '00101',
                    value: '00101'
                },
                {
                    text: '00110',
                    value: '00110'
                },
                {
                    text: '00111',
                    value: '00111'
                },
                {
                    text: '01000',
                    value: '01000'
                },
                {
                    text: '01001',
                    value: '01001'
                },
                {
                    text: '01010',
                    value: '01010'
                },
                {
                    text: '01011',
                    value: '01011'
                },
                {
                    text: '01100',
                    value: '01100'
                },
                {
                    text: '01101',
                    value: '01101'
                },
                {
                    text: '01110',
                    value: '01110'
                },
                {
                    text: '01111',
                    value: '01111'
                },
                {
                    text: '10000',
                    value: '10000'
                },
                {
                    text: '10001',
                    value: '10001'
                },
                {
                    text: '10010',
                    value: '10010'
                },
                {
                    text: '10011',
                    value: '10011'
                },
                {
                    text: '10100',
                    value: '10100'
                },
                {
                    text: '10101',
                    value: '10101'
                },
                {
                    text: '10110',
                    value: '10110'
                },
                {
                    text: '10111',
                    value: '10111'
                },
                {
                    text: '11000',
                    value: '11000'
                },
                {
                    text: '11001',
                    value: '11001'
                },
                {
                    text: '11010',
                    value: '11010'
                },
                {
                    text: '11011',
                    value: '11011'
                },
                {
                    text: '11100',
                    value: '11100'
                },
                {
                    text: '11101',
                    value: '11101'
                },
                {
                    text: '11110',
                    value: '11110'
                },
                {
                    text: '11111',
                    value: '11111'
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

        MENU_LINE: {
            acceptReporters: false,
            items: [
                {
                    text: formatMessage({
                        id: 'robotsensors.menuLine.twoValue',
                        default: 'Binary',
                        description: 'robotsensors.menuLine.twoValue'
                    }),
                    value:'1'
                },
                {
                    text: formatMessage({
                        id: 'robotsensors.menuLine.gray',
                        default: 'Gray',
                        description: 'robotsensors.menuLine.gray'
                    }),
                    value: '2'
                },
                {
                    text: formatMessage({
                        id: 'robotsensors.menuLine.color',
                        default: 'Color',
                        description: 'robotsensors.menuLine.color'
                    }),
                    value: '3'
                },
                
            ]
        },

        MENU_COLOR: {
            acceptReporters: false,
            items: [
                {
                    text: formatMessage({
                        id: 'robotsensors.menuColor.red',
                        default: 'Red',
                        description: 'robotsensors.menuColor.red'
                    }),
                    value: '1'
                },
                {
                    text: formatMessage({
                        id: 'robotsensors.menuColor.origin',
                        default: 'Orange',
                        description: 'robotsensors.menuColor.origin'
                    }),
                    value: '2'
                },
                {
                    text: formatMessage({
                        id: 'robotsensors.menuColor.yellow',
                        default: 'Yellow',
                        description: 'robotsensors.menuColor.yellow'
                    }),
                    value: '3'
                },
                {
                    text: formatMessage({
                        id: 'robotsensors.menuColor.green',
                        default: 'Green',
                        description: 'robotsensors.menuColor.green'
                    }),
                    value: '4'
                },
                {
                    text: formatMessage({
                        id: 'robotsensors.menuColor.qing',
                        default: 'Cyan',
                        description: 'robotsensors.menuColor.qing'
                    }),
                    value: '5'
                },
                {
                    text: formatMessage({
                        id: 'robotsensors.menuColor.blue',
                        default: 'Blue',
                        description: 'robotsensors.menuColor.blue'
                    }),
                    value: '6'
                },
                {
                    text: formatMessage({
                        id: 'robotsensors.menuColor.purpl',
                        default: 'Purple',
                        description: 'robotsensors.menuColor.purpl'
                    }),
                    value: '7'
                },
                {
                    text: formatMessage({
                        id: 'robotsensors.menuColor.black',
                        default: 'Black',
                        description: 'robotsensors.menuColor.black'
                    }),
                    value: '0'
                },
                {
                    text: formatMessage({
                        id: 'robotsensors.menuColor.white',
                        default: 'White',
                        description: 'robotsensors.menuColor.white'
                    }),
                    value: '255'
                },
            ]
        },
        MENU_KEY:{
            acceptReporters: false,
            items: [
                {
                    text: 'B',
                    value: '7'
                },
                {
                    text: 'A',
                    value: '8'
                },
                
            ]
        },
        MENU_MUSIC:{
            acceptReporters: false,
            items: [
                {
                    text: '汽车声',
                    value: 'car.wav'
                },
                {
                    text: '小猫叫',
                    value: 'cat.wav'
                },
                {
                    text: '小狗叫',
                    value: 'dog.wav'
                },

                
            ]
        },
        MENU_IMGCON:{
            acceptReporters: false,
            items: [
                {
                    text: '开启',
                    value: '1'
                },
                {
                    text: '关闭',
                    value: '2'
                },
            ]
        },
        MENU_SOUND:{
            acceptReporters: false,
            items: [
                {
                    text: '前进/向前/出发/直行',
                    value: '1,2,3,4'
                },
                {
                    text: '后退/向后/倒车',
                    value: '6,7,8'
                },
                {
                    text: '左转/向左转',
                    value: '11,12'
                },
                {
                    text: '右转/向右转',
                    value: '16,17'
                },

                {
                    text: '停止/停止运动',
                    value: '26,27'
                },
                {
                    text: '夹住/抓住',
                    value: '31,32'
                },

                {
                    text: '松开/放下',
                    value: '36,37'
                },
                {
                    text: '发射/开炮/发射下一颗',
                    value: '41,42,43'
                },
                {
                    text: '连续发射/连发',
                    value: '51,52'
                },
                {
                    text: '开始巡线',
                    value: '61,62'
                },
                {
                    text: '停止巡线/结束巡线',
                    value: '66,67'
                },
                {
                    text: '开心',
                    value: '71'
                },
                {
                    text: '生气',
                    value: '72'
                },
                {
                    text: '伤心',
                    value: '73'
                },
                {
                    text: '微笑',
                    value: '74'
                },
                {
                    text: '哭泣',
                    value: '75'
                },
                
            ]
        }
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

  async grayLearning(){
    if(this.mode){
        

        let jsonData={
            "command":"rgb_sensor",
            "params":{
                "mode":1,
                "learn_color":0,
                "num":0
            }
        }
        // let str = `robot.send_grayscale_learn()\r`;
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
            // this.sendCommandAndWaitForSuccess(JSON.stringify([0XAA,0x01,0x42]))
        }else if(this.whatSendFun=='ble'){
            const ackPromise = this.waitForThreeZeros();
            socketBle.getSocket().send(JSON.stringify([0XAA,0x01,0x42]))
            await ackPromise
        }
        
    }
  }
  async graystudycolor(args){

    if(this.mode){
        

        let jsonData={
            "command":"rgb_sensor",
            "params":{
                "mode":2,
                "learn_color":Number(args.ONE),
                "num":0
            }
        }
        // let str = `robot.send_color_learn(${args.ONE})\r`;
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
            // this.sendCommandAndWaitForSuccess(JSON.stringify([0XAA,0x01,0x43,Number(args.ONE)]))
        }else if(this.whatSendFun=='ble'){
            const ackPromise = this.waitForThreeZeros();
            socketBle.getSocket().send(JSON.stringify([0XAA,0x01,0x43,Number(args.ONE)]))
            await ackPromise
        }
       
    }
    

    
    
    // await fetch(`http://192.168.4.1:8082/scratch_line?mode=5&color=${args.ONE}`)
    //     .then(response => {
    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }
    //         return response.text();
    //     })
    //     .then(data => {
    //         console.log('Success:', data);
    //     })
    //     .catch(error => {
    //         console.error('There was an error with the fetch operation:', error);
    //     });
  }
  async linemode(args){
    if(this.mode){
        

        let jsonData={
            "command":"rgb_sensor",
            "params":{
                "mode":3,
                "learn_color":0,
                "num":Number(args.ONE)
            }
        }
        // let str = `robot.set_line_mode(${args.ONE})\r`;
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
            // this.sendCommandAndWaitForSuccess(JSON.stringify([0XAA,0x01,0x41,Number(args.ONE)]))
        }else if(this.whatSendFun=='ble'){
            const ackPromise = this.waitForThreeZeros();
            socketBle.getSocket().send(JSON.stringify([0XAA,0x01,0x41,Number(args.ONE)]))
            await ackPromise
        }
        
    }


    
    

    
    

    // await fetch(`http://192.168.4.1:8082/scratch_line?mode=${args.ONE}&color=0`)
    //     .then(response => {
    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }
    //         return response.text();
    //     })
    //     .then(data => {
    //         console.log('Success:', data);
    //     })
    //     .catch(error => {
    //         console.error('There was an error with the fetch operation:', error);
    //     });
  }

  async startPreDown(args){
    if(this.mode){
        if(socket.getIp().length==0){
            this.showToast('未连接机器人')
            this.runtime.stopAll();
            return
        }

        let jsonData={
            "command":"line_tracking",
            "params":{
                "mode":3,
                "speed":Number(args.ONE),
                "line":[0,0,0,0,0], 
            }
        }
        // let str = `robot.set_line_mode(${args.ONE})\r`;
        let str = JSON.stringify(jsonData)

        if(this.whatSendFun=='net'){
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
        }else{
            this.channelPort.postMessage(str)
        }
        
    }

  }

  async stopPreDown(){
    if(this.mode){
        if(socket.getIp().length==0){
            this.showToast('未连接机器人')
            this.runtime.stopAll();
            return
        }

        let jsonData={
            "command":"line_tracking",
            "params":{
                "mode":4,
                "speed":0,
                "line":[0,0,0,0,0], 
            }
        }
        // let str = `robot.set_line_mode(${args.ONE})\r`;
        let str = JSON.stringify(jsonData)

        if(this.whatSendFun=='net'){
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
        }else{
            this.channelPort.postMessage(str)
        }
        
    }
  }

  async lineportallresult(){
    // if(this.flag=='1'){
    //     let result=scratchGet.slice(2)
    //     this.line=result
    //     // return result
    // }

    if(this.mode){
        if(this.whatSendFun=='net' || this.whatSendFun=='port'){
            if(socket.getIp().length==0 && this.whatSendFun=='net'){
                this.showToast('未连接机器人')
                this.runtime.stopAll();
                return
            }
            console.log(this.message)
            let result=this.message.slice(9)

            this.line=result
            return this.line
        }else if(this.whatSendFun=='ble'){
            let result=JSON.parse(window.EditorPreload.getRobotData()).slice(9)

            this.line=result
            return this.line
        }
        

        // if(socket.checkWebSocketStatusRecive()==4 || socket.checkWebSocketStatusRecive()==0){
        //     console.log('断开连接，尝试重连')
        //     await socket.setSocketRecive()
        // }else if(socket.checkWebSocketStatusRecive()==2){
        //     if(Date.now()-socket.getMessageTime()>5000){
        //         console.log('断开连接，尝试重连')
        //         await socket.setSocketRecive()
        //     }
        //     let result=this.message.slice(9)

        //     this.line=result
        //     return this.line
        // }
        
    }
    
  }

  async lineportcolor(args){
    if(this.mode){

        if(this.whatSendFun=='net' || this.whatSendFun=='port'){
            if(socket.getIp().length==0 && this.whatSendFun=='net'){
                this.showToast('未连接机器人')
                this.runtime.stopAll();
                return
            }
            console.log(this.message)
            // return this.line[args.ONE]

            let result=this.message.slice(9)

                
            if(result[args.ONE]==args.TWO){
                return true
            }else{
                return false
            }
        }else if(this.whatSendFun=='ble'){
            let result=JSON.parse(window.EditorPreload.getRobotData()).slice(9)

                
            if(result[args.ONE]==args.TWO){
                return true
            }else{
                return false
            }
        }
        

        // if(socket.checkWebSocketStatusRecive()==4 || socket.checkWebSocketStatusRecive()==0){
        //     console.log('断开连接，尝试重连')
        //     await socket.setSocketRecive()
        // }else if(socket.checkWebSocketStatusRecive()==2){
        //     if(Date.now()-socket.getMessageTime()>5000){
        //         console.log('断开连接，尝试重连')
        //         await socket.setSocketRecive()
        //     }
        //     let result=this.message.slice(9)

            
        //     if(result[args.ONE]==args.TWO){
        //         return true
        //     }else{
        //         return false
        //     }
        // }
    }
  }
  async lineportresult(args){
    // if(this.flag=='1'){
    //     // let result=scratchGet.slice(2)
    //     return this.line[args.ONE]
    // }

    if(this.mode){
        if(this.whatSendFun=='net' || this.whatSendFun=='port'){
            if(socket.getIp().length==0 && this.whatSendFun=='net'){
                this.showToast('未连接机器人')
                this.runtime.stopAll();
                return
            }
            console.log(this.message)
            // return this.line[args.ONE]
            let result=this.message.slice(9)

                
            return result[args.ONE]
        }else if(this.whatSendFun=='ble'){
            let result=JSON.parse(window.EditorPreload.getRobotData()).slice(9)

                
            return result[args.ONE]
        }
        

        // if(socket.checkWebSocketStatusRecive()==4 || socket.checkWebSocketStatusRecive()==0){
        //     console.log('断开连接，尝试重连')
        //     await socket.setSocketRecive()
        // }else if(socket.checkWebSocketStatusRecive()==2){
        //     if(Date.now()-socket.getMessageTime()>5000){
        //         console.log('断开连接，尝试重连')
        //         await socket.setSocketRecive()
        //     }
        //     let result=this.message.slice(9)

            
        //     return result[args.ONE]
        // }
    }


    
  }
  async islineport(args){
    // if(this.flag=='1'){
    //     let result=scratchGet.slice(2)
    //     if(args.TWO=='>' && result[args.ONE]>args.THREE){
    //         return true
    //     }else if(args.TWO=='<' && result[args.ONE]<args.THREE){
    //         return true
    //     }else if(args.TWO=='=' && result[args.ONE]==args.THREE){
    //         return true
    //     }
    //     return false
    // }
    if(this.mode){

        if(this.whatSendFun=='net' || this.whatSendFun=='port'){
            if(socket.getIp().length==0 && this.whatSendFun=='net'){
                this.showToast('未连接机器人')
                this.runtime.stopAll();
                return
            }
            console.log(this.message)

            let result=this.message.slice(9)

            if(args.TWO=='>' && result[args.ONE]>args.THREE){
                return true
            }else if(args.TWO=='<' && result[args.ONE]<args.THREE){
                return true
            }else if(args.TWO=='=' && result[args.ONE]==args.THREE){
                return true
            }
            return false
        }else{
             let result=JSON.parse(window.EditorPreload.getRobotData()).slice(9)

            if(args.TWO=='>' && result[args.ONE]>args.THREE){
                return true
            }else if(args.TWO=='<' && result[args.ONE]<args.THREE){
                return true
            }else if(args.TWO=='=' && result[args.ONE]==args.THREE){
                return true
            }
            return false
        }
        
        // if(socket.checkWebSocketStatusRecive()==4 || socket.checkWebSocketStatusRecive()==0){
        //     console.log('断开连接，尝试重连')
        //     await socket.setSocketRecive()
        // }else if(socket.checkWebSocketStatusRecive()==2){
        //     if(Date.now()-socket.getMessageTime()>5000){
        //         console.log('断开连接，尝试重连')
        //         await socket.setSocketRecive()
        //     }
        //     let result=this.message.slice(9)

        //     if(args.TWO=='>' && result[args.ONE]>args.THREE){
        //         return true
        //     }else if(args.TWO=='<' && result[args.ONE]<args.THREE){
        //         return true
        //     }else if(args.TWO=='=' && result[args.ONE]==args.THREE){
        //         return true
        //     }
        //     return false
            
        // }
        
    }

    
  }



  async key(args){
    if(this.mode){
        if(this.whatSendFun=='net' || this.whatSendFun=='port'){
            if(socket.getIp().length==0 && this.whatSendFun=='net'){
                this.showToast('未连接机器人')
                this.runtime.stopAll();
                return
            }
            console.log(this.message)
            // console.log(socket.checkWebSocketStatusRecive())
            let startTime=Date.now()
            console.log(socket.checkWebSocketStatusRecive())

            if(this.message[0]==0 && args.ONE==8){
                let lastTime=Date.now()
                console.log('--------------')
                console.log(lastTime-startTime)
                return true
            }else if(this.message[1]==0 && args.ONE==7){
                let lastTime=Date.now()
                console.log('--------------')
                console.log(lastTime-startTime)
                return true
            }
            return false
        }else if(this.whatSendFun=='ble'){
            if(JSON.parse(window.EditorPreload.getRobotData())[0]==0 && args.ONE==8){
                
                return true
            }else if(JSON.parse(window.EditorPreload.getRobotData())[1]==0 && args.ONE==7){
                
                return true
            }
            return false
        }
        
        // if(socket.checkWebSocketStatusRecive()==4 || socket.checkWebSocketStatusRecive()==0){
        //     console.log('断开连接，尝试重连')
        //     await socket.setSocketRecive()
        // }else if(socket.checkWebSocketStatusRecive()==2){
        //     if(Date.now()-socket.getMessageTime()>5000){
        //         console.log('断开连接，尝试重连----')
        //         await socket.setSocketRecive()
        //     }
        //     console.log('返回值：'+this.message)
        //     if(this.message[0]==0 && args.ONE==8){
        //         let lastTime=Date.now()
        //         console.log('--------------')
        //         console.log(lastTime-startTime)
        //         return true
        //     }else if(this.message[1]==0 && args.ONE==7){
        //         let lastTime=Date.now()
        //         console.log('--------------')
        //         console.log(lastTime-startTime)
        //         return true
        //     }
        //     return false
        // }
        
    
    //     // if(socket.getMessage()[0]==0 && args.ONE==8){
    //     //     return true
    //     // }else if(socket.getMessage()[1]==0 && args.ONE==7){
    //     //     return true
    //     // }
    //     // return false
        
        
    }
  }

  async soundComp(args){

    if(this.mode){
        if(this.whatSendFun=='net' || this.whatSendFun=='port'){
            if(socket.getIp().length==0 && this.whatSendFun=='net'){
                this.showToast('未连接机器人')
                this.runtime.stopAll();
                return
            }
            console.log(this.message)
            if(args.ONE=='>'){
                if(this.message[3]>args.TWO){
                    return true
                }else{
                    return false
                }
            }else if(args.ONE=='='){
                if(this.message[3]==args.TWO){
                    return true
                }else{
                    return false
                }
            }else if(args.ONE=='<'){
                if(this.message[3]<args.TWO){
                    return true
                }else{
                    return false
                }
            }
        }else if(this.whatSendFun=='ble'){
            if(args.ONE=='>'){
                if(JSON.parse(window.EditorPreload.getRobotData())[3]>args.TWO){
                    return true
                }else{
                    return false
                }
            }else if(args.ONE=='='){
                if(JSON.parse(window.EditorPreload.getRobotData())[3]==args.TWO){
                    return true
                }else{
                    return false
                }
            }else if(args.ONE=='<'){
                if(JSON.parse(window.EditorPreload.getRobotData())[3]<args.TWO){
                    return true
                }else{
                    return false
                }
            }
        }
        
        // console.log(socket.checkWebSocketStatusRecive())
        // if(socket.checkWebSocketStatusRecive()==4 || socket.checkWebSocketStatusRecive()==0){
        //     console.log('断开连接，尝试重连')
        //     await socket.setSocketRecive()
        // }else if(socket.checkWebSocketStatusRecive()==2){
        //     if(Date.now()-socket.getMessageTime()>5000){
        //         console.log('断开连接，尝试重连----')
        //         await socket.setSocketRecive()
        //     }
            

        //     if(args.ONE=='>'){
        //         if(this.message[3]>args.TWO){
        //             return true
        //         }else{
        //             return false
        //         }
        //     }else if(args.ONE=='='){
        //         if(this.message[3]==args.TWO){
        //             return true
        //         }else{
        //             return false
        //         }
        //     }else if(args.ONE=='<'){
        //         if(this.message[3]<args.TWO){
        //             return true
        //         }else{
        //             return false
        //         }
        //     }
        // }
    
        
        
    }

  }



  async sound(){
    if(this.mode){
        if(this.whatSendFun=='net' || this.whatSendFun=='port'){
            if(socket.getIp().length==0 && this.whatSendFun=='net'){
                this.showToast('未连接机器人')
                this.runtime.stopAll();
                return
            }
            console.log(this.message)
            return this.message[3]
        }else if(this.whatSendFun=='ble'){
            // console.log(typeof window.EditorPreload.getRobotData())
            return JSON.parse(window.EditorPreload.getRobotData())[3]
        }
        

        // return window.EditorPreload.getRobotData()[0]


        // console.log(socket.checkWebSocketStatusRecive())
        // if(socket.checkWebSocketStatusRecive()==4 || socket.checkWebSocketStatusRecive()==0){
        //     console.log('断开连接，尝试重连')
        //     await socket.setSocketRecive()
        // }else if(socket.checkWebSocketStatusRecive()==2){
        //     if(Date.now()-socket.getMessageTime()>5000){
        //         console.log('断开连接，尝试重连----')
        //         await socket.setSocketRecive()
        //     }
            

        //    return this.message[3]
        // }
    
        
        
    }

  }
  async elector(){
    if(this.mode){
        if(this.whatSendFun=='net' || this.whatSendFun=='port'){
            if(socket.getIp().length==0 && this.whatSendFun=='net'){
                this.showToast('未连接机器人')
                this.runtime.stopAll();
                return
            }
            console.log(this.message)
            return (this.message[4]/4)*100
        }else if(this.whatSendFun=='ble'){
            return ( JSON.parse(window.EditorPreload.getRobotData())[4]/4)*100
        }
        

        // return window.EditorPreload.getRobotData()[1]

        // console.log(socket.checkWebSocketStatusRecive())
        // if(socket.checkWebSocketStatusRecive()==4 || socket.checkWebSocketStatusRecive()==0){
        //     console.log('断开连接，尝试重连')
        //     await socket.setSocketRecive()
        // }else if(socket.checkWebSocketStatusRecive()==2){
        //     if(Date.now()-socket.getMessageTime()>5000){
        //         console.log('断开连接，尝试重连----')
        //         await socket.setSocketRecive()
        //     }
            
        //     return (this.message[4]/4)*100
        // }
    
        
        
    }

  }

  async speed(args){
    if(this.mode){
        if(this.whatSendFun=='net' || this.whatSendFun=='port'){
            if(socket.getIp().length==0 && this.whatSendFun=='net'){
                this.showToast('未连接机器人')
                this.runtime.stopAll();
                return
            }
            console.log(this.message)
            if(args.ONE=='0'){
                return this.message[5]
            }else{
                return this.message[6]  
            }
        }else if(this.whatSendFun=='ble'){
            if(args.ONE=='0'){
                return JSON.parse(window.EditorPreload.getRobotData())[5]
            }else{
                return JSON.parse(window.EditorPreload.getRobotData())[6]  
            }
        }
        


        // return window.EditorPreload.getRobotData()[2]
        // console.log(socket.checkWebSocketStatusRecive())
        // if(socket.checkWebSocketStatusRecive()==4 || socket.checkWebSocketStatusRecive()==0){
        //     console.log('断开连接，尝试重连')
        //     await socket.setSocketRecive()
        // }else if(socket.checkWebSocketStatusRecive()==2){
        //     if(Date.now()-socket.getMessageTime()>5000){
        //         console.log('断开连接，尝试重连----')
        //         await socket.setSocketRecive()
        //     }
            
        //     if(args.ONE=='0'){
        //         return this.message[5]
        //     }else{
        //         return this.message[6]  
        //     }
            
        // }
    
        
        
    }
  }

  async private(){
    if(this.mode){
        if(this.whatSendFun=='net' || this.whatSendFun=='port'){
            if(socket.getIp().length==0 && this.whatSendFun=='net'){
                this.showToast('未连接机器人')
                this.runtime.stopAll();
                return
            }
            console.log(this.message)
            return this.message[2]
        }else if(this.whatSendFun=='ble'){
            return JSON.parse(window.EditorPreload.getRobotData())[2]
        }
        
        // console.log(socket.checkWebSocketStatusRecive())
        // if(socket.checkWebSocketStatusRecive()==4 || socket.checkWebSocketStatusRecive()==0){
        //     console.log('断开连接，尝试重连')
        //     await socket.setSocketRecive()
        // }else if(socket.checkWebSocketStatusRecive()==2){
        //     if(Date.now()-socket.getMessageTime()>5000){
        //         console.log('断开连接，尝试重连----')
        //         await socket.setSocketRecive()
        //     }
            
        //     return this.message[2]
        // }
    
        
        
    }
  }

  async distance(args){
    if(this.mode){
        if(this.whatSendFun=='net' || this.whatSendFun=='port'){
            if(socket.getIp().length==0 && this.whatSendFun=='net'){
                this.showToast('未连接机器人')
                this.runtime.stopAll();
                return
            }
            console.log(this.message)
            if(args.ONE=='0'){
                return this.message[7]
            }else{
                return this.message[8]
            }
        }else if(this.whatSendFun=='ble'){
            if(args.ONE=='0'){
                return JSON.parse(window.EditorPreload.getRobotData())[7]
            }else{
                return JSON.parse(window.EditorPreload.getRobotData())[8]
            }
        }
        
        // console.log(socket.checkWebSocketStatusRecive())
        // if(socket.checkWebSocketStatusRecive()==4 || socket.checkWebSocketStatusRecive()==0){
        //     console.log('断开连接，尝试重连')
        //     await socket.setSocketRecive()
        // }else if(socket.checkWebSocketStatusRecive()==2){
        //     if(Date.now()-socket.getMessageTime()>5000){
        //         console.log('断开连接，尝试重连----')
        //         await socket.setSocketRecive()
        //     }
            
        //     if(args.ONE=='0'){
        //         return this.message[8]
        //     }else{
        //         return this.message[9]
        //     }
            
        // }
    
        
        
    }
  }

  async startLine(args){
    if(this.mode){

        
        let jsonData={
            "command":"line_tracking",
            "params":{
                "mode":2,
                "speed":Number(args.ONE),
                "line":[0,0,0,0,0],
            }
        }
        // let str = `robot.set_line_mode(${args.ONE})\r`;
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
            // this.sendCommandAndWaitForSuccess(JSON.stringify([0XAA,0x01,0x45,Number(args.ONE)]))
        }else if(this.whatSendFun=='ble'){
            const ackPromise = this.waitForThreeZeros();
            socketBle.getSocket().send(JSON.stringify([0XAA,0x01,0x45,Number(args.ONE)]))
            await ackPromise
        }
        
    }
  }

  async stopLine(){
    if(this.mode){

        
        let jsonData={
            "command":"line_tracking",
            "params":{
                "mode":3,
                "speed":0,
                "line":[0,0,0,0,0],
            }
        }
        // let str = `robot.set_line_mode(${args.ONE})\r`;
        let str = JSON.stringify(jsonData)
        // if(socket.checkWebSocketStatus()==4 || socket.checkWebSocketStatus()==0){
        //     console.log('断开连接，尝试重连')
        //     let context=[]
        //     context.push(str)
        //     await socket.setSocket(context)
        // }else if(socket.checkWebSocketStatus()==2){
        //     socket.getSocket().send(str);
        // }
        // socket.setLastPostTime(Date.now())

        if(this.whatSendFun=='net'){
            if(socket.getIp().length==0){
                this.showToast('未连接机器人')
                this.runtime.stopAll();
                return
            }
            const Socket = new WebSocket(`ws://${socket.getIp()}:8084`);
                    
            Socket.addEventListener('open', async (event) => {
                console.log('连接成功');
                Socket.send(str)
                await new Promise(resolve => setTimeout(resolve, 100));
                Socket.close()
    
                    
            });
        }else if(this.whatSendFun=='port'){
            // this.channelPort.postMessage(str)
            await this.sendCommandAndWaitForSuccess(str)
            // this.sendCommandAndWaitForSuccess(JSON.stringify([0XAA,0x01,0x47]))
        }else if(this.whatSendFun=='ble'){
            const ackPromise = this.waitForThreeZeros();
            socketBle.getSocket().send(JSON.stringify([0XAA,0x01,0x47]))
            await ackPromise
        }

        
    }
  }



  binary5ToDecimal(binaryStr) {
    // 检查输入是否是5位二进制数
    if (!/^[01]{5}$/.test(binaryStr)) {
        throw new Error("输入必须是5位二进制字符串，例如 '10101'");
    }

    // 使用 parseInt 转为十进制
    return parseInt(binaryStr, 2);
    }
  async startLineUntil(args){
    if(this.mode){
        // console.log(args.ONE)
        // console.log(typeof args.ONE)

        
        const arr = args.ONE.toString().split('').map(Number);
        let jsonData={
            "command":"line_tracking",
            "params":{
                "mode":1,
                "speed":Number(args.TWO),
                "line":arr
            }
        }
        // let str = `robot.set_line_mode(${args.ONE})\r`;
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
            await this.waitForSuccess()
            socket.setLastPostTime(Date.now())
        }else if(this.whatSendFun=='port'){
            // this.channelPort.postMessage(str)
            await this.sendCommandAndWaitForSuccess(str)
            // this.sendCommandAndWaitForSuccess(JSON.stringify([0XAA,0x01,0x46,Number(args.TWO),...arr]))
        }else if(this.whatSendFun=='ble'){
            const ackPromise = this.waitForThreeZeros();
            socketBle.getSocket().send(JSON.stringify([0XAA,0x01,0x46,Number(args.TWO),...arr]))
            // await this.waitForArrayMatchInArray(() => [0xcc,0]);
            await ackPromise
        }
        
    }
  }


  async closeLight(){
    if(this.mode){

        

        let jsonData={
            "command":"rgb_sensor",
            "params":{
                "mode":4,
                "learn_color":0,
                "num":0
            }
        }
        // let str = `robot.set_line_mode(${args.ONE})\r`;
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
            // this.sendCommandAndWaitForSuccess(JSON.stringify([0XAA,0x01,0x44]))
        }else if(this.whatSendFun=='ble'){
            const ackPromise = this.waitForThreeZeros();
            socketBle.getSocket().send(JSON.stringify([0XAA,0x01,0x44]))
            await ackPromise
        }
        
    }
  }


  async cstartsound(args){

    
    if(args.ONE=='1'){
        socketSound = new WebSocket(`ws://${socket.getIp()}:8080`)

        isSSRecording = true;
        socketSound.addEventListener('open',async()=>{
        // 获取麦克风音频流
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new AudioContext({ sampleRate: 8000 });
        const source = audioContext.createMediaStreamSource(stream);

        processor = audioContext.createScriptProcessor(1024, 1, 1);
        source.connect(processor);
        processor.connect(audioContext.destination);

        // 处理音频数据块
        processor.onaudioprocess = (event) => {
            const inputBuffer = event.inputBuffer.getChannelData(0);
            const int16Array = new Int16Array(inputBuffer.length);

            // 将浮点数据转换为 16 位整数
            for (let i = 0; i < inputBuffer.length; i++) {
                int16Array[i] = Math.min(1, Math.max(-1, inputBuffer[i])) * 0x7FFF;
            }

            audioChunks.push(...int16Array);

            // 检查是否达到了 CHUNK_SIZE 大小
            if (audioChunks.length >= CHUNK_SIZE) {
                const chunkToSend = audioChunks.slice(0, CHUNK_SIZE); // 截取 CHUNK_SIZE 大小
                audioChunks = audioChunks.slice(CHUNK_SIZE); // 保留剩余部分
                this.sendAudioChunk(chunkToSend);
            }
        };
        })

        // setTimeout(() => {
        //     this.cstartsound('2')
        // }, 5000);

        
    }else{
        
        isSSRecording = false;

        if (processor) processor.disconnect();
        if (audioContext) audioContext.close();

        // 清空剩余的音频块
        if (audioChunks.length > 0) {
            this.sendAudioChunk(audioChunks);
            audioChunks = [];
        }

        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        socketSound.close()
    }
    

  }

  async moveClearDistance(args){
      if(this.mode){
          
  
          let jsonData={
              "command":"motor",
              "params":{
                  "mode":9,
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
            //   this.channelPort.postMessage(str)
            await this.sendCommandAndWaitForSuccess(str)
            // this.sendCommandAndWaitForSuccess(JSON.stringify([0XAA,0x01,0x48]))
          }else if(this.whatSendFun=='ble'){
            const ackPromise = this.waitForThreeZeros();
            socketBle.getSocket().send(JSON.stringify([0XAA,0x01,0x48]))
            await ackPromise
          }
          
          // await new Promise(resolve => setTimeout(resolve, 50));
      }
    }

    async sendAudioChunk(chunk) {


        console.log(new Int16Array(chunk).buffer)
        socketSound.send(new Int16Array(chunk).buffer)
        // if(socket.checkWebSocketStatus()==4 || socket.checkWebSocketStatus()==0){
        //     console.log('断开连接，尝试重连')
        //     let context=[]
        //     context.push(str)
        //     await socket.setSocket(context)
        //     await new Promise(resolve => setTimeout(resolve, 200)); 
        // }else if(socket.checkWebSocketStatus()==2){
        //     socket.getSocket().send(str);
        //     await new Promise(resolve => setTimeout(resolve, 50));  // 等待1秒
        // }
        // try {
        //     const response = await fetch('http://192.168.4.1:8082/receive_audio', {
        //         method: 'POST',
        //         headers: {
        //             "Content-Type": "application/octet-stream"
        //         },
        //         body: new Int16Array(chunk).buffer // 转为 ArrayBuffer 发送
        //     });

        //     if (response.ok) {
        //         console.log('音频块上传成功');
        //     } else {
        //         console.error('上传音频块失败:', response.statusText);
        //     }
        // } catch (error) {
        //     console.error('上传音频块错误:', error);
        // }

    }
}


module.exports = RobotSensors;
