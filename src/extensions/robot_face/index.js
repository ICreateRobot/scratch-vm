const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type')

// const VideoProvider = require('../../../../scratch-gui/src/lib/video/video-provider')

const socket=require('../../util/socket-connect')

const imageLoad = require('../../util/imageLoad')

const aiInfo = require('../../util/aiInfo')

const CameraModal = require('../../util/openCamera/cameraModal');

const cam = new CameraModal();

const imgIcon =require('./img.svg')

const innerCamera = require('./innerCamera.svg')

const formatMessage = require('format-message');

const innerBlock = require('./innerBlock.svg')


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
class RobotFace {
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
            // if(!this.mode){
            //     // this.runtime.ioDevices.video.disableVideo();
            //     // this.cstopCamera()
            //     // this.cstopComputerCamera()
            //      this.cstartCamera({ONE:'2'})
            //     THIS.cstartNetCamera({ONE:'2'})
            //     this.cstopComputerCamera()
            //     // await new Promise(resolve => setTimeout(resolve, 5000)); 
            //     await this.cstopMode({ONE:'3'})
            //     await this.cstopMode({ONE:'4'})
            //     await this.cstopMode({ONE:'6'})
            //     await this.cstopMode({ONE:'2'})
            //     await this.cstopMode({ONE:'1'})
            //     await this.cstopMode({ONE:'5'})
            //     await this.cstopMode({ONE:'7'})
            //     await this.cstopMode({ONE:'8'})
            //     imageLoad.setIsImage(false)
            // }
        })


        this.closeModeChannel = new BroadcastChannel('close-mode')

        this.qrData=null
        this.runtime.on('qrDetected', (event) => {
            // console.log(event)
            this.qrData=event
            // 这里可以调用 WiFi 断开函数
        });

        // this.stopAll=new BroadcastChannel('stopAll')
        // this.stopAll.addEventListener('message',async (event)=>{
        //     console.log(event.data)
        //     console.log('----------')
        //     if(event.data){
        //         this.cstartCamera({ONE:'2'})
        //         THIS.cstartNetCamera({ONE:'2'})
        //         this.cstopComputerCamera()
        //         // await new Promise(resolve => setTimeout(resolve, 5000)); 
        //         await this.cstopMode({ONE:'3'})
        //         await this.cstopMode({ONE:'4'})
        //         await this.cstopMode({ONE:'6'})
        //         await this.cstopMode({ONE:'2'})
        //         await this.cstopMode({ONE:'1'})
        //         await this.cstopMode({ONE:'5'})
        //         await this.cstopMode({ONE:'7'})
        //         await this.cstopMode({ONE:'8'})
        //         await new Promise(resolve => setTimeout(resolve, 1000)); 
        //         this.runtime.ioDevices.video.stopVideo()

        //         await socket.setSocket([])
        //         socket.setLastPostTime(Date.now())
        //     }
        // })

        // this.isClose=false
        // this.reciveChannel = new BroadcastChannel('reciveChannel')
        // this.reciveChannel.addEventListener('message',async(event)=>{
        //     if(event.data[2]==0 && !this.isClose){
        //         this.isClose=true
        //         this.cstopCamera()
        //         this.cstopComputerCamera()
        //         // await new Promise(resolve => setTimeout(resolve, 5000)); 
        //         await this.cstopMode({ONE:'3'})
        //         await this.cstopMode({ONE:'4'})
        //         await this.cstopMode({ONE:'6'})
        //         await this.cstopMode({ONE:'2'})
        //         await this.cstopMode({ONE:'1'})
        //         await this.cstopMode({ONE:'5'})
        //         await this.cstopMode({ONE:'7'})
        //         await this.cstopMode({ONE:'8'})
        //         await new Promise(resolve => setTimeout(resolve, 1000)); 
        //         this.runtime.ioDevices.video.stopVideo()
        //     }else if(event.data[2]==1 &&this.isClose){
        //         this.isClose=false
        //     }
        // })

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
        // this.channelHostPot=new BroadcastChannel('hostpot')
        // this.channelHostPot.addEventListener('message',async(event)=>{
        //     if(!event.data){
        //         if(this.runtime.ioDevices.video.videoProvider.constructor.name!='VideoProvider'){
        //             // this.cstopCamera()
        //             // this.cstopComputerCamera()
        //             console.log('断网一次')
        //              this.cstartCamera({ONE:'2'})
        //             THIS.cstartNetCamera({ONE:'2'})
        //             this.cstopComputerCamera()
        //             await this.cstopMode({ONE:'3'})
        //             await this.cstopMode({ONE:'4'})
        //             await this.cstopMode({ONE:'6'})
        //             await this.cstopMode({ONE:'2'})
        //             await this.cstopMode({ONE:'1'})
        //             await this.cstopMode({ONE:'5'})
        //             await this.cstopMode({ONE:'7'})
        //             await this.cstopMode({ONE:'8'})
        //         }
                
        //     }
            
        // })

        this.modeEnterTime=Date.now()


        this.deviceList=[]

        this.cameraPlace='0'
    }
  getInfo() {

    return {
      id: 'robotface',
      name: formatMessage({
            id: 'robotface.name',
            default: 'Face Detection',
            description: 'robotface.name'
        }),
      color1: '#b22222',
      menuIconURI: imgIcon,
      blockIconURI:innerBlock,
      blocks: [

        {
            opcode: 'cstartMode',
            blockType: BlockType.COMMAND,
            // blockIconURI: blockIconURI,
            // text: '开启人脸识别模式',
            text: formatMessage({
                id: 'robotface.cstartMode',
                default: 'Switch to face recognition mode',
                description: 'robotface.cstartMode'
            }),
            arguments:{

            }
        },


        {
            opcode: 'cstopMode',
            blockType: BlockType.COMMAND,
            // blockIconURI: blockIconURI,
            // text: '关闭人脸识别模式',
            text: formatMessage({
                id: 'robotface.cstopMode',
                default: 'Switch off face recognition mode',
                description: 'robotface.cstopMode'
            }),
            arguments:{
            
            }
        },
        '---',

        {
            opcode: 'isFace',
            blockType: BlockType.BOOLEAN,
            // text: '检测到人脸?',
            text: formatMessage({
                id: 'robotface.isFace',
                default: 'Face detected?',
                description: 'robotface.isFace'
            }),
            arguments:{
                
            },
            disableMonitor: true
        },

        {
            opcode: 'faceNum',
            blockType: BlockType.REPORTER,
            // text: '检测到的人脸数量',
            text: formatMessage({
                id: 'robotface.faceNum',
                default: 'Number of faces detected',
                description: 'robotface.faceNum'
            }),
            arguments:{
                
            },
            disableMonitor: true
        },

        {
            opcode: 'facePlace',
            blockType: BlockType.REPORTER,
            // text: '获取人脸位置信息[ONE]',
            text: formatMessage({
                id: 'robotface.facePlace',
                default: 'Get face position [ONE]',
                description: 'robotface.facePlace'
            }),
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
            // text: '获取人脸的[ONE]',
            text: formatMessage({
                id: 'robotface.getFaceWh',
                default: 'Get face [ONE]',
                description: 'robotface.getFaceWh'
            }),
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
            // text: '标记当前人脸[ONE]',
            text: formatMessage({
                id: 'robotface.symFace',
                default: 'Mark current face [ONE]',
                description: 'robotface.symFace'
            }),
            arguments:{
                ONE:{

                    type:ArgumentType.STRING,
                    
                },
            }
        },

        {
            opcode: 'reSetFace',
            blockType: BlockType.COMMAND,
            // blockIconURI: blockIconURI,
            // text: '重置人脸',
            text: formatMessage({
                id: 'robotface.reSetFace',
                default: 'Reset faces',
                description: 'robotface.reSetFace'
            }),
            arguments:{
                
            }
        },
        {
            opcode: 'isSymFace',
            blockType: BlockType.BOOLEAN,
            // text: '检测到标记过的人脸?',
            text: formatMessage({
                id: 'robotface.isSymFace',
                default: 'Marked face detected?',
                description: 'robotface.isSymFace'
            }),
            arguments:{
                
            },
            disableMonitor: true
        },

        {
            opcode: 'faceName',
            blockType: BlockType.REPORTER,
            // text: '检测到的人脸名称',
            text: formatMessage({
                id: 'robotface.faceName',
                default: 'Detected face name',
                description: 'robotface.faceName'
            }),
            arguments:{
                
            },
            disableMonitor: true
        },


        
        

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
                    text: formatMessage({
                        id: 'robotapriltag.menuWh.width',
                        default: 'Width',
                        description: 'robotapriltag.menuWh.width'
                    }),
                    value: '0'
                },
                {
                    text: formatMessage({
                        id: 'robotapriltag.menuWh.height',
                        default: 'Height',
                        description: 'robotapriltag.menuWh.height'
                    }),
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
        if(message == "请先开启摄像头"){
            toast.textContent = formatMessage({
                id: 'robotapriltag.showToast.firstCamera',
                default: 'Please open the camera first',
                description: 'robotapriltag.showToast.firstCamera'
            })
        }else if(message == "未开启人脸识别模式"){
            toast.textContent = formatMessage({
                id: 'robotface.showToast.firstMode',
                default: 'Face recognition mode is not enabled',
                description: 'robotface.showToast.firstMode'
            })
        }
        // toast.textContent = message;
    
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
        if(Date.now()-imageLoad.getModeTime()<5) return
        imageLoad.setModeTime(Date.now())
        if(!imageLoad.getIsImage() && !imageLoad.getComputer() && !imageLoad.getIsK210()){
            // alert('请先开启摄像头')
            this.showToast("请先开启摄像头");
            // console.log(this.runtime)
            this.runtime.stopAll();
            // this.props.vm.stopAll();
            // this.stopAll.postMessage(true)
            return
        }
        // if(this.cameraPlace=='0'){
        //     await this.cstopMode({ONE:'3'})
        //     await this.cstopMode({ONE:'4'})
        //     await this.cstopMode({ONE:'6'})
        //     await this.cstopMode({ONE:'2'})
        //     await this.cstopMode({ONE:'1'})
        //     await this.cstopMode({ONE:'5'})
        //     await this.cstopMode({ONE:'7'})
        //     await this.cstopMode({ONE:'8'})
        // }else{
        //     cam.stopQRDetection()
        // }
       
        this.closeModeChannel.postMessage('true')
        
        if(!imageLoad.getFaceDet()){

            if(imageLoad.getCameraPlace()=='0'){
                await new Promise(resolve => setTimeout(resolve, 1000)); 
                this.runtime.ioDevices.video.startFaceDetection()
            }else{
                await new Promise(resolve => setTimeout(resolve, 1000)); 
                imageLoad.getCamObj().startFaceDetection()
            }
            
            imageLoad.setFaceDet(true)
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    }

    
    async cstopMode(args){
        if(this.mode){
              if(imageLoad.getFaceDet()){

                try{
                    await this.runtime.ioDevices.video.stopFaceDetection()
                }catch(e){

                }

                imageLoad.getCamObj().stopFaceDetection()
                
                imageLoad.setFaceDet(false)
            }
        }
    }

   async reSetFace(){
    if(this.mode){
        this.runtime.ioDevices.video.reSetFace()
        imageLoad.getCamObj().reSetFace()
    }
   }


    async isFace(){
       if(this.mode){
         if(!imageLoad.getFaceDet()){
            this.showToast("未开启人脸识别模式");
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
            this.showToast("未开启人脸识别模式");
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
            this.showToast("未开启人脸识别模式");
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
            this.showToast("未开启人脸识别模式");
            this.runtime.stopAll();
            return 
        }
        return aiInfo.getFaceWh()[Number(args.ONE)]
       }
    }

    async symFace(args){
       if(this.mode){
         if(!imageLoad.getFaceDet()){
            this.showToast("未开启人脸识别模式");
            this.runtime.stopAll();
            return 
        }
        aiInfo.setFaceName(args.ONE)

        if(imageLoad.getCameraPlace()=='0'){
            await new Promise(resolve => setTimeout(resolve, 1000)); 
            this.runtime.ioDevices.video.learnNewFace(args.ONE)
        }else{
            await new Promise(resolve => setTimeout(resolve, 1000)); 
            imageLoad.getCamObj().learnNewFace(args.ONE)
        }
        
       }
    }

    async isSymFace(){
       if(this.mode){
         if(!imageLoad.getFaceDet()){
            this.showToast("未开启人脸识别模式");
            this.runtime.stopAll();
            return 
        }
        return aiInfo.getIsSym()
       }
    }
    async faceName(){
        if(this.mode){
            if(!imageLoad.getFaceDet()){
            this.showToast("未开启人脸识别模式");
            this.runtime.stopAll();
            return 
        }
        return aiInfo.getResultFace()
        }
    }

  
  
}


module.exports = RobotFace;
