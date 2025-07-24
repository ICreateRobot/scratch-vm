const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type')
class robotble {
    getInfo() {
    return {
        id: 'robotble',
        name: '蓝牙',
        color1: '#3300cc',
        blocks: [
            {
                opcode: 'setHz',
                blockType: BlockType.COMMAND,
                text: '设置蓝牙广播频道为[ONE]',
                arguments:{
                    ONE:{
                        type:ArgumentType.STRING,
                        defaultValue:''
                    },
                },
            },

            {
                opcode: 'bleSend',
                blockType: BlockType.COMMAND,
                text: '蓝牙发送数据[ONE]',
                arguments:{
                    ONE:{
                        type:ArgumentType.STRING,
                        defaultValue:''
                    },
                },
            },

            {
                opcode: 'bleRecive',
                blockType: BlockType.REPORTER,
                text: '蓝牙接收到消息',
                arguments:{
                    
                },
                disableMonitor: true
            },
    
            {
                opcode: 'setbleName',
                blockType: BlockType.COMMAND,
                text: '设置蓝牙名称为[ONE]',
                arguments:{
                    ONE:{
                        type:ArgumentType.STRING,
                        defaultValue:''
                    },
                },
            },

            {
                opcode: 'bleName',
                blockType: BlockType.REPORTER,
                text: '获取蓝牙名称',
                arguments:{
                    
                },
                disableMonitor: true
            },

        ],
        menus: {
            key: {
              acceptReporters: false,
              items: [
                {
                  // startHats filters by *value*, not by text
                  text: '⬅️',
                  value: '0'
                },

                {
                    // startHats filters by *value*, not by text
                    text: '➡️',
                    value: '1'
                  },
              ]
            }
        }
  
    };
    }

    bleName(){
       
    }

}


module.exports = robotble;
