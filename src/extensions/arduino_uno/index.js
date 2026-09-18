const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type')
const socket=require('../../util/localSocket')
const formatMessage = require('format-message');
const currentMode = require('../../util/mode')
const motorD=require('../../util/img/max_module_motor_d.svg')
let motor=[8,1]
class ArduinoUno {

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
      id: 'arduinouno',
      name: formatMessage({
            id: 'arduinouno.name',
            default: 'Arduino Uno',
            description: 'arduinouno.name'
        }),
      color1: '#ff00ff',
      blocks: [

        {
            blockType: BlockType.LABEL,
            text: formatMessage({
                id: 'arduinouno.io',
                default: 'IO',
                description: 'arduinouno.io'
            }),
        },
        {
          opcode: 'setIoMode',//设置引脚模式
          blockType: BlockType.COMMAND,
          // blockIconURI:icon,
          text: formatMessage({
              id: 'arduinouno.setIoMode',
              default: 'pin mode [PIN] [CHOICE]',
              description: 'arduinouno.setIoMode'
          }),
          arguments: {
              PIN: {
                  type: ArgumentType.STRING,
                  menu: 'PIN',
                  defaultValue:'1'
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
            id: 'arduinouno.setDigital',
            default: 'set digital pin [PIN] output as [CHOICE]',
            description: 'arduinouno.setDigital'
        }),
        arguments: {
            PIN: {
                type: ArgumentType.STRING,
                menu: 'PIN',
                defaultValue:'1'
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
          id: 'arduinouno.setAnalog',
          default: 'set analog pin [PIN] output as [CHOICE]',
          description: 'arduinouno.setAnalog'
      }),
      arguments: {
          PIN: {
              type: ArgumentType.STRING,
              menu: 'PIN',
              defaultValue:'1'
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
          id: 'arduinouno.digitalRead',
          default: 'digital read [PIN]',
          description: 'arduinouno.digitalRead'
      }),
      arguments: {
          PIN: {
              type: ArgumentType.STRING,
              menu: 'PIN',
              defaultValue:'1'
          }
      },
      disableMonitor: true
    },

    {
      opcode: 'analogRead',//设置数字引脚输出为高低电平
      blockType: BlockType.REPORTER,
      // blockIconURI:icon,
      text: formatMessage({
          id: 'arduinouno.analogRead',
          default: 'analog read [PIN]',
          description: 'arduinouno.analogRead'
      }),
      arguments: {
          PIN: {
              type: ArgumentType.STRING,
              menu: 'PIN',
              defaultValue:'1'
          }
      },
      disableMonitor: true
    },

    {
        blockType: BlockType.LABEL,
        text: formatMessage({
            id: 'arduinouno.serial',
            default: 'Serial',
            description: 'arduinouno.serial'
        }),
    },

    {
      opcode: 'setBaudrate',//设置数字引脚输出为高低电平
      blockType: BlockType.COMMAND,
      // blockIconURI:icon,
      text: formatMessage({
          id: 'arduinouno.setBaudrate',
          default: 'serial set baudrate [BAUD]',
          description: 'arduinouno.setBaudrate'
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
          id: 'arduinouno.serialAny',
          default: 'serial Any?',
          description: 'arduinouno.serialAny'
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
          id: 'arduinouno.serialRead',
          default: 'serial read data',
          description: 'arduinouno.serialRead'
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
          id: 'arduinouno.serialPrint',
          default: 'serial print [TEXT]',
          description: 'arduinouno.serialPrint'
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
            id: 'arduinouno.oled',
            default: 'OLED',
            description: 'arduinouno.oled'
        }),
    },

    {
        opcode: 'createOled',//设置数字引脚输出为高低电平
        blockType: BlockType.COMMAND,
        // blockIconURI:icon,
        text: formatMessage({
            id: 'arduinouno.createOled',
            default: 'create oled width: [WIDTH]  height:[HEIGHT]',
            description: 'arduinouno.createOled'
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
            id: 'arduinouno.initOled',
            default: 'init oled address: [ADDR]',
            description: 'arduinouno.initOled'
        }),
        arguments: {
            ADDR: {
                type: ArgumentType.STRING,
                defaultValue:'0X3C'
            }
        }
      },
      {
        opcode: 'clearOled',//设置数字引脚输出为高低电平
        blockType: BlockType.COMMAND,
        // blockIconURI:icon,
        text: formatMessage({
            id: 'arduinouno.clearOled',
            default: 'clear oled',
            description: 'arduinouno.clearOled'
        }),
        arguments: {
            
        }
      },

      {
        opcode: 'setColor',//设置数字引脚输出为高低电平
        blockType: BlockType.COMMAND,
        // blockIconURI:icon,
        text: formatMessage({
            id: 'arduinouno.setColor',
            default: 'set text color [COLOR]',
            description: 'arduinouno.setColor'
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
            id: 'arduinouno.setTextSize',
            default: 'set text size [SIZE]',
            description: 'arduinouno.setTextSize'
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
            id: 'arduinouno.setTextPlace',
            default: 'set text x [X] y [Y]',
            description: 'arduinouno.setTextPlace'
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
            id: 'arduinouno.setTextCon',
            default: 'set text [TEXT]',
            description: 'arduinouno.setTextCon'
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
            id: 'arduinouno.displayText',
            default: 'display text',
            description: 'arduinouno.displayText'
        }),
        arguments: {
            
        }
      },

      {
        blockType: BlockType.LABEL,
        text: formatMessage({
            id: 'arduinouno.proteus',
            default: 'proteus',
            description: 'arduinouno.proteus'
        }),
    },

    {
        opcode: 'createProteus',//设置数字引脚输出为高低电平
        blockType: BlockType.COMMAND,
        // blockIconURI:icon,
        text: formatMessage({
            id: 'arduinouno.createProteus',
            default: 'create proteus CLK (D2) DIO (D3)',
            description: 'arduinouno.createProteus'
        }),
        arguments: {
            
        }
    },
    {
        opcode: 'setBrightness',//设置数字引脚输出为高低电平
        blockType: BlockType.COMMAND,
        // blockIconURI:icon,
        text: formatMessage({
            id: 'arduinouno.setBrightness',
            default: 'set Brightness [NUM]',
            description: 'arduinouno.setBrightness'
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
            id: 'arduinouno.showNumber',
            default: 'show number [NUM]',
            description: 'arduinouno.showNumber'
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
              { text: "P1", value: "1" },
              { text: "P2", value: "2" },
              { text: "P3", value: "3" },
              { text: "P4", value: "4" },
              { text: "P5", value: "5" },
              { text: "P6", value: "6" },
              { text: "P7", value: "7" },
              { text: "P8", value: "8" },
              { text: "P9", value: "9" },
              { text: "P10", value: "10" },
              { text: "P11", value: "11" },
              { text: "P12", value: "12" },
              { text: "P13", value: "13" },
      
              { text: "A0", value: "A0" },
              { text: "A1", value: "A1" },
              { text: "A2", value: "A2" },
              { text: "A3", value: "A3" },
              { text: "A4", value: "A4" },
              { text: "A5", value: "A5" }
          ]
      },
        HIGHLOW: {//高低电平*
            acceptReporters: false,
            items: [
                {
                    text: formatMessage({
                        id: 'arduinouno.setDigital.HIGHLOW.high',
                        default: 'high',
                        description: 'arduinouno.setDigital.HIGHLOW.high'
                    }),
                    value: 'HIGH' 
                },
                { 
                    text: formatMessage({
                        id: 'arduinouno.setDigital.HIGHLOW.low',
                        default: 'low',
                        description: 'arduinouno.setDigital.HIGHLOW.low'
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
                      id: 'arduinouno.setIoMode.IN_OUT.output',
                      default: 'OUTPUT',
                      description: 'robotpin.setIoMode.IN_OUT.output'
                  }),
                  value: 'OUTPUT' 
              },
              { 
                  text: formatMessage({
                      id: 'arduinouno.setIoMode.IN_OUT.input',
                      default: 'INPUT',
                      description: 'arduinouno.setIoMode.IN_OUT.input'
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
                        id: 'arduinouno.setIoMode.COLOR.white',
                        default: 'white',
                        description: 'robotpin.setIoMode.COLOR.white'
                    }),
                    value: 'WHITE' 
                },
                { 
                    text: formatMessage({
                        id: 'arduinouno.setIoMode.COLOR.black',
                        default: 'black',
                        description: 'arduinouno.setIoMode.COLOR.black'
                    }),
                    value: 'BLACK'
                }
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


module.exports = ArduinoUno;
