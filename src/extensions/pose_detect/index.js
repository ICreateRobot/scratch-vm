const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type')

const blockIconURI = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+cGVuLWljb248L3RpdGxlPjxnIHN0cm9rZT0iIzU3NUU3NSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik04Ljc1MyAzNC42MDJsLTQuMjUgMS43OCAxLjc4My00LjIzN2MxLjIxOC0yLjg5MiAyLjkwNy01LjQyMyA1LjAzLTcuNTM4TDMxLjA2NiA0LjkzYy44NDYtLjg0MiAyLjY1LS40MSA0LjAzMi45NjcgMS4zOCAxLjM3NSAxLjgxNiAzLjE3My45NyA0LjAxNUwxNi4zMTggMjkuNTljLTIuMTIzIDIuMTE2LTQuNjY0IDMuOC03LjU2NSA1LjAxMiIgZmlsbD0iI0ZGRiIvPjxwYXRoIGQ9Ik0yOS40MSA2LjExcy00LjQ1LTIuMzc4LTguMjAyIDUuNzcyYy0xLjczNCAzLjc2Ni00LjM1IDEuNTQ2LTQuMzUgMS41NDYiLz48cGF0aCBkPSJNMzYuNDIgOC44MjVjMCAuNDYzLS4xNC44NzMtLjQzMiAxLjE2NGwtOS4zMzUgOS4zYy4yODItLjI5LjQxLS42NjguNDEtMS4xMiAwLS44NzQtLjUwNy0xLjk2My0xLjQwNi0yLjg2OC0xLjM2Mi0xLjM1OC0zLjE0Ny0xLjgtNC4wMDItLjk5TDMwLjk5IDUuMDFjLjg0NC0uODQgMi42NS0uNDEgNC4wMzUuOTYuODk4LjkwNCAxLjM5NiAxLjk4MiAxLjM5NiAyLjg1NU0xMC41MTUgMzMuNzc0Yy0uNTczLjMwMi0xLjE1Ny41Ny0xLjc2NC44M0w0LjUgMzYuMzgybDEuNzg2LTQuMjM1Yy4yNTgtLjYwNC41My0xLjE4Ni44MzMtMS43NTcuNjkuMTgzIDEuNDQ4LjYyNSAyLjEwOCAxLjI4Mi42Ni42NTggMS4xMDIgMS40MTIgMS4yODcgMi4xMDIiIGZpbGw9IiM0Qzk3RkYiLz48cGF0aCBkPSJNMzYuNDk4IDguNzQ4YzAgLjQ2NC0uMTQuODc0LS40MzMgMS4xNjVsLTE5Ljc0MiAxOS42OGMtMi4xMyAyLjExLTQuNjczIDMuNzkzLTcuNTcyIDUuMDFMNC41IDM2LjM4bC45NzQtMi4zMTYgMS45MjUtLjgwOGMyLjg5OC0xLjIxOCA1LjQ0LTIuOSA3LjU3LTUuMDFsMTkuNzQzLTE5LjY4Yy4yOTItLjI5Mi40MzItLjcwMi40MzItMS4xNjUgMC0uNjQ2LS4yNy0xLjQtLjc4LTIuMTIyLjI1LjE3Mi41LjM3Ny43MzcuNjE0Ljg5OC45MDUgMS4zOTYgMS45ODMgMS4zOTYgMi44NTYiIGZpbGw9IiM1NzVFNzUiIG9wYWNpdHk9Ii4xNSIvPjxwYXRoIGQ9Ik0xOC40NSAxMi44M2MwIC41LS40MDQuOTA1LS45MDQuOTA1cy0uOTA1LS40MDUtLjkwNS0uOTA0YzAtLjUuNDA3LS45MDMuOTA2LS45MDMuNSAwIC45MDQuNDA0LjkwNC45MDR6IiBmaWxsPSIjNTc1RTc1Ii8+PC9nPjwvc3ZnPg==';
const dangoIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABeCAYAAADc6BHlAAAAAXNSR0IArs4c6QAABItJREFUeF7tncuN2zAQhu0SctmCAuSQDnLZAlLCAjkG2BJSwF62gxwWSEG5pIQEFJYKRQ5f8+BzfLSoMfV/8yIl2/db+PrrvXUHxti3/LGJobeUndR5Sx9zRUmJWTquVCyF8a4UKOzj89Pt5em5VMxj3Idf34Pxfz5+y9nYHoQV4PR+I777ioGABM+pHQGyNYRqABjhfTAAiG0hRAH4ns8hvIIIc0RRcZUQ307Fi4btIiELQFJ8hXALevNLK9pC/N0h+CF/Amgp/s4QFECudxY+DtaAHt6/axQoAGEPz5kP1gE9vR+IguXb0tEBGCZLQ7gAGMH7jeI7Lc6GBOBB0AjIFRKJ404UKAAJgXM2dwLQdfUbA7ETAKPBAWGUIgwUYpfTUilpmCJccPsyFixTA+kOgCC8D2RKEN0AQMI//n7L1ebz+MvDpyUiostK2Be/RnhIdQDGNNHQFAC38C6MSEQMDyLYDZXqhCTFT4CYD4BUO+oCoKacXKHwomFoCOAdMe4oaCm+hTMLBPFbkj3EnwkCFJ5sWxM9xTcQZoiCWH5kgdAbwAwQsgAoRdkCkC66FUV5uIKcmhDpIa0RvH+GWpDzCDSEUbx/9DSUA3BuVbthnmtTR/J+IApKrjmX1diO10wG/ApT7psxvfP/SgDstdR8Me82IABzHTWOx+btkCHKRIpAKIA0PwoAyHIARQG0BXBJU6OIP3InxB0BQZ3oDSFx54w7JaNqxZIAKkXvemtzKQAp4b/8/BH10NfPX1PeK6XR8ZmSxo+C3CoFQeKnRI8pHoEhppOYYfuwlzQAX3iM6BAMAISIViJG3y/o/88fVDxuUlPJpMR35yANYloALcS3IDwIrJqxGgO8VywKXABcaScVfVIQpgTQWnzJSJAGYObOGgW9xJeC0AIAKwQLoEXaKeiOyPqRDRR2LZdNOmxr2tv7JaKgFYBLFGAXaL29f3YAJAijeD8AgeTEpJML048/DHXPYGAApC2dHgCCLWv7Rqo2jJJ+uNNQTwBBSoIiykJRAMh8U3ha0f1lY6tX+5lpSdGOjD6xUFjMsCQMBYCRlH7OCUUB0MXEWFAAGNWYzzkgaAQwq1phbigAXNvTIxbhGJNmAFxxYxG3LQDJNBR7OgKCoAAqclfJ0MyjKUHtccaTsgjp5JILYx4jloasoKn/T7CRwOX9pE0kZmFLzYm0o66gPgAzMfen/A2EnQGc+0ec7WgOgA/B8RZyBiEbKHVdxnFdoiACgawf2QCjsDWm2CH4RRhKRQAEsn5kAzWqMY69bNhxpaMeEGYFcNYCC3VWCDMDWALC7ACmh7ACAJuFWOpCakUsUZhXAhBEQ019yG1FWFvcEFYDAEYDsvtytbk+2ef93aO17/35XZG2RYOQFzDCacU3+wtWtyIQVgcQcwIjJuba2SFgJjGCZ/ecAysEBYBDyQZBAeAABB0XtjtSAHgALBAUAA0AGYICoAMgQVAAPADQEBQAHwAMhLsC4AVQBMHdslAA/ACyEBwAGgEy+h9WwcWav2GnESBIwIcAfJRGgKz+YST4u67/APKrBHxjStmdAAAAAElFTkSuQmCC";
const socket=require('../../util/localSocket')

const led = require('../../util/img/led_purple.svg')
const ledCon = require('../../util/img/max_module_led_con.svg')
const currentMode = require('../../util/mode')
const formatMessage = require('format-message');
const imageLoad = require('../../util/imageLoad')
const aiInfo = require('../../util/aiInfo')
let dataControl=[17,0,0,0,0,0,0,0,0,0,0,0,0]
class PoseDetect {
  constructor(runtime){
    this.runtime=runtime


    this.mode=true
    this.channelMode=new BroadcastChannel('mode')
    this.channelMode.addEventListener('message',(event)=>{
        this.mode=event.data
        currentMode.setMode(event.data)
    })

    this.closeModeChannel= new BroadcastChannel('close-mode')


    if(!socket.getSocket()){
      socket.setSocket()
    }
    this.channelLoad = new BroadcastChannel('isLoading');

    this.poseLandmarkerPromise = null;

    this.poseLandmark=null
    setTimeout(async() => {

        this.showPoseLoading(true)
        this.poseLandmark = await this.preloadPoseModel();

        this.showPoseLoading(false)
    }, 500);
  }
  getInfo() {
    return {
      id: 'posedetect',
      name: formatMessage({
            id: 'posedetect.name',
            default: 'pose detect',
            description: 'posedetect.name'
        }),
      color1: '#9400d3',
      blocks: [
        {
            opcode: 'startPose',
            blockType: BlockType.COMMAND,
            // blockIconURI: led,
            // text: '端口[ONE]为[TWO]',
            text: formatMessage({
                id: 'posedetect.startPose',
                default: '[ONE] Pose Recognition',
                description: 'posedetect.startPose'
            }),
            arguments:{
                ONE:{
                    type: ArgumentType.STRING,
                    menu: 'START_MENU'
                }
            }
        },
        {
          opcode: 'isDetect',
          blockType: BlockType.BOOLEAN,
          // text: '位置[ONE]为[TWO]',
          text: formatMessage({
              id: 'posedetect.isDetect',
              default: 'pose Detected?',
              description: 'posedetect.isDetect'
          }),
          // blockIconURI: ledCon,
          arguments:{
           
          },
          disableMonitor: true
        }, 

        {
          opcode: 'getPositionPose',
          blockType: BlockType.REPORTER,
          // blockIconURI: led,
          // text: '端口[ONE]为[TWO]',
          text: formatMessage({
              id: 'posedetect.getPositionPose',
              default: '[ONE] position of [TWO]',
              description: 'posedetect.getPositionPose'
          }),
          arguments:{
              ONE:{
                  type: ArgumentType.STRING,
                  menu: 'POSITION_MENU'
              },
              TWO:{
                  type: ArgumentType.NUMBER,
                  menu: 'POSE_MENU'
              }

          },
          disableMonitor: true
          
        },
        {
          opcode: 'getPositionNum',
          blockType: BlockType.REPORTER,
          // blockIconURI: led,
          // text: '端口[ONE]为[TWO]',
          text: formatMessage({
              id: 'posedetect.getPositionNum',
              default: '[ONE] position of keypoint [TWO]',
              description: 'posedetect.getPositionNum'
          }),
          arguments:{
              ONE:{
                  type: ArgumentType.STRING,
                  menu: 'POSITION_MENU'
              },
              TWO:{
                  type: ArgumentType.NUMBER,
                  menu: 'POSEPOINT_MENU'
              }

          },
          disableMonitor: true
          
        },

      ],
      menus: {
        POSEPOINT_MENU: {
            acceptReporters: false,
            items: [
                {
                    text: '0',
                    value: '0'
                },
                {
                    text: '2',
                    value: '2'
                },
                {
                    text: '5',
                    value: '5'
                },
                {
                    text: '11',
                    value: '11'
                },
                {
                    text: '12',
                    value: '12'
                },
                {
                    text: '13',
                    value: '13'
                },
                {
                    text: '14',
                    value: '14'
                },
                {
                    text: '15',
                    value: '15'
                },
                {
                    text: '16',
                    value: '16'
                },
                {
                    text: '23',
                    value: '23'
                },
                {
                    text: '24',
                    value: '24'
                },
                {
                    text: '25',
                    value: '25'
                },
                {
                    text: '26',
                    value: '26'
                },
                {
                    text: '27',
                    value: '27'
                },
                {
                    text: '28',
                    value: '28'
                }
            ]
        },
        POSITION_MENU: {
          acceptReporters: false,
          items: [
            {
                text: 'x',
                value:'x'
            },
            {
                text: 'y',
                value:'y'
            },
          ]
        },
        POSE_MENU: {

            acceptReporters: false,
        
            items: [
        
                {
                    text: formatMessage({
                        id: 'posedetect.POSE_MENU.nose',
                        default: 'nose',
                        description: 'posedetect.POSE_MENU.nose'
                    }),
                    value: '0'
                },
        
                {
                    text: formatMessage({
                        id: 'posedetect.POSE_MENU.leftEye',
                        default: 'left eye',
                        description: 'posedetect.POSE_MENU.leftEye'
                    }),
                    value: '2'
                },
        
                {
                    text: formatMessage({
                        id: 'posedetect.POSE_MENU.rightEye',
                        default: 'right eye',
                        description: 'posedetect.POSE_MENU.rightEye'
                    }),
                    value: '5'
                },
        
                {
                    text: formatMessage({
                        id: 'posedetect.POSE_MENU.leftShoulder',
                        default: 'left shoulder',
                        description: 'posedetect.POSE_MENU.leftShoulder'
                    }),
                    value: '11'
                },
        
                {
                    text: formatMessage({
                        id: 'posedetect.POSE_MENU.rightShoulder',
                        default: 'right shoulder',
                        description: 'posedetect.POSE_MENU.rightShoulder'
                    }),
                    value: '12'
                },
        
                {
                    text: formatMessage({
                        id: 'posedetect.POSE_MENU.leftElbow',
                        default: 'left elbow',
                        description: 'posedetect.POSE_MENU.leftElbow'
                    }),
                    value: '13'
                },
        
                {
                    text: formatMessage({
                        id: 'posedetect.POSE_MENU.rightElbow',
                        default: 'right elbow',
                        description: 'posedetect.POSE_MENU.rightElbow'
                    }),
                    value: '14'
                },
        
                {
                    text: formatMessage({
                        id: 'posedetect.POSE_MENU.leftWrist',
                        default: 'left wrist',
                        description: 'posedetect.POSE_MENU.leftWrist'
                    }),
                    value: '15'
                },
        
                {
                    text: formatMessage({
                        id: 'posedetect.POSE_MENU.rightWrist',
                        default: 'right wrist',
                        description: 'posedetect.POSE_MENU.rightWrist'
                    }),
                    value: '16'
                },
        
                {
                    text: formatMessage({
                        id: 'posedetect.POSE_MENU.leftHip',
                        default: 'left hip',
                        description: 'posedetect.POSE_MENU.leftHip'
                    }),
                    value: '23'
                },
        
                {
                    text: formatMessage({
                        id: 'posedetect.POSE_MENU.rightHip',
                        default: 'right hip',
                        description: 'posedetect.POSE_MENU.rightHip'
                    }),
                    value: '24'
                },
        
                {
                    text: formatMessage({
                        id: 'posedetect.POSE_MENU.leftKnee',
                        default: 'left knee',
                        description: 'posedetect.POSE_MENU.leftKnee'
                    }),
                    value: '25'
                },
        
                {
                    text: formatMessage({
                        id: 'posedetect.POSE_MENU.rightKnee',
                        default: 'right knee',
                        description: 'posedetect.POSE_MENU.rightKnee'
                    }),
                    value: '26'
                },
        
                {
                    text: formatMessage({
                        id: 'posedetect.POSE_MENU.leftAnkle',
                        default: 'left ankle',
                        description: 'posedetect.POSE_MENU.leftAnkle'
                    }),
                    value: '27'
                },
        
                {
                    text: formatMessage({
                        id: 'posedetect.POSE_MENU.rightAnkle',
                        default: 'right ankle',
                        description: 'posedetect.POSE_MENU.rightAnkle'
                    }),
                    value: '28'
                }
        
            ]
        },
        FINGER_MENU: {
          acceptReporters: false,
          items: [
            {
                text: formatMessage({
                    id: 'gesturedetect.formatMenufinger.thumb',
                    default: 'thumb',
                    description: 'gesturedetect.formatMenufinger.thumb'
                }),
                value:'0'
            },
            {
                text: formatMessage({
                    id: 'gesturedetect.formatMenufinger.indexfinger',
                    default: 'index finger',
                    description: 'gesturedetect.formatMenufinger.indexfinger'
                }),
                value:'1'
            },
            {
                text: formatMessage({
                    id: 'gesturedetect.formatMenufinger.middlefinger',
                    default: 'middle finger',
                    description: 'gesturedetect.formatMenufinger.middlefinger'
                }),
                value:'2'
            },
            {
                text: formatMessage({
                    id: 'gesturedetect.formatMenufinger.ringfinger',
                    default: 'ring finger',
                    description: 'gesturedetect.formatMenufinger.ringfinger'
                }),
                value:'3'
            },
            {
                text: formatMessage({
                    id: 'gesturedetect.formatMenufinger.pinkyfinger',
                    default: 'pinky finger',
                    description: 'gesturedetect.formatMenufinger.pinkyfinger'
                }),
                value:'4'
            },
          ]
        },
        START_MENU: {
          acceptReporters: false,
          items: [
            {
                text: formatMessage({
                    id: 'gesturedetect.formatMenustart.turnon',
                    default: 'Turn on',
                    description: 'gesturedetect.formatMenustart.turnon'
                }),
                value:'0'
            },
            {
                text: formatMessage({
                    id: 'gesturedetect.formatMenustart.turnoff',
                    default: 'Turn off',
                    description: 'gesturedetect.formatMenustart.turnoff'
                }),
                value:'1'
            },
          ]
        }
      }
    };
  }


  preloadPoseModel() {

        if (this.poseLandmarkerPromise) {
            return this.poseLandmarkerPromise;
        }

        this.poseLandmarkerPromise = (async () => {

            console.log("开始预加载姿态识别模型");
            const currentURL = window.location.href;
            // 获取前一级路径
            const oneLevelUp = currentURL.substring(0, currentURL.lastIndexOf('/'));
            const modelPath =oneLevelUp+'/static/model/poseModel';
            // const { HandLandmarker, FilesetResolver } = await import(
            //     /* webpackIgnore: true */
            //     modelPath+"/tasks-vision@latest.js"
            //   );

            const { PoseLandmarker, FilesetResolver } = await import(
                /* webpackIgnore: true */
                modelPath+"/mediapipe-tasks-vision.js"
            );

            const vision = await FilesetResolver.forVisionTasks(
                modelPath+"/wasm"
            );

            // 保存 OpenCV Module
            const savedModule = window.Module;

            try {

                window.Module = undefined;

                console.log("开始创建 PoseLandmarker");

                const landmarker =
                    await PoseLandmarker.createFromOptions(
                        vision,
                        {
                            baseOptions: {
                                modelAssetPath:
                                     modelPath +
                                 "/pose_landmarker_lite.task"
                            },

                            runningMode: "VIDEO",

                            numHands: 1
                        }
                    );

                console.log("PoseLandmarker 初始化完成");

                return landmarker;

            } finally {

                window.Module = savedModule;

            }

        })();

        return this.poseLandmarkerPromise;
    }

    showPoseLoading(show) {
        const loadingId = 'pose-model-loading';
    
        // ==============================
        // 显示
        // ==============================
        if (show) {
    
            // 已经存在，直接显示
            let loading = document.getElementById(loadingId);
    
            if (loading) {
                loading.style.display = 'flex';
                return;
            }
    
            // ==============================
            // 创建 Loading 容器
            // ==============================
            loading = document.createElement('div');
            loading.id = loadingId;
    
            Object.assign(loading.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100vw',
                height: '100vh',
    
                // 半透明黑色背景
                background: 'rgba(0, 0, 0, 0.55)',
    
                // 最顶层
                zIndex: '999999999',
    
                // 居中
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
    
                // 防止点击下面的页面
                pointerEvents: 'auto'
            });
    
            // ==============================
            // 中间内容
            // ==============================
            const content = document.createElement('div');
    
            Object.assign(content.style, {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
    
                padding: '30px 45px',
    
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '16px',
    
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)',
    
                minWidth: '260px'
            });
    
            // ==============================
            // 加载动画
            // ==============================
            const spinner = document.createElement('div');
    
            Object.assign(spinner.style, {
                width: '45px',
                height: '45px',
    
                border: '5px solid #e5e5e5',
                borderTop: '5px solid #4a90e2',
    
                borderRadius: '50%',
    
                animation: 'gestureLoadingSpin 1s linear infinite'
            });
    
            // ==============================
            // 提示文字
            // ==============================
            const text = document.createElement('div');
    
            text.innerText = formatMessage({
                id: 'robotpose.showToast.loadModel',
                default: 'Loading the pose model...',
                description: 'robotpose.showToast.loadModel'
            });
    
            Object.assign(text.style, {
                marginTop: '20px',
    
                fontSize: '18px',
                fontWeight: '500',
    
                color: '#333',
    
                whiteSpace: 'nowrap'
            });
    
            // ==============================
            // 组装
            // ==============================
            content.appendChild(spinner);
            content.appendChild(text);
    
            loading.appendChild(content);
    
            // ==============================
            // 添加动画 CSS
            // ==============================
            if (!document.getElementById('pose-loading-style')) {
    
                const style = document.createElement('style');
    
                style.id = 'pose-loading-style';
    
                style.innerHTML = `
                    @keyframes gestureLoadingSpin {
                        from {
                            transform: rotate(0deg);
                        }
    
                        to {
                            transform: rotate(360deg);
                        }
                    }
                `;
    
                document.head.appendChild(style);
            }
    
            // 添加到页面最顶层
            document.body.appendChild(loading);
    
        } else {
    
            // ==============================
            // 关闭
            // ==============================
            const loading = document.getElementById(loadingId);
    
            if (loading) {
                loading.style.display = 'none';
            }
        }
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
      }else if(message == "未开启颜色识别模式"){
          toast.textContent = formatMessage({
              id: 'robotcolordete.showToast.firstMode',
              default: 'Color detection mode is not enabled',
              description: 'robotcolordete.showToast.firstMode'
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
  async startPose(args){
    if(this.mode){
        if(args.ONE ==0){
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


            this.closeModeChannel.postMessage(true)

            if(!imageLoad.getIsPose()){

                if(imageLoad.getCameraPlace()=='0'){
                    await new Promise(resolve => setTimeout(resolve, 5000)); 
                    console.log('准备调用 video.startPoseDetection');
                    await this.runtime.ioDevices.video.startPoseDetection(this.poseLandmark)
                    console.log('video.startPoseDetection 已返回');
                }else{
                    await new Promise(resolve => setTimeout(resolve, 5000)); 
                    imageLoad.getCamObj().startPoseDetection(this.poseLandmark)
                }
                
                await new Promise(resolve => setTimeout(resolve, 1000));
                imageLoad.setIsPose(true)
            }
        }else{
            if(imageLoad.getIsPose()){
                
                try{
                    if(imageLoad.getCameraPlace()=='0'){
                        await this.runtime.ioDevices.video.stopPoseDetection()
                    }else{
                        imageLoad.getCamObj().stopPose()
                    }
                    
                }catch(e){

                }

                // imageLoad.getCamObj().stopFaceDetection()
                
                imageLoad.setIsPose(false)
            }
        }
      
     
    }
  }

  getPositionPose(args){
    return aiInfo.getPose()[args.TWO][args.ONE]
  }
  getPositionNum(args){
    return aiInfo.getPose()[args.TWO][args.ONE]
  }
 isDetect(){
    if(aiInfo.getPose()){
        return true
    }else{
        return false
    }
 }
}


module.exports = PoseDetect;
