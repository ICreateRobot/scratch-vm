const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type')
class robotwifi {
    getInfo() {
    return {
        id: 'robotwifi',
        name: '网络',
        color1: '#cc66ff',
        blocks: [
            {
                opcode: 'staConnect',
                blockType: BlockType.COMMAND,
                text: '开始连接无线网络[ONE] 密码[TWO]',
                arguments:{
                    ONE:{
                        type:ArgumentType.STRING,
                        defaultValue:''
                    },
                    TWO:{
                        type:ArgumentType.STRING,
                        defaultValue:''
                    }
                }
            },

            // {
            //     opcode: 'localIp',
            //     blockType: BlockType.REPORTER,
            //     text: '本机IP地址',
            //     arguments:{
                    
            //     },
            //     disableMonitor: true
            // },

            {
                opcode: 'isConnect',
                blockType: BlockType.BOOLEAN,
                text: 'WIFI连接成功',
                arguments:{
                    
                },
                disableMonitor: true
            },

            {
                opcode: 'info',
                blockType: BlockType.REPORTER,
                text: 'wifi信息',
                arguments:{
                    
                },
                disableMonitor: true
            },

            {
                opcode: 'stop',
                blockType: BlockType.COMMAND,
                text: '断开WIFI连接',
                arguments:{
                },
            },

            {
                opcode: 'startAp',
                blockType: BlockType.COMMAND,
                text: '开启ap智能配网',
                arguments:{
                },
            },

            // {
            //     opcode: 'startWifi',
            //     blockType: BlockType.COMMAND,
            //     text: '开启热点WiFi名称[ONE] 密码[TWO]',
            //     arguments:{
            //         ONE:{
            //             type:ArgumentType.STRING,
            //             defaultValue:''
            //         },
            //         TWO:{
            //             type:ArgumentType.STRING,
            //             defaultValue:''
            //         }
            //     }
            // },
            // {
            //     opcode: 'stopwifi',
            //     blockType: BlockType.COMMAND,
            //     text: '关闭热点',
            //     arguments:{
            //     },
            // },

            // {
            //     opcode: 'broadcast',
            //     blockType: BlockType.COMMAND,
            //     text: '面向局域网广播消息[ONE]',
            //     arguments:{
            //         ONE:{
            //             type:ArgumentType.STRING,
            //             defaultValue:''
            //         },
            //     },
            // },

            // {
            //     opcode: 'broadcastAndPost',
            //     blockType: BlockType.COMMAND,
            //     text: '面向局域网广播消息[ONE]并发送值',
            //     arguments:{
            //         ONE:{
            //             type:ArgumentType.STRING,
            //             defaultValue:''
            //         },
            //     },
            // },

            // {
            //     opcode: 'reciveBroadcast',
            //     blockType: BlockType.COMMAND,
            //     text: '当接收到局域网广播[ONE]',
            //     arguments:{
            //         ONE:{
            //             type:ArgumentType.STRING,
            //             defaultValue:''
            //         },
            //     },
            // },

            // {
            //     opcode: 'boardcastData',
            //     blockType: BlockType.REPORTER,
            //     text: '局域网广播接收到的值',
            //     arguments:{
                    
            //     },
            //     disableMonitor: true
            // },
            // {
            //     opcode: 'setChannel',
            //     blockType: BlockType.COMMAND,
            //     text: '设置局域网信道为[ONE]',
            //     arguments:{
            //         ONE:{
            //             type:ArgumentType.STRING,
            //             defaultValue:''
            //         },
            //     },
            // },
        ]
    };
    }
    // when(args) {
    // return Scratch.Cast.toBoolean(args.CONDITION);
    // }
    when(){
        
    }
}

// Scratch.vm.runtime.on('BEFORE_EXECUTE', () => {
//     // startHats is the same as before!
//     Scratch.vm.runtime.startHats('whenunsandboxed_when');
// });

module.exports = robotwifi;
