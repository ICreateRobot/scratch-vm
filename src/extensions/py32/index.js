const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type')
const socket=require('../../util/localSocket')
const formatMessage = require('format-message');
const currentMode = require('../../util/mode')
const motorD=require('../../util/img/max_module_motor_d.svg')
let motor=[8,1]
class Py32 {

  constructor(runtime){
    this.runtime=runtime
    this.mode=true
    this.channelMode=new BroadcastChannel('mode')
    this.channelMode.addEventListener('message',(event)=>{
        this.mode=event.data
        currentMode.setMode(event.data)
    })

    if(!socket.getSocket()){
      socket.setSocket()
    }
  }
  getInfo() {
    return {
      id: 'py32',
      name: formatMessage({
            id: 'py32.name',
            default: 'py32',
            description: 'py32.name'
        }),
      color1: '#F54D3B',
      blocks: [

        {
            blockType: BlockType.LABEL,
            text: formatMessage({
                id: 'py32.io',
                default: 'IO',
                description: 'py32.io'
            }),
        },
        {
          opcode: 'setIoMode',//设置引脚模式
          blockType: BlockType.COMMAND,
          // blockIconURI:icon,
          text: formatMessage({
              id: 'py32.setIoMode',
              default: 'pin mode [PIN] [CHOICE]',
              description: 'py32.setIoMode'
          }),
          arguments: {
              PIN: {
                  type: ArgumentType.STRING,
                  menu: 'PIN',
                  defaultValue:'PA6'
              },
              CHOICE: {
                  type: ArgumentType.STRING,
                  menu: 'IN_OUT'
              },
          }
      },

      {
        opcode: 'setDigital',//设置数字引脚输出为高低电平
        blockType: BlockType.COMMAND,
        // blockIconURI:icon,
        text: formatMessage({
            id: 'py32.setDigital',
            default: 'set digital pin [PIN] output as [CHOICE]',
            description: 'py32.setDigital'
        }),
        arguments: {
            PIN: {
                type: ArgumentType.STRING,
                menu: 'PIN',
                defaultValue:'PA6'
            },
            CHOICE: {
                type: ArgumentType.STRING,
                menu: 'HIGHLOW'
            },
        }
    },
    {
      opcode: 'setAnalog',//设置数字引脚输出为高低电平
      blockType: BlockType.COMMAND,
      // blockIconURI:icon,
      text: formatMessage({
          id: 'py32.setAnalog',
          default: 'set analog pin [PIN] output as [CHOICE]',
          description: 'py32.setAnalog'
      }),
      arguments: {
          PIN: {
              type: ArgumentType.STRING,
              menu: 'PIN',
              defaultValue:'PA6'
          },
          CHOICE: {
              type: ArgumentType.STRING,
              menu: 'HIGHLOW'
          },
      }
    },

    {
      opcode: 'digitalRead',//设置数字引脚输出为高低电平
      blockType: BlockType.BOOLEAN,
      // blockIconURI:icon,
      text: formatMessage({
          id: 'py32.digitalRead',
          default: 'digital read [PIN]',
          description: 'py32.digitalRead'
      }),
      arguments: {
          PIN: {
              type: ArgumentType.STRING,
              menu: 'PIN',
              defaultValue:'PA6'
          }
      },
      disableMonitor: true
    },

    {
      opcode: 'analogRead',//设置数字引脚输出为高低电平
      blockType: BlockType.REPORTER,
      // blockIconURI:icon,
      text: formatMessage({
          id: 'py32.analogRead',
          default: 'analog read [PIN]',
          description: 'py32.analogRead'
      }),
      arguments: {
          PIN: {
              type: ArgumentType.STRING,
              menu: 'PIN',
              defaultValue:'PA6'
          }
      },
      disableMonitor: true
    },

    {
        blockType: BlockType.LABEL,
        text: formatMessage({
            id: 'py32.serial',
            default: 'Serial',
            description: 'py32.serial'
        }),
    },

    {
      opcode: 'setBaudrate',//设置数字引脚输出为高低电平
      blockType: BlockType.COMMAND,
      // blockIconURI:icon,
      text: formatMessage({
          id: 'py32.setBaudrate',
          default: 'serial set baudrate [BAUD]',
          description: 'py32.setBaudrate'
      }),
      arguments: {
        BAUD: {
              type: ArgumentType.NUMBER,
              defaultValue:'115200'
          }
      }
    },

    {
      opcode: 'serialAny',//设置数字引脚输出为高低电平
      blockType: BlockType.BOOLEAN,
      // blockIconURI:icon,
      text: formatMessage({
          id: 'py32.serialAny',
          default: 'serial Any?',
          description: 'py32.serialAny'
      }),
      arguments: {
         
      },
      disableMonitor: true
    },
    {
      opcode: 'serialRead',//设置数字引脚输出为高低电平
      blockType: BlockType.REPORTER,
      // blockIconURI:icon,
      text: formatMessage({
          id: 'py32.serialRead',
          default: 'serial read data',
          description: 'py32.serialRead'
      }),
      arguments: {
         
      },
      disableMonitor: true
    },

    {
      opcode: 'serialPrint',//设置数字引脚输出为高低电平
      blockType: BlockType.COMMAND,
      // blockIconURI:icon,
      text: formatMessage({
          id: 'py32.serialPrint',
          default: 'serial print [TEXT]',
          description: 'py32.serialPrint'
      }),
      arguments: {
        TEXT: {
              type: ArgumentType.STRING,
              defaultValue:'Hello'
          }
      }
    },

    {
        blockType: BlockType.LABEL,
        text: formatMessage({
            id: 'py32.oled',
            default: 'OLED',
            description: 'py32.oled'
        }),
    },

    {
        opcode: 'createOled',//设置数字引脚输出为高低电平
        blockType: BlockType.COMMAND,
        // blockIconURI:icon,
        text: formatMessage({
            id: 'py32.createOled',
            default: 'create oled width: [WIDTH]  height:[HEIGHT]',
            description: 'py32.createOled'
        }),
        arguments: {
            WIDTH: {
                type: ArgumentType.NUMBER,
                defaultValue:'128'
            },
            HEIGHT: {
                type: ArgumentType.NUMBER,
                defaultValue:'64'
            }
        }
      },

      {
        opcode: 'initOled',//设置数字引脚输出为高低电平
        blockType: BlockType.COMMAND,
        // blockIconURI:icon,
        text: formatMessage({
            id: 'py32.initOled',
            default: 'init oled address: [ADDR],SDA [SDA] SCL [SCL]',
            description: 'py32.initOled'
        }),
        arguments: {
            ADDR: {
                type: ArgumentType.STRING,
                defaultValue:'0X3C'
            },
            SDA: {
                type: ArgumentType.STRING,
                menu: 'SDA'
            },
            SCL: {
                type: ArgumentType.STRING,
                menu: 'SCL'
            }
        }
      },
      {
        opcode: 'clearOled',//设置数字引脚输出为高低电平
        blockType: BlockType.COMMAND,
        // blockIconURI:icon,
        text: formatMessage({
            id: 'py32.clearOled',
            default: 'clear oled',
            description: 'py32.clearOled'
        }),
        arguments: {
            
        }
      },

      {
        opcode: 'setColor',//设置数字引脚输出为高低电平
        blockType: BlockType.COMMAND,
        // blockIconURI:icon,
        text: formatMessage({
            id: 'py32.setColor',
            default: 'set text color [COLOR]',
            description: 'py32.setColor'
        }),
        arguments: {
            COLOR: {
                type: ArgumentType.STRING,
                menu: 'COLOR'
            }
        }
      },

      {
        opcode: 'setTextSize',//设置数字引脚输出为高低电平
        blockType: BlockType.COMMAND,
        // blockIconURI:icon,
        text: formatMessage({
            id: 'py32.setTextSize',
            default: 'set text size [SIZE]',
            description: 'py32.setTextSize'
        }),
        arguments: {
            SIZE: {
                type: ArgumentType.NUMBER,
                defaultValue:'1'
            }
        }
      },

      {
        opcode: 'setTextPlace',//设置数字引脚输出为高低电平
        blockType: BlockType.COMMAND,
        // blockIconURI:icon,
        text: formatMessage({
            id: 'py32.setTextPlace',
            default: 'set text x [X] y [Y]',
            description: 'py32.setTextPlace'
        }),
        arguments: {
            X: {
                type: ArgumentType.NUMBER,
                defaultValue:'0'
            },
            Y: {
                type: ArgumentType.NUMBER,
                defaultValue:'0'
            }
        }
      },

      {
        opcode: 'setTextCon',//设置数字引脚输出为高低电平
        blockType: BlockType.COMMAND,
        // blockIconURI:icon,
        text: formatMessage({
            id: 'py32.setTextCon',
            default: 'set text [TEXT]',
            description: 'py32.setTextCon'
        }),
        arguments: {
            TEXT: {
                type: ArgumentType.STRING,
                defaultValue:'hello'
            }
        }
      },


      {
        opcode: 'displayText',//设置数字引脚输出为高低电平
        blockType: BlockType.COMMAND,
        // blockIconURI:icon,
        text: formatMessage({
            id: 'py32.displayText',
            default: 'display text',
            description: 'py32.displayText'
        }),
        arguments: {
            
        }
      },

      {
        blockType: BlockType.LABEL,
        text: formatMessage({
            id: 'py32.proteus',
            default: 'proteus',
            description: 'py32.proteus'
        }),
    },

    {
        opcode: 'createProteus',//设置数字引脚输出为高低电平
        blockType: BlockType.COMMAND,
        // blockIconURI:icon,
        text: formatMessage({
            id: 'py32.createProteus',
            default: 'create proteus CLK (PA14) DIO (PA13)',
            description: 'py32.createProteus'
        }),
        arguments: {
            
        }
    },
    {
        opcode: 'setBrightness',//设置数字引脚输出为高低电平
        blockType: BlockType.COMMAND,
        // blockIconURI:icon,
        text: formatMessage({
            id: 'py32.setBrightness',
            default: 'set Brightness [NUM]',
            description: 'py32.setBrightness'
        }),
        arguments: {
            NUM: {
                type: ArgumentType.NUMBER,
                defaultValue:'7'
            }
        }
    },

    {
        opcode: 'showNumber',//设置数字引脚输出为高低电平
        blockType: BlockType.COMMAND,
        // blockIconURI:icon,
        text: formatMessage({
            id: 'py32.showNumber',
            default: 'show number [NUM]',
            description: 'py32.showNumber'
        }),
        arguments: {
            NUM: {
                type: ArgumentType.NUMBER,
                defaultValue:'1234'
            }
        }
    },


      ],
      menus: {
        PIN: { // 数字引脚
            acceptReporters: false,
            items: [
                { text: "PA1", value: "PA1" },
                { text: "PA2", value: "PA2" },
                { text: "PA3", value: "PA3" },
                { text: "PA4", value: "PA4" },
                { text: "PA5", value: "PA5" },
                { text: "PA6", value: "PA6" },
                { text: "PA7", value: "PA7" },
                { text: "PA8", value: "PA8" },
                { text: "PA11", value: "PA11" },
                { text: "PA12", value: "PA12" },
                { text: "PA13", value: "PA13" },
                { text: "PA14", value: "PA14" },
                { text: "PA15", value: "PA15" },
        
                { text: "PB0", value: "PB0" },
                { text: "PB1", value: "PB1" },
                { text: "PB2", value: "PB2" },
                { text: "PB3", value: "PB3" },
                { text: "PB4", value: "PB4" },
                { text: "PB5", value: "PB5" },
                { text: "PB6", value: "PB6" },
                { text: "PB7", value: "PB7" },
                { text: "PB8", value: "PB8" },
        
                { text: "PF2", value: "PF2" },
                { text: "PF3", value: "PF3" },
                { text: "PF4", value: "PF4" },
            ]
        },
        HIGHLOW: {//高低电平*
            acceptReporters: false,
            items: [
                {
                    text: formatMessage({
                        id: 'py32.setDigital.HIGHLOW.high',
                        default: 'high',
                        description: 'py32.setDigital.HIGHLOW.high'
                    }),
                    value: 'HIGH' 
                },
                { 
                    text: formatMessage({
                        id: 'py32.setDigital.HIGHLOW.low',
                        default: 'low',
                        description: 'py32.setDigital.HIGHLOW.low'
                    }),
                    value: 'LOW'
                }
            ]
        },
        IN_OUT: {//输入输出*
          acceptReporters: false,
          items: [
              {
                  text: formatMessage({
                      id: 'py32.setIoMode.IN_OUT.output',
                      default: 'OUTPUT',
                      description: 'robotpin.setIoMode.IN_OUT.output'
                  }),
                  value: 'OUTPUT' 
              },
              { 
                  text: formatMessage({
                      id: 'py32.setIoMode.IN_OUT.input',
                      default: 'INPUT',
                      description: 'py32.setIoMode.IN_OUT.input'
                  }),
                  value: 'INPUT'
              }
          ]
      },
      COLOR: {//颜色
            acceptReporters: false,
            items: [
                {
                    text: formatMessage({
                        id: 'py32.setIoMode.COLOR.white',
                        default: 'white',
                        description: 'robotpin.setIoMode.COLOR.white'
                    }),
                    value: 'WHITE' 
                },
                { 
                    text: formatMessage({
                        id: 'py32.setIoMode.COLOR.black',
                        default: 'black',
                        description: 'py32.setIoMode.COLOR.black'
                    }),
                    value: 'BLACK'
                }
            ]
        },
        SDA: {//SDA
            acceptReporters: false,
            items: [
                { text: "PA7", value: "PA7" },
                { text: "PA9", value: "PA9" },
                { text: "PA10", value: "PA10" },
                { text: "PA12", value: "PA12" },
                { text: "PB7", value: "PB7" },
                { text: "PB8", value: "PB8" },
            ]
        },
        SCL: {//SCL
            acceptReporters: false,
            items: [
                { text: "PA8", value: "PA8" },
                { text: "PA9", value: "PA9" },
                { text: "PA10", value: "PA10" },
                { text: "PA11", value: "PA11" },
                { text: "PB8", value: "PB8" },
            ]
        },
      }
    };
  }

    setIoMode() {
        return;
    }

    setDigital() {
        return;
    }

    setAnalog() {
        return;
    }

    digitalRead() {
        return;
    }

    analogRead() {
        return;
    }

    setBaudrate() {
        return;
    }

    serialAny() {
        return;
    }

    serialRead() {
        return;
    }

    serialPrint() {
        return;
    }

    createOled() {
        return;
    }

    initOled() {
        return;
    }

    clearOled() {
        return;
    }

    setColor() {
        return;
    }

    setTextSize() {
        return;
    }

    setTextPlace() {
        return;
    }

    setTextCon() {
        return;
    }

    displayText() {
        return;
    }

    createProteus() {
        return;
    }

    setBrightness() {
        return;
    }

    showNumber() {
        return;
    }
}


module.exports = Py32;
