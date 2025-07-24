/*microbit 主板扩展 */
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');
const currentMode = require('../../util/mode')
class MicrobitIcreate { 

    constructor(runtime){
        this.runtime=runtime

        this.mode=true
        this.channelMode=new BroadcastChannel('mode')
        this.channelMode.addEventListener('message',(event)=>{
            this.mode=event.data
            currentMode.setMode(event.data)
        })
    }
    getInfo() {
      return {
        id: 'MicrobitIcreate',
        name: formatMessage({
            id: 'MicrobitIcreate.name',
            default: 'Micro:bit V2 Mainboard',
            description: 'MicrobitIcreate.name'
        }),
        //模块
        // blocks: [
        //   {
        //     blockType: BlockType.LABEL,
        //     // text: "点阵",
        //     text: formatMessage({
        //         id: 'MicrobitIcreate.labelMatrix',
        //         default: '点阵',
        //         description: 'MicrobitIcreate.labelMatrix'
        //     }),
        //   },
        //   {
        //     opcode: 'ICM_showImage',//显示图像
        //     blockType: BlockType.COMMAND,
        //     // text: '显示图片[IMAGE]',
        //     text: formatMessage({
        //         id: 'MicrobitIcreate.ICM_showImage',
        //         default: '显示图片[IMAGE]',
        //         description: 'MicrobitIcreate.ICM_showImage'
        //     }),
        //     arguments: { 
        //         IMAGE: {
        //             type: ArgumentType.STRING,
        //             menu: 'choice_DisplayImage'
        //         }
        //     }
        //   },
        //   {
        //     opcode: 'ICM_showSelfImage',//显示自定义图像
        //     blockType: BlockType.COMMAND,
        //     // text: '显示图标[MATRIX]',
        //     text: formatMessage({
        //         id: 'MicrobitIcreate.ICM_showSelfImage',
        //         default: '显示图标[MATRIX]',
        //         description: 'MicrobitIcreate.ICM_showSelfImage'
        //     }),
        //     arguments: {
        //         MATRIX: {
        //             type: ArgumentType.MATRIX,
        //             defaultValue: "0101011111111110111000100"
        //         }
        //     }
        //   },
        //   {
        //     opcode: 'ICM_showString',//显示字符串
        //     blockType: BlockType.COMMAND,
        //     text: '显示字符串[TEXT]',
        //     arguments: {
        //         TEXT: {
        //             type: ArgumentType.STRING,
        //             defaultValue: 'hello'
        //         }
        //     }
        //   },
        //   {
        //     opcode: 'ICM_scrollShowString',//滚动显示字符串
        //     blockType: BlockType.COMMAND,
        //     text: '滚动显示字符串[TEXT]',
        //     arguments: {
        //         TEXT: {
        //             type: ArgumentType.STRING,
        //             defaultValue: 'hello'
        //         }
        //     }
        //   },
        //   {
        //     opcode: 'ICM_setPixel',//设置像素
        //     blockType: BlockType.COMMAND,
        //     text: '设置像素 x[X] y[Y] 亮度[L]',
        //     arguments: {
        //         X: {
        //             type: ArgumentType.NUMRES0_4,
        //             defaultValue: 0
        //         },
        //         Y: {
        //             type: ArgumentType.NUMRES0_4,
        //             defaultValue: 0
        //         },
        //         L: {
        //             type: ArgumentType.NUMRES0_9,
        //             defaultValue: 9
        //         }
        //     },
        //   },
        // //我一定会回来的~~~
        // //   {
        // //     opcode: 'ICM_showOff',//启用/禁用点阵
        // //     blockType: BlockType.COMMAND,
        // //     text: '[CHOICE]点阵',
        // //     arguments: {
        // //         CHOICE: {
        // //             type: ArgumentType.STRING,
        // //             menu: 'choice_DisplayOFF'
        // //         }
        // //     }
        // //   },
        //   {
        //     opcode: 'ICM_showClear',//清除显示
        //     blockType: BlockType.COMMAND,
        //     text: '清除显示'
        //   },

        //   {
        //     blockType: BlockType.LABEL,
        //     text: "传感器",
        //   },
        //   {
        //     opcode: 'ICM_buttonPressed',//按键按下
        //     blockType: BlockType.BOOLEAN,
        //     text: '当按钮[CHOICE]被按下时',
        //     disableMonitor: true,
        //     arguments: {
        //         CHOICE: {
        //             type: ArgumentType.STRING,
        //             menu: 'choice_Button'
        //         }
        //     }
        //   },
        //   {
        //     opcode: 'ICM_light',//亮度
        //     blockType: BlockType.REPORTER,
        //     text: '亮度',
        //     disableMonitor: true
        //   },
        //   {
        //     opcode: 'ICM_temperature',//温度
        //     blockType: BlockType.REPORTER,
        //     text: '温度',
        //     disableMonitor: true
        //   },
        //   {
        //     opcode: 'ICM_soundLevel',//声音
        //     blockType: BlockType.REPORTER,
        //     text: '声音',
        //     disableMonitor: true
        //   },
        //   {
        //     opcode: 'ICM_compassCalibrate',//指南针 校准
        //     blockType: BlockType.COMMAND,
        //     text: '指南针 校准'
        //   },
        //   {
        //     opcode: 'ICM_compassHeading',//指南针朝向
        //     blockType: BlockType.REPORTER,
        //     text: '指南针朝向',
        //     disableMonitor: true
        //   },
        //   {
        //     opcode: 'ICM_magnetStrength',//磁力
        //     blockType: BlockType.REPORTER,
        //     text: '磁力[CHOICE]',
        //     disableMonitor: true,
        //     arguments: {
        //         CHOICE: {
        //             type: ArgumentType.STRING,
        //             menu: 'choice_MagnetStrength'
        //         }
        //     }
        //   },
        //   {
        //     opcode: 'ICM_accelerometerGesture',//姿势
        //     blockType: BlockType.BOOLEAN,
        //     text: '[CHOICE]手势？',
        //     disableMonitor: true,
        //     arguments: {
        //         CHOICE: {
        //             type: ArgumentType.STRING,
        //             menu: 'choice_Gesture'
        //         }
        //     }
        //   },
        //   {
        //     opcode: 'ICM_accelerometer',//加速度
        //     blockType: BlockType.REPORTER,
        //     text: '加速度[CHOICE]',
        //     disableMonitor: true,
        //     arguments: {
        //         CHOICE: {
        //             type: ArgumentType.STRING,
        //             menu: 'choice_Accelerometer'
        //         }
        //     }
        //   },
        //   {
        //     blockType: BlockType.LABEL,
        //     text: "音乐",
        //   },
        //   {
        //     opcode: 'ICM_musicPlay',//播放音乐
        //     blockType: BlockType.COMMAND,
        //     text: '播放音乐[CHOICE]',
        //     arguments: {
        //         CHOICE: {
        //             type: ArgumentType.STRING,
        //             menu: 'choice_MusicPlay'
        //         }
        //     }
        //   },
        //   {
        //     opcode: 'ICM_setTempo',//设置播放速度
        //     blockType: BlockType.COMMAND,
        //     text: '设置播放速度[TEXT]',
        //     arguments: {
        //         TEXT: {
        //             type: ArgumentType.NUMRES40_500,
        //             defaultValue: 120
        //         }
        //     }
        //   },
        //   {
        //     opcode: 'ICM_musicPitch',//播放音调直到结束
        //     blockType: BlockType.COMMAND,
        //     text: '音调 频率[TEXT]持续播放',
        //     arguments: {
        //         TEXT: {
        //             type: ArgumentType.NUMRES20_10000,
        //             defaultValue: 440
        //         }
        //     }
        //   },
        //   {
        //     opcode: 'ICM_musicStop',//停止持续播放
        //     blockType: BlockType.COMMAND,
        //     text: '停止持续播放'
        //   },
        //   {
        //     opcode: 'ICM_speechSay',//语音 说
        //     blockType: BlockType.COMMAND,
        //     text: '语音 说[TEXT]',
        //     arguments: {
        //         TEXT: {
        //             type: ArgumentType.STRING,
        //             defaultValue: 'Hello, world. How are you?'
        //         }
        //     }
        //   },
        //   {
        //     opcode: 'ICM_audioPlay',//播放富有表现力的声音
        //     blockType: BlockType.COMMAND,
        //     text: '播放富有表现力的声音[CHOICE]',
        //     arguments: {
        //         CHOICE: {
        //             type: ArgumentType.STRING,
        //             menu: 'choice_AudioPlay'
        //         }
        //     }
        //   },
        //   {
        //     opcode: 'ICM_setVolume',//音量
        //     blockType: BlockType.COMMAND,
        //     text: '设置音量[TEXT]',
        //     arguments: {
        //         TEXT: {
        //             type: ArgumentType.NUMRES0_255,
        //             defaultValue: 128
        //         }  
        //     }
        //   },
        //   {
        //     opcode: 'ICM_speakerOff',//关闭、启用扬声器
        //     blockType: BlockType.COMMAND,
        //     text: '[CHOICE]扬声器',
        //     arguments: {
        //         CHOICE: {
        //             type: ArgumentType.STRING,
        //             menu: 'choice_SpeakerOff'
        //         }
        //     }
        //   }
        // ],

        blocks: [
            {
                blockType: BlockType.LABEL,
                text: formatMessage({
                id: 'MicrobitIcreate.labelMatrix',
                default: 'Matrix',
                description: 'MicrobitIcreate.labelMatrix'
                }),
            },
            {
                opcode: 'ICM_showImage',
                blockType: BlockType.COMMAND,
                text: formatMessage({
                id: 'MicrobitIcreate.ICM_showImage',
                default: 'Display Image [IMAGE]',
                description: 'MicrobitIcreate.ICM_showImage'
                }),
                arguments: { 
                IMAGE: {
                    type: ArgumentType.STRING,
                    menu: 'choice_DisplayImage'
                }
                }
            },
            {
                opcode: 'ICM_showSelfImage',
                blockType: BlockType.COMMAND,
                text: formatMessage({
                id: 'MicrobitIcreate.ICM_showSelfImage',
                default: 'Display Icon [MATRIX]',
                description: 'MicrobitIcreate.ICM_showSelfImage'
                }),
                arguments: {
                MATRIX: {
                    type: ArgumentType.MATRIX,
                    defaultValue: "0101011111111110111000100"
                }
                }
            },
            {
                opcode: 'ICM_showString',
                blockType: BlockType.COMMAND,
                text: formatMessage({
                id: 'MicrobitIcreate.ICM_showString',
                default: 'Display String [TEXT]',
                description: 'MicrobitIcreate.ICM_showString'
                }),
                arguments: {
                TEXT: {
                    type: ArgumentType.STRING,
                    defaultValue: 'hello'
                }
                }
            },
            {
                opcode: 'ICM_scrollShowString',
                blockType: BlockType.COMMAND,
                text: formatMessage({
                id: 'MicrobitIcreate.ICM_scrollShowString',
                default: 'Scroll Display String [TEXT]',
                description: 'MicrobitIcreate.ICM_scrollShowString'
                }),
                arguments: {
                TEXT: {
                    type: ArgumentType.STRING,
                    defaultValue: 'hello'
                }
                }
            },
            {
                opcode: 'ICM_setPixel',
                blockType: BlockType.COMMAND,
                text: formatMessage({
                id: 'MicrobitIcreate.ICM_setPixel',
                default: 'Set Pixel x[X] y[Y] Brightness[L]',
                description: 'MicrobitIcreate.ICM_setPixel'
                }),
                arguments: {
                X: {
                    type: ArgumentType.NUMRES0_4,
                    defaultValue: 0
                },
                Y: {
                    type: ArgumentType.NUMRES0_4,
                    defaultValue: 0
                },
                L: {
                    type: ArgumentType.NUMRES0_9,
                    defaultValue: 9
                }
                },
            },
            {
                opcode: 'ICM_showClear',
                blockType: BlockType.COMMAND,
                text: formatMessage({
                id: 'MicrobitIcreate.ICM_showClear',
                default: 'Clear Display',
                description: 'MicrobitIcreate.ICM_showClear'
                })
            },
            {
                blockType: BlockType.LABEL,
                text: formatMessage({
                id: 'MicrobitIcreate.labelSensor',
                default: 'Sensor',
                description: 'MicrobitIcreate.labelSensor'
                }),
            },
            {
                opcode: 'ICM_buttonPressed',
                blockType: BlockType.BOOLEAN,
                text: formatMessage({
                id: 'MicrobitIcreate.ICM_buttonPressed',
                default: 'When Button [CHOICE] Pressed',
                description: 'MicrobitIcreate.ICM_buttonPressed'
                }),
                disableMonitor: true,
                arguments: {
                CHOICE: {
                    type: ArgumentType.STRING,
                    menu: 'choice_Button'
                }
                }
            },
            {
                opcode: 'ICM_light',
                blockType: BlockType.REPORTER,
                text: formatMessage({
                id: 'MicrobitIcreate.ICM_light',
                default: 'Brightness',
                description: 'MicrobitIcreate.ICM_light'
                }),
                disableMonitor: true
            },
            {
                opcode: 'ICM_temperature',
                blockType: BlockType.REPORTER,
                text: formatMessage({
                id: 'MicrobitIcreate.ICM_temperature',
                default: 'Temperature',
                description: 'MicrobitIcreate.ICM_temperature'
                }),
                disableMonitor: true
            },
            {
                opcode: 'ICM_soundLevel',
                blockType: BlockType.REPORTER,
                text: formatMessage({
                id: 'MicrobitIcreate.ICM_soundLevel',
                default: 'Sound',
                description: 'MicrobitIcreate.ICM_soundLevel'
                }),
                disableMonitor: true
            },
            {
                opcode: 'ICM_compassCalibrate',
                blockType: BlockType.COMMAND,
                text: formatMessage({
                id: 'MicrobitIcreate.ICM_compassCalibrate',
                default: 'Compass Calibrate',
                description: 'MicrobitIcreate.ICM_compassCalibrate'
                })
            },
            {
                opcode: 'ICM_compassHeading',
                blockType: BlockType.REPORTER,
                text: formatMessage({
                id: 'MicrobitIcreate.ICM_compassHeading',
                default: 'Compass Heading',
                description: 'MicrobitIcreate.ICM_compassHeading'
                }),
                disableMonitor: true
            },
            {
                opcode: 'ICM_magnetStrength',
                blockType: BlockType.REPORTER,
                text: formatMessage({
                id: 'MicrobitIcreate.ICM_magnetStrength',
                default: 'Magnetic Strength [CHOICE]',
                description: 'MicrobitIcreate.ICM_magnetStrength'
                }),
                disableMonitor: true,
                arguments: {
                CHOICE: {
                    type: ArgumentType.STRING,
                    menu: 'choice_MagnetStrength'
                }
                }
            },
            {
                opcode: 'ICM_accelerometerGesture',
                blockType: BlockType.BOOLEAN,
                text: formatMessage({
                id: 'MicrobitIcreate.ICM_accelerometerGesture',
                default: '[CHOICE] Gesture?',
                description: 'MicrobitIcreate.ICM_accelerometerGesture'
                }),
                disableMonitor: true,
                arguments: {
                CHOICE: {
                    type: ArgumentType.STRING,
                    menu: 'choice_Gesture'
                }
                }
            },
            {
                opcode: 'ICM_accelerometer',
                blockType: BlockType.REPORTER,
                text: formatMessage({
                id: 'MicrobitIcreate.ICM_accelerometer',
                default: 'Acceleration [CHOICE]',
                description: 'MicrobitIcreate.ICM_accelerometer'
                }),
                disableMonitor: true,
                arguments: {
                CHOICE: {
                    type: ArgumentType.STRING,
                    menu: 'choice_Accelerometer'
                }
                }
            },
            {
                blockType: BlockType.LABEL,
                text: formatMessage({
                id: 'MicrobitIcreate.labelMusic',
                default: 'Music',
                description: 'MicrobitIcreate.labelMusic'
                }),
            },
            {
                opcode: 'ICM_musicPlay',
                blockType: BlockType.COMMAND,
                text: formatMessage({
                id: 'MicrobitIcreate.ICM_musicPlay',
                default: 'Play Music [CHOICE]',
                description: 'MicrobitIcreate.ICM_musicPlay'
                }),
                arguments: {
                CHOICE: {
                    type: ArgumentType.STRING,
                    menu: 'choice_MusicPlay'
                }
                }
            },
            {
                opcode: 'ICM_setTempo',
                blockType: BlockType.COMMAND,
                text: formatMessage({
                id: 'MicrobitIcreate.ICM_setTempo',
                default: 'Set Playback Speed [TEXT]',
                description: 'MicrobitIcreate.ICM_setTempo'
                }),
                arguments: {
                TEXT: {
                    type: ArgumentType.NUMRES40_500,
                    defaultValue: 120
                }
                }
            },
            {
                opcode: 'ICM_musicPitch',
                blockType: BlockType.COMMAND,
                text: formatMessage({
                id: 'MicrobitIcreate.ICM_musicPitch',
                default: 'Tone Frequency [TEXT] Continuous Play',
                description: 'MicrobitIcreate.ICM_musicPitch'
                }),
                arguments: {
                TEXT: {
                    type: ArgumentType.NUMRES20_10000,
                    defaultValue: 440
                }
                }
            },
            {
                opcode: 'ICM_musicStop',
                blockType: BlockType.COMMAND,
                text: formatMessage({
                id: 'MicrobitIcreate.ICM_musicStop',
                default: 'Stop Continuous Play',
                description: 'MicrobitIcreate.ICM_musicStop'
                })
            },
            {
                opcode: 'ICM_speechSay',
                blockType: BlockType.COMMAND,
                text: formatMessage({
                id: 'MicrobitIcreate.ICM_speechSay',
                default: 'Speech Say [TEXT]',
                description: 'MicrobitIcreate.ICM_speechSay'
                }),
                arguments: {
                TEXT: {
                    type: ArgumentType.STRING,
                    defaultValue: 'Hello, world. How are you?'
                }
                }
            },
            {
                opcode: 'ICM_audioPlay',
                blockType: BlockType.COMMAND,
                text: formatMessage({
                id: 'MicrobitIcreate.ICM_audioPlay',
                default: 'Play Expressive Sound [CHOICE]',
                description: 'MicrobitIcreate.ICM_audioPlay'
                }),
                arguments: {
                CHOICE: {
                    type: ArgumentType.STRING,
                    menu: 'choice_AudioPlay'
                }
                }
            },
            {
                opcode: 'ICM_setVolume',
                blockType: BlockType.COMMAND,
                text: formatMessage({
                id: 'MicrobitIcreate.ICM_setVolume',
                default: 'Set Volume [TEXT]',
                description: 'MicrobitIcreate.ICM_setVolume'
                }),
                arguments: {
                TEXT: {
                    type: ArgumentType.NUMRES0_255,
                    defaultValue: 128
                }  
                }
            },
            {
                opcode: 'ICM_speakerOff',
                blockType: BlockType.COMMAND,
                text: formatMessage({
                id: 'MicrobitIcreate.ICM_speakerOff',
                default: '[CHOICE] Speaker',
                description: 'MicrobitIcreate.ICM_speakerOff'
                }),
                arguments: {
                CHOICE: {
                    type: ArgumentType.STRING,
                    menu: 'choice_SpeakerOff'
                }
                }
            }
            ],




        //    menus: {
        //         choice_DisplayImage: {
        //             acceptReporters: false,
        //             items: [
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_DisplayImage.heart',
        //                         default: '心形',
        //                         description: 'MicrobitIcreate.choice_DisplayImage.heart'
        //                     }),
        //                     value: 'HEART' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_DisplayImage.heartSmall',
        //                         default: '心形_小',
        //                         description: 'MicrobitIcreate.choice_DisplayImage.heartSmall'
        //                     }),
        //                     value: 'HEART_SMALL' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_DisplayImage.happy',
        //                         default: '快乐',
        //                         description: 'MicrobitIcreate.choice_DisplayImage.happy'
        //                     }),
        //                     value: 'HAPPY' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_DisplayImage.smile',
        //                         default: '微笑',
        //                         description: 'MicrobitIcreate.choice_DisplayImage.smile'
        //                     }),
        //                     value: 'SMILE' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_DisplayImage.sad',
        //                         default: '悲伤',
        //                         description: 'MicrobitIcreate.choice_DisplayImage.sad'
        //                     }),
        //                     value: 'SAD' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_DisplayImage.confused',
        //                         default: '困惑',
        //                         description: 'MicrobitIcreate.choice_DisplayImage.confused'
        //                     }),
        //                     value: 'CONFUSED' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_DisplayImage.angry',
        //                         default: '生气',
        //                         description: 'MicrobitIcreate.choice_DisplayImage.angry'
        //                     }),
        //                     value: 'ANGRY' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_DisplayImage.asleep',
        //                         default: '睡着',
        //                         description: 'MicrobitIcreate.choice_DisplayImage.asleep'
        //                     }),
        //                     value: 'ASLEEP' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_DisplayImage.surprised',
        //                         default: '惊讶',
        //                         description: 'MicrobitIcreate.choice_DisplayImage.surprised'
        //                     }),
        //                     value: 'SURPRISED' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_DisplayImage.silly',
        //                         default: '傻傻的',
        //                         description: 'MicrobitIcreate.choice_DisplayImage.silly'
        //                     }),
        //                     value: 'SILLY' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_DisplayImage.fabulous',
        //                         default: '极好的',
        //                         description: 'MicrobitIcreate.choice_DisplayImage.fabulous'
        //                     }),
        //                     value: 'FABULOUS' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_DisplayImage.yes',
        //                         default: '是',
        //                         description: 'MicrobitIcreate.choice_DisplayImage.yes'
        //                     }),
        //                     value: 'YES' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_DisplayImage.no',
        //                         default: '否',
        //                         description: 'MicrobitIcreate.choice_DisplayImage.no'
        //                     }),
        //                     value: 'NO' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_DisplayImage.meh',
        //                         default: '不感兴趣的',
        //                         description: 'MicrobitIcreate.choice_DisplayImage.meh'
        //                     }),
        //                     value: 'MEH' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_DisplayImage.duck',
        //                         default: '鸭子',
        //                         description: 'MicrobitIcreate.choice_DisplayImage.duck'
        //                     }),
        //                     value: 'DUCK' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_DisplayImage.giraffe',
        //                         default: '长颈鹿',
        //                         description: 'MicrobitIcreate.choice_DisplayImage.giraffe'
        //                     }),
        //                     value: 'GIRAFFE' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_DisplayImage.pacman',
        //                         default: '吃豆人',
        //                         description: 'MicrobitIcreate.choice_DisplayImage.pacman'
        //                     }),
        //                     value: 'PACMAN' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_DisplayImage.ghost',
        //                         default: '幽灵',
        //                         description: 'MicrobitIcreate.choice_DisplayImage.ghost'
        //                     }),
        //                     value: 'GHOST' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_DisplayImage.skull',
        //                         default: '骷髅',
        //                         description: 'MicrobitIcreate.choice_DisplayImage.skull'
        //                     }),
        //                     value: 'SKULL' 
        //                 }
        //             ]
        //         },
        //         choice_DisplayOFF: {
        //             acceptReporters: false,
        //             items: [
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_DisplayOFF.enable',
        //                         default: '启用',
        //                         description: 'MicrobitIcreate.choice_DisplayOFF.enable'
        //                     }),
        //                     value: '启用' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_DisplayOFF.disable',
        //                         default: '停用',
        //                         description: 'MicrobitIcreate.choice_DisplayOFF.disable'
        //                     }),
        //                     value: '停用' 
        //                 }
        //             ]
        //         },
        //         choice_Button: {
        //             acceptReporters: false,
        //             items: [
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_Button.a',
        //                         default: 'A',
        //                         description: 'MicrobitIcreate.choice_Button.a'
        //                     }),
        //                     value: 'A' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_Button.b',
        //                         default: 'B',
        //                         description: 'MicrobitIcreate.choice_Button.b'
        //                     }),
        //                     value: 'B' 
        //                 }
        //             ]
        //         },
        //         choice_MagnetStrength: {
        //             acceptReporters: false,
        //             items: [
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_MagnetStrength.x',
        //                         default: 'X',
        //                         description: 'MicrobitIcreate.choice_MagnetStrength.x'
        //                     }),
        //                     value: 'get_x' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_MagnetStrength.y',
        //                         default: 'Y',
        //                         description: 'MicrobitIcreate.choice_MagnetStrength.y'
        //                     }),
        //                     value: 'get_y' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_MagnetStrength.z',
        //                         default: 'Z',
        //                         description: 'MicrobitIcreate.choice_MagnetStrength.z'
        //                     }),
        //                     value: 'get_z' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_MagnetStrength.strength',
        //                         default: '强度',
        //                         description: 'MicrobitIcreate.choice_MagnetStrength.strength'
        //                     }),
        //                     value: 'get_field_strength' 
        //                 }
        //             ]
        //         },
        //         choice_Gesture: {
        //             acceptReporters: false,
        //             items: [
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_Gesture.shake',
        //                         default: '摇晃',
        //                         description: 'MicrobitIcreate.choice_Gesture.shake'
        //                     }),
        //                     value: 'shake' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_Gesture.logoUp',
        //                         default: '标志朝上',
        //                         description: 'MicrobitIcreate.choice_Gesture.logoUp'
        //                     }),
        //                     value: 'up' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_Gesture.logoDown',
        //                         default: '标志朝下',
        //                         description: 'MicrobitIcreate.choice_Gesture.logoDown'
        //                     }),
        //                     value: 'down' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_Gesture.faceUp',
        //                         default: '正面朝上',
        //                         description: 'MicrobitIcreate.choice_Gesture.faceUp'
        //                     }),
        //                     value: 'face up' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_Gesture.faceDown',
        //                         default: '正面朝下',
        //                         description: 'MicrobitIcreate.choice_Gesture.faceDown'
        //                     }),
        //                     value: 'face down' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_Gesture.left',
        //                         default: '左',
        //                         description: 'MicrobitIcreate.choice_Gesture.left'
        //                     }),
        //                     value: 'left' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_Gesture.right',
        //                         default: '右',
        //                         description: 'MicrobitIcreate.choice_Gesture.right'
        //                     }),
        //                     value: 'right' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_Gesture.freefall',
        //                         default: '自由落体',
        //                         description: 'MicrobitIcreate.choice_Gesture.freefall'
        //                     }),
        //                     value: 'freefall' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_Gesture.threeG',
        //                         default: '3g',
        //                         description: 'MicrobitIcreate.choice_Gesture.threeG'
        //                     }),
        //                     value: '3g' 
        //                 }
        //             ]
        //         },
        //         choice_Accelerometer: {
        //             acceptReporters: false,
        //             items: [
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_Accelerometer.x',
        //                         default: 'X',
        //                         description: 'MicrobitIcreate.choice_Accelerometer.x'
        //                     }),
        //                     value: 'X' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_Accelerometer.y',
        //                         default: 'Y',
        //                         description: 'MicrobitIcreate.choice_Accelerometer.y'
        //                     }),
        //                     value: 'Y' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_Accelerometer.z',
        //                         default: 'Z',
        //                         description: 'MicrobitIcreate.choice_Accelerometer.z'
        //                     }),
        //                     value: 'Z' 
        //                 }
        //             ]
        //         },
        //         choice_MusicPlay: {
        //             acceptReporters: false,
        //             items: [
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_MusicPlay.baDing',
        //                         default: '鼓点叭叮',
        //                         description: 'MicrobitIcreate.choice_MusicPlay.baDing'
        //                     }),
        //                     value: 'BA_DING' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_MusicPlay.baddy',
        //                         default: '反面角色',
        //                         description: 'MicrobitIcreate.choice_MusicPlay.baddy'
        //                     }),
        //                     value: 'BADDY' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_MusicPlay.birthday',
        //                         default: '生日快乐',
        //                         description: 'MicrobitIcreate.choice_MusicPlay.birthday'
        //                     }),
        //                     value: 'BIRTHDAY' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_MusicPlay.blues',
        //                         default: '布鲁斯',
        //                         description: 'MicrobitIcreate.choice_MusicPlay.blues'
        //                     }),
        //                     value: 'BLUES' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_MusicPlay.chase',
        //                         default: '追逐',
        //                         description: 'MicrobitIcreate.choice_MusicPlay.chase'
        //                     }),
        //                     value: 'CHASE' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_MusicPlay.dadadadum',
        //                         default: '哒哒哒噔',
        //                         description: 'MicrobitIcreate.choice_MusicPlay.dadadadum'
        //                     }),
        //                     value: 'DADADADUM' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_MusicPlay.entertainer',
        //                         default: '演艺人',
        //                         description: 'MicrobitIcreate.choice_MusicPlay.entertainer'
        //                     }),
        //                     value: 'ENTERTAINER' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_MusicPlay.funeral',
        //                         default: '葬礼',
        //                         description: 'MicrobitIcreate.choice_MusicPlay.funeral'
        //                     }),
        //                     value: 'FUNERAL' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_MusicPlay.funk',
        //                         default: '放克音乐',
        //                         description: 'MicrobitIcreate.choice_MusicPlay.funk'
        //                     }),
        //                     value: 'FUNK' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_MusicPlay.jumpDown',
        //                         default: '向下跳',
        //                         description: 'MicrobitIcreate.choice_MusicPlay.jumpDown'
        //                     }),
        //                     value: 'JUMP_DOWN' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_MusicPlay.jumpUp',
        //                         default: '向上跳',
        //                         description: 'MicrobitIcreate.choice_MusicPlay.jumpUp'
        //                     }),
        //                     value: 'JUMP_UP' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_MusicPlay.nyan',
        //                         default: '彩虹猫',
        //                         description: 'MicrobitIcreate.choice_MusicPlay.nyan'
        //                     }),
        //                     value: 'NYAN' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_MusicPlay.ode',
        //                         default: '欢乐颂',
        //                         description: 'MicrobitIcreate.choice_MusicPlay.ode'
        //                     }),
        //                     value: 'ODE' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_MusicPlay.powerDown',
        //                         default: '能力减弱',
        //                         description: 'MicrobitIcreate.choice_MusicPlay.powerDown'
        //                     }),
        //                     value: 'POWER_DOWN' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_MusicPlay.powerUp',
        //                         default: '能力增强',
        //                         description: 'MicrobitIcreate.choice_MusicPlay.powerUp'
        //                     }),
        //                     value: 'POWER_UP' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_MusicPlay.prelude',
        //                         default: '前奏',
        //                         description: 'MicrobitIcreate.choice_MusicPlay.prelude'
        //                     }),
        //                     value: 'PRELUDE' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_MusicPlay.punchline',
        //                         default: '笑点',
        //                         description: 'MicrobitIcreate.choice_MusicPlay.punchline'
        //                     }),
        //                     value: 'PUNCHLINE' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_MusicPlay.python',
        //                         default: 'PYTHON',
        //                         description: 'MicrobitIcreate.choice_MusicPlay.python'
        //                     }),
        //                     value: 'PYTHON' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_MusicPlay.ringtone',
        //                         default: '铃声',
        //                         description: 'MicrobitIcreate.choice_MusicPlay.ringtone'
        //                     }),
        //                     value: 'RINGTONE' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_MusicPlay.wawawawaa',
        //                         default: '哇哇哇哇',
        //                         description: 'MicrobitIcreate.choice_MusicPlay.wawawawaa'
        //                     }),
        //                     value: 'WAWAWAWAA' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_MusicPlay.wedding',
        //                         default: '婚礼',
        //                         description: 'MicrobitIcreate.choice_MusicPlay.wedding'
        //                     }),
        //                     value: 'WEDDING' 
        //                 }
        //             ]
        //         },
        //         choice_AudioPlay: {
        //             acceptReporters: false,
        //             items: [
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_AudioPlay.giggle',
        //                         default: '咯咯笑',
        //                         description: 'MicrobitIcreate.choice_AudioPlay.giggle'
        //                     }),
        //                     value: 'GIGGLE' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_AudioPlay.happy',
        //                         default: '快乐',
        //                         description: 'MicrobitIcreate.choice_AudioPlay.happy'
        //                     }),
        //                     value: 'HAPPY' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_AudioPlay.hello',
        //                         default: '你好',
        //                         description: 'MicrobitIcreate.choice_AudioPlay.hello'
        //                     }),
        //                     value: 'HELLO' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_AudioPlay.mysterious',
        //                         default: '神秘的',
        //                         description: 'MicrobitIcreate.choice_AudioPlay.mysterious'
        //                     }),
        //                     value: 'MYSTERIOUS' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_AudioPlay.sad',
        //                         default: '难过',
        //                         description: 'MicrobitIcreate.choice_AudioPlay.sad'
        //                     }),
        //                     value: 'SAD' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_AudioPlay.slide',
        //                         default: '滑',
        //                         description: 'MicrobitIcreate.choice_AudioPlay.slide'
        //                     }),
        //                     value: 'SLIDE' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_AudioPlay.soaring',
        //                         default: '飙升',
        //                         description: 'MicrobitIcreate.choice_AudioPlay.soaring'
        //                     }),
        //                     value: 'SOARING' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_AudioPlay.spring',
        //                         default: '弹簧',
        //                         description: 'MicrobitIcreate.choice_AudioPlay.spring'
        //                     }),
        //                     value: 'SPRING' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_AudioPlay.twinkle',
        //                         default: '闪烁',
        //                         description: 'MicrobitIcreate.choice_AudioPlay.twinkle'
        //                     }),
        //                     value: 'TWINKLE' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_AudioPlay.yawn',
        //                         default: '打哈欠',
        //                         description: 'MicrobitIcreate.choice_AudioPlay.yawn'
        //                     }),
        //                     value: 'YAWN' 
        //                 }
        //             ]
        //         },
        //         choice_SpeakerOff: {
        //             acceptReporters: false,
        //             items: [
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_SpeakerOff.off',
        //                         default: '关闭',
        //                         description: 'MicrobitIcreate.choice_SpeakerOff.off'
        //                     }),
        //                     value: 'off' 
        //                 },
        //                 { 
        //                     text: formatMessage({
        //                         id: 'MicrobitIcreate.choice_SpeakerOff.on',
        //                         default: '打开',
        //                         description: 'MicrobitIcreate.choice_SpeakerOff.on'
        //                     }),
        //                     value: 'on' 
        //                 }
        //             ]
        //         }
        //     }


        menus: {
            choice_DisplayImage: {//选择显示图像
              acceptReporters: false,
            //   items: ['心形', '心形_小','快乐','微笑','悲伤','困惑','生气','睡着','惊讶','傻傻的','极好的','是','否','不感兴趣的','鸭子','长颈鹿','吃豆人','幽灵','骷髅']
                items:[
                        formatMessage({
                                id: 'MicrobitIcreate.choice_DisplayImage.heart',
                                default: 'Heart',
                                description: 'MicrobitIcreate.choice_DisplayImage.heart'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_DisplayImage.heartSmall',
                            default: 'Small Heart',
                            description: 'MicrobitIcreate.choice_DisplayImage.heartSmall'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_DisplayImage.happy',
                            default: 'Happy',
                            description: 'MicrobitIcreate.choice_DisplayImage.happy'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_DisplayImage.smile',
                            default: 'Smile',
                            description: 'MicrobitIcreate.choice_DisplayImage.smile'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_DisplayImage.sad',
                            default: 'Sad',
                            description: 'MicrobitIcreate.choice_DisplayImage.sad'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_DisplayImage.confused',
                            default: 'Confused',
                            description: 'MicrobitIcreate.choice_DisplayImage.confused'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_DisplayImage.angry',
                            default: 'Angry',
                            description: 'MicrobitIcreate.choice_DisplayImage.angry'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_DisplayImage.asleep',
                            default: 'Asleep',
                            description: 'MicrobitIcreate.choice_DisplayImage.asleep'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_DisplayImage.surprised',
                            default: 'Surprised',
                            description: 'MicrobitIcreate.choice_DisplayImage.surprised'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_DisplayImage.silly',
                            default: 'Silly',
                            description: 'MicrobitIcreate.choice_DisplayImage.silly'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_DisplayImage.fabulous',
                            default: 'Fabulous',
                            description: 'MicrobitIcreate.choice_DisplayImage.fabulous'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_DisplayImage.yes',
                            default: 'Yes',
                            description: 'MicrobitIcreate.choice_DisplayImage.yes'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_DisplayImage.no',
                            default: 'No',
                            description: 'MicrobitIcreate.choice_DisplayImage.no'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_DisplayImage.meh',
                            default: 'Indifferent',
                            description: 'MicrobitIcreate.choice_DisplayImage.meh'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_DisplayImage.duck',
                            default: 'Duck',
                            description: 'MicrobitIcreate.choice_DisplayImage.duck'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_DisplayImage.giraffe',
                            default: 'Giraffe',
                            description: 'MicrobitIcreate.choice_DisplayImage.giraffe'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_DisplayImage.pacman',
                            default: 'Pacman',
                            description: 'MicrobitIcreate.choice_DisplayImage.pacman'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_DisplayImage.ghost',
                            default: 'Ghost',
                            description: 'MicrobitIcreate.choice_DisplayImage.ghost'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_DisplayImage.skull',
                            default: 'Skull',
                            description: 'MicrobitIcreate.choice_DisplayImage.skull'
                        })
                ]
            },
            choice_DisplayOFF: {//选择启用点阵
                acceptReporters: false,
                // items: ['启用', '停用']
                items: [
                        formatMessage({
                            id: 'MicrobitIcreate.choice_DisplayOFF.enable',
                            default: 'Enable',
                            description: 'MicrobitIcreate.choice_DisplayOFF.enable'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_DisplayOFF.disable',
                            default: 'Disable',
                            description: 'MicrobitIcreate.choice_DisplayOFF.disable'
                        }),
                ]
            },
            choice_Button: {//选择按钮
                acceptReporters: false,
                items: ['A', 'B']
            },
            choice_MagnetStrength:{//选择磁力
                acceptReporters: false,
                items: [
                    'X', 
                    'Y',
                    'Z',
                    // '强度'
                    formatMessage({
                        id: 'MicrobitIcreate.choice_MagnetStrength.strength',
                        default: 'Intensity',
                        description: 'MicrobitIcreate.choice_MagnetStrength.strength'
                    }),
                ]
            },
            choice_Gesture:{//选择姿势
                acceptReporters: false,
                // items: ['摇晃', '标志朝上','标志朝下','正面朝上','正面朝下','左','右','自由落体','3g']
                items: [
                        formatMessage({
                            id: 'MicrobitIcreate.choice_Gesture.shake',
                            default: 'Shake',
                            description: 'MicrobitIcreate.choice_Gesture.shake'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_Gesture.logoUp',
                            default: 'Logo Up',
                            description: 'MicrobitIcreate.choice_Gesture.logoUp'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_Gesture.logoDown',
                            default: 'Logo Down',
                            description: 'MicrobitIcreate.choice_Gesture.logoDown'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_Gesture.faceUp',
                            default: 'Face Up',
                            description: 'MicrobitIcreate.choice_Gesture.faceUp'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_Gesture.faceDown',
                            default: 'Face Down',
                            description: 'MicrobitIcreate.choice_Gesture.faceDown'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_Gesture.left',
                            default: 'Left',
                            description: 'MicrobitIcreate.choice_Gesture.left'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_Gesture.right',
                            default: 'Right',
                            description: 'MicrobitIcreate.choice_Gesture.right'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_Gesture.freefall',
                            default: 'Free Fall',
                            description: 'MicrobitIcreate.choice_Gesture.freefall'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_Gesture.threeG',
                            default: '3G',
                            description: 'MicrobitIcreate.choice_Gesture.threeG'
                        })
                    ]
            },
            choice_Accelerometer:{//选择加速度
                acceptReporters: false,
                items: ['X', 'Y','Z']
            },
            choice_MusicPlay:{//选择播放音乐
                acceptReporters: false,
                // items: ['鼓点叭叮', '反面角色','生日快乐','布鲁斯','追逐','哒哒哒噔','演艺人','葬礼','放克音乐','向下跳','向上跳','彩虹猫','欢乐颂','能力减弱','能力增强','前奏','笑点','PYTHON','铃声','哇哇哇哇','婚礼']
                items: [
                         formatMessage({
                            id: 'MicrobitIcreate.choice_MusicPlay.baDing',
                            default: 'Drum Beat',
                            description: 'MicrobitIcreate.choice_MusicPlay.baDing'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_MusicPlay.baddy',
                            default: 'Villain',
                            description: 'MicrobitIcreate.choice_MusicPlay.baddy'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_MusicPlay.birthday',
                            default: 'Happy Birthday',
                            description: 'MicrobitIcreate.choice_MusicPlay.birthday'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_MusicPlay.blues',
                            default: 'Blues',
                            description极: 'MicrobitIcreate.choice_MusicPlay.blues'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_MusicPlay.chase',
                            default: 'Chase',
                            description: 'MicrobitIcreate.choice_MusicPlay.chase'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_MusicPlay.dadadadum',
                            default: 'Da Da Da Dum',
                            description: 'MicrobitIcreate.choice_MusicPlay.dadadadum'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_MusicPlay.entertainer',
                            default: 'Entertainer',
                            description: 'MicrobitIcreate.choice_MusicPlay.entertainer'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_MusicPlay.funeral',
                            default: 'Funeral',
                            description: 'MicrobitIcreate.choice_MusicPlay.funeral'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_MusicPlay.funk',
                            default: 'Funk',
                            description: 'MicrobitIcreate.choice_MusicPlay.funk'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_MusicPlay.jumpDown',
                            default: 'Jump Down',
                            description: 'MicrobitIcreate.choice_MusicPlay.jumpDown'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_MusicPlay.jumpUp',
                            default: 'Jump Up',
                            description: 'MicrobitIcreate.choice_MusicPlay.jumpUp'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_MusicPlay.nyan',
                            default: 'Nyan Cat',
                            description: 'MicrobitIcreate.choice_MusicPlay.nyan'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_MusicPlay.ode',
                            default: 'Ode to Joy',
                            description: 'MicrobitIcreate.choice_MusicPlay.ode'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_MusicPlay.powerDown',
                            default: 'Power Down',
                            description: 'MicrobitIcreate.choice_MusicPlay.powerDown'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_MusicPlay.powerUp',
                            default: 'Power Up',
                            description: 'MicrobitIcreate.choice_MusicPlay.powerUp'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_MusicPlay.prelude',
                            default: 'Prelude',
                            description: 'MicrobitIcreate.choice_MusicPlay.prelude'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_MusicPlay.punchline',
                            default: 'Punchline',
                            description: 'MicrobitIcreate.choice_MusicPlay.punchline'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_MusicPlay.python',
                            default: 'Python',
                            description: 'MicrobitIcreate.choice_MusicPlay.python'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_MusicPlay.ringtone',
                            default: 'Ringtone',
                            description: 'MicrobitIcreate.choice_MusicPlay.ringtone'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_MusicPlay.wawawawaa',
                            default: 'Wah Wah Sound',
                            description: 'MicrobitIcreate.choice_MusicPlay.wawawawaa'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_MusicPlay.wedding',
                            default: 'Wedding',
                            description: 'MicrobitIcreate.choice_MusicPlay.wedding'
                        })
                    ]
            },
            choice_AudioPlay:{//选择富有表现力声音
                acceptReporters: false,
                // items: ['咯咯笑', '快乐','你好','神秘的','难过','滑','飙升','弹簧','闪烁','打哈欠']
                items: [
                        formatMessage({
                            id: 'MicrobitIcreate.choice_AudioPlay.giggle',
                            default: 'Giggle',
                            description: 'MicrobitIcreate.choice_AudioPlay.giggle'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_AudioPlay.happy',
                            default: 'Happy',
                            description: 'MicrobitIcreate.choice_AudioPlay.happy'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_AudioPlay.hello',
                            default: 'Hello',
                            description: 'MicrobitIcreate.choice_AudioPlay.hello'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_AudioPlay.mysterious',
                            default: 'Mysterious',
                            description: 'MicrobitIcreate.choice_AudioPlay.mysterious'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_AudioPlay.sad',
                            default: 'Sad',
                            description: 'MicrobitIcreate.choice_AudioPlay.sad'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_AudioPlay.slide',
                            default: 'Slide',
                            description: 'MicrobitIcreate.choice_AudioPlay.slide'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_AudioPlay.soaring',
                            default: 'Soaring',
                            description: 'MicrobitIcreate.choice_AudioPlay.soaring'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_AudioPlay.spring',
                            default: 'Spring',
                            description: 'MicrobitIcreate.choice_AudioPlay.spring'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_AudioPlay.twinkle',
                            default: 'Twinkle',
                            description: 'MicrobitIcreate.choice_AudioPlay.twinkle'
                        }),
                        formatMessage({
                            id: 'MicrobitIcreate.choice_AudioPlay.yawn',
                            default: 'Yawn',
                            description: 'MicrobitIcreate.choice_AudioPlay.yawn'
                        })
                    ]
            },
            choice_SpeakerOff:{//选择关闭打开扬声器
                acceptReporters: false,
                // items: ['关闭', '打开']
                items: [
                        formatMessage({
                                id: 'MicrobitIcreate.choice_SpeakerOff.off',
                                default: 'Off',
                                description: 'MicrobitIcreate.choice_SpeakerOff.off'
                        }),
                        formatMessage({
                                id: 'MicrobitIcreate.choice_SpeakerOff.on',
                                default: 'On',
                                description: 'MicrobitIcreate.choice_SpeakerOff.on'
                        }),
                    ]
            }
        }
      };
    }



 

    //--------------------显示---------------------------
  
    //显示图像
    async ICM_showImage(args) {
        await ICMB_send(`display.show(Image.${DICT_displayImage[args.IMAGE]})`) ;
        return
    }
    //显示自定义图像
    async ICM_showSelfImage(args){
        let replaced = args.MATRIX.replace(/1/g, '9');// 1替换成9
        let result = replaced.match(/.{1,5}/g).join(':');//每5个字符分割一次
        await ICMB_send(`display.show(Image("${result}"))`) ;
    }
    //显示字符串
    async ICM_showString(args){
        await ICMB_send(`display.show("${args.TEXT}")`) ;
    }
    //滚动显示字符串
    async ICM_scrollShowString(args){
        await ICMB_send(`display.scroll("${args.TEXT}")`) ;
    }
    //设置像素
    async ICM_setPixel(args){
        await ICMB_send(`display.set_pixel(${args.X},${args.Y},${args.L})`) ;
    }
    //启用/禁用点阵
    // ICM_showOff(args){
    //     let code='';
    //     if(args.CHOICE == '启用'){
    //         code = "on"
    //     }else if(args.CHOICE == '停用'){
    //         code = "off"
    //     }
    //     ICMB_send(`display.${code}()`) ;
    // }
    //清除显示
    async ICM_showClear(){
        await ICMB_send(`display.clear()`) ;
    }

    //-----------------------传感器----------------------------------------
    //按钮
    ICM_buttonPressed(args){
        let code='';
        if(args.CHOICE == 'A'){
            code = "button_a"
        }else if(args.CHOICE == 'B'){
            code = "button_b"
        }
        return ICMB_read(`${code}.is_pressed()`) ;
    }
    //亮度
    ICM_light(){
        return ICMB_read(`display.read_light_level()`) ; 
    }
    //温度
    ICM_temperature(){
        return ICMB_read(`temperature()`) ; 
    }
    //声音
    ICM_soundLevel(){
        return ICMB_read(`microphone.sound_level()`) ; 
    }
    //指南针校准
    async ICM_compassCalibrate(){
        await ICMB_send(`compass.calibrate()`); 
    }
    //指南针朝向
    ICM_compassHeading(){
        return ICMB_read(`compass.heading()`) ; 
    }
    //磁力
    ICM_magnetStrength(args){
        return ICMB_read(`compass.${DICT_magnetStrengthPlay[args.CHOICE]}()`) ; 
    }
    //手势
    ICM_accelerometerGesture(args){
        return ICMB_read(`accelerometer.was_gesture("${DICT_gesturePlay[args.CHOICE]}")`);
    }
    //加速度
    ICM_accelerometer(args){
        let code='';
        if(args.CHOICE == 'X'){
            code = "get_x"
        }else if(args.CHOICE == 'Y'){
            code = "get_y"
        }else if(args.CHOICE == 'Z'){
            code = "get_z"
        }
        return ICMB_read(`accelerometer.${code}()`) ; 
    }

    // -----------------------音乐---------------------------------------
    //播放音乐
    async ICM_musicPlay(args){
        //import music
        let code=DICT_musicPlay[args.CHOICE];
        await ICMB_send(`music.play(music.${code})`)
    }
    //设置播放速度
    async ICM_setTempo(args){
        //import music
        await ICMB_send(`music.set_tempo(bpm=${args.TEXT})`)
    }
    //音调 频率持续播放
    async ICM_musicPitch(args){
        //import music
        await ICMB_send(`music.pitch(${args.TEXT})`)
    }
    //停止持续播放
    async ICM_musicStop(args){
        //import music
        await ICMB_send(`music.stop()`)
    }
    //语音 说
    async ICM_speechSay(args){
        //import speech
        await ICMB_send(`speech.say("${args.TEXT}")`)
    }
    //播放富有表现力的声音
    async ICM_audioPlay(args){
        let code=DICT_audioPlay[args.CHOICE];
        await ICMB_send(`audio.play(Sound.${code})`)
    }
    //音量
    async ICM_setVolume(args){
        await ICMB_send(`set_volume(${args.TEXT})`)
    }
    //关闭、启用扬声器
    async ICM_speakerOff(args){
        await ICMB_send(`speaker.${DICT_speakerPlay[args.CHOICE]}()`)
    }


    
}





// let DICT_displayImage = {'心形':"HEART",
// '心形_小':"HEART_SMALL",
// '快乐':"HAPPY",
// '微笑':"SMILE",
// '悲伤':"SAD",
// '困惑':"CONFUSED",
// '生气':"ANGRY",
// '睡着':"ASLEEP",
// '惊讶':"SURPRISED",
// '傻傻的':"SILLY",
// '极好的':"FABULOUS",
// '是':"YES",
// '否':"NO",
// '不感兴趣的':"MEH",
// '鸭子':"DUCK",
// '长颈鹿':"GIRAFFE",
// '吃豆人':"PACMAN",
// '幽灵':"GHOST",
// '骷髅':"SKULL"
// }

// let DICT_musicPlay = {'鼓点叭叮':"BA_DING",
// '反面角色':"BADDY",
// '生日快乐':"BIRTHDAY",
// '布鲁斯':"BLUES",
// '追逐':"CHASE",
// '哒哒哒噔':"DADADADUM",
// '演艺人':"ENTERTAINER",
// '葬礼':"FUNERAL",
// '放克音乐':"FUNK",
// '向下跳':"JUMP_DOWN",
// '向上跳':"JUMP_UP",
// '彩虹猫':"NYAN",
// '欢乐颂':"ODE",
// '能力减弱':"POWER_DOWN",
// '能力增强':"POWER_UP",
// '前奏':"PRELUDE",
// '笑点':"PUNCHLINE",
// 'PYTHON':"PYTHON",
// '铃声':"RINGTONE",
// '哇哇哇哇':"WAWAWAWAA",
// '婚礼':"WEDDING"
// }

// let DICT_audioPlay = {'咯咯笑':"GIGGLE",
// '快乐':"HAPPY",
// '你好':"HELLO",
// '神秘的':"MYSTERIOUS",
// '难过':"SAD",
// '滑':"SLIDE",
// '飙升':"SOARING",
// '弹簧':"SPRING",
// '闪烁':"TWINKLE",
// '打哈欠':"YAWN"
// }

// let DICT_gesturePlay = {'摇晃':"shake",
// '标志朝上':"up",
// '标志朝下':"down",
// '正面朝上':"face up",
// '正面朝下':"face down",
// '左':"left",
// '右':"right",
// '自由落体':"freefall",
// '3g':"3g"
// }

// let DICT_magnetStrengthPlay = {'X':"get_x",
// 'Y':"get_y",
// 'Z':"get_z",
// '强度':"get_field_strength"
// }

// let DICT_speakerPlay = {'关闭':"off",
// '打开':"on"
// }


let DICT_displayImage = {
    '心形': "HEART",
    'Heart': "HEART",
    '心形_小': "HEART_SMALL",
    'Small Heart': "HEART_SMALL",
    '快乐': "HAPPY",
    'Happy': "HAPPY",
    '微笑': "SMILE",
    'Smile': "SMILE",
    '悲伤': "SAD",
    'Sad': "SAD",
    '困惑': "CONFUSED",
    'Confused': "CONFUSED",
    '生气': "ANGRY",
    'Angry': "ANGRY",
    '睡着': "ASLEEP",
    'Asleep': "ASLEEP",
    '惊讶': "SURPRISED",
    'Surprised': "SURPRISED",
    '傻傻的': "SILLY",
    'Silly': "SILLY",
    '极好的': "FABULOUS",
    'Fabulous': "FABULOUS",
    '是': "YES",
    'Yes': "YES",
    '否': "NO",
    'No': "NO",
    '不感兴趣的': "MEH",
    'Indifferent': "MEH",
    '鸭子': "DUCK",
    'Duck': "DUCK",
    '长颈鹿': "GIRAFFE",
    'Giraffe': "GIRAFFE",
    '吃豆人': "PACMAN",
    'Pacman': "PACMAN",
    '幽灵': "GHOST",
    'Ghost': "GHOST",
    '骷髅': "SKULL",
    'Skull': "SKULL"
}


let DICT_musicPlay = {
    '鼓点叭叮': "BA_DING",
    'Drum Beat': "BA_DING",
    '反面角色': "BADDY",
    'Villain': "BADDY",
    '生日快乐': "BIRTHDAY",
    'Happy Birthday': "BIRTHDAY",
    '布鲁斯': "BLUES",
    'Blues': "BLUES",
    '追逐': "CHASE",
    'Chase': "CHASE",
    '哒哒哒噔': "DADADADUM",
    'Da Da Da Dum': "DADADADUM",
    '演艺人': "ENTERTAINER",
    'Entertainer': "ENTERTAINER",
    '葬礼': "FUNERAL",
    'Funeral': "FUNERAL",
    '放克音乐': "FUNK",
    'Funk': "FUNK",
    '向下跳': "JUMP_DOWN",
    'Jump Down': "JUMP_DOWN",
    '向上跳': "JUMP_UP",
    'Jump Up': "JUMP_UP",
    '彩虹猫': "NYAN",
    'Nyan Cat': "NYAN",
    '欢乐颂': "ODE",
    'Ode to Joy': "ODE",
    '能力减弱': "POWER_DOWN",
    'Power Down': "POWER_DOWN",
    '能力增强': "POWER_UP",
    'Power Up': "POWER_UP",
    '前奏': "PRELUDE",
    'Prelude': "PRELUDE",
    '笑点': "PUNCHLINE",
    'Punchline': "PUNCHLINE",
    'PYTHON': "PYTHON",
    'Python': "PYTHON",
    '铃声': "RINGTONE",
    'Ringtone': "RINGTONE",
    '哇哇哇哇': "WAWAWAWAA",
    'Wah Wah Sound': "WAWAWAWAA",
    '婚礼': "WEDDING",
    'Wedding': "WEDDING"
}

let DICT_audioPlay = {
    '咯咯笑': "GIGGLE",
    'Giggle': "GIGGLE",
    '快乐': "HAPPY",
    'Happy': "HAPPY",
    '你好': "HELLO",
    'Hello': "HELLO",
    '神秘的': "MYSTERIOUS",
    'Mysterious': "MYSTERIOUS",
    '难过': "SAD",
    'Sad': "SAD",
    '滑': "SLIDE",
    'Slide': "SLIDE",
    '飙升': "SOARING",
    'Soaring': "SOARING",
    '弹簧': "SPRING",
    'Spring': "SPRING",
    '闪烁': "TWINKLE",
    'Twinkle': "TWINKLE",
    '打哈欠': "YAWN",
    'Yawn': "YAWN"
}

let DICT_gesturePlay = {
    '摇晃': "shake",
    'Shake': "shake",
    '标志朝上': "up",
    'Logo Up': "up",
    '标志朝下': "down",
    'Logo Down': "down",
    '正面朝上': "face up",
    'Face Up': "face up",
    '正面朝下': "face down",
    'Face Down': "face down",
    '左': "left",
    'Left': "left",
    '右': "right",
    'Right': "right",
    '自由落体': "freefall",
    'Free Fall': "freefall",
    '3g': "3g",
    '3G': "3g"
}

let DICT_magnetStrengthPlay = {
    'X': "get_x",
    'Y': "get_y",
    'Z': "get_z",
    '强度': "get_field_strength",
    'Intensity': "get_field_strength" // 添加英文键
}

let DICT_speakerPlay = {
    '关闭': "off",
    'Off': "off",
    '打开': "on",
    'On': "on"
}


//发送
async function ICMB_send(str){
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
//读取
async function ICMB_read(str){
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

module.exports = MicrobitIcreate;


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
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}
/*
进入repl模式先发送import 各个库以启用


*/