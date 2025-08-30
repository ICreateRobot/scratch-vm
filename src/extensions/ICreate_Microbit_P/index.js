const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const codeModule = require('../../../../../../../utils/global');
const { getCode, setCode } = codeModule.default;
const formatMessage = require('format-message');
 
class MicrobiteIcreateP {
    getInfo() {
      return {
        id: 'MicrobiteIcreateP',
        name: formatMessage({
            id: 'MicrobiteIcreateP.name',
            default: 'Micro:bit V2 Peripheral',
            description: 'MicrobiteIcreateP.name'
        }), 

        //模块 
        // blocks: [
        // //   {
        // //     func: 'ICM_openWEBUSB',//扫描设备
        // //     blockType: BlockType.BUTTON,
        // //     text: '连接'
        // //   },
        // //   {
        // //     func: 'ICM_burn',//烧录固件
        // //     blockType: BlockType.BUTTON,
        // //     text: '烧录IC固件'
        // //   },
        // //   {
        // //     func: 'ICM_REPL',//进入repl
        // //     blockType: BlockType.BUTTON,
        // //     text: 'repl模式'
        // //   },
        // //   {
        // //     func: 'ICM_FLASH',//进入烧录
        // //     blockType: BlockType.BUTTON,
        // //     text: '烧录模式'
        // //   },
        // //   {
        // //     func: 'ICM_Download',//下载
        // //     blockType: BlockType.BUTTON,
        // //     text: '下载程序'
        // //   },
        //   {
        //     blockType: BlockType.LABEL,
        //     text: "传感器",
        //   },
        //   {
        //     opcode: 'ICM_LongRangePhotoelectric',//远距离光电传感器
        //     blockType: BlockType.REPORTER,
        //     text: '远距离光电传感器[CHOICE]',
        //     disableMonitor: true,
        //     arguments: {
        //         CHOICE: {
        //             type: ArgumentType.STRING,
        //             menu: 'choice_LongRangePhotoelectricPin'
        //         }
        //     }
        //   },
        //   {
        //     opcode: 'ICM_Potentiometer',//电位器
        //     blockType: BlockType.REPORTER,
        //     text: '电位器[CHOICE]',
        //     disableMonitor: true,
        //     arguments: {
        //         CHOICE: {
        //             type: ArgumentType.STRING,
        //             menu: 'choice_PotentiometerPin'
        //         }
        //     }
        //   },
        //   {
        //     opcode: 'ICM_GrayLevel',//灰度传感器
        //     blockType: BlockType.REPORTER,
        //     text: '灰度传感器[CHOICE]',
        //     disableMonitor: true,
        //     arguments: {
        //         CHOICE: {
        //             type: ArgumentType.STRING,
        //             menu: 'choice_PotentiometerPin'
        //         }
        //     }
        //   },
        //   {
        //     opcode: 'ICM_LightIntensity',//光敏传感器
        //     blockType: BlockType.REPORTER,
        //     text: '光敏传感器[CHOICE]',
        //     disableMonitor: true,
        //     arguments: {
        //         CHOICE: {
        //             type: ArgumentType.STRING,
        //             menu: 'choice_PotentiometerPin'
        //         }
        //     }
        //   },
        //   {
        //     opcode: 'ICM_Flame',//火焰传感器
        //     blockType: BlockType.REPORTER,
        //     text: '火焰传感器[CHOICE]',
        //     disableMonitor: true,
        //     arguments: {
        //         CHOICE: {
        //             type: ArgumentType.STRING,
        //             menu: 'choice_PotentiometerPin'
        //         }
        //     }
        //   },
        //   {
        //     opcode: 'ICM_WaterLevel',//水位传感器
        //     blockType: BlockType.REPORTER,
        //     text: '水位传感器[CHOICE]',
        //     disableMonitor: true,
        //     arguments: {
        //         CHOICE: {
        //             type: ArgumentType.STRING,
        //             menu: 'choice_PotentiometerPin'
        //         }
        //     }
        //   },
        //   {
        //     opcode: 'ICM_GasConcentration',//可燃气体传感器
        //     blockType: BlockType.REPORTER,
        //     text: '可燃气体传感器[CHOICE]',
        //     disableMonitor: true,
        //     arguments: {
        //         CHOICE: {
        //             type: ArgumentType.STRING,
        //             menu: 'choice_PotentiometerPin'
        //         }
        //     }
        //   },
        //   {
        //     opcode: 'ICM_SoilHumidity',//土壤湿度传感器
        //     blockType: BlockType.REPORTER,
        //     text: '土壤湿度传感器[CHOICE]',
        //     disableMonitor: true,
        //     arguments: {
        //         CHOICE: {
        //             type: ArgumentType.STRING,
        //             menu: 'choice_PotentiometerPin'
        //         }
        //     }
        //   },
        //   {
        //     opcode: 'ICM_WaterTemp',//防水温度传感器
        //     blockType: BlockType.REPORTER,
        //     text: '防水温度传感器[CHOICE]',
        //     disableMonitor: true,
        //     arguments: {
        //         CHOICE: {
        //             type: ArgumentType.STRING,
        //             menu: 'choice_PotentiometerPin'
        //         }
        //     }
        //   },
        //   {
        //     opcode: 'ICM_hState',//霍尔传感器
        //     blockType: BlockType.REPORTER,
        //     text: '霍尔传感器[CHOICE]',
        //     disableMonitor: true,
        //     arguments: {
        //         CHOICE: {
        //             type: ArgumentType.STRING,
        //             menu: 'choice_PotentiometerPin'
        //         }
        //     }
        //   },
        //   {
        //     opcode: 'ICM_Button',//按钮传感器
        //     blockType: BlockType.REPORTER,
        //     text: '按钮传感器[CHOICE]',
        //     disableMonitor: true,
        //     arguments: {
        //         CHOICE: {
        //             type: ArgumentType.STRING,
        //             menu: 'choice_LEDPin'
        //         }
        //     }
        //   },
        //   {
        //     opcode: 'ICM_UltrasonicWave',//超声波传感器
        //     blockType: BlockType.REPORTER,
        //     text: '超声波传感器[CHOICE1]单位cm',
        //     disableMonitor: true,
        //     arguments: {
        //         CHOICE1: {
        //             type: ArgumentType.STRING,
        //             menu: 'choice_UltrasonicWavePin'
        //         },
        //         // CHOICE2: {
        //         //     type: ArgumentType.STRING,
        //         //     menu: 'choice_UltrasonicWaveUnit'
        //         // }
        //     }
        //   },
        //   {
        //     opcode: 'ICM_RockerType',//检测到摇杆
        //     blockType: BlockType.BOOLEAN,
        //     text: '检测到摇杆[CHOICE]',
        //     disableMonitor: true,
        //     arguments: {
        //         CHOICE: {
        //             type: ArgumentType.STRING,
        //             menu: 'choice_RockerType'
        //         }
        //     }
        //   },
        //   {
        //     opcode: 'ICM_Rocker',//摇杆
        //     blockType: BlockType.REPORTER,
        //     text: '摇杆[CHOICE]方向',
        //     disableMonitor: true,
        //     arguments: {
        //         CHOICE: {
        //             type: ArgumentType.STRING,
        //             menu: 'choice_RockerXY'
        //         }
        //     }
        //   },

        //   {
        //     blockType: BlockType.LABEL,
        //     text: "动作",
        //   },
        //   {
        //     opcode: 'ICM_server',//舵机
        //     blockType: BlockType.COMMAND,
        //     text: '舵机[CHOICE]角度[TEXT]',
        //     arguments: {
        //         CHOICE: {
        //             type: ArgumentType.STRING,
        //             menu: 'choice_serverPin'
        //         },
        //         TEXT: {
        //             type: ArgumentType.NUMRES0_300,
        //             defaultValue: 0
        //         }
        //     }
        //   },
        //   {
        //     opcode: 'ICM_DCmotor',//电机
        //     blockType: BlockType.COMMAND,
        //     text: '电机[CHOICE]速度[TEXT]',
        //     arguments: {
        //         CHOICE: {
        //             type: ArgumentType.STRING,
        //             menu: 'choice_DCmotor'
        //         },
        //         TEXT: {
        //             type: ArgumentType.NUMRES_255_255,
        //             defaultValue: 100
        //         }
        //     }
        //   },
        //   {
        //     opcode: 'ICM_Fan',//风扇
        //     blockType: BlockType.COMMAND,
        //     text: '风扇[CHOICE1]切换至[CHOICE2]',
        //     arguments: {
        //         CHOICE1: {
        //             type: ArgumentType.STRING,
        //             menu: 'choice_FanPin'
        //         },
        //         CHOICE2: {
        //             type: ArgumentType.NUMBER,
        //             menu: 'choice_LEDOff'
        //         }
        //     }
        //   },
        //   {
        //     opcode: 'ICM_Elecmagnet',//电磁铁
        //     blockType: BlockType.COMMAND,
        //     text: '电磁铁[CHOICE1]切换至[CHOICE2]',
        //     arguments: {
        //         CHOICE1: {
        //             type: ArgumentType.STRING,
        //             menu: 'choice_LEDPin'
        //         },
        //         CHOICE2: {
        //             type: ArgumentType.NUMBER,
        //             menu: 'choice_LEDOff'
        //         }
        //     }
        //   },
        //   "---",
        //   {
        //     opcode: 'ICM_ICmotor_readPos',//读取位置
        //     blockType: BlockType.REPORTER,
        //     text: '读取[CHOICE]电机位置',
        //     disableMonitor: true,
        //     arguments: {
        //         CHOICE: {
        //             type: ArgumentType.STRING,
        //             menu: 'choice_ICmotorPin'
        //         }
        //     }
        //   },
        // //   {
        // //     opcode: 'ICM_ICmotor_readSpeed',//读取速度
        // //     blockType: BlockType.REPORTER,
        // //     text: '读取[CHOICE]电机速度',
        // //     arguments: {
        // //         CHOICE: {
        // //             type: ArgumentType.STRING,
        // //             menu: 'choice_ICmotorPin'
        // //         }
        // //     }
        // //   },
        //   {
        //     opcode: 'ICM_ICmotor_setDoubleMotor',//设置双电机地址
        //     blockType: BlockType.COMMAND,
        //     text: '左电机设置为[CHOICE1] 右电机设置为[CHOICE2]',
        //     arguments: {
        //         CHOICE1: {
        //             type: ArgumentType.STRING,
        //             menu: 'choice_ICmotorPin'
        //         },
        //         CHOICE2: {
        //             type: ArgumentType.STRING,
        //             menu: 'choice_ICmotorPin'
        //         }
        //     }
        //   },
        //   {
        //     opcode: 'ICM_ICmotor_DoubleRunSecond',//双电机转秒
        //     blockType: BlockType.COMMAND,
        //     text: '双电机以[TEXT1][TEXT2]速度转[TEXT3]秒',
        //     arguments: {
        //         TEXT1: {
        //             type: ArgumentType.NUMRES_100_100,
        //             defaultValue: 50
        //         },
        //         TEXT2: {
        //             type: ArgumentType.NUMRES_100_100,
        //             defaultValue: 50
        //         },
        //         TEXT3: {
        //             type: ArgumentType.NUMRES0_65535,
        //             defaultValue: 0
        //         }
        //     }
        //   },
        //   {
        //     opcode: 'ICM_ICmotor_DoubleRunDegree',//双电机转度
        //     blockType: BlockType.COMMAND,
        //     text: '双电机以[TEXT1][TEXT2]速度转[TEXT3]度',
        //     arguments: {
        //         TEXT1: {
        //             type: ArgumentType.NUMRES_100_100,
        //             defaultValue: 50
        //         },
        //         TEXT2: {
        //             type: ArgumentType.NUMRES_100_100,
        //             defaultValue: 50
        //         },
        //         TEXT3: {
        //             type: ArgumentType.NUMRES_32400_32400,
        //             defaultValue: 0
        //         }
        //     }
        //   },
        //   {
        //     opcode: 'ICM_ICmotor_DoubleRun',//双电机转
        //     blockType: BlockType.COMMAND,
        //     text: '双电机以[TEXT1][TEXT2]速度转动',
        //     arguments: {
        //         TEXT1: {
        //             type: ArgumentType.NUMRES_100_100,
        //             defaultValue: 50
        //         },
        //         TEXT2: {
        //             type: ArgumentType.NUMRES_100_100,
        //             defaultValue: 50
        //         }
        //     }
        //   },
        //   {
        //     opcode: 'ICM_ICmotor_RunDegree',//单电机转度
        //     blockType: BlockType.COMMAND,
        //     text: '[CHOICE]电机以[TEXT1]速度转[TEXT3]度',
        //     arguments: {
        //         CHOICE: {
        //             type: ArgumentType.STRING,
        //             menu: 'choice_ICmotorPin'
        //         },
        //         TEXT1: {
        //             type: ArgumentType.NUMRES0_100,
        //             defaultValue: 0
        //         },
        //         TEXT3: {
        //             type: ArgumentType.NUMRES_32400_32400,
        //             defaultValue: 0
        //         }
        //     }
        //   },
        //   {
        //     opcode: 'ICM_ICmotor_RunSecond',//单电机转秒
        //     blockType: BlockType.COMMAND,
        //     text: '[CHOICE]电机以[TEXT1]速度转[TEXT3]秒',
        //     arguments: {
        //         CHOICE: {
        //             type: ArgumentType.STRING,
        //             menu: 'choice_ICmotorPin'
        //         },
        //         TEXT1: {
        //             type: ArgumentType.NUMRES0_100,
        //             defaultValue: 0
        //         },
        //         TEXT3: {
        //             type: ArgumentType.NUMRES0_65535,
        //             defaultValue: 0
        //         }
        //     }
        //   },
        //   {
        //     opcode: 'ICM_ICmotor_RunPos',//单电机转到指定位置
        //     blockType: BlockType.COMMAND,
        //     text: '[CHOICE]电机以[TEXT1]速度转到[TEXT3]的位置',
        //     arguments: {
        //         CHOICE: {
        //             type: ArgumentType.STRING,
        //             menu: 'choice_ICmotorPin'
        //         },
        //         TEXT1: {
        //             type: ArgumentType.NUMRES0_100,
        //             defaultValue: 0
        //         },
        //         TEXT3: {
        //             type: ArgumentType.NUMRES_360_360,
        //             defaultValue: 0
        //         }
        //     }
        //   },
        //   {
        //     opcode: 'ICM_ICmotor_Run',//单电机转
        //     blockType: BlockType.COMMAND,
        //     text: '[CHOICE]电机以[TEXT]速度转动',
        //     arguments: {
        //         CHOICE: {
        //             type: ArgumentType.STRING,
        //             menu: 'choice_ICmotorPin'
        //         },
        //         TEXT: {
        //             type: ArgumentType.NUMRES_100_100,
        //             defaultValue: 0
        //         }
        //     }
        //   },

        //   {
        //     blockType: BlockType.LABEL,
        //     text: "声光",
        //   },
        //   {
        //     opcode: 'ICM_yellowLED',//黄色LED
        //     blockType: BlockType.COMMAND,
        //     text: 'LED[CHOICE1]切换到[CHOICE2]',
        //     arguments: {
        //         CHOICE1: {
        //             type: ArgumentType.STRING,
        //             menu: 'choice_LEDPin'
        //         },
        //         CHOICE2: {
        //             type: ArgumentType.STRING,
        //             menu: 'choice_LEDOff'
        //         }
        //     }
        //   },
        //   "---",
        //   {
        //     opcode: 'ICM_setLRLight',//设置灯环亮度
        //     blockType: BlockType.COMMAND,
        //     text: '灯环[CHOICE]设置 亮度[TEXT2]',
        //     arguments: {
        //         CHOICE: {
        //             type: ArgumentType.STRING,
        //             menu: 'choice_LEDPin'
        //         },
        //         TEXT2: {
        //             type: ArgumentType.NUMRES0_255,
        //             defaultValue: 255
        //         }
        //     }
        //   },
        // //   {
        // //     opcode: 'ICM_createColor',//红：绿：蓝
        // //     blockType: BlockType.REPORTER,
        // //     text: '红[TEXT1] 绿[TEXT2] 蓝[TEXT3]',
        // //     arguments: {
        // //         TEXT1: {
        // //             type: ArgumentType.NUMRES0_255,
        // //             defaultValue: 255
        // //         },
        // //         TEXT2: {
        // //             type: ArgumentType.NUMRES0_255,
        // //             defaultValue: 255
        // //         },
        // //         TEXT3: {
        // //             type: ArgumentType.NUMRES0_255,
        // //             defaultValue: 255
        // //         },
        // //     }
        // //   },
        //   {
        //     opcode: 'ICM_LRColor',//灯环显示颜色
        //     blockType: BlockType.COMMAND,
        //     text: '灯环[CHOICE1]显示 颜色[LRColorD]',
        //     arguments: {
        //         CHOICE1: {
        //             type: ArgumentType.STRING,
        //             menu: 'choice_LEDPin'
        //         },
        //         LRColorD: {
        //             type: ArgumentType.STRING,
        //             menu: 'choice_LightRingColor'
        //         }
        //     }
        //   },
        //   "---",
        //   {
        //     opcode: 'ICM_OLEDini',//初始化OLED
        //     blockType: BlockType.COMMAND,
        //     text: '初始化 OLED'
        //   },
        //   {
        //     opcode: 'ICM_OLEDshow',//显示文本在
        //     blockType: BlockType.COMMAND,
        //     text: '显示文本[TEXT]在 X[X] Y[Y] 颜色模式[COLOR]',
        //     arguments: {
        //         TEXT: {
        //             type: ArgumentType.STRING,
        //             defaultValue: 'hello'
        //         },
        //         X: {
        //             type: ArgumentType.NUMBER,
        //             menu: 0
        //         },
        //         Y: {
        //             type: ArgumentType.NUMBER,
        //             menu: 0
        //         },
        //         COLOR: {
        //             type: ArgumentType.STRING,
        //             menu: 'choice_OLEDColor'
        //         }
        //     }
        //   },
        //   {
        //     opcode: 'ICM_OLEDclear',//清除OLED
        //     blockType: BlockType.COMMAND,
        //     text: '清除 OLED'
        //   },
        //   "---",
        //   {
        //     opcode: 'ICM_Laser',//激光模块
        //     blockType: BlockType.COMMAND,
        //     text: '激光[CHOICE1]切换到[CHOICE2]',
        //     arguments: {
        //         CHOICE1: {
        //             type: ArgumentType.STRING,
        //             menu: 'choice_LEDPin'
        //         },
        //         CHOICE2: {
        //             type: ArgumentType.STRING,
        //             menu: 'choice_LEDOff'
        //         }
        //     }
        //   },

        //   "---",
        //   {
        //     opcode: 'ICM_Recording',//录音模块
        //     blockType: BlockType.COMMAND,
        //     text: '录音模块-播放[CHOICE]',
        //     arguments: {
        //         CHOICE: {
        //             type: ArgumentType.STRING,
        //             menu: 'choice_Recording'
        //         }
        //     }
        //   },
          
        // ],
        blocks: [
            //   {
            //     func: 'ICM_openWEBUSB',
            //     blockType: BlockType.BUTTON,
            //     text: formatMessage({
            //       id: 'MicrobiteIcreateP.ICM.openWEBUSB',
            //       default: '连接',
            //       description: 'MicrobiteIcreateP.ICM.openWEBUSB'
            //     })
            //   },
            //   {
            //     func: 'ICM_burn',
            //     blockType: BlockType.BUTTON,
            //     text: formatMessage({
            //       id: 'MicrobiteIcreateP.ICM.burn',
            //       default: '烧录IC固件',
            //       description: 'MicrobiteIcreateP.ICM.burn'
            //     })
            //   },
            //   {
            //     func: 'ICM_REPL',
            //     blockType: BlockType.BUTTON,
            //     text: formatMessage({
            //       id: 'MicrobiteIcreateP.ICM.REPL',
            //       default: 'repl模式',
            //       description: 'MicrobiteIcreateP.ICM.REPL'
            //     })
            //   },
            //   {
            //     func: 'ICM_FLASH',
            //     blockType: BlockType.BUTTON,
            //     text: formatMessage({
            //       id: 'MicrobiteIcreateP.ICM.FLASH',
            //       default: '烧录模式',
            //       description: 'MicrobiteIcreateP.ICM.FLASH'
            //     })
            //   },
            //   {
            //     func: 'ICM_Download',
            //     blockType: BlockType.BUTTON,
            //     text: formatMessage({
            //       id: 'MicrobiteIcreateP.ICM.Download',
            //       default: '下载程序',
            //       description: 'MicrobiteIcreateP.ICM.Download'
            //     })
            //   },
            {
                blockType: BlockType.LABEL,
                text: formatMessage({
                id: 'MicrobiteIcreateP.ICM.labelSensor',
                default: 'Sensor',
                description: 'MicrobiteIcreateP.ICM.labelSensor'
                })
            },
            {
                opcode: 'ICM_LongRangePhotoelectric',
                blockType: BlockType.REPORTER,
                text: formatMessage({
                id: 'MicrobiteIcreateP.ICM.ICM_LongRangePhotoelectric',
                default: 'Long Range Photoelectric Sensor [CHOICE]',
                description: 'MicrobiteIcreateP.ICM.ICM_LongRangePhotoelectric'
                }),
                disableMonitor: true,
                arguments: {
                CHOICE: {
                    type: ArgumentType.STRING,
                    menu: 'choice_LongRangePhotoelectricPin'
                }
                }
            },
            {
                opcode: 'ICM_Potentiometer',
                blockType: BlockType.REPORTER,
                text: formatMessage({
                id: 'MicrobiteIcreateP.ICM.ICM_Potentiometer',
                default: 'Potentiometer [CHOICE]',
                description: 'MicrobiteIcreateP.ICM.ICM_Potentiometer'
                }),
                disableMonitor: true,
                arguments: {
                CHOICE: {
                    type: ArgumentType.STRING,
                    menu: 'choice_PotentiometerPin'
                }
                }
            },
            {
                opcode: 'ICM_GrayLevel',
                blockType: BlockType.REPORTER,
                text: formatMessage({
                id: 'MicrobiteIcreateP.ICM.ICM_GrayLevel',
                default: 'Gray Level Sensor [CHOICE]',
                description: 'MicrobiteIcreateP.ICM.ICM_GrayLevel'
                }),
                disableMonitor: true,
                arguments: {
                CHOICE: {
                    type: ArgumentType.STRING,
                    menu: 'choice_PotentiometerPin'
                }
                }
            },
            {
                opcode: 'ICM_LightIntensity',
                blockType: BlockType.REPORTER,
                text: formatMessage({
                id: 'MicrobiteIcreateP.ICM.ICM_LightIntensity',
                default: 'Light Intensity Sensor [CHOICE]',
                description: 'MicrobiteIcreateP.ICM.ICM_LightIntensity'
                }),
                disableMonitor: true,
                arguments: {
                CHOICE: {
                    type: ArgumentType.STRING,
                    menu: 'choice_PotentiometerPin'
                }
                }
            },
            {
                opcode: 'ICM_Flame',
                blockType: BlockType.REPORTER,
                text: formatMessage({
                id: 'MicrobiteIcreateP.ICM.ICM_Flame',
                default: 'Flame Sensor [CHOICE]',
                description: 'MicrobiteIcreateP.ICM.ICM_Flame'
                }),
                disableMonitor: true,
                arguments: {
                CHOICE: {
                    type: ArgumentType.STRING,
                    menu: 'choice_PotentiometerPin'
                }
                }
            },
            {
                opcode: 'ICM_WaterLevel',
                blockType: BlockType.REPORTER,
                text: formatMessage({
                id: 'MicrobiteIcreateP.ICM.ICM_WaterLevel',
                default: 'Water Level Sensor [CHOICE]',
                description: 'MicrobiteIcreateP.ICM.ICM_WaterLevel'
                }),
                disableMonitor: true,
                arguments: {
                CHOICE: {
                    type: ArgumentType.STRING,
                    menu: 'choice_PotentiometerPin'
                }
                }
            },
            {
                opcode: 'ICM_GasConcentration',
                blockType: BlockType.REPORTER,
                text: formatMessage({
                id: 'MicrobiteIcreateP.ICM.ICM_GasConcentration',
                default: 'Combustible Gas Sensor [CHOICE]',
                description: 'MicrobiteIcreateP.ICM.ICM_GasConcentration'
                }),
                disableMonitor: true,
                arguments: {
                CHOICE: {
                    type: ArgumentType.STRING,
                    menu: 'choice_PotentiometerPin'
                }
                }
            },
            {
                opcode: 'ICM_SoilHumidity',
                blockType: BlockType.REPORTER,
                text: formatMessage({
                id: 'MicrobiteIcreateP.ICM.ICM_SoilHumidity',
                default: 'Soil Humidity Sensor [CHOICE]',
                description: 'MicrobiteIcreateP.ICM.ICM_SoilHumidity'
                }),
                disableMonitor: true,
                arguments: {
                CHOICE: {
                    type: ArgumentType.STRING,
                    menu: 'choice_PotentiometerPin'
                }
                }
            },
            {
                opcode: 'ICM_WaterTemp',
                blockType: BlockType.REPORTER,
                text: formatMessage({
                id: 'MicrobiteIcreateP.ICM.ICM_WaterTemp',
                default: 'Waterproof Temperature Sensor [CHOICE]',
                description: 'MicrobiteIcreateP.ICM.ICM_WaterTemp'
                }),
                disableMonitor: true,
                arguments: {
                CHOICE: {
                    type: ArgumentType.STRING,
                    menu: 'choice_PotentiometerPin'
                }
                }
            },
            {
                opcode: 'ICM_hState',
                blockType: BlockType.REPORTER,
                text: formatMessage({
                id: 'MicrobiteIcreateP.ICM.ICM_hState',
                default: 'Hall Sensor [CHOICE]',
                description: 'MicrobiteIcreateP.ICM.ICM_hState'
                }),
                disableMonitor: true,
                arguments: {
                CHOICE: {
                    type: ArgumentType.STRING,
                    menu: 'choice_PotentiometerPin'
                }
                }
            },
            {
                opcode: 'ICM_Button',
                blockType: BlockType.REPORTER,
                text: formatMessage({
                id: 'MicrobiteIcreateP.ICM.ICM_Button',
                default: 'Button Sensor [CHOICE]',
                description: 'MicrobiteIcreateP.ICM.ICM_Button'
                }),
                disableMonitor: true,
                arguments: {
                CHOICE: {
                    type: ArgumentType.STRING,
                    menu: 'choice_LEDPin'
                }
                }
            },
            {
                opcode: 'ICM_UltrasonicWave',
                blockType: BlockType.REPORTER,
                text: formatMessage({
                id: 'MicrobiteIcreateP.ICM.ICM_UltrasonicWave',
                default: 'Ultrasonic Sensor [CHOICE1] Unit cm',
                description: 'MicrobiteIcreateP.ICM.ICM_UltrasonicWave'
                }),
                disableMonitor: true,
                arguments: {
                CHOICE1: {
                    type: ArgumentType.STRING,
                    menu: 'choice_UltrasonicWavePin'
                }
                }
            },
            {
                opcode: 'ICM_RockerType',
                blockType: BlockType.BOOLEAN,
                text: formatMessage({
                id: 'MicrobiteIcreateP.ICM.ICM_RockerType',
                default: 'Detect Rocker [CHOICE]',
                description: 'MicrobiteIcreateP.ICM.ICM_RockerType'
                }),
                disableMonitor: true,
                arguments: {
                CHOICE: {
                    type: ArgumentType.STRING,
                    menu: 'choice_RockerType'
                }
                }
            },
            {
                opcode: 'ICM_Rocker',
                blockType: BlockType.REPORTER,
                text: formatMessage({
                id: 'MicrobiteIcreateP.ICM.ICM_Rocker',
                default: 'Rocker [CHOICE] Direction',
                description: 'MicrobiteIcreateP.ICM.ICM_Rocker'
                }),
                disableMonitor: true,
                arguments: {
                CHOICE: {
                    type: ArgumentType.STRING,
                    menu: 'choice_RockerXY'
                }
                }
            },

            {
                blockType: BlockType.LABEL,
                text: formatMessage({
                id: 'MicrobiteIcreateP.ICM.labelAction',
                default: 'Action',
                description: 'MicrobiteIcreateP.ICM.labelAction'
                })
            },
            {
                opcode: 'ICM_server',
                blockType: BlockType.COMMAND,
                text: formatMessage({
                id: 'MicrobiteIcreateP.ICM.ICM_server',
                default: 'Servo [CHOICE] Angle [TEXT]',
                description: 'MicrobiteIcreateP.ICM.ICM_server'
                }),
                arguments: {
                CHOICE: {
                    type: ArgumentType.STRING,
                    menu: 'choice_serverPin'
                },
                TEXT: {
                    type: ArgumentType.NUMRES0_300,
                    defaultValue: 0
                }
                }
            },
            {
                opcode: 'ICM_DCmotor',
                blockType: BlockType.COMMAND,
                text: formatMessage({
                id: 'MicrobiteIcreateP.ICM.ICM_DCmotor',
                default: 'Motor [CHOICE] Speed [TEXT]',
                description: 'MicrobiteIcreateP.ICM.ICM_DCmotor'
                }),
                arguments: {
                CHOICE: {
                    type: ArgumentType.STRING,
                    menu: 'choice_DCmotor'
                },
                TEXT: {
                    type: ArgumentType.NUMRES_255_255,
                    defaultValue: 100
                }
                }
            },
            {
                opcode: 'ICM_Fan',
                blockType: BlockType.COMMAND,
                text: formatMessage({
                id: 'MicrobiteIcreateP.ICM.ICM_Fan',
                default: 'Fan [CHOICE1] Switch to [CHOICE2]',
                description: 'MicrobiteIcreateP.ICM.ICM_Fan'
                }),
                arguments: {
                CHOICE1: {
                    type: ArgumentType.STRING,
                    menu: 'choice_FanPin'
                },
                CHOICE2: {
                    type: ArgumentType.NUMBER,
                    menu: 'choice_LEDOff'
                }
                }
            },
            {
                opcode: 'ICM_Elecmagnet',
                blockType: BlockType.COMMAND,
                text: formatMessage({
                id: 'MicrobiteIcreateP.ICM.ICM_Elecmagnet',
                default: 'Electromagnet [CHOICE1] Switch to [CHOICE2]',
                description: 'MicrobiteIcreateP.ICM.ICM_Elecmagnet'
                }),
                arguments: {
                CHOICE1: {
                    type: ArgumentType.STRING,
                    menu: 'choice_LEDPin'
                },
                CHOICE2: {
                    type: ArgumentType.NUMBER,
                    menu: 'choice_LEDOff'
                }
                }
            },
            "---",
            {
                opcode: 'ICM_ICmotor_readPos',
                blockType: BlockType.REPORTER,
                text: formatMessage({
                id: 'MicrobiteIcreateP.ICM.ICM_ICmotor_readPos',
                default: 'Read [CHOICE] Motor Position',
                description: 'MicrobiteIcreateP.ICM.ICM_ICmotor_readPos'
                }),
                disableMonitor: true,
                arguments: {
                CHOICE: {
                    type: ArgumentType.STRING,
                    menu: 'choice_ICmotorPin'
                }
                }
            },
            //   {
            //     opcode: 'ICM_ICmotor_readSpeed',
            //     blockType: BlockType.REPORTER,
            //     text: formatMessage({
            //       id: 'MicrobiteIcreateP.ICM.ICM_ICmotor_readSpeed',
            //       default: '读取[CHOICE]电机速度',
            //       description: 'MicrobiteIcreateP.ICM.ICM_ICmotor_readSpeed'
            //     }),
            //     arguments: {
            //         CHOICE: {
            //             type: ArgumentType.STRING,
            //             menu: 'choice_ICmotorPin'
            //         }
            //     }
            //   },
            {
                opcode: 'ICM_ICmotor_setDoubleMotor',
                blockType: BlockType.COMMAND,
                text: formatMessage({
                id: 'MicrobiteIcreateP.ICM.ICM_ICmotor_setDoubleMotor',
                default: 'Left Motor Set to [CHOICE1] Right Motor Set to [CHOICE2]',
                description: 'MicrobiteIcreateP.ICM.ICM_ICmotor_setDoubleMotor'
                }),
                arguments: {
                CHOICE1: {
                    type: ArgumentType.STRING,
                    menu: 'choice_ICmotorPin'
                },
                CHOICE2: {
                    type: ArgumentType.STRING,
                    menu: 'choice_ICmotorPin'
                }
                }
            },
            {
                opcode: 'ICM_ICmotor_DoubleRunSecond',
                blockType: BlockType.COMMAND,
                text: formatMessage({
                id: 'MicrobiteIcreateP.ICM.ICM_ICmotor_DoubleRunSecond',
                default: 'Dual Motors at [TEXT1][TEXT2] Speed Rotate [TEXT3] Seconds',
                description: 'MicrobiteIcreateP.ICM.ICM_ICmotor_DoubleRunSecond'
                }),
                arguments: {
                TEXT1: {
                    type: ArgumentType.NUMRES_100_100,
                    defaultValue: 50
                },
                TEXT2: {
                    type: ArgumentType.NUMRES_100_100,
                    defaultValue: 50
                },
                TEXT3: {
                    type: ArgumentType.NUMRES0_65535,
                    defaultValue: 0
                }
                }
            },
            {
                opcode: 'ICM_ICmotor_DoubleRunDegree',
                blockType: BlockType.COMMAND,
                text: formatMessage({
                id: 'MicrobiteIcreateP.ICM.ICM_ICmotor_DoubleRunDegree',
                default: 'Dual Motors at [TEXT1][TEXT2] Speed Rotate [TEXT3] Degrees',
                description: 'MicrobiteIcreateP.ICM.ICM_ICmotor_DoubleRunDegree'
                }),
                arguments: {
                TEXT1: {
                    type: ArgumentType.NUMRES_100_100,
                    defaultValue: 50
                },
                TEXT2: {
                    type: ArgumentType.NUMRES_100_100,
                    defaultValue: 50
                },
                TEXT3: {
                    type: ArgumentType.NUMRES_32400_32400,
                    defaultValue: 0
                }
                }
            },
            {
                opcode: 'ICM_ICmotor_DoubleRun',
                blockType: BlockType.COMMAND,
                text: formatMessage({
                id: 'MicrobiteIcreateP.ICM.ICM_ICmotor_DoubleRun',
                default: 'Dual Motors at [TEXT1][TEXT2] Speed Rotate',
                description: 'MicrobiteIcreateP.ICM.ICM_ICmotor_DoubleRun'
                }),
                arguments: {
                TEXT1: {
                    type: ArgumentType.NUMRES_100_100,
                    defaultValue: 50
                },
                TEXT2: {
                    type: ArgumentType.NUMRES_100_100,
                    defaultValue: 50
                }
                }
            },
            {
                opcode: 'ICM_ICmotor_RunDegree',
                blockType: BlockType.COMMAND,
                text: formatMessage({
                id: 'MicrobiteIcreateP.ICM.ICM_ICmotor_RunDegree',
                default: '[CHOICE] Motor at [TEXT1] Speed Rotate [TEXT3] Degrees',
                description: 'MicrobiteIcreateP.ICM.ICM_ICmotor_RunDegree'
                }),
                arguments: {
                CHOICE: {
                    type: ArgumentType.STRING,
                    menu: 'choice_ICmotorPin'
                },
                TEXT1: {
                    type: ArgumentType.NUMRES0_100,
                    defaultValue: 0
                },
                TEXT3: {
                    type: ArgumentType.NUMRES_32400_32400,
                    defaultValue: 0
                }
                }
            },
            {
                opcode: 'ICM_ICmotor_RunSecond',
                blockType: BlockType.COMMAND,
                text: formatMessage({
                id: 'MicrobiteIcreateP.ICM.ICM_ICmotor_RunSecond',
                default: '[CHOICE] Motor at [TEXT1] Speed Rotate [TEXT3] Seconds',
                description: 'MicrobiteIcreateP.ICM.ICM_ICmotor_RunSecond'
                }),
                arguments: {
                CHOICE: {
                    type: ArgumentType.STRING,
                    menu: 'choice_ICmotorPin'
                },
                TEXT1: {
                    type: ArgumentType.NUMRES0_100,
                    defaultValue: 0
                },
                TEXT3: {
                    type: ArgumentType.NUMRES0_65535,
                    defaultValue: 0
                }
                }
            },
            {
                opcode: 'ICM_ICmotor_RunPos',
                blockType: BlockType.COMMAND,
                text: formatMessage({
                id: 'MicrobiteIcreateP.ICM.ICM_ICmotor_RunPos',
                default: '[CHOICE] Motor at [TEXT1] Speed Go to [TEXT3] Position',
                description: 'MicrobiteIcreateP.ICM.ICM_ICmotor_RunPos'
                }),
                arguments: {
                CHOICE: {
                    type: ArgumentType.STRING,
                    menu: 'choice_ICmotorPin'
                },
                TEXT1: {
                    type: ArgumentType.NUMRES0_100,
                    defaultValue: 0
                },
                TEXT3: {
                    type: ArgumentType.NUMRES_360_360,
                    defaultValue: 0
                }
                }
            },
            {
                opcode: 'ICM_ICmotor_Run',
                blockType: BlockType.COMMAND,
                text: formatMessage({
                id: 'MicrobiteIcreateP.ICM.ICM_ICmotor_Run',
                default: '[CHOICE] Motor at [TEXT] Speed Rotate',
                description: 'MicrobiteIcreateP.ICM.ICM_ICmotor_Run'
                }),
                arguments: {
                CHOICE: {
                    type: ArgumentType.STRING,
                    menu: 'choice_ICmotorPin'
                },
                TEXT: {
                    type: ArgumentType.NUMRES_100_100,
                    defaultValue: 0
                }
                }
            },

            {
                blockType: BlockType.LABEL,
                text: formatMessage({
                id: 'MicrobiteIcreateP.ICM.labelLightSound',
                default: 'Light & Sound',
                description: 'MicrobiteIcreateP.ICM.labelLightSound'
                })
            },
            {
                opcode: 'ICM_yellowLED',
                blockType: BlockType.COMMAND,
                text: formatMessage({
                id: 'MicrobiteIcreateP.ICM.ICM_yellowLED',
                default: 'LED [CHOICE1] Switch to [CHOICE2]',
                description: 'MicrobiteIcreateP.ICM.ICM_yellowLED'
                }),
                arguments: {
                CHOICE1: {
                    type: ArgumentType.STRING,
                    menu: 'choice_LEDPin'
                },
                CHOICE2: {
                    type: ArgumentType.STRING,
                    menu: 'choice_LEDOff'
                }
                }
            },
            "---",
            {
                opcode: 'ICM_setLRLight',
                blockType: BlockType.COMMAND,
                text: formatMessage({
                id: 'MicrobiteIcreateP.ICM.ICM_setLRLight',
                default: 'Light Ring [CHOICE] Set Brightness [TEXT2]',
                description: 'MicrobiteIcreateP.ICM.ICM_setLRLight'
                }),
                arguments: {
                CHOICE: {
                    type: ArgumentType.STRING,
                    menu: 'choice_LEDPin'
                },
                TEXT2: {
                    type: ArgumentType.NUMRES0_255,
                    defaultValue: 255
                }
                }
            },
            //   {
            //     opcode: 'ICM_createColor',
            //     blockType: BlockType.REPORTER,
            //     text: formatMessage({
            //       id: 'MicrobiteIcreateP.ICM.ICM_createColor',
            //       default: '红[TEXT1] 绿[TEXT2] 蓝[TEXT3]',
            //       description: 'MicrobiteIcreateP.ICM.ICM_createColor'
            //     }),
            //     arguments: {
            //         TEXT1: {
            //             type: ArgumentType.NUMRES0_255,
            //             defaultValue: 255
            //         },
            //         TEXT2: {
            //             type: ArgumentType.NUMRES0_255,
            //             defaultValue: 255
            //         },
            //         TEXT3: {
            //             type: ArgumentType.NUMRES0_255,
            //             defaultValue: 255
            //         },
            //     }
            //   },
            {
                opcode: 'ICM_LRColor',
                blockType: BlockType.COMMAND,
                text: formatMessage({
                id: 'MicrobiteIcreateP.ICM.ICM_LRColor',
                default: 'Light Ring [CHOICE1] Display Color [LRColorD]',
                description: 'MicrobiteIcreateP.ICM.ICM_LRColor'
                }),
                arguments: {
                CHOICE1: {
                    type: ArgumentType.STRING,
                    menu: 'choice_LEDPin'
                },
                LRColorD: {
                    type: ArgumentType.STRING,
                    menu: 'choice_LightRingColor'
                }
                }
            },
            "---",
            {
                opcode: 'ICM_OLEDini',
                blockType: BlockType.COMMAND,
                text: formatMessage({
                id: 'MicrobiteIcreateP.ICM.ICM_OLEDini',
                default: 'Initialize OLED',
                description: 'MicrobiteIcreateP.ICM.ICM_OLEDini'
                })
            },
            {
                opcode: 'ICM_OLEDshow',
                blockType: BlockType.COMMAND,
                text: formatMessage({
                id: 'MicrobiteIcreateP.ICM.ICM_OLEDshow',
                default: 'Display Text [TEXT] at X[X] Y[Y] Color Mode [COLOR]',
                description: 'MicrobiteIcreateP.ICM.ICM_OLEDshow'
                }),
                arguments: {
                TEXT: {
                    type: ArgumentType.STRING,
                    defaultValue: 'hello'
                },
                X: {
                    type: ArgumentType.NUMBER,
                    menu: 0
                },
                Y: {
                    type: ArgumentType.NUMBER,
                    menu: 0
                },
                COLOR: {
                    type: ArgumentType.STRING,
                    menu: 'choice_OLEDColor'
                }
                }
            },
            {
                opcode: 'ICM_OLEDclear',
                blockType: BlockType.COMMAND,
                text: formatMessage({
                id: 'MicrobiteIcreateP.ICM.ICM_OLEDclear',
                default: 'Clear OLED',
                description: 'MicrobiteIcreateP.ICM.ICM_OLEDclear'
                })
            },
            "---",
            {
                opcode: 'ICM_Laser',
                blockType: BlockType.COMMAND,
                text: formatMessage({
                id: 'MicrobiteIcreateP.ICM.ICM_Laser',
                default: 'Laser [CHOICE1] Switch to [CHOICE2]',
                description: 'MicrobiteIcreateP.ICM.ICM_Laser'
                }),
                arguments: {
                CHOICE1: {
                    type: ArgumentType.STRING,
                    menu: 'choice_LEDPin'
                },
                CHOICE2: {
                    type: ArgumentType.STRING,
                    menu: 'choice_LEDOff'
                }
                }
            },

            "---",
            {
                opcode: 'ICM_Recording',
                blockType: BlockType.COMMAND,
                text: formatMessage({
                id: 'MicrobiteIcreateP.ICM.ICM_Recording',
                default: 'Recording Module-Play [CHOICE]',
                description: 'MicrobiteIcreateP.ICM.ICM_Recording'
                }),
                arguments: {
                CHOICE: {
                    type: ArgumentType.STRING,
                    menu: 'choice_Recording'
                }
                }
            }
            ],




            // menus: {
            //     choice_LongRangePhotoelectricPin: {  // 远距离光电传感器端口
            //         acceptReporters: false,
            //         items: [
            //             { text: 'P0', value: 'P13P0' },  // DICT_LightRingPin['P0']
            //             { text: 'P1', value: 'P14P1' },  // DICT_LightRingPin['P1']
            //             { text: 'P2', value: 'P15P2' },  // DICT_LightRingPin['P2']
            //             { text: 'P8', value: 'P7P8' },   // DICT_LightRingPin['P8']
            //             { text: 'P12', value: 'P9P12' }, // DICT_LightRingPin['P12']
            //             { text: 'P16', value: 'P10P16' } // DICT_LightRingPin['P16']
            //         ]
            //     },
            //     choice_PotentiometerPin: {  // 电位器端口（无映射字典）
            //         acceptReporters: false,
            //         items: [
            //             { text: 'P0', value: 'P0' },
            //             { text: 'P1', value: 'P1' },
            //             { text: 'P2', value: 'P2' }
            //         ]
            //     },
            //     choice_UltrasonicWavePin: {  // 超声波传感器端口
            //         acceptReporters: false,
            //         items: [
            //             { text: '(P13,P0)', value: '0' }, // DICT_UltrasonicWavePin['(P13,P0)']
            //             { text: '(P14,P1)', value: '1' }, // DICT_UltrasonicWavePin['(P14,P1)']
            //             { text: '(P9,P12)', value: '4' },  // DICT_UltrasonicWavePin['(P9,P12)']
            //             { text: '(P15,P2)', value: '2' }   // DICT_UltrasonicWavePin['(P15,P2)']
            //         ]
            //     },
            //     choice_UltrasonicWaveUnit: {  // 超声波单位（无映射字典）
            //         acceptReporters: false,
            //         items: [
            //             { text: '厘米', value: '厘米' },
            //             { text: '微秒', value: '微秒' },
            //             { text: '英寸', value: '英寸' }
            //         ]
            //     },
            //     choice_RockerType: {  // 摇杆状态
            //         acceptReporters: false,
            //         items: [
            //             { 
            //                 // text: '上',
            //                  text: formatMessage({
            //                     id: 'MicrobiteIcreateP.choiceRockerType.isUp',
            //                     default: '上',
            //                     description: 'MicrobiteIcreateP.choiceRockerType.isUp'
            //                 }),
            //                  value: 'is_up' 
            //                 },    // DICT_RockerType['上']
            //             { 
            //                 // text: '下', 
            //                 text: formatMessage({
            //                     id: 'MicrobiteIcreateP.choiceRockerType.isDown',
            //                     default: '下',
            //                     description: 'MicrobiteIcreateP.choiceRockerType.isDown'
            //                 }),
            //                 value: 'is_down' 
            //             },  // DICT_RockerType['下']
            //             { 
            //                 // text: '左', 
            //                 text: formatMessage({
            //                     id: 'MicrobiteIcreateP.choiceRockerType.isLeft',
            //                     default: '左',
            //                     description: 'MicrobiteIcreateP.choiceRockerType.isLeft'
            //                 }),
            //                 value: 'is_left' 
            //             },  // DICT_RockerType['左']
            //             { 
            //                 // text: '右', 
            //                 text: formatMessage({
            //                     id: 'MicrobiteIcreateP.choiceRockerType.isRight',
            //                     default: '右',
            //                     description: 'MicrobiteIcreateP.choiceRockerType.isRight'
            //                 }),
            //                 value: 'is_right' 
            //             }  // DICT_RockerType['右']
            //         ]
            //     },
            //     choice_RockerXY: {  // 摇杆方向（无映射字典）
            //         acceptReporters: false,
            //         items: [
            //             { text: 'X', value: 'X' },
            //             { text: 'Y', value: 'Y' }
            //         ]
            //     },
            //     choice_serverPin: {  // 舵机端口（无映射字典）
            //         acceptReporters: false,
            //         items: [
            //             { text: 'S1', value: 'S1' },
            //             { text: 'S2', value: 'S2' },
            //             { text: 'S3', value: 'S3' },
            //             { text: 'S4', value: 'S4' }
            //         ]
            //     },
            //     choice_DCmotor: {  // 直流电机端口（无映射字典）
            //         acceptReporters: false,
            //         items: [
            //             { text: 'M1', value: 'M1' },
            //             { text: 'M2', value: 'M2' },
            //             { text: 'M3', value: 'M3' },
            //             { text: 'M4', value: 'M4' }
            //         ]
            //     },
            //     choice_FanPin: {  // 风扇端口（无映射字典）
            //         acceptReporters: false,
            //         items: [
            //             { text: 'P0', value: 'P0' },
            //             { text: 'P1', value: 'P1' },
            //             { text: 'P2', value: 'P2' }
            //         ]
            //     },
            //     choice_LEDPin: {  // LED端口
            //         acceptReporters: false,
            //         items: [
            //             { text: 'P0', value: 'P13P0' },   // DICT_LightRingPin['P0']
            //             { text: 'P1', value: 'P14P1' },   // DICT_LightRingPin['P1']
            //             { text: 'P2', value: 'P15P2' },   // DICT_LightRingPin['P2']
            //             { text: 'P8', value: 'P7P8' },    // DICT_LightRingPin['P8']
            //             { text: 'P12', value: 'P9P12' },  // DICT_LightRingPin['P12']
            //             { text: 'P16', value: 'P10P16' }  // DICT_LightRingPin['P16']
            //         ]
            //     },
            //     choice_LEDOff: {  // LED开关
            //         acceptReporters: false,
            //         items: [
            //             { text: '打开', value: '0' },  // DICT_LEDOff['打开']
            //             { text: '关闭', value: '1' }   // DICT_LEDOff['关闭']
            //         ]
            //     },
            //     choice_LightRingColor: {  // 灯环颜色
            //         acceptReporters: false,
            //         items: [
            //             { 
            //                 // text: '红色', 
            //                 text: formatMessage({
            //                     id: 'MicrobiteIcreateP.choiceLightRingColor.red',
            //                     default: '红色',
            //                     description: 'MicrobiteIcreateP.choiceLightRingColor.red'
            //                 }),
            //                 value: '(255, 0, 0)' 
            //             },      // DICT_LightRingColor['红色']
            //             { 
            //                 // text: '橙色', 
            //                 text: formatMessage({
            //                     id: 'MicrobiteIcreateP.choiceLightRingColor.origen',
            //                     default: '橙色',
            //                     description: 'MicrobiteIcreateP.choiceLightRingColor.origen'
            //                 }),
            //                 value: '(255, 165, 0)' 
            //             },    // DICT_LightRingColor['橙色']
            //             { 
            //                 // text: '黄色', 
            //                 text: formatMessage({
            //                     id: 'MicrobiteIcreateP.choiceLightRingColor.yellow',
            //                     default: '黄色',
            //                     description: 'MicrobiteIcreateP.choiceLightRingColor.yellow'
            //                 }),
            //                 value: '(255, 255, 0)' 
            //             },    // DICT_LightRingColor['黄色']
            //             { 
            //                 // text: '绿色', 
            //                 text: formatMessage({
            //                     id: 'MicrobiteIcreateP.choiceLightRingColor.green',
            //                     default: '绿色',
            //                     description: 'MicrobiteIcreateP.choiceLightRingColor.green'
            //                 }),
            //                 value: '(0, 255, 0)' 
            //             },      // DICT_LightRingColor['绿色']
            //             { 
            //                 // text: '青色', 
            //                  text: formatMessage({
            //                     id: 'MicrobiteIcreateP.choiceLightRingColor.qing',
            //                     default: '青色',
            //                     description: 'MicrobiteIcreateP.choiceLightRingColor.qing'
            //                 }),
            //                 value: '(0, 255, 255)' 
            //             },    // DICT_LightRingColor['青色']
            //             { 
            //                 // text: '蓝色', 
            //                  text: formatMessage({
            //                     id: 'MicrobiteIcreateP.choiceLightRingColor.blue',
            //                     default: '蓝色',
            //                     description: 'MicrobiteIcreateP.choiceLightRingColor.blue'
            //                 }),
            //                 value: '(0, 0, 255)' 
            //             },      // DICT_LightRingColor['蓝色']
            //             { 
            //                 // text: '紫色', 
            //                 text: formatMessage({
            //                     id: 'MicrobiteIcreateP.choiceLightRingColor.purple',
            //                     default: '紫色',
            //                     description: 'MicrobiteIcreateP.choiceLightRingColor.purple'
            //                 }),
            //                 value: '(128, 0, 128)' 
            //             },   // DICT_LightRingColor['紫色']
            //             { 
            //                 // text: '白色', 
            //                 text: formatMessage({
            //                     id: 'MicrobiteIcreateP.choiceLightRingColor.white',
            //                     default: '白色',
            //                     description: 'MicrobiteIcreateP.choiceLightRingColor.white'
            //                 }),
            //                 value: '(255, 255, 255)' 
            //             },  // DICT_LightRingColor['白色']
            //             { 
            //                 // text: '黑色', 
            //                 text: formatMessage({
            //                     id: 'MicrobiteIcreateP.choiceLightRingColor.black',
            //                     default: '黑色',
            //                     description: 'MicrobiteIcreateP.choiceLightRingColor.black'
            //                 }),
            //                 value: '(0, 0, 0)' 
            //             }         // DICT_LightRingColor['黑色']
            //         ]
            //     },
            //     choice_Recording: {  // 录音模块
            //         acceptReporters: false,
            //         items: [
            //             { 
            //                 // text: '机枪扫射', 
            //                 text: formatMessage({
            //                     id: 'MicrobiteIcreateP.choiceRecording.gunshot',
            //                     default: '机枪扫射',
            //                     description: 'MicrobiteIcreateP.choiceRecording.gunshot'
            //                 }),
            //                 value: 'GUNSHOT' 
            //             },       // DICT_Recording['机枪扫射']
            //             { 
            //                 // text: '激光发射', 
            //                 text: formatMessage({
            //                     id: 'MicrobiteIcreateP.choiceRecording.laser',
            //                     default: '激光发射',
            //                     description: 'MicrobiteIcreateP.choiceRecording.laser'
            //                 }),
            //                 value: 'LASER' 
            //             },         // DICT_Recording['激光发射']
            //             { 
            //                 // text: '赛车加速', 
            //                 text: formatMessage({
            //                     id: 'MicrobiteIcreateP.choiceRecording.motorcycle',
            //                     default: '赛车加速',
            //                     description: 'MicrobiteIcreateP.choiceRecording.motorcycle'
            //                 }),
            //                 value: 'MOTORCYCLE' 
            //             },    // DICT_Recording['赛车加速']
            //             { 
            //                 // text: '战争开始', 
            //                 text: formatMessage({
            //                     id: 'MicrobiteIcreateP.choiceRecording.warbegin',
            //                     default: '战争开始',
            //                     description: 'MicrobiteIcreateP.choiceRecording.warbegin'
            //                 }),
            //                 value: 'WARBEGIN' 
            //             },      // DICT_Recording['战争开始']
            //             { 
            //                 // text: '倒计时', 
            //                 text: formatMessage({
            //                     id: 'MicrobiteIcreateP.choiceRecording.countdown',
            //                     default: '倒计时',
            //                     description: 'MicrobiteIcreateP.choiceRecording.countdown'
            //                 }),
            //                 value: 'COUNTDOWN' 
            //             },       // DICT_Recording['倒计时']
            //             { 
            //                 // text: '录音', 
            //                 text: formatMessage({
            //                     id: 'MicrobiteIcreateP.choiceRecording.playrecording',
            //                     default: '录音',
            //                     description: 'MicrobiteIcreateP.choiceRecording.playrecording'
            //                 }),
            //                 value: 'PLAYRECORDING' 
            //             }      // DICT_Recording['录音']
            //         ]
            //     },
            //     choice_ICmotorPin: {  // 电机地址
            //         acceptReporters: false,
            //         items: [
            //             { 
            //                 // text: '红', 
            //                 text: formatMessage({
            //                     id: 'MicrobiteIcreateP.choiceICmotorPin.lightred',
            //                     default: '红',
            //                     description: 'MicrobiteIcreateP.choiceICmotorPin.lightred'
            //                 }),
            //                 value: 'LIGHT_RED' 
            //             },     // DICT_MotorPin['红']
            //             { 
            //                 // text: '绿', 
            //                  text: formatMessage({
            //                     id: 'MicrobiteIcreateP.choiceICmotorPin.lightgreen',
            //                     default: '绿',
            //                     description: 'MicrobiteIcreateP.choiceICmotorPin.lightgreen'
            //                 }),
            //                 value: 'LIGHT_GREEN'
            //             },   // DICT_MotorPin['绿']
            //             { 
            //                 // text: '蓝', 
            //                 text: formatMessage({
            //                     id: 'MicrobiteIcreateP.choiceICmotorPin.lightblue',
            //                     default: '蓝',
            //                     description: 'MicrobiteIcreateP.choiceICmotorPin.lightblue'
            //                 }),
            //                 value: 'LIGHT_BLUE' 
            //             },    // DICT_MotorPin['蓝']
            //             { 
            //                 // text: '黄', 
            //                 text: formatMessage({
            //                     id: 'MicrobiteIcreateP.choiceICmotorPin.lightyellow',
            //                     default: '黄',
            //                     description: 'MicrobiteIcreateP.choiceICmotorPin.lightyellow'
            //                 }),
            //                 value: 'LIGHT_YELLOW' 
            //             }   // DICT_MotorPin['黄']
            //         ]
            //     },
            //     choice_OLEDColor: {  // OLED颜色模式
            //         acceptReporters: false,
            //         items: [
            //             { 
            //                 // text: '白底黑字', 
            //                 text: formatMessage({
            //                     id: 'MicrobiteIcreateP.choiceOLEDColor.whiteBack',
            //                     default: '白底黑字',
            //                     description: 'MicrobiteIcreateP.choiceOLEDColor.whiteBack'
            //                 }),
            //                 value: '0' 
            //             },  // DICT_OLEDColor['白底黑字']
            //             { 
            //                 // text: '黑底白字', 
            //                 text: formatMessage({
            //                     id: 'MicrobiteIcreateP.choiceOLEDColor.blackBack',
            //                     default: '黑底白字',
            //                     description: 'MicrobiteIcreateP.choiceOLEDColor.blackBack'
            //                 }),
            //                 value: '1' 
            //             }   // DICT_OLEDColor['黑底白字']
            //         ]
            //     }
            // }

            

        menus: {
            choice_LongRangePhotoelectricPin: {//选择远距离光电传感器端口
              acceptReporters: false,
              items: ['P0', 'P1','P2','P8','P12','P16']
            },
            choice_PotentiometerPin:{//选择电位器端口
                acceptReporters: false,
                items: ['P0', 'P1','P2']
            },
            choice_UltrasonicWavePin:{//选择超声波传感器端口
                acceptReporters: false,
                items: ['(P13,P0)', '(P14,P1)','(P9,P12)','(P15,P2)']
            },
            choice_UltrasonicWaveUnit:{//选择超声波传感器单位
                acceptReporters: false,
                items: ['厘米', '微秒','英寸']
            },
            choice_RockerType:{//选择摇杆状态
                acceptReporters: false,
                items: [
                    // '上', 
                    formatMessage({
                        id: 'MicrobiteIcreateP.choiceRockerType.isUp',
                        default: 'Up',
                        description: 'MicrobiteIcreateP.choiceRockerType.isUp'
                    }),
                    // '下',
                    formatMessage({
                        id: 'MicrobiteIcreateP.choiceRockerType.isDown',
                        default: 'Down',
                        description: 'MicrobiteIcreateP.choiceRockerType.isDown'
                    }),
                    // '左',
                    formatMessage({
                        id: 'MicrobiteIcreateP.choiceRockerType.isLeft',
                        default: 'Left',
                        description: 'MicrobiteIcreateP.choiceRockerType.isLeft'
                    }),
                    // '右'
                    formatMessage({
                        id: 'MicrobiteIcreateP.choiceRockerType.isRight',
                        default: 'Right',
                        description: 'MicrobiteIcreateP.choiceRockerType.isRight'
                    }),
                ]
            },
            choice_RockerXY:{//选择摇杆方向状态
                acceptReporters: false,
                items: ['X', 'Y']
            },
            choice_serverPin: {//选择舵机端口
                acceptReporters: false,
                items: ['S1','S2','S3','S4']
            },
            choice_DCmotor: {//直流电机端口
                acceptReporters: false,
                items: ['M1','M2','M3','M4']
            },
            choice_FanPin: {//选择风扇端口
                acceptReporters: false,
                items: ['P0', 'P1','P2']
            },
            choice_LEDPin:{//选择LED端口
                acceptReporters: false,
                items: ['P0', 'P1','P2','P8','P12','P16']
            },
            choice_LEDOff:{//选择LED开关
                acceptReporters: false,
                items: [
                    // '打开', 
                    formatMessage({
                        id: 'MicrobiteIcreateP.choiceLEDOff.open',
                        default: 'On',
                        description: 'MicrobiteIcreateP.choiceLEDOff.open'
                    }),
                    // '关闭'
                    formatMessage({
                        id: 'MicrobiteIcreateP.choiceLEDOff.close',
                        default: 'Off',
                        description: 'MicrobiteIcreateP.choiceLEDOff.close'
                    }),
                ]
            },
            choice_LightRingColor:{//选择灯环颜色
                acceptReporters: false,
                // items: ['红色', '橙色', '黄色', '绿色', '青色', '蓝色', '紫色', '白色', '黑色']
                items:[

                        formatMessage({
                                id: 'MicrobiteIcreateP.choiceLightRingColor.red',
                                default: 'Red',
                                description: 'MicrobiteIcreateP.choiceLightRingColor.red'
                        }),
                        formatMessage({
                            id: 'MicrobiteIcreateP.choiceLightRingColor.origen',
                            default: 'Orange',
                            description: 'MicrobiteIcreateP.choiceLightRingColor.origen'
                        }),
                        formatMessage({
                                id: 'MicrobiteIcreateP.choiceLightRingColor.yellow',
                                default: 'Yellow',
                                description: 'MicrobiteIcreateP.choiceLightRingColor.yellow'
                        }),
                        formatMessage({
                                id: 'MicrobiteIcreateP.choiceLightRingColor.green',
                                default: 'Green',
                                description: 'MicrobiteIcreateP.choiceLightRingColor.green'
                        }),
                        formatMessage({
                                id: 'MicrobiteIcreateP.choiceLightRingColor.qing',
                                default: 'Cyan',
                                description: 'MicrobiteIcreateP.choiceLightRingColor.qing'
                        }),
                        formatMessage({
                                id: 'MicrobiteIcreateP.choiceLightRingColor.blue',
                                default: 'Blue',
                                description: 'MicrobiteIcreateP.choiceLightRingColor.blue'
                        }),
                        formatMessage({
                                id: 'MicrobiteIcreateP.choiceLightRingColor.purple',
                                default: 'Purple',
                                description: 'MicrobiteIcreateP.choiceLightRingColor.purple'
                        }),
                        formatMessage({
                                id: 'MicrobiteIcreateP.choiceLightRingColor.white',
                                default: 'White',
                                description: 'MicrobiteIcreateP.choiceLightRingColor.white'
                        }),
                        formatMessage({
                                id: 'MicrobiteIcreateP.choiceLightRingColor.black',
                                default: 'Black',
                                description: 'MicrobiteIcreateP.choiceLightRingColor.black'
                        }),
                ]
            },
            choice_Recording:{//录音模块
                acceptReporters: false,
                // items: ['机枪扫射', '激光发射', '赛车加速', '战争开始', '倒计时', '录音']
                items:[
                        formatMessage({
                                id: 'MicrobiteIcreateP.choiceRecording.gunshot',
                                default: 'Machine Gun Fire',
                                description: 'MicrobiteIcreateP.choiceRecording.gunshot'
                        }),
                        formatMessage({
                                id: 'MicrobiteIcreateP.choiceRecording.laser',
                                default: 'Laser Shoot',
                                description: 'MicrobiteIcreateP.choiceRecording.laser'
                        }),
                        formatMessage({
                                id: 'MicrobiteIcreateP.choiceRecording.motorcycle',
                                default: 'Racing Car Acceleration',
                                description: 'MicrobiteIcreateP.choiceRecording.motorcycle'
                        }),

                        formatMessage({
                                id: 'MicrobiteIcreateP.choiceRecording.warbegin',
                                default: 'War Begins',
                                description: 'MicrobiteIcreateP.choiceRecording.warbegin'
                        }),
                        formatMessage({
                                id: 'MicrobiteIcreateP.choiceRecording.countdown',
                                default: 'Countdown',
                                description: 'MicrobiteIcreateP.choiceRecording.countdown'
                        }),
                        formatMessage({
                                id: 'MicrobiteIcreateP.choiceRecording.playrecording',
                                default: 'Recording',
                                description: 'MicrobiteIcreateP.choiceRecording.playrecording'
                        }),
                ]
            },
            choice_ICmotorPin:{//电机地址
                acceptReporters: false,
                // items: ['红', '绿', '蓝', '黄']
                items:[
                        formatMessage({
                                id: 'MicrobiteIcreateP.choiceICmotorPin.lightred',
                                default: 'Red',
                                description: 'MicrobiteIcreateP.choiceICmotorPin.lightred'
                        }),
                        formatMessage({
                                id: 'MicrobiteIcreateP.choiceICmotorPin.lightgreen',
                                default: 'Green',
                                description: 'MicrobiteIcreateP.choiceICmotorPin.lightgreen'
                        }),

                        formatMessage({
                                id: 'MicrobiteIcreateP.choiceICmotorPin.lightblue',
                                default: 'Blue',
                                description: 'MicrobiteIcreateP.choiceICmotorPin.lightblue'
                        }),
                        formatMessage({
                                id: 'MicrobiteIcreateP.choiceICmotorPin.lightyellow',
                                default: 'Yellow',
                                description: 'MicrobiteIcreateP.choiceICmotorPin.lightyellow'
                        }),
                ]
            },
            choice_OLEDColor:{//oled颜色模式
                acceptReporters: false,
                // items: ['白底黑字', '黑底白字']
                items:[
                        formatMessage({
                                id: 'MicrobiteIcreateP.choiceOLEDColor.whiteBack',
                                default: 'White Background with Black Text',
                                description: 'MicrobiteIcreateP.choiceOLEDColor.whiteBack'
                        }),
                        formatMessage({
                                id: 'MicrobiteIcreateP.choiceOLEDColor.blackBack',
                                default: 'Black Background with White Text',
                                description: 'MicrobiteIcreateP.choiceOLEDColor.blackBack'
                        }),
                ]
            }
        }
      };
    }


 

   

    //-----------------------传感器----------------------------------------
    //远距离光电
    ICM_LongRangePhotoelectric(args){
        return ICMBP_read(`pin${args.CHOICE.substring(1)}.read_digital()`);
    }
    //电位器
    ICM_Potentiometer(args){
        return ICMBP_read(`pin${args.CHOICE.substring(1)}.read_analog()`);
    }
    //灰度传感器
    ICM_GrayLevel(args){
        return ICMBP_read(`pin${args.CHOICE.substring(1)}.read_analog()`);
    }
    //光敏传感器
    ICM_LightIntensity(args){
        return ICMBP_read(`pin${args.CHOICE.substring(1)}.read_analog()`);
    }
    //火焰传感器
    ICM_Flame(args){
        return ICMBP_read(`pin${args.CHOICE.substring(1)}.read_analog()`);
    }
    //水位传感器
    ICM_WaterLevel(args){
        return ICMBP_read(`pin${args.CHOICE.substring(1)}.read_analog()`);
    }
    //可燃气体传感器
    ICM_GasConcentration(args){
        return ICMBP_read(`pin${args.CHOICE.substring(1)}.read_analog()`);
    }
    //土壤湿度传感器
    ICM_SoilHumidity(args){
        return ICMBP_read(`pin${args.CHOICE.substring(1)}.read_analog()`);
    }
    //防水温度传感器
    ICM_WaterTemp(args){
        return ICMBP_read(`pin${args.CHOICE.substring(1)}.read_analog()`);
    }
    //霍尔传感器
    ICM_hState(args){
        return ICMBP_read(`pin${args.CHOICE.substring(1)}.read_digital()`);
    }
    //按钮传感器
    ICM_Button(args){
        return ICMBP_read(`pin${args.CHOICE.substring(1)}.read_digital()`);
    }
    //超声波传感器
    ICM_UltrasonicWave(args){
        //import ultrasonic
        //ICMBP_send(`ICM_ult${DICT_UltrasonicWavePin[args.CHOICE1]}=ultrasonic.ultrasonic_sensor(${DICT_UltrasonicWavePin[args.CHOICE1]})`)
        return ICMBP_read(`ICM_ult${DICT_UltrasonicWavePin[args.CHOICE1]}.get()`);
    }
    //检测到摇杆动作
    ICM_RockerType(args){
        //import joystick
        return ICMBP_read(`ICM_joy.${DICT_RockerType[args.CHOICE]}()`);
    }
    //摇杆
    ICM_Rocker(args){
        //import joystick
        return ICMBP_read(`ICM_joy.get_${args.CHOICE.toLowerCase()}()`);
    }

    //-----------------------动作----------------------------------------
    //舵机
    async ICM_server(args){
        //import servos
        await ICMBP_send(`ICM_ser${args.CHOICE}.write_angle(${args.TEXT})`)
    }
    //电机
    async ICM_DCmotor(args){
        //import DC_motor 
        await ICMBP_send(`ICM_dcm${args.CHOICE}.run(${args.TEXT})`)
    }
    //风扇 1开
    async ICM_Fan(args){
        await ICMBP_send(`pin${args.CHOICE1.substring(1)}.write_digital(${DICT_LaserOff[args.CHOICE2]})`)
    }
    //电磁铁 1开
    async ICM_Elecmagnet(args){
        await ICMBP_send(`pin${args.CHOICE1.substring(1)}.write_digital(${DICT_LaserOff[args.CHOICE2]})`)
    }

    //读取位置
    ICM_ICmotor_readPos(args){
        //import servo_motor
        return ICMBP_read(`ICM_sm_${DICT_MotorPin[args.CHOICE]}.get_absolute_position()`);
    }
    //读取速度
    // ICM_ICmotor_readSpeed(args){
        
    // }
    //设置双电机地址
    async ICM_ICmotor_setDoubleMotor(args){
        await ICMBP_send(`ICM_smp = servo_motor.motor_pair(addr1=servo_motor.${DICT_MotorPin[args.CHOICE1]}, addr2=servo_motor.${DICT_MotorPin[args.CHOICE2]})`)
    }
    //双电机转秒
    async ICM_ICmotor_DoubleRunSecond(args){
        await ICMBP_send(`ICM_smp.move_for_time(${args.TEXT1}, ${args.TEXT2},${args.TEXT3})`)
    }
    //双电机转度
    async ICM_ICmotor_DoubleRunDegree(args){
        await ICMBP_send(`ICM_smp.move_to_relative_position(${args.TEXT1}, ${args.TEXT2},${args.TEXT3})`)
    }
    //双电机转
    async ICM_ICmotor_DoubleRun(args){
        await ICMBP_send(`ICM_smp.move(${args.TEXT1}, ${args.TEXT2})`)
    }
    //单电机转度
    async ICM_ICmotor_RunDegree(args){
        await ICMBP_send(`ICM_sm_${DICT_MotorPin[args.CHOICE]}.run_to_relative_position(${args.TEXT1},${args.TEXT3})`)
    }
    //单电机转秒
    async ICM_ICmotor_RunSecond(args){
        await ICMBP_send(`ICM_sm_${DICT_MotorPin[args.CHOICE]}.run_for_time(${args.TEXT1},${args.TEXT3})`)
    }
    //单电机转到指定位置
    async ICM_ICmotor_RunPos(args){
        await ICMBP_send(`ICM_sm_${DICT_MotorPin[args.CHOICE]}.run_to_absolute_position(${args.TEXT1},${args.TEXT3})`)
    }
    //单电机转
    async ICM_ICmotor_Run(args){
        await ICMBP_send(`ICM_sm_${DICT_MotorPin[args.CHOICE]}.run(${args.TEXT})`)
    }
   


    //-----------------------声光----------------------------------------
    //黄色LED
    async ICM_yellowLED(args){
        await ICMBP_send(`pin${args.CHOICE1.substring(1)}.write_digital(${DICT_LEDOff[args.CHOICE2]})`)
    }

    //设置灯环亮度
    async ICM_setLRLight(args){
        //import light_ring
        await ICMBP_send(`ICM_light${DICT_LightRingPin[args.CHOICE]}.light(${args.TEXT2})`)
    }
    //红：绿：蓝
    ICM_createColor(args){
        return `(${args.TEXT1},${args.TEXT2},${args.TEXT3})`
    }
    //灯环显示颜色
    async ICM_LRColor(args){
        //import light_ring
        let code = args.LRColorD;
        // 判断是否为颜色格式 
        const isColorTuple = /^\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/.test(code);

        if(!isColorTuple){
            code = DICT_LightRingColor[args.LRColorD]
        }
        await ICMBP_send(`ICM_light${DICT_LightRingPin[args.CHOICE1]}.color(${code})`)
    }

    //初始化OLED
    async ICM_OLEDini(){
        //import oled
        await ICMBP_send(`oled_display = oled.oled()`)
    }
    //显示文本在
    async ICM_OLEDshow(args){
        //import oled
        await ICMBP_send(`oled_display.set_text(${args.X}, ${args.Y}, "${args.TEXT}", ${DICT_OLEDColor[args.COLOR]})`)
    }
    //清除OLED
    async ICM_OLEDclear(){
        //import oled
        await ICMBP_send(`oled_display.clear_screen()`)
    }

    //激光模块
    async ICM_Laser(args){
        await ICMBP_send(`pin${args.CHOICE1.substring(1)}.write_digital(${DICT_LaserOff[args.CHOICE2]})`)
    }

    //录音模块
    async ICM_Recording(args){
        //import recording   ICMBP_rec = recording.recording()
        await ICMBP_send(`ICMBP_rec.voice(recording.${DICT_Recording[args.CHOICE]})`)
    }

    //连接设备
    ICM_openWEBUSB() {
        showDeviceSelectionModal();
    }
    //断开连接
    ICM_burn(){
        burnFirmware()  
    }
    //进入repl
    ICM_REPL(){
        go_repl()
    }
    //进入烧录
    ICM_FLASH(){
        go_flash()
    }
    //下载代码
    ICM_Download(){
        go_download()
    }

    
}




// let DICT_LEDOff = {'打开':"0",'关闭':"1"}
// let DICT_LaserOff = {'打开':"1",'关闭':"0"}
// let DICT_LightRingPin = {'P0':'P13P0', 
// 'P1':'P14P1',
// 'P2':'P15P2',
// 'P8':'P7P8',
// 'P12':'P9P12',
// 'P16':'P10P16'}
// let DICT_LightRingColor=  {'红色':'(255, 0, 0)', 
// '橙色':'(255, 165, 0)',
// '黄色':'(255, 255, 0)',
// '绿色':'(0, 255, 0)',
// '青色':'(0, 255, 255)',
// '蓝色':'(0, 0, 255)',
// '紫色':'(128, 0, 128)',
// '白色':'(255, 255, 255)',
// '黑色':'(0, 0, 0)'
// }
// let DICT_Recording = {'机枪扫射':'GUNSHOT', 
// '激光发射':'LASER', 
// '赛车加速':'MOTORCYCLE', 
// '战争开始':'WARBEGIN', 
// '倒计时':'COUNTDOWN', 
// '录音':'PLAYRECORDING', 
// }
// let DICT_RockerType = {'上':'is_up', 
// '下':'is_down', 
// '左':'is_left', 
// '右':'is_right'
// }
// let DICT_MotorPin = {'红':'LIGHT_RED', 
// '绿':'LIGHT_GREEN', 
// '蓝':'LIGHT_BLUE', 
// '黄':'LIGHT_YELLOW'
// }
// let DICT_UltrasonicWavePin = {'(P13,P0)':'0', 
// '(P14,P1)':'1', 
// '(P9,P12)':'4', 
// '(P15,P2)':'2'
// }
// let DICT_OLEDColor={'白底黑字':'0','黑底白字':'1'}

let DICT_LEDOff = {'打开':"0",'关闭':"1", 'On':"0", 'Off':"1"}
let DICT_LaserOff = {'打开':"1",'关闭':"0", 'On':"1", 'Off':"0"}
let DICT_LightRingPin = {'P0':'P13P0','P1':'P14P1','P2':'P15P2','P8':'P7P8','P12':'P9P12','P16':'P10P16'} // 无需修改
let DICT_LightRingColor=  {
    '红色':'(255, 0, 0)', 'Red':'(255, 0, 0)',
    '橙色':'(255, 165, 0)', 'Orange':'(255, 165, 0)',
    '黄色':'(255, 255, 0)', 'Yellow':'(255, 255, 0)',
    '绿色':'(0, 255, 0)', 'Green':'(0, 255, 0)',
    '青色':'(0, 255, 255)', 'Cyan':'(0, 255, 255)',
    '蓝色':'(0, 0, 255)', 'Blue':'(0, 0, 255)',
    '紫色':'(128, 0, 128)', 'Purple':'(128, 0, 128)',
    '白色':'(255, 255, 255)', 'White':'(255, 255, 255)',
    '黑色':'(0, 0, 0)', 'Black':'(0, 0, 0)'
}
let DICT_Recording = {
    '机枪扫射':'GUNSHOT', 'Machine Gun Fire':'GUNSHOT',
    '激光发射':'LASER', 'Laser Shoot':'LASER',
    '赛车加速':'MOTORCYCLE', 'Racing Car Acceleration':'MOTORCYCLE',
    '战争开始':'WARBEGIN', 'War Begins':'WARBEGIN',
    '倒计时':'COUNTDOWN', 'Countdown':'COUNTDOWN',
    '录音':'PLAYRECORDING', 'Recording':'PLAYRECORDING'
}
let DICT_RockerType = {
    '上':'is_up', 'Up':'is_up',
    '下':'is_down', 'Down':'is_down',
    '左':'is_left', 'Left':'is_left',
    '右':'is_right', 'Right':'is_right'
}
let DICT_MotorPin = {
    '红':'LIGHT_RED', 'Red':'LIGHT_RED',
    '绿':'LIGHT_GREEN', 'Green':'LIGHT_GREEN',
    '蓝':'LIGHT_BLUE', 'Blue':'LIGHT_BLUE',
    '黄':'LIGHT_YELLOW', 'Yellow':'LIGHT_YELLOW'
}
let DICT_UltrasonicWavePin = {'(P13,P0)':'0','(P14,P1)':'1','(P9,P12)':'4','(P15,P2)':'2'} // 无需修改
let DICT_OLEDColor = {
    '白底黑字':'0', 'White Background with Black Text':'0',
    '黑底白字':'1', 'Black Background with White Text':'1'
}


//执行命令
async function ICMBP_send(str){
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
        //return { success: false, error: e.message };
    }
}

//读取命令
async function ICMBP_read(str){
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

//烧录原始固件
async function burnFirmware() {
    try {
        //await window.EditorPreload.disconnectUSBDevice();

        // 显示加载状态
        showToast('开始烧录固件...', 'info')
        
        // 调用烧录方法
        const result = await window.EditorPreload.flashFirmware()
        
        if (result.success) {
            showToast('固件烧录成功！', 'success')
        } else {
        showToast(`烧录失败: ${result.error}`, 'error')
        }
    } catch (err) {
        showToast(`烧录错误: ${err.message}`, 'error')
        console.error('烧录错误:', err)
    }
}


//进入repl
async function go_repl(){
    // if (!isConnected) {
    //     showToast('设备未连接')
    //     return
    // }
    const result = await enterReplMode();
}
//进入烧录
async function go_flash(){
    // if (!isConnected) {
    //     showToast('设备未连接')
    //     return
    // }
    // 进入REPL模式
    const result = await window.EditorPreload.exitReplMode();
    console.log(result) 
    if (result.success) {
        isReplMode = false;
        showToast('REPL模式已退出');

    }
}
//进入下载      
async function go_download(){
    if (!isConnected) {
        showToast('设备未连接')
        return
    }
    // if(isReplMode){
    //     showToast('未处于烧录模式')
    //     return
    // }
    //const result = await window.EditorPreload.downloadCode();

    //console.log(Blockly.getMainWorkspace())
 
    let import_code='from microbit import *\nfrom ICreate import *\n';
    const result = await window.EditorPreload.downloadCode(import_code+getCode());

}


// 全局状态变量
let isConnected = false;//连接状态
let isReplMode = false;//repl状态位

// 显示设备选择弹窗
async function showDeviceSelectionModal() {
    // 创建弹窗容器
    const modal = document.createElement('div');
    modal.id = 'deviceModal';
    Object.assign(modal.style, {
        display: 'block',
        position: 'fixed',
        zIndex: '1000',
        left: '0',
        top: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        fontFamily: 'Arial, sans-serif'
    });

    // 创建弹窗内容（与之前相同）
    const modalContent = document.createElement('div');
    Object.assign(modalContent.style, {
        backgroundColor: 'white',
        margin: '10% auto',
        padding: '20px',
        width: '300px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    });

    // 顶部区域（与之前相同）
    const header = document.createElement('div');
    Object.assign(header.style, {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        borderBottom: '1px solid #eee',
        paddingBottom: '10px'
    });

    const title = document.createElement('h2');
    title.textContent = 'Micro:bit v2';
    title.style.margin = '0';
    title.style.fontSize = '18px';

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    Object.assign(closeBtn.style, {
        background: 'none',
        border: 'none',
        fontSize: '24px',
        cursor: 'pointer',
        padding: '0 10px'
    });
    closeBtn.onclick = () => document.body.removeChild(modal);

    header.appendChild(title);
    header.appendChild(closeBtn);

    // 中间区域 - 设备信息/操作区
    const deviceInfoArea = document.createElement('div');
    deviceInfoArea.id = 'deviceInfoArea';
    deviceInfoArea.style.marginBottom = '20px';

    // 底部区域 - 操作按钮
    const actionButton = document.createElement('button');
    Object.assign(actionButton.style, {
        width: '100%',
        padding: '8px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        cursor: 'pointer'
    });

    // 根据连接状态显示不同内容
    if (isConnected) {
        // 断开连接界面
        title.textContent = '已连接设备';
        
        const deviceStatus = document.createElement('div');
        deviceStatus.innerHTML = `
            <div style="padding: 15px; background: #f9f9f9; border-radius: 4px; margin-bottom: 15px;">
                <div style="font-weight: bold; margin-bottom: 5px;">Micro:bit</div>
                <div style="font-size: 0.8em; color: #666;">${currentDevice?.comPort || '未知端口'}</div>
                <div style="margin-top: 10px; color: #4CAF50;">
                    <span style="display: inline-block; width: 8px; height: 8px; background: #4CAF50; border-radius: 50%; margin-right: 5px;"></span>
                    已连接
                </div>
            </div>
        `;
        
        deviceInfoArea.appendChild(deviceStatus);
        
        // 断开按钮设置
        actionButton.textContent = '断开连接';
        actionButton.style.backgroundColor = '#f44336';
        actionButton.style.color = 'white';
        actionButton.onclick = async () => {
            actionButton.textContent = '断开中...';
            actionButton.disabled = true;
            
            try {
                const result = await window.EditorPreload.disconnectUSBDevice();
                if (result.success) {
                    isConnected = false;
                    currentDevice = null;
                    document.body.removeChild(modal);
                    showToast('设备已断开');
                } else {
                    showToast(`断开失败: ${result.error}`);
                }
            } catch (error) {
                showToast(`断开错误: ${error.message}`);
            }
        };
    } else {
        // 连接设备界面
        const deviceList = document.createElement('div');
        deviceList.id = 'deviceList';
        deviceList.style.marginBottom = '20px';
        deviceInfoArea.appendChild(deviceList);
        
        // 刷新按钮设置
        actionButton.textContent = '刷新';
        actionButton.style.backgroundColor = '#f0f0f0';
        actionButton.onclick = async () => {
            actionButton.textContent = '刷新中...';
            await loadDevices();
            actionButton.textContent = '刷新';
        };
        
        // 加载设备列表函数
        const loadDevices = async () => {
            deviceList.innerHTML = '';
            
            const result = await window.EditorPreload.requestUSBPermission();
            if (!result.success || !result.devices.length) {
                const emptyMsg = document.createElement('div');
                emptyMsg.textContent = '未检测到设备';
                emptyMsg.style.padding = '10px';
                emptyMsg.style.textAlign = 'center';
                emptyMsg.style.color = '#888';
                deviceList.appendChild(emptyMsg);
                return;
            }

            result.devices.forEach(device => {
                const deviceItem = document.createElement('div');
                Object.assign(deviceItem.style, {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px',
                    marginBottom: '8px',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '4px'
                });

                const deviceInfo = document.createElement('div');
                deviceInfo.style.flex = '1';
                
                const deviceName = document.createElement('div');
                deviceName.textContent = 'Micro:bit';
                deviceName.style.fontWeight = 'bold';
                
                const comPort = document.createElement('div');
                comPort.textContent = device.comPort || '';
                comPort.style.fontSize = '0.8em';
                comPort.style.color = '#666';
                
                deviceInfo.appendChild(deviceName);
                deviceInfo.appendChild(comPort);

                const connectBtn = document.createElement('button');
                connectBtn.textContent = '连接';
                Object.assign(connectBtn.style, {
                    padding: '5px 10px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer'
                });

                connectBtn.onclick = async () => {
                    connectBtn.textContent = '连接中...';
                    connectBtn.disabled = true;

                    const connectResult = await window.EditorPreload.connectUSBDevice(device);
                    if (connectResult.success) {
                        isConnected = true;
                        currentDevice = device;
                        document.body.removeChild(modal);
                        showToast('设备连接成功');
                        //此处可以增加一个判断，根据实际情况选择是否进入repl模式
                        //await enterReplMode();
                    } else {
                        showToast(`连接失败: ${connectResult.error}`);
                        connectBtn.textContent = '连接';
                        connectBtn.disabled = false;
                    }
                };

                deviceItem.appendChild(deviceInfo);
                deviceItem.appendChild(connectBtn);
                deviceList.appendChild(deviceItem);
            });
        };

        await loadDevices();
    }

    // 组装弹窗
    modalContent.appendChild(header);
    modalContent.appendChild(deviceInfoArea);
    modalContent.appendChild(actionButton);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

// 显示Toast提示
function showToast(message) {
    const toast = document.createElement('div');
    Object.assign(toast.style, {
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#333',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '4px',
        zIndex: '1001',
        animation: 'fadeInOut 3s'
    });
    console.log(message)
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { opacity: 0; }
    }
`;
document.head.appendChild(style);

//进度条显示
let progressBar = null;
let progressBarContainer = null;

function showProgress(msg) {
    // 确保msg在0-100范围内
    const progress = Math.min(100, Math.max(0, msg));
    
    // 如果进度条不存在则创建
    if (!progressBar) {
        createProgressBar();
    }
    
    // 更新进度显示
    progressBar.style.width = `${progress}%`;
    progressBar.setAttribute('data-progress', progress);
    
    // 自动隐藏逻辑（当进度完成时）
    if (progress >= 100) {
        setTimeout(() => {
            if (progressBarContainer) {
                progressBarContainer.style.opacity = '0';
                setTimeout(() => {
                    progressBarContainer.remove();
                    progressBar = null;
                    progressBarContainer = null;
                }, 500);
            }
        }, 1000);
    }
}

function createProgressBar() {
    // 创建容器
    progressBarContainer = document.createElement('div');
    Object.assign(progressBarContainer.style, {
        position: 'fixed',
        top: '30%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '300px',
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: '4px',
        padding: '10px',
        zIndex: '1001',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        transition: 'opacity 0.5s ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    });

    // 创建文本标签
    const progressText = document.createElement('div');
    progressText.textContent = '下载中...';
    progressText.style.color = 'white';
    progressText.style.marginBottom = '8px';
    progressText.style.fontSize = '14px';
    progressText.id = 'progress-text';

    // 创建进度条背景
    const progressTrack = document.createElement('div');
    Object.assign(progressTrack.style, {
        width: '100%',
        height: '6px',
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: '3px',
        overflow: 'hidden'
    });

    // 创建进度条前景
    progressBar = document.createElement('div');
    Object.assign(progressBar.style, {
        height: '100%',
        width: '0%',
        backgroundColor: '#4CAF50',
        borderRadius: '3px',
        transition: 'width 0.3s ease',
        position: 'relative'
    });

    // 添加百分比标签
    const percentLabel = document.createElement('span');
    percentLabel.style.position = 'absolute';
    percentLabel.style.right = '4px';
    percentLabel.style.top = '50%';
    percentLabel.style.transform = 'translateY(-50%)';
    percentLabel.style.color = 'white';
    percentLabel.style.fontSize = '10px';
    //percentLabel.textContent = '0%';
    progressBar.appendChild(percentLabel);

    // 组装元素
    progressTrack.appendChild(progressBar);
    progressBarContainer.appendChild(progressText);
    progressBarContainer.appendChild(progressTrack);
    document.body.appendChild(progressBarContainer);

    // 添加鼠标悬停效果
    progressBarContainer.addEventListener('mouseenter', () => {
        progressBarContainer.style.backgroundColor = 'rgba(0,0,0,0.9)';
    });
    
    progressBarContainer.addEventListener('mouseleave', () => {
        progressBarContainer.style.backgroundColor = 'rgba(0,0,0,0.7)';
    });

    // 动态更新百分比标签
    const observer = new MutationObserver(() => {
        const progress = progressBar.getAttribute('data-progress') || '0';
        //percentLabel.textContent = `${progress}%`;
        
        // 根据进度改变颜色
        if (progress < 30) {
            progressBar.style.backgroundColor = '#FF5722';
        } else if (progress < 70) {
            progressBar.style.backgroundColor = '#FFC107';
        } else {
            progressBar.style.backgroundColor = '#4CAF50';
        }
    });
    
    observer.observe(progressBar, { 
        attributes: true, 
        attributeFilter: ['data-progress'] 
    });
}

//添加进度条动画样式
if (!document.getElementById('progress-bar-styles')) {
    const style = document.createElement('style');
    style.id = 'progress-bar-styles';
    style.textContent = `
        @keyframes progress-pulse {
            0% { opacity: 0.8; }
            50% { opacity: 1; }
            100% { opacity: 0.8; }
        }
        
        .progress-complete {
            animation: progress-pulse 1.5s infinite;
        }
    `;
    document.head.appendChild(style);
}





// 进入REPL模式
async function enterReplMode() {
    // if (!isConnected) return;
    console.log("开始进入REPL模式……")
    // 进入REPL模式
    const result = await window.EditorPreload.enterReplMode();
    console.log(result) 
    if (result.success) {
        isReplMode = true;
        showToast('REPL模式已激活');

    }
}

window.EditorPreload.onUSBDeviceEvent((status, device, msg) => {
    if (status === 'connected') {
        console.log('设备连接:', device);
    } else if (status === 'disconnected') {
        console.warn('设备断开:', device);
        isConnected = false;
        showToast('设备断开');
    } else if (status === 'error') {
        console.error('设备通信错误:', msg);
    }else if(status === 'progress'){//烧录进度
        showProgress(msg)
    }
  });
  

  
  

module.exports = MicrobiteIcreateP;