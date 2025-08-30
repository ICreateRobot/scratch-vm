const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type');
const { maxSatisfying } = require('semver');
const socket=require('../../util/localSocket')

const motorIcon = require('../../util/img/console_motor.svg')

const currentMode = require('../../util/mode')

const formatMessage = require('format-message');

class BricksMotor {

  constructor(runtime){
    this.runtime=runtime

    if(!socket.getSocket()){
      socket.setSocket()
    }

    this.mode=true
    this.channelMode=new BroadcastChannel('mode')
    this.channelMode.addEventListener('message',(event)=>{
        this.mode=event.data
        currentMode.setMode(event.data)
    })

    this.getBricksPort = new BroadcastChannel('get-bricks-port')
    this.getBricksPort.addEventListener('message',(event)=>{
      if(event.data=='getPortState'){
        socket.getSocket().send(JSON.stringify([5]))
      }
    })

    this.distance

    this.channel = new BroadcastChannel('distance_channel');
    this.channel.addEventListener('message', (event) => {
        // console.log(event.data);
        this.distance=event.data
    });
  }
  getInfo() {
    return {
      id: 'bricksmotor',
      name: formatMessage({
            id: 'bricksmotor.name',
            default: 'Motor',
            description: 'bricksmotor.name'
        }),
      color1: '#6633ff',
      blocks: [
        // {
        //     opcode: 'motoranagle',
        //     blockType: BlockType.REPORTER,
        //     text: '端口[ONE]读取角度',
        //     arguments:{
        //         ONE:{
        //             type: ArgumentType.STRING,
        //             menu: 'FORMAT_MENU',
        //             defaultValue:1
        //         }
        //     }
        // },
        {
          opcode: 'motorSpeed',
          blockType: BlockType.COMMAND,
          // text: '端口[ONE]以[TWO]速度[THREE]运行',
          text: formatMessage({
              id: 'bricksmotor.motorSpeed',
              default: 'Port [ONE] runs at speed [TWO] [THREE]',
              description: 'bricksmotor.motorSpeed'
          }),
          blockIconURI: motorIcon,
          arguments:{
            ONE:{
                type: ArgumentType.STRING,
                menu: 'FORMAT_MENU'
            },
            TWO:{
                type: ArgumentType.NUMBER,
                defaultValue: 50,
                min:0,
                max:100
            },
            THREE:{
                type: ArgumentType.STRING,
                menu: 'FORMAT_MENU_STATE'
            }
          }
        }, 
        {
            opcode: 'motorSpeedCir',
            blockType: BlockType.COMMAND,
            // text: '端口[ONE]以[TWO]速度[THREE]运行[FOUR][FIVE]',
            text: formatMessage({
              id: 'bricksmotor.motorSpeedCir',
              default: 'Port [ONE] runs at speed [TWO] [THREE] [FOUR] [FIVE]',
              description: 'bricksmotor.motorSpeedCir'
            }),
            blockIconURI: motorIcon,
            arguments:{
              ONE:{
                  type: ArgumentType.STRING,
                  menu: 'FORMAT_MENU'
              },
              TWO:{
                  type: ArgumentType.STRING,
                  defaultValue: 50
              },
              THREE:{
                  type: ArgumentType.STRING,
                  menu: 'FORMAT_MENU_STATE'
              },
              FOUR:{
                type: ArgumentType.STRING,
                  defaultValue: 1
              },
              FIVE:{
                type: ArgumentType.STRING,
                  menu: 'FORMAT_MENU_MODE'
              }
            }
        },
        {
            opcode: 'setZero',
            blockType: BlockType.COMMAND,
            // text: '端口[ONE]设置当前位置为0点',
            text: formatMessage({
              id: 'bricksmotor.setZero',
              default: 'Set current position of port [ONE] as zero point',
              description: 'bricksmotor.setZero'
            }),
            blockIconURI: motorIcon,
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu: 'FORMAT_MENU'
                }
            }
        },
        {
            opcode: 'moveto',
            blockType: BlockType.COMMAND,
            // text: '端口[ONE]以[TWO]速度 运行至[THREE]度',
            text: formatMessage({
              id: 'bricksmotor.moveto',
              default: 'Port [ONE] runs at speed [TWO] to [THREE] degrees',
              description: 'bricksmotor.moveto'
            }),
            blockIconURI: motorIcon,
            arguments:{
              ONE:{
                  type: ArgumentType.STRING,
                  menu: 'FORMAT_MENU'
              },
              TWO:{
                  type: ArgumentType.STRING,
                  defaultValue: 50
              },
              THREE:{
                  type: ArgumentType.STRING,
                  defaultValue: 0
              }
            }
        },
        {
            opcode: 'stop',
            blockType: BlockType.COMMAND,
            // text: '端口[ONE]停止电机',
            text: formatMessage({
              id: 'bricksmotor.stop',
              default: 'Stop motor at port [ONE]',
              description: 'bricksmotor.stop'
            }),
            blockIconURI: motorIcon,
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu: 'FORMAT_MENU'
                }
            }
        },

         {
          opcode: 'motoranagle',
          blockType: BlockType.REPORTER,
          // text: '端口[ONE]读取角度',
          text: formatMessage({
              id: 'brickssensors.motoranagle',
              default: 'Port [ONE] read angle',
              description: 'brickssensors.motoranagle'
          }),
          blockIconURI: motorIcon,
          arguments:{
              ONE:{
                  type: ArgumentType.STRING,
                  menu: 'FORMAT_MENU',
                  // defaultValue:1
              }
          },
          disableMonitor: true
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
                    // text: '正转',
                    text: formatMessage({
                      id: 'bricksmotor.formatMenuState.fwd',
                      default: 'Forward',
                      description: 'bricksmotor.formatMenuState.fwd'
                    }),
                    value: '1'
                },
                {
                    // text: '反转',
                    text: formatMessage({
                      id: 'bricksmotor.formatMenuState.rev',
                      default: 'Reverse',
                      description: 'bricksmotor.formatMenuState.rev'
                    }),
                    value: '-1'
                },
                {
                    // text: '停止',
                    text: formatMessage({
                      id: 'bricksmotor.formatMenuState.stop',
                      default: 'Stop',
                      description: 'bricksmotor.formatMenuState.stop'
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
                      id: 'bricksmotor.formatMenuMode.rot',
                      default: 'Rotations',
                      description: 'bricksmotor.formatMenuMode.rot'
                    }),
                    value: '1'
                },
                {
                    // text: '度',
                    text: formatMessage({
                      id: 'bricksmotor.formatMenuMode.angle',
                      default: 'Degrees',
                      description: 'bricksmotor.formatMenuMode.angle'
                    }),
                    value: '2'
                },
                {
                    // text: '秒',
                    text: formatMessage({
                      id: 'bricksmotor.formatMenuMode.second',
                      default: 'Seconds',
                      description: 'bricksmotor.formatMenuMode.second'
                    }),
                    value: '3'
                },
            ]
        }
      }
    };
  }

  // motoranagle(args){
  //   return args.ONE
  // }
  async motorSpeed(args){
    if(!this.mode) return
    // socket.getSocket().send('11111')
    let data=[]
    data.push(Number(args.ONE))
    data.push(103)
    data.push(Number(args.TWO))
    if(args.THREE=='-1'){
      data.push(2)
    }else{
      data.push(Number(args.THREE))
    }
    data.push(0)

    socket.getSocket().send(JSON.stringify(data))
    await new Promise(resolve => setTimeout(resolve, 100)); 

  }


  splitIntoHighLowByte(number) {
    // 提取高八位（高字节）
    const highByte = (number >> 8) & 0xFF;
  
    // 提取低八位（低字节）
    const lowByte = number & 0xFF;
  
    return [highByte, lowByte]  ;
  }
  

  waitForArrayMatchInArray(targetArrayGetter, expectedArray, interval = 100, timeout = 5000) {
      return new Promise((resolve, reject) => {
          const startTime = Date.now();

          const timer = setInterval(() => {
              const currentArray = targetArrayGetter(); // 获取目标数组

              console.log('-------------------------')
              console.log(currentArray)
              console.log(expectedArray)
              console.log('########################')
              
              // 遍历当前数组，检查每个子数组的第一个元素
              for (let i = 0; i < currentArray.length; i++) {
                  if (Array.isArray(currentArray[i]) && currentArray[i][0] === expectedArray[0]) {
                      // 找到匹配的子数组，接着判断整个数组是否匹配
                      if (
                          currentArray[i].length === expectedArray.length &&
                          currentArray[i].every((val, j) => val === expectedArray[j])
                      ) {
                          clearInterval(timer);
                          resolve(currentArray[i]);
                          return;
                      }
                  }
              }

              // if (Date.now() - startTime > timeout) {
              //     clearInterval(timer);
              //     console.log('Timeout waiting for array to match.')
              //     reject(new Error('Timeout waiting for array to match.'));
              // }
          }, interval);
      });
  }
  async motorSpeedCir(args){
    if(!this.mode) return
    let data=[]
    //端口
    data.push(Number(args.ONE))
    //标志位
    data.push(103)
    //速度
    data.push(Number(args.TWO))
    //方向x转动单位
    if(args.THREE=='-1'){
      data.push(2*(Number(args.FIVE)+2)*7)
    }else{
      data.push(Number(args.THREE)*(Number(args.FIVE)+2)*7)
    }
    let result=this.splitIntoHighLowByte(Number(args.FOUR))
    result.forEach((byte)=>{
      data.push(byte)
    })
    console.log(data)
    socket.getSocket().send(JSON.stringify(data))
    await new Promise(resolve => setTimeout(resolve, 100)); 

    await this.waitForArrayMatchInArray(() =>this.distance[6], [Number(args.ONE), 103, 0, 0]);
  }
  async setZero(args){

    if(!this.mode) return
    let data=[]
    data.push(Number(args.ONE))
    data.push(103)
    // data.push(80)
    data.push(0)
    data.push(16)
    data.push(0)
    data.push(0)


    socket.getSocket().send(JSON.stringify(data))
    await new Promise(resolve => setTimeout(resolve, 100)); 
  }
  async moveto(args){

    if(!this.mode) return
    let data=[]
    data.push(Number(args.ONE))
    data.push(103)
    data.push(Number(args.TWO))
    data.push(13)

    let result=this.splitIntoHighLowByte(Number(args.THREE))
    result.forEach((byte)=>{
      data.push(byte)
    })

    socket.getSocket().send(JSON.stringify(data))
    await new Promise(resolve => setTimeout(resolve, 100)); 
    await this.waitForArrayMatchInArray(() =>this.distance[6], [Number(args.ONE), 103, 0, 0]);
  }
  async stop(args){

    if(!this.mode) return
    let data =[Number(args.ONE),103,0,0,0]
    socket.getSocket().send(JSON.stringify(data))
    await new Promise(resolve => setTimeout(resolve, 200)); 
  }


  motoranagle(args){
    if(!this.mode) return
      for(let i=0;i<this.distance[6].length;i++){
          if(this.distance[6][i].length>0 && args.ONE==this.distance[6][i][0]){
              if(this.distance[6][i][3]==0){
                  return this.distance[6][i][2]
              }else if(this.distance[6][i][3]==1){
                  return (-1)*this.distance[6][i][2]
              }
          }
      }
      
  }

//   hello() {
//     console.log('执行了')
//     return 'World!';
//   }
//   strictlyEquals(args) {
//     return args.ONE === args.TWO;
//   }
}


module.exports = BricksMotor;
