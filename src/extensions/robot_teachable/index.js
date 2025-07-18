const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type')
const tf = require('./modules/tfjs')
const tfcore = require('./modules/tfjs-core')
const tfconv = require('./modules/tfjs-converter');  // 需要添加
const formatMessage = require('format-message');
const mobilenet = require('./modules/mobilenet')
const posenet = require('./modules/posenet.js')
const socket=require('../../util/socket-connect')
const handpose = require('./modules/handpose.js')
class robotteachable {

    constructor(runtime){
        this.runtime=runtime
        console.log(runtime)
        this.confidence=1
        this.poseNetmode=null
        this.modelName=null
        this.timer=null
        this.className=['1']
        this.videoPopup = null;  // 新增：存储弹窗引用
        this.videoElement = null;  // 新增：存储视频元素

        this.imgElement=null

        this.isRobotVideo=false
        this.isCompoterVideo=false
        this.isNetCamera=false

        // 新增拖动相关状态
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.initialPopupX = 0;
        this.initialPopupY = 0;

        this.result=null

        this.whatModel=null

        this.POSE=null


        this.connections = [
            [0, 1],[1, 2],  [2, 4],  // 大拇指
            [0, 5], [5, 6], [6, 8],  // 食指
            [9, 10],  [10, 12], // 中指
            [13, 14],  [14, 16], // 无名指
            [0, 17], [17, 18],  [18, 20], // 小指
            [5, 9], [9, 13],  [13, 17] // 关节
        ];

        // setInterval(()=>{
        //     this.confidence++
        // },2000)

        this.mode=true
        this.channelMode=new BroadcastChannel('mode')
        this.channelMode.addEventListener('message',(event)=>{
            this.mode=event.data
        })

        this.classInfo=[]

        this.channelClassName=new BroadcastChannel('classInfo')
        this.channelClassName.addEventListener('message',(event)=>{
            console.log(event.data)
            this.classInfo=event.data
            this.runtime.requestBlocksUpdate();
        })

        this.channelTrain=new BroadcastChannel('channelTrain')

        this.channelModelName=new BroadcastChannel('modelName')
        this.channelModelName.addEventListener('message',(event)=>{
            this.modelName=event.data
            console.log(this.modelName)
        })


        this.channelLoad = new BroadcastChannel('isLoading');

        this.channelWhatModel = new BroadcastChannel('whatModel')
        this.channelWhatModel.addEventListener('message',(event)=>{
            this.whatModel=event.data
            if(this.poseNetmode && typeof this.poseNetmode.dispose ==='function'){
                this.poseNetmode.dispose()
            }
            
            if(event.data=='image'){
                this.channelLoad.postMessage(true)
                tf.ready().then(() => {
                    console.log("使用后端: ", tf.getBackend());//获取当前 TensorFlow.js 所使用的计算后端
                    tf.setBackend('webgl').then(() => {//切换后端
                        console.log("切换到webgl后端.");
                        this.loadMobilenet()
                    });
                });
            }else if(event.data=='pose'){
                this.channelLoad.postMessage(true)
                tf.ready().then(() => {
                    console.log("使用后端: ", tf.getBackend());//获取当前 TensorFlow.js 所使用的计算后端
                    tf.setBackend('webgl').then(() => {//切换后端
                        console.log("切换到webgl后端.");
                        this.loadPoseMode()
                    });
                });
            }else if(event.data=='gesture'){
                this.channelLoad.postMessage(true)
                tf.ready().then(() => {
                    console.log("使用后端: ", tf.getBackend());//获取当前 TensorFlow.js 所使用的计算后端
                    tf.setBackend('webgl').then(() => {//切换后端
                        console.log("切换到webgl后端.");
                        this.loadGestureMode()
                    });
                });
            }
        })
        this.whatCamera=''
        // document.addEventListener('click', (e) => {
        //     if (this.videoPopup && !this.videoPopup.contains(e.target)) {
        //         this.lowerToBack();
        //     }
        // });

        // setInterval(()=>{
        //     console.log(this.runtime.requestBlocksUpdate)
        //     this.runtime.requestBlocksUpdate();
        // },3000)
       
        
    }
    getInfo() {
    return {
        id: 'robotteachable',
        name: formatMessage({
                id: 'robotteachable.name',
                default: 'Machine Learning',
                description: 'robotteachable.name'
            }),
        color1: '#66ffcc',
        blocks: [

            {
                func:'trainMode',
                blockType:BlockType.BUTTON,
                // text:'开始训练模型'
                text: formatMessage({
                    id: 'robotteachable.trainMode',
                    default: 'Start training model',
                    description: 'robotteachable.trainMode'
                }),
            },
            {
                func:'startIdent',
                blockType:BlockType.BUTTON,
                // text:'开始识别(电脑摄像头)'
                text: formatMessage({
                    id: 'robotteachable.startIdent',
                    default: 'Start recognition (computer camera)',
                    description: 'robotteachable.startIdent'
                }),
            },

           


            {
                func:'startImgIdent',
                blockType:BlockType.BUTTON,
                // text:'开始识别（机器人摄像头）'
                text: formatMessage({
                    id: 'robotteachable.startImgIdent',
                    default: 'Start recognition (robot camera)',
                    description: 'robotteachable.startImgIdent'
                }),
            },

            // {
            //     func:'stopImgIdent',
            //     blockType:BlockType.BUTTON,
            //     // text:'结束识别（机器人摄像头）'
            //     text: formatMessage({
            //         id: 'robotteachable.stopImgIdent',
            //         default: 'Stop recognition (robot camera)',
            //         description: 'robotteachable.stopImgIdent'
            //     }),
            // },

            {
                func:'startNetIdent',
                blockType:BlockType.BUTTON,
                // text:'开始识别（网络摄像头）'
                text: formatMessage({
                    id: 'robotteachable.startNetIdent',
                    default: 'Start recognition (network camera)',
                    description: 'robotteachable.startNetIdent'
                }),
            },

            // {
            //     func:'stopNetIdent',
            //     blockType:BlockType.BUTTON,
            //     // text:'结束识别（网络摄像头）'
            //     text: formatMessage({
            //         id: 'robotteachable.stopNetIdent',
            //         default: 'Stop recognition (network camera)',
            //         description: 'robotteachable.stopNetIdent'
            //     }),
            // },

             {
                func:'stopIdent',
                blockType:BlockType.BUTTON,
                // text:'结束识别(电脑摄像头)'
                text: formatMessage({
                    id: 'robotteachable.stopIdent',
                    default: 'Stop recognition',
                    description: 'robotteachable.stopIdent'
                }),
            },

            {
                func:'importModel',
                blockType:BlockType.BUTTON,
                // text:'结束识别(电脑摄像头)'
                text: formatMessage({
                    id: 'robotteachable.importModel',
                    default: 'import model',
                    description: 'robotteachable.importModel'
                }),
            },
            {
                opcode: 'resultBlock',
                blockType: BlockType.BOOLEAN,
                // text: '识别到的结果为[ONE]',
                text: formatMessage({
                    id: 'robotteachable.resultBlock',
                    default: 'Recognition result is [ONE]',
                    description: 'robotteachable.resultBlock'
                }),
                arguments:{
                    ONE:{
                        type:ArgumentType.STRING,
                        menu:'MENU_RESULT'
                    }
                },
                disableMonitor: true
            },

            {
                opcode: 'confidenceBlock',
                blockType: BlockType.REPORTER,
                // text: '识别[ONE]的置信度',
                text: formatMessage({
                    id: 'robotteachable.confidenceBlock',
                    default: 'Confidence of recognizing [ONE]',
                    description: 'robotteachable.confidenceBlock'
                }),
                arguments:{
                    ONE:{
                        type:ArgumentType.STRING,
                        menu:'MENU_CONFID'
                    }
                },
                disableMonitor: true
            },


        ],
        menus: {
            MENU_RESULT:{
                acceptReporters: false,
                items:'getConnectedSensors'
            },
            MENU_CONFID:{
                acceptReporters: false,
                items:'getConnectedSensors'
            },
        }
  
    };
    }

    async loadMobilenet() {
    
        const currentURL = window.location.href;

        // 获取前一级路径
        const oneLevelUp = currentURL.substring(0, currentURL.lastIndexOf('/'));
        // 获取前两级路径
        const twoLevelsUp = oneLevelUp.substring(0, oneLevelUp.lastIndexOf('/'));
        const modelPath =twoLevelsUp+'/static/aiModel/image/modules';  // 你的模型路径
        console.log(modelPath)
        let h = modelPath+"/model.json"
        this.poseNetmode = await mobilenet.load({
            modelUrl:h,
            version: 1,
            alpha: 1.0 // 或其他适合的值
            })
        this.poseNetmode = this.poseNetmode.model;
        console.log("加载完成")
        this.channelLoad.postMessage(false)
    
    }

    async loadPoseMode(){
        const currentURL = window.location.href;

        // 获取前一级路径
        const oneLevelUp = currentURL.substring(0, currentURL.lastIndexOf('/'));
        // 获取前两级路径
        const twoLevelsUp = oneLevelUp.substring(0, oneLevelUp.lastIndexOf('/'));
        const modelPath =twoLevelsUp+'/static/aiModel/pose/modules';  // 你的模型路径
        console.log(modelPath)
        let h = modelPath+"/model-stride16.json"
        const poseNet = await posenet.load({modelUrl:h}).then(model => {
            this.poseNetmode = model; // 保存加载好的模型
            // this.poseNetmode.estimateSinglePose(this.videoElement)

        })
        .catch(e=>{
        console.log("posenet加载出错")
        });
        this.channelLoad.postMessage(false)
        
    }

    async loadGestureMode(){
        //加载PoseNet模型
        const poseNet = await handpose.load().then(model => {
            this.poseNetmode = model; // 保存加载好的模型
            console.log("模型加载完成")

        })
        .catch(e=>{
            console.log("posenet加载出错")
        });
        this.channelLoad.postMessage(false)
    }

    /*使用模型*/
    async predict(show_video,model) {
        return tf.tidy(() => {
            const frame = tf.browser.fromPixels(show_video)
                .resizeNearestNeighbor([224, 224])
                .expandDims()
                .toFloat()
                .div(tf.scalar(255));

            const processedFrame = this.poseNetmode.predict(frame).squeeze();
            const prediction = model.predict(processedFrame.expandDims(0));
            const result = prediction.arraySync();  // 如果 prediction 是张量，这样将其转为数组
            return result;
        });
    }

    predictPose(pose,model) {
        const poseData = pose.keypoints.map(kp => [kp.position.x, kp.position.y,kp.score]);
        const input = tf.tensor2d([poseData.flat()]);
        const floatInput = tf.cast(input, 'float32');
        const result = model.predict(floatInput).arraySync();
    
        return result;
    }

    /*使用模型*/
    predictGesture(pose,model) {
        const landmarks=pose.landmarks;
        const input=tf.tensor2d([landmarks.flat()]);
        const floatInput=tf.cast(input,'float32');
        const result=model.predict(floatInput).arraySync();

        return result;
    }
    

    trainMode(){
        this.channelTrain.postMessage(true)
    }

    // 新增：创建视频弹窗
    createVideoPopup(whatVideo) {
        console.log('创建')
        const popup = document.createElement('div');
        popup.id='popup'
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.zIndex = 1000; // 初始较高层级
        popup.style.background = 'white';
        popup.style.padding = '20px';
        popup.style.borderRadius = '10px';
        popup.style.boxShadow = '0 0 20px rgba(0,0,0,0.2)';
        popup.style.transition = 'z-index 0.3s'; // 添加过渡动画
        popup.style.width = '350px'
    

        // 添加可拖动区域（整个弹窗）
        // popup.style.cursor = 'move'; // 鼠标显示可拖动图标
        // popup.addEventListener('mousedown', (e) => this.startDrag(e));
        // 添加点击弹窗提升层级的功能
        // popup.addEventListener('click', (e) => {
        //     this.bringToFront();
        //     e.stopPropagation(); // 阻止事件冒泡
        // });

        // 创建拖动按钮
        const dragBtn = document.createElement('button');
        dragBtn.textContent = '⠿'; // Unicode字符，模拟拖动图标
        dragBtn.style.position = 'absolute';
        dragBtn.style.left = '10px';
        dragBtn.style.top = '10px';
        dragBtn.style.width = '30px';
        dragBtn.style.height = '30px';
        dragBtn.style.border = 'none';
        dragBtn.style.borderRadius = '5px';
        dragBtn.style.background = '#ccc';
        dragBtn.style.color = '#333';
        dragBtn.style.fontSize = '18px';
        dragBtn.style.fontWeight = 'bold';
        dragBtn.style.display = 'flex';
        dragBtn.style.alignItems = 'center';
        dragBtn.style.justifyContent = 'center';
        dragBtn.style.cursor = 'move';
        dragBtn.style.boxShadow = '0px 2px 5px rgba(0,0,0,0.2)';
        dragBtn.style.transition = 'background 0.3s, transform 0.2s';
        dragBtn.onmouseover = () => dragBtn.style.background = '#bbb';
        dragBtn.onmouseleave = () => dragBtn.style.background = '#ccc';
        dragBtn.onmousedown = (e) => {
            dragBtn.style.cursor = 'move';
            this.startDrag(e);
        };
        dragBtn.onmouseup = () => dragBtn.style.cursor = 'move';


        // 只在拖动按钮上触发拖动
        dragBtn.addEventListener('mousedown', (e) => this.startDrag(e));

        popup.appendChild(dragBtn);
        let video
        let img

        if(whatVideo=='video'){
            // 创建视频元素
            video = document.createElement('video');
            video.style.transform = 'scaleX(-1)'; 
            video.style.position='relative'
            video.style.top='30px'
            video.width = '350';
            video.height = '300';
            video.autoplay = true;
            video.playsInline = true;
            video.style.borderRadius = '50px';
        }else if(whatVideo=='img' || whatVideo=='net'){
            img = document.createElement('img')
            img.crossOrigin = "anonymous";  // 允许跨域访问
            img.style.position='relative'
            img.style.top='25px'
            img.width='350'
            img.height='300'
            img.style.transform = "scaleX(-1)";
            // img.style.marginBottom='20px'
            
        }
        

        const canvas = document.createElement('canvas')
        canvas.style.transform = 'scaleX(-1)'; 
        canvas.width='350'
        canvas.height='300'
        canvas.id='show_canvas'
        canvas.style.position = 'absolute'; // 绝对定位
        canvas.style.top = '38px';
        canvas.style.left='12px'
        // canvas.style.pointerEvents = 'none'; // 确保鼠标事件不会影响画布
        // canvas.style.border = '2px solid red'; // 红色 2px 宽的实线边框

       // 创建关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.position = 'absolute';
        closeBtn.style.right = '10px';
        closeBtn.style.top = '10px';
        closeBtn.style.width = '30px';
        closeBtn.style.height = '30px';
        closeBtn.style.border = 'none';
        closeBtn.style.borderRadius = '50%';
        closeBtn.style.background = '#ff5f56'; // 红色i，符合 Mac 风格
        closeBtn.style.color = 'white';
        closeBtn.style.fontSize = '18px';
        closeBtn.style.fontWeight = 'bold';
        closeBtn.style.display = 'flex';
        closeBtn.style.alignItems = 'center';
        closeBtn.style.justifyContent = 'center';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.boxShadow = '0px 2px 5px rgba(0,0,0,0.2)';
        closeBtn.style.transition = 'background 0.3s, transform 0.2s';
        closeBtn.onmouseover = () => closeBtn.style.background = '#e04b42';
        closeBtn.onmouseleave = () => closeBtn.style.background = '#ff5f56';
        closeBtn.onmousedown = () => closeBtn.style.transform = 'scale(0.9)';
        closeBtn.onmouseup = () => closeBtn.style.transform = 'scale(1)';
        closeBtn.onclick = () => this.stopIdent(whatVideo);

        // 创建最小化按钮
        const minimizeBtn = document.createElement('button');
        minimizeBtn.textContent = '−';
        minimizeBtn.style.position = 'absolute';
        minimizeBtn.style.right = '50px';
        minimizeBtn.style.top = '10px';
        minimizeBtn.style.width = '30px';
        minimizeBtn.style.height = '30px';
        minimizeBtn.style.border = 'none';
        minimizeBtn.style.borderRadius = '50%';
        minimizeBtn.style.background = '#fdbc40'; // 黄色，符合 Mac 风格
        minimizeBtn.style.color = 'white';
        minimizeBtn.style.fontSize = '18px';
        minimizeBtn.style.fontWeight = 'bold';
        minimizeBtn.style.display = 'flex';
        minimizeBtn.style.alignItems = 'center';
        minimizeBtn.style.justifyContent = 'center';
        minimizeBtn.style.cursor = 'pointer';
        minimizeBtn.style.boxShadow = '0px 2px 5px rgba(0,0,0,0.2)';
        minimizeBtn.style.transition = 'background 0.3s, transform 0.2s';
        minimizeBtn.onmouseover = () => minimizeBtn.style.background = '#e0a933';
        minimizeBtn.onmouseleave = () => minimizeBtn.style.background = '#fdbc40';
        minimizeBtn.onmousedown = () => minimizeBtn.style.transform = 'scale(0.9)';
        minimizeBtn.onmouseup = () => minimizeBtn.style.transform = 'scale(1)';
        minimizeBtn.onclick = () => this.lowerToBack();

        popup.appendChild(minimizeBtn);

        popup.appendChild(closeBtn);
        if(whatVideo=='video'){
            popup.appendChild(video);
        }else if(whatVideo=='img' ||whatVideo=='net'){
            popup.appendChild(img);
        }
        
        popup.appendChild(canvas)
        document.body.appendChild(popup);

        this.videoPopup = popup;
        this.videoElement = video;
        this.imgElement=img
    }

     // ========== 新增拖动相关方法 ==========
     startDrag(e) {
        this.isDragging = true;
        this.bringToFront();
        
        // 记录初始位置
        this.dragStartX = e.clientX;
        this.dragStartY = e.clientY;
        this.initialPopupX = this.videoPopup.offsetLeft;
        this.initialPopupY = this.videoPopup.offsetTop;

        // 添加全局监听
        document.addEventListener('mousemove', this.handleDrag.bind(this));
        document.addEventListener('mouseup', this.stopDrag.bind(this));
        
        e.preventDefault();
        e.stopPropagation();
    }

    handleDrag(e) {
        if (!this.isDragging) return;
        
        // 计算偏移量
        const deltaX = e.clientX - this.dragStartX;
        const deltaY = e.clientY - this.dragStartY;
        
        // 更新位置
        this.videoPopup.style.left = `${this.initialPopupX + deltaX}px`;
        this.videoPopup.style.top = `${this.initialPopupY + deltaY}px`;
    }

    stopDrag() {
        this.isDragging = false;
        document.removeEventListener('mousemove', this.handleDrag);
        document.removeEventListener('mouseup', this.stopDrag);
    }

    // 新增：提升弹窗层级方法
    bringToFront() {
        if (this.videoPopup) {
            this.videoPopup.style.zIndex = 1000;
        }
    }
    // 新增：降低弹窗层级方法
    lowerToBack() {
        console.log('最小化')
        if (this.videoPopup) {
            this.videoPopup.style.zIndex = -1; // 低于普通页面元素
        }
    }

    // 检测姿势并在视频上绘制
    async detectPoseInRealTime(md,v,c) {
        const canvas = document.getElementById(c);
        const ctx = canvas.getContext('2d');
        // 确保 video 元素已经加载并稳定
        // if (!v || !v.videoWidth || !v.videoHeight) {
        //     return; // 如果视频帧没有加载好，直接跳过当前检测
        // }

        // console.log(v)

        if(this.isCompoterVideo){
            if (!v || !v.videoWidth || !v.videoHeight) {
                return; // 如果视频帧没有加载好，直接跳过当前检测
            }
        }else{
            if (!v || !v.width || !v.height) {
                return; // 如果视频帧没有加载好，直接跳过当前检测
            }
        }

        // console.log('*******************')

        // md.estimateSinglePose(v).then(pose => {
        //     this.POSE = pose;
        //     // 清除canvas
        //     ctx.clearRect(0, 0, canvas.width, canvas.height);
        //     // 画出关键点
        //     pose.keypoints.forEach(keypoint => {
        //         if (keypoint.score > 0.6) {
        //             const x = keypoint.position.x;
        //             const y = keypoint.position.y;

        //             ctx.beginPath();
        //             ctx.arc(x, y, 3, 0, 2 * Math.PI);
        //             ctx.fillStyle = 'rgba(0, 255, 0, 1)';
        //             ctx.fill();  // 填充圆形点
        //         }
        //     });



        // })
        // .catch(error => console.error('姿势检测错误', error));


        // 只检测一个人的姿态
        let poses = await md.estimatePoses(v, { maxPoses: 1 });

        if (poses.length === 0) return;
    
        let pose = poses[0]; // 只取第一个人的数据

        this.POSE = pose;
        console.log(this.POSE)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        // 关键点连接关系（不包括眼睛之间的连线，增加鼻子到肩膀的连线）
        const skeleton = [
            ['leftShoulder', 'rightShoulder'],
            ['leftShoulder', 'leftElbow'], ['leftElbow', 'leftWrist'],
            ['rightShoulder', 'rightElbow'], ['rightElbow', 'rightWrist'],
            ['leftShoulder', 'leftHip'], ['rightShoulder', 'rightHip'],
            ['leftHip', 'rightHip'],
            ['leftHip', 'leftKnee'], ['leftKnee', 'leftAnkle'],
            ['rightHip', 'rightKnee'], ['rightKnee', 'rightAnkle']
        ];
    
        // 画出关键点（跳过耳朵）
        pose.keypoints.forEach(keypoint => {
            if (keypoint.score > 0.75 && !['leftEar', 'rightEar'].includes(keypoint.part)) { //, 'leftEye', 'rightEye'
                const { x, y } = keypoint.position;
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, 2 * Math.PI);
                ctx.fillStyle = 'rgba(0, 255, 0, 1)';
                ctx.fill();
            }
        });
    
        // 画骨架连线
        ctx.strokeStyle = '#c4ebe3';
        ctx.lineWidth = 2;
        skeleton.forEach(([partA, partB]) => {
            const pointA = pose.keypoints.find(k => k.part === partA);
            const pointB = pose.keypoints.find(k => k.part === partB);
    
            if (pointA && pointB && pointA.score > 0.75 && pointB.score > 0.75) {
                const dx = pointB.position.x - pointA.position.x;
                const dy = pointB.position.y - pointA.position.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
    
                if (distance < 150) { // 限制最大连线长度，防止误连
                    ctx.beginPath();
                    ctx.moveTo(pointA.position.x, pointA.position.y);
                    ctx.lineTo(pointB.position.x, pointB.position.y);
                    ctx.stroke();
                }
            }

        })
    }

    // 检测姿势并在视频上绘制
    async detectGestureInRealTime(md,v,c) {
        const canvas = document.getElementById(c);
        const ctx = canvas.getContext('2d');

        const hands = await md.estimateHands(v);
        if (hands.length > 0) {
            hands.forEach(hand => {
                this.POSE = hand;
                ctx.clearRect(0, 0, canvas.width, canvas.height);  // 清空画布

                let videoWidth
                let videoHeight
                // 获取视频流和画布的宽高
                if(this.isCompoterVideo){
                    videoWidth = v.videoWidth;
                    videoHeight = v.videoHeight;
                }else{
                    videoWidth = v.width;
                    videoHeight = v.height;
                }
                
                const canvasWidth = canvas.width;
                const canvasHeight = canvas.height;

                // 缩放比例，基于视频流和画布大小适配
                const scaleX = canvasWidth / videoWidth;
                const scaleY = canvasHeight / videoHeight;

                // 画出手部关键点
                hand.landmarks.forEach((landmark, index) => {
                    // 跳过每个手指的第二个关键点 (i*4 + 1)
                    if (index % 4 === 3) return;  // 跳过手指的第二个关键点
                    // 缩放坐标
                    const adjustedX = landmark[0] * scaleX;
                    const adjustedY = landmark[1] * scaleY;

                    // 设置关键点的大小
                    const pointSize = 3;

                    // 绘制关键点
                    ctx.beginPath();
                    ctx.fillStyle = 'rgba(63, 220, 210, 1)';  // 关键点颜色
                    ctx.arc(adjustedX, adjustedY, pointSize, 0, 2 * Math.PI);
                    ctx.fill();
                });

                // 绘制手指骨骼连线
                this.connections.forEach(([startIdx, endIdx]) => {
                    const start = hand.landmarks[startIdx];
                    const end = hand.landmarks[endIdx];

                    // 缩放后绘制连线
                    const adjustedStartX = start[0] * scaleX;
                    const adjustedStartY = start[1] * scaleY;
                    const adjustedEndX = end[0] * scaleX;
                    const adjustedEndY = end[1] * scaleY;

                    ctx.beginPath();
                    ctx.moveTo(adjustedStartX, adjustedStartY);
                    ctx.lineTo(adjustedEndX, adjustedEndY);
                    ctx.strokeStyle = 'white';  // 线条颜色
                    ctx.lineWidth = 2;
                    ctx.stroke();
                });
            });
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);  // 清空画布
        }
    }

    /*展示区实时显示数据*/
    show_value(model){

        //sendData=[]
        this.result = this.predictPose(this.POSE,model);
        //所有数据刷新
        if(this.classInfo.length>0){
            for(let i=0;i<this.classInfo[0].length;i++){//
                document.getElementById('bar'+this.classInfo[0][i]).style.width=`${(this.result[0][this.classInfo[0][i]]*100).toFixed(0)}%`
                document.getElementById('bar'+this.classInfo[0][i]).innerHTML=`${(this.result[0][this.classInfo[0][i]]*100).toFixed(0)}%`
            }
        }
        
    }

    /*展示区实时显示数据*/
    show_gesture_value(model){
        // if(!isTrain) return;

        //sendData=[]
        this.result = this.predictGesture(this.POSE,model);
        if(this.classInfo.length>0){
            for(let i=0;i<this.classInfo[0].length;i++){//
                document.getElementById('bar'+this.classInfo[0][i]).style.width=`${(this.result[0][this.classInfo[0][i]]*100).toFixed(0)}%`
                document.getElementById('bar'+this.classInfo[0][i]).innerHTML=`${(this.result[0][this.classInfo[0][i]]*100).toFixed(0)}%`
            }
        }
    }

    async startIdent(){
        if(this.isRobotVideo || this.isNetCamera){
            alert('请先关闭机器人摄像头')
            return
        }
        this.isCompoterVideo=true
          // 如果弹窗已存在但被隐藏，直接提升层级
        if (this.videoPopup) {
            this.bringToFront();
        } else {
            this.createVideoPopup('video');
            // 获取视频流并绑定到video元素
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            this.videoElement.srcObject = stream;
            this.whatCamera='video'
            const allStorage = Object.entries(localStorage).reduce((acc, [key, value]) => {
                acc[key] = value;
                return acc;
            }, {});
            console.log(allStorage)
            // this.runtime.ioDevices.video.enableVideo()
    
            const value=document.createElement('div')
            document.getElementById('popup').appendChild(value)
            if(this.classInfo.length>0){
                for(let i=0;i<this.classInfo[0].length;i++){
                    let rowDiv = document.createElement('div'); // 新增容器，作为一行
                    rowDiv.style.display = 'flex'; // 让子元素水平排列
                    rowDiv.style.alignItems = 'center'; // 垂直居中对齐
                    rowDiv.style.marginBottom = '10px'; // 增加行间距
    
                    let span = document.createElement('span');
                    span.id = 'value' + this.classInfo[0][i];
                    span.innerText = this.classInfo[1][i];
                    span.style.width = '20%'; // 让 span 占一部分宽度，保持对齐
                    span.style.textAlign = 'right'; // 让文本右对齐
                    span.style.marginRight = '10px'; // 与进度条之间添加间距
    
                    let barCon = document.createElement('div');
                    barCon.style.width = '60%';
                    barCon.style.backgroundColor = '#eee';
                    barCon.style.border = '1px solid #ddd';
                    barCon.style.borderRadius = '5px';
                    barCon.style.overflow = 'hidden';
                    barCon.style.margin = '10px 0'; // 只设置上下间距
                    barCon.id = 'barCon' + this.classInfo[0][i];
    
                    let bar = document.createElement('div');
                    bar.style.width = '0';
                    bar.style.height = '18px';
                    bar.style.backgroundColor = '#38ceb1';
                    bar.style.textAlign = 'center';
                    bar.style.lineHeight = '18px'; // 让文本垂直居中
                    bar.style.color = 'white';
                    bar.style.borderRadius = '20px';
                    // bar.style.transition = 'width 1s ease';
                    bar.id = 'bar' + this.classInfo[0][i];
    
                    barCon.appendChild(bar);
                    
                    rowDiv.appendChild(span); // 将 span 添加到同一行
                    rowDiv.appendChild(barCon); // 将 barCon 也放入同一行
    
                    value.appendChild(rowDiv); // 将当前行的容器添加到主容器中
                    
                }
            }
            
           
    
    
            
    
            const model = await tf.loadLayersModel('localstorage://'+this.modelName);
            if(this.whatModel=='image'){
                this.timer=setInterval(async()=>{
                    // console.log(this.predict(this.videoElement,model))
                    this.result=await this.predict(this.videoElement,model)
                    // console.log(result)
                    if(this.classInfo.length>0){
                        for(let i=0;i<this.classInfo[0].length;i++){
                            document.getElementById('bar'+this.classInfo[0][i]).style.width=`${(this.result[0][this.classInfo[0][i]]*100).toFixed(0)}%`
                            document.getElementById('bar'+this.classInfo[0][i]).innerHTML=`${(this.result[0][this.classInfo[0][i]]*100).toFixed(0)}%`
                        }
                    }
                    
                },100)
            }else if(this.whatModel=='pose'){
                this.timer = setInterval(() => {
                    this.detectPoseInRealTime(this.poseNetmode,this.videoElement,'show_canvas');
                    this.show_value(model);
                }, 200); // 10 FPS
            }else if(this.whatModel=='gesture'){
                this.timer = setInterval(() => {
                    this.detectGestureInRealTime(this.poseNetmode,this.videoElement,'show_canvas');
                    this.show_gesture_value(model);
                }, 200); // 10 FPS
            }
        }
        
       
    }

    async stopIdent(a){

        this.runtime.stopAll();
        console.log(a)
         // 关闭弹窗
         if (this.videoPopup) {
            
            document.body.removeChild(this.videoPopup);
            this.videoPopup = null;
        }

        if(this.whatCamera=='video' || a=='video' || !a){
            this.isCompoterVideo=false
            // 停止视频流
            if (this.videoElement && this.videoElement.srcObject) {
                        
                this.videoElement.srcObject.getTracks().forEach(track => track.stop());
            }
        }else if(this.whatCamera=='img' || a=='img'){
            this.isRobotVideo=false
            let jsonData={
                "command":"camera",
                "params":{
                    "mode":0
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
            await new Promise(resolve => setTimeout(resolve, 1000));  
    
            socket.setLastPostTime(Date.now())
            // 停止视频流
            if (this.imgElement && this.imgElement.src) {
                this.imgElement.src=''
                // this.videoElement.srcObject.getTracks().forEach(track => track.stop());
            }
        }else if(this.whatCamera=='net' || a=='net'){
            this.isNetCamera=false
             // 停止视频流
            if (this.imgElement && this.imgElement.src) {
                this.imgElement.src=''
                // this.videoElement.srcObject.getTracks().forEach(track => track.stop());
            }
        }
        this.whatCamera==''
        
        // this.runtime.ioDevices.video.disableVideo();
        clearInterval(this.timer)
    }


    async startImgIdent(){
        if(this.isCompoterVideo || this.isNetCamera){
            alert('请先关闭电脑摄像头')
            return
        }
        this.isRobotVideo=true
        // 如果弹窗已存在但被隐藏，直接提升层级
        if (this.videoPopup) {
            this.bringToFront();
        } else {
            this.createVideoPopup('img');

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
                let context=[]
                context.push(str)
                await socket.setSocket(context)
            }else if(socket.checkWebSocketStatus()==2){
                socket.getSocket().send(str);
            }
            await new Promise(resolve => setTimeout(resolve, 1000));  

            socket.setLastPostTime(Date.now())
            this.whatCamera='img'
            const timestamp = new Date().getTime();
            this.imgElement.src = `http://${socket.getIp()}:8081/video_feed?${timestamp}`; 
            // this.imgElement.onload=function(){
            //     this.imgElement.width='100'
            //     this.imgElement.height='100'
            // }

            const allStorage = Object.entries(localStorage).reduce((acc, [key, value]) => {
                acc[key] = value;
                return acc;
            }, {});
            console.log(allStorage)
            // this.runtime.ioDevices.video.enableVideo()

            const value=document.createElement('div')
            value.style.marginTop='20px'
            document.getElementById('popup').appendChild(value)
            if(this.classInfo.length>0){
                for(let i=0;i<this.classInfo[0].length;i++){
                    let rowDiv = document.createElement('div'); // 新增容器，作为一行
                    rowDiv.style.display = 'flex'; // 让子元素水平排列
                    rowDiv.style.alignItems = 'center'; // 垂直居中对齐
                    rowDiv.style.marginBottom = '10px'; // 增加行间距

                    let span = document.createElement('span');
                    span.id = 'value' + this.classInfo[0][i];
                    span.innerText = this.classInfo[1][i];
                    span.style.width = '20%'; // 让 span 占一部分宽度，保持对齐
                    span.style.textAlign = 'right'; // 让文本右对齐
                    span.style.marginRight = '10px'; // 与进度条之间添加间距

                    let barCon = document.createElement('div');
                    barCon.style.width = '60%';
                    barCon.style.backgroundColor = '#eee';
                    barCon.style.border = '1px solid #ddd';
                    barCon.style.borderRadius = '5px';
                    barCon.style.overflow = 'hidden';
                    barCon.style.margin = '10px 0'; // 只设置上下间距
                    barCon.id = 'barCon' + this.classInfo[0][i];

                    let bar = document.createElement('div');
                    bar.style.width = '0';
                    bar.style.height = '18px';
                    bar.style.backgroundColor = '#38ceb1';
                    bar.style.textAlign = 'center';
                    bar.style.lineHeight = '18px'; // 让文本垂直居中
                    bar.style.color = 'white';
                    bar.style.borderRadius = '20px';
                    // bar.style.transition = 'width 1s ease';
                    bar.id = 'bar' + this.classInfo[0][i];

                    barCon.appendChild(bar);
                    
                    rowDiv.appendChild(span); // 将 span 添加到同一行
                    rowDiv.appendChild(barCon); // 将 barCon 也放入同一行

                    value.appendChild(rowDiv); // 将当前行的容器添加到主容器中
                    
                }
            }
            
        


            

            const model = await tf.loadLayersModel('localstorage://'+this.modelName);
            if(this.whatModel=='image'){
                this.timer=setInterval(async()=>{
                    // console.log(this.predict(this.videoElement,model))
                    this.result=await this.predict(this.imgElement,model)
                    // console.log(result)
                    if(this.classInfo.length>0){
                        for(let i=0;i<this.classInfo[0].length;i++){
                            document.getElementById('bar'+this.classInfo[0][i]).style.width=`${(this.result[0][this.classInfo[0][i]]*100).toFixed(0)}%`
                            document.getElementById('bar'+this.classInfo[0][i]).innerHTML=`${(this.result[0][this.classInfo[0][i]]*100).toFixed(0)}%`
                        }
                    }
                    
                },100)
            }else if(this.whatModel=='pose'){
                const canvasImg=document.createElement('canvas')
                const ctxImg=canvasImg.getContext('2d')
                canvasImg.width=this.imgElement.width;
                canvasImg.height=this.imgElement.height
                this.timer = setInterval(() => {
                     // 清空 canvas
                     ctxImg.clearRect(0, 0, canvas.width, canvas.height);

                    // 将 img 画到 canvas 上
                    // ctxImg.drawImage(this.imgElement, 0, 0, img.width, img.height);
                    this.detectPoseInRealTime(this.poseNetmode,this.imgElement,'show_canvas');
                    this.show_value(model);
                }, 200); // 10 FPS
            }else if(this.whatModel=='gesture'){
                this.timer = setInterval(() => {
                    this.detectGestureInRealTime(this.poseNetmode,this.imgElement,'show_canvas');
                    this.show_gesture_value(model);
                }, 200); // 10 FPS
            }
        }
    }

    async stopImgIdent(){
        this.isRobotVideo=false
        // 关闭弹窗
        if (this.videoPopup) {
                    
            document.body.removeChild(this.videoPopup);
            this.videoPopup = null;
        }
        let jsonData={
            "command":"camera",
            "params":{
                "status":0
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
        await new Promise(resolve => setTimeout(resolve, 1000));  

        socket.setLastPostTime(Date.now())
        // 停止视频流
        if (this.imgElement && this.imgElement.src) {
            this.imgElement.src=''
            // this.videoElement.srcObject.getTracks().forEach(track => track.stop());
        }
        // this.runtime.ioDevices.video.disableVideo();
        clearInterval(this.timer)
    }




    async startNetIdent(){
        if(this.isCompoterVideo || this.isRobotVideo){
            alert('请先关闭电脑摄像头')
            return
        }
        
        // 如果弹窗已存在但被隐藏，直接提升层级
        let ip = await new Promise(resolve => {
            resolve(prompt('请输入ip'));
        });
        if(!ip) return
        if (this.videoPopup) {
            this.bringToFront();
        } else {
            this.createVideoPopup('net');

            const timestamp = new Date().getTime();
            this.imgElement.src = `http://${ip}:81/stream`; 
            this.whatCamera='net'
            this.imgElement.onload=async function(){
                // this.imgElement.width='100'
                // this.imgElement.height='100'
                this.isNetCamera=true

                const allStorage = Object.entries(localStorage).reduce((acc, [key, value]) => {
                    acc[key] = value;
                    return acc;
                }, {});
                console.log(allStorage)
                // this.runtime.ioDevices.video.enableVideo()

                const value=document.createElement('div')
                value.style.marginTop='20px'
                document.getElementById('popup').appendChild(value)
                if(this.classInfo.length>0){
                    for(let i=0;i<this.classInfo[0].length;i++){
                        let rowDiv = document.createElement('div'); // 新增容器，作为一行
                        rowDiv.style.display = 'flex'; // 让子元素水平排列
                        rowDiv.style.alignItems = 'center'; // 垂直居中对齐
                        rowDiv.style.marginBottom = '10px'; // 增加行间距

                        let span = document.createElement('span');
                        span.id = 'value' + this.classInfo[0][i];
                        span.innerText = this.classInfo[1][i];
                        span.style.width = '20%'; // 让 span 占一部分宽度，保持对齐
                        span.style.textAlign = 'right'; // 让文本右对齐
                        span.style.marginRight = '10px'; // 与进度条之间添加间距

                        let barCon = document.createElement('div');
                        barCon.style.width = '60%';
                        barCon.style.backgroundColor = '#eee';
                        barCon.style.border = '1px solid #ddd';
                        barCon.style.borderRadius = '5px';
                        barCon.style.overflow = 'hidden';
                        barCon.style.margin = '10px 0'; // 只设置上下间距
                        barCon.id = 'barCon' + this.classInfo[0][i];

                        let bar = document.createElement('div');
                        bar.style.width = '0';
                        bar.style.height = '18px';
                        bar.style.backgroundColor = '#38ceb1';
                        bar.style.textAlign = 'center';
                        bar.style.lineHeight = '18px'; // 让文本垂直居中
                        bar.style.color = 'white';
                        bar.style.borderRadius = '20px';
                        // bar.style.transition = 'width 1s ease';
                        bar.id = 'bar' + this.classInfo[0][i];

                        barCon.appendChild(bar);
                        
                        rowDiv.appendChild(span); // 将 span 添加到同一行
                        rowDiv.appendChild(barCon); // 将 barCon 也放入同一行

                        value.appendChild(rowDiv); // 将当前行的容器添加到主容器中
                        
                    }
                }
                
            


                

                const model = await tf.loadLayersModel('localstorage://'+this.modelName);
                if(this.whatModel=='image'){
                    this.timer=setInterval(async()=>{
                        // console.log(this.predict(this.videoElement,model))
                        this.result=await this.predict(this.imgElement,model)
                        // console.log(result)
                        if(this.classInfo.length>0){
                            for(let i=0;i<this.classInfo[0].length;i++){
                                document.getElementById('bar'+this.classInfo[0][i]).style.width=`${(this.result[0][this.classInfo[0][i]]*100).toFixed(0)}%`
                                document.getElementById('bar'+this.classInfo[0][i]).innerHTML=`${(this.result[0][this.classInfo[0][i]]*100).toFixed(0)}%`
                            }
                        }
                        
                    },100)
                }else if(this.whatModel=='pose'){
                    const canvasImg=document.createElement('canvas')
                    const ctxImg=canvasImg.getContext('2d')
                    canvasImg.width=this.imgElement.width;
                    canvasImg.height=this.imgElement.height
                    this.timer = setInterval(() => {
                        // 清空 canvas
                        ctxImg.clearRect(0, 0, canvasImg.width, canvasImg.height);

                        // 将 img 画到 canvas 上
                        // ctxImg.drawImage(this.imgElement, 0, 0, this.imgElement.width, this.imgElement.height);
                        this.detectPoseInRealTime(this.poseNetmode,this.imgElement,'show_canvas');
                        this.show_value(model);
                    }, 200); // 10 FPS
                }else if(this.whatModel=='gesture'){
                    this.timer = setInterval(() => {
                        this.detectGestureInRealTime(this.poseNetmode,this.imgElement,'show_canvas');
                        this.show_gesture_value(model);
                    }, 200); // 10 FPS
                }
            }

            
        }
    }

    async stopNetIdent(){
        this.isNetCamera=false
        // 关闭弹窗
        if (this.videoPopup) {
                    
            document.body.removeChild(this.videoPopup);
            this.videoPopup = null;
        }
        
        // 停止视频流
        if (this.imgElement && this.imgElement.src) {
            this.imgElement.src=''
            // this.videoElement.srcObject.getTracks().forEach(track => track.stop());
        }
        // this.runtime.ioDevices.video.disableVideo();
        clearInterval(this.timer)
    }

    resultBlock(args){
        
        // console.log((this.result[0][args.ONE]*100).toFixed(0))
        // alert('执行了')
        if(!this.isCompoterVideo && !this.isRobotVideo && !this.isNetCamera){
            this.startIdent()
        }
        if(this.result && (this.result[0][args.ONE]*100).toFixed(0)>70){
            return true
        }
        return false
    }

    confidenceBlock(args){
        if(!this.isCompoterVideo && !this.isRobotVideo && !this.isNetCamera){
            this.startIdent()
        }
        return (this.result[0][args.ONE]*100).toFixed(0)
    }

    getConnectedSensors(){
        let item=[{
            text: formatMessage({
                id: 'robotteachable.getConnectedSensorsSelect',
                default: 'Please select',
                description: 'robotteachable.getConnectedSensorsSelect'
            }),
            value:'请选择'
        }];
        if(this.classInfo && this.classInfo.length > 0 && Array.isArray(this.classInfo[0])){
            console.log('新菜单')
            // item=[]
            for(let i=0;i<this.classInfo[0].length;i++){
                let content={
                    text: formatMessage({
                        id: 'robotteachable.getConnectedSensors',
                        default: this.classInfo[1][i],
                        description: 'robotteachable.getConnectedSensors'
                    },{ index: this.classInfo[1][i] }),
                    value:`${this.classInfo[0][i]}`
                }
                item.push(content)
            }
        }else{
            console.log('旧菜单')
            item=[]
            item.push({
                 text: formatMessage({
                    id: 'robotteachable.getConnectedSensorsDefault',
                    default: 'No options available',
                    description: 'robotteachable.getConnectedSensorsDefault'
                }),
                value:'暂无可选项'
            })
        }

        console.log(item)
        
        return item

    }


    readLocalJsonFile(callback) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = () => {
            const file = input.files[0];
            if (!file) return;

            const reader = new FileReader();

            reader.onload = () => {
            try {
                const data = JSON.parse(reader.result);
                callback(null, data);
            } catch (err) {
                callback(err, null);
            }
            };

            reader.onerror = () => {
            callback(reader.error, null);
            };

            reader.readAsText(file);
        };

        input.click(); // 自动触发文件选择对话框
        }


    saveModelToLocalStorage(modelJson, modelName = 'tensorflowjs_models/test') {
        if (!modelJson) {
            console.error('无效的模型 JSON 数据');
            return;
        }

        try {
            const {
                info,
                modelMetadata,
                modelTopology,
                weightData,
                weightSpecs
            } = modelJson;

            // 将每个部分写入 localStorage，前缀使用 test/...
            localStorage.setItem(`${modelName}/info`, info);
            localStorage.setItem(`${modelName}/model_metadata`, modelMetadata);
            localStorage.setItem(`${modelName}/model_topology`, modelTopology);
            localStorage.setItem(`${modelName}/weight_data`, weightData);
            localStorage.setItem(`${modelName}/weight_specs`, weightSpecs);

            const allStorage = Object.entries(localStorage).reduce((acc, [key, value]) => {
                acc[key] = value;
                return acc;
            }, {});
            console.log(allStorage)
            // this.channelModelName.postMessage('test')
            this.modelName='test'
            this.classInfo=[modelJson.labelClass,modelJson.class]
            console.log(this.classInfo)
             const specsStr = typeof weightSpecs === 'string' ? weightSpecs : JSON.stringify(weightSpecs);
            if (specsStr.includes('[63,128]')) {
            this.whatModel = 'gesture';
            } else if (specsStr.includes('[1001,2]')) {
            this.whatModel = 'image';
            } else if (specsStr.includes('[51,128]')) {
            this.whatModel = 'pose';
            } else {
            this.whatModel = 'unknown';
            }

            if(this.poseNetmode && typeof this.poseNetmode.dispose ==='function'){
                this.poseNetmode.dispose()
            }
            
            if(this.whatModel=='image'){
                this.channelLoad.postMessage(true)
                tf.ready().then(() => {
                    console.log("使用后端: ", tf.getBackend());//获取当前 TensorFlow.js 所使用的计算后端
                    tf.setBackend('webgl').then(() => {//切换后端
                        console.log("切换到webgl后端.");
                        this.loadMobilenet()
                    });
                });
            }else if(this.whatModel=='pose'){
                this.channelLoad.postMessage(true)
                tf.ready().then(() => {
                    console.log("使用后端: ", tf.getBackend());//获取当前 TensorFlow.js 所使用的计算后端
                    tf.setBackend('webgl').then(() => {//切换后端
                        console.log("切换到webgl后端.");
                        this.loadPoseMode()
                    });
                });
            }else if(this.whatModel=='gesture'){
                this.channelLoad.postMessage(true)
                tf.ready().then(() => {
                    console.log("使用后端: ", tf.getBackend());//获取当前 TensorFlow.js 所使用的计算后端
                    tf.setBackend('webgl').then(() => {//切换后端
                        console.log("切换到webgl后端.");
                        this.loadGestureMode()
                    });
                });
            }

            console.log('模型数据已保存至 localStorage');
        } catch (err) {
            console.error('保存模型到 localStorage 时出错:', err);
        }
    }

    importModel(){
        this.readLocalJsonFile((err, data) => {
            if (err) {
                alert('读取失败: ' + err.message);
            } else {
                console.log('读取成功:', data);
                this.saveModelToLocalStorage(data);
            }
        });
    }

}


module.exports = robotteachable;
