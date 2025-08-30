const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type')

// const {getDistance,setDistance} = require('../../util/action')
// const socket = new WebSocket('ws://localhost:8080');
// let distance
// socket.addEventListener('open', function (event) {
//     // socket.send('Hello Server!');
//     console.log('open')
// });
// socket.addEventListener('message', function (event) {
//     // console.log(event.data);
//     distance= event.data.split(",");
//     distance=distance.map(Number);
//     console.log('vm:'+distance);
    
// });
const currentMode = require('../../util/mode')
const formatMessage = require('format-message');

let distance

const channel = new BroadcastChannel('distance_channel');
channel.addEventListener('message', (event) => {
    // console.log(event.data);
    distance=event.data
});


// const newSocket = new WebSocket('ws://localhost:8082');

// newSocket.addEventListener('open', (event) => {
//     console.log('WebSocket connection opened1111');
// });

// // Handle incoming WebSocket messages
// newSocket.addEventListener('message', (event) => {

//     distance=JSON.parse(event.data)

// })
let operate;

const distanceIcon = require('../../util/img/max_module_distance.svg')
const soundIcon = require('../../util/img/max_module_sound_j.svg')
const encoderIcon =require('../../util/img/max_module_encoder.svg')
const titleIcon = require('../../util/img/max_module_tilt.svg')
const gestureIcon = require ('../../util/img/max_module_gesture.svg')
const mainBnIcon = require('../../util/img/max_module_button_z.svg')
const motorIcon = require('../../util/img/console_motor.svg')
const colorLightIco = require('../../util/img/color_light.png')
const touchIco = require('../../util/img/touch.png')

class BricksSensors {
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
      id: 'brickssensors',
      name: formatMessage({
            id: 'brickssensors.name',
            default: 'Sensor',
            description: 'brickssensors.name'
        }),
      // intentionally bad colors so that the effect is more clear
      color1: '#00ccff', // pure red
    //   color2: '#00ff00', // pure green
    //   color3: '#0000ff', // pure blue
      blocks: [
        {
            opcode: 'distance',
            blockType: BlockType.BOOLEAN,
            // text: '端口[ONE]距离[TWO][THREE]',
            text: formatMessage({
                id: 'brickssensors.distance',
                default: 'Port [ONE] distance [TWO] [THREE]',
                description: 'brickssensors.distance'
            }),
            blockIconURI: distanceIcon,
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu: 'FORMAT_MENU'
                },
                TWO:{
                    type: ArgumentType.STRING,
                    menu: 'FORMAT_MENU_SIZE'
                },
                THREE:{
                    type: ArgumentType.STRING,
                    defaultValue: '0'
                }
            },
            disableMonitor: true
        },
        {
            opcode: 'song',
            blockType: BlockType.BOOLEAN,
            // text: '端口[ONE]声音[TWO][THREE]',
            text: formatMessage({
                id: 'brickssensors.song',
                default: 'Port [ONE] sound [TWO] [THREE]',
                description: 'brickssensors.song'
            }),
            blockIconURI: soundIcon,
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu: 'FORMAT_MENU'
                },
                TWO:{
                    type: ArgumentType.STRING,
                    menu: 'FORMAT_MENU_SIZE'
                },
                THREE:{
                    type: ArgumentType.STRING,
                    defaultValue: '0'
                }
            },
            disableMonitor: true
        },
        {
            opcode: 'knob',
            blockType: BlockType.BOOLEAN,
            // text: '端口[ONE]编码器[TWO]',
            text: formatMessage({
                id: 'brickssensors.knob',
                default: 'Port [ONE] encoder [TWO]',
                description: 'brickssensors.knob'
            }),
            blockIconURI: encoderIcon,
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu: 'FORMAT_MENU'
                },
                TWO:{
                    type: ArgumentType.STRING,
                    menu: 'FORMAT_MENU_TIMEDIR'
                },
            },
            disableMonitor: true
        },
        {
            opcode: 'incline',
            blockType: BlockType.BOOLEAN,
            // text: '端口[ONE]倾斜[TWO]',
            text: formatMessage({
                id: 'brickssensors.incline',
                default: 'Port [ONE] tilt [TWO]',
                description: 'brickssensors.incline'
            }),
            blockIconURI: titleIcon,
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu: 'FORMAT_MENU'
                },
                TWO:{
                    type: ArgumentType.STRING,
                    menu: 'FORMAT_MENU_FOURDIR'
                },
            },
            disableMonitor: true
        },
        {
            opcode: 'handpose',
            blockType: BlockType.BOOLEAN,
            // text: '端口[ONE]手势[TWO]',
            text: formatMessage({
                id: 'brickssensors.handpose',
                default: 'Port [ONE] gesture [TWO]',
                description: 'brickssensors.handpose'
            }),
            blockIconURI: gestureIcon,
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu: 'FORMAT_MENU'
                },
                TWO:{
                    type: ArgumentType.STRING,
                    menu: 'FORMAT_MENU_FOURDIR'
                },
            },
            disableMonitor: true
        },
         {
            opcode: 'colorSensor',
            blockType: BlockType.BOOLEAN,
            // text: '端口[ONE]颜色[TWO]',
            text: formatMessage({
                id: 'brickssensors.colorSensor',
                default: 'Port [ONE] color [TWO]',
                description: 'brickssensors.colorSensor'
            }),
            blockIconURI: colorLightIco,
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu: 'FORMAT_MENU'
                },
                TWO:{
                    type: ArgumentType.STRING,
                    menu: 'FORMAT_MENU_COLOR'
                },
            },
            disableMonitor: true
        },
        {
            opcode: 'touch',
            blockType: BlockType.BOOLEAN,
            // text: '端口[ONE]颜色[TWO]',
            text: formatMessage({
                id: 'brickssensors.touch',
                default: 'Port [ONE] touch',
                description: 'brickssensors.touch'
            }),
            blockIconURI: touchIco,
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu: 'FORMAT_MENU'
                },
            },
            disableMonitor: true
        },
        {
            opcode: 'controlbutton',
            blockType: BlockType.BOOLEAN,
            // text: '[ONE]按键被按压',
            text: formatMessage({
                id: 'brickssensors.controlbutton',
                default: '[ONE] button pressed',
                description: 'brickssensors.controlbutton'
            }),
            blockIconURI: mainBnIcon,
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu: 'FORMAT_MENU_CONTROL'
                },
            },
            disableMonitor: true
        },
        // {
        //     opcode: 'virtualbutton',
        //     blockType: BlockType.BOOLEAN,
        //     text: '[ONE]按键被按压',
        //     arguments:{
        //         ONE:{
        //             type: ArgumentType.STRING,
        //             menu: 'FORMAT_MENU_VISUALDIR'
        //         },
        //     }
        // },
        {
            opcode: 'readincline',
            blockType: BlockType.REPORTER,
            // text: '端口[ONE]倾斜[TWO]',
            text: formatMessage({
                id: 'brickssensors.readincline',
                default: 'Port [ONE] tilt [TWO]',
                description: 'brickssensors.readincline'
            }),
            blockIconURI: titleIcon,
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu: 'FORMAT_MENU'
                },
                TWO:{
                    type: ArgumentType.STRING,
                    menu: 'FORMAT_MENU_XY'
                }
            },
            disableMonitor: true
        },
        {
            opcode: 'readknob',
            blockType: BlockType.REPORTER,
            // text: '端口[ONE]编码器',
            text: formatMessage({
                id: 'brickssensors.readknob',
                default: 'Port [ONE] encoder',
                description: 'brickssensors.readknob'
            }),
            blockIconURI: encoderIcon,
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu: 'FORMAT_MENU'
                },
            },
            disableMonitor: true
        },
        {
            opcode: 'readdistance',
            blockType: BlockType.REPORTER,
            // text: '端口[ONE]距离',
            text: formatMessage({
                id: 'brickssensors.readdistance',
                default: 'Port [ONE] distance',
                description: 'brickssensors.readdistance'
            }),
            blockIconURI: distanceIcon,
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu: 'FORMAT_MENU'
                },
            },
            disableMonitor: true
        },
        {
            opcode: 'readsong',
            blockType: BlockType.REPORTER,
            // text: '端口[ONE]声音',
            text: formatMessage({
                id: 'brickssensors.readsong',
                default: 'Port [ONE] sound',
                description: 'brickssensors.readsong'
            }),
            blockIconURI: soundIcon,
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu: 'FORMAT_MENU',
                },
            },
            disableMonitor: true
        },
         {
            opcode: 'colorRgb',
            blockType: BlockType.REPORTER,
            // text: '端口[ONE]声音',
            text: formatMessage({
                id: 'brickssensors.colorRgb',
                default: 'Port [ONE] color value [TWO]',
                description: 'brickssensors.colorRgb'
            }),
            blockIconURI: colorLightIco,
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu: 'FORMAT_MENU',
                },
                TWO:{
                    type: ArgumentType.STRING,
                    menu: 'FORMAT_MENU_RGB',
                },
            },
            disableMonitor: true
        },
        {
            opcode: 'colorLight',
            blockType: BlockType.REPORTER,
            // text: '端口[ONE]声音',
            text: formatMessage({
                id: 'brickssensors.colorLight',
                default: 'Port [ONE] light value',
                description: 'brickssensors.colorLight'
            }),
            blockIconURI: colorLightIco,
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu: 'FORMAT_MENU',
                },
            },
            disableMonitor: true
        },
        // {
        //     opcode: 'motoranagle',
        //     blockType: BlockType.REPORTER,
        //     // text: '端口[ONE]读取角度',
        //     text: formatMessage({
        //         id: 'brickssensors.motoranagle',
        //         default: 'Port [ONE] read angle',
        //         description: 'brickssensors.motoranagle'
        //     }),
        //     blockIconURI: motorIcon,
        //     arguments:{
        //         ONE:{
        //             type: ArgumentType.STRING,
        //             menu: 'FORMAT_MENU',
        //             // defaultValue:1
        //         }
        //     },
        //     disableMonitor: true
        // },

        // {
        //     opcode: 'controlState',
        //     blockType: BlockType.REPORTER,
        //     text: '返回按键[ONE]状态',
        //     arguments:{
        //         ONE:{
        //             type: ArgumentType.STRING,
        //             menu: 'FORMAT_MENU_CONTROL'
        //         }
        //     }
        // },
       

      ],
      menus: {
        FORMAT_MENU: {
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
        FORMAT_MENU_COLOR:{
            acceptReporters: false,
            items: [
                {
                    // text: '正传',
                    text: formatMessage({
                        id: 'brickssensors.formatMenuColor.red',
                        default: 'Red',
                        description: 'brickssensors.formatMenuColor.red'
                    }),
                    value: '1'
                },
                {
                   text: formatMessage({
                        id: 'brickssensors.formatMenuColor.yellow',
                        default: 'Yellow',
                        description: 'brickssensors.formatMenuColor.yellow'
                    }),
                    value: '2'
                },
                {
                    text: formatMessage({
                        id: 'brickssensors.formatMenuColor.blue',
                        default: 'Blue',
                        description: 'brickssensors.formatMenuColor.blue'
                    }),
                    value: '3'
                },
                {
                    text: formatMessage({
                        id: 'brickssensors.formatMenuColor.green',
                        default: 'Green',
                        description: 'brickssensors.formatMenuColor.green'
                    }),
                    value: '4'
                },
                {
                    text: formatMessage({
                        id: 'brickssensors.formatMenuColor.black',
                        default: 'Black',
                        description: 'brickssensors.formatMenuColor.black'
                    }),
                    value: '255'
                },
                {
                    text: formatMessage({
                        id: 'brickssensors.formatMenuColor.white',
                        default: 'White',
                        description: 'brickssensors.formatMenuColor.white'
                    }),
                    value: '254'
                },
            ]
        },
        FORMAT_MENU_RGB:{
            acceptReporters: false,
            items: [
                {
                    // text: '正传',
                    text: 'R',
                    value: '0'
                },
                {
                   text: 'G',
                    value: '1'
                },
                {
                    text: 'B',
                    value: '2'
                },
            ]
        },
        FORMAT_MENU_STATE:{
            acceptReporters: false,
            items: [
                {
                    // text: '正传',
                    text: formatMessage({
                        id: 'brickssensors.formatMenuState.fwd',
                        default: '正转',
                        description: 'brickssensors.formatMenuState.fwd'
                    }),
                    value: '1'
                },
                {
                    // text: '反转',
                    text: formatMessage({
                        id: 'brickssensors.formatMenuState.rev',
                        default: '反转',
                        description: 'brickssensors.formatMenuState.rev'
                    }),
                    value: '-1'
                },
                {
                    // text: '停止',
                    text: formatMessage({
                        id: 'brickssensors.formatMenuState.stop',
                        default: '停止',
                        description: 'brickssensors.formatMenuState.stop'
                    }),
                    value: '0'
                },
            ]
        },
        FORMAT_MENU_SIZE:{
            acceptReporters: false,
            items: [
                {
                    text: '>',
                    value: '>'
                },
                {
                    text: '<',
                    value: '<'
                },
                {
                    text: '=',
                    value: '='
                },
            ]
        },
        FORMAT_MENU_TIMEDIR:{
            acceptReporters: false,
            items: [
                {
                    // text: '顺时针',
                    text: formatMessage({
                        id: 'brickssensors.formatMenuTimedir.clockwise',
                        default: 'Clockwise',
                        description: 'brickssensors.formatMenuTimedir.clockwise'
                    }),
                    value: '2'
                },
                {
                    // text: '逆时针',
                    text: formatMessage({
                        id: 'brickssensors.formatMenuTimedir.Counterclockwise',
                        default: 'Counterclockwise',
                        description: 'brickssensors.formatMenuTimedir.Counterclockwise'
                    }),
                    value: '1'
                },
                {
                    // text: '被按下',
                    text: formatMessage({
                        id: 'brickssensors.formatMenuTimedir.press',
                        default: 'Pressed',
                        description: 'brickssensors.formatMenuTimedir.press'
                    }),
                    value: '0'
                },
            ]
        },
        FORMAT_MENU_FOURDIR:{
            acceptReporters: false,
            items: [
                // {
                //     text: '水平',
                //     value: '0'
                // },
                {
                    // text: '向上',
                    text: formatMessage({
                        id: 'brickssensors.formatMenuFourdir.up',
                        default: 'Up',
                        description: 'brickssensors.formatMenuFourdir.up'
                    }),
                    value: '3'
                },
                {
                    // text: '向下',
                    text: formatMessage({
                        id: 'brickssensors.formatMenuFourdir.down',
                        default: 'Down',
                        description: 'brickssensors.formatMenuFourdir.down'
                    }),
                    value: '4'
                },
                {
                    // text: '向左',
                    text: formatMessage({
                        id: 'brickssensors.formatMenuFourdir.left',
                        default: 'Left',
                        description: 'brickssensors.formatMenuFourdir.left'
                    }),
                    value: '1'
                },
                {
                    // text: '向右',
                    text: formatMessage({
                        id: 'brickssensors.formatMenuFourdir.right',
                        default: 'Right',
                        description: 'brickssensors.formatMenuFourdir.right'
                    }),
                    value: '2'
                },
            ]
        },
        FORMAT_MENU_VISUALDIR:{
            acceptReporters: false,
            items: [
                {
                    text: '向上',
                    value: '3'
                },
                {
                    text: '向下',
                    value: '4'
                },
                {
                    text: '向左',
                    value: '1'
                },
                {
                    text: '向右',
                    value: '2'
                },
                {
                    text: 'Stop',
                    value: '0'
                },
                {
                    text: 'A',
                    value: '5'
                },
                {
                    text: 'B',
                    value: '6'
                },
            ]
        },
        FORMAT_MENU_XY:{
            acceptReporters: false,
            items: [
                {
                    text: 'X',
                    value: '0'
                },
                {
                    text: 'Y',
                    value: '1'
                },
            ]
        },
        FORMAT_MENU_CONTROL:{
            acceptReporters: false,
            items: [
                {
                    // text: '上',
                    text: formatMessage({
                        id: 'brickssensors.formatMenucontrol.top',
                        default: 'Top',
                        description: 'brickssensors.formatMenucontrol.top'
                    }),
                    value: '3'
                },
                {
                    // text: '下',
                    text: formatMessage({
                        id: 'brickssensors.formatMenucontrol.bottom',
                        default: 'Bottom',
                        description: 'brickssensors.formatMenucontrol.bottom'
                    }),
                    value: '4'
                },
                {
                    // text: '左',
                    text: formatMessage({
                        id: 'brickssensors.formatMenucontrol.left',
                        default: 'Left',
                        description: 'brickssensors.formatMenucontrol.left'
                    }),
                    value: '1'
                },
                {
                    // text: '右',
                    text: formatMessage({
                        id: 'brickssensors.formatMenucontrol.right',
                        default: 'Right',
                        description: 'brickssensors.formatMenucontrol.right'
                    }),
                    value: '2'
                },
            ]
        },
      }
    };
  }

   colorSensor(args){
    return
  }
  touch(args){
    return
  }

  colorLight(args){
    return
  }

  colorRgb(args){
    return
  }
  readknob(args){
    if(!this.mode) return
    // this.runtime.ioDevices.video.test()
    // console.log(distance)
    for(let i=0;i<distance[5].length;i++){
         if(distance[5][i].length>0 && args.ONE==distance[5][i][0]){
            if(distance[5][i][5]==0){
                return distance[5][i][3]
            }else if(distance[5][i][5]==1){
                return `-${distance[5][i][3]}`
            }
        }
    }
    // if(distance[5].length>0 && args.ONE==distance[5][0]){
    //     if(distance[5][5]==0){
    //         return distance[5][3]
    //     }else if(distance[5][5]==1){
    //         return `-${distance[5][3]}`
    //     }
    // }
  }

  knob(args){
    if(!this.mode) return
    // this.runtime.ioDevices.video.disableVideo();

    for(let i=0;i<distance[5].length;i++){
         if(distance[5][i].length>0 && args.ONE==distance[5][i][0]){
            if(args.TWO==distance[5][i][2] && distance[5][i][2] != 0){
                return true
            }else if(distance[5][i][2] == 0 && args.TWO==distance[5][i][4]-1){
                return true
            }else{
                return false
            }
        }
    }
   
    return false
  }

  handpose(args){
    if(!this.mode) return
    for(let i=0;i<distance[4].length;i++){
        if(distance[4][i].length>0 && args.ONE==distance[4][i][0]){
            if(args.TWO==distance[4][i][2]){
                return true
            }
        }
    }
    
    return false
  }


  readsong(args){
    if(!this.mode) return
    for(let i=0; i<distance[3].length;i++){
        if(distance[3][i].length>0 && args.ONE==distance[3][i][0]){
            return distance[3][i][2]
        }
    }
    
  }

  song(args){

    if(!this.mode) return
    for(let i=0;i<distance[3].length;i++){
        if(distance[3][i].length>0 && args.ONE==distance[3][i][0]){
            if(args.TWO=='>'){
                if(distance[3][i][2]>args.THREE){
                    return true
                }else{
                    return false
                }
            }else if(args.TWO=='<'){
                if(distance[3][i][2]<args.THREE){
                    return true
                }else{
                    return false
                }
            }else if(args.TWO=='='){
                if(distance[3][i][2]==args.THREE){
                    return true
                }else{
                    return false
                }
            }
        }
    }
    
  }

    controlbutton(args){
        if(!this.mode) return
        // console.log(distance[2])
        for(let i=0;i<distance[2].length;i++){
            if(distance[2][i].length>0 && args.ONE==distance[2][i][1] && distance[2][i][2]==1){
                return true
            }
        }
        
        return false
        
    }

    controlState(args){
        if(!this.mode) return
        for(let i=0;i<distance[2].length;i++){
            if(distance[2][i].length>0 && args.ONE==distance[2][i][1]){

                // console.log(distance[2][i][2])
                return distance[2][i][2]
            }
        }
     
    }


    async distance(args){
    
        if(!this.mode) return
        // console.log(window)

        for(let i=0;i<distance[0].length;i++){
            if(distance[0][i].length>0 && args.ONE==distance[0][i][0]){
                if(args.TWO=='>'){
                    if(distance[0][i][2]>args.THREE){
                        return true
                    }else{
                        return false
                    }
                }else if(args.TWO=='<'){
                    if(distance[0][i][2]<args.THREE){
                        return true
                    }else{
                        return false
                    }
                }else if(args.TWO=='='){
                    if(distance[0][i][2]==args.THREE){
                        return true
                    }else{
                        return false
                    }
                }
            }
        }
        
        return false
       
    }

    incline(args){
        if(!this.mode) return

        for(let i=0;i<distance[1].length;i++){
            if(distance[1][i].length>0 && args.ONE==distance[1][i][0]){
                if(args.TWO=='1' && distance[1][i][2]>0 && distance[1][i][3]==0 && distance[1][i][4]>0){
                    return true
                }else if(args.TWO=='2' && distance[1][i][2]>0 && distance[1][i][3]==0 && distance[1][i][4]==0){
                    return true
                }else if(args.TWO=='3' && distance[1][i][2]==0 && distance[1][i][3]>0 && distance[1][i][4]==0){
                    return true
                }else if(args.TWO=='4' && distance[1][i][2]==0 && distance[1][i][3]>0 && distance[1][i][4]>0){
                    return true
                }else if(args.TWO=='0' && distance[1][i][2]==0 && distance[1][i][3]==0){
                    return true
                }else{
                    return false
                }
            }
        }
       
        return false
    }

    readdistance(args){
        if(!this.mode) return
        for(let i=0;i<distance[0].length;i++){
            if(distance[0][i].length>0 && args.ONE==distance[0][i][0]){
                return distance[0][i][2]
            }
        }
        
    }

    readincline(args){
        if(!this.mode) return
        for(let i=0;i<distance[1].length;i++){
            if(distance[1][i].length>0 && args.ONE==distance[1][i][0]){
                if(args.TWO == '0'){
                    // console.log(typeof distance[5]);
                    
                    if(distance[1][i][4]>100){
                        if(distance[1][i][2]==0){
                            return distance[1][i][2]
                        }
                        return '-'+distance[1][i][2]
                    }else{
                        if(distance[1][i][2]==0){
                            return distance[1][i][2]
                        }else{
                            return distance[1][i][2]
                        }
                        
                    }
                    
                }else if(args.TWO == '1'){
                    if(distance[1][i][4]>0){
                        if(distance[1][i][3]==0){
                            return distance[1][i][3]
                        }
                        return '-'+distance[1][i][3]
                    }else{
                        if(distance[1][i][3]==0){
                            return distance[1][i][3]
                        }else{
                            return distance[1][i][3]
                        }
                    }
                }
            }
        }
      
    }

    motoranagle(args){
        if(!this.mode) return
        for(let i=0;i<distance[6].length;i++){
            if(distance[6][i].length>0 && args.ONE==distance[6][i][0]){
                if(distance[6][i][3]==0){
                    return distance[6][i][2]
                }else if(distance[6][i][3]==1){
                    return (-1)*distance[6][i][2]
                }
            }
        }
       
    }

}


module.exports = BricksSensors;
