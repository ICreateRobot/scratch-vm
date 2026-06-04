const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type')
const socket=require('../../util/socket-connect')
const actuatorIcon = require('./actuator.svg')

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

class RobotPin {
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
        this.message=[0,0,0,0,0,0,0,0,0]
        this.reciveChannel = new BroadcastChannel('reciveChannel')
        this.reciveChannel.addEventListener('message',(event)=>{
            if(this.whatSendFun=='net'){
                this.message=event.data
            }
           
            // console.log(event.data)
        })
        this.portMap={
            "port1_0":32,
            "port1_1":33,
            "port2_0":34,
            "port2_1":35,
            "port34_0":36,
            "port34_1":37,
        }
        this.portBleMap={
            "port1_0":0x01,
            "port1_1":0x02,
            "port2_0":0x03,
            "port2_1":0x04,
            "port34_0":0x05,
            "port34_1":0x06,
        }

        this.whatSendFun =window.whatSendFun || 'net'// 默认就是 net
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
            if(event.data && this.whatSendFun == 'ble'){
                // socketBle.getSocket().send(JSON.stringify([0XCC,0x03]))
                if (this.responseQueue.length === 0) return;

                const queue = this.responseQueue;
                this.responseQueue = [];
        
                // 用 resolve(false) 结束所有 await
                for (const item of queue) {
                    item.resolve(false);
                }
            }else if(event.data && this.whatSendFun == 'net'){
                if (!this._successWaitQueue || this._successWaitQueue.length === 0) {
                    return;
                }
            
                const queue = this._successWaitQueue;
                this._successWaitQueue = [];
            
                for (const item of queue) {
                    try {
                        item.socket.removeEventListener('message', item.handler);
                    } catch (e) {}
            
                    // ✅结束等待（但不影响原来的成功逻辑）
                    item.resolve();
                }
            }else if(event.data && this.whatSendFun == 'port'){
                if (!this._sendCmdWaitQueue || this._sendCmdWaitQueue.length === 0) {
                    return;
                }
            
                const queue = this._sendCmdWaitQueue;
                this._sendCmdWaitQueue = [];
            
                for (const item of queue) {
                    try {
                        this.channelSerialData.removeEventListener('message', item.handler);
                    } catch (e) {}
            
                    // 结束等待（保持和原来 resolve 行为一致）
                    item.resolve();
                }
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
        // this.robotVersion='1.0.0'
        // this.timer = setInterval(()=>{
        //     if(this.robotVersion=='1.0.0'){
        //         this.robotVersion='2.0.0'
        //     }else{
        //         this.robotVersion='1.0.0'
        //     }
        // },5000)
        
    }
  getInfo() {

    return {
      id: 'robotpin',
      name: formatMessage({
                id: 'robotpin.name',
                default: 'Pin',
                description: 'robotpin.name'
            }),
      color1:'#33cccc',
    //   menuIconURI: actuatorIcon,
      blocks: [
        // {
        //     blockType: BlockType.LABEL,
        //     text: formatMessage({
        //         id: 'robotpin.pin',
        //         default: 'pin',
        //         description: 'robotpin.pin'
        //     }),
        // },

        {
            blockType: BlockType.LABEL,
            text: formatMessage({
                id: 'robotpin.message',
                default: '⚠ Old hardware (< v2.0.0): Use port1_0 and port1_1 only. Analog input is not supported on port1_0',
                description: 'robotpin.message'
            }),
        },
        
        
        {
            opcode: 'setDigital',//设置数字引脚输出为高低电平
            blockType: BlockType.COMMAND,
            // blockIconURI:icon,
            text: formatMessage({
                id: 'robotpin.setDigital',
                default: 'set digital pin [PIN] output as [CHOICE]',
                description: 'robotpin.setDigital'
            }),
            arguments: {
                PIN: {
                    type: ArgumentType.NUMBER,
                    menu: 'DIGITAL_PIN',
                    defaultValue:'0'
                },
                CHOICE: {
                    type: ArgumentType.NUMBER,
                    menu: 'DIGITAL_HIGHLOW'
                },
            }
        },

        // {
        //     opcode: 'setReadAnalogPin',//模拟引脚读取的引脚
        //     blockType: BlockType.COMMAND,
        //     // blockIconURI:icon,
        //     text: formatMessage({
        //         id: 'robotpin.setReadAnalogPin',
        //         default: 'set analog pin [PIN]',
        //         description: 'robotpin.setReadAnalogPin'
        //     }),
        //     arguments: {
        //         PIN: {
        //             type: ArgumentType.STRING,
        //             menu: 'ANALOG_PIN'
        //         }
        //     }
        // },
        {
            opcode: 'setPwm',//设置pwm引脚
            blockType: BlockType.COMMAND,
            // blockIconURI:icon,
            text: formatMessage({
                id: 'robotpin.setPwm',
                default: 'set PWM pin [PIN] frequency [FREQ] duty [NUM]',
                description: 'robotpin.setPwm'
            }),
            arguments: {
                PIN: {
                    type: ArgumentType.NUMBER,
                    menu: 'PWM_PIN'
                },
                NUM: {
                    type: ArgumentType.NUMBER,
                    defaultValue:0
                },
                FREQ: {
                    type: ArgumentType.NUMBER,
                    defaultValue:1000
                },
            }
        },
        {
            opcode: 'setPinMode',//设置数字引脚
            blockType: BlockType.COMMAND,
            // blockIconURI:icon,
            text: formatMessage({
                id: 'robotpin.setPinMode',
                default: 'set pin [PIN] mode [MODE]',
                description: 'robotpin.setPinMode'
            }),
            arguments: {
                PIN: {
                    type: ArgumentType.STRING,
                    menu: 'DIGITAL_PIN',
                    defaultValue:'0'
                },
                MODE: {
                    type: ArgumentType.NUMBER,
                    menu: 'PIN_MODE'
                }
            }
        },

        {
            opcode: 'readDigitalPin',//读取数字引脚
            blockType: BlockType.REPORTER,
            // blockIconURI:icon,
            text: formatMessage({
                id: 'robotpin.readDigitalPin',
                default: 'read digital pin [PIN]',
                description: 'robotpin.readDigitalPin'
            }),
            disableMonitor: true,
            arguments: {
                PIN: {
                    type: ArgumentType.NUMBER,
                    menu: 'DIGITAL_PIN',
                    defaultValue:'0'
                },
            }
        },

        

        {
            opcode: 'readAnalogPin',//读取模拟引脚
            blockType: BlockType.REPORTER,
            // blockIconURI:icon,
            text: formatMessage({
                id: 'robotpin.readAnalogPin',
                default: 'read analog pin [PIN]',
                description: 'robotpin.readAnalogPin'
            }),
            disableMonitor: true,
            arguments: {
                PIN: {
                    type: ArgumentType.NUMBER,
                    menu: 'ANALOG_PIN'
                },
            }
        },

        // {
        //     blockType: BlockType.LABEL,
        //     text: formatMessage({
        //         id: 'robotpin.iic',
        //         default: 'iic',
        //         description: 'robotpin.iic'
        //     }),
        // },
        '---',

        {
            opcode: 'setIICPort',//设置iic引脚
            blockType: BlockType.COMMAND,
            // blockIconURI:icon,
            text: formatMessage({
                id: 'robotpin.setIICPort',
                default: 'set IIC port [PORT]',
                description: 'robotpin.setIICPort'
            }),
            arguments: {
                PORT: {
                    type: ArgumentType.NUMBER,
                    menu: 'IIC_PORT'
                }
            }
        },
        {
            opcode: 'IICScan',//扫描地址
            blockType: BlockType.REPORTER,
            // blockIconURI:icon,
            text: formatMessage({
                id: 'robotpin.IICScan',
                default: 'scan IIC address',
                description: 'robotpin.IICScan'
            }),
            disableMonitor: true,
            arguments: {
                
            }
        },
        {
            opcode: 'IICWriteTo',//扫描地址
            blockType: BlockType.COMMAND,
            // blockIconURI:icon,
            text: formatMessage({
                id: 'robotpin.IICWriteTo',
                default: 'write [DATA] to I2C device at address [ADDR]',
                description: 'robotpin.IICWriteTo'
            }),
            arguments: {
                DATA:{
                    type: ArgumentType.NUMBER,
                },
                ADDR:{
                    type: ArgumentType.NUMBER,
                }
            }
        },
        {
            opcode: 'IICWriteToMem',//扫描地址
            blockType: BlockType.COMMAND,
            // blockIconURI:icon,
            text: formatMessage({
                id: 'robotpin.IICWriteToMem',
                default: 'write [DATA] to I2C device [ADDR] register [MEMADDR]',
                description: 'robotpin.IICWriteToMem'
            }),
            arguments: {
                DATA:{
                    type: ArgumentType.NUMBER,
                },
                ADDR:{
                    type: ArgumentType.NUMBER,
                },
                MEMADDR:{
                    type: ArgumentType.NUMBER,
                }
            }
        },
        {
            opcode: 'IICReadFrom',//扫描地址
            blockType: BlockType.REPORTER,
            // blockIconURI:icon,
            text: formatMessage({
                id: 'robotpin.IICReadFrom',
                default: 'read [NBYTES] bytes from I2C device at address [ADDR]',
                description: 'robotpin.IICReadFrom'
            }),
            arguments: {
                NBYTES:{
                    type: ArgumentType.NUMBER,
                },
                ADDR:{
                    type: ArgumentType.NUMBER,
                }
            }
        },
        {
            opcode: 'IICReadFromInto',//扫描地址
            blockType: BlockType.REPORTER,
            // blockIconURI:icon,
            text: formatMessage({
                id: 'robotpin.IICReadFromInto',
                default: 'read I2C device [ADDR] into [BUF]',
                description: 'robotpin.IICReadFromInto'
            }),
            arguments: {
                BUF:{
                    type: ArgumentType.NUMBER,
                },
                ADDR:{
                    type: ArgumentType.NUMBER,
                }
            }
        },
        {
            opcode: 'IICReadFromMem',//扫描地址
            blockType: BlockType.REPORTER,
            // blockIconURI:icon,
            text: formatMessage({
                id: 'robotpin.IICReadFromMem',
                default: 'read [NBYTES] bytes from I2C device [ADDR] register [MEMADDR]',
                description: 'robotpin.IICReadFromMem'
            }),
            arguments: {
                NBYTES:{
                    type: ArgumentType.NUMBER,
                },
                ADDR:{
                    type: ArgumentType.NUMBER,
                },
                MEMADDR:{
                    type: ArgumentType.NUMBER,
                }
            }
        },
        {
            opcode: 'IICReadFromMemInto',//扫描地址
            blockType: BlockType.REPORTER,
            // blockIconURI:icon,
            text: formatMessage({
                id: 'robotpin.IICReadFromMemInto',
                default: 'read I2C device [ADDR] register [MEMADDR] into [BUF]',
                description: 'robotpin.IICReadFromMemInto'
            }),
            arguments: {
                ADDR:{
                    type: ArgumentType.NUMBER,
                },
                MEMADDR:{
                    type: ArgumentType.NUMBER,
                },
                BUF:{
                    type: ArgumentType.NUMBER,
                }
            }
        },

      ],

      menus: {
        DIGITAL_PIN: {//数字引脚
            acceptReporters: false,
            items: [
                { text: "port1_0", value: '0' },
                { text: "port1_1", value: '1' },
                { text: "port2_0", value: '2' },
                { text: "port2_1", value: '3' },
                { text: "port34_0", value: '4' },
                { text: "port34_1", value: '5' },
            ]
        },
        DIGITAL_HIGHLOW: {//高低电平*
            acceptReporters: false,
            items: [
                {
                    text: formatMessage({
                        id: 'robotpin.setDigital.DIGITAL_HIGHLOW.high',
                        default: 'high',
                        description: 'robotpin.setDigital.DIGITAL_HIGHLOW.high'
                    }),
                    value: '1' 
                },
                { 
                    text: formatMessage({
                        id: 'robotpin.setDigital.DIGITAL_HIGHLOW.low',
                        default: 'low',
                        description: 'robotpin.setDigital.DIGITAL_HIGHLOW.low'
                    }),
                    value: '0'
                }
            ]
        },

        PWM_PIN: {//PWM端口
            acceptReporters: false,
            items: [
                { text: "port1_0", value: '0' },
                { text: "port1_1", value: '1' },
                { text: "port2_0", value: '2' },
                { text: "port2_1", value: '3' },
                { text: "port34_0", value: '4' },
                { text: "port34_1", value: '5' },
            ]
        },
        ANALOG_PIN: {//ANALOG端口
            acceptReporters: false,
            items: [
                { text: "port1_0", value: '0' },
                { text: "port1_1", value: '1' },
                { text: "port2_0", value: '2' },
                { text: "port2_1", value: '3' },
                { text: "port34_0", value: '4' },
                { text: "port34_1", value: '5' },
            ]
        },
        IIC_PORT: {//IIC端口
            acceptReporters: false,
            items: [
                { text: "1", value: '1' },
                { text: "2", value: '2' },
                { text: "3", value: '3' },
                { text: "4", value: '4' },
            ]
        },
        PIN_MODE: {//IIC端口
            acceptReporters: false,
            items: [
                { 
                    text: formatMessage({
                        id: 'robotpin.setPinMode.PIN_MODE.ANALOG',
                        default: 'analog read',
                        description: 'robotpin.setPinMode.PIN_MODE.ANALOG'
                    }), 
                    value: '3' 
                },
                { 
                    text: formatMessage({
                        id: 'robotpin.setPinMode.PIN_MODE.DIGITAL',
                        default: 'digital read',
                        description: 'robotpin.setPinMode.PIN_MODE.DIGITAL'
                    }),
                    value: '1' 
                },
            ]
        },

        INPUT_PULL: {//高低电平*
            acceptReporters: false,
            items: [
                {
                    text: formatMessage({
                        id: 'robotpin.setInputPull.INPUT_PULL.UP',
                        default: 'UP',
                        description: 'robotpin.setInputPull.INPUT_PULL.UP'
                    }),
                    value: '0' 
                },
                {
                    text: formatMessage({
                        id: 'robotpin.setInputPull.INPUT_PULL.DOWN',
                        default: 'DOWN',
                        description: 'robotpin.setInputPull.INPUT_PULL.DOWN'
                    }),
                    value: '1' 
                },
                {
                    text: formatMessage({
                        id: 'robotpin.setInputPull.INPUT_PULL.NONE',
                        default: 'NONE',
                        description: 'robotpin.setInputPull.INPUT_PULL.NONE'
                    }),
                    value: '2' 
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
    async setDigital(args){
        try{
            console.log(this.message.slice(30, 32))
        }catch(e){
            console.log(e)
        }
        
        if(this.mode){
            
    
            let mode=0
    
            
            let jsonData={
                "command":"esp_pin",
                "params":{
                    "mode":0,
                    "pin":Number(args.PIN),
                    "state":Number(args.CHOICE),
                    "duty":0,
                    "freq":0
                }
            }
            // let str = `robot.send_paw(${args.ONE},${args.TWO})`;
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
                // this.sendCommandAndWaitForSuccess(JSON.stringify([0XAA,0x01,0x31,0x02,Number(args.ONE),mode]))
            }else if(this.whatSendFun=='ble'){
                const ackPromise = this.waitForThreeZeros(); 
                socketBle.getSocket().send(JSON.stringify([0XAA,0x01,0x70,Number(args.PIN),Number(args.CHOICE)==0 ? 0x00:0x01]))
                await ackPromise
            }
            
           
        }
    }
    async setPwm(args){
        if(this.mode){
            
    
            let mode=0
    
            
            let jsonData={
                "command":"esp_pin",
                "params":{
                    "mode":2,
                    "pin":Number(args.PIN),
                    "state":0,
                    "duty":Number(args.NUM),
                    "freq":Number(args.FREQ)
                }
            }
            // let str = `robot.send_paw(${args.ONE},${args.TWO})`;
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
                // this.sendCommandAndWaitForSuccess(JSON.stringify([0XAA,0x01,0x31,0x02,Number(args.ONE),mode]))
            }else if(this.whatSendFun=='ble'){
                const ackPromise = this.waitForThreeZeros(); 
                socketBle.getSocket().send(JSON.stringify([0XAA,0x01,0x72,Number(args.PIN),this.toTwoDigitHexadecimalPair(Number(args.FREQ))[0],this.toTwoDigitHexadecimalPair(Number(args.FREQ))[1],this.toTwoDigitHexadecimalPair(Number(args.NUM))[0],this.toTwoDigitHexadecimalPair(Number(args.NUM))[1]]))
                await ackPromise
            }
            
           
        }
    }

    async setPinMode(args){
        if(this.mode){
    
            
            let jsonData={
                "command":"esp_pin",
                "params":{
                    "mode":Number(args.MODE),
                    "pin":Number(args.PIN),
                    "state":0,
                    "duty":0,
                    "freq":0
                }
            }
            // let str = `robot.send_paw(${args.ONE},${args.TWO})`;
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
                // this.sendCommandAndWaitForSuccess(JSON.stringify([0XAA,0x01,0x31,0x02,Number(args.ONE),mode]))
            }else if(this.whatSendFun=='ble'){
                const ackPromise = this.waitForThreeZeros(); 
                socketBle.getSocket().send(JSON.stringify([0XAA,0x01,Number(args.MODE)==1?0x71:0X73,Number(args.PIN)]))
                await ackPromise
            }
            
           
        }
    }

    async readDigitalPin(args){
        if(this.mode){
    
            
            if(this.whatSendFun=='net' || this.whatSendFun=='port'){
                if(socket.getIp().length==0 && this.whatSendFun=='net'){
                    this.showToast('未连接机器人')
                    this.runtime.stopAll();
                    return
                }
                console.log(this.message)
                return this.message.slice(32, 38)[Number(args.PIN)]
            }else if(this.whatSendFun=='ble'){
                console.log(typeof window.EditorPreload.getRobotData())
                return JSON.parse(window.EditorPreload.getRobotData()).slice(32, 38)[Number(args.PIN)]
            }
            
           
        }
    }
    async readAnalogPin(args){
        if(this.mode){
    
            
            if(this.whatSendFun=='net' || this.whatSendFun=='port'){
                if(socket.getIp().length==0 && this.whatSendFun=='net'){
                    this.showToast('未连接机器人')
                    this.runtime.stopAll();
                    return
                }
                console.log(this.message)
                return this.message.slice(32, 38)[Number(args.PIN)]
            }else if(this.whatSendFun=='ble'){
                console.log(typeof window.EditorPreload.getRobotData())
                return JSON.parse(window.EditorPreload.getRobotData()).slice(32, 38)[Number(args.PIN)]
            }
            
           
        }
    }
//   getDigitalPin(){
//     let item = []
//     if(this.robotVersion=='1.0.0'){
//         item=[
//             { text: "0", value: 'IO0' },
//             { text: "8", value: 'IO8' },
//             { text: "9", value: 'IO9' },
//             { text: "17", value: 'IO17' },
//             { text: "18", value: 'IO18' },
//         ]
//     }else{
//         item=[
//             { text: "0", value: 'IO0' },
//             { text: "8", value: 'IO8' },
//             { text: "9", value: 'IO9' },
//             { text: "17", value: 'IO17' },
//             { text: "18", value: 'IO18' },
//             { text: "19", value: 'IO19' },
//             { text: "20", value: 'IO20' },
//             { text: "35", value: 'IO35' },
//             { text: "36", value: 'IO36' },
//             { text: "37", value: 'IO37' },
//             { text: "46", value: 'IO46' },
//         ]
//     }
    
//     return item
//   }


}


module.exports = RobotPin;
