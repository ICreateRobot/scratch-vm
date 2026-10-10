/*北京学校 iot项目扩展 */
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');


class IoTSchool { 

    constructor(runtime){
        this.runtime=runtime
    }

    getInfo() {
        return {
            id: 'IoTSchool',
            name: "智慧教室",

            color1: '#5C6BC0',
            color2: '#4F5DA8',
            color3: '#445091',

            blocks: [

                {
                    func: 'openDeviceScanner',
                    blockType: BlockType.BUTTON,
                    text: '连接物联网服务器',
                },
                '---',
                //----------------------小夜灯（网关）------------------------
                {
                    opcode: 'lightOn_wg',
                    blockType: BlockType.COMMAND,
                    text: '开启 小夜灯',
                },                
                {
                    opcode: 'setBrightness',
                    blockType: BlockType.COMMAND,
                    text: '设置 小夜灯 亮度 [VALUE]',
                    arguments: {
                        VALUE: { 
                            type: ArgumentType.NUMBER, 
                            defaultValue: 255 
                        }
                    }
                },
                {
                    opcode: 'setColorHex',
                    blockType: BlockType.COMMAND,
                    text: '设置 小夜灯 颜色 [COLOR]',
                    arguments: {
                        COLOR: { 
                            type: ArgumentType.COLOR, 
                            defaultValue: '#ff0000' 
                        }
                    }
                },
                {
                    opcode: 'setColorRGB',
                    blockType: BlockType.COMMAND,
                    text: '设置 小夜灯 R [R] G [G] B [B]',
                    arguments: {
                        R: { type: ArgumentType.NUMBER, defaultValue: 255 },
                        G: { type: ArgumentType.NUMBER, defaultValue: 0 },
                        B: { type: ArgumentType.NUMBER, defaultValue: 0 }
                    }
                },
                {
                    opcode: 'lightOff_wg',
                    blockType: BlockType.COMMAND,
                    text: '关闭 小夜灯',
                },

                //----------------------照明灯------------------------
                '---',
                {
                    opcode: 'lightOn',
                    blockType: BlockType.COMMAND,
                    text: '开启 照明灯[LED]',
                    arguments: { 
                        LED: {
                            type: ArgumentType.STRING,
                            menu: 'choice_LED'
                        }
                    }
                },
                {
                    opcode: 'setBrightness_led',
                    blockType: BlockType.COMMAND,
                    text: '设置 照明灯[LED] 亮度 [VALUE]',
                    arguments: {
                        LED: {
                            type: ArgumentType.STRING,
                            menu: 'choice_LED'
                        },
                        VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 255
                        }
                    }
                },
                {
                    opcode: 'setColorHex_led',
                    blockType: BlockType.COMMAND,
                    text: '设置 照明灯[LED] 颜色 [COLOR]',
                    arguments: {
                        LED: {
                            type: ArgumentType.STRING,
                            menu: 'choice_LED'
                        },
                        COLOR: {
                            type: ArgumentType.COLOR,
                            defaultValue: '#ff0000'
                        }
                    }
                },
                {
                    opcode: 'setColorRGB_led',
                    blockType: BlockType.COMMAND,
                    text: '设置 照明灯[LED] R [R] G [G] B [B]',
                    arguments: {
                        LED: {
                            type: ArgumentType.STRING,
                            menu: 'choice_LED'
                        },
                        R: { type: ArgumentType.NUMBER, defaultValue: 255 },
                        G: { type: ArgumentType.NUMBER, defaultValue: 0 },
                        B: { type: ArgumentType.NUMBER, defaultValue: 0 }
                    }
                },
                {
                    opcode: 'lightOff',
                    blockType: BlockType.COMMAND,
                    text: '关闭 照明灯[LED]',
                    arguments: { 
                        LED: {
                            type: ArgumentType.STRING,
                            menu: 'choice_LED'
                        }
                    }
                },
                //----------------------窗帘------------------------
                '---',
                {
                    opcode: 'curtainOn',
                    blockType: BlockType.COMMAND,
                    text: '开启 窗帘[CURTAIN]',
                    arguments: { 
                        CURTAIN: {
                            type: ArgumentType.STRING,
                            menu: 'choice_CURTAIN'
                        }
                    }
                },
                {
                    opcode: 'setCurtainPosition',
                    blockType: BlockType.COMMAND,
                    text: '设置 窗帘[CURTAIN] 开合 [VALUE]%',
                    arguments: {
                        CURTAIN: {
                            type: ArgumentType.STRING,
                            menu: 'choice_CURTAIN'
                        },
                        VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                },   
                {
                    opcode: 'getCurtainPosition',
                    blockType: BlockType.REPORTER,
                    text: '窗帘[CURTAIN] 开合%',
                    disableMonitor: true,
                    arguments: {
                        CURTAIN: {
                            type: ArgumentType.STRING,
                            menu: 'choice_CURTAIN'
                        }
                    }
                },
                {
                    opcode: 'curtainOff',
                    blockType: BlockType.COMMAND,
                    text: '关闭 窗帘[CURTAIN]',
                    arguments: { 
                        CURTAIN: {
                            type: ArgumentType.STRING,
                            menu: 'choice_CURTAIN'
                        }
                    }
                },

                //----------------------开关------------------------
                '---',
                {
                    opcode: 'setSwitch',
                    blockType: BlockType.COMMAND,
                    text: '设置 开关[KEY] 为 [STATE]',
                    arguments: {
                        KEY: {
                            type: ArgumentType.STRING,
                            menu: 'choice_KEY'
                        },
                        STATE: {
                            type: ArgumentType.STRING,
                            menu: 'on_off'
                        }
                    }
                },
                {
                    opcode: 'getSwitchState',
                    blockType: BlockType.BOOLEAN,
                    text: '开关[KEY]',
                    disableMonitor: true,
                    arguments: { 
                        KEY: {
                            type: ArgumentType.STRING,
                            menu: 'choice_KEY'
                        }
                    }
                },

                //----------------------温湿度------------------------
                '---',
                {
                    opcode: 'getTemperature',
                    blockType: BlockType.REPORTER,
                    text: '温度 °C',
                    disableMonitor: true
                },
                {
                    opcode: 'getHumidity',
                    blockType: BlockType.REPORTER,
                    text: '湿度 %',
                    disableMonitor: true
                },

                //----------------------光照------------------------
                '---',
                {
                    opcode: 'getLight',
                    blockType: BlockType.REPORTER,
                    text: '光照强度',
                    disableMonitor: true
                },

                //----------------------人在------------------------
                '---',
                {
                    opcode: 'getMotion',
                    blockType: BlockType.BOOLEAN,
                    text: '检测到运动',
                    disableMonitor: true
                },

                //----------------------魔方------------------------
                '---',
                {
                    opcode: 'getCube',
                    blockType: BlockType.BOOLEAN,
                    text: '魔方翻转至 [CUBE]面向上',
                    disableMonitor: true,
                    arguments: {
                        CUBE: {
                            type: ArgumentType.STRING,
                            menu: 'choice_CUBE'
                        }
                    }
                },
            ],

            menus: {
                choice_LED:{//选择LED
                    acceptReporters: false,
                    items: [
                        { text: '1', value: 'led1' },
                        { text: '2', value: 'led2' },
                        { text: '3', value: 'led3' }
                    ]
                },
                choice_KEY:{//选择开关
                    acceptReporters: false,
                    items: [
                        { text: '1', value: 'switch1' },
                        { text: '2', value: 'switch2' },
                        { text: '3', value: 'switch3' }
                    ]
                },
                choice_CURTAIN:{//选择窗帘
                    acceptReporters: false,
                    items: [
                        { text: '1', value: 'curtain1' },
                        { text: '2', value: 'curtain2' },
                        { text: '3', value: 'curtain3' }
                    ]
                },
                choice_CUBE:{//选择魔方
                    acceptReporters: false,
                    items: [
                        { text: '1', value: 'cube1' },
                        { text: '2', value: 'cube2' },
                        { text: '3', value: 'cube3' },
                        { text: '4', value: 'cube4' },
                        { text: '5', value: 'cube5' },
                        { text: '6', value: 'cube6' }
                    ]
                },
                on_off:{//开关状态
                    acceptReporters: false,
                    items: [
                        { text: '开启', value: 'turn_on' },
                        { text: '关闭', value: 'turn_off'}
                    ]
                },

                
            }

        };
    }

    //----------------------扫描树莓派设备------------------------
    openDeviceScanner() {
        window.dispatchEvent(new CustomEvent('iot-scan-open'));
    }

    //----------------------私有工具------------------------
    // 把任意输入钳到 0~255 的整数
    _clampByte(v) {
        let n = Number(v);
        if (isNaN(n)) n = 0;
        return Math.min(255, Math.max(0, Math.round(n)));
    }

    // '#ff0000' -> [255, 0, 0]
    _hexToRgb(hex) {
        const s = String(hex || '').replace('#', '').trim();
        // 兼容 #fff 简写
        const full = s.length === 3
            ? s.split('').map(c => c + c).join('')
            : s.padEnd(6, '0').slice(0, 6);
        return [
            parseInt(full.slice(0, 2), 16) || 0,
            parseInt(full.slice(2, 4), 16) || 0,
            parseInt(full.slice(4, 6), 16) || 0
        ];
    }


    //----------------------小夜灯（网关）------------------------
    lightOn_wg() {
        return this.sendIotData("light","turn_on", "wangguan");
    }

    setBrightness(args) {
        // let data = args.VALUE 
        // if (Number(args.VALUE) < 0 ) {
        //     data = 0;
        // } else if (Number(args.VALUE) > 255) {
        //     data = 255;
        // }
        return this.sendIotData("light","turn_on", "wangguan", { brightness: this._clampByte(args.VALUE)});
    }

    setColorHex(args) {
        // const hex = args.COLOR.replace('#', '');

        // const r = parseInt(hex.slice(0, 2), 16);
        // const g = parseInt(hex.slice(2, 4), 16);
        // const b = parseInt(hex.slice(4, 6), 16);

        return this.sendIotData("light","turn_on", "wangguan", {
            rgb_color: this._hexToRgb(args.COLOR)
        });
    }

    setColorRGB(args) {
        return this.sendIotData("light","turn_on", "wangguan",{
            rgb_color: [
                this._clampByte(args.R),
                this._clampByte(args.G),
                this._clampByte(args.B)
            ]
        });
    }

    lightOff_wg() {
        return this.sendIotData("light","turn_off", "wangguan");
    }

    //----------------------照明灯------------------------
    lightOn(args) {
        return this.sendIotData("light","turn_on", args.LED);
    }

    setBrightness_led(args) {
        return this.sendIotData("light", "turn_on", args.LED, {
            brightness: this._clampByte(args.VALUE)
        });
    }

    setColorHex_led(args) {
        return this.sendIotData("light", "turn_on", args.LED, {
            rgb_color: this._hexToRgb(args.COLOR)
        });
    }

    setColorRGB_led(args) {
        return this.sendIotData("light", "turn_on", args.LED, {
            rgb_color: [
                this._clampByte(args.R),
                this._clampByte(args.G),
                this._clampByte(args.B)
            ]
        });
    }

    lightOff(args) {
        return this.sendIotData("light","turn_off", args.LED);
    }

    //----------------------窗帘------------------------
    curtainOn(args) {
        return this.sendIotData("cover","open_cover", args.CURTAIN);
    }

    setCurtainPosition(args) {
        let data = args.VALUE 
        if (Number(args.VALUE) < 0 ) {
            data = 0;
        } else if (Number(args.VALUE) > 100) {
            data = 100;
        }
        return this.sendIotData( "cover",  "set_cover_position", args.CURTAIN, {
            position: data
        });
    }

    async getCurtainPosition(args) {
        return await this.getEntityState( "cover", args.CURTAIN, "current_position");
    }

    curtainOff(args) {
        return this.sendIotData("cover","close_cover", args.CURTAIN);
    }
    
    //----------------------开关------------------------
    async setSwitch(args) {
        return await this.sendIotData("switch", args.STATE, args.KEY);
    }

    async getSwitchState(args) {
        return await this.getEntityState("switch", args.KEY, "state") == "on";
    }

    //----------------------温湿度------------------------
    async getTemperature(args) {
        return await this.getEntityState( "sensor", "temp1", "state");
    }
    async getHumidity(args) {
        return await this.getEntityState( "sensor", "humidity1", "state");
    }

    //----------------------光照------------------------
    async getLight(args) {
        return await this.getEntityState( "sensor", "light1", "state");
    }

    //----------------------人在------------------------
    async getMotion(args) {
        return await this.getEntityState( "binary_sensor", "motion1", "state") == "on";
    }

    //----------------------魔方------------------------
    async getCube(args) {
        //return await this.getEntityState( "event", args.CUBE, "state") == "on";
        //检测时间
        const lastEventTimeStr = await this.getEntityState("event", args.CUBE, "state");
        if (!lastEventTimeStr) return false;

        //当前时间
        const lastEventTime = new Date(lastEventTimeStr).getTime();
        const now = Date.now();

        // 1秒内？
        if((now - lastEventTime) <= 2000){
            return true;
        }

        return false;
    }

    //异常检测 
    // unavailable   掉线检测（这种情况是拿到数据了，但是实际上没有数据）

    
    // 发送iot控制指令
    async sendIotData(service, action, device,value=null) {
        await new Promise(r => setTimeout(r, 300));

        //console.log(this.runtime.iotList)
        //console.log("service:", service, ",action:", action, ",device:", device, ",value:", value)

        if (!this.runtime.iotList) {
            this.runtime.ioDevices.toast.guiToast("001", "请检查是否连接IoT服务器", 'error', 2000);
            return false;
        }
        const entity = this.runtime.iotList.find(item =>matchDevice(item.entity_id, device));
        
        if (!entity) {
            console.warn(`未找到设备`);
            this.runtime.ioDevices.toast.guiToast("002", "未找到设备", 'error', 2000);
            return false;
        }

        try {
            const result = await this.runtime.ioDevices.iot.sendIotData(entity.entity_id,service,action,value);

            return result;
        } catch (e) {
            console.error("[异常]", e);
            return null;
        }
    }

    // 读取iot设备状态
    async getEntityState(service, device, attribute = null) {
        await new Promise(r => setTimeout(r, 300));

        if (!this.runtime.iotList) {
            this.runtime.ioDevices.toast.guiToast("001", "请检查是否连接IoT服务器", 'error', 2000);
            return false;
        }
        const entity = this.runtime.iotList.find(item =>matchDevice(item.entity_id, device));
        
        if (!entity) {
            console.warn(`未找到设备`);
            this.runtime.ioDevices.toast.guiToast("002", "未找到设备", 'error', 2000);
            return false;
        }

        try {
            const result = await this.runtime.ioDevices.iot.getEntityState( entity.entity_id,service, attribute );

            return result;
        } catch (e) {
            console.error("[读取异常]", e);
            return null;
        }
    }
   
}

//检测程序中设备是否存在
function matchDevice(entityId, targetLed) {
    const parts = entityId.split("_");
    const last = parts[parts.length - 1]; 

    return last === targetLed;
}

module.exports = IoTSchool;