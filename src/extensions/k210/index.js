const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type')
const socket=require('../../util/socket-connect')
const actuatorIcon = require('./actuator.svg')
const innerHand = require('./innerHand.svg')
const innerPort = require('./innerPort.svg')
const formatMessage = require('format-message');
const socketBle = require('../../util/localSocket')
const {getDevice,setDevice} = require('../../util/currentDevice')
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

class k210 {
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

        this.currentDevice=getDevice();
        this.channelDevice = new BroadcastChannel('current-device')
        this.channelDevice.addEventListener('message',(event)=>{
            this.currentDevice=event.data
            // this.runtime.requestBlocksUpdate();
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
      id: 'k210',
      name: formatMessage({
                id: 'k210.name',
                default: 'k210',
                description: 'k210.name'
            }),
      color1:'#ff41bc',
    //   menuIconURI: actuatorIcon,
      blocks: [

        
        {
            opcode: 'settings',
            blockType: BlockType.COMMAND,
            text: formatMessage({
                id: 'k210.settings',
                default: 'Switch vision module to [TWO]',
                description: 'k210.settings'
            }),
            arguments:{
                // ONE:{
                //     type: ArgumentType.STRING,
                //     menu:'MENU_PORT',
                //     // defaultValue:'1'
                // },
                TWO:{
                    type: ArgumentType.STRING,
                    menu:'MENU_MODE',
                }
            }
        },

        {
            opcode: 'settingsBricks',
            blockType: BlockType.COMMAND,
            text: formatMessage({
                id: 'k210.settingsBricks',
                default: 'port [ONE] Switch vision module to [TWO]',
                description: 'k210.settingsBricks'
            }),
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu:'MENU_PORT',
                    // defaultValue:'1'
                },
                TWO:{
                    type: ArgumentType.STRING,
                    menu:'MENU_MODE',
                }
            }
        },

        {
            opcode: 'currentMode',
            blockType: BlockType.REPORTER,
            text: formatMessage({
                id: 'k210.currentMode',
                default: 'Current mode',
                description: 'k210.currentMode'
            }),
            arguments:{
            },
            disableMonitor: true
        },
         {
            opcode: 'xiaozhi',
            blockType: BlockType.REPORTER,
            text: formatMessage({
                id: 'k210.xiaozhi',
                default: 'Xiaozhi’s status is [ONE]',
                description: 'k210.xiaozhi'
            }),
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu:'MENU_XIAOZHI',
                }
            },
            disableMonitor: true
        },

        {
            blockType: BlockType.LABEL,
            text: formatMessage({
                id: 'k210.colorRecognLabel',
                default: 'color recognition',
                description: 'k210.colorRecognLabel'
            }),
        },

        {
            opcode: 'colorRecogn',
            blockType: BlockType.REPORTER,
            text: formatMessage({
                id: 'k210.colorRecogn',
                default: 'Recognized color [ONE] value',
                description: 'k210.colorRecogn'
            }),
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu:'MENU_RGB'
                }
            },
            disableMonitor: true
        },


        {
            blockType: BlockType.LABEL,
            text: formatMessage({
                id: 'k210.colorBlockLabel',
                default: 'color block tracking',
                description: 'k210.colorBlockLabel'
            }),
        },

        {
            opcode: 'colorBlockSet',
            blockType: BlockType.COMMAND,
            text: formatMessage({
                id: 'k210.colorBlockSet',
                default: 'Set tracking color [ONE]',
                description: 'k210.colorBlockSet'
            }),
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu:'MENU_COLOR'
                }
            }
        },

        {
            opcode: 'colorIsTrack',
            blockType: BlockType.BOOLEAN,
            text: formatMessage({
                id: 'k210.colorIsTrack',
                default: 'Tracked target color?',
                description: 'k210.colorIsTrack'
            }),
            arguments:{
            },
            disableMonitor: true
        },

        {
            opcode: 'colorBlockInfo',
            blockType: BlockType.REPORTER,
            text: formatMessage({
                id: 'k210.colorBlockInfo',
                default: 'Get color block position info [ONE]',
                description: 'k210.colorBlockInfo'
            }),
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu:'MENU_PLACE'
                }
            },
            disableMonitor: true
        },


        {
            blockType: BlockType.LABEL,
            text: formatMessage({
                id: 'k210.tagLabel',
                default: 'tag recognition',
                description: 'k210.tagLabel'
            }),
        },
        
         {
            opcode: 'tagNum',
            blockType: BlockType.REPORTER,
            text: formatMessage({
                id: 'k210.tagNum',
                default: 'Number of recognized tags',
                description: 'k210.tagNum'
            }),
            arguments:{

            },
            disableMonitor: true
        },

        {
            opcode: 'tagCont',
            blockType: BlockType.REPORTER,
            text: formatMessage({
                id: 'k210.tagCont',
                default: 'Recognized tag content',
                description: 'k210.tagCont'
            }),
            arguments:{

            },
            disableMonitor: true
        },

        {
            opcode: 'tagAngle',
            blockType: BlockType.REPORTER,
            text: formatMessage({
                id: 'k210.tagAngle',
                default: 'Tag rotation angle',
                description: 'k210.tagAngle'
            }),
            arguments:{

            },
            disableMonitor: true
        },


        {
            opcode: 'tagInfo',
            blockType: BlockType.REPORTER,
            text: formatMessage({
                id: 'k210.tagInfo',
                default: 'Recognized tag position info [ONE]',
                description: 'k210.tagInfo'
            }),
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu:'MENU_PLACE'
                }
            },
            disableMonitor: true
        },

        {
            blockType: BlockType.LABEL,
            text: formatMessage({
                id: 'k210.lineLabel',
                default: 'line recognition',
                description: 'k210.lineLabel'
            }),
        },
        {
            opcode: 'lineIsRecog',
            blockType: BlockType.BOOLEAN,
            text: formatMessage({
                id: 'k210.lineIsRecog',
                default: 'Is a line recognized?',
                description: 'k210.lineIsRecog'
            }),
            arguments:{
            },
            disableMonitor: true
        },
        {
            opcode: 'lineInfo',
            blockType: BlockType.REPORTER,
            text: formatMessage({
                id: 'k210.lineInfo',
                default: 'Get line position info at [ONE] [TWO]',
                description: 'k210.lineInfo'
            }),
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu:'MENU_PLACE_VERTICAL'
                },
                TWO:{
                    type: ArgumentType.STRING,
                    menu:'MENU_PLACE'
                }
            },
            disableMonitor: true
        },

        {
            blockType: BlockType.LABEL,
            text: formatMessage({
                id: 'k210.objectLabel',
                default: '20-class object recognition',
                description: 'k210.objectLabel'
            }),
        },

        {
            opcode: 'objectNum',
            blockType: BlockType.REPORTER,
            text: formatMessage({
                id: 'k210.objectNum',
                default: 'Number of recognized objects',
                description: 'k210.objectNum'
            }),
            arguments:{

            },
            disableMonitor: true
        },

         {
            opcode: 'objectIsRecogn',
            blockType: BlockType.BOOLEAN,
            text: formatMessage({
                id: 'k210.objectIsRecogn',
                default: 'Recognized object  [ONE]?',
                description: 'k210.objectIsRecogn'
            }),
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu:'MENU_OBJ'
                },
            },
            disableMonitor: true
        },

         {
            opcode: 'objInfo',
            blockType: BlockType.REPORTER,
            text: formatMessage({
                id: 'k210.objInfo',
                default: 'Recognized object position info [ONE]',
                description: 'k210.objInfo'
            }),
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu:'MENU_PLACE'
                }
            },
            disableMonitor: true
        },


        {
            blockType: BlockType.LABEL,
            text: formatMessage({
                id: 'k210.qrLabel',
                default: 'QR code recognition',
                description: 'k210.qrLabel'
            }),
        },


         {
            opcode: 'qrIsRecogn',
            blockType: BlockType.BOOLEAN,
            text: formatMessage({
                id: 'k210.qrIsRecogn',
                default: 'Is a QR code recognized?',
                description: 'k210.qrIsRecogn'
            }),
            arguments:{
            },
            disableMonitor: true
        },

        {
            opcode: 'qrCont',
            blockType: BlockType.REPORTER,
            text: formatMessage({
                id: 'k210.qrCont',
                default: 'Recognized QR code content',
                description: 'k210.qrCont'
            }),
            arguments:{
            },
            disableMonitor: true
        },
        {
            opcode: 'qrInfo',
            blockType: BlockType.REPORTER,
            text: formatMessage({
                id: 'k210.qrInfo',
                default: 'Recognized QR code position info [ONE]',
                description: 'k210.qrInfo'
            }),
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu:'MENU_PLACE'
                }
            },
            disableMonitor: true
        },

        {
            blockType: BlockType.LABEL,
            text: formatMessage({
                id: 'k210.faceAttrLabel',
                default: 'face attributes',
                description: 'k210.faceAttrLabel'
            }),
        },

         {
            opcode: 'faceAttrNum',
            blockType: BlockType.REPORTER,
            text: formatMessage({
                id: 'k210.faceAttrNum',
                default: 'Number of detected faces',
                description: 'k210.faceAttrNum'
            }),
            arguments:{

            },
            disableMonitor: true
        },


        {
            opcode: 'faceAttrInfo',
            blockType: BlockType.REPORTER,
            text: formatMessage({
                id: 'k210.faceAttrInfo',
                default: 'Detected [ONE] position info [TWO]',
                description: 'k210.faceAttrInfo'
            }),
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu:'MENU_FACE'
                },
                TWO:{
                    type: ArgumentType.STRING,
                    menu:'MENU_PLACE'
                }
            },
            disableMonitor: true
        },

        {
            opcode: 'faceAttrEmote',
            blockType: BlockType.BOOLEAN,
            text: formatMessage({
                id: 'k210.faceAttrEmote',
                default: 'Is [ONE] [TWO]?',
                description: 'k210.faceAttrEmote'
            }),
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu:'MENU_FACE'
                },
                TWO:{
                    type: ArgumentType.STRING,
                    menu:'MENU_EMOTE'
                }
            },
            disableMonitor: true
        },

        {
            blockType: BlockType.LABEL,
            text: formatMessage({
                id: 'k210.faceRecognLabel',
                default: 'face recognition',
                description: 'k210.faceRecognLabel'
            }),
        },
         {
            opcode: 'faceLearn',
            blockType: BlockType.COMMAND,
            text: formatMessage({
                id: 'k210.faceLearn',
                default: 'Learn current face',
                description: 'k210.faceLearn'
            }),
            arguments:{
            }
        },
        {
            opcode: 'faceRecogNum',
            blockType: BlockType.REPORTER,
            text: formatMessage({
                id: 'k210.faceRecogNum',
                default: 'Number of recognized faces',
                description: 'k210.faceRecogNum'
            }),
            arguments:{
               
            },
            disableMonitor: true
        },

        {
            opcode: 'faceRecogLearnNum',
            blockType: BlockType.REPORTER,
            text: formatMessage({
                id: 'k210.faceRecogLearnNum',
                default: 'Number of recognized learned faces',
                description: 'k210.faceRecogLearnNum'
            }),
            arguments:{
               
            },
            disableMonitor: true
        },

        {
            opcode: 'faceRecognEmote',
            blockType: BlockType.REPORTER,
            text: formatMessage({
                id: 'k210.faceRecognEmote',
                default: 'Recognized [ONE] position info [TWO]?',
                description: 'k210.faceRecognEmote'
            }),
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu:'MENU_FACE'
                },
                TWO:{
                    type: ArgumentType.STRING,
                    menu:'MENU_PLACE'
                }
            },
            disableMonitor: true
        },

        {
            blockType: BlockType.LABEL,
            text: formatMessage({
                id: 'k210.deepLearningLabel',
                default: 'deep learning',
                description: 'k210.deepLearningLabel'
            }),
        },

         {
            opcode: 'deepLearning',
            blockType: BlockType.BOOLEAN,
            text: formatMessage({
                id: 'k210.deepLearning',
                default: 'Is [ONE] recognized?',
                description: 'k210.deepLearning'
            }),
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu:'MENU_DEEP_CLASS'
                },
            },
            disableMonitor: true
        },

        {
            blockType: BlockType.LABEL,
            text: formatMessage({
                id: 'k210.roadLabel',
                default: 'road sign recognition',
                description: 'k210.roadLabel'
            }),
        },

        {
            opcode: 'roadNum',
            blockType: BlockType.REPORTER,
            text: formatMessage({
                id: 'k210.roadNum',
                default: 'Number of recognized road signs',
                description: 'k210.roadNum'
            }),
            arguments:{
            },
            disableMonitor: true
        },


        {
            opcode: 'roadRecog',
            blockType: BlockType.BOOLEAN,
            text: formatMessage({
                id: 'k210.roadRecog',
                default: 'Recognized road sign [ONE]?',
                description: 'k210.roadRecog'
            }),
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu:'MENU_ROAD'
                },
            },
            disableMonitor: true
        },

        {
            opcode: 'roadInfo',
            blockType: BlockType.REPORTER,
            text: formatMessage({
                id: 'k210.roadInfo',
                default: 'Recognized road sign position info [ONE]',
                description: 'k210.roadInfo'
            }),
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu:'MENU_PLACE'
                }
            },
            disableMonitor: true
        },

         {
            blockType: BlockType.LABEL,
            text: formatMessage({
                id: 'k210.wirelessLabel',
                default: 'WIRELESS IMAGE TRANSMISSION',
                description: 'k210.wirelessLabel'
            }),
        },


        {
            opcode: 'wirelessSet',
            blockType: BlockType.COMMAND,
            text: formatMessage({
                id: 'k210.wirelessSet',
                default: 'Connect to WiFi name: [ONE] Password: [TWO]',
                description: 'k210.wirelessSet'
            }),
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                },
                TWO:{
                    type: ArgumentType.STRING,
                },
            }
        },

        {
            opcode: 'wirelessConnect',
            blockType: BlockType.COMMAND,
            text: formatMessage({
                id: 'k210.wirelessConnect',
                default: 'Scan QR code to connect to WiFi',
                description: 'k210.wirelessConnect'
            }),
            arguments:{
            }
        },

          {
            opcode: 'wirelessSetBricks',
            blockType: BlockType.COMMAND,
            text: formatMessage({
                id: 'k210.wirelessSetBricks',
                default: 'port [THREE]Connect to WiFi name: [ONE] Password: [TWO]',
                description: 'k210.wirelessSetBricks'
            }),
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                },
                TWO:{
                    type: ArgumentType.STRING,
                },
                THREE:{
                    type: ArgumentType.STRING,
                    menu:'MENU_PORT',
                    // defaultValue:'1'
                },
            }
        },

        {
            opcode: 'wirelessConnectBricks',
            blockType: BlockType.COMMAND,
            text: formatMessage({
                id: 'k210.wirelessConnectBricks',
                default: 'port [ONE] Scan QR code to connect to WiFi',
                description: 'k210.wirelessConnectBricks'
            }),
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu:'MENU_PORT',
                    // defaultValue:'1'
                },
            }
        },

        {
            blockType: BlockType.LABEL,
            text: formatMessage({
                id: 'k210.settingsLabel',
                default: 'settings',
                description: 'k210.settingsLabel'
            }),
        },


        {
            opcode: 'lightSwitch',
            blockType: BlockType.COMMAND,
            text: formatMessage({
                id: 'k210.lightSwitch',
                default: '[ONE] fill light',
                description: 'k210.lightSwitch'
            }),
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu:'MENU_SWITCH'
                }
            }
        },

         {
            opcode: 'lightBrightness',
            blockType: BlockType.COMMAND,
            text: formatMessage({
                id: 'k210.lightBrightness',
                default: 'Set fill light brightness [ONE]',
                description: 'k210.lightBrightness'
            }),
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu:'MENU_BRIGHTNESS'
                }
            }
        },
        {
            opcode: 'lightGetBrightness',
            blockType: BlockType.REPORTER,
            text: formatMessage({
                id: 'k210.lightGetBrightness',
                default: 'Fill light brightness',
                description: 'k210.lightGetBrightness'
            }),
            arguments:{
            },
            disableMonitor: true
        },

        {
            opcode: 'lightSwitchBricks',
            blockType: BlockType.COMMAND,
            text: formatMessage({
                id: 'k210.lightSwitchBricks',
                default: 'port [TWO] [ONE] fill light',
                description: 'k210.lightSwitchBricks'
            }),
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu:'MENU_SWITCH'
                },
                TWO:{
                    type: ArgumentType.STRING,
                    menu:'MENU_PORT',
                    // defaultValue:'1'
                },
            }
        },

         {
            opcode: 'lightBrightnessBricks',
            blockType: BlockType.COMMAND,
            text: formatMessage({
                id: 'k210.lightBrightnessBricks',
                default: 'port [TWO] Set fill light brightness [ONE]',
                description: 'k210.lightBrightnessBricks'
            }),
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu:'MENU_BRIGHTNESS'
                },
                TWO:{
                    type: ArgumentType.STRING,
                    menu:'MENU_PORT',
                    // defaultValue:'1'
                },
            }
        },
        {
            opcode: 'lightGetBrightnessBricks',
            blockType: BlockType.REPORTER,
            text: formatMessage({
                id: 'k210.lightGetBrightnessBricks',
                default: 'port [ONE] Fill light brightness',
                description: 'k210.lightGetBrightnessBricks'
            }),
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu:'MENU_PORT',
                    // defaultValue:'1'
                },
            },
            disableMonitor: true
        },


      ],

      menus: {
        MENU_XIAOZHI: {
            acceptReporters: false,
            items: [
                {
                    text: formatMessage({
                        id: 'K210.menuXiaozhi.listen',
                        default: 'listen',
                        description: 'K210.menuXiaozhi.listen'
                    }),
                    value: '0'
                    },
                {
                    text: formatMessage({
                        id: 'K210.menuXiaozhi.speek',
                        default: 'speek',
                        description: 'K210.menuXiaozhi.speek'
                    }),
                    value: '1'
                },
                {
                    text: formatMessage({
                        id: 'K210.menuXiaozhi.none',
                        default: 'unknown',
                        description: 'K210.menuXiaozhi.none'
                    }),
                    value: '2'
                },
                
            ]
        },
        MENU_BRIGHTNESS: {
            acceptReporters: false,
            items: [
            {
                text:'0',
                value: '0'
            },
            {
                text:'1',
                value: '1'
            },
            {
                text:'2',
                value: '2'
            },
            {
                text:'3',
                value: '3'
            },
            {
                text:'4',
                value: '4'
            },
            {
                text:'5',
                value: '5'
            },
            {
                text:'6',
                value: '6'
            },
            {
                text:'7',
                value: '7'
            },
            {
                text:'8',
                value: '8'
            },
            {
                text:'9',
                value: '9'
            },
            {
                text:'10',
                value: '10'
            },
                
            ]
        },
        MENU_SWITCH: {
            acceptReporters: false,
            items: [
            {
                text: formatMessage({
                    id: 'K210.menuSwitch.open',
                    default: 'open',
                    description: 'K210.menuSwitch.open'
                }),
                value: '1'
                },
            {
                text: formatMessage({
                    id: 'K210.menuSwitch.close',
                    default: 'close',
                    description: 'K210.menuSwitch.close'
                }),
                value: '0'
            },
                
            ]
        },
        MENU_ROAD: {
            acceptReporters: false,
            items: [
                {
                    text: formatMessage({
                        id: 'k210.menuRoad.turnRight',
                        default: 'Turn Right',
                        description: 'k210.menuRoad.turnRight'
                    }),
                    value: '4'
                },
                {
                    text: formatMessage({
                        id: 'k210.menuRoad.turnLeft',
                        default: 'Turn Left',
                        description: 'k210.menuRoad.turnLeft'
                    }),
                    value: '1'
                },
                {
                    text: formatMessage({
                        id: 'k210.menuRoad.stop',
                        default: 'Stop',
                        description: 'k210.menuRoad.stop'
                    }),
                    value: '2'
                },
                {
                    text: formatMessage({
                        id: 'k210.menuRoad.honk',
                        default: 'Honk',
                        description: 'k210.menuRoad.honk'
                    }),
                    value: '5'
                },
                {
                    text: formatMessage({
                        id: 'k210.menuRoad.greenLight',
                        default: 'Green Light',
                        description: 'k210.menuRoad.greenLight'
                    }),
                    value: '0'
                },
                {
                    text: formatMessage({
                        id: 'k210.menuRoad.redLight',
                        default: 'Red Light',
                        description: 'k210.menuRoad.redLight'
                    }),
                    value: '3'
                },
                {
                    text: formatMessage({
                        id: 'k210.menuRoad.target',
                        default: 'Target',
                        description: 'k210.menuRoad.target'
                    }),
                    value: '6'
                }
            ]
        },


        MENU_DEEP_CLASS:{
            acceptReporters: false,
            items: [
                {
                    text: formatMessage({
                        id: 'k210.menuDeepClass.class0',
                        default: 'class 0',
                        description: 'k210.menuDeepClass.class0'
                    }),
                    value: '0'
                },
                {
                    text: formatMessage({
                        id: 'k210.menuDeepClass.class1',
                        default: 'class 1',
                        description: 'k210.menuDeepClass.class1'
                    }),
                    value: '1'
                },
               
            ]
        },

        MENU_EMOTE:{
            acceptReporters: false,
            items: [
                {
                    text: formatMessage({
                        id: 'k210.menuEmote.open',
                        default: 'Mouth Open',
                        description: 'k210.menuEmote.open'
                    }),
                    value: '1'
                },
                {
                    text: formatMessage({
                        id: 'k210.menuEmote.smiling',
                        default: 'Smiling',
                        description: 'k210.menuEmote.smiling'
                    }),
                    value: '2'
                },
                {
                    text: formatMessage({
                        id: 'k210.menuEmote.Wearing',
                        default: 'Wearing Glasses',
                        description: 'k210.menuEmote.Wearing'
                    }),
                    value: '3'
                },
               
            ]
        },
        MENU_FACE:{
            acceptReporters: false,
            items: [
                {
                    text: formatMessage({
                        id: 'k210.menuFace.face0',
                        default: 'Face 0',
                        description: 'k210.menuFace.face0'
                    }),
                    value: '0'
                },
                {
                    text: formatMessage({
                        id: 'k210.menuFace.face1',
                        default: 'Face 1',
                        description: 'k210.menuFace.face1'
                    }),
                    value: '1'
                },
                {
                    text: formatMessage({
                        id: 'k210.menuFace.face2',
                        default: 'Face 2',
                        description: 'k210.menuFace.face2'
                    }),
                    value: '2'
                },
                {
                    text: formatMessage({
                        id: 'k210.menuFace.face3',
                        default: 'Face 3',
                        description: 'k210.menuFace.face3'
                    }),
                    value: '3'
                },
               
            ]
        },
        MENU_OBJ: {
            acceptReporters: false,
            items: [
                {
                    text: formatMessage({
                        id: 'k210.menuObj.Airplane',
                        default: '(0)Airplane',
                        description: 'k210.menuObj.Airplane'
                    }),
                    value: '0'
                },
                {
                    text: formatMessage({
                        id: 'k210.menuObj.Bicycle',
                        default: '(1)Bicycle',
                        description: 'k210.menuObj.Bicycle'
                    }),
                    value: '1'
                },
                {
                    text: formatMessage({
                        id: 'k210.menuObj.Bird',
                        default: '(2)Bird',
                        description: 'k210.menuObj.Bird'
                    }),
                    value: '2'
                },
                {
                    text: formatMessage({
                        id: 'k210.menuObj.Boat',
                        default: '(3)Boat',
                        description: 'k210.menuObj.Boat'
                    }),
                    value: '3'
                },
                {
                    text: formatMessage({
                        id: 'k210.menuObj.Bottle',
                        default: '(4)Bottle',
                        description: 'k210.menuObj.Bottle'
                    }),
                    value: '4'
                },
                {
                    text: formatMessage({
                        id: 'k210.menuObj.Bus',
                        default: '(5)Bus',
                        description: 'k210.menuObj.Bus'
                    }),
                    value: '5'
                },
                {
                    text: formatMessage({
                        id: 'k210.menuObj.Car',
                        default: '(6)Car',
                        description: 'k210.menuObj.Car'
                    }),
                    value: '6'
                },
                {
                    text: formatMessage({
                        id: 'k210.menuObj.Cat',
                        default: '(7)Cat',
                        description: 'k210.menuObj.Cat'
                    }),
                    value: '7'
                },
                {
                    text: formatMessage({
                        id: 'k210.menuObj.Chair',
                        default: '(8)Chair',
                        description: 'k210.menuObj.Chair'
                    }),
                    value: '8'
                },
                {
                    text: formatMessage({
                        id: 'k210.menuObj.Cow',
                        default: '(9)Cow',
                        description: 'k210.menuObj.Cow'
                    }),
                    value: '9'
                },
                {
                    text: formatMessage({
                        id: 'k210.menuObj.DiningTable',
                        default: '(10)Dining Table',
                        description: 'k210.menuObj.DiningTable'
                    }),
                    value: '10'
                },
                {
                    text: formatMessage({
                        id: 'k210.menuObj.Dog',
                        default: '(11)Dog',
                        description: 'k210.menuObj.Dog'
                    }),
                    value: '11'
                },
                {
                    text: formatMessage({
                        id: 'k210.menuObj.House',
                        default: '(12)House',
                        description: 'k210.menuObj.House'
                    }),
                    value: '12'
                },
                {
                    text: formatMessage({
                        id: 'k210.menuObj.Motorcycle',
                        default: '(13)Motorcycle',
                        description: 'k210.menuObj.Motorcycle'
                    }),
                    value: '13'
                },
                {
                    text: formatMessage({
                        id: 'k210.menuObj.Person',
                        default: '(14)Person',
                        description: 'k210.menuObj.Person'
                    }),
                    value: '14'
                },
                {
                    text: formatMessage({
                        id: 'k210.menuObj.PottedPlant',
                        default: '(15)Potted Plant',
                        description: 'k210.menuObj.PottedPlant'
                    }),
                    value: '15'
                },
                {
                    text: formatMessage({
                        id: 'k210.menuObj.Sheep',
                        default: '(16)Sheep',
                        description: 'k210.menuObj.Sheep'
                    }),
                    value: '16'
                },
                {
                    text: formatMessage({
                        id: 'k210.menuObj.Sofa',
                        default: '(17)Sofa',
                        description: 'k210.menuObj.Sofa'
                    }),
                    value: '17'
                },
                {
                    text: formatMessage({
                        id: 'k210.menuObj.Ship',
                        default: '(18)Ship',
                        description: 'k210.menuObj.Ship'
                    }),
                    value: '18'
                },
                {
                    text: formatMessage({
                        id: 'k210.menuObj.Television',
                        default: '(19)Television',
                        description: 'k210.menuObj.Television'
                    }),
                    value: '19'
                }
            ]
        },


        MENU_PLACE_VERTICAL:{
            acceptReporters: false,
            items: [
                {
                    text: formatMessage({
                        id: 'k210.menuPlaceVertical.top',
                        default: 'top',
                        description: 'k210.menuPlaceVertical.top'
                    }),
                    value: '2'
                },
                {
                    text: formatMessage({
                        id: 'k210.menuPlaceVertical.middle',
                        default: 'middle',
                        description: 'k210.menuPlaceVertical.middle'
                    }),
                    value: '1'
                },
                {
                    text: formatMessage({
                        id: 'k210.menuPlaceVertical.bottom',
                        default: 'bottom',
                        description: 'k210.menuPlaceVertical.bottom'
                    }),
                    value: '0'
                },
               
            ]
        },

        MENU_PLACE:{
            acceptReporters: false,
            items: [
                {
                    text: 'x',
                    value: '0'
                },
                {
                    text: 'y',
                    value: '1'
                },
                {
                    text: 'W',
                    value: '2'
                },
                {
                    text: 'H',
                    value: '3'
                },
               
            ]
        },
        MENU_RGB:{
            acceptReporters: false,
            items: [
                {
                    text: 'R',
                    value: 'r'
                },
                {
                    text: 'G',
                    value: 'g'
                },
                {
                    text: 'B',
                    value: 'b'
                },

            ]
        },
        MENU_COLOR:{
            acceptReporters: false,
            items: [
                {
                    text: formatMessage({
                        id: 'robotcolorplace.menuColor.red',
                        default: 'Red',
                        description: 'robotcolorplace.menuColor.red'
                    }),
                    value: '1'
                },
                {
                    text: formatMessage({
                        id: 'robotcolorplace.menuColor.yellow',
                        default: 'Yellow',
                        description: 'robotcolorplace.menuColor.yellow'
                    }),
                    value: '4'
                },
                {
                    text: formatMessage({
                        id: 'robotcolorplace.menuColor.green',
                        default: 'Green',
                        description: 'robotcolorplace.menuColor.green'
                    }),
                    value: '2'
                },
                {
                    text: formatMessage({
                        id: 'robotcolorplace.menuColor.blue',
                        default: 'Blue',
                        description: 'robotcolorplace.menuColor.blue'
                    }),
                    value: '3'
                },
                {
                    text: formatMessage({
                        id: 'robotcolorplace.menuColor.black',
                        default: 'Black',
                        description: 'robotcolorplace.menuColor.black'
                    }),
                    value: '5'
                },
                {
                    text: formatMessage({
                        id: 'robotcolorplace.menuColor.white',
                        default: 'White',
                        description: 'robotcolorplace.menuColor.white'
                    }),
                    value: '6'
                },
            ]
        },
        MENU_PORT: {
            acceptReporters: false,
            items: [
                {
                text: '1',
                value: '7'
                },
                {
                text: '2',
                value: '0'
                },
                {
                    text: '3',
                    value: '6'
                },
                {
                    text: '4',
                    value: '1'
                },
                {
                    text: '5',
                    value: '5'
                },
                {
                    text: '6',
                    value: '2'
                },
                {
                    text: '7',
                    value: '4'
                },
                {
                    text: '8',
                    value: '3'
                },
                
            ]
        },
        // MENU_PORT: {
        //     acceptReporters: false,
        //     items: 'getPorts'
        // },

        MENU_MODE: {
            acceptReporters: false,
            items: [
                {
                    text: formatMessage({
                        id: 'k210.menuMode.recogn',
                        default: 'color recognition',
                        description: 'k210.menuMode.recogn'
                    }),
                    value: '1'
                },
                {
                    text: formatMessage({
                        id: 'k210.menuMode.colorBlock',
                        default: 'color block tracking',
                        description: 'k210.menuMode.colorBlock'
                    }),
                    value: '2'
                },
                {
                    text: formatMessage({
                        id: 'k210.menuMode.tag',
                        default: 'tag recognition',
                        description: 'k210.menuMode.tag'
                    }),
                    value: '3'
                },
                {
                    text: formatMessage({
                        id: 'k210.menuMode.line',
                        default: 'line recognition',
                        description: 'k210.menuMode.line'
                    }),
                    value: '4'
                },
                {
                    text: formatMessage({
                        id: 'k210.menuMode.class',
                        default: '20-class object recognition',
                        description: 'k210.menuMode.class'
                    }),
                    value: '5'
                },

                {
                    text: formatMessage({
                        id: 'k210.menuMode.qr',
                        default: 'QR code recognition',
                        description: 'k210.menuMode.qr'
                    }),
                    value: '6'
                },

                {
                    text: formatMessage({
                        id: 'k210.menuMode.faceAttr',
                        default: 'face attributes',
                        description: 'k210.menuMode.faceAttr'
                    }),
                    value: '7'
                },

                {
                    text: formatMessage({
                        id: 'k210.menuMode.faceRecogn',
                        default: 'face recognition',
                        description: 'k210.menuMode.faceRecogn'
                    }),
                    value: '8'
                },
                {
                    text: formatMessage({
                        id: 'k210.menuMode.deep',
                        default: 'deep learning',
                        description: 'k210.menuMode.deep'
                    }),
                    value: '9'
                },

                {
                    text: formatMessage({
                        id: 'k210.menuMode.road',
                        default: 'road sign recognition',
                        description: 'k210.menuMode.road'
                    }),
                    value: '10'
                },
                
            ]
        },
    }
    };
  }




//   getPorts(){
//         let item=[{
//             text: formatMessage({
//                 id: 'robotteachable.getConnectedSensorsSelect',
//                 default: 'Please select',
//                 description: 'robotteachable.getConnectedSensorsSelect'
//             }),
//             value:'请选择'
//         }];

//         let port=[
//                 {
//                     text: '1',
//                     value: '1'
//                 },
//                 {
//                     text: '2',
//                     value: '2'
//                 },
//                 {
//                     text: '3',
//                     value: '3'
//                 },
//                 {
//                     text: '4',
//                     value: '4'
//                 },
//                  {
//                     text: '5',
//                     value: '5'
//                 },
//                 {
//                     text: '6',
//                     value: '6'
//                 },
//                 {
//                     text: '7',
//                     value: '7'
//                 },
//                 {
//                     text: '8',
//                     value: '8'
//                 },
                
//             ]
//         if(this.currentDevice=='ICBricks'){
//             port.forEach((content)=>{
//                 item.push(content)
//             })
//         }else if(this.currentDevice=='Microbit' || this.currentDevice==''){
//             item=[
//                 {
//                     text:'无需选择端口',
//                     value:'noneed'
//                 }
//             ]
//         }
        
//         console.log(item)
        
//         return item

//     }


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



    async ICMB_send(str){
        //console.log('[发送]', str);
        // 发送命令到主进程
        try {
            const result = await window.EditorPreload.sendCommandToDevice(str);
            //console.log('[收到返回]', result.response || result.error);
            if(!result.success){
                showToast(result.error)
            }
            return result;
        } catch (e) {
            console.error('[发送失败]', e);
            return { success: false, error: e.message };
        }
    }



    //读取命令
    async ICMBP_read(str){
        //console.log('[读取]', str);
        try {
            const result = await window.EditorPreload.sendCommandToDevice(str);
            if (result.success) {
                const raw = result.response.trim();
                //console.log('[读取返回]', raw);
                const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(l => l);// 拆成多行

                // 去掉首行和末行
                if (lines.length >= 2 && lines[lines.length - 1] === '>>>') {
                    lines.pop(); 
                }
                const contentLines = lines.slice(1);
                
                return contentLines.length === 1 ? contentLines[0] : contentLines;
            } else {
                //console.error('[读取失败]', result.error);
                showToast(result.error)
                return null;
            }
        } catch (e) {
            console.error('[读取异常]', e);
            return null;
        }
    }

    async settings(args){
        if(this.currentDevice=='Microbit'){
            await this.ICMB_send(`aiCamera.set_sys_mode(${Number(args.TWO)})`)
        }
        
    }

    async currentMode(){
        if(this.currentDevice=='Microbit'){
            return this.ICMBP_read(`aiCamera.get_sys_mode()`);
        }
    }
    async colorRecogn(args){
        if(this.currentDevice=='Microbit'){
            let str=await this.ICMBP_read(`aiCamera.get_color_rgb()`)
            console.log(str)
            let [R, G, B] = str.slice(1, -1).split(",").map(Number);
            if(args.ONE=='r'){
                return R
            }else if(args.ONE=='g'){
                return G
            }else if(args.ONE=='b'){
                return B
            }
        }
        // return this.ICMBP_read(`aiCamera.get_color_rgb()`);
    }

    async colorBlockSet(args){
        if(this.currentDevice=='Microbit'){
            console.log(Number(args.ONE))
            await this.ICMB_send(`aiCamera.set_find_color(ai_camera.patch_color_tab[${Number(args.ONE)}])`)
        }
    }

    async colorIsTrack(){
        if(this.currentDevice=='Microbit'){
            let num=await this.ICMBP_read(`aiCamera.get_identify_num(ai_camera.AI_CAMERA_PATCH)`)
            console.log(num)
            console.log(typeof num)
            if(num>0){
                return true
            }else{
                return false
            }
        }
    }

    async colorBlockInfo(args){
        if(this.currentDevice=='Microbit'){
            let info= await this.ICMBP_read(`aiCamera.get_identify_position(ai_camera.AI_CAMERA_PATCH)`)
            let istrack=await this.colorIsTrack()
            if(istrack){
                return JSON.parse(info)[Number(args.ONE)]
            }else{
                return ''
            }
        }
        
    }

    async tagNum(){
        if(this.currentDevice=='Microbit'){
            let num = await this.ICMBP_read(`aiCamera.get_identify_num(ai_camera.AI_CAMERA_TAG)`)
            return num
        }
    }

    async tagCont(){
        if(this.currentDevice=='Microbit'){
            let id = await this.ICMBP_read(`aiCamera.get_identify_id(ai_camera.AI_CAMERA_TAG)`)
            if(await this.tagNum()>0){
                return id
            }else{
                return ''
            }
        }
        
    }

    async tagAngle(){
        if(this.currentDevice=='Microbit'){
            let angle = await this.ICMBP_read(`aiCamera.get_identify_rotation(ai_camera.AI_CAMERA_TAG)`)
            if(await this.tagNum()>0){
                return angle
            }else{
                return ''
            }
        }
        
    }
    async tagInfo(args){
        if(this.currentDevice=='Microbit'){
            let info= await this.ICMBP_read(`aiCamera.get_identify_position(ai_camera.AI_CAMERA_TAG)`)
            if(await this.tagNum()>0){
                return JSON.parse(info)[Number(args.ONE)]
            }else{
                return ''
            }
        }
    }
    async lineIsRecog(){
        if(this.currentDevice=='Microbit'){
            let num=await this.ICMBP_read(`aiCamera.get_identify_num(ai_camera.AI_CAMERA_LINE)`)
            if(num>0){
                return true
            }else{
                return false
            }
        }
    }
    async lineInfo(args){
        if(this.currentDevice=='Microbit'){
            let info = await this.ICMBP_read(`aiCamera.get_identify_position(ai_camera.AI_CAMERA_LINE,${Number(args.ONE)})`)
            if(await this.lineIsRecog()){
                return JSON.parse(info)[Number(args.TWO)]
            }else{
                return ''
            }
        }
        
    }

    async objectNum(){
        if(this.currentDevice=='Microbit'){
            let num=await this.ICMBP_read(`aiCamera.get_identify_num(ai_camera.AI_CAMERA_20_CLASS)`)
            return num
        }
    }
    async objectIsRecogn(args){
        if(this.currentDevice=='Microbit'){
            let num=await this.ICMBP_read(`aiCamera.get_identify_num(ai_camera.AI_CAMERA_20_CLASS)`)
            let obj=await this.ICMBP_read(`aiCamera.get_identify_id(ai_camera.AI_CAMERA_20_CLASS)`)
            console.log('获取的id',obj)
            console.log('选择的id',args.ONE)
            if(args.ONE==obj && num>0){
                return true
            }else{
                return false
            }
        }
    }

    async objInfo(args){
        if(this.currentDevice=='Microbit'){
            let info = await this.ICMBP_read(`aiCamera.get_identify_position(ai_camera.AI_CAMERA_20_CLASS)`)
            if(await this.objectNum()>0){
                return JSON.parse(info)[Number(args.ONE)]
            }else{
                return ''
            }
        }
        
    }

    async qrIsRecogn(){
        if(this.currentDevice=='Microbit'){
            let num=await this.ICMBP_read(`aiCamera.get_identify_num(ai_camera.AI_CAMERA_QRCODE)`)
            if(num>0){
                return true
            }else{
                return false
            }
        }
    }

    async qrCont(){
        if(this.currentDevice=='Microbit'){
            let info = await this.ICMBP_read(`aiCamera.get_qrcode_content()`)
            if(await this.qrIsRecogn()){
                return info
            }else{
                return ''
            }
        }
        
    }

    async qrInfo(args){
        if(this.currentDevice=='Microbit'){
            let info = await this.ICMBP_read(`aiCamera.get_identify_position(ai_camera.AI_CAMERA_QRCODE)`)
            if(await this.qrIsRecogn()){
                return JSON.parse(info)[Number(args.ONE)]
            }else{
                return ''
            }
        }
        
    }

    async faceAttrNum(){
        if(this.currentDevice=='Microbit'){
            let num=await this.ICMBP_read(`aiCamera.get_identify_num(ai_camera.AI_CAMERA_FACE_ATTRIBUTE,1)`)
            return num
        }
    }

    async faceAttrInfo(args){
        if(this.currentDevice=='Microbit'){
            let info = await this.ICMBP_read(`aiCamera.get_identify_position(ai_camera.AI_CAMERA_FACE_ATTRIBUTE,${Number(args.ONE)})`)
            if(await this.faceAttrNum()>0){
                return JSON.parse(info)[Number(args.TWO)]
            }else{
                return ''
            }
        }
    }

    async faceAttrEmote(args){
        if(this.currentDevice=='Microbit'){
            let num=await this.ICMBP_read(`aiCamera.get_identify_face_attribute(${Number(args.ONE)})`)
            let [mouse, smile, glasse] = num.slice(1, -1).split(",").map(Number);
            if(await this.faceAttrNum()>0){
                if(args.TWO=='1'){
                    if(mouse==0){
                        return false
                    }else{
                        return true
                    }
                }else if(args.TWO=='2'){
                    if(smile==0){
                        return false
                    }else{
                        return true
                    }
                }else if(args.TWO=='3'){
                    if(glasse==0){
                        return false
                    }else{
                        return true
                    }
                }
            }else{
                return false
            }
            console.log(num)
        }
    }

    async faceLearn(){
        if(this.currentDevice=='Microbit'){
            await this.ICMB_send(`aiCamera.face_study()`)
        }
    }

    async faceRecogNum(){
        if(this.currentDevice=='Microbit'){
            let num=await this.ICMBP_read(`aiCamera.get_identify_num(ai_camera.AI_CAMERA_FACE_RE,1)`)
            return num
        }
    }
    async faceRecogLearnNum(){
        if(this.currentDevice=='Microbit'){
            let num=await this.ICMBP_read(`aiCamera.get_identify_num(ai_camera.AI_CAMERA_FACE_RE,0)`)
            return num
        }
    }

    async faceRecognEmote(args){
        if(this.currentDevice=='Microbit'){
            let info = await this.ICMBP_read(`aiCamera.get_identify_position(ai_camera.AI_CAMERA_FACE_RE,${Number(args.ONE)})`)
            if(await this.faceRecogLearnNum()){
                return JSON.parse(info)[Number(args.TWO)]
            }else{
                return ''
            }
        }
        
    }

    async deepLearning(args){
        if(this.currentDevice=='Microbit'){
            let id=await this.ICMBP_read(`aiCamera.get_identify_id(ai_camera.AI_CAMERA_DEEP_LEARN)`)
            let num=await this.ICMBP_read(`aiCamera.get_identify_num(ai_camera.AI_CAMERA_DEEP_LEARN)`)
            if(num>0){
                if(Number(args.ONE)==Number(id)){
                    return true
                }else{
                    return false
                }
                
            }else{
                return false
            }
        }
        
    }

    async roadNum(){
        if(this.currentDevice=='Microbit'){
            let num=await this.ICMBP_read(`aiCamera.get_identify_num(ai_camera.AI_CAMERA_CARD)`)
            return num
        }
    }
    async roadRecog(args){
        if(this.currentDevice=='Microbit'){
            let flag=await this.ICMBP_read(`aiCamera.get_identify_id(ai_camera.AI_CAMERA_CARD)`)
            if(args.ONE==flag && await this.roadNum()>0){
                return true
            }else{
                return false
            }
        }
    }

    async roadInfo(args){
        
        if(this.currentDevice=='Microbit'){
            let info = await this.ICMBP_read(`aiCamera.get_identify_position(ai_camera.AI_CAMERA_CARD)`)
            if(await this.roadNum()>0){
                return JSON.parse(info)[Number(args.ONE)]
            }else{
                return ''
            }
        }
        
    }

    async wirelessSet(args){
        if(this.currentDevice=='Microbit'){
            await this.ICMB_send(`aiCamera.set_wifi_server_ssid_passward('${args.ONE}',${args.TWO})`)
        }
    }

    async wirelessConnect(){
        if(this.currentDevice=='Microbit'){
            await this.ICMB_send(`aiCamera.set_wifi_server_is_scan_qrcode(ture)`)
        }
    }

    async lightSwitch(args){
        if(this.currentDevice=='Microbit'){
            if(args.ONE=='1'){
                await this.ICMB_send(`aiCamera.set_light_brightness(5)`)
            }else{
                await this.ICMB_send(`aiCamera.set_light_brightness(0)`)
            }
        }
    }

    async lightBrightness(args){
        if(this.currentDevice=='Microbit'){
            await this.ICMB_send(`aiCamera.set_light_brightness(${args.ONE})`)
        }
    }

    async lightGetBrightness(){
        if(this.currentDevice=='Microbit'){
            let info = await this.ICMBP_read(`aiCamera.get_light_brightness()`)
            return info
        }
    }


}


module.exports = k210;
