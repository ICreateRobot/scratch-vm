const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type')
const socket=require('../../util/localSocket')
const formatMessage = require('format-message');
const currentMode = require('../../util/mode')
const motorD=require('../../util/img/max_module_motor_d.svg')
let motor=[8,1]
class BricksMotor {

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
      id: 'brickstwomotor',
      name: formatMessage({
            id: 'brickstwomotor.name',
            default: 'Movement',
            description: 'brickstwomotor.name'
        }),
      color1: '#ff00ff',
      blocks: [
        {
          opcode: 'setmovemotor',
          blockType: BlockType.COMMAND,
          // text: '将运转电机设置为 [ONE]和[TWO]',
          text: formatMessage({
              id: 'brickstwomotor.setmovemotor',
              default: 'Set running motors to [ONE] and [TWO]',
              description: 'brickstwomotor.setmovemotor'
          }),
          blockIconURI: motorD,
          arguments:{
            ONE:{
                type: ArgumentType.STRING,
                menu: 'FORMAT_MENU'
            },
            TWO:{
                type: ArgumentType.STRING,
                menu: 'FORMAT_MENU',
                defaultValue:'0'
            },
          }
        }, 
        {
            opcode: 'speedmove',
            blockType: BlockType.COMMAND,
            // text: '[ONE]以速度[TWO]运行',
            text: formatMessage({
              id: 'brickstwomotor.speedmove',
              default: '[ONE] runs at speed [TWO]',
              description: 'brickstwomotor.speedmove'
            }),
            blockIconURI: motorD,
            arguments:{
              ONE:{
                  type: ArgumentType.STRING,
                  menu: 'FORMAT_MENU_DIR'
              },
              TWO:{
                  type: ArgumentType.STRING,
                  defaultValue: '50'
              },
            }
        },
        {
            opcode: 'speedmoveplace',
            blockType: BlockType.COMMAND,
            // text: '[ONE]以速度[TWO]移动[THREE][FOUR]',
            text: formatMessage({
              id: 'brickstwomotor.speedmoveplace',
              default: '[ONE] moves at speed [TWO] [THREE] [FOUR]',
              description: 'brickstwomotor.speedmoveplace'
            }),
            blockIconURI: motorD,
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu: 'FORMAT_MENU_DIR'
                },
                TWO:{
                    type: ArgumentType.STRING,
                    defaultValue: '50'
                },
                THREE:{
                    type: ArgumentType.STRING,
                    defaultValue: '1'
                },
                FOUR:{
                    type: ArgumentType.STRING,
                    menu: 'FORMAT_MENU_MODE'
                }
            }
        },
        {
            opcode: 'stop',
            blockType: BlockType.COMMAND,
            blockIconURI: motorD,
            // text: '停止电机',
            text: formatMessage({
              id: 'brickstwomotor.stop',
              default: 'Stop motors',
              description: 'brickstwomotor.stop'
            }),
        },

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
        FORMAT_MENU_STATE:{
            acceptReporters: false,
            items: [
                {
                    // text: '正传',
                    text: formatMessage({
                      id: 'brickstwomotor.formatMenuState.fwd',
                      default: '正传',
                      description: 'brickstwomotor.formatMenuState.fwd'
                    }),
                    value: '1'
                },
                {
                    // text: '反转',
                    text: formatMessage({
                      id: 'brickstwomotor.formatMenuState.rev',
                      default: '反转',
                      description: 'brickstwomotor.formatMenuState.rev'
                    }),
                    value: '-1'
                },
                {
                    // text: '停止',
                    text: formatMessage({
                      id: 'brickstwomotor.formatMenuState.stop',
                      default: '停止',
                      description: 'brickstwomotor.formatMenuState.stop'
                    }),
                    value: '0'
                },
            ]
        },
        FORMAT_MENU_MODE:{
            acceptReporters: false,
            items: [
                {
                    // text: '圈',
                    text: formatMessage({
                      id: 'brickstwomotor.formatMenuMode.rot',
                      default: '圈',
                      description: 'brickstwomotor.formatMenuMode.rot'
                    }),
                    value: '1'
                },
                {
                    // text: '度',
                    text: formatMessage({
                      id: 'brickstwomotor.formatMenuMode.angle',
                      default: '度',
                      description: 'brickstwomotor.formatMenuMode.angle'
                    }),
                    value: '2'
                },
                {
                    // text: '秒',
                    text: formatMessage({
                      id: 'brickstwomotor.formatMenuMode.second',
                      default: '秒',
                      description: 'brickstwomotor.formatMenuMode.second'
                    }),
                    value: '3'
                },
            ]
        },
        FORMAT_MENU_DIR:{
            acceptReporters: false,
            items: [
                {
                    // text: '前进',
                    text: formatMessage({
                      id: 'brickstwomotor.formatMenuDir.forward',
                      default: 'Forward',
                      description: 'brickstwomotor.formatMenuDir.forward'
                    }),
                    value: '1'
                },
                {
                    // text: '后退',
                    text: formatMessage({
                      id: 'brickstwomotor.formatMenuDir.backward',
                      default: 'Backward',
                      description: 'brickstwomotor.formatMenuDir.backward'
                    }),
                    value: '2'
                },
                {
                    // text: '左转',
                    text: formatMessage({
                      id: 'brickstwomotor.formatMenuDir.turnleft',
                      default: 'Turn left',
                      description: 'brickstwomotor.formatMenuDir.turnleft'
                    }),
                    value: '3'
                },
                {
                    // text: '右转',
                    text: formatMessage({
                      id: 'brickstwomotor.formatMenuDir.turnright',
                      default: 'Turn right',
                      description: 'brickstwomotor.formatMenuDir.turnright'
                    }),
                    value: '4'
                },
            ]
        },
      }
    };
  }

//   hello() {
//     console.log('执行了')
//     return 'World!';
//   }
//   strictlyEquals(args) {
//     return args.ONE === args.TWO;
//   }

async setmovemotor(args){
  if(!this.mode) return
  let prePort=[7,0,6,1,5,2,4,3]
  let port = [2,4,6,8,7,5,3,1]

  
  motor[0]=port.indexOf(prePort.indexOf(Number(args.ONE))+1)+1
  motor[1]=port.indexOf(prePort.indexOf(Number(args.TWO))+1)+1

  await new Promise(resolve => setTimeout(resolve, 200)); 

}

// 映射 0-255 到 63-127
mapTo63to127(value) {
  if (value < 0 || value > 255) throw new Error('Input must be between 0 and 255');
  return Math.round(63 + (value / 255) * (127 - 63));
}

// 映射 0-255 到 0-63
 mapTo0to63(value) {
  if (value < 0 || value > 255) throw new Error('Input must be between 0 and 255');
  return Math.round((value / 255) * 63);
}
async speedmove(args){
  if(!this.mode) return
  let data=[252,0,0,0,0,0,0,0,0]
  if(args.ONE=='1'){
    data[motor[0]]=this.mapTo63to127(Number(args.TWO))
    data[motor[1]]=this.mapTo0to63(Number(args.TWO))
  }else if(args.ONE=='2'){
    data[motor[0]]=this.mapTo0to63(Number(args.TWO))
    data[motor[1]]=this.mapTo63to127(Number(args.TWO))
  }else if(args.ONE=='3'){
    data[motor[0]]=this.mapTo0to63(Number(args.TWO))
    data[motor[1]]=this.mapTo0to63(Number(args.TWO))
  }else if(args.ONE=='4'){
    data[motor[0]]=this.mapTo63to127(Number(args.TWO))
    data[motor[1]]=this.mapTo63to127(Number(args.TWO))
  }
  

  socket.getSocket().send(JSON.stringify(data))
  await new Promise(resolve => setTimeout(resolve, 200)); 


}
speedmoveplace(){
  return
}
async stop(){
  if(!this.mode) return
  let data=[249]
  socket.getSocket().send(JSON.stringify(data))
  await new Promise(resolve => setTimeout(resolve, 200)); 
}
}


module.exports = BricksMotor;
