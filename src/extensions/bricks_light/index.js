const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type')

const blockIconURI = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+cGVuLWljb248L3RpdGxlPjxnIHN0cm9rZT0iIzU3NUU3NSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik04Ljc1MyAzNC42MDJsLTQuMjUgMS43OCAxLjc4My00LjIzN2MxLjIxOC0yLjg5MiAyLjkwNy01LjQyMyA1LjAzLTcuNTM4TDMxLjA2NiA0LjkzYy44NDYtLjg0MiAyLjY1LS40MSA0LjAzMi45NjcgMS4zOCAxLjM3NSAxLjgxNiAzLjE3My45NyA0LjAxNUwxNi4zMTggMjkuNTljLTIuMTIzIDIuMTE2LTQuNjY0IDMuOC03LjU2NSA1LjAxMiIgZmlsbD0iI0ZGRiIvPjxwYXRoIGQ9Ik0yOS40MSA2LjExcy00LjQ1LTIuMzc4LTguMjAyIDUuNzcyYy0xLjczNCAzLjc2Ni00LjM1IDEuNTQ2LTQuMzUgMS41NDYiLz48cGF0aCBkPSJNMzYuNDIgOC44MjVjMCAuNDYzLS4xNC44NzMtLjQzMiAxLjE2NGwtOS4zMzUgOS4zYy4yODItLjI5LjQxLS42NjguNDEtMS4xMiAwLS44NzQtLjUwNy0xLjk2My0xLjQwNi0yLjg2OC0xLjM2Mi0xLjM1OC0zLjE0Ny0xLjgtNC4wMDItLjk5TDMwLjk5IDUuMDFjLjg0NC0uODQgMi42NS0uNDEgNC4wMzUuOTYuODk4LjkwNCAxLjM5NiAxLjk4MiAxLjM5NiAyLjg1NU0xMC41MTUgMzMuNzc0Yy0uNTczLjMwMi0xLjE1Ny41Ny0xLjc2NC44M0w0LjUgMzYuMzgybDEuNzg2LTQuMjM1Yy4yNTgtLjYwNC41My0xLjE4Ni44MzMtMS43NTcuNjkuMTgzIDEuNDQ4LjYyNSAyLjEwOCAxLjI4Mi42Ni42NTggMS4xMDIgMS40MTIgMS4yODcgMi4xMDIiIGZpbGw9IiM0Qzk3RkYiLz48cGF0aCBkPSJNMzYuNDk4IDguNzQ4YzAgLjQ2NC0uMTQuODc0LS40MzMgMS4xNjVsLTE5Ljc0MiAxOS42OGMtMi4xMyAyLjExLTQuNjczIDMuNzkzLTcuNTcyIDUuMDFMNC41IDM2LjM4bC45NzQtMi4zMTYgMS45MjUtLjgwOGMyLjg5OC0xLjIxOCA1LjQ0LTIuOSA3LjU3LTUuMDFsMTkuNzQzLTE5LjY4Yy4yOTItLjI5Mi40MzItLjcwMi40MzItMS4xNjUgMC0uNjQ2LS4yNy0xLjQtLjc4LTIuMTIyLjI1LjE3Mi41LjM3Ny43MzcuNjE0Ljg5OC45MDUgMS4zOTYgMS45ODMgMS4zOTYgMi44NTYiIGZpbGw9IiM1NzVFNzUiIG9wYWNpdHk9Ii4xNSIvPjxwYXRoIGQ9Ik0xOC40NSAxMi44M2MwIC41LS40MDQuOTA1LS45MDQuOTA1cy0uOTA1LS40MDUtLjkwNS0uOTA0YzAtLjUuNDA3LS45MDMuOTA2LS45MDMuNSAwIC45MDQuNDA0LjkwNC45MDR6IiBmaWxsPSIjNTc1RTc1Ii8+PC9nPjwvc3ZnPg==';
const dangoIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABeCAYAAADc6BHlAAAAAXNSR0IArs4c6QAABItJREFUeF7tncuN2zAQhu0SctmCAuSQDnLZAlLCAjkG2BJSwF62gxwWSEG5pIQEFJYKRQ5f8+BzfLSoMfV/8yIl2/db+PrrvXUHxti3/LGJobeUndR5Sx9zRUmJWTquVCyF8a4UKOzj89Pt5em5VMxj3Idf34Pxfz5+y9nYHoQV4PR+I777ioGABM+pHQGyNYRqABjhfTAAiG0hRAH4ns8hvIIIc0RRcZUQ307Fi4btIiELQFJ8hXALevNLK9pC/N0h+CF/Amgp/s4QFECudxY+DtaAHt6/axQoAGEPz5kP1gE9vR+IguXb0tEBGCZLQ7gAGMH7jeI7Lc6GBOBB0AjIFRKJ404UKAAJgXM2dwLQdfUbA7ETAKPBAWGUIgwUYpfTUilpmCJccPsyFixTA+kOgCC8D2RKEN0AQMI//n7L1ebz+MvDpyUiostK2Be/RnhIdQDGNNHQFAC38C6MSEQMDyLYDZXqhCTFT4CYD4BUO+oCoKacXKHwomFoCOAdMe4oaCm+hTMLBPFbkj3EnwkCFJ5sWxM9xTcQZoiCWH5kgdAbwAwQsgAoRdkCkC66FUV5uIKcmhDpIa0RvH+GWpDzCDSEUbx/9DSUA3BuVbthnmtTR/J+IApKrjmX1diO10wG/ApT7psxvfP/SgDstdR8Me82IABzHTWOx+btkCHKRIpAKIA0PwoAyHIARQG0BXBJU6OIP3InxB0BQZ3oDSFx54w7JaNqxZIAKkXvemtzKQAp4b/8/BH10NfPX1PeK6XR8ZmSxo+C3CoFQeKnRI8pHoEhppOYYfuwlzQAX3iM6BAMAISIViJG3y/o/88fVDxuUlPJpMR35yANYloALcS3IDwIrJqxGgO8VywKXABcaScVfVIQpgTQWnzJSJAGYObOGgW9xJeC0AIAKwQLoEXaKeiOyPqRDRR2LZdNOmxr2tv7JaKgFYBLFGAXaL29f3YAJAijeD8AgeTEpJML048/DHXPYGAApC2dHgCCLWv7Rqo2jJJ+uNNQTwBBSoIiykJRAMh8U3ha0f1lY6tX+5lpSdGOjD6xUFjMsCQMBYCRlH7OCUUB0MXEWFAAGNWYzzkgaAQwq1phbigAXNvTIxbhGJNmAFxxYxG3LQDJNBR7OgKCoAAqclfJ0MyjKUHtccaTsgjp5JILYx4jloasoKn/T7CRwOX9pE0kZmFLzYm0o66gPgAzMfen/A2EnQGc+0ec7WgOgA/B8RZyBiEbKHVdxnFdoiACgawf2QCjsDWm2CH4RRhKRQAEsn5kAzWqMY69bNhxpaMeEGYFcNYCC3VWCDMDWALC7ACmh7ACAJuFWOpCakUsUZhXAhBEQ019yG1FWFvcEFYDAEYDsvtytbk+2ef93aO17/35XZG2RYOQFzDCacU3+wtWtyIQVgcQcwIjJuba2SFgJjGCZ/ecAysEBYBDyQZBAeAABB0XtjtSAHgALBAUAA0AGYICoAMgQVAAPADQEBQAHwAMhLsC4AVQBMHdslAA/ACyEBwAGgEy+h9WwcWav2GnESBIwIcAfJRGgKz+YST4u67/APKrBHxjStmdAAAAAElFTkSuQmCC";
const socket=require('../../util/localSocket')

const led = require('../../util/img/led_purple.svg')
const ledCon = require('../../util/img/max_module_led_con.svg')
const currentMode = require('../../util/mode')
const formatMessage = require('format-message');

let dataControl=[17,0,0,0,0,0,0,0,0,0,0,0,0]
class BricksLight {
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
      id: 'brickslight',
      name: formatMessage({
            id: 'brickslight.name',
            default: 'Sound and Light',
            description: 'brickslight.name'
        }),
      color1: '#9400d3',
      blocks: [
        {
            opcode: 'outlight',
            blockType: BlockType.COMMAND,
            blockIconURI: led,
            // text: '端口[ONE]为[TWO]',
            text: formatMessage({
                id: 'brickslight.outlight',
                default: 'Port [ONE] set to [TWO]',
                description: 'brickslight.outlight'
            }),
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu: 'FORMAT_MENU'
                },
                TWO:{
                    type:ArgumentType.COLOR,
                    defaultValue:'#ff0000'
                }
            }
        },
        {
          opcode: 'inlight',
          blockType: BlockType.COMMAND,
          // text: '位置[ONE]为[TWO]',
          text: formatMessage({
              id: 'brickslight.inlight',
              default: 'Position [ONE] set to [TWO]',
              description: 'brickslight.inlight'
          }),
          blockIconURI: ledCon,
          arguments:{
            ONE:{
                type: ArgumentType.STRING,
                menu:'FORMAT_MENU_IMG',
            },
            TWO:{
                type:ArgumentType.COLOR,
                defaultValue:'#ff0000'
            },
          }
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
        FORMAT_MENU_IMG: {
            acceptReporters: false,
            items: [
                {
                    // text:'左上',
                    text: formatMessage({
                        id: 'brickslight.formatMenuImg.leftTop',
                        default: 'Top left',
                        description: 'brickslight.formatMenuImg.leftTop'
                    }),
                    value:'1'
                },
                {
                    // text:'左下',
                    text: formatMessage({
                        id: 'brickslight.formatMenuImg.leftBottom',
                        default: 'Bottom left',
                        description: 'brickslight.formatMenuImg.leftBottom'
                    }),
                    value:'2'
                },
                {
                    // text:'右下',
                    text: formatMessage({
                        id: 'brickslight.formatMenuImg.rightBottom',
                        default: 'Bottom right',
                        description: 'brickslight.formatMenuImg.rightBottom'
                    }),
                    value:'3'
                },
                {
                    // text:'右上',
                    text: formatMessage({
                        id: 'brickslight.formatMenuImg.rightTop',
                        default: 'Top right',
                        description: 'brickslight.formatMenuImg.rightTop'
                    }),
                    value:'4'
                }
                
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
  hexToRgb(hex) {
    // 检查颜色值是否以井号开头
    if (hex.startsWith('#')) {
      // 移除井号
      hex = hex.slice(1);
    }

    // 如果是3位十六进制（例如 #FFF），则扩展为6位十六进制（#FFFFFF）
    if (hex.length === 3) {
      hex = hex.split('').map(function (char) {
        return char + char;
      }).join('');
    }

    // 提取红色、绿色和蓝色部分，并将它们转换为十进制
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    let result=[r,g,b]
    // 返回 RGB 格式的颜色字符串
    return result;
  }
  async outlight(args){
    if(!this.mode) return
    let data=[]
    data.push(Number(args.ONE))
    data.push(64)
    let rgb=this.hexToRgb(args.TWO)
    rgb.forEach((color)=>{
      data.push(color)
    })
    // console.log(JSON.stringify(data))
    socket.getSocket().send(JSON.stringify(data))

    await new Promise(resolve => setTimeout(resolve, 200)); 

  }

  fillRGB(group, r, g, b) {
    // 计算要填充的位置，group-1 是为了从 0 索引开始
    const startIndex = (group - 1) * 3 + 1;  // 每组三个元素，从第一个元素起，第1组填充在 data[1], data[2], data[3]
    
    // 确保 group 范围在 1 到 4 之间
    if (group < 1 || group > 4) {
      console.log('Invalid group. Must be between 1 and 4.');
      return;
    }
  
    // 填充 RGB 数值
    dataControl[startIndex] = r;
    dataControl[startIndex + 1] = g;
    dataControl[startIndex + 2] = b;
  }
  async inlight(args){
    if(!this.mode) return
    let rgb=this.hexToRgb(args.TWO)
    this.fillRGB(Number(args.ONE),rgb[0],rgb[1],rgb[2])
    socket.getSocket().send(JSON.stringify(dataControl))

    await new Promise(resolve => setTimeout(resolve, 200)); 
  }
}


module.exports = BricksLight;
