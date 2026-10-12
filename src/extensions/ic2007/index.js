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

class IC2007 {
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

        this._successWaitQueue = [];
        this._sendCmdWaitQueue
        this.stopAll = new BroadcastChannel('stopAll')
        this.stopAll.addEventListener('message',(event)=>{
            console.log('11111111')
            window.EditorPreload.bleSendIC2007(JSON.stringify([0xCC,0x03]));
            if (this.responseQueue.length === 0) return;

            const queue = this.responseQueue;
            this.responseQueue = [];
    
            // 用 resolve(false) 结束所有 await
            for (const item of queue) {
                item.resolve(false);
            }

            
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
        window.EditorPreload.sendIC2007Result(async (code) => {
            console.log('收到返回值', code);
        
            if (!code || code.length < 2) {
                console.warn('IC2007返回数据长度不足:', code);
                return;
            }
        
            const arr = new Uint8Array(code);
        
            const state = arr[0];
        
            console.log(
                'IC2007响应:',
                `0x${state.toString(16).padStart(2, '0')}`,
                arr
            );
        
            if (this.responseQueue.length === 0) {
                console.warn('收到未匹配的响应:', arr);
                return;
            }

            
        
            // 0xEE：执行指令结果
            if (state === 0xEE) {
                if (arr.length < 2) {
                    console.warn('IC2007 EE 返回数据长度不足:', arr);
                    return;
                }
        
                const result = arr[1];
                const { resolve, reject } = this.responseQueue.shift();
        
                if (result === 0) {
                    // EE 01：成功
                    console.log('IC2007指令执行成功');
                    resolve(true);
        
                } else if (result === 1) {
                    // EE 02：失败
                    console.log('IC2007指令执行失败');
                    // reject(new Error('IC2007指令执行失败'));
                    resolve(-1);
        
                } else if (result === 2) {
                    // EE 03：超时
                    console.log('IC2007指令执行超时');
                    // reject(new Error('IC2007指令执行超时'));
                    resolve(-2);
        
                } else {
                    console.warn('IC2007未知的EE结果码:', result);
                    reject(new Error(`IC2007未知执行结果码: ${result}`));
                }
        
                return;
            }

            // 0xEF：后面两个字节组成16位数据
            if (state === 0xEF) {
                if (arr.length < 3) {
                    console.warn('IC2007 EF 返回数据长度不足:', arr);
                    return;
                }
        
                const highByte = arr[1];
                const lowByte = arr[2];
        
                // 高8位 + 低8位 → 16位整数
                const result = (highByte << 8) | lowByte;
        
                const { resolve } = this.responseQueue.shift();
        
                console.log(
                    'IC2007收到EF响应:',
                    '高8位 =', highByte,
                    '低8位 =', lowByte,
                    '十进制 =', result
                );
        
                resolve(result);
        
                return;
            }
        
            
        
            console.warn(
                '收到未知的IC2007响应:',
                arr
            );
        });
        
    }
  getInfo() {

    return {
      id: 'ic2007',
      name: formatMessage({
                id: 'ic2007.name',
                default: 'ic2007',
                description: 'ic2007.name'
            }),
      color1:'#CB19DA',
      menuIconURI: actuatorIcon,
      blocks: [

        
        {
            blockType: BlockType.LABEL,
            text: formatMessage({
                id: 'ic2007.actuator',
                default: 'actuator',
                description: 'ic2007.actuator'
            }),
        },
        {
            opcode: 'motor',
            blockType: BlockType.COMMAND,
            // text: '舵机转动至[ONE]度',
            text: formatMessage({
                id: 'ic2007.motor',
                default: 'port [PORT] Servo rotates to [DEGREE] degrees',
                description: 'ic2007.motor'
            }),
            arguments:{
                PORT:{
                    type: ArgumentType.NUMBER,
                    menu:'MENU_PORT'
                },
                DEGREE:{
                    type: ArgumentType.NUMBER,
                    defaultValue:'90'
                },
            }
        },



        {
            opcode: 'servo',
            blockType: BlockType.COMMAND,
            // text: '舵机转动至[ONE]度',
            text: formatMessage({
                id: 'robotextend.servo',
                default: 'port [TWO] Set the servo motor to [ONE]',
                description: 'robotextend.servo'
            }),
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu:'MENU_SERVO_PLACE'
                },
                TWO:{
                    type: ArgumentType.STRING,
                    menu:'MENU_PORT'
                },
            }
        },

         {
            opcode: 'servoSpeed',
            blockType: BlockType.COMMAND,
            text: formatMessage({
                id: 'robotextend.servoSpeed',
                default: 'port [TWO] servo motor rotates at a speed of [ONE]',
                description: 'robotextend.servoSpeed'
            }),
            arguments:{
                ONE:{
                    type: ArgumentType.NUMRES_100_100,
                    defaultValue:'50'
                },
                TWO:{
                    type: ArgumentType.STRING,
                    menu:'MENU_PORT'
                },
            }
        },

        {
            opcode: 'servoSpeedTime',
            blockType: BlockType.COMMAND,
            text: formatMessage({
                id: 'robotextend.servoSpeedTime',
                default: 'port [THREE] servo motor rotates at a speed of [ONE] for [TWO] seconds',
                description: 'robotextend.servoSpeedTime'
            }),
            arguments:{
                ONE:{
                    type: ArgumentType.NUMRES_100_100,
                    defaultValue:'50'
                },
                TWO:{
                    type: ArgumentType.NUMBER,
                    defaultValue:'2'
                },
                THREE:{
                    type: ArgumentType.STRING,
                    menu:'MENU_PORT'
                },
            }
        },

         {
            opcode: 'servoSpeedAbsolute',
            blockType: BlockType.COMMAND,
            text: formatMessage({
                id: 'robotextend.servoSpeedAbsolute',
                default: 'port [THREE] servo motor rotates at speed [ONE] to [TWO] degrees',
                description: 'robotextend.servoSpeedAbsolute'
            }),
            arguments:{
                ONE:{
                    type: ArgumentType.NUMRES_100_100,
                    defaultValue:'50'
                },
                TWO:{
                    type: ArgumentType.NUMBER,
                    defaultValue:'90'
                },
                THREE:{
                    type: ArgumentType.STRING,
                    menu:'MENU_PORT'
                },
            }
        },

        {
            opcode: 'servoSpeedRelative',
            blockType: BlockType.COMMAND,
            text: formatMessage({
                id: 'robotextend.servoSpeedRelative',
                default: 'port [THREE] servo motor rotates at speed [ONE] for [TWO] degrees ',
                description: 'robotextend.servoSpeedRelative'
            }),
            arguments:{
                ONE:{
                    type: ArgumentType.NUMRES_100_100,
                    defaultValue:'50'
                },
                TWO:{
                    type: ArgumentType.NUMBER,
                    defaultValue:'90'
                },
                THREE:{
                    type: ArgumentType.STRING,
                    menu:'MENU_PORT'
                },
            }
        },

        {
            opcode: 'servoStop',
            blockType: BlockType.COMMAND,
            text: formatMessage({
                id: 'robotextend.servoStop',
                default: 'port [TWO] servo motor stop',
                description: 'robotextend.servoStop'
            }),
            arguments:{
                TWO:{
                    type: ArgumentType.STRING,
                    menu:'MENU_PORT'
                },
            }
        },

        '---',
        {
            opcode: 'movePort',
            blockType: BlockType.COMMAND,
            // text: '[ONE]以[TWO]功率',
            text: formatMessage({
                id: 'ic2007.movePort',
                default: 'Left wheel port [ONE], right wheel port [TWO]',
                description: 'ic2007.movePort'
            }),
            arguments:{
                ONE:{

                    type:ArgumentType.STRING,
                    menu:'MENU_M_PORT',
                    
                },
                TWO:{
                    type:ArgumentType.STRING,
                    menu:'MENU_M_PORT',
                }
            },
        },
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
                    type: ArgumentType.NUMBER,
                    defaultValue:1
                }
            }
        },




        {
            opcode: 'moveSpeed',
            blockType: BlockType.COMMAND,
            // text: '移动 左轮以[ONE]功率 右轮以[TWO]功率',
            text: formatMessage({
                id: 'ic2007.moveSpeed',
                default: 'M1 rotates at [ONE] % power, M2 rotates at [TWO]% power',
                description: 'ic2007.moveSpeed'
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
                id: 'ic2007.moveLeftSpeed',
                default: 'motor [FOUR] rotates at [ONE] % power for [TWO] secs',
                description: 'ic2007.moveLeftSpeed'
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
                FOUR:{
                    type: ArgumentType.STRING,
                    menu:'MENU_M_PORT'
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
                    menu:'MENU_M_PORT'
                }
            }
        },


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

        '---',
        {
            opcode: 'ledSwitch',
            blockType: BlockType.COMMAND,
            // text: '[ONE]以[TWO]功率',
            text: formatMessage({
                id: 'ic2007.ledSwitch',
                default: 'port [ONE] LED [TWO]',
                description: 'ic2007.ledSwitch'
            }),
            arguments:{
                ONE:{

                    type:ArgumentType.STRING,
                    menu:'MENU_PORT',
                    
                },
                TWO:{
                    type:ArgumentType.STRING,
                    menu:'MENU_SWITCH',
                }
            },
        },

        {
            opcode: 'ledCirInit',
            blockType: BlockType.COMMAND,
            // text: '[ONE]以[TWO]功率',
            text: formatMessage({
                id: 'ic2007.ledCirInit',
                default: 'port [ONE] Light Ring Initialize, Number [TWO]',
                description: 'ic2007.ledCirInit'
            }),
            arguments:{
                ONE:{

                    type:ArgumentType.STRING,
                    menu:'MENU_PORT',
                    
                },
                TWO:{
                    type:ArgumentType.NUMRES0_9,
                }
            },
        },

        {
            opcode: 'ledCirColor',
            blockType: BlockType.COMMAND,
            // text: '[ONE]以[TWO]功率',
            text: formatMessage({
                id: 'ic2007.ledCirColor',
                default: 'port [THREE] Light Ring [ONE] color [TWO]',
                description: 'ic2007.ledCirColor'
            }),
            arguments:{
                ONE:{

                    type:ArgumentType.NUMRES0_9,
                    
                },
                TWO:{
                    type:ArgumentType.COLOR,
                },
                THREE:{

                    type:ArgumentType.STRING,
                    menu:'MENU_PORT',
                    
                },
            },
        },

        {
            opcode: 'ledCirStart',
            blockType: BlockType.COMMAND,
            // text: '[ONE]以[TWO]功率',
            text: formatMessage({
                id: 'ic2007.ledCirStart',
                default: 'port [TWO] Light Ring [ONE]',
                description: 'ic2007.ledCirStart'
            }),
            arguments:{
                ONE:{

                    type:ArgumentType.STRING,
                    menu:'MENU_SWITCH',
                    
                },
                TWO:{

                    type:ArgumentType.STRING,
                    menu:'MENU_PORT',
                    
                },
            },
        },

        {
            opcode: 'ledCirAllColor',
            blockType: BlockType.COMMAND,
            // text: '[ONE]以[TWO]功率',
            text: formatMessage({
                id: 'ic2007.ledCirAllColor',
                default: 'port [TWO] all Light Ring color [ONE]',
                description: 'ic2007.ledCirAllColor'
            }),
            arguments:{
                ONE:{
                    type:ArgumentType.COLOR,
                },
                TWO:{

                    type:ArgumentType.STRING,
                    menu:'MENU_PORT',
                    
                },
            },
        },
        '---',
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
            blockType: BlockType.LABEL,
            text: formatMessage({
                id: 'ic2007.sensor',
                default: 'sensor',
                description: 'ic2007.sensor'
            }),
        },

        {
            opcode: 'Ultrasonic',
            blockType: BlockType.REPORTER,
            // text: '[ONE]以[TWO]功率',
            text: formatMessage({
                id: 'ic2007.Ultrasonic',
                default: '[ONE] Ultrasonic Sensor',
                description: 'ic2007.Ultrasonic'
            }),
            arguments:{
                ONE:{

                    type:ArgumentType.STRING,
                    menu:'MENU_PORT',
                    
                },
                // TWO:{
                //     type:ArgumentType.STRING,
                //     menu:'MENU_DIS',
                // }
            },
            disableMonitor: true
        },
        {
            opcode: 'Light',
            blockType: BlockType.REPORTER,
            // text: '[ONE]以[TWO]功率',
            text: formatMessage({
                id: 'ic2007.Light',
                default: '[ONE] Light Sensor',
                description: 'ic2007.Light'
            }),
            arguments:{
                ONE:{

                    type:ArgumentType.STRING,
                    menu:'MENU_PORT',
                    
                }
            },
            disableMonitor: true
        },
        {
            opcode: 'Button',
            blockType: BlockType.BOOLEAN,
            // text: '[ONE]以[TWO]功率',
            text: formatMessage({
                id: 'ic2007.Button',
                default: '[ONE] button is pressed?',
                description: 'ic2007.Button'
            }),
            arguments:{
                ONE:{

                    type:ArgumentType.STRING,
                    menu:'MENU_PORT',
                    
                }
            },
            disableMonitor: true
        },

        {
            opcode: 'joystickRepo',
            blockType: BlockType.REPORTER,
            text: formatMessage({
                id: 'ic2007.joystickRepo',
                default: 'port [TWO] Joystick [ONE] Direction',
                description: 'ic2007.joystickRepo'
            }),
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu:'MENU_XY'
                },
                TWO:{
                    type: ArgumentType.STRING,
                    menu:'MENU_PORT'
                },
            },
            disableMonitor: true
        },

        {
            opcode: 'Potentiometer',
            blockType: BlockType.REPORTER,
            // text: '[ONE]以[TWO]功率',
            text: formatMessage({
                id: 'ic2007.Potentiometer',
                default: '[ONE] potentiometer',
                description: 'ic2007.Potentiometer'
            }),
            arguments:{
                ONE:{

                    type:ArgumentType.STRING,
                    menu:'MENU_PORT',
                    
                }
            },
            disableMonitor: true
        },

        // {
        //     opcode: 'Tilt',
        //     blockType: BlockType.REPORTER,
        //     text: formatMessage({
        //         id: 'ic2007.joystickRepo',
        //         default: 'port [TWO] Tilt Sensor [ONE] Direction',
        //         description: 'ic2007.joystickRepo'
        //     }),
        //     arguments:{
        //         ONE:{
        //             type: ArgumentType.STRING,
        //             menu:'MENU_XY'
        //         },
        //         TWO:{
        //             type: ArgumentType.STRING,
        //             menu:'MENU_PORT'
        //         },
        //     },
        //     disableMonitor: true
        // },
        
        {
            opcode: 'sound',
            blockType: BlockType.REPORTER,
            text: formatMessage({
                id: 'ic2007.sound',
                default: 'sound level',
                description: 'ic2007.sound'
            }),
            arguments:{
                
            },
            disableMonitor: true
        },

      ],

      menus: {
        MENU_DIR: {
          acceptReporters: false,
          items: [

            {
              text: '前进',
              value: '1'
            },
            {
              text: '后退',
              value: '2'
            },
            {
                text: '左转',
                value: '3'
            },
            {
                text: '右转',
                value: '4'
              },
             
          ]
        },
        MENU_PORT: {
            acceptReporters: false,
            items: [
                {
                    text: 'P1',
                    value: '1'
                },
                {
                    text: 'P2',
                    value: '2'
                }
                
            ]
        },

        MENU_M_PORT: {
            acceptReporters: false,
            items: [
                {
                    text: 'M1',
                    value: '1'
                },
                {
                    text: 'M2',
                    value: '2'
                }
                
            ]
        },

        MENU_STATE: {
            acceptReporters: false,
            items: [
                {
                    // text: '抓取',
                    text: formatMessage({
                        id: 'robotactuator.menuState.close',
                        default: 'closes',
                        description: 'robotactuator.menuState.close'
                    }),
                    value: '1'
                },
                {
                    // text: '松开',
                    text: formatMessage({
                        id: 'robotactuator.menuState.open',
                        default: 'opens',
                        description: 'robotactuator.menuState.open'
                    }),
                    value: '0'
                },
                
            ]
        },
        MENU_SERVO_PLACE: {
            acceptReporters: false,
            items: [
              {
                  text: formatMessage({
                      id: 'robotextend.ServoPlace.common',
                      default: 'general',
                      description: 'robotextend.ServoPlace.common'
                  }),
                  value: 'GENERAL'
              },
              {
                  text: formatMessage({
                      id: 'robotextend.ServoPlace.red',
                      default: 'red',
                      description: 'robotextend.ServoPlace.red'
                  }),
                  value: 'LIGHT_RED'
              },
              {
                  text: formatMessage({
                      id: 'robotextend.ServoPlace.green',
                      default: 'green',
                      description: 'robotextend.ServoPlace.green'
                  }),
                  value: 'LIGHT_GREEN'
              },
              {
                  text: formatMessage({
                      id: 'robotextend.ServoPlace.blue',
                      default: 'blue',
                      description: 'robotextend.ServoPlace.blue'
                  }),
                  value: 'LIGHT_BLUE'
              },
              {
                  text: formatMessage({
                      id: 'robotextend.ServoPlace.yellow',
                      default: 'yellow',
                      description: 'robotextend.ServoPlace.yellow'
                  }),
                  value: 'LIGHT_YELLOW'
              },
               
            ]
          },
          MENU_SWITCH: {
            acceptReporters: false,
            items: [
                {
                    text: formatMessage({
                        id: 'ic2007.menuSwitch.open',
                        default: 'open',
                        description: 'ic2007.menuSwitch.open'
                    }),
                    value: '1'
                },
                {
                    text: formatMessage({
                        id: 'ic2007.menuSwitch.close',
                        default: 'close',
                        description: 'ic2007.menuSwitch.close'
                    }),
                    value: '2'
                },
                
            ]
        },
        MENU_DIS: {
            acceptReporters: false,
            items: [
                {
                    text: formatMessage({
                        id: 'ic2007.menuSwitch.cm',
                        default: 'cm',
                        description: 'ic2007.menuSwitch.cm'
                    }),
                    value: '1'
                },
                {
                    text: formatMessage({
                        id: 'ic2007.menuSwitch.mm',
                        default: 'mm',
                        description: 'ic2007.menuSwitch.mm'
                    }),
                    value: '2'
                },
                
            ]
        },
        MENU_XY: {
            acceptReporters: false,
            items: [
              {
                  text: 'X',
                  value: '1'
                },
              {
                text: 'Y',
                value: '2'
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
                // {
                //     text: formatMessage({
                //         id: 'robotsound.menuMusic.background',
                //         default: 'Background Music',
                //         description: 'robotsound.menuMusic.background'
                //     }),
                //     value: 'background.wav'
                // },


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
        return new Promise((resolve) => {
            this.responseQueue.push({ resolve });
        });
    }





sendCommandAndWaitForSuccess(command) {
    return new Promise(async (resolve, reject) => {

        let resolved = false; // 防止多次 resolve

        const onMessage = (e) => {
            const data = e.data;
            console.log(data);

            // ✅以下判断逻辑与你原来完全一致
            if (Array.isArray(data) && data.length == 1 && data[0] === 0) {
                if (!resolved) {
                    resolved = true;
                    this.channelSerialData.removeEventListener('message', onMessage);
                    this._removeSendCmdWaiter(onMessage); // 仅新增
                    resolve();
                }
            } else if (typeof data === "string" && data.includes("[0]")) {
                if (!resolved) {
                    resolved = true;
                    this.channelSerialData.removeEventListener('message', onMessage);
                    this._removeSendCmdWaiter(onMessage); // 仅新增
                    resolve();
                }
            }
        };

        // ✅仅新增：登记等待
        if (!this._sendCmdWaitQueue) {
            this._sendCmdWaitQueue = [];
        }

        this._sendCmdWaitQueue.push({
            resolve,
            handler: onMessage
        });

        this.channelSerialData.addEventListener('message', onMessage);

        await new Promise(resolve => setTimeout(resolve, 80));

        // ✅发送命令逻辑完全不变
        this.channelPort.postMessage(command);

        // 你原来的超时注释保持不动
    });
}
_removeSendCmdWaiter(handler) {

    if (!this._sendCmdWaitQueue) return;

    const index = this._sendCmdWaitQueue.findIndex(
        item => item.handler === handler
    );

    if (index !== -1) {
        this._sendCmdWaitQueue.splice(index, 1);
    }
}


    async waitForSuccess() {
        return new Promise((resolve) => {

            const socketInstance = socket.getSocket();

            const messageHandler = (event) => {
                try {
                    let data = event.data;

                    // ✅ 和你原来完全一样
                    if (data === "success") {
                        console.log("收到 success 响应");

                        socketInstance.removeEventListener('message', messageHandler);

                        // 仅仅多了一行：从等待池移除
                        this._removeSuccessWaiter(messageHandler);

                        resolve();   // ← 仍然是不带参数 resolve
                    }
                } catch (error) {
                    console.error("解析 WebSocket 消息出错", error);
                }
            };

            // ✅ 仅新增：登记到等待池
            if (!this._successWaitQueue) {
                this._successWaitQueue = [];
            }

            this._successWaitQueue.push({
                resolve,
                handler: messageHandler,
                socket: socketInstance
            });

            socketInstance.addEventListener('message', messageHandler);
        });
    }

    _removeSuccessWaiter(handler) {

        if (!this._successWaitQueue) return;

        const index = this._successWaitQueue.findIndex(
            item => item.handler === handler
        );

        if (index !== -1) {
            this._successWaitQueue.splice(index, 1);
        }
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
        }else if(message == "请先连接设备"){
            toast.textContent = formatMessage({
                id: 'gui.download.ic2007',
                default: 'Please connect the device first.',
                description: 'gui.download.ic2007'
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

    toTwoDigitHexadecimalPair(decimal) {
        // 必须是整数
        if (!Number.isInteger(decimal)) {
            throw new Error("Input must be an integer");
        }
    
        // 16 位有符号整数范围
        if (decimal < -32768 || decimal > 32767) {
            throw new Error("Input must be between -32768 and 32767");
        }
    
        // 负数转换成 16 位补码
        const unsignedValue = decimal < 0
            ? decimal + 65536
            : decimal;
    
        // 高 8 位
        const highByte = (unsignedValue >> 8) & 0xFF;
    
        // 低 8 位
        const lowByte = unsignedValue & 0xFF;
    
        return [highByte, lowByte];
    }
    signedToHexValue(num, bits = 8) {
        let mask = (1 << bits) - 1;
        return num & mask; // 返回数值
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
    async motor(args){
        if(this.mode){
            if(!this.isBleConnected){
                this.showToast('请先连接设备')
                this.runtime.stopAll();
                return
            }
            const ackPromise = this.waitForThreeZeros(); 
            await window.EditorPreload.bleSendIC2007(JSON.stringify([0xAA,0x01,0x10,Number(args.PORT),this.toTwoDigitHexadecimalPair(Number(args.DEGREE))[0],this.toTwoDigitHexadecimalPair(Number(args.DEGREE))[1]]));
            await ackPromise
        }
        
    }

    async servo(args){
        if(this.mode){
            if(!this.isBleConnected){
                this.showToast('请先连接设备')
                this.runtime.stopAll();
                return
            }
            let hex_mode={
                'GENERAL':0x50,
                'LIGHT_RED':0x51,
                'LIGHT_GREEN':0x52,
                'LIGHT_BLUE':0x53,
                'LIGHT_YELLOW':0x54
            }
            const ackPromise = this.waitForThreeZeros(); 
            await window.EditorPreload.bleSendIC2007(JSON.stringify([0xAA,0x01,0x20,Number(args.TWO),hex_mode[args.ONE]]));
            await ackPromise
        }
        
    }
    
    async servoSpeed(args){
        if(this.mode){
            if(!this.isBleConnected){
                this.showToast('请先连接设备')
                this.runtime.stopAll();
                return
            }
            const ackPromise = this.waitForThreeZeros(); 
            await window.EditorPreload.bleSendIC2007(JSON.stringify([0xAA,0x01,0x21,Number(args.TWO),this.signedToHexValue(Number(args.ONE))]));
            await ackPromise
        }
        
    }
    
    async servoSpeedTime(args){
        if(this.mode){
            if(!this.isBleConnected){
                this.showToast('请先连接设备')
                this.runtime.stopAll();
                return
            }
            const ackPromise = this.waitForThreeZeros(); 
            await window.EditorPreload.bleSendIC2007(JSON.stringify([0xAA,0x01,0x22,Number(args.THREE),this.signedToHexValue(Number(args.ONE)),this.toTwoDigitHexadecimalPair(Number(args.TWO))[0],this.toTwoDigitHexadecimalPair(Number(args.TWO))[1]]));
            await ackPromise
        }
        
    }

    async servoSpeedAbsolute(args){
        if(this.mode){
            if(!this.isBleConnected){
                this.showToast('请先连接设备')
                this.runtime.stopAll();
                return
            }
            const ackPromise = this.waitForThreeZeros(); 
            await window.EditorPreload.bleSendIC2007(JSON.stringify([0xAA,0x01,0x23,Number(args.THREE),this.signedToHexValue(Number(args.ONE)),this.toTwoDigitHexadecimalPair(Number(args.TWO))[0],this.toTwoDigitHexadecimalPair(Number(args.TWO))[1]]));
            await ackPromise
        }
        
    }
    async servoSpeedRelative(args){
        if(this.mode){
            if(!this.isBleConnected){
                this.showToast('请先连接设备')
                this.runtime.stopAll();
                return
            }
            const ackPromise = this.waitForThreeZeros(); 
            await window.EditorPreload.bleSendIC2007(JSON.stringify([0xAA,0x01,0x24,Number(args.THREE),this.signedToHexValue(Number(args.ONE)),this.toTwoDigitHexadecimalPair(Number(args.TWO))[0],this.toTwoDigitHexadecimalPair(Number(args.TWO))[1]]));
            await ackPromise
        }
        
    }
    

    async servoStop(args){
        if(this.mode){
            if(!this.isBleConnected){
                this.showToast('请先连接设备')
                this.runtime.stopAll();
                return
            }
            const ackPromise = this.waitForThreeZeros(); 
            await window.EditorPreload.bleSendIC2007(JSON.stringify([0xAA,0x01,0x25,Number(args.TWO)]));
            await ackPromise
        }
        
    }
    
    async movePort(args){
        if(this.mode){
            if(!this.isBleConnected){
                this.showToast('请先连接设备')
                this.runtime.stopAll();
                return
            }
            const ackPromise = this.waitForThreeZeros(); 
            await window.EditorPreload.bleSendIC2007(JSON.stringify([0xAA,0x01,0x40,Number(args.ONE),Number(args.TWO)]));
            await ackPromise
        }
        
    }
    
    async move(args){
        if(this.mode){
            if(!this.isBleConnected){
                this.showToast('请先连接设备')
                this.runtime.stopAll();
                return
            }
            const ackPromise = this.waitForThreeZeros(); 
            await window.EditorPreload.bleSendIC2007(JSON.stringify([0xAA,0x01,0x41,Number(args.ONE),this.signedToHexValue(Number(args.TWO))]));
            await ackPromise
        }
        
    }
    
    async moveDirTime(args){
        if(this.mode){
            if(!this.isBleConnected){
                this.showToast('请先连接设备')
                this.runtime.stopAll();
                return
            }
            const ackPromise = this.waitForThreeZeros(); 
            await window.EditorPreload.bleSendIC2007(JSON.stringify([0xAA,0x01,0x42,Number(args.ONE),this.signedToHexValue(Number(args.TWO)),this.toTwoDigitHexadecimalPair(Number(args.THREE))[0],this.toTwoDigitHexadecimalPair(Number(args.THREE))[1]]));
            await ackPromise
        }
        
    }
    
    async moveSpeed(args){
        if(this.mode){
            if(!this.isBleConnected){
                this.showToast('请先连接设备')
                this.runtime.stopAll();
                return
            }
            const ackPromise = this.waitForThreeZeros(); 
            await window.EditorPreload.bleSendIC2007(JSON.stringify([0xAA,0x01,0x43,this.signedToHexValue(Number(args.ONE)),this.signedToHexValue(Number(args.TWO))]));
            await ackPromise
        }
        
    }
    
    async moveLeftSpeed(args){
        if(this.mode){
            if(!this.isBleConnected){
                this.showToast('请先连接设备')
                this.runtime.stopAll();
                return
            }
            const ackPromise = this.waitForThreeZeros(); 
            await window.EditorPreload.bleSendIC2007(JSON.stringify([0xAA,0x01,0x44,Number(args.FOUR),this.signedToHexValue(Number(args.ONE)),this.toTwoDigitHexadecimalPair(Number(args.TWO))[0],this.toTwoDigitHexadecimalPair(Number(args.TWO))[1]]));
            await ackPromise
        }
        
    }
    
    async moveLeftForeverSpeed(args){
        if(this.mode){
            if(!this.isBleConnected){
                this.showToast('请先连接设备')
                this.runtime.stopAll();
                return
            }
            const ackPromise = this.waitForThreeZeros(); 
            await window.EditorPreload.bleSendIC2007(JSON.stringify([0xAA,0x01,0x45,Number(args.TWO),this.signedToHexValue(Number(args.ONE))]));
            await ackPromise
        }
        
    }
    
    async moveStop(args){
        if(this.mode){
            if(!this.isBleConnected){
                this.showToast('请先连接设备')
                this.runtime.stopAll();
                return
            }
            const ackPromise = this.waitForThreeZeros(); 
            await window.EditorPreload.bleSendIC2007(JSON.stringify([0xAA,0x01,0x46]));
            await ackPromise
        }
        
    }
    
    async ledSwitch(args){
        if(this.mode){
            if(!this.isBleConnected){
                this.showToast('请先连接设备')
                this.runtime.stopAll();
                return
            }
            const ackPromise = this.waitForThreeZeros(); 
            await window.EditorPreload.bleSendIC2007(JSON.stringify([0xAA,0x01,0x30,Number(args.ONE),Number(args.TWO)]));
            await ackPromise
        }
        
    }
    
    async ledCirInit(args){
        if(this.mode){
            if(!this.isBleConnected){
                this.showToast('请先连接设备')
                this.runtime.stopAll();
                return
            }
            const ackPromise = this.waitForThreeZeros(); 
            await window.EditorPreload.bleSendIC2007(JSON.stringify([0xAA,0x01,0x31,Number(args.ONE),this.signedToHexValue(Number(args.TWO))]));
            await ackPromise
        }
        
    }
    
    async ledCirColor(args){
        if(this.mode){
            if(!this.isBleConnected){
                this.showToast('请先连接设备')
                this.runtime.stopAll();
                return
            }
            const ackPromise = this.waitForThreeZeros(); 
            let rgb = this.hexToRgb(args.TWO)
            await window.EditorPreload.bleSendIC2007(JSON.stringify([0xAA,0x01,0x32,Number(args.THREE),this.signedToHexValue(Number(args.ONE)),rgb[0],rgb[1],rgb[2]]));
            await ackPromise
        }
        
    }
    
    async ledCirStart(args){
        if(this.mode){
            if(!this.isBleConnected){
                this.showToast('请先连接设备')
                this.runtime.stopAll();
                return
            }
            const ackPromise = this.waitForThreeZeros(); 
            await window.EditorPreload.bleSendIC2007(JSON.stringify([0xAA,0x01,Number(args.ONE)==1 ? 0x33:0x34,Number(args.TWO)]));
            await ackPromise
        }
        
    }
    
    async ledCirAllColor(args){
        if(this.mode){
            if(!this.isBleConnected){
                this.showToast('请先连接设备')
                this.runtime.stopAll();
                return
            }
            const ackPromise = this.waitForThreeZeros(); 
            let rgb = this.hexToRgb(args.ONE)
            await window.EditorPreload.bleSendIC2007(JSON.stringify([0xAA,0x01,0x35,Number(args.TWO),rgb[0],rgb[1],rgb[2]]));
            await ackPromise
        }
        
    }
    
    async Ultrasonic(args){
        if(this.mode){
            if(!this.isBleConnected){
                this.showToast('请先连接设备')
                this.runtime.stopAll();
                return
            }
            const ackPromise = this.waitForThreeZeros(); 
            await window.EditorPreload.bleSendIC2007(JSON.stringify([0xAA,0X01,0x01,Number(args.ONE)]));
            let result = await ackPromise
            return result
        }
        
    }
    
    async Light(args){
        if(this.mode){
            if(!this.isBleConnected){
                this.showToast('请先连接设备')
                this.runtime.stopAll();
                return
            }
            const ackPromise = this.waitForThreeZeros(); 
            await window.EditorPreload.bleSendIC2007(JSON.stringify([0xAA,0X01,0x02,Number(args.ONE)]));
            let result = await ackPromise
            return result
        }
        
    }
    
    async Button(args){
        if(this.mode){
            if(!this.isBleConnected){
                this.showToast('请先连接设备')
                this.runtime.stopAll();
                return
            }
            const ackPromise = this.waitForThreeZeros(); 
            await window.EditorPreload.bleSendIC2007(JSON.stringify([0xAA,0X01,0x03,Number(args.ONE)]));
            let result = await ackPromise
            return result==1
        }
        
    }
    
    async joystickRepo(args){
        if(this.mode){
            if(!this.isBleConnected){
                this.showToast('请先连接设备')
                this.runtime.stopAll();
                return
            }
            const ackPromise = this.waitForThreeZeros(); 
            await window.EditorPreload.bleSendIC2007(JSON.stringify([0xAA,0X01,0x04,Number(args.TWO),Number(args.ONE)]));
            let result = await ackPromise
            return result
        }
        
    }
    
    async Potentiometer(args){
        if(this.mode){
            if(!this.isBleConnected){
                this.showToast('请先连接设备')
                this.runtime.stopAll();
                return
            }
            const ackPromise = this.waitForThreeZeros(); 
            await window.EditorPreload.bleSendIC2007(JSON.stringify([0xAA,0X01,0x05,Number(args.ONE)]));
            let result = await ackPromise
            return result
        }
        
    }
    async sound(args){
        if(this.mode){
            if(!this.isBleConnected){
                this.showToast('请先连接设备')
                this.runtime.stopAll();
                return
            }
            const ackPromise = this.waitForThreeZeros(); 
            await window.EditorPreload.bleSendIC2007(JSON.stringify([0xAA,0X01,0x07]));
            let result = await ackPromise
            return result
        }
        
    }

    async setVol(args){
        if(this.mode){
            if(!this.isBleConnected){
                this.showToast('请先连接设备')
                this.runtime.stopAll();
                return
            }
            this.currentVol=args.ONE
            

            let vol=Number(args.ONE)
            if(vol<0){
                vol=0
            }else if(vol>10){
                vol=10
            }
            
            const ackPromise = this.waitForThreeZeros();
            await window.EditorPreload.bleSendIC2007(JSON.stringify([0XAA,0x01,0x50,vol]));
            await ackPromise
           
        }
    }

    stringToBinary(str) {
        const encoder = new TextEncoder();
        const uint8Array = encoder.encode(str);
        return uint8Array;
    }
    async musicUntil(args){
        if(this.mode){

            if(!this.isBleConnected){
                this.showToast('请先连接设备')
                this.runtime.stopAll();
                return
            }
            

            console.log('发送一次音频')
            const ackPromise = this.waitForThreeZeros();
            await window.EditorPreload.bleSendIC2007(JSON.stringify([0XAA,0x01,0x51,0x02,...this.stringToBinary(`/flash/${args.ONE}`)]));
            await ackPromise
           
        }
    }

    async music(args){
        if(this.mode){
            if(!this.isBleConnected){
                this.showToast('请先连接设备')
                this.runtime.stopAll();
                return
            }

            const ackPromise = this.waitForThreeZeros();
            await window.EditorPreload.bleSendIC2007(JSON.stringify([0XAA,0x01,0x51,0x01,...this.stringToBinary(`/flash/${args.ONE}`)]));
            await ackPromise
        
            
        }
    }

    async musicStop(){
        if(this.mode){

            if(!this.isBleConnected){
                this.showToast('请先连接设备')
                this.runtime.stopAll();
                return
            }

             
            
            const ackPromise = this.waitForThreeZeros();
            await window.EditorPreload.bleSendIC2007(JSON.stringify([0XAA,0x01,0x52]));
            await ackPromise
    
        }
    }
    
}


module.exports = IC2007;
