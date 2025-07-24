const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type')
const Provider = require('./provider')

// const VideoProvider = require('../../../../scratch-gui/src/lib/video/video-provider')

const socket=require('../../util/socket-connect')

const imageLoad = require('../../util/imageLoad')

const aiInfo = require('../../util/aiInfo')
const Providerk210 = require('./provider-k210')

const CameraModal = require('../../util/openCamera/cameraModal');

const cam = new CameraModal();

const imgIcon =require('./img.svg')

const innerCamera = require('./innerCamera.svg')


const blockIconURI = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+cGVuLWljb248L3RpdGxlPjxnIHN0cm9rZT0iIzU3NUU3NSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik04Ljc1MyAzNC42MDJsLTQuMjUgMS43OCAxLjc4My00LjIzN2MxLjIxOC0yLjg5MiAyLjkwNy01LjQyMyA1LjAzLTcuNTM4TDMxLjA2NiA0LjkzYy44NDYtLjg0MiAyLjY1LS40MSA0LjAzMi45NjcgMS4zOCAxLjM3NSAxLjgxNiAzLjE3My45NyA0LjAxNUwxNi4zMTggMjkuNTljLTIuMTIzIDIuMTE2LTQuNjY0IDMuOC03LjU2NSA1LjAxMiIgZmlsbD0iI0ZGRiIvPjxwYXRoIGQ9Ik0yOS40MSA2LjExcy00LjQ1LTIuMzc4LTguMjAyIDUuNzcyYy0xLjczNCAzLjc2Ni00LjM1IDEuNTQ2LTQuMzUgMS41NDYiLz48cGF0aCBkPSJNMzYuNDIgOC44MjVjMCAuNDYzLS4xNC44NzMtLjQzMiAxLjE2NGwtOS4zMzUgOS4zYy4yODItLjI5LjQxLS42NjguNDEtMS4xMiAwLS44NzQtLjUwNy0xLjk2My0xLjQwNi0yLjg2OC0xLjM2Mi0xLjM1OC0zLjE0Ny0xLjgtNC4wMDItLjk5TDMwLjk5IDUuMDFjLjg0NC0uODQgMi42NS0uNDEgNC4wMzUuOTYuODk4LjkwNCAxLjM5NiAxLjk4MiAxLjM5NiAyLjg1NU0xMC41MTUgMzMuNzc0Yy0uNTczLjMwMi0xLjE1Ny41Ny0xLjc2NC44M0w0LjUgMzYuMzgybDEuNzg2LTQuMjM1Yy4yNTgtLjYwNC41My0xLjE4Ni44MzMtMS43NTcuNjkuMTgzIDEuNDQ4LjYyNSAyLjEwOCAxLjI4Mi42Ni42NTggMS4xMDIgMS40MTIgMS4yODcgMi4xMDIiIGZpbGw9IiM0Qzk3RkYiLz48cGF0aCBkPSJNMzYuNDk4IDguNzQ4YzAgLjQ2NC0uMTQuODc0LS40MzMgMS4xNjVsLTE5Ljc0MiAxOS42OGMtMi4xMyAyLjExLTQuNjczIDMuNzkzLTcuNTcyIDUuMDFMNC41IDM2LjM4bC45NzQtMi4zMTYgMS45MjUtLjgwOGMyLjg5OC0xLjIxOCA1LjQ0LTIuOSA3LjU3LTUuMDFsMTkuNzQzLTE5LjY4Yy4yOTItLjI5Mi40MzItLjcwMi40MzItMS4xNjUgMC0uNjQ2LS4yNy0xLjQtLjc4LTIuMTIyLjI1LjE3Mi41LjM3Ny43MzcuNjE0Ljg5OC45MDUgMS4zOTYgMS45ODMgMS4zOTYgMi44NTYiIGZpbGw9IiM1NzVFNzUiIG9wYWNpdHk9Ii4xNSIvPjxwYXRoIGQ9Ik0xOC40NSAxMi44M2MwIC41LS40MDQuOTA1LS45MDQuOTA1cy0uOTA1LS40MDUtLjkwNS0uOTA0YzAtLjUuNDA3LS45MDMuOTA2LS45MDMuNSAwIC45MDQuNDA0LjkwNC45MDR6IiBmaWxsPSIjNTc1RTc1Ii8+PC9nPjwvc3ZnPg==';
const dangoIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABeCAYAAADc6BHlAAAAAXNSR0IArs4c6QAABItJREFUeF7tncuN2zAQhu0SctmCAuSQDnLZAlLCAjkG2BJSwF62gxwWSEG5pIQEFJYKRQ5f8+BzfLSoMfV/8yIl2/db+PrrvXUHxti3/LGJobeUndR5Sx9zRUmJWTquVCyF8a4UKOzj89Pt5em5VMxj3Idf34Pxfz5+y9nYHoQV4PR+I777ioGABM+pHQGyNYRqABjhfTAAiG0hRAH4ns8hvIIIc0RRcZUQ307Fi4btIiELQFJ8hXALevNLK9pC/N0h+CF/Amgp/s4QFECudxY+DtaAHt6/axQoAGEPz5kP1gE9vR+IguXb0tEBGCZLQ7gAGMH7jeI7Lc6GBOBB0AjIFRKJ404UKAAJgXM2dwLQdfUbA7ETAKPBAWGUIgwUYpfTUilpmCJccPsyFixTA+kOgCC8D2RKEN0AQMI//n7L1ebz+MvDpyUiostK2Be/RnhIdQDGNNHQFAC38C6MSEQMDyLYDZXqhCTFT4CYD4BUO+oCoKacXKHwomFoCOAdMe4oaCm+hTMLBPFbkj3EnwkCFJ5sWxM9xTcQZoiCWH5kgdAbwAwQsgAoRdkCkC66FUV5uIKcmhDpIa0RvH+GWpDzCDSEUbx/9DSUA3BuVbthnmtTR/J+IApKrjmX1diO10wG/ApT7psxvfP/SgDstdR8Me82IABzHTWOx+btkCHKRIpAKIA0PwoAyHIARQG0BXBJU6OIP3InxB0BQZ3oDSFx54w7JaNqxZIAKkXvemtzKQAp4b/8/BH10NfPX1PeK6XR8ZmSxo+C3CoFQeKnRI8pHoEhppOYYfuwlzQAX3iM6BAMAISIViJG3y/o/88fVDxuUlPJpMR35yANYloALcS3IDwIrJqxGgO8VywKXABcaScVfVIQpgTQWnzJSJAGYObOGgW9xJeC0AIAKwQLoEXaKeiOyPqRDRR2LZdNOmxr2tv7JaKgFYBLFGAXaL29f3YAJAijeD8AgeTEpJML048/DHXPYGAApC2dHgCCLWv7Rqo2jJJ+uNNQTwBBSoIiykJRAMh8U3ha0f1lY6tX+5lpSdGOjD6xUFjMsCQMBYCRlH7OCUUB0MXEWFAAGNWYzzkgaAQwq1phbigAXNvTIxbhGJNmAFxxYxG3LQDJNBR7OgKCoAAqclfJ0MyjKUHtccaTsgjp5JILYx4jloasoKn/T7CRwOX9pE0kZmFLzYm0o66gPgAzMfen/A2EnQGc+0ec7WgOgA/B8RZyBiEbKHVdxnFdoiACgawf2QCjsDWm2CH4RRhKRQAEsn5kAzWqMY69bNhxpaMeEGYFcNYCC3VWCDMDWALC7ACmh7ACAJuFWOpCakUsUZhXAhBEQ019yG1FWFvcEFYDAEYDsvtytbk+2ef93aO17/35XZG2RYOQFzDCacU3+wtWtyIQVgcQcwIjJuba2SFgJjGCZ/ecAysEBYBDyQZBAeAABB0XtjtSAHgALBAUAA0AGYICoAMgQVAAPADQEBQAHwAMhLsC4AVQBMHdslAA/ACyEBwAGgEy+h9WwcWav2GnESBIwIcAfJRGgKz+YST4u67/APKrBHxjStmdAAAAAElFTkSuQmCC";

let isCamera=false
let isMic=false
let socketSound
let stream
// let flag='0'
// const channel = new BroadcastChannel('flag_channel');
// channel.addEventListener('message', (event) => {
//     console.log('Received flag data:', event.data);
//     flag=event.data
// });
let downcurrent=''
let upcurrent=''
let isSend=false

let isCompoterCamer=false
let isNetCamera=false
// let move=['','']

const keyPressTimestamps = {}; // 用于存储每个按键的上一次按下时间
const QUICK_PRESS_THRESHOLD = 500; // 定义快速按下的时间阈值（毫秒）
let allKeyPress=Date.now()
let allKeyUp=Date.now()
const pressedKeys = new Set();  // 用于记录当前按下的键
let preKey=null
let preSpeed=null

let pressTime=Date.now()
let upTime=Date.now()

let videoIsStart=false

let audioContext, processor;
let audioChunks = [];
let isSSRecording = false;
const CHUNK_SIZE = 1024; // 每块的帧数
const keyState = {
    W: false, // W键是否按下
    A: false, // A键是否按下
    S: false, // S键是否按下
    D: false,  // D键是否按下
    R: false,  // R键是否按下
    B: false,
    C: false,
    E: false,
    F: false,
    G: false,
    H: false,
    I: false,
    J: false,
    K: false,
    L: false,
    M: false,
    N: false,
    O: false,
    P: false,
    Q: false,
    T: false,
    U: false,
    V: false,
    X: false,
    Y: false,
    Z: false,
};

let THIS
class RobotImg {
    constructor(runtime){
        this.runtime=runtime
        this.flag='0'
        this.channel = new BroadcastChannel('flag_channel');
        this.channel.addEventListener('message', (event) => {
            console.log('Received flag data:', event.data);
            this.flag=event.data
            // if(this.flag=='0'){
            //     this.cstopCamera()
            //     this.cstopmicph()
            // }
        });

        this.videoProvider=this.runtime.ioDevices.video.videoProvider
        THIS=this
        // 设置键盘事件监听
        this.move = ['', '']; // 用于记录按键的状态
        this.setupKeyboardListeners();


        this.isCamera=false

        this.mode=true
        this.channelMode=new BroadcastChannel('mode')
        this.channelMode.addEventListener('message',async(event)=>{
            this.mode=event.data
            if(!this.mode){
                // this.runtime.ioDevices.video.disableVideo();
                // this.cstopCamera()
                // this.cstopComputerCamera()
                 this.cstartCamera({ONE:'2'})
                THIS.cstartNetCamera({ONE:'2'})
                this.cstopComputerCamera()
                // await new Promise(resolve => setTimeout(resolve, 5000)); 
                await this.cstopMode({ONE:'3'})
                await this.cstopMode({ONE:'4'})
                await this.cstopMode({ONE:'6'})
                await this.cstopMode({ONE:'2'})
                await this.cstopMode({ONE:'1'})
                await this.cstopMode({ONE:'5'})
                await this.cstopMode({ONE:'7'})
                await this.cstopMode({ONE:'8'})
                imageLoad.setIsImage(false)
            }
        })

        this.loadingEnd='loading'

        this.channelLoad = new BroadcastChannel('isLoading');
        this.channelLoad.addEventListener('message',(event)=>{
            // console.log('--------------------'+event.data)
            if(!event.data){
                this.loadingEnd='done'
            }
        })




        this.qrData=null
        this.runtime.on('qrDetected', (event) => {
            // console.log(event)
            this.qrData=event
            // 这里可以调用 WiFi 断开函数
        });

        this.stopAll=new BroadcastChannel('stopAll')
        this.stopAll.addEventListener('message',async (event)=>{
            console.log(event.data)
            console.log('----------')
            if(event.data){
                this.cstartCamera({ONE:'2'})
                THIS.cstartNetCamera({ONE:'2'})
                this.cstopComputerCamera()
                // await new Promise(resolve => setTimeout(resolve, 5000)); 
                await this.cstopMode({ONE:'3'})
                await this.cstopMode({ONE:'4'})
                await this.cstopMode({ONE:'6'})
                await this.cstopMode({ONE:'2'})
                await this.cstopMode({ONE:'1'})
                await this.cstopMode({ONE:'5'})
                await this.cstopMode({ONE:'7'})
                await this.cstopMode({ONE:'8'})
                await new Promise(resolve => setTimeout(resolve, 1000)); 
                this.runtime.ioDevices.video.stopVideo()

                await socket.setSocket([])
                socket.setLastPostTime(Date.now())
            }
        })

        this.isClose=false
        this.reciveChannel = new BroadcastChannel('reciveChannel')
        this.reciveChannel.addEventListener('message',async(event)=>{
            if(event.data[2]==0 && !this.isClose){
                this.isClose=true
                this.cstopCamera()
                this.cstopComputerCamera()
                // await new Promise(resolve => setTimeout(resolve, 5000)); 
                await this.cstopMode({ONE:'3'})
                await this.cstopMode({ONE:'4'})
                await this.cstopMode({ONE:'6'})
                await this.cstopMode({ONE:'2'})
                await this.cstopMode({ONE:'1'})
                await this.cstopMode({ONE:'5'})
                await this.cstopMode({ONE:'7'})
                await this.cstopMode({ONE:'8'})
                await new Promise(resolve => setTimeout(resolve, 1000)); 
                this.runtime.ioDevices.video.stopVideo()
            }else if(event.data[2]==1 &&this.isClose){
                this.isClose=false
            }
        })

    }

    setupKeyboardListeners(){
        window.addEventListener('keydown', function keyDown(event) {
            let currentTime=Date.now()
            if(currentTime-pressTime>200){
                THIS.move[0]=event.key
                THIS.move[1]='1'
            }
            pressTime=currentTime
            
            // downcurrent=event.key
            // if(upcurrent==event.key){
            //     upcurrent=''
            // }
        });

        window.addEventListener('offline', () => {
            videoIsStart=false
        })
        
        window.addEventListener('keyup', function keyUp(event) {
            let currentTime=Date.now()
            if(currentTime-upTime>200){
                THIS.move[0]=event.key
                THIS.move[1]='0'
            }
            upTime=currentTime
            
            // upcurrent=event.key
            // if(downcurrent==event.key){
            //     downcurrent=''
            // }
        });
        this.channelHostPot=new BroadcastChannel('hostpot')
        this.channelHostPot.addEventListener('message',async(event)=>{
            if(!event.data){
                if(this.runtime.ioDevices.video.videoProvider.constructor.name!='VideoProvider'){
                    // this.cstopCamera()
                    // this.cstopComputerCamera()
                    console.log('断网一次')
                     this.cstartCamera({ONE:'2'})
                    THIS.cstartNetCamera({ONE:'2'})
                    this.cstopComputerCamera()
                    await this.cstopMode({ONE:'3'})
                    await this.cstopMode({ONE:'4'})
                    await this.cstopMode({ONE:'6'})
                    await this.cstopMode({ONE:'2'})
                    await this.cstopMode({ONE:'1'})
                    await this.cstopMode({ONE:'5'})
                    await this.cstopMode({ONE:'7'})
                    await this.cstopMode({ONE:'8'})
                }
                
            }
            
        })

        this.modeEnterTime=Date.now()


        this.deviceList=[]
        this.initCamera();
        
        
        // (async ()=>{
        //     await navigator.mediaDevices.getUserMedia({ video: true });
        // })()


        navigator.mediaDevices.ondevicechange = async function () {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(d => d.kind === 'videoinput');

            THIS.deviceList=videoDevices
            THIS.runtime.requestBlocksUpdate();
            console.log('📷 摄像头设备变化:', videoDevices);
            
        };

        setInterval(async () => {
            const newDevices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = newDevices.filter(d => d.kind === 'videoinput');
            const hasChanged = JSON.stringify(videoDevices) !== JSON.stringify(this.deviceList);

            // console.log(newDevices)
            if (hasChanged) {
                this.deviceList = videoDevices;
                this.runtime.requestBlocksUpdate();
                console.log('摄像头变更(轮询检测):', videoDevices);
            }
        }, 3000);

        // console.log(window.EditorPreload)

        this.cameraPlace='0'
    }
  getInfo() {

    return {
      id: 'robotimg',
      name: '视觉识别',
      color1: '#b22222',
      menuIconURI: imgIcon,
      blocks: [

         {
            opcode: 'howStartCamera',
            blockType: BlockType.COMMAND,
            // blockIconURI: blockIconURI,
            text: '设置摄像头画面[ONE]',
            arguments:{
                ONE:{

                    type:ArgumentType.STRING,
                    menu:'CAMERA_PLACE',
                    
                },
            }
        },
        {
            opcode: 'cstartCamera',
            blockType: BlockType.COMMAND,
            // blockIconURI: blockIconURI,
            blockIconURI: innerCamera,
            text: '[ONE]机器人摄像头',
            arguments:{
                ONE:{

                    type:ArgumentType.STRING,
                    menu:'MENU_MIRROR',
                    
                },
                // TWO:{

                //     type:ArgumentType.STRING,
                //     menu:'MENU_CAMERA_PIXEL',
                    
                // },
            }
        },
        // {
        //     opcode: 'cstopCamera',
        //     blockType: BlockType.COMMAND,
        //     // blockIconURI: blockIconURI,
        //     text: '关闭机器人摄像头',
        //     arguments:{
        //     }
        // },

        // {
        //     opcode: 'csetCamera',
        //     blockType: BlockType.COMMAND,
        //     // blockIconURI: blockIconURI,
        //     text: '设置摄像头像素为[ONE]',
        //     arguments:{
        //         ONE:{

        //             type:ArgumentType.STRING,
        //             menu:'MENU_CAMERA_PIXEL',
                    
        //         },
        //     }
        // },

        {
            opcode: 'cstartComputerCamera',
            blockType: BlockType.COMMAND,
            // blockIconURI: blockIconURI,
            text: '[ONE] 摄像头 [TWO]',
            arguments:{
                ONE:{

                    type:ArgumentType.STRING,
                    menu:'MENU_MIRROR',
                    
                },


                TWO:{

                    type:ArgumentType.STRING,
                    menu:'MENU_WHAT_CAMERA',
                    defaultValue:'请选择'
                    
                },
            }
        },

        {
            opcode: 'cstartNetCamera',
            blockType: BlockType.COMMAND,
            // blockIconURI: blockIconURI,
            text: '[ONE]摄像头 IP:[TWO]',
            arguments:{
                ONE:{

                    type:ArgumentType.STRING,
                    menu:'MENU_MIRROR',
                    
                },
                TWO:{
                    type:ArgumentType.STRING,
                     defaultValue: '192.168.137.2',
                }
            }
        },
        // {
        //     opcode: 'cstopComputerCamera',
        //     blockType: BlockType.COMMAND,
        //     // blockIconURI: blockIconURI,
        //     text: '关闭电脑摄像头',
        //     arguments:{
        //     }
        // },
        '---',

        {
            opcode: 'isOpenCamera',
            blockType: BlockType.BOOLEAN,
            text: '机器人摄像头开启成功？',
            arguments:{
                
            },
            disableMonitor: true
        },

        '---',

        {
            opcode: 'isOpenModel',
            blockType: BlockType.BOOLEAN,
            text: '模型加载成功？',
            arguments:{
                
            },
            disableMonitor: true
        },

        '---',
        // {
        //     opcode: 'cstartmicph',
        //     blockType: BlockType.COMMAND,
        //     // blockIconURI: blockIconURI,
        //     text: '开启麦克风',
        //     arguments:{
                
        //     }
        // },
        // {
        //     opcode: 'cstopmicph',
        //     blockType: BlockType.COMMAND,
        //     // blockIconURI: blockIconURI,
        //     text: '关闭麦克风',
        //     arguments:{
                
        //     }
        // },

        {
            opcode: 'cstartMode',
            blockType: BlockType.COMMAND,
            // blockIconURI: blockIconURI,
            text: '开启[ONE]模式',
            arguments:{
                ONE:{

                    type:ArgumentType.STRING,
                    menu:'MENU_AI_MODE',
                    
                },
            }
        },


        {
            opcode: 'cstopMode',
            blockType: BlockType.COMMAND,
            // blockIconURI: blockIconURI,
            text: '关闭[ONE]模式',
            arguments:{
                ONE:{

                    type:ArgumentType.STRING,
                    menu:'MENU_AI_MODE',
                    
                },
            }
        },
        '---',

        {
            opcode: 'readColor',
            blockType: BlockType.REPORTER,
            text: '获取色块的颜色[THREE]值',
            arguments:{
                THREE:{

                    type:ArgumentType.STRING,
                    menu:'MENU_RGB',
                    
                },
            },
            disableMonitor: true
        },

        '---',

        {
            opcode: 'setColor',
            blockType: BlockType.COMMAND,
            // blockIconURI: blockIconURI,
            text: '设置追踪颜色[ONE]',
            arguments:{
                ONE:{

                    type:ArgumentType.STRING,
                    menu:'MENU_COLOR',
                    
                },
            }
        },

        {
            opcode: 'isReadColor',
            blockType: BlockType.BOOLEAN,
            text: '追踪到目标颜色？',
            arguments:{
                
            },
            disableMonitor: true
        },


        {
            opcode: 'readColorPlace',
            blockType: BlockType.REPORTER,
            text: '获取色块位置信息[ONE]',
            arguments:{
                ONE:{
                    type:ArgumentType.STRING,
                    menu:'MENU_PLACE',
                }
            },
            disableMonitor: true
        },


        {
            opcode: 'getColorWh',
            blockType: BlockType.REPORTER,
            text: '获取色块的[ONE]',
            arguments:{
                ONE:{

                    type:ArgumentType.STRING,
                    menu:'MENU_WH',
                    
                },
            },
            disableMonitor: true
        },

        '---',

{
            opcode: 'whatPlaceColor',
            blockType: BlockType.BOOLEAN,
            text: '目标颜色位于[ONE]',
            arguments:{
                ONE:{

                    type:ArgumentType.STRING,
                    menu:'MENU_WHAT_PLACE',
                    
                },
            },
            disableMonitor: true
        },
        '---',
        {
            opcode: 'isQr',
            blockType: BlockType.BOOLEAN,
            text: '识别到二维码?',
            arguments:{
                
            },
            disableMonitor: true
        },

        {
            opcode: 'getQrContent',
            blockType: BlockType.REPORTER,
            text: '获取二维码内容',
            arguments:{
                
            },
            disableMonitor: true
        },

        {
            opcode: 'getQrPlace',
            blockType: BlockType.REPORTER,
            text: '获取二维码[ONE]轴信息',
            arguments:{
                ONE:{

                    type:ArgumentType.STRING,
                    menu:'MENU_PLACE',
                    
                },
            },
            disableMonitor: true
        },

        {
            opcode: 'getQrWh',
            blockType: BlockType.REPORTER,
            text: '获取二维码的[ONE]',
            arguments:{
                ONE:{

                    type:ArgumentType.STRING,
                    menu:'MENU_WH',
                    
                },
            },
            disableMonitor: true
        },

        '---',
        {
            opcode: 'isCat',
            blockType: BlockType.BOOLEAN,
            text: '检测到猫脸?',
            arguments:{
                
            },
            disableMonitor: true
        },

        {
            opcode: 'catNum',
            blockType: BlockType.REPORTER,
            text: '检测到的猫脸数量',
            arguments:{
                
            },
            disableMonitor: true
        },

        {
            opcode: 'catPlace',
            blockType: BlockType.REPORTER,
            text: '获取猫脸位置信息[ONE]',
            arguments:{
                ONE:{

                    type:ArgumentType.STRING,
                    menu:'MENU_PLACE',
                    
                },
                
            },
            disableMonitor: true
        },


        '---',

        {
            opcode: 'isFace',
            blockType: BlockType.BOOLEAN,
            text: '检测到人脸?',
            arguments:{
                
            },
            disableMonitor: true
        },

        {
            opcode: 'faceNum',
            blockType: BlockType.REPORTER,
            text: '检测到的人脸数量',
            arguments:{
                
            },
            disableMonitor: true
        },

        {
            opcode: 'facePlace',
            blockType: BlockType.REPORTER,
            text: '获取人脸位置信息[ONE]',
            arguments:{
                ONE:{

                    type:ArgumentType.STRING,
                    menu:'MENU_PLACE',
                    
                },
                
            },
            disableMonitor: true
        },

        {
            opcode: 'getFaceWh',
            blockType: BlockType.REPORTER,
            text: '获取人脸的[ONE]',
            arguments:{
                ONE:{

                    type:ArgumentType.STRING,
                    menu:'MENU_WH',
                    
                },
            },
            disableMonitor: true
        },

        {
            opcode: 'symFace',
            blockType: BlockType.COMMAND,
            // blockIconURI: blockIconURI,
            text: '标记当前人脸[ONE]',
            arguments:{
                ONE:{

                    type:ArgumentType.STRING,
                    
                },
            }
        },
        {
            opcode: 'isSymFace',
            blockType: BlockType.BOOLEAN,
            text: '检测到标记过的人脸?',
            arguments:{
                
            },
            disableMonitor: true
        },

        {
            opcode: 'faceName',
            blockType: BlockType.REPORTER,
            text: '检测到的人脸名称',
            arguments:{
                
            },
            disableMonitor: true
        },


        '---',

        // {
        //     opcode: 'symFacePlace',
        //     blockType: BlockType.REPORTER,
        //     text: '获取人脸位置信息',
        //     arguments:{
                
        //     },
        //     disableMonitor: true
        // },

        {
            opcode: 'isGood',
            blockType: BlockType.BOOLEAN,
            text: '识别到物体[ONE]?',
            arguments:{
                ONE:{
                    type:ArgumentType.STRING,
                    menu:'MENU_OBJECT'
                }
            },
            disableMonitor: true
        },

        {
            opcode: 'goodPlace',
            blockType: BlockType.REPORTER,
            text: '获取物体位置信息[ONE]',
            arguments:{
                ONE:{
                    type:ArgumentType.STRING,
                    menu:'MENU_PLACE',
                }
            },
            disableMonitor: true
        },

        {
            opcode: 'getGoodWh',
            blockType: BlockType.REPORTER,
            text: '获取物体的的[ONE]',
            arguments:{
                ONE:{

                    type:ArgumentType.STRING,
                    menu:'MENU_WH',
                    
                },
            },
            disableMonitor: true
        },


        '---',

        {
            opcode: 'isApril',
            blockType: BlockType.BOOLEAN,
            text: '识别到AprilTag码?',
            arguments:{
                
            },
            disableMonitor: true
        },

        {
            opcode: 'getAprilContent',
            blockType: BlockType.REPORTER,
            text: '获取AprilTag码内容',
            arguments:{
                
            },
            disableMonitor: true
        },

        {
            opcode: 'getAprilPlace',
            blockType: BlockType.REPORTER,
            text: '获取AprilTag码[ONE]轴信息',
            arguments:{
                ONE:{

                    type:ArgumentType.STRING,
                    menu:'MENU_PLACE',
                    
                },
            },
            disableMonitor: true
        },

        {
            opcode: 'getAprilWh',
            blockType: BlockType.REPORTER,
            text: '获取AprilTag码的[ONE]',
            arguments:{
                ONE:{

                    type:ArgumentType.STRING,
                    menu:'MENU_WH',
                    
                },
            },
            disableMonitor: true
        },


         {
            opcode: 'getTraffic',
            blockType: BlockType.REPORTER,
            text: '路标id',
            arguments:{
                ONE:{
                    
                },
            },
            disableMonitor: true
        },
        // {
        //     opcode: 'isTraffic',
        //     blockType: BlockType.BOOLEAN,
        //     text: '识别到路标[ONE]?',
        //     arguments:{
        //         ONE:{
        //             type:ArgumentType.STRING,
        //             menu:'MENU_TRAFFIC'
        //         }
        //     },
        //     disableMonitor: true
        // },

        // {
        //     opcode: 'trafficPlace',
        //     blockType: BlockType.REPORTER,
        //     text: '获取路标位置信息[ONE]',
        //     arguments:{
        //         ONE:{
        //             type:ArgumentType.STRING,
        //             menu:'MENU_PLACE',

        //         }
        //     },
        //     disableMonitor: true
        // },
        // {
        //     opcode: 'cstartmicph',
        //     blockType: BlockType.COMMAND,
        //     blockIconURI: blockIconURI,
        //     text: '以[ONE]模式开启麦克风',
        //     arguments:{
        //         ONE:{
        //             type: ArgumentType.STRING,
        //             menu:'MENU_MODE',
        //         },
        //     }
        // },
        // {
        //     opcode: 'cstopmicph',
        //     blockType: BlockType.COMMAND,
        //     blockIconURI: blockIconURI,
        //     text: '以[ONE]模式关闭麦克风',
        //     arguments:{
        //         ONE:{
        //             type: ArgumentType.STRING,
        //             menu:'MENU_MODE',
        //         },
        //     }
        // },


        // {
        //     opcode: 'cstartmicph',
        //     blockType: BlockType.COMMAND,
        //     // blockIconURI: blockIconURI,
        //     text: '开启麦克风',
        //     arguments:{
                
        //     }
        // },
        // {
        //     opcode: 'cstopmicph',
        //     blockType: BlockType.COMMAND,
        //     // blockIconURI: blockIconURI,
        //     text: '关闭麦克风',
        //     arguments:{
                
        //     }
        // },
        // {
        //     opcode: 'cstartRoad',
        //     blockType: BlockType.COMMAND,
        //     blockIconURI: blockIconURI,
        //     text: '开启路标识别',
        //     arguments:{
        //     }
        // },
        // {
        //     opcode: 'cstopRoad',
        //     blockType: BlockType.COMMAND,
        //     blockIconURI: blockIconURI,
        //     text: '关闭路标识别',
        //     arguments:{
        //     }
        // },

        // {
        //     opcode: 'cstartmegph',
        //     blockType: BlockType.COMMAND,
        //     blockIconURI: blockIconURI,
        //     text: '开启喇叭',
            
        // },
        // {
        //     opcode: 'cstopmegph',
        //     blockType: BlockType.COMMAND,
        //     blockIconURI: blockIconURI,
        //     text: '关闭喇叭',
            
        // },
        // {
        //     opcode: 'cstartTranser',
        //     blockType: BlockType.COMMAND,
        //     blockIconURI: blockIconURI,
        //     text: '开启图传',
            
        // },
        // {
        //     opcode: 'ctwodimen',
        //     blockType: BlockType.COMMAND,
        //     blockIconURI: blockIconURI,
        //     text: '开始二维码识别',
            
        // },

        // {
        //     opcode: 'cstoptwodimen',
        //     blockType: BlockType.COMMAND,
        //     blockIconURI: blockIconURI,
        //     text: '停止二维码识别',
            
        // },

        // {
        //     opcode: 'twodimenresult',
        //     blockType: BlockType.REPORTER,
        //     text: '二维码识别结果',
        //     disableMonitor: true
        // },

        // {
        //     opcode: 'cimgclassifer',
        //     blockType: BlockType.COMMAND,
        //     blockIconURI: blockIconURI,
        //     text: '开始图像分类识别',
            
        // },

        // {
        //     opcode: 'cstopimgclassifer',
        //     blockType: BlockType.COMMAND,
        //     blockIconURI: blockIconURI,
        //     text: '停止图像分类识别',
            
        // },

        // {
        //     opcode: 'imgclassiferresult',
        //     blockType: BlockType.REPORTER,
        //     text: '图像分类识别结果',
        //     disableMonitor: true
        // },

        // {
        //     opcode: 'cstarthand',
        //     blockType: BlockType.COMMAND,
        //     blockIconURI: blockIconURI,
        //     text: '开始手势识别',
            
        // },

        // {
        //     opcode: 'cstophand',
        //     blockType: BlockType.COMMAND,
        //     blockIconURI: blockIconURI,
        //     text: '停止手势识别',
            
        // },

        // {
        //     opcode: 'handresult',
        //     blockType: BlockType.REPORTER,
        //     text: '手势识别结果',
        //     disableMonitor: true
        // },

        // {
        //     opcode: 'cstartface',
        //     blockType: BlockType.COMMAND,
        //     blockIconURI: blockIconURI,
        //     text: '开始人脸检测',
            
        // },

        // {
        //     opcode: 'cstopface',
        //     blockType: BlockType.COMMAND,
        //     blockIconURI: blockIconURI,
        //     text: '停止人脸检测',
            
        // },

        // {
        //     opcode: 'faceresult',
        //     blockType: BlockType.REPORTER,
        //     text: '识别到的人脸数量',
        //     disableMonitor: true
        // },


        // {
        //     opcode: 'cstartcolordete',
        //     blockType: BlockType.COMMAND,
        //     blockIconURI: blockIconURI,
        //     text: '开始颜色追踪',
            
        // },

        // {
        //     opcode: 'cstopcolordete',
        //     blockType: BlockType.COMMAND,
        //     blockIconURI: blockIconURI,
        //     text: '停止颜色追踪',
            
        // },
        // {
        //     opcode: 'cstartmove',
        //     blockType: BlockType.COMMAND,
        //     // blockIconURI: blockIconURI,
        //     text: '[ONE]图传运动控制',
        //     arguments:{
        //         ONE:{
        //             type: ArgumentType.STRING,
        //             menu:'MENU_IMGCON'
        //         },
        //     },
            
        // },


        // {
        //     opcode: 'moveresult',
        //     blockType: BlockType.REPORTER,
        //     text: '键盘按键',
        //     disableMonitor: true
        // },

        // {
        //     opcode: 'keyisdown',
        //     blockType: BlockType.BOOLEAN,
        //     text: '键盘按键[ONE]被按下',
        //     arguments:{
        //         ONE:{
        //             type: ArgumentType.STRING,
        //             menu:'MENU_KEY'
        //         },
        //     },
        //     disableMonitor: true
        // },

        // {
        //     opcode: 'keyisup',
        //     blockType: BlockType.BOOLEAN,
        //     text: '键盘按键[ONE]被松开',
        //     arguments:{
        //         ONE:{
        //             type: ArgumentType.STRING,
        //             menu:'MENU_KEY'
        //         },
        //     },
        //     disableMonitor: true
        // },
        
        

      ],
      menus:{
        MENU_RGB:{
            acceptReporters: false,
            items: [
                {
                    text: 'R',
                    value: 'r'
                },
                {
                    text: 'G',
                    value: 'g'
                },
                {
                    text: 'B',
                    value: 'b'
                },

            ]
        },

        MENU_WHAT_PLACE:{
            acceptReporters: false,
            items: [
                {
                    text: '中心',
                    value: 'center'
                },
                {
                    text: '左侧',
                    value: 'left'
                },
                {
                    text: '右侧',
                    value: 'right'
                },
                {
                    text: '上方',
                    value: 'top'
                },
                {
                    text: '下方',
                    value: 'bottom'
                },

            ]
        },
        MENU_WHAT_CAMERA:{
            acceptReporters: false,
            items:'getCamera'
        },
        MENU_KEY:{
            acceptReporters: false,
            items: [
                {
                    text: 'a',
                    value: 'a'
                },
                {
                    text: 'b',
                    value: 'b'
                },
                {
                    text: 'c',
                    value: 'c'
                },
                {
                    text: 'd',
                    value: 'd'
                },
                {
                    text: 'e',
                    value: 'e'
                },
                {
                    text: 'f',
                    value: 'f'
                },
                {
                    text: 'g',
                    value: 'g'
                },
                {
                    text: 'h',
                    value: 'h'
                },
                {
                    text: 'i',
                    value: 'i'
                },
                {
                    text: 'j',
                    value: 'j'
                },
                {
                    text: 'k',
                    value: 'k'
                },
                {
                    text: 'l',
                    value: 'l'
                },
                {
                    text: 'm',
                    value: 'm'
                },
                {
                    text: 'n',
                    value: 'n'
                },
                {
                    text: 'o',
                    value: 'o'
                },
                {
                    text: 'p',
                    value: 'p'
                },
                {
                    text: 'q',
                    value: 'q'
                },
                {
                    text: 'r',
                    value: 'r'
                },
                {
                    text: 's',
                    value: 's'
                },
                {
                    text: 't',
                    value: 't'
                },
                {
                    text: 'u',
                    value: 'u'
                },
                {
                    text: 'v',
                    value: 'v'
                },
                {
                    text: 'w',
                    value: 'w'
                },
                {
                    text: 'x',
                    value: 'x'
                },
                {
                    text: 'y',
                    value: 'y'
                },
                {
                    text: 'z',
                    value: 'z'
                },

            ]
        },

        MENU_OBJECT:{
            acceptReporters: false,
            items: [
                {
                    text: '人',
                    value: '人'
                },
                {
                    text: '自行车',
                    value: '自行车'
                },


                {
                    text: '汽车',
                    value: '汽车'
                },
                {
                    text: '摩托车',
                    value: '摩托车'
                },

                {
                    text: '飞机',
                    value: '飞机'
                },
                {
                    text: '公交车',
                    value: '公交车'
                },


                {
                    text: '火车',
                    value: '火车'
                },
                {
                    text: '卡车',
                    value: '卡车'
                },

                {
                    text: '船',
                    value: '船'
                },
                {
                    text: '红绿灯',
                    value: '红绿灯'
                },


                {
                    text: '消防栓',
                    value: '消防栓'
                },
                {
                    text: '停止标志',
                    value: '停止标志'
                },

                {
                    text: '停车表',
                    value: '停车表'
                },
                {
                    text: '长椅',
                    value: '长椅'
                },


                {
                    text: '鸟',
                    value: '鸟'
                },
                {
                    text: '猫',
                    value: '猫'
                },



                {
                    text: '狗',
                    value: '狗'
                },
                {
                    text: '西兰花',
                    value: '西兰花'
                },


                {
                    text: '胡萝卜',
                    value: '胡萝卜'
                },
                {
                    text: '热狗',
                    value: '热狗'
                },

                {
                    text: '比萨',
                    value: '比萨'
                },
                {
                    text: '甜甜圈',
                    value: '甜甜圈'
                },


                {
                    text: '蛋糕',
                    value: '蛋糕'
                },
                {
                    text: '椅子',
                    value: '椅子'
                },

                {
                    text: '沙发',
                    value: '沙发'
                },
                {
                    text: '盆栽植物',
                    value: '盆栽植物'
                },


                {
                    text: '床',
                    value: '床'
                },
                {
                    text: '餐桌',
                    value: '餐桌'
                },

                {
                    text: '马桶',
                    value: '马桶'
                },
                {
                    text: '电视',
                    value: '电视'
                },


                {
                    text: '笔记本电脑',
                    value: '笔记本电脑'
                },
                {
                    text: '鼠标',
                    value: '鼠标'
                },

                {
                    text: '遥控器',
                    value: '遥控器'
                },
                {
                    text: '键盘',
                    value: '键盘'
                },


                {
                    text: '手机',
                    value: '手机'
                },
                {
                    text: '微波炉',
                    value: '微波炉'
                },
            ]
        },
        MENU_TRAFFIC:{
            acceptReporters: false,
            items: [
                {
                    text: '左转',
                    value: '左转'
                },
                {
                    text: '右转',
                    value: '右转'
                },
            ]
        },
        MENU_MODE:{
            acceptReporters: false,
            items: [
                {
                    text: '脚本',
                    value: '1'
                },
                {
                    text: '互动',
                    value: '2'
                },
            ]
        },
        MENU_IMGCON:{
            acceptReporters: false,
            items: [
                {
                    text: '开启',
                    value: '1'
                },
                {
                    text: '关闭',
                    value: '2'
                },
            ]
        },
        MENU_AI_MODE:{
            acceptReporters: false,
            items: [
                {
                    text: '颜色识别',
                    value: '1'
                },
                {
                    text: '颜色坐标追踪',
                    value: '2'
                },
                {
                    text: '颜色位置追踪',
                    value: '8'
                },
                {
                    text: '二维码识别',
                    value: '3'
                },
                {
                    text: '人脸检测',
                    value: '4'
                },
                {
                    text: '物体识别',
                    value: '6'
                },

                {
                    text: 'AprilTags识别',
                    value: '7'
                },
                {
                    text: '路标识别',
                    value: '9'
                },
                {
                    text: '猫脸识别',//仅限下载模式
                    value: '10'
                },
            ]
        },
        MENU_COLOR:{
            acceptReporters: false,
            items: [
                {
                    text: '红',
                    value: 'red'
                },
                {
                    text: '黄',
                    value: 'yellow'
                },
                {
                    text: '绿',
                    value: 'green'
                },
                {
                    text: '蓝',
                    value: 'blue'
                },
                {
                    text: '黑',
                    value: 'black'
                },
                {
                    text: '白',
                    value: 'white'
                },
            ]
        },
        CAMERA_PLACE:{
            acceptReporters: false,
            items: [
                {
                    text: '舞台显示',
                    value: '0'
                },
                {
                    text: '弹窗显示',
                    value: '1'
                },
               
            ]
        },

        MENU_PLACE:{
            acceptReporters: false,
            items: [
                {
                    text: 'x',
                    value: 'x'
                },
                {
                    text: 'y',
                    value: 'y'
                },
               
            ]
        },

        MENU_ANAGLE:{
            acceptReporters: false,
            items: [
                {
                    text: '左上',
                    value: '0'
                },
                {
                    text: '右上',
                    value: '1'
                },
                {
                    text: '右下',
                    value: '2'
                },
                {
                    text: '左下',
                    value: '3'
                },
                {
                    text: '中心',
                    value: '4'
                },
               
            ]
        },

        MENU_WH:{
            acceptReporters: false,
            items: [
                {
                    text: '宽度',
                    value: '0'
                },
                {
                    text: '高度',
                    value: '1'
                },
               
            ]
        },

        MENU_CAMERA_PIXEL:{
            acceptReporters: false,
            items: [
                {
                    text: '640x480像素',
                    value: '0'
                },
                {
                    text: '800x600像素',
                    value: '1'
                },
                {
                    text: '1024x768像素',
                    value: '2'
                },
               
            ]
        },
        MENU_MIRROR:{
            acceptReporters: false,
            items: [
                {
                    text: '开启',
                    value: '0'
                },
                {
                    text: '镜像开启',
                    value: '1'
                },
                {
                    text: '关闭',
                    value: '2'
                },
               
            ]
        },
      }
    };
  }


//   async cstartCamera(args){

//     await new Promise(resolve => setTimeout(resolve, 500));  // 等待1秒
//     const provider =new Provider()

//     if(this.mode){

//         if(args.ONE=='1'){
//             this.runtime.ioDevices.video.setProvider(provider)
//             this.runtime.ioDevices.video.enableVideo()
//         }else{
//             let jsonData={
//                 "command":"camera",
//                 "params":{
//                     "status":1
//                 }
//             }
//             // let str = `robot.start_camera()\r`;
//             let str=JSON.stringify(jsonData)
//             if(socket.checkWebSocketStatus()==4 || socket.checkWebSocketStatus()==0){
//                 console.log('断开连接，尝试重连')
//                 let context=[]
//                 context.push(str)
//                 await socket.setSocket(context)
//             }else if(socket.checkWebSocketStatus()==2){
//                 socket.getSocket().send(str);
//             }
//             await new Promise(resolve => setTimeout(resolve, 2000));  
//             this.runtime.ioDevices.video.setProvider(provider)
//             this.runtime.ioDevices.video.enableVideo()
//         }
//     }
        
    
//   }


//   async cstopCamera(args){

//     if(this.mode){
//         if(args.ONE=='1'){
//             this.runtime.ioDevices.video.disableVideo();
//         }else{

//             let jsonData={
//                 "command":"camera",
//                 "params":{
//                     "status":0
//                 }
//             }
//             // let str = `robot.close_camera()\r`;
//             let str = JSON.stringify(jsonData)
//             if(socket.checkWebSocketStatus()==4 || socket.checkWebSocketStatus()==0){
//                 console.log('断开连接，尝试重连')
//                 let context=[]
//                 context.push(str)
//                 await socket.setSocket(context)
//             }else if(socket.checkWebSocketStatus()==2){
//                 socket.getSocket().send(str);
//             }
//             await new Promise(resolve => setTimeout(resolve, 50));  
//             this.runtime.ioDevices.video.disableVideo();
//         }
//     } 
//   }

//    async waitForSuccess() {
//           return new Promise((resolve) => {
//               function messageHandler(event) {
//                   try {
//                       let data = event.data;
//                       if (data === "true") {
//                           console.log("收到 true 响应");
//                           socket.getSocket().removeEventListener('message', messageHandler); // 解除监听
//                           resolve(data); // 继续执行
//                       }
//                   } catch (error) {
//                       console.error("解析 WebSocket 消息出错", error);
//                   }
//               }
  
//               socket.getSocket().addEventListener('message', messageHandler);
//           });
//       }


    async waitForSuccess(timeoutMs = 3000) {
        return new Promise((resolve) => {
            const socketInstance = socket.getSocket();
            let resolved = false;

            function messageHandler(event) {
                try {
                    let data = event.data;
                    if (data === "true") {
                        console.log("收到 true 响应");
                        if (!resolved) {
                            resolved = true;
                            THIS.isCamera=true
                            clearTimeout(timeoutId);
                            socketInstance.removeEventListener('message', messageHandler);
                            resolve(true);
                        }
                    }
                } catch (error) {
                    console.error("解析 WebSocket 消息出错", error);
                }
            }

            socketInstance.addEventListener('message', messageHandler);

            // 设置超时
            const timeoutId = setTimeout(() => {
                if (!resolved) {
                    console.warn("waitForSuccess 超时，未收到 true");
                    resolved = true;
                    socketInstance.removeEventListener('message', messageHandler);
                    resolve(false);
                }
            }, timeoutMs);
        });
    }


      async waitForTwoSuccesses(timeoutMs = 3000) {
        return new Promise((resolve) => {
            let successCount = 0;
            let resolved = false;
    
            const socketInstance = socket.getSocket();
    
            function messageHandler(event) {
                try {
                    const data = event.data;
                    console.log("收到 WebSocket 消息：", data);
    
                    if (data === "success") {
                        successCount++;
                        if (successCount >= 2) {
                            if (!resolved) {
                                resolved = true;
                                socketInstance.removeEventListener('message', messageHandler);
                                clearTimeout(timeoutId);
                                resolve(true);
                            }
                        }
                    } else {
                        // 非 success，重置
                        successCount = 0;
                    }
                } catch (error) {
                    console.error("解析 WebSocket 消息出错", error);
                }
            }
    
            socketInstance.addEventListener('message', messageHandler);
    
            // 超时处理
            const timeoutId = setTimeout(() => {
                if (!resolved) {
                    resolved = true;
                    console.warn("等待两次 success 超时，退出");
                    socketInstance.removeEventListener('message', messageHandler);
                    resolve(false);
                }
            }, timeoutMs);
        });
    }


      async checkCameraOpenedViaFetch(cameraUrl) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000); // 最多等 2 秒
    
            const response = await fetch(cameraUrl, {
                method: 'GET',
                signal: controller.signal,
            });
    
            clearTimeout(timeoutId);
    
            if (response.ok) {
                console.log("摄像头已开启，视频流可访问");
                return true;
            } else {
                console.warn("摄像头响应失败，状态码：", response.status);
                return false;
            }
        } catch (e) {
            console.warn("摄像头 fetch 请求失败：", e.message);
            return false;
        }
    }



    howStartCamera(args){
        this.cameraPlace=args.ONE
    }

    async cstartCamera(args){
        if(this.mode){
            if(args.ONE!='2'){
                if(!imageLoad.getIsImage() && !isCompoterCamer && !imageLoad.getIsK210()){
                    this.channelLoad.postMessage(true)
                    console.log('开启摄像头')
                    
                    const provider =new Provider()
                    if(this.mode){
                        let jsonData={
                            "command":"camera",
                            "params":{
                                "mode":1
                            }
                        }
                        // let str = `robot.start_camera()\r`;
                        let str=JSON.stringify(jsonData)
                        if(socket.checkWebSocketStatus()==4 || socket.checkWebSocketStatus()==0){
                            console.log('断开连接，尝试重连')
                            this.showToast("⚠️ socket断开，尝试重连......");
                            let context=[]
                            context.push(str)
                            await socket.setSocket(context)
                        }else if(socket.checkWebSocketStatus()==2){
                            await socket.getSocket().send(str);

                            // -----------返回值方法-------------
                            const result = await this.waitForSuccess(3000);
                            
                            if (!result) {
                                console.warn("第一次响应不是 true...");
                                let close={
                                    "command":"camera",
                                    "params":{
                                        "mode":0
                                    }
                                }
                                // let str = `robot.close_camera()\r`;
                                let strClose = JSON.stringify(close)
                                await socket.getSocket().send(strClose);
                                await new Promise(resolve => setTimeout(resolve, 1000)); 
                                await socket.getSocket().send(str);
                                
                                // 第二次等待响应，但不判断
                                await this.waitForSuccess(3000);
                            }


                            //-----------------fetch方法--------------

                            // await new Promise(resolve => setTimeout(resolve, 1500)); // 等摄像头启动

                            // const isOpen = await this.checkCameraOpenedViaFetch(`http://${socket.getIp()}:8081/video_feed`); // 替换为实际地址
                        
                            // if (!isOpen) {
                            //     console.warn("第一次打开失败，尝试重发启动命令...");

                            //     let close={
                            //         "command":"camera",
                            //         "params":{
                            //             "mode":0
                            //         }
                            //     }
                            //     // let str = `robot.close_camera()\r`;
                            //     let strClose = JSON.stringify(close)
                            //     await socket.getSocket().send(strClose);
                            //     await new Promise(resolve => setTimeout(resolve, 1000)); 
                            //     await socket.getSocket().send(str);
                            //     await new Promise(resolve => setTimeout(resolve, 1500)); // 再等
                            // }
                        }else if(socket.checkWebSocketStatus()==1){
                            this.showToast("⚠️ socket正在连接中，请稍后");
                        }
                        if(this.cameraPlace == '0'){
                            await new Promise(resolve => setTimeout(resolve, 1500));  
                            this.runtime.ioDevices.video.setProvider(provider)
                            if(args.ONE=='0'){
                                this.runtime.ioDevices.video.mirror=false
                            }else{
                                this.runtime.ioDevices.video.mirror=true
                            }
                            this.runtime.ioDevices.video.enableVideo()
                        }else{
                            if(args.ONE=='0'){
                                cam.setMirror(false);       // 设置镜像
                            }else{
                                cam.setMirror(true);       // 设置镜像
                            }
                            
                            cam.setRemoteUrl(`http://${socket.getIp()}:8081/video_feed?${Date.now()}`);
                            cam.open();
                            
                            await new Promise(resolve => setTimeout(resolve, 1000)); 
                        }
        
                    }
                    await new Promise(resolve => setTimeout(resolve, 3000)); 
                }else if(imageLoad.getIsImage()){
                    if(this.cameraPlace == '0'){
                        if(args.ONE=='0'){
                            this.runtime.ioDevices.video.mirror=false
                        }else{
                            this.runtime.ioDevices.video.mirror=true
                        }
                        
                        this.runtime.ioDevices.video.disableVideo();
                        const provider =new Provider()

                        await new Promise(resolve => setTimeout(resolve, 500));  
                        this.runtime.ioDevices.video.setProvider(provider)
                        this.runtime.ioDevices.video.enableVideo()
                    }else{
                        if(args.ONE=='0'){
                            cam.setMirror(false);       // 设置镜像
                        }else{
                            cam.setMirror(true);       // 设置镜像
                        }
                        
                        cam.close()
                        cam.setRemoteUrl(`http://${socket.getIp()}:8081/video_feed?${Date.now()}`);
                        cam.open();
                        
                        await new Promise(resolve => setTimeout(resolve, 1000)); 
                    }
                    
                }
                socket.setLastPostTime(Date.now())
            }else{
                console.log('关闭摄像头')
                
                await this.cstopMode({ONE:'3'})
                await this.cstopMode({ONE:'4'})
                await this.cstopMode({ONE:'6'})
                await this.cstopMode({ONE:'2'})
                await this.cstopMode({ONE:'1'})
                await this.cstopMode({ONE:'5'})
                await this.cstopMode({ONE:'7'})
                await this.cstopMode({ONE:'8'})
                const provider =new Provider()
                if(this.mode){
                    let jsonData={
                        "command":"camera",
                        "params":{
                            "mode":0
                        }
                    }
                    // let str = `robot.close_camera()\r`;
                    let str = JSON.stringify(jsonData)
                    if(socket.checkWebSocketStatus()==4 || socket.checkWebSocketStatus()==0){
                        console.log('断开连接，尝试重连')
                        this.showToast("⚠️ socket断开，尝试重连......");
                        let context=[]
                        context.push(str)
                        await socket.setSocket(context)
                    }else if(socket.checkWebSocketStatus()==2){
                        socket.getSocket().send(str);
                    }else if(socket.checkWebSocketStatus()==1){
                        this.showToast("⚠️ socket正在连接中，请稍后");
                    }

                    if(this.cameraPlace == '0'){
                        await new Promise(resolve => setTimeout(resolve, 50));  
                        this.runtime.ioDevices.video.disableVideo();

                        imageLoad.setIsImage(false)
                        this.isCamera=false
                    }else{
                        await new Promise(resolve => setTimeout(resolve, 50));  
                        cam.close()
                        imageLoad.setIsImage(false)
                        this.isCamera=false
                    }
                    
                }
                socket.setLastPostTime(Date.now())
            }
        }
        
        
        
    }
    async cstopCamera(){
        // if(imageLoad.getIsImage()){
            console.log('关闭摄像头')
            
            await this.cstopMode({ONE:'3'})
            await this.cstopMode({ONE:'4'})
            await this.cstopMode({ONE:'6'})
            await this.cstopMode({ONE:'2'})
            await this.cstopMode({ONE:'1'})
            await this.cstopMode({ONE:'5'})
            await this.cstopMode({ONE:'7'})
            await this.cstopMode({ONE:'8'})
            const provider =new Provider()
            if(this.mode){
                let jsonData={
                    "command":"camera",
                    "params":{
                        "mode":0,
                        "num":0
                    }
                }
                // let str = `robot.close_camera()\r`;
                let str = JSON.stringify(jsonData)
                if(socket.checkWebSocketStatus()==4 || socket.checkWebSocketStatus()==0){
                    console.log('断开连接，尝试重连')
                    let context=[]
                    context.push(str)
                    await socket.setSocket(context)
                }else if(socket.checkWebSocketStatus()==2){
                    socket.getSocket().send(str);
                }
                await new Promise(resolve => setTimeout(resolve, 50));  
                this.runtime.ioDevices.video.disableVideo();

                imageLoad.setIsImage(false)
            }
        // }
        socket.setLastPostTime(Date.now())
    }

    async csetCamera(args){
        if(imageLoad.getIsImage()){
            
            if(this.mode){
                let jsonData={
                    "command":"camera",
                    "params":{
                        "mode":2,
                        "num":Number(args.ONE)
                    }
                }
                // let str = `robot.start_camera()\r`;
                let str=JSON.stringify(jsonData)
                if(socket.checkWebSocketStatus()==4 || socket.checkWebSocketStatus()==0){
                    console.log('断开连接，尝试重连')
                    let context=[]
                    context.push(str)
                    await socket.setSocket(context)
                }else if(socket.checkWebSocketStatus()==2){
                    socket.getSocket().send(str);
                }

                this.waitForSuccess()
                await new Promise(resolve => setTimeout(resolve, 1000));
                this.runtime.ioDevices.video.disableVideo();
                await new Promise(resolve => setTimeout(resolve, 100));
                this.runtime.ioDevices.video.enableVideo()


            }
        }
        socket.setLastPostTime(Date.now())
    }

    async getVideoDeviceList () {
        const devices = await navigator.mediaDevices.enumerateDevices();
        return devices.filter(d => d.kind === 'videoinput');
    }

    async initCamera() {
        this.deviceList = await this.getVideoDeviceList();
        console.log("初始摄像头列表:", this.deviceList);
    }


    getCamera(){
        let item=[{
            text:'请选择',
            value:'请选择'
        }];

        console.log(this.deviceList)
        if(this.deviceList.length>0){
            for(let i=0;i<this.deviceList.length;i++){
                let content={
                    text:this.deviceList[i].label,
                    value:`${this.deviceList[i].deviceId}`
                }
                item.push(content)
            }
        }
       

        console.log(item)
        
        return item

    }
    async cstartComputerCamera(args){

        if(args.ONE!='2'){
             
            if(imageLoad.getIsImage() || imageLoad.getIsK210()){
                return 
            }

            if(isCompoterCamer){
                await this.cstopMode({ONE:'3'})
                await this.cstopMode({ONE:'4'})
                await this.cstopMode({ONE:'6'})
                await this.cstopMode({ONE:'2'})
                await this.cstopMode({ONE:'1'})
                await this.cstopMode({ONE:'5'})
                await this.cstopMode({ONE:'7'})
                await this.cstopMode({ONE:'8'})
                this.runtime.ioDevices.video.disableVideo();
                cam.close()
                isCompoterCamer=false
                console.log('关闭了')
                await new Promise(resolve => setTimeout(resolve, 1000)); 
            }
    
            // const provider =new VideoProvider()


            if(args.TWO!='请选择'){
                if(this.cameraPlace=='0'){
                    console.log(args.TWO)
                    this.videoProvider.enableVideoWithDevice(args.TWO)

                    this.runtime.ioDevices.video.setProvider(this.videoProvider)
                    if(args.ONE=='0'){
                        this.runtime.ioDevices.video.mirror=false
                    }else{
                        this.runtime.ioDevices.video.mirror=true
                    }
                    
                    this.runtime.ioDevices.video.enableVideo()
                    isCompoterCamer=true  
                    await new Promise(resolve => setTimeout(resolve, 1000)); 
                }else{

                    if(args.ONE=='0'){
                        cam.setMirror(false);       // 设置镜像
                    }else{
                        cam.setMirror(true);       // 设置镜像
                    }
                    
                    cam.useLocalCamera();
                    cam.open();
                    isCompoterCamer=true  
                    await new Promise(resolve => setTimeout(resolve, 1000)); 
                    
                }
                
            }

            

            
        }else{
            if(isCompoterCamer){
                await this.cstopMode({ONE:'3'})
                await this.cstopMode({ONE:'4'})
                await this.cstopMode({ONE:'6'})
                await this.cstopMode({ONE:'2'})
                await this.cstopMode({ONE:'1'})
                await this.cstopMode({ONE:'5'})
                await this.cstopMode({ONE:'7'})
                await this.cstopMode({ONE:'8'})
                this.runtime.ioDevices.video.disableVideo();
                cam.close()
                isCompoterCamer=false
            }
        }
        
    }

    async cstopComputerCamera(){
        if(isCompoterCamer){
            await this.cstopMode({ONE:'3'})
            await this.cstopMode({ONE:'4'})
            await this.cstopMode({ONE:'6'})
            await this.cstopMode({ONE:'2'})
            await this.cstopMode({ONE:'1'})
            await this.cstopMode({ONE:'5'})
            await this.cstopMode({ONE:'7'})
            await this.cstopMode({ONE:'8'})
            this.runtime.ioDevices.video.disableVideo();
            isCompoterCamer=false
        }
        
    }


    waitForValue(getterFn, expectedValue, interval = 100) {
        return new Promise((resolve) => {
            const timer = setInterval(() => {
            if (getterFn() === expectedValue) {
                clearInterval(timer);
                resolve();
            }
            }, interval);
        });
    }
    async cstartNetCamera(args){
        if(args.ONE!='2'){

            // else if(imageLoad.getIsImage()){
            //     if(args.ONE=='0'){
            //         this.runtime.ioDevices.video.mirror=false
            //     }else{
            //         this.runtime.ioDevices.video.mirror=true
            //     }
                
            //     this.runtime.ioDevices.video.disableVideo();
            //     const provider =new Provider()

            //     await new Promise(resolve => setTimeout(resolve, 500));  
            //     this.runtime.ioDevices.video.setProvider(provider)
            //     this.runtime.ioDevices.video.enableVideo()
            // }
                if(imageLoad.getIsImage() || isCompoterCamer){
                    return 
                }
                if(imageLoad.getIsK210()) {
                    if(this.cameraPlace == '0'){
                        if(args.ONE=='0' && this.runtime.ioDevices.video.mirror){
                            this.runtime.ioDevices.video.mirror=false
                            this.runtime.ioDevices.video.disableVideo();
                        }else if(args.ONE=='1' && !this.runtime.ioDevices.video.mirror){
                            this.runtime.ioDevices.video.mirror=true
                            this.runtime.ioDevices.video.disableVideo();
                        }else{
                            return      
                        }
                    }else{
                        if(args.ONE=='0' && cam.getMirror()){
                            cam.setMirror(false)
                            cam.close()
                        }else if(args.ONE=='1' && !getMirror()){
                            cam.setMirror(true)
                            cam.close()
                        }else{
                            return      
                        }
                    }
                    
                    
                }
                console.log('开启摄像头')
                this.channelLoad.postMessage(true)
                
                const providerk210 =new Providerk210(args.TWO)
                if(this.mode){
                    await new Promise(resolve => setTimeout(resolve, 1000));  
                    if(this.cameraPlace == '0'){
                        this.runtime.ioDevices.video.setProvider(providerk210)
                        if(args.ONE=='0'){
                            this.runtime.ioDevices.video.mirror=false
                        }else{
                            this.runtime.ioDevices.video.mirror=true
                        }
                        this.runtime.ioDevices.video.enableVideo()
                    }else{
                        if(args.ONE=='0'){
                            cam.setMirror(false);       // 设置镜像
                        }else{
                            cam.setMirror(true);       // 设置镜像
                        }
                        
                        // cam.close()
                        cam.setRemoteUrl(`http://${args.TWO}:81/stream?ts=${Date.now()}`);
                        cam.open();
                        
                        // await new Promise(resolve => setTimeout(resolve, 1000)); 
                    }
                  
                    // imageLoad.setIsK210(true)
    
                }

                await this.waitForValue(() => this.loadingEnd, 'done');
                this.loadingEnd='loading'
                // await new Promise(resolve => setTimeout(resolve, 2500)); 

        }else{
            console.log('关闭摄像头')
            imageLoad.setIsK210IsLoadFiled()
            await this.cstopMode({ONE:'3'})
            await this.cstopMode({ONE:'4'})
            await this.cstopMode({ONE:'6'})
            await this.cstopMode({ONE:'2'})
            await this.cstopMode({ONE:'1'})
            await this.cstopMode({ONE:'5'})
            await this.cstopMode({ONE:'7'})
            await this.cstopMode({ONE:'8'})
            const provider =new Provider()
            if(this.mode){
                await new Promise(resolve => setTimeout(resolve, 50));  
                if(this.cameraPlace == '0'){
                    this.runtime.ioDevices.video.disableVideo();
                }else{
                    cam.close()
                }
                

                // imageLoad.setIsImage(false)
                imageLoad.setIsK210(false)
            }
        }
    }
    async cstartmicph(){
        if(!imageLoad.getMicph()){
            
            if(this.mode){
                let jsonData={
                    "command":"micphone",
                    "params":{
                        "status":1
                    }
                }
                // let str = `robot.start_camera()\r`;
                let str=JSON.stringify(jsonData)
                if(socket.checkWebSocketStatus()==4 || socket.checkWebSocketStatus()==0){
                    console.log('断开连接，尝试重连')
                    let context=[]
                    context.push(str)
                    await socket.setSocket(context)
                }else if(socket.checkWebSocketStatus()==2){
                    socket.getSocket().send(str);
                }
                // await new Promise(resolve => setTimeout(resolve, 500));  

            }

            imageLoad.setMicph(true)
        }
        socket.setLastPostTime(Date.now())
    }

    async cstopmicph(){
        if(imageLoad.getMicph()){
            if(this.mode){
                let jsonData={
                    "command":"micphone",
                    "params":{
                        "status":0
                    }
                }
                // let str = `robot.close_camera()\r`;
                let str = JSON.stringify(jsonData)
                if(socket.checkWebSocketStatus()==4 || socket.checkWebSocketStatus()==0){
                    console.log('断开连接，尝试重连')
                    let context=[]
                    context.push(str)
                    await socket.setSocket(context)
                }else if(socket.checkWebSocketStatus()==2){
                    socket.getSocket().send(str);
                }

                imageLoad.setMicph(false)
            }
        }
        socket.setLastPostTime(Date.now())
    }

    showToast(message, duration = 3000) {
        // 如果 toast 容器不存在，则创建一个
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            Object.assign(container.style, {
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            });
            document.body.appendChild(container);
        }
    
        // 创建 toast 元素
        const toast = document.createElement('div');
        toast.textContent = message;
    
        // 样式设置
        Object.assign(toast.style, {
            background: '#333',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            opacity: '0',
            transform: 'translateY(-20px)',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
            maxWidth: '300px'
        });
    
        // 添加 toast 到容器
        container.appendChild(toast);
    
        // 强制触发重绘以启用动画
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        });
    
        // 3秒后移除
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                toast.remove();
                // 若容器内无子元素则移除容器
                if (container.children.length === 0) {
                    container.remove();
                }
            }, 300); // 等动画结束
        }, duration);
    }

    async cstartMode(args){
       if(this.mode){
         console.log(Date.now())
        if(Date.now()-this.modeEnterTime<5) return
        this.modeEnterTime=Date.now()
        if(!imageLoad.getIsImage() && !isCompoterCamer && !imageLoad.getIsK210()){
            // alert('请先开启摄像头')
            this.showToast("⚠️ 请先开启摄像头");
            // console.log(this.runtime)
            this.runtime.stopAll();
            // this.props.vm.stopAll();
            // this.stopAll.postMessage(true)
            return
        }
        if(this.cameraPlace=='0'){
            await this.cstopMode({ONE:'3'})
            await this.cstopMode({ONE:'4'})
            await this.cstopMode({ONE:'6'})
            await this.cstopMode({ONE:'2'})
            await this.cstopMode({ONE:'1'})
            await this.cstopMode({ONE:'5'})
            await this.cstopMode({ONE:'7'})
            await this.cstopMode({ONE:'8'})
        }else{
            cam.stopQRDetection()
        }
       
        
        if(args.ONE=='3'){
            // await this.cstopMode({ONE:'4'})
            // await this.cstopMode({ONE:'6'})
            // await this.cstopMode({ONE:'2'})
            // await this.cstopMode({ONE:'1'})
            // await this.cstopMode({ONE:'5'})
            if(!imageLoad.getQr()){
                if(this.cameraPlace=='0'){
                    this.runtime.ioDevices.video.startQRDetection()
                }else{
                    cam.setQRDetectedCallback((result) => {
                        if (result) {
                            console.log('识别到二维码:', result.data);
                            console.log('二维码位置:', result.location);
                        } else {
                            console.log('未识别到二维码');
                        }
                    });
                    cam.startQRDetection();
                }
                
                
                imageLoad.setQr(true)
            }
            
        }else if(args.ONE=='4'){

            // await this.cstopMode({ONE:'3'})
            // await this.cstopMode({ONE:'6'})
            // await this.cstopMode({ONE:'2'})
            // await this.cstopMode({ONE:'1'})
            // await this.cstopMode({ONE:'5'})

            if(!imageLoad.getFaceDet()){
                await new Promise(resolve => setTimeout(resolve, 1000)); 
                this.runtime.ioDevices.video.startFaceDetection()
                imageLoad.setFaceDet(true)
            }
            
        }else if(args.ONE=='6'){
            // await this.cstopMode({ONE:'4'})
            // await this.cstopMode({ONE:'3'})
            // await this.cstopMode({ONE:'2'})
            // await this.cstopMode({ONE:'1'})
            // await this.cstopMode({ONE:'5'})

            if(!imageLoad.getItem()){
                
                await new Promise(resolve => setTimeout(resolve, 1000));
                await this.runtime.ioDevices.video.startWItem()
                // await new Promise(resolve => setTimeout(resolve, 4000)); 
                imageLoad.setItem(true)
            }
            
        }else if(args.ONE=='2'){
            // await this.cstopMode({ONE:'4'})
            // await this.cstopMode({ONE:'6'})
            // await this.cstopMode({ONE:'3'})
            // await this.cstopMode({ONE:'1'})
            // await this.cstopMode({ONE:'5'})
            if(!imageLoad.getColorDete()){

                await new Promise(resolve => setTimeout(resolve, 1000)); 
                this.runtime.ioDevices.video.startWColorBlockDetection()
                imageLoad.setColorDete(true)
            }
        }else if(args.ONE=='1'){
            // await this.cstopMode({ONE:'4'})
            // await this.cstopMode({ONE:'6'})
            // await this.cstopMode({ONE:'2'})
            // await this.cstopMode({ONE:'3'})
            // await this.cstopMode({ONE:'5'})
            if(!imageLoad.getColorReco()){
                await new Promise(resolve => setTimeout(resolve, 1000)); 
                this.runtime.ioDevices.video.startColorDetection()
                imageLoad.setColorReco(true)
            }
        }else if(args.ONE=='5'){
            // await this.cstopMode({ONE:'4'})
            // await this.cstopMode({ONE:'6'})
            // await this.cstopMode({ONE:'2'})
            // await this.cstopMode({ONE:'1'})
            // await this.cstopMode({ONE:'3'})
            if(!imageLoad.getFaceReco()){
                await new Promise(resolve => setTimeout(resolve, 100)); 
                this.runtime.ioDevices.video.startWDetection()
                
                imageLoad.setFaceReco(true)
            }
        }else if(args.ONE=='7'){
            if(!imageLoad.getAprilTag()){
                await new Promise(resolve => setTimeout(resolve, 1000)); 
                this.runtime.ioDevices.video.aprilTag()
                imageLoad.setAprilTag(true)
            }
            
        }else if(args.ONE=='8'){
            if(!imageLoad.getColorPlace()){
                await new Promise(resolve => setTimeout(resolve, 1000)); 
                this.runtime.ioDevices.video.startColorPlaceDetection()
                imageLoad.setColorPlace(true)
            }
            
        }else if(args.ONE=='9'){
            if(!imageLoad.getIsTraffic()){
                await new Promise(resolve => setTimeout(resolve, 1000)); 
                this.runtime.ioDevices.video.startTrafficpre()
                imageLoad.setIsTraffic(true)
            }
            
        }
       }

    }

    
    async cstopMode(args){
        if(this.mode){
            if(args.ONE=='3'){
            if(imageLoad.getQr()){
                await this.runtime.ioDevices.video.stopQRDetection()
                imageLoad.setQr(false)
            }
            
        }else if(args.ONE=='4'){

            if(imageLoad.getFaceDet()){
                await this.runtime.ioDevices.video.stopFaceDetection()
                imageLoad.setFaceDet(false)
            }
            
        }else if(args.ONE=='6'){

            if(imageLoad.getItem()){
                await this.runtime.ioDevices.video.stopWItem()
                imageLoad.setItem(false)
            }
            
        }else if(args.ONE=='2'){
            if(imageLoad.getColorDete()){
                aiInfo.setWhatColor('blue')
                await this.runtime.ioDevices.video.stopWColorBlockDetection()
                imageLoad.setColorDete(false)
            }
        }else if(args.ONE=='1'){
            if(imageLoad.getColorReco()){
                await this.runtime.ioDevices.video.stopColorDetection()
                imageLoad.setColorReco(false)
            }
        }else if(args.ONE=='5'){
            if(imageLoad.getFaceReco()){
                await this.runtime.ioDevices.video.stopWDetection()
                imageLoad.setFaceReco(false)
            }
        }else if(args.ONE=='7'){
            if(imageLoad.getAprilTag()){
                this.runtime.ioDevices.video.stopAprilTag()
                imageLoad.setAprilTag(false)
            }
        }else if(args.ONE=='8'){
            if(imageLoad.getColorPlace()){
                await this.runtime.ioDevices.video.stopColorPlaceDetection()
                imageLoad.setColorPlace(false)
            }
            
        }else if(args.ONE=='9'){

            if(imageLoad.getIsTraffic()){
                await this.runtime.ioDevices.video.stopTraffic()
                imageLoad.setIsTraffic(false)
            }
        }
        }
    }

    hexToRgb(hex) {
        // 去掉 # 号
        hex = hex.replace(/^#/, '');
    
        // 处理简写形式（如 #fff 转换为 #ffffff）
        if (hex.length === 3) {
            hex = hex.split('').map(char => char + char).join('');
        }
    
        // 解析 R、G、B
        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);
    
        return { r, g, b };
    }

    async readColor(args){

        // let hexColor=this.runtime.ioDevices.video.getColorAt(Number(args.ONE),Number(args.TWO))
        // let rgb=this.hexToRgb(hexColor)
        // console.log(rgb)
        // return rgb[args.THREE]

       if(this.mode){
         if(!imageLoad.getColorReco()){
            this.showToast("⚠️ 未开启颜色识别模式");
            this.runtime.stopAll();
            return 
        }

        if(args.THREE=='r'){
            return aiInfo.getColorRgb()[0]
        }else if(args.THREE=='g'){
            return aiInfo.getColorRgb()[1]
        }else if(args.THREE=='b'){
            return aiInfo.getColorRgb()[2]
        }
       }

    }
    async isQr(){

       if(this.mode){
         if(!imageLoad.getQr()){
            this.showToast("⚠️ 未开启二维码识别模式");
            this.runtime.stopAll();
            return 
        }
        if(aiInfo.getQr()){
            return true
        }else{
            return false
        }
       }
    }

    async getQrContent(){

        if(this.mode){
            if(!imageLoad.getQr()){
            this.showToast("⚠️ 未开启二维码识别模式");
            this.runtime.stopAll();
            return 
        }
        return aiInfo.getQr()
        }
    }

    async getQrPlace(args){
       if(this.mode){
         if(!imageLoad.getQr()){
            this.showToast("⚠️ 未开启二维码识别模式");
            this.runtime.stopAll();
            return 
        }
        if(aiInfo.getQrLocation()){
            if(args.ONE=='x'){
                return aiInfo.getQrLocation()[4].x-255
            }else{
                return (-1)*(aiInfo.getQrLocation()[4].y-223)
            }
        }else{
            return null
        }
       }
    }

    async getQrWh(args){
       if(this.mode){
         if(!imageLoad.getQr()){
            this.showToast("⚠️ 未开启二维码识别模式");
            this.runtime.stopAll();
            return 
        }
        return aiInfo.getQrWh()[Number(args.ONE)]
       }
    }


    async isFace(){
       if(this.mode){
         if(!imageLoad.getFaceDet()){
            this.showToast("⚠️ 未开启人脸识别模式");
            this.runtime.stopAll();
            return 
        }
        if(Number(aiInfo.getFaceNum())>0){
            return true
        }
        return false
       }

    }

    async faceNum(){

       if(this.mode){
         if(!imageLoad.getFaceDet()){
            this.showToast("⚠️ 未开启人脸识别模式");
            this.runtime.stopAll();
            return 
        }
        console.log(typeof aiInfo.getFaceNum())
        return aiInfo.getFaceNum()
       }
    }

    async facePlace(args){
        if(this.mode){
            if(!imageLoad.getFaceDet()){
            this.showToast("⚠️ 未开启人脸识别模式");
            this.runtime.stopAll();
            return 
        }
        if(aiInfo.getFaceLocation()){
            if(args.ONE=='x'){
                return aiInfo.getFaceLocation().x
            }else{
                return (-1)*aiInfo.getFaceLocation().y
            }
        }
        }
    }

    getFaceWh(args){
       if(this.mode){
         if(!imageLoad.getFaceDet()){
            this.showToast("⚠️ 未开启人脸识别模式");
            this.runtime.stopAll();
            return 
        }
        return aiInfo.getFaceWh()[Number(args.ONE)]
       }
    }

    async isGood(args){
       if(this.mode){
         if(!imageLoad.getItem()){
            this.showToast("⚠️ 未开启物体识别模式");
            this.runtime.stopAll();
            return 
        }
        if(args.ONE==aiInfo.getObject()){
            return true
        }
        return false
       }
    }

    async goodPlace(args){

       if(this.mode){
         if(!imageLoad.getItem()){
            this.showToast("⚠️ 未开启物体识别模式");
            this.runtime.stopAll();
            return 
        }
        if(aiInfo.getObjectLocation()){
            if(args.ONE=='x'){
                return aiInfo.getObjectLocation().x
            }else{
                return (-1)*aiInfo.getObjectLocation().y
            }
        }
       }
    }

    getGoodWh(args){
       if(this.mode){
         if(!imageLoad.getItem()){
            this.showToast("⚠️ 未开启物体识别模式");
            this.runtime.stopAll();
            return 
        }
        return aiInfo.getObjectWh()[Number(args.ONE)]
       }
    }

    async setColor(args){
        if(this.mode){
            if(!imageLoad.getColorDete() && !imageLoad.getColorPlace()){
            this.showToast("⚠️ 未开启颜色追踪模式");
            this.runtime.stopAll();
            return 
        }
        aiInfo.setWhatColor(args.ONE)
        }
    }

    async isReadColor(){
        if(this.mode){
            if(!imageLoad.getColorDete() && !imageLoad.getColorPlace()){
            this.showToast("⚠️ 未开启颜色追踪模式");
            this.runtime.stopAll();
            return 
        }
        if(Number(aiInfo.getHaveColor())>0){
            return true
        }else{
            return false
        }
        }
    }

    async readColorPlace(args){
      if(this.mode){
          if(!imageLoad.getColorDete()){
            this.showToast("⚠️ 未开启颜色追踪模式");
            this.runtime.stopAll();
            return 
        }
        if(aiInfo.getColorLocation()){
            if(args.ONE=='x'){
                return aiInfo.getColorLocation().x
            }else{
                return (-1)*aiInfo.getColorLocation().y
            }
        }
      }
    }

    getColorWh(args){
        if(this.mode){
            if(!imageLoad.getColorDete()){
            this.showToast("⚠️ 未开启颜色追踪模式");
            this.runtime.stopAll();
            return 
        }
        return aiInfo.getColorWh()[Number(args.ONE)]
        }
    }

    async symFace(args){
       if(this.mode){
         if(!imageLoad.getFaceDet()){
            this.showToast("⚠️ 未开启人脸检测模式");
            this.runtime.stopAll();
            return 
        }
        aiInfo.setFaceName(args.ONE)
        await new Promise(resolve => setTimeout(resolve, 1000)); 
        this.runtime.ioDevices.video.learnNewFace(args.ONE)
       }
    }

    async isSymFace(){
       if(this.mode){
         if(!imageLoad.getFaceDet()){
            this.showToast("⚠️ 未开启人脸检测模式");
            this.runtime.stopAll();
            return 
        }
        return aiInfo.getIsSym()
       }
    }
    async faceName(){
        if(this.mode){
            if(!imageLoad.getFaceDet()){
            this.showToast("⚠️ 未开启人脸检测模式");
            this.runtime.stopAll();
            return 
        }
        return aiInfo.getResultFace()
        }
    }

    isApril(){
       if(this.mode){
         if(!imageLoad.getAprilTag()){
            this.showToast("⚠️ 未开启AprilTag识别模式");
            this.runtime.stopAll();
            return 
        }
        console.log(aiInfo.getAprilInfo())
        if(aiInfo.getAprilInfo()!=-1){
            return true
        }else{
            return false
        }
       }
    }

    getAprilContent(){
       if(this.mode){
         if(!imageLoad.getAprilTag()){
            this.showToast("⚠️ 未开启AprilTag识别模式");
            this.runtime.stopAll();
            return 
        }
        console.log(aiInfo.getAprilInfo())
        return aiInfo.getAprilInfo()
       }
    }

    getAprilPlace(args){
        if(this.mode){
            if(!imageLoad.getAprilTag()){
            this.showToast("⚠️ 未开启AprilTag识别模式");
            this.runtime.stopAll();
            return 
        }
        if(aiInfo.getAprilLocation()){
            if(args.ONE=='x'){
                return aiInfo.getAprilLocation().x
            }else{
                return aiInfo.getAprilLocation().y
            }
        }
        }
    }

    getAprilWh(args){
        if(this.mode){
            if(!imageLoad.getAprilTag()){
                this.showToast("⚠️ 未开启AprilTag识别模式");
                this.runtime.stopAll();
                return 
            }
            if(aiInfo.getAprilWh()){
                return aiInfo.getAprilWh()
            }
        }
    }


    whatPlaceColor(args){
       if(this.mode){
         if(!imageLoad.getColorPlace()){
            this.showToast("⚠️ 未开启颜色追踪模式");
            this.runtime.stopAll();
            return 
        }
        if(aiInfo.getRegion()==args.ONE){
            return true
        }else{
            return false
        }
       }
    }

    isOpenCamera(){
        if(this.mode){
            if(this.isCamera){
                return true
            }else{
                return false
            }
        }
    }

    getTraffic(){
        return aiInfo.getTraffic()
    }


//   cstartRoad(){
//     this.runtime.ioDevices.video.startTrafficpre()
//   }

//   cstopRoad(){
        
//   }

//   async ctwodimen(){
//     const provider =new Provider()
//     this.runtime.ioDevices.video.setProvider(provider)
//     this.runtime.ioDevices.video.enableVideo()
//     this.runtime.ioDevices.video.startQRDetection()
    
//   }
//   cstoptwodimen(){
//     this.runtime.ioDevices.video.disableVideo();
//     this.runtime.ioDevices.video.stopQRDetection()
//   }

//   cstartface(){
//     // const provider =new Provider()
//     // this.runtime.ioDevices.video.setProvider(provider)
//     this.runtime.ioDevices.video.enableVideo()
//     this.runtime.ioDevices.video.startFaceDetection()
//   }
//   cstopface(){
//     this.runtime.ioDevices.video.disableVideo();
//     this.runtime.ioDevices.video.stopFaceDetection()
//   }

//   cimgclassifer(){
//     const provider =new Provider()
//     this.runtime.ioDevices.video.setProvider(provider)
//     this.runtime.ioDevices.video.enableVideo()
//     this.runtime.ioDevices.video.startWItem()
//   }
//   cstopimgclassifer(){
//     this.runtime.ioDevices.video.disableVideo();
//     this.runtime.ioDevices.video.stopWItem()
//   }



//   cstarthand(){
//     const provider =new Provider()
//     this.runtime.ioDevices.video.setProvider(provider)
//     this.runtime.ioDevices.video.enableVideo()
//     this.runtime.ioDevices.video.startWGestureRecognition()
//   }

//   cstophand(){
//     this.runtime.ioDevices.video.disableVideo();
//     this.runtime.ioDevices.video.stopWGestureRecognition()
//   }
  

//   cstartcolordete(){
//     const provider =new Provider()
//     this.runtime.ioDevices.video.setProvider(provider)
//     this.runtime.ioDevices.video.enableVideo()
//     this.runtime.ioDevices.video.startWColorBlockDetection()
//   }

//   cstopcolordete(){
//     this.runtime.ioDevices.video.disableVideo();
//     this.runtime.ioDevices.video.stopWColorBlockDetection()
//   }

//   cstartmegph(){

//   }
//   cstopmegph(){

//   }
//   async cstartmicph(args){

//     if(this.mode){
//         if(args.ONE=='1'){

//         }else{

//             let jsonData={
//                 "command":"micphone",
//                 "params":{
//                     "status":1
//                 }
//             }
//             // let str = `robot.start_mike()\r`;
//             let str = JSON.stringify(jsonData)
//             if(socket.checkWebSocketStatus()==4 || socket.checkWebSocketStatus()==0){
//                 console.log('断开连接，尝试重连')
//                 let context=[]
//                 context.push(str)
//                 await socket.setSocket(context)
//             }else if(socket.checkWebSocketStatus()==2){
//                 socket.getSocket().send(str);
//             }
//         }
//     }

   
//   }
//   async cstopmicph(args){

//     if(this.mode){
//         if(args.ONE=='1'){

//         }else{

//             let jsonData={
//                 "command":"micphone",
//                 "params":{
//                     "status":0
//                 }
//             }
//             // let str = `robot.close_mike()\r`;
//             let str = JSON.stringify(jsonData)
//             if(socket.checkWebSocketStatus()==4 || socket.checkWebSocketStatus()==0){
//                 console.log('断开连接，尝试重连')
//                 let context=[]
//                 context.push(str)
//                 await socket.setSocket(context)
//             }else if(socket.checkWebSocketStatus()==2){
//                 socket.getSocket().send(str);
//             }
//         }
//     }
    
    
//   }

    async cstartmicph(){
        if(this.mode){
            let jsonData={
                "command":"micphone",
                "params":{
                    "status":1
                }
            }
            // let str = `robot.start_mike()\r`;
            let str = JSON.stringify(jsonData)
            if(socket.checkWebSocketStatus()==4 || socket.checkWebSocketStatus()==0){
                console.log('断开连接，尝试重连')
                let context=[]
                context.push(str)
                await socket.setSocket(context)
            }else if(socket.checkWebSocketStatus()==2){
                socket.getSocket().send(str);
            }
        }
    }
    async cstopmicph(){
        if(this.mode){
            let jsonData={
                "command":"micphone",
                "params":{
                    "status":0
                }
            }
            // let str = `robot.close_mike()\r`;
            let str = JSON.stringify(jsonData)
            if(socket.checkWebSocketStatus()==4 || socket.checkWebSocketStatus()==0){
                console.log('断开连接，尝试重连')
                let context=[]
                context.push(str)
                await socket.setSocket(context)
            }else if(socket.checkWebSocketStatus()==2){
                socket.getSocket().send(str);
            }
        }
    }


  keyPress(event){

        // const currentTime = Date.now(); // 获取当前时间戳

        // // 检查按键是否是快速按下
        // if (keyPressTimestamps[event.key] && (currentTime - keyPressTimestamps[event.key] < QUICK_PRESS_THRESHOLD)) {
        //     console.log(`${event.key} 被快速按下，忽略发送`);
        //     return; // 快速按下，忽略本次操作
        // }

        // console.log(currentTime - allKeyPress)
        // if (allKeyPress && (currentTime - allKeyPress < 300)) {
        //     console.log(`按键被快速按下，忽略发送`);
        //     allKeyPress=currentTime
        //     return; // 快速按下，忽略本次操作
        // }

        // allKeyPress=currentTime

        

        // 更新按键的上一次按下时间
        


        // for (let Key in keyPressTimestamps) {
        //     if (keyPressTimestamps.hasOwnProperty(Key)) {  // 确保是对象自身的属性，而不是继承的属性
        //     //   console.log(key, keyPressTimestamps[key]);
        //         if(Key!=key && currentTime - keyPressTimestamps[Key] <700){
        //             return
        //         }
        //     }
        //   }

        // keyPressTimestamps[event.key] = currentTime;


        switch (event.key) {
            case 'w':
            case 'W':
                keyState.W = true;
                THIS.sendMove('w',1)
                break
            case 'a':
            case 'A':
                keyState.A = true;
                THIS.sendMove('a',1)
                break;
            case 's':
            case 'S':
                keyState.S = true;
                THIS.sendMove('s',1)
                break;
            case 'd':
            case 'D':
                keyState.D = true;
                THIS.sendMove('d',1)
                break;
            case 'r':
            case 'R':
                keyState.R = true;
                THIS.sendMove('r',1)
                break;
            case 'b':
            case 'B':
                keyState.B = true;
                THIS.sendMove('b',1)
                break;
            case 'c':
            case 'C':
                keyState.C = true;
                THIS.sendMove('c',1)
                break;
            case 'e':
            case 'E':
                keyState.E = true;
                THIS.sendMove('e',1)
                break;
            case 'f':
            case 'F':
                keyState.F = true;
                THIS.sendMove('f',1)
                break;
            case 'g':
            case 'G':
                keyState.G = true;
                THIS.sendMove('g',1)
                break;
            case 'h':
            case 'H':
                keyState.H = true;
                THIS.sendMove('h',1)
                break;
            case 'i':
            case 'I':
                keyState.I = true;
                THIS.sendMove('i',1)
                break;
            case 'j':
            case 'J':
                keyState.J = true;
                THIS.sendMove('j',1)
                break;
            case 'k':
            case 'K':
                keyState.K = true;
                THIS.sendMove('k',1)
                break;
            case 'l':
            case 'L':
                keyState.L = true;
                THIS.sendMove('l',1)
                break;
            case 'm':
            case 'M':
                keyState.M = true;
                THIS.sendMove('m',1)
                break;
            case 'n':
            case 'N':
                keyState.N = true;
                THIS.sendMove('n',1)
                break;
            case 'o':
            case 'O':
                keyState.O = true;
                THIS.sendMove('o',1)
                break;
            case 'p':
            case 'P':
                keyState.P = true;
                THIS.sendMove('p',1)
                break;

            case 'q':
            case 'Q':
                keyState.Q = true;
                THIS.sendMove('q',1)
                break;
            case 't':
            case 'T':
                keyState.T = true;
                THIS.sendMove('t',1)
                break;
            case 'u':
            case 'U':
                keyState.U = true;
                THIS.sendMove('u',1)
                break;
            case 'v':
            case 'V':
                keyState.V = true;
                THIS.sendMove('v',1)
                break;
            case 'x':
            case 'X':
                keyState.X = true;
                THIS.sendMove('x',1)
                break;
            case 'y':
            case 'Y':
                keyState.Y = true;
                THIS.sendMove('y',1)
                break;
            case 'z':
            case 'Z':
                keyState.Z = true;
                THIS.sendMove('z',1)
                break;
            default:
                // 其他按键不处理
                break;
        }

    }
    keyUp(event){
        switch (event.key) {
            case 'w':
            case 'W':
                console.log('w松开')
                keyState.W = false;
                THIS.sendMove('w',0)
                break;
            case 'a':
            case 'A':
                console.log('A松开')
                keyState.A = false;
                THIS.sendMove('a',0)
                break;
            case 's':
            case 'S':
                console.log('S松开')
                keyState.S = false;
                THIS.sendMove('s',0)
                break;
            case 'd':
            case 'D':
                console.log('D松开')
                keyState.D = false;
                THIS.sendMove('d',0)
                break;
            case 'r':
            case 'R':
                console.log('R松开')
                keyState.R = false;
                THIS.sendMove('r',0)
                break;
            case 'b':
            case 'B':
                console.log('B松开')
                keyState.B = false;
                THIS.sendMove('b',0)
                break;
            case 'c':
            case 'C':
                console.log('C松开')
                keyState.C = false;
                THIS.sendMove('c',0)
                break;
            case 'e':
            case 'E':
                console.log('E松开')
                keyState.E = false;
                THIS.sendMove('e',0)
                break;
            case 'f':
            case 'F':
                console.log('F松开')
                keyState.F = false;
                THIS.sendMove('f',0)
                break;
            case 'g':
            case 'G':
                console.log('G松开')
                keyState.G = false;
                THIS.sendMove('g',0)
                break;
            case 'h':
            case 'H':
                console.log('H松开')
                keyState.H = false;
                THIS.sendMove('h',0)
                break;
            case 'i':
            case 'I':
                console.log('i松开')
                keyState.I = false;
                THIS.sendMove('i',0)
                break;
            case 'j':
            case 'J':
                console.log('J松开')
                keyState.J = false;
                THIS.sendMove('j',0)
                break;
            case 'k':
            case 'K':
                console.log('K松开')
                keyState.K = false;
                THIS.sendMove('k',0)
                break;
            case 'l':
            case 'L':
                console.log('L松开')
                keyState.L = false;
                THIS.sendMove('l',0)
                break;
            case 'm':
            case 'M':
                console.log('m松开')
                keyState.M = false;
                THIS.sendMove('m',0)
                break;
            case 'n':
            case 'N':
                console.log('N松开')
                keyState.N = false;
                THIS.sendMove('n',0)
                break;
            case 'o':
            case 'O':
                console.log('O松开')
                keyState.O = false;
                THIS.sendMove('o',0)
                break;
            case 'p':
            case 'P':
                console.log('P松开')
                keyState.P = false;
                THIS.sendMove('p',0)
                break;

            case 'q':
            case 'Q':
                console.log('Q松开')
                keyState.Q = false;
                THIS.sendMove('q',0)
                break;
            case 't':
            case 'T':
                console.log('T松开')
                keyState.T = false;
                THIS.sendMove('t',0)
                break;
            case 'u':
            case 'U':
                console.log('u松开')
                keyState.U = false;
                THIS.sendMove('u',0)
                break;
            case 'v':
            case 'V':
                console.log('v松开')
                keyState.V = false;
                THIS.sendMove('v',0)
                break;
            case 'x':
            case 'X':
                console.log('X松开')
                keyState.X = false;
                THIS.sendMove('x',0)
                break;
            case 'y':
            case 'Y':
                console.log('y松开')
                keyState.Y = false;
                THIS.sendMove('y',0)
                break;
            case 'z':
            case 'Z':
                console.log('Z松开')
                keyState.Z = false;
                THIS.sendMove('z',0)
                break;
        }

        
        // this.sendMove('r', 0); // 可以设置为停下来或者停止的状态
        // 打印出所有还在按下的按键
        const keysPressed = Object.keys(keyState).filter(key => keyState[key]);
        if(keysPressed.length>0){
            this.keyPress(keysPressed[0])
        }
    }

    async sendMove(dir,speed){
       

        if(dir==preKey && speed==preSpeed){
            return
        }
        preKey=dir
        preSpeed=speed

        fetch(`http://192.168.4.1:8080/move?move=${dir}&speed=${speed}`, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
              'Content-Type': 'application/json;'
            },
          })
          .then(response => response.text())
          .then(data => {
            console.log('服务器响应:', data);
          })
          .catch(error => {
            console.error('错误:', error);
          });
    }
  cstartmove(args){
        if(args.ONE=='1'){
            window.addEventListener('keydown',this.keyPress)
            window.addEventListener('keyup',this.keyUp)
        }else{
            window.removeEventListener('keydown',this.keyPress)
            window.removeEventListener('keyup',this.keyUp)
        }
  }
  moveresult(){

  }
  keyisdown(args){

    // const result = await getKeyDown(args);
    // if (result) {
    //     return true
    // }
    // return false

    // if(args.ONE==downcurrent){
    //     downcurrent=''
    //     return true
    // }
    // downcurrent=''
    // return false
    if(this.move[0]==args.ONE && this.move[1]=='1'){
        this.move[1]='2'
        return true
    }
    return false
  }
  keyisup(args){
    // const result = await getKeyUp(args);
    // if (result) {
    //     return true
    // }
    // return false

    // if(args.ONE==upcurrent){
    //     upcurrent=''
    //     return true
    // }
    // upcurrent=''
    // return false
    if(this.move[0]==args.ONE && this.move[1]=='0'){
        this.move[1]='2'
        return true
    }
    return false
  }


  
  
}


module.exports = RobotImg;
