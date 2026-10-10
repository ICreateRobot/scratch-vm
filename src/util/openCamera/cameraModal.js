const jsQR = require('jsqr');  // 引入 jsQR 库
const aiInfo = require('../aiInfo.js')

const Comlink = require('../model/comlink.js')
// const cv = require('../model/opencv1')
let cv

const cocoSsd = require('../model/coco-ssd')
const tfjs = require('../model/tfjs.js')

const imageLoad = require('../imageLoad.js');
const { createElement } = require('react');
let THIS;
let handLandmarker;
const HAND_CONNECTIONS = [

// 拇指
[0, 1],
[1, 2],
[2, 3],
[3, 4],

// 食指
[0, 5],
[5, 6],
[6, 7],
[7, 8],

// 中指
[0, 9],
[9, 10],
[10, 11],
[11, 12],

// 无名指
[0, 13],
[13, 14],
[14, 15],
[15, 16],

// 小指
[0, 17],
[17, 18],
[18, 19],
[19, 20],

// 手掌
[5, 9],
[9, 13],
[13, 17]
];

let poseLandmarker;


// ========================================
// 需要绘制的姿态关键点
// ========================================

const POSE_DRAW_POINTS = [
    0,  // 鼻子
    2,  // 左眼
    5,  // 右眼

    11, // 左肩
    12, // 右肩

    13, // 左肘
    14, // 右肘

    15, // 左手腕
    16, // 右手腕

    23, // 左髋
    24, // 右髋

    25, // 左膝
    26, // 右膝

    27, // 左脚踝
    28  // 右脚踝
];


// ========================================
// 姿态骨骼连接
// ========================================

const POSE_CONNECTIONS = [

    // 头部
    [0, 2],
    [0, 5],

    // 肩膀
    [11, 12],

    // 左手
    [11, 13],
    [13, 15],

    // 右手
    [12, 14],
    [14, 16],

    // 左身体
    [11, 23],

    // 右身体
    [12, 24],

    // 髋部
    [23, 24],

    // 左腿
    [23, 25],
    [25, 27],

    // 右腿
    [24, 26],
    [26, 28]
];

class CameraModal {
  constructor() {
    THIS=this
    this.modal = null;
    this.videoType = 'local'; // or 'remote'
    this.remoteUrl = '';
    this.stream = null;
    this.mirror = false;


    this.canvas = document.createElement('canvas');
    this.canvasCtx = this.canvas.getContext('2d');
    this.isQRDetectionActive = false;
    this.qrRequestId = null;
    this.onQRDetected = null; // 外部传入回调

    this.channelLoad = new BroadcastChannel('isLoading');

    this.channelCloseDialog = new BroadcastChannel('close-dialog')
    this.canvasImg=document.createElement('canvas')
    this.canvasImgCtx=this.canvasImg.getContext('2d')


    this.isAprilTagActive=false
    this.detections=[]
    this.imgSaveRequested=0;
    


    this.isColorDetectionActive = false;

    this.isGestureActive=false
    this.isPoseActive = false



    // OpenCV相关的变量
      this.src = null;
      this.dst = null;
      this.gray = null;
      this.cap = null;
      this.faces = null;
      this.classifier = null;
      this.FPS = 15;
      this.faceDatabase = []; // 存储学习的人脸数据
      this.labels = []; // 存储每个人脸的标签
      this.faceCascade=null
      this.faceskinId=null
      this.faceDrawableId=null
      this.renderer=null
      this.faceNum=0
      this.srcMat=null
      this.grayMat=null
      this.processVideoTimeout=null


      //物体识别相关变量
      this.cocomodel=null
      this.isStartObject=false
      this.isProcessingFrame=false
      this.preObject=''
      this.classNames = {
          "person": "人",
          "bicycle": "自行车",
          "car": "汽车",
          "motorcycle": "摩托车",
          "airplane": "飞机",
          "bus": "公交车",
          "train": "火车",
          "truck": "卡车",
          "boat": "船",
          "traffic light": "红绿灯",
          "fire hydrant": "消防栓",
          "stop sign": "停止标志",
          "parking meter": "停车表",
          "bench": "长椅",
          "bird": "鸟",
          "cat": "猫",
          "dog": "狗",
          "horse": "马",
          "sheep": "羊",
          "cow": "牛",
          "elephant": "大象",
          "bear": "熊",
          "zebra": "斑马",
          "giraffe": "长颈鹿",
          "hat": "帽子",
          "backpack": "背包",
          "umbrella": "雨伞",
          "handbag": "手袋",
          "tie": "领带",
          "suitcase": "行李箱",
          "frisbee": "飞盘",
          "skis": "滑雪板",
          "snowboard": "滑雪板",
          "sports ball": "体育球",
          "kite": "风筝",
          "baseball bat": "棒球棒",
          "baseball glove": "棒球手套",
          "skateboard": "滑板",
          "surfboard": "冲浪板",
          "tennis racket": "网球拍",
          "bottle": "瓶子",
          "wine glass": "葡萄酒杯",
          "cup": "杯子",
          "fork": "叉子",
          "knife": "刀",
          "spoon": "勺子",
          "bowl": "碗",
          "banana": "香蕉",
          "apple": "苹果",
          "sandwich": "三明治",
          "orange": "橙子",
          "broccoli": "西兰花",
          "carrot": "胡萝卜",
          "hot dog": "热狗",
          "pizza": "比萨",
          "donut": "甜甜圈",
          "cake": "蛋糕",
          "chair": "椅子",
          "couch": "沙发",
          "potted plant": "盆栽植物",
          "bed": "床",
          "dining table": "餐桌",
          "toilet": "马桶",
          "tv": "电视",
          "laptop": "笔记本电脑",
          "mouse": "鼠标",
          "remote": "遥控器",
          "keyboard": "键盘",
          "cell phone": "手机",
          "microwave": "微波炉",
          "oven": "烤箱",
          "toaster": "烤面包机",
          "sink": "水槽",
          "refrigerator": "冰箱",
          "book": "书",
          "clock": "钟",
          "vase": "花瓶",
          "scissors": "剪刀",
          "teddy bear": "泰迪熊",
          "hair drier": "吹风机"
      };

      //手势识别相关变量
      this.model = null;
      // this.handTrack = window.handTrack;
      this.isGestureDetectionActive = false;
      this.pose=['手掌张开','拳头']
      this.preGesture=''
      this.detectionParams = {
          flipHorizontal: true, // 镜像翻转
          maxNumBoxes: 1,       // 最多检测的手势数
          scoreThreshold: 0.7   // 置信度阈值，值越低越容易检测到
      };

      //颜色追踪变量
      this.lower_blue;
      this.upper_blue;
      this.capColor;
      this.isColorBlockDetectionActive=false
      this.lower_red1;
      this.upper_red1;
      this.lower_yellow;
      this.upper_yellow;
      this.lower_green;
      this.upper_green;
      this.lower_black;
      this.upper_black;
      this.lower_white;
      this.upper_white


      this.colorGrid = Array.from({ length: 6 }, () => Array(8).fill('#000000')); // 初始化为黑色
      //人脸识别变量

      this.detecting = false;//检测状态
      this.faceMatcher;

      this.labeledDescriptors = [];

      this.tempCanvas = document.createElement('canvas');
      this.tempCtx = this.tempCanvas.getContext('2d');
      this.displaySize;

      this.maxFace
      this.FRAME
      this.allFace

      this.faceImage

      this.modelClass={
          qr:false,
          gesture:false,
          face:false,
          imaclassifer:false
      }

      this.modelTraffic=null
      this.timerTraffic=null



      this.isColorPlaceDetectionActive = false;
      this._loadingCV=null
      window._loadingCV=null

  }
    insertStyle() {
        if (document.getElementById('camera-style')) return;

        const style = document.createElement('style');
        style.id = 'camera-style';
        style.innerHTML = `
       .camera-modal {
        width: 600px;
        height: 500px;
        position: fixed;
        top: 100px;
        left: 100px;
        background: #ffffff;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        border-radius: 10px;
        overflow: hidden;
        font-family: 'Segoe UI', sans-serif;
        border: 1px solid rgb(157, 253, 235);
        resize: both;
        overflow: auto;
    }

    .camera-header {
        height: 42px;
        background:rgb(89, 246, 227);
        color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 12px;
        font-weight: bold;
        user-select: none;
        cursor: move;
        z-index: 100;
    }

    .camera-title {
        font-size: 16px;
    }

    .camera-close {
        cursor: pointer;
        font-size: 20px;
        font-weight: normal;
        transition: color 0.2s;
    }

    .camera-close:hover {
        color: #ffdddd;
    }

    .camera-body {
        width: 100%;
        height: calc(100% - 42px);
        background: #e9f1ff;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .camera-body video,
    .camera-body img,
    .camera-body canvas{
        width: 100%;
        height: 100%;
        border-radius: 6px;
        // background: black;
    }
        `;
        document.head.appendChild(style);
    }

  createModal() {

    
    this.insertStyle()
    this.modal = document.createElement('div');
    this.modal.className = 'camera-modal';
    this.modal.innerHTML = `
      <div class="camera-header">
        <span class="camera-title">摄像头预览</span>
        <span class="camera-close">×</span>
      </div>
      <div class="camera-body">
        <video autoplay playsinline></video>
        <img style="display: none;" />
      </div>
    `;
    document.body.appendChild(this.modal);

    this.makeDraggable(this.modal);
    this.modal.querySelector('.camera-close').onclick = () => this.close();

    this.canvas.style.position = 'absolute';
    this.canvas.style.pointerEvents = 'none';
    // this.canvas.style.top = 0;
    // this.canvas.style.left = 0;
    this.canvas.style.zIndex = 2;
    // this.canvas.style.width = '80%';
    // this.canvas.style.height = '80%';
    // this.canvas.style.border = '2px dashed red';
    const body = this.modal.querySelector('.camera-body');
    body.style.position = 'relative';
    body.appendChild(this.canvas);
  }

  setMirror(isMirror) {
    this.mirror = !!isMirror;
    }
  getMirror(){
    return this.mirror
  }


  makeDraggable(el) {
    const header = el.querySelector('.camera-header');
    let isDragging = false, offsetX = 0, offsetY = 0;

    header.onmousedown = (e) => {
      isDragging = true;
      offsetX = e.clientX - el.offsetLeft;
      offsetY = e.clientY - el.offsetTop;
      document.onmousemove = (e) => {
        if (isDragging) {
          el.style.left = e.clientX - offsetX + 'px';
          el.style.top = e.clientY - offsetY + 'px';
        }
      };
      document.onmouseup = () => {
        isDragging = false;
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  }


  checkPort(url) {
      try {
          const parsedUrl = new URL(url);
          const port = parsedUrl.port || (parsedUrl.protocol === 'https:' ? '443' : '80');

          if (port === '8081') return '8081';
          if (port === '81') return '81';
          return port;
      } catch (e) {
          return;
      }
  }
  async open() {
    if (this.modal) this.close();
    this.createModal();

    const video = this.modal.querySelector('video');
    const img = this.modal.querySelector('img');

    if (this.videoType === 'local') {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = this.stream;
        video.style.display = 'block';
        img.style.display = 'none';

        // 是否镜像
        video.style.transform = this.mirror ? 'scaleX(-1)' : 'scaleX(1)';
      } catch (e) {
        alert('无法访问本地摄像头：' + e.message);
      }
    } else if (this.videoType === 'remote' && this.remoteUrl) {
      img.src = this.remoteUrl;
      img.crossOrigin = "anonymous";
      img.style.display = 'block';
      video.style.display = 'none';

      let timer=setTimeout(() => {

        if(this.checkPort(this.remoteUrl)=='8081'){
             if(!imageLoad.getIsImage()){
                alert("加载超时，请检查网络或摄像头状态！");
                this.channelLoad.postMessage(false)
                this.close()
             }
        }else{
            if(!imageLoad.getIsK210()){
                alert("加载超时，请检查网络或摄像头状态！");
                this.channelLoad.postMessage(false)
                this.close()
             }
        }
         
          
      }, 5000);
      img.onload=()=>{
        clearTimeout(timer)
        
        this.channelLoad.postMessage(false)
        if(this.checkPort(this.remoteUrl)=='8081'){
          imageLoad.setIsImage(true)
          imageLoad.setDialog('robotImg')
        }else{
          imageLoad.setIsK210(true)
          imageLoad.setDialog('netImg')
        }
        
      }

       // 是否镜像远程图像
        img.style.transform = this.mirror ? 'scaleX(-1)' : 'scaleX(1)';
    }
  }

  close() {
    console.log('closeclose')
    this.channelCloseDialog.postMessage('close')
    if (this.modal) {
      const img = this.modal.querySelector('img');
      if (img) img.src = '';
      this.modal.remove();
      this.modal = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }


  async loadModel() {

    
        // 已经可用
    if (window.cv) {
        return window.cv;
    }

    // 防止重复加载
    if (window._loadingCV) {
        return window._loadingCV;
    }
    console.log('弹窗加载cv')

    window._loadingCV = new Promise((resolve, reject) => {

        const currentURL = window.location.href;
        // 获取前一级路径
        const oneLevelUp = currentURL.substring(0, currentURL.lastIndexOf('/'));
        const modelPath =oneLevelUp+'/static/model';  // 你的模型路径
        console.log(`${modelPath}/opencv1.js`)
        const script = document.createElement('script');
        script.src = `${modelPath}/opencv1.js`;
        script.async = true;
        // script.defer = true;

        script.onerror = () => {
            reject(new Error('opencv1.js 加载失败'));
        };

        script.onload = () => {
            // console.log('opencv1.js script loaded');

            // const start = performance.now();
            // const timeout = 15000;

            // resolve(true);

            // // const waitForCV = () => {
            // //     if (window.cv && window.cv.Mat) {
            // //         console.log('OpenCV ready');
            // //         resolve(window.cv);
            // //         return;
            // //     }

            // //     if (performance.now() - start > timeout) {
            // //         reject(new Error('OpenCV 初始化超时'));
            // //         return;
            // //     }

            // //     requestAnimationFrame(waitForCV);
            // // };

            // // waitForCV();
            console.log('opencv1.js script loaded');

            const start = performance.now();
            const timeout = 15000;
        
            const waitForCV = () => {
        
                if (window.cv && window.cv.Mat) {
        
                    console.log(
                        'OpenCV ready',
                        performance.now() - start
                    );
                       
        
                    resolve(true);
                    return;
                }
        
                if (performance.now() - start > timeout) {
        
                    reject(
                        new Error('OpenCV 初始化超时')
                    );
        
                    return;
                }
        
                requestAnimationFrame(waitForCV);
            };
        
            waitForCV();
        };

        document.head.appendChild(script);
    });

    return window._loadingCV;
    }

  setRemoteUrl(url) {
    this.remoteUrl = url;
    this.videoType = 'remote';
  }

  useLocalCamera() {
    this.videoType = 'local';
  }

  setQRDetectedCallback(callback) {
    this.onQRDetected = callback;
  }

  startQRDetection() {
    // if (this.videoType !== 'local' || !this.modal) {
    //     console.warn('只能在本地摄像头开启后检测二维码');
    //     return;
    // }
    // console.log(this.modal)
    if(this.videoType !== 'local'){
      const img = this.modal.querySelector('img');
        if (!img) {
            console.warn('视频流未准备好');
            return;
        }
    }else{
        const video = this.modal.querySelector('video');
        if (!video || video.readyState < 2) {
            console.warn('视频流未准备好');
            return;
        }
    }

    

    this.isQRDetectionActive = true;
    this.processQRDetection();
  }

    stopQRDetection() {
        this.isQRDetectionActive = false;
        if (this.qrRequestId) {
            cancelAnimationFrame(this.qrRequestId);
            this.qrRequestId = null;
        }
    }

    calculateCenter(points) {
        let sumX = 0, sumY = 0;
        for (const p of points) {
            sumX += p.x;
            sumY += p.y;
        }
        return {
            x: Math.round(sumX / points.length)-255-60,
            y: (-1)*(Math.round(sumY / points.length)-223-30)
        };
    }

    processQRDetection() {
        if (!this.isQRDetectionActive) return;
        let width;
        let height;

        let imageData;
        if(this.videoType !== 'local'){
          const img = this.modal.querySelector('img');
          // img.crossOrigin = "anonymous";
          if (!img) return;
          if (img && img.complete && img.naturalWidth === 0) {
             console.log('图像加载失败')
              return;
          }

          width = img.width;
          height = img.height;
          // console.log(width)
          this.canvas.width = width;
          this.canvas.height = height;

          this.canvasCtx.drawImage(img, 0, 0, width, height);

          imageData = this.canvasCtx.getImageData(0, 0, width, height);
          // console.log(imageData.data)
        }else{
          const video = this.modal.querySelector('video');
          if (!video || video.readyState < 2) return;

          width = video.videoWidth;
          height = video.videoHeight;
          this.canvas.width = width;
          this.canvas.height = height;

          this.canvasCtx.drawImage(video, 0, 0, width, height);
          imageData = this.canvasCtx.getImageData(0, 0, width, height);
          // console.log(imageData.data)
        }
        

        const qrCode = jsQR(imageData.data, width, height);
        // console.log(qrCode)

        this.canvasCtx.clearRect(0, 0, width, height); // 清除上一帧绘制
        if (qrCode) {
            aiInfo.setQr(qrCode.data)
            const corners = qrCode.location;
            this.canvasCtx.beginPath();
            this.canvasCtx.moveTo(corners.topLeftCorner.x, corners.topLeftCorner.y);
            this.canvasCtx.lineTo(corners.topRightCorner.x, corners.topRightCorner.y);
            this.canvasCtx.lineTo(corners.bottomRightCorner.x, corners.bottomRightCorner.y);
            this.canvasCtx.lineTo(corners.bottomLeftCorner.x, corners.bottomLeftCorner.y);
            this.canvasCtx.closePath();
            this.canvasCtx.strokeStyle = 'red';
            this.canvasCtx.lineWidth = 2;
            this.canvasCtx.stroke();

            // if (typeof this.onQRDetected === 'function') {
            const location = [
                corners.topLeftCorner,
                corners.topRightCorner,
                corners.bottomRightCorner,
                corners.bottomLeftCorner,
                this.calculateCenter([
                corners.topLeftCorner,
                corners.topRightCorner,
                corners.bottomRightCorner,
                corners.bottomLeftCorner
                ])
            ];

            aiInfo.setQrLocation(location)
            const wh = [
                Math.abs(corners.topRightCorner.x - corners.topLeftCorner.x),
                Math.abs(corners.bottomLeftCorner.y - corners.topLeftCorner.y)
            ];
            aiInfo.setQrWh(wh)
            // this.onQRDetected({
            //     data: qrCode.data,
            //     location,
            //     size: wh
            // });
            // }
        } else {
            aiInfo.setQr(null)
            aiInfo.setQrLocation(null)
            aiInfo.setQrWh(null)
            // if (typeof this.onQRDetected === 'function') {
            // this.onQRDetected(null);
            // }

        }

        this.qrRequestId = requestAnimationFrame(() => this.processQRDetection());
    }




    async aprilTag(){

         if(this.videoType !== 'local'){
            const img = this.modal.querySelector('img');
              if (!img) {
                  console.warn('视频流未准备好');
                  return;
              }
          }else{
              const video = this.modal.querySelector('video');
              if (!video || video.readyState < 2) {
                  console.warn('视频流未准备好');
                  return;
              }
          }


        this.isAprilTagActive=true

        const currentURL = window.location.href;

        // 获取前一级路径
        const oneLevelUp = currentURL.substring(0, currentURL.lastIndexOf('/'));
        // 获取前两级路径
        const twoLevelsUp = oneLevelUp.substring(0, oneLevelUp.lastIndexOf('/'));
        const modelPath =oneLevelUp+'/static/model';  // 你的模型路径
        // WebWorkers use `postMessage` and therefore work with Comlink.
        const Apriltag = Comlink.wrap(new Worker(modelPath+"/apriltag.js"));

        // must call this to init apriltag detector; argument is a callback for when the detector is ready
        window.apriltag = await new Apriltag(Comlink.proxy(() => {

            // set camera info; we must define these according to the device and image resolution for pose computation
            //window.apriltag.set_camera_info(double fx, double fy, double cx, double cy)

            window.apriltag.set_tag_size(5, .5);
            console.log(this.isAprilTagActive)
            console.log(THIS.isAprilTagActive)

            // start processing frames
            requestAnimationFrame(this.process_frame.bind(this));
        }));
    }


    getAprilDistance(x1,y1,x2,y2){
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    mirrorImageData(imageData) {
        const width = imageData.width;
        const height = imageData.height;
        const data = imageData.data;
        const mirrored = new Uint8ClampedArray(data.length);
    
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const srcIndex = (y * width + x) * 4;
                const dstIndex = (y * width + (width - x - 1)) * 4;
    
                // Copy RGBA values
                mirrored[dstIndex] = data[srcIndex];
                mirrored[dstIndex + 1] = data[srcIndex + 1];
                mirrored[dstIndex + 2] = data[srcIndex + 2];
                mirrored[dstIndex + 3] = data[srcIndex + 3];
            }
        }
    
        return new ImageData(mirrored, width, height);
    }
    async process_frame() {
      // console.log(this.isAprilTagActive)
        if(!this.isAprilTagActive) return
        // console.log('处理帧')
        // canvas.width = video.videoWidth;
        // canvas.height = video.videoHeight;
        // let ctx = canvas.getContext("2d");
        let width;
        let height;

        let imageData;
        if(this.videoType !== 'local'){
          const img = this.modal.querySelector('img');
          // img.crossOrigin = "anonymous";
          if (!img) return;
          if (img && img.complete && img.naturalWidth === 0) {
             console.log('图像加载失败')
              return;
          }

          width = img.width;
          height = img.height;
          // console.log(width)
          this.canvas.width = width;
          this.canvas.height = height;

          this.canvasCtx.drawImage(img, 0, 0, width, height);

          imageData = this.canvasCtx.getImageData(0, 0, width, height);
          // console.log(imageData.data)
        }else{
          const video = this.modal.querySelector('video');
          if (!video || video.readyState < 2) return;

          width = video.videoWidth;
          height = video.videoHeight;
          this.canvas.width = width;
          this.canvas.height = height;

          this.canvasCtx.drawImage(video, 0, 0, width, height);
          imageData = this.canvasCtx.getImageData(0, 0, width, height);
          // console.log(imageData.data)
        }

        this.canvasCtx.clearRect(0, 0, width, height); // 清除上一帧绘制

         // 始终复制原始 imageData，无论是否镜像
        const copied = new Uint8ClampedArray(imageData.data); // 拷贝 pixel 数据
        imageData = new ImageData(copied, imageData.width, imageData.height);

        if (this.mirror) {
            imageData = this.mirrorImageData(imageData);
        }
        // try {
        //   ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        //   imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        // } catch (err) {
        //   console.log("Failed to get video frame. Video not started ?");
        //   setTimeout(process_frame, 500); // try again in 0.5 s
        //   return;
        // }
        let imageDataPixels = imageData.data;
        let grayscalePixels = new Uint8Array(this.canvasCtx.canvas.width * this.canvasCtx.canvas.height); // this is the grayscale image we will pass to the detector
      
        for (var i = 0, j = 0; i < imageDataPixels.length; i += 4, j++) {
          let grayscale = Math.round((imageDataPixels[i] + imageDataPixels[i + 1] + imageDataPixels[i + 2]) / 3);
          grayscalePixels[j] = grayscale; // single grayscale value
          imageDataPixels[i] = grayscale;
          imageDataPixels[i + 1] = grayscale;
          imageDataPixels[i + 2] = grayscale;
        }

        // THIS.canvasCtx.putImageData(imageData, 0, 0);


        if(this.detections.length==0){
            aiInfo.setAprilInfo(-1)
            aiInfo.setAprilLocation(null)
            aiInfo.setAprilWh(null)
        }

        let biggestDet = null;
        let maxEdgeLength = 0;
        this.detections.forEach(det => {
            const p1 = det.corners[0];
            const p2 = det.corners[1];
            const edgeLength = this.getAprilDistance(p1.x, p1.y, p2.x, p2.y);
        
            if (edgeLength > maxEdgeLength) {
                maxEdgeLength = edgeLength;
                biggestDet = det;
            }
        });
        
        if (biggestDet) {
            let centerX
            let centerY
            let Corners

            const det = biggestDet;
        
            aiInfo.setAprilInfo(det.id);

            if(this.mirror){
                centerX = this.canvas.width - det.center.x;
                centerY=det.center.y;
                Corners = det.corners.map(p => ({
                    x: this.canvas.width - p.x,
                    y: p.y
                }));
            }else{
                centerX=det.center.x;
                centerY=det.center.y;
                Corners = det.corners.map(p => ({
                    x: p.x,
                    y: p.y
                }));
            }
        
            const xCenter = centerX - 300;
            const yCenter = -1 * (centerY - 250);
            const distance = this.getAprilDistance(det.corners[0].x, det.corners[0].y, det.corners[1].x, det.corners[1].y);
        
            aiInfo.setAprilLocation({
                x: Math.round(xCenter),
                y: Math.round(yCenter)
            });
            aiInfo.setAprilWh(Math.round(distance));

            this.canvasCtx.beginPath();
            this.canvasCtx.lineWidth = "5";
            this.canvasCtx.strokeStyle = "red";
            this.canvasCtx.moveTo(Corners[0].x, Corners[0].y);
            this.canvasCtx.lineTo(Corners[1].x, Corners[1].y);
            this.canvasCtx.lineTo(Corners[2].x, Corners[2].y);
            this.canvasCtx.lineTo(Corners[3].x, Corners[3].y);
            this.canvasCtx.lineTo(Corners[0].x, Corners[0].y);
        
            this.canvasCtx.font = "bold 20px Arial";
            this.canvasCtx.fillStyle = "red";
            this.canvasCtx.textAlign = "center";
            this.canvasCtx.fillText(`${det.id}`,centerX, det.center.y + 5);
            this.canvasCtx.stroke();
            

            
        }
      
        // detect aprilTag in the grayscale image given by grayscalePixels
        this.detections = await apriltag.detect(grayscalePixels, this.canvasCtx.canvas.width, this.canvasCtx.canvas.height);
      
        if (this.imgSaveRequested && this.detections.length > 0) {
            let savep = Base64.bytesToBase64(this.canvasCtx.getImageData(0, 0, this.canvasCtx.canvas.width, this.canvasCtx.canvas.height).data);
            var det = JSON.stringify({
              det_data: this.detections[0],
              img_data: LZString.compressToUTF16(savep),
              img_width:  this.canvasCtx.canvas.width,
              img_height: this.canvasCtx.canvas.height
            });
      
            //console.log("Saving detection data.");
            // localStorage.setItem("detectData", det);
            // buttonToggle();
            // loadImg('saved_det');
        }


      
        requestAnimationFrame(this.process_frame.bind(this));
    }

    stopAprilTag(){
        this.isAprilTagActive=false
        cancelAnimationFrame(this.process_frame);

        this.detections=[]
        this.imgSaveRequested=0;
        this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);  
        console.log('停止了')
    }





     // 启动颜色识别
    async startColorDetection() {
        if(!cv && !window.cv){
            try{
                await this.loadModel()
                cv =window.cv
            }catch(e){
                console.log(e)
            }
        }
        cv =window.cv
        await new Promise(resolve => setTimeout(resolve, 2000)); 


        this.isColorDetectionActive = true;

        // if(!cv) cv = require('../model/opencv1')

        this.processColorDetection();
    }

    // 停止颜色识别
    stopColorDetection() {
        this.isColorDetectionActive = false;
        cancelAnimationFrame(this.processColorDetection);
        this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);  

    }

    

    // 处理视频帧，进行颜色识别
    processColorDetection() {
        if (!this.isColorDetectionActive) return;
        // console.log('-----------')
        // let canvasOutput = document.getElementById('canvasOutput');
        // let ctx = canvasOutput.getContext('2d');
        let width;
        let height;

        let imageData;
        if(this.videoType !== 'local'){
          const img = this.modal.querySelector('img');
          // img.crossOrigin = "anonymous";
          if (!img) return;
          if (img && img.complete && img.naturalWidth === 0) {
             console.log('图像加载失败')
              return;
          }

          width = img.width;
          height = img.height;
          // console.log(width)
          this.canvas.width = width;
          this.canvas.height = height;

          this.canvasCtx.drawImage(img, 0, 0, width, height);

          imageData = this.canvasCtx.getImageData(0, 0, width, height);
          // console.log(imageData.data)
        }else{
          const video = this.modal.querySelector('video');
          if (!video || video.readyState < 2) return;

          width = video.videoWidth;
          height = video.videoHeight;
          this.canvas.width = width;
          this.canvas.height = height;

          this.canvasCtx.drawImage(video, 0, 0, width, height);
          imageData = this.canvasCtx.getImageData(0, 0, width, height);
          // console.log(imageData.data)
        }

        

        let frame = cv.imread(this.canvas);  // 从canvas读取图像

        
       this.canvasCtx.clearRect(0, 0, width, height); // 清除上一帧绘制
        //-----------------中心点
        // 计算中心区域坐标
        let centerX = Math.floor(this.canvas.width / 2);
        let centerY = Math.floor(this.canvas.height / 2);
        let regionSize = 10;
        let x = centerX - regionSize / 2;
        let y = centerY - regionSize / 2;

        // 提取中心区域
        let roi = frame.roi(new cv.Rect(x, y, regionSize, regionSize));

        // 计算平均颜色
        let avgColor = this.getAverageColor(roi);
        let colorHex = this.rgbToHex(avgColor[0], avgColor[1], avgColor[2]);

        aiInfo.setColorRgb(avgColor)
        // 绘制中心区域边框
        this.canvasCtx.strokeStyle = '#000';
        this.canvasCtx.lineWidth = 2;
        this.canvasCtx.strokeRect(x, y, regionSize, regionSize);

        // 填充颜色
        this.canvasCtx.fillStyle = colorHex === '#ffffff' ? '#CCCCCC' : colorHex;
        this.canvasCtx.fillRect(x, y, regionSize, regionSize);

        // 保存到 colorGrid（可以只保存一格）
        this.colorGrid = [[colorHex]];

        roi.delete(); // 清理内存

       
        frame.delete();  // 释放内存
        if (this.isColorDetectionActive) {
            requestAnimationFrame(this.processColorDetection.bind(this));
        }
        // requestAnimationFrame(processColorDetection);  // 循环处理每一帧
    }


    getColorAt(x, y) {
        let cellWidth = this.canvas.width / 8;
        let cellHeight = this.canvas.height / 6;
    
        let col = Math.floor(x / cellWidth);
        let row = Math.floor(y / cellHeight);
    
        if (row >= 0 && row < 6 && col >= 0 && col < 8) {
            return this.colorGrid[row][col];
        } else {
            return null; // 坐标超出范围
        }
    }

    // 获取图像的平均颜色
    getAverageColor(image) {
        let sum = [0, 0, 0];
        let count = 0;
        for (let i = 0; i < image.rows; i++) {
            for (let j = 0; j < image.cols; j++) {
                let pixel = image.ucharPtr(i, j);
                sum[0] += pixel[0];  // 蓝色
                sum[1] += pixel[1];  // 绿色
                sum[2] += pixel[2];  // 红色
                count++;
            }
        }
        return [Math.round(sum[0] / count), Math.round(sum[1] / count), Math.round(sum[2] / count)];

        // let max = [0, 0, 0];
        // for (let i = 0; i < image.rows; i++) {
        //     for (let j = 0; j < image.cols; j++) {
        //         let pixel = image.ucharPtr(i, j);
        //         max[0] = Math.max(max[0], pixel[0]);  // B
        //         max[1] = Math.max(max[1], pixel[1]);  // G
        //         max[2] = Math.max(max[2], pixel[2]);  // R
        //     }
        // }
        // return max;
    }

    getAverageColorByMask(image, mask) {
        let sum = [0, 0, 0];
        let count = 0;
    
        for (let i = 0; i < image.rows; i++) {
            for (let j = 0; j < image.cols; j++) {
                if (mask.ucharAt(i, j) === 255) {
                    let pixel = image.ucharPtr(i, j);
                    sum[0] += pixel[0]; // B
                    sum[1] += pixel[1]; // G
                    sum[2] += pixel[2]; // R
                    count++;
                }
            }
        }
    
        if (count === 0) return [0, 0, 0];
        return [sum[0] / count, sum[1] / count, sum[2] / count];


        // let max = [0, 0, 0];

        // for (let i = 0; i < image.rows; i++) {
        //     for (let j = 0; j < image.cols; j++) {
        //         if (mask.ucharAt(i, j) === 255) {
        //             let pixel = image.ucharPtr(i, j);
        //             max[0] = Math.max(max[0], pixel[0]); // B
        //             max[1] = Math.max(max[1], pixel[1]); // G
        //             max[2] = Math.max(max[2], pixel[2]); // R
        //         }
        //     }
        // }
    
        // return max;
    }

    // RGB 转 HEX
    rgbToHex(r, g, b) {
        return '#' + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase();
    }






     // 启动色块位置识别
    async startColorPlaceDetection() {
        if(!cv && !window.cv){
            try{
                await this.loadModel()
                cv =window.cv
            }catch(e){
                console.log(e)
            }
        }
        cv =window.cv
        await new Promise(resolve => setTimeout(resolve, 2000)); 
        // if(!cv) cv = require('../model/opencv1')

        // 设置蓝色范围的 HSV 值
        this.lower_blue = new cv.Mat(1, 3, cv.CV_8UC1); // 1行3列矩阵
        this.upper_blue = new cv.Mat(1, 3, cv.CV_8UC1); // 1行3列矩阵

        // 直接将数据赋值到 Mat 对象
        this.lower_blue.data.set([100, 150, 100]); // 下限 (H=100, S=150, V=100)
        this.upper_blue.data.set([140, 255, 255]); // 上限 (H=140, S=255, V=255)

        // 红色范围的 HSV 值
        this.lower_red1 = new cv.Mat(1, 3, cv.CV_8UC1); // 1行3列矩阵
        this.upper_red1 = new cv.Mat(1, 3, cv.CV_8UC1);
        this.lower_red1.data.set([0, 150, 70]); // 红色下限 (H=0, S=150, V=50)
        this.upper_red1.data.set([10, 255, 255]); // 红色上限 (H=10, S=255, V=255)

        // 黄色范围的 HSV 值
        this.lower_yellow = new cv.Mat(1, 3, cv.CV_8UC1);
        this.upper_yellow = new cv.Mat(1, 3, cv.CV_8UC1);
        this.lower_yellow.data.set([25, 150, 50]); // 黄色下限 (H=25, S=150, V=50)
        this.upper_yellow.data.set([35, 255, 255]); // 黄色上限 (H=35, S=255, V=255)

        // 绿色范围的 HSV 值
        this.lower_green = new cv.Mat(1, 3, cv.CV_8UC1);
        this.upper_green = new cv.Mat(1, 3, cv.CV_8UC1);
        this.lower_green.data.set([50, 150, 50]); // 绿色下限 (H=50, S=150, V=50)
        this.upper_green.data.set([70, 255, 255]); // 绿色上限 (H=70, S=255, V=255)

        // 黑色范围的 HSV 值
        this.lower_black = new cv.Mat(1, 3, cv.CV_8UC1);
        this.upper_black = new cv.Mat(1, 3, cv.CV_8UC1);
        this.lower_black.data.set([0, 0, 0]); // 黑色下限 (H=0, S=0, V=0)
        this.upper_black.data.set([180, 255, 50]); // 黑色上限 (H=180, S=255, V=50)

        // 白色范围的 HSV 值
        this.lower_white = new cv.Mat(1, 3, cv.CV_8UC1);
        this.upper_white = new cv.Mat(1, 3, cv.CV_8UC1);
        this.lower_white.data.set([0, 0, 200]); // 白色下限 (H=0, S=0, V=200)
        this.upper_white.data.set([180, 50, 255]); // 白色上限 (H=180, S=50, V=255)

        //capColor = new cv.VideoCapture(videoElement);

      

        this.isColorPlaceDetectionActive = true;


        this.processColorPlaceDetection();
    }

    // 停止颜色识别
    stopColorPlaceDetection() {

        this.lower_blue=null;
        this.upper_blue=null;
        this.capColor=null;
        this.lower_red1=null;
        this.upper_red1=null;
        this.lower_yellow=null;
        this.upper_yellow=null;
        this.lower_green=null;
        this.upper_green=null;
        this.lower_black=null;
        this.upper_black=null;
        this.lower_white=null;
        this.upper_white=null

        this.isColorPlaceDetectionActive = false;
        cancelAnimationFrame(this.processColorPlaceDetection);
        this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);  
       
    }

   

    // 处理视频帧，进行色块位置识别
    processColorPlaceDetection() {
        if (!this.isColorPlaceDetectionActive) return;
       let width;
        let height;

        let imageData;
        if(this.videoType !== 'local'){
          const img = this.modal.querySelector('img');
          // img.crossOrigin = "anonymous";
          if (!img) return;
          if (img && img.complete && img.naturalWidth === 0) {
             console.log('图像加载失败')
              return;
          }

          width = img.width;
          height = img.height;
          // console.log(width)
          this.canvas.width = width;
          this.canvas.height = height;

          this.canvasCtx.drawImage(img, 0, 0, width, height);

          imageData = this.canvasCtx.getImageData(0, 0, width, height);
          // console.log(imageData.data)
        }else{
          const video = this.modal.querySelector('video');
          if (!video || video.readyState < 2) return;

          width = video.videoWidth;
          height = video.videoHeight;
          this.canvas.width = width;
          this.canvas.height = height;

          this.canvasCtx.drawImage(video, 0, 0, width, height);
          imageData = this.canvasCtx.getImageData(0, 0, width, height);
          // console.log(imageData.data)
        }


        
       this.canvasCtx.clearRect(0, 0, width, height); // 清除上一帧绘制
    
        let src = cv.matFromImageData(imageData); 
        let dst = new cv.Mat();      
        let mask = new cv.Mat();   
    
        try {
            cv.cvtColor(src, dst, cv.COLOR_RGB2HSV);
        } catch (error) {
            console.error("cvtColor 错误: ", error);
            return;
        }
    
        const color = aiInfo.getWhatColor();
        if (color === 'red') {
            cv.inRange(dst, this.lower_red1, this.upper_red1, mask);
        } else if (color === 'yellow') {
            cv.inRange(dst, this.lower_yellow, this.upper_yellow, mask);
        } else if (color === 'green') {
            cv.inRange(dst, this.lower_green, this.upper_green, mask);
        } else if (color === 'blue') {
            cv.inRange(dst, this.lower_blue, this.upper_blue, mask);
        } else if (color === 'black') {
            cv.inRange(dst, this.lower_black, this.upper_black, mask);
        } else if (color === 'white') {
            cv.inRange(dst, this.lower_white, this.upper_white, mask);
        }
    
        cv.GaussianBlur(mask, mask, new cv.Size(5, 5), 0);
    
        let contours = new cv.MatVector();
        let hierarchy = new cv.Mat();
        cv.findContours(mask, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
    
        let colorNum = 0;
        let location = { x: 0, y: 0 };
        let maxArea = 0;
        let maxRect = null;
    
        for (let i = 0; i < contours.size(); i++) {
            let contour = contours.get(i);
            let area = cv.contourArea(contour);
            if (area > 500 && area > maxArea) {
                let rect = cv.boundingRect(contour);
                let aspectRatio = rect.width / rect.height;
                if (aspectRatio > 0.5 && aspectRatio < 2) {
                    maxArea = area;
                    maxRect = rect;
                }
            }
        }
    
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;
        const r = 50;
        
        if (maxRect) {
            colorNum = 1;
            let centerX = maxRect.x + maxRect.width / 2;
            let centerY = maxRect.y + maxRect.height / 2;
    
            // 设置原点在中心
            location.x = centerX ;
            location.y = centerY ;
    
            // aiInfo.setColorWh([maxRect.width, maxRect.height]);
    
            // 区域判断逻辑（基于实际像素）
            const dx = centerX - cx;
            const dy = centerY - cy;
            
            const angle = Math.atan2(dy, dx) * 180 / Math.PI; // 转为角度制
            
            let region = 'none';
            
            // 在中间正方形范围内
            if (Math.abs(dx) <= 50 && Math.abs(dy) <= 50) {
                region = 'center';
            } else {
                if (angle >= -45 && angle <= 45) {
                    region = 'right';
                } else if (angle > 45 && angle < 135) {
                    region = 'bottom';
                } else if (angle >= 135 || angle <= -135) {
                    region = 'left';
                } else if (angle > -135 && angle < -45) {
                    region = 'top';
                }
            }
            aiInfo.setRegion(region);
            // console.log(region)
    
            // 绘制边框
            cv.rectangle(
                src,
                new cv.Point(maxRect.x, maxRect.y),
                new cv.Point(maxRect.x + maxRect.width, maxRect.y + maxRect.height),
                [255, 0, 0, 255],
                2
            );
        } else {
            colorNum = 0;
            // aiInfo.setRegion('none');
        }
    
        // aiInfo.setHaveColor(colorNum);
        // aiInfo.setColorLocation(location);
    
        // Canvas 设置与渲染
        this.canvas.width = width;
        this.canvas.height = height;
    
        let imageDataToRender = new ImageData(new Uint8ClampedArray(src.data), src.cols, src.rows);
        this.canvasCtx.putImageData(imageDataToRender, 0, 0);
    
        // 绘制完整的区域分割线
        const ctx = this.canvasCtx;
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2;
    
        
    
        // 画中间正方形
        ctx.strokeRect(cx - r, cy - r, 100, 100);
    
        // 从四角连线到中间
        ctx.beginPath();
        ctx.moveTo(0, 0);         ctx.lineTo(cx - r, cy - r);
        ctx.moveTo(this.canvas.width, 0); ctx.lineTo(cx + r, cy - r);
        ctx.moveTo(0, this.canvas.height); ctx.lineTo(cx - r, cy + r);
        ctx.moveTo(this.canvas.width, this.canvas.height); ctx.lineTo(cx + r, cy + r);
        ctx.stroke();
    
        // 渲染到 renderer
        const updatedImageData = this.canvasCtx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        if (this.renderer) {
            this.renderer.updateBitmapSkin(this.faceSkinId, updatedImageData, 1);
            this.runtime.requestRedraw();
        }
    
        // 清理
        src.delete();
        dst.delete();
        mask.delete();
        contours.delete();
        hierarchy.delete();
    
        if (this.isColorPlaceDetectionActive) {
            requestAnimationFrame(this.processColorPlaceDetection.bind(this));
        }
    }




     //颜色追踪
    // 启动色块检测
    async startWColorBlockDetection() {
        console.log('执行了颜色追踪')

        if(!cv && !window.cv){
            try{
                await this.loadModel()
                cv =window.cv
            }catch(e){
                console.log(e)
            }
        }
        cv =window.cv
        await new Promise(resolve => setTimeout(resolve, 2000)); 
        // if(!cv) cv = require('../model/opencv1')

        // 设置蓝色范围的 HSV 值
        this.lower_blue = new cv.Mat(1, 3, cv.CV_8UC1); // 1行3列矩阵
        this.upper_blue = new cv.Mat(1, 3, cv.CV_8UC1); // 1行3列矩阵

        // 直接将数据赋值到 Mat 对象
        this.lower_blue.data.set([100, 150, 100]); // 下限 (H=100, S=150, V=100)
        this.upper_blue.data.set([140, 255, 255]); // 上限 (H=140, S=255, V=255)

        // 红色范围的 HSV 值
        this.lower_red1 = new cv.Mat(1, 3, cv.CV_8UC1); // 1行3列矩阵
        this.upper_red1 = new cv.Mat(1, 3, cv.CV_8UC1);
        this.lower_red1.data.set([0, 150, 70]); // 红色下限 (H=0, S=150, V=50)
        this.upper_red1.data.set([10, 255, 255]); // 红色上限 (H=10, S=255, V=255)

        // 黄色范围的 HSV 值
        this.lower_yellow = new cv.Mat(1, 3, cv.CV_8UC1);
        this.upper_yellow = new cv.Mat(1, 3, cv.CV_8UC1);
        this.lower_yellow.data.set([20, 100, 50]); // 黄色下限 (H=25, S=150, V=50)
        this.upper_yellow.data.set([40, 255, 255]); // 黄色上限 (H=35, S=255, V=255)

        // 绿色范围的 HSV 值
        this.lower_green = new cv.Mat(1, 3, cv.CV_8UC1);
        this.upper_green = new cv.Mat(1, 3, cv.CV_8UC1);
        this.lower_green.data.set([35, 80, 40]); // 绿色下限 (H=50, S=150, V=50)
        this.upper_green.data.set([85, 255, 255]); // 绿色上限 (H=70, S=255, V=255)

        // 黑色范围的 HSV 值
        this.lower_black = new cv.Mat(1, 3, cv.CV_8UC1);
        this.upper_black = new cv.Mat(1, 3, cv.CV_8UC1);
        this.lower_black.data.set([0, 0, 0]); // 黑色下限 (H=0, S=0, V=0)
        this.upper_black.data.set([180, 255, 50]); // 黑色上限 (H=180, S=255, V=50)

        // 白色范围的 HSV 值
        this.lower_white = new cv.Mat(1, 3, cv.CV_8UC1);
        this.upper_white = new cv.Mat(1, 3, cv.CV_8UC1);
        this.lower_white.data.set([0, 0, 200]); // 白色下限 (H=0, S=0, V=200)
        this.upper_white.data.set([180, 50, 255]); // 白色上限 (H=180, S=50, V=255)

        //capColor = new cv.VideoCapture(videoElement);
        this.isColorBlockDetectionActive = true;
        this.processColorBlockDetectionW();
    }

    // 停止色块检测
    stopWColorBlockDetection() {
        this.isColorBlockDetectionActive = false;
        this.lower_blue=null;
        this.upper_blue=null;
        this.capColor=null;
        this.lower_red1=null;
        this.upper_red1=null;
        this.lower_yellow=null;
        this.upper_yellow=null;
        this.lower_green=null;
        this.upper_green=null;
        this.lower_black=null;
        this.upper_black=null;
        this.lower_white=null;
        this.upper_white=null
        cancelAnimationFrame(this.processColorBlockDetectionW);
        // await new Promise(resolve => setTimeout(resolve, 1000)); 
        this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);  
        // 更新 renderer 的 skin 内容
        console.log('停止')
    }
    // 处理每一帧
    processColorBlockDetectionW() {
        //if (!capColor) return;


        console.log('处理帧')
       let width;
        let height;

        let imageData;
        if(this.videoType !== 'local'){
          const img = this.modal.querySelector('img');
          // img.crossOrigin = "anonymous";
          if (!img) return;
          if (img && img.complete && img.naturalWidth === 0) {
             console.log('图像加载失败')
              return;
          }

          width = img.width;
          height = img.height;
          // console.log(width)
          this.canvas.width = width;
          this.canvas.height = height;

          this.canvasCtx.drawImage(img, 0, 0, width, height);

          imageData = this.canvasCtx.getImageData(0, 0, width, height);
          // console.log(imageData.data)
        }else{
          const video = this.modal.querySelector('video');
          if (!video || video.readyState < 2) return;

          width = video.videoWidth;
          height = video.videoHeight;
          this.canvas.width = width;
          this.canvas.height = height;

          this.canvasCtx.drawImage(video, 0, 0, width, height);
          imageData = this.canvasCtx.getImageData(0, 0, width, height);
          // console.log(imageData.data)
        }


        
       this.canvasCtx.clearRect(0, 0, width, height); // 清除上一帧绘制
        let src = cv.matFromImageData(imageData); 
        let dst = new cv.Mat();      
        let mask = new cv.Mat();   

        // 获取当前帧
        //capColor.read(src);

        // 转换为 HSV 色彩空间
        try {
            cv.cvtColor(src, dst, cv.COLOR_RGB2HSV);  // 转换颜色空间
        } catch (error) {
            console.error("cvtColor 错误: ", error);
            return;
        }

        if(aiInfo.getWhatColor()=='red'){
            // 创建掩码
            cv.inRange(dst, this.lower_red1, this.upper_red1, mask);
        }else if(aiInfo.getWhatColor()=='yellow'){
            // 创建掩码
            cv.inRange(dst, this.lower_yellow, this.upper_yellow, mask);
        }else if(aiInfo.getWhatColor()=='green'){
            // 创建掩码
            cv.inRange(dst, this.lower_green, this.upper_green, mask);
        }else if(aiInfo.getWhatColor()=='blue'){
            // 创建掩码
            cv.inRange(dst, this.lower_blue, this.upper_blue, mask);
        }else if(aiInfo.getWhatColor()=='black'){
            // 创建掩码
            cv.inRange(dst, this.lower_black, this.upper_black, mask);
        }else if(aiInfo.getWhatColor()=='white'){
            // 创建掩码
            cv.inRange(dst, this.lower_white, this.upper_white, mask);
        }
        

        // 对掩码进行高斯模糊，减少噪声
        cv.GaussianBlur(mask, mask, new cv.Size(5, 5), 0);

        // 查找轮廓
        let contours = new cv.MatVector();
        let hierarchy = new cv.Mat();
        cv.findContours(mask, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);


        

        let colorNum=0
        let location={
            x:0,
            y:0
        }
        let len=0

        let maxArea = 0;
        let maxRect = null;

        // 找出面积最大的目标轮廓
        for (let i = 0; i < contours.size(); i++) {
            let contour = contours.get(i);
            let area = cv.contourArea(contour);
            if (area > 500 && area > maxArea) {
                let rect = cv.boundingRect(contour);
                let aspectRatio = rect.width / rect.height;

                if (aspectRatio > 0.5 && aspectRatio < 2) {
                    maxArea = area;
                    maxRect = rect;
                }
            }
        }

        // 如果找到了最大轮廓，绘制它
        if (maxRect) {
            colorNum = 1; // 只找到一个目标
            location.x = maxRect.x - 300 + maxRect.width / 2;
            location.y = maxRect.y - 250 + maxRect.height / 2;

            let wh = [maxRect.width, maxRect.height];
            aiInfo.setColorWh(wh);

            cv.rectangle(
                src,
                new cv.Point(maxRect.x, maxRect.y),
                new cv.Point(maxRect.x + maxRect.width, maxRect.y + maxRect.height),
                [255, 0, 0, 255],
                2
            );
        } else {
            colorNum = 0;
        }

        aiInfo.setHaveColor(colorNum)
        aiInfo.setColorLocation(location)

        // console.log(src)
        // console.log(contours)

        // 渲染到 canvas 上
        this.canvas.width = width;
        this.canvas.height = height;
        
        // 获取图像的 ImageData
        let imageDataToRender = new ImageData(new Uint8ClampedArray(src.data), src.cols, src.rows);

        // 在 canvas 上渲染
        this.canvasCtx.putImageData(imageDataToRender, 0, 0);

        // 渲染到 renderer
      
        // 释放内存
        src.delete();
        dst.delete();
        mask.delete();
        contours.delete();
        hierarchy.delete();

        // 请求下一帧
        if (this.isColorBlockDetectionActive) {
            requestAnimationFrame(this.processColorBlockDetectionW.bind(this));
        }
    }




    // 初始化 OpenCV 和人脸检测
     async initializeOpenCV() {

        // if(!cv) cv = require('../model/opencv1')
        const currentURL = window.location.href;

        // 获取前一级路径
        const oneLevelUp = currentURL.substring(0, currentURL.lastIndexOf('/'));
        // 获取前两级路径
        const twoLevelsUp = oneLevelUp.substring(0, oneLevelUp.lastIndexOf('/'));
        const modelPath =oneLevelUp+'/static/model';  // 你的模型路径
        console.log(modelPath)
        console.log(window.location.href)

        // try {
            const response = await fetch(modelPath+'/haarcascade_frontalface_default.xml');
            if (!response.ok) {
                throw new Error(`获取人脸模型失败: ${response.statusText}`);
            }
            const buffer = await response.arrayBuffer(); // 读取为二进制数据
            console.log('haarcascade_frontalface_default.xml加载成功');

            console.log(cv);

            console.log('OpenCV.js 已初始化');
            this.classifier = new cv.CascadeClassifier();
            const data = new Uint8Array(buffer);
            cv.FS_createDataFile('/', 'haarcascade_frontalface_default.xml', data, true, false, false);

            if (!this.classifier.load('haarcascade_frontalface_default.xml')) {
                console.error('无法加载人脸模型文件');
                return;
            }
            console.log('人脸模型加载成功');
            
            // cv.onRuntimeInitialized = () => {
                
            // };
        // } catch (error) {
        //     console.error(`Error loading model: ${error.message}`);
        // }
    }

    // 提取 LBP 特征
    extractLBPFeatures(faceImage) {
        const gray = new cv.Mat();
        cv.cvtColor(faceImage, gray, cv.COLOR_RGBA2GRAY);

        // 创建 LBP 矩阵
        const lbp = new cv.Mat(gray.rows, gray.cols, cv.CV_8UC1);

        // 手动实现 LBP
        for (let i = 1; i < gray.rows - 1; i++) {
            for (let j = 1; j < gray.cols - 1; j++) {
                const center = gray.ucharPtr(i, j)[0];
                let code = 0;
                code |= (gray.ucharPtr(i - 1, j - 1)[0] > center) << 7;
                code |= (gray.ucharPtr(i - 1, j)[0] > center) << 6;
                code |= (gray.ucharPtr(i - 1, j + 1)[0] > center) << 5;
                code |= (gray.ucharPtr(i, j + 1)[0] > center) << 4;
                code |= (gray.ucharPtr(i + 1, j + 1)[0] > center) << 3;
                code |= (gray.ucharPtr(i + 1, j)[0] > center) << 2;
                code |= (gray.ucharPtr(i + 1, j - 1)[0] > center) << 1;
                code |= (gray.ucharPtr(i, j - 1)[0] > center) << 0;
                lbp.ucharPtr(i, j)[0] = code;
            }
        }

        // 将 lbp 包装成 MatVector
        const images = new cv.MatVector();
        images.push_back(lbp);

        // 计算 LBP 直方图
        const histSize = [256];
        const ranges = [0, 256];
        const hist = new cv.Mat();
        cv.calcHist(images, [0], new cv.Mat(), hist, histSize, ranges);

        // 归一化直方图
        cv.normalize(hist, hist, 1, 0, cv.NORM_L2);

        // 释放内存
        gray.delete();
        lbp.delete();
        images.delete();

        return hist;
    }

    // 计算直方图距离
    calculateHistogramDistance(hist1, hist2) {
        return cv.compareHist(hist1, hist2, cv.HISTCMP_CHISQR);
    }

    // 查找最接近的人脸
    findClosestMatch(faceImage) {
        const features = this.extractLBPFeatures(faceImage);
        let minDistance = Infinity;
        let matchedName = '陌生人';
    
        // 设置一个阈值（可以根据实际情况调整）
        const threshold = 0.5;
    
        for (const entry of this.faceDatabase) {
            const distance = this.calculateHistogramDistance(features, entry.features);
            if (distance < minDistance) {
                minDistance = distance;
                matchedName = entry.name;
            }
        }
    

        // console.log(minDistance)
        // 如果最小距离大于阈值，则认为是陌生人
        if (minDistance > threshold) {
            matchedName = '陌生人';
        }
    
        features.delete(); // 在匹配完成后释放
        return matchedName;
    }

    // 学习新人脸
    async learnNewFace(name) {
        console.log('00000')
        if(!cv && !window.cv){
            try{
                await this.loadModel()
                cv =window.cv
            }catch(e){
                console.log(e)
            }
        }
        cv =window.cv
        await new Promise(resolve => setTimeout(resolve, 2000)); 
        console.log('111')
        const features = this.extractLBPFeatures(this.faceImage);
        console.log('222')
        this.faceDatabase.push({ name, features });
        console.log(`Learned new face: ${name}`);
    }

    reSetFace(){
        this.faceDatabase=[]
    }

    // 启动人脸检测
    async startFaceDetection() {
        if(!cv && !window.cv){
            try{
                await this.loadModel()
                cv =window.cv
            }catch(e){
                console.log(e)
            }
        }
        cv =window.cv
        await new Promise(resolve => setTimeout(resolve, 2000)); 
        if (!this.classifier) {
            console.log('OpenCV 尚未初始化，开始初始化...');
            await this.initializeOpenCV();
        }

       
        this.isFaceDetectionActive = true;
        this.processVideo();
    }

    // 停止人脸检测
    async stopFaceDetection() {
        if(!cv && !window.cv){
            try{
                await this.loadModel()
                cv =window.cv
            }catch(e){
                console.log(e)
            }
        }
        cv =window.cv
        await new Promise(resolve => setTimeout(resolve, 2000)); 
        // if(!cv) cv = require('../model/opencv1')
        this.isFaceDetectionActive = false;
        clearTimeout(this.processVideoTimeout);
        if (this.src) this.src.delete();
        if (this.dst) this.dst.delete();
        if (this.gray) this.gray.delete();
        if (this.cap) this.cap.delete();
        if (this.faceImage) {
            this.faceImage.delete();
            this.faceImage = null;
        }

        try {
            cv.FS_unlink('/haarcascade_frontalface_default.xml');
        } catch (e) {
            console.log('模型文件之前不存在');
        }
        // if (this.faces) this.faces.delete();
        this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }



    async processVideo() {
        if (!this.isFaceDetectionActive) return;
    
        const begin = Date.now();
    
        try {
            // 1. 获取当前帧
           let width;
            let height;

            let imageData;
            if(this.videoType !== 'local'){
              const img = this.modal.querySelector('img');
              // img.crossOrigin = "anonymous";
              if (!img) return;
              if (img && img.complete && img.naturalWidth === 0) {
                console.log('图像加载失败')
                  return;
              }

              width = img.width;
              height = img.height;
              // console.log(width)
              this.canvas.width = width;
              this.canvas.height = height;

              this.canvasCtx.drawImage(img, 0, 0, width, height);

              imageData = this.canvasCtx.getImageData(0, 0, width, height);
              // console.log(imageData.data)
            }else{
              const video = this.modal.querySelector('video');
              if (!video || video.readyState < 2) return;

              width = video.videoWidth;
              height = video.videoHeight;
              this.canvas.width = width;
              this.canvas.height = height;

              this.canvasCtx.drawImage(video, 0, 0, width, height);
              imageData = this.canvasCtx.getImageData(0, 0, width, height);
              // console.log(imageData.data)
            }


            
          this.canvasCtx.clearRect(0, 0, width, height); // 清除上一帧绘制
    
            // 2. 图像处理
            const srcMat = cv.matFromImageData(imageData);
            const grayMat = new cv.Mat();
            cv.cvtColor(srcMat, grayMat, cv.COLOR_RGBA2GRAY);
    
            const faces = new cv.RectVector();
            const minSize = new cv.Size(30, 30);
            const maxSize = new cv.Size(300, 300);
            this.classifier.detectMultiScale(grayMat, faces, 1.1, 3, 0, minSize, maxSize);
    
            // 3. 清空画布
            this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            aiInfo.setFaceNum(faces.size());
    
            for (let i = 0; i < faces.size(); i++) {
                const face = faces.get(i);
    
                const faceImage = srcMat.roi(face);
                const wh = [Math.round(face.width), Math.round(face.height)];
                aiInfo.setFaceWh(wh);
                aiInfo.setFaceLocation({
                    x: Math.round(face.x - 300 + face.width / 2),
                    y: Math.round(face.y - 250 + face.height / 2)
                });
    
                // 复制用于匹配的 faceImage
                this.faceImage = faceImage.clone(); // 避免外部引用影响原图
    
                const name = this.findClosestMatch(faceImage);
                aiInfo.setIsSym(name !== '陌生人');
                aiInfo.setResultFace(name);
    
                // 绘制人脸框与标签
                this.canvasCtx.strokeStyle = 'red';
                this.canvasCtx.lineWidth = 2;
                this.canvasCtx.strokeRect(face.x, face.y, face.width, face.height);
                this.canvasCtx.fillStyle = 'red';
                this.canvasCtx.font = '16px Arial';
                this.canvasCtx.fillText(name, face.x, face.y - 10);
    
                // ✅ 释放每个 faceImage 临时 Mat
                faceImage.delete();
            }
    
           
    
            // ✅ 释放 Mat 对象
            srcMat.delete();
            grayMat.delete();
            faces.delete();
        } catch (e) {
            console.warn('processVideo error:', e);
    
            // 出错时也清空画布，避免残影
            this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
        }
    
        // 5. 控制帧率，使用 setTimeout 避免重入
        const delay = Math.max(0, 1000 / this.FPS - (Date.now() - begin));
        this.processVideoTimeout = setTimeout(() => this.processVideo(), delay);
    }



    // 加载 COCO-SSD 模型
      async loadItemModel() {
  
          const currentURL = window.location.href;
  
          // 获取前一级路径
          const oneLevelUp = currentURL.substring(0, currentURL.lastIndexOf('/'));
          // 获取前两级路径
          const twoLevelsUp = oneLevelUp.substring(0, oneLevelUp.lastIndexOf('/'));
          const modelPath =oneLevelUp+'/static/model';  // 你的模型路径
          try {
              this.cocomodel = await cocoSsd.load({
                  modelPath:modelPath+'/model.json'
              });
              console.log("COCO-SSD 模型已加载");
          } catch (error) {
              console.error("模型加载失败:", error);
          }
      }

    // 开始物品检测
    async startWItem() {
        if (!this.cocomodel) {
            console.log("模型尚未加载完成");
            await this.loadItemModel()
            
        }
        // if(!imageTransmission){
        //     alert("摄像头未开启")
        //     return
        // }


        this.isStartObject=true
        this.detectObjects();
    }


    async detectObjects() {

        if (!this.isStartObject || this.isProcessingFrame) return;

        this.isProcessingFrame = true;
        this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);  
        try {
              let width;
            let height;

            let imageData;
            if(this.videoType !== 'local'){
              const img = this.modal.querySelector('img');
              // img.crossOrigin = "anonymous";
              if (!img) return;
              if (img && img.complete && img.naturalWidth === 0) {
                console.log('图像加载失败')
                  return;
              }

              width = img.width;
              height = img.height;
              // console.log(width)
              this.canvas.width = width;
              this.canvas.height = height;

              this.canvasCtx.drawImage(img, 0, 0, width, height);

              imageData = this.canvasCtx.getImageData(0, 0, width, height);
              // console.log(imageData.data)
            }else{
              const video = this.modal.querySelector('video');
              if (!video || video.readyState < 2) return;

              width = video.videoWidth;
              height = video.videoHeight;
              this.canvas.width = width;
              this.canvas.height = height;

              this.canvasCtx.drawImage(video, 0, 0, width, height);
              imageData = this.canvasCtx.getImageData(0, 0, width, height);
              // console.log(imageData.data)
            }


            
          this.canvasCtx.clearRect(0, 0, width, height); // 清除上一帧绘制


            const predictions = await this.cocomodel.detect(imageData);

            let objectName=['',0]
            let location
            // ... 处理预测结果
            predictions.forEach(prediction => {
                const [x, y, width, height] = prediction.bbox;
                // location=prediction.bbox;
                
                
                //canvasCtx.fillText(`${prediction.class} (${(prediction.score * 100).toFixed(1)}%)`, x, y > 10 ? y - 5 : 10);
                const chineseClass = this.classNames[prediction.class] || prediction.class;  // 如果没有找到对应的中文，使用英文

                // if(chineseClass=='猫'){
                    aiInfo.setObjectLocation({
                        x:Math.round(x-300+width/2),
                        y:Math.round(y-250+height/2)
                    })
                    aiInfo.setObjectWh([Math.round(width),Math.round(height)])
                    this.canvasCtx.strokeStyle = "#00FF00";
                    this.canvasCtx.lineWidth = 2;
                    this.canvasCtx.strokeRect(x, y, width, height);
    
                    this.canvasCtx.font = "16px Arial";
                    this.canvasCtx.fillStyle = "#FF0000";
                    this.canvasCtx.fillText(`${chineseClass} (${(prediction.score * 100).toFixed(1)}%)`, x, y > 10 ? y - 5 : 10);
                    if(prediction.score>objectName[1]){
                        objectName[0]=chineseClass
                    }
                // }
               
                
                // nsole.log(`检测到物体: ${chineseClass}, 置信度: ${(prediction.score * 100).toFixed(1)}%`);
            });

            aiInfo.setObject( objectName[0])
            
          
            

   

        } catch (e) {
            console.error(e);
        } finally {
            this.isProcessingFrame = false;
            if (this.isStartObject) requestAnimationFrame(this.detectObjects.bind(this));
        }

    }

    // 停止物品检测
    stopWItem() {
        this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.isStartObject=false
        cancelAnimationFrame(this.detectObjects);
       
    }


     async startTrafficpre() {


  



        const currentURL = window.location.href;
        const oneLevelUp = currentURL.substring(0, currentURL.lastIndexOf('/'));
        const twoLevelsUp = oneLevelUp.substring(0, oneLevelUp.lastIndexOf('/'));
        const modelPath = oneLevelUp + '/static/model/tfjs_model4/';

        try {
            this.traficModel = await tfjs.loadGraphModel(modelPath + 'model.json');
            console.log('Model loaded');
            this.timerTraffic = setInterval(() => this.detectTraffic(), 100);
        } catch (error) {
            console.error('Error loading model:', error);
        }
    }



    async detectTraffic() {
        if (!this.traficModel) return;


         let width;
            let height;

            let imageData;
            if(this.videoType !== 'local'){
              const img = this.modal.querySelector('img');
              // img.crossOrigin = "anonymous";
              if (!img) return;
              if (img && img.complete && img.naturalWidth === 0) {
                console.log('图像加载失败')
                  return;
              }

              width = img.width;
              height = img.height;
              // console.log(width)
              this.canvas.width = width;
              this.canvas.height = height;

              this.canvasCtx.drawImage(img, 0, 0, width, height);

              imageData = this.canvasCtx.getImageData(0, 0, width, height);
              // console.log(imageData.data)
            }else{
              const video = this.modal.querySelector('video');
              if (!video || video.readyState < 2) return;

              width = video.videoWidth;
              height = video.videoHeight;
              this.canvas.width = width;
              this.canvas.height = height;

              this.canvasCtx.drawImage(video, 0, 0, width, height);
              imageData = this.canvasCtx.getImageData(0, 0, width, height);
              // console.log(imageData.data)
            }


            
          this.canvasCtx.clearRect(0, 0, width, height); // 清除上一帧绘制

        if (!imageData) {
            console.warn("No image data available.");
            return;
        }



        
        try {
            
           


            const [origWidth, origHeight] = [width,height]; // 原始图像尺寸
            const modelInputSize = 416; // 模型输入尺寸

            const confArr = tfjs.tidy(() => {
            const webcamTensor = tfjs.browser.fromPixels(imageData)
                .resizeNearestNeighbor([416, 416])
                .toFloat()
                .div(255.0)
                .expandDims()
                .transpose([0, 3, 1, 2]);

            const output = this.traficModel.execute({ 'images:0': webcamTensor });

            const raw = output.squeeze();
            const scores = raw.slice([0, 4], [10, 3545]);

            const boxes = raw.slice([0, 0], [4, 3549]).max(-1).arraySync(); // [4, 3549]

            return scores.max(-1).arraySync();  // 同步方式
        });
        // console.log(confArr)

        const sliceConf = confArr.slice(4);
        const max = Math.max(...sliceConf);


        if (max > 0.3) {
            const slicedIndex = sliceConf.indexOf(max);
            const originalIndex = slicedIndex + 4;
            aiInfo.setTraffic(originalIndex);

           
        } else {
            aiInfo.setTraffic(-1);
        }

        // // 把当前 canvas 更新到舞台
        // const updatedImageData = this.canvasCtx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        // this.renderer.updateBitmapSkin(this.faceSkinId, updatedImageData, 1);
        // this.runtime.requestRedraw();
                
        } catch (error) {
            console.error('Traffic detection failed:', error);
        }
    }

    stopTraffic(){
        clearInterval(this.timerTraffic)
    }

    async startGestureDetection(gestureLandmark){
        console.log('开始弹窗手势识别')
        if(this.videoType !== 'local'){
            const img = this.modal.querySelector('img');
              if (!img) {
                  console.warn('视频流未准备好');
                  return;
              }
          }else{
              const video = this.modal.querySelector('video');
              if (!video || video.readyState < 2) {
                  console.warn('视频流未准备好');
                  return;
              }
          }
        // const currentURL = window.location.href;
        // // 获取前一级路径
        // const oneLevelUp = currentURL.substring(0, currentURL.lastIndexOf('/'));
        // const modelPath =oneLevelUp+'/static/model/gestureModel';
        // const { HandLandmarker, FilesetResolver } = await import(
        //     /* webpackIgnore: true */
        //     modelPath+"/tasks-vision@latest.js"
        //   );
        // //   const { HandLandmarker, FilesetResolver } = await import(
        // //     /* webpackIgnore: true */
        // //     "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest"
        // //   );
        //   console.log(HandLandmarker)
        //   console.log(FilesetResolver)
          this.isGestureActive=true
          await this.init(gestureLandmark)
    }

    async init(gestureLandmark) {

        try {
            console.log('开始初始化')
    
            // ------------------------------------
            // 加载 MediaPipe WASM
            // ------------------------------------
    
            // const currentURL = window.location.href;
            // // 获取前一级路径
            // const oneLevelUp = currentURL.substring(0, currentURL.lastIndexOf('/'));
            // const modelPath =oneLevelUp+'/static/model/gestureModel';
            // const vision = await FilesetResolver.forVisionTasks(
            // modelPath+"/wasm"
            // // "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
            // );
    
            // console.log('vision',vision)
    
    
            //  // 保存 OpenCV 的 Module
            //  const savedModule = window.Module;
    
            //  try {
            //      // 防止 OpenCV 的全局 Module 干扰 MediaPipe
            //      window.Module = undefined;
     
            //      console.log(
            //          '开始创建 HandLandmarker'
            //      );
     
            //      handLandmarker =
            //          await HandLandmarker.createFromOptions(
            //              vision,
            //              {
            //                  baseOptions: {
            //                      modelAssetPath:
            //                          modelPath +
            //                          "/hand_landmarker.task"
            //                  },
     
            //                  runningMode: "VIDEO",
     
            //                  numHands: 1
            //              }
            //          );
     
            //      console.log(
            //          'handLandmarker',
            //          handLandmarker
            //      );
     
            //  } finally {
            //      // 恢复 OpenCV Module
            //      window.Module = savedModule;
     
            //      console.log(
            //          'OpenCV Module 已恢复'
            //      );
            //  }
            handLandmarker=gestureLandmark
            
        
            console.log('handLandmarker',handLandmarker)
    
    
            // 开始检测
            // requestAnimationFrame(() => detect(that, video,aiInfo));
            this.detect()
        } catch (error) {
    
            console.error("初始化失败:", error);
    
            // resultDiv.innerText = "初始化失败";
    
        }
    
    }

    // ========================================
    // 绘制手部骨骼连接线
    // ========================================

    drawHandConnections(hand) {

        this.canvasCtx.beginPath();


        HAND_CONNECTIONS.forEach(([startIndex, endIndex]) => {

            const start = hand[startIndex];

            const end = hand[endIndex];


            // MediaPipe 的 x/y 是 0~1 的归一化坐标
            const startX = this.mirror
                ? (1 - start.x) * this.canvas.width
                : start.x * this.canvas.width;
            const startY =
            start.y *this.canvas.height;


            const endX = this.mirror
                ? (1 - end.x) * this.canvas.width
                : end.x * this.canvas.width;

            const endY =
            end.y * this.canvas.height;


            // 绘制线段
            this.canvasCtx.moveTo(startX, startY);

            this.canvasCtx.lineTo(endX, endY);

        });


        // 连接线颜色
        this.canvasCtx.strokeStyle = "#00ff00";

        // 连接线宽度
        this.canvasCtx.lineWidth = 4;

        // 让线条更加平滑
        this.canvasCtx.lineCap = "round";

        this.canvasCtx.lineJoin = "round";

        this.canvasCtx.stroke();
    }


  

    //  drawHandPoints(hand) {

    //     hand.forEach((point, index) => {

    //         // const x = point.x * that.canvas.width;
    //         const x = this.mirror
    //         ? (1 - point.x) * this.canvas.width
    //         : point.x * this.canvas.width;
    //         const y = point.y * this.canvas.height;


    //         // ====================================
    //         // 绘制关键点
    //         // ====================================

    //         this.canvasCtx.beginPath();

    //         this.canvasCtx.arc(
    //             x,
    //             y,
    //             7,
    //             0,
    //             Math.PI * 2
    //         );

    //         if (index === 0) {
    //             console.log("("+x+","+y+")")
    //             this.canvasCtx.fillStyle = "#ff0000";
    //         } else {
    //             this.canvasCtx.fillStyle = "#00ffff";
    //         }

    //         this.canvasCtx.fill();

    //         this.canvasCtx.strokeStyle = "#ffffff";
    //         this.canvasCtx.lineWidth = 2;
    //         this.canvasCtx.stroke();


    //         // ====================================
    //         // 绘制关键点编号
    //         // ====================================

    //         this.canvasCtx.save();

    //         /*
    //             * 注意：
    //             *
    //             * 整个 Canvas 本身已经：
    //             *
    //             * transform: scaleX(-1)
    //             *
    //             * 所以关键点位置是正确的，
    //             * 但是文字也会跟着被镜像。
    //             *
    //             * 这里单独把文字反向一次，
    //             * 抵消 Canvas 的镜像。
    //             */

    //         this.canvasCtx.translate(x, y);

    //         // that.canvasCtx.scale(-1, 1);

    //         this.canvasCtx.fillStyle = "#ffffff";

    //         this.canvasCtx.font = "bold 16px Arial";

    //         // that.canvasCtx.textAlign = "left";

    //         this.canvasCtx.textBaseline = "alphabetic";

    //         this.canvasCtx.fillText(
    //             index,
    //             9,
    //             9
    //         );

    //         this.canvasCtx.restore();

    //     });

    // }
    drawHandPoints(hand) {

        // ========================================
        // 保存所有关键点的中心坐标
        // ========================================
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        // index 对应坐标
        const handCenterPoints = {};

        hand.forEach((point, index) => {

            // ====================================
            // 绘制坐标
            // ====================================

            // 注意：
            // 这里保持你现在的绘制逻辑，不改变
            const x = this.mirror
                ? (1 - point.x) * this.canvas.width
                : point.x * this.canvas.width;

            const y =
                point.y * this.canvas.height;


            // ====================================
            // 计算以画面中心为原点的坐标
            // ====================================

            const centerPointX =
            Math.round(x - centerX);

            const centerPointY =
            Math.round(centerY - y);


            // ====================================
            // 保存 index 对应的中心坐标
            // ====================================

            handCenterPoints[index] = {
                x: centerPointX,
                y: centerPointY
            };


            // ====================================
            // 绘制关键点
            // ====================================

            this.canvasCtx.beginPath();

            this.canvasCtx.arc(
                x,
                y,
                7,
                0,
                Math.PI * 2
            );

            if (index === 0) {
                // console.log(handCenterPoints[0])

                this.canvasCtx.fillStyle = "#ff0000";
            } else {
                this.canvasCtx.fillStyle = "#00ffff";
            }

            this.canvasCtx.fill();

            this.canvasCtx.strokeStyle = "#ffffff";
            this.canvasCtx.lineWidth = 2;
            this.canvasCtx.stroke();


            // ====================================
            // 绘制关键点编号
            // ====================================

            this.canvasCtx.save();

            this.canvasCtx.translate(x, y);

            this.canvasCtx.fillStyle = "#ffffff";

            this.canvasCtx.font = "bold 16px Arial";

            this.canvasCtx.textBaseline = "alphabetic";

            this.canvasCtx.fillText(
                index,
                9,
                9
            );

            this.canvasCtx.restore();

        });
        aiInfo.setGesture(handCenterPoints)

    }



    // ========================================
    // 绘制完整的手部关键点
    // ========================================

    async drawHandLandmarks(hand) {

        // 先绘制骨骼连接线
        this.drawHandConnections(hand);

        // 再绘制关键点
        this.drawHandPoints(hand);
        

    }



    // ========================================
    // 实时检测
    // ========================================

    async detect() {

        if(!this.isGestureActive) return

        let width;
        let height;

        let imageData;
        if(this.videoType !== 'local'){
          const img = this.modal.querySelector('img');
          // img.crossOrigin = "anonymous";
          if (!img) return;
          if (img && img.complete && img.naturalWidth === 0) {
             console.log('图像加载失败')
              return;
          }

          width = img.width;
          height = img.height;
          // console.log(width)
          this.canvas.width = width;
          this.canvas.height = height;

          this.canvasCtx.drawImage(img, 0, 0, width, height);

          imageData = this.canvasCtx.getImageData(0, 0, width, height);
          // console.log(imageData.data)
        }else{
          const video = this.modal.querySelector('video');
          if (!video || video.readyState < 2) return;

          width = video.videoWidth;
          height = video.videoHeight;
          this.canvas.width = width;
          this.canvas.height = height;

          this.canvasCtx.drawImage(video, 0, 0, width, height);
          imageData = this.canvasCtx.getImageData(0, 0, width, height);
          // console.log(imageData.data)
        }

        this.canvasCtx.clearRect(0, 0, width, height); // 清除上一帧绘制

        //  // 始终复制原始 imageData，无论是否镜像
        // const copied = new Uint8ClampedArray(imageData.data); // 拷贝 pixel 数据
        // imageData = new ImageData(copied, imageData.width, imageData.height);

        // if (this.mirror) {
        //     imageData = this.mirrorImageData(imageData);
        // }
        // console.log('开始检测')
        // 获取当前时间戳
        const now = performance.now();


        // ------------------------------------
        // MediaPipe 手部检测
        // ------------------------------------

        const result =
            handLandmarker.detectForVideo(
            imageData,
            now
            );


        // ------------------------------------
        // 清除上一帧 Canvas
        // ------------------------------------

        // ------------------------------------
        // 判断是否检测到手
        // ------------------------------------

        if (
            result.landmarks &&
            result.landmarks.length > 0
        ) {

            // 获取第一只手的 21 个关键点
            const hand =
            result.landmarks[0];


            // ------------------------------------
            // 绘制关键点和骨骼
            // ------------------------------------

            await this.drawHandLandmarks(hand);
            // console.log(hand)


            // ------------------------------------
            // 获取左右手信息
            // ------------------------------------

            const handedness =
            result.handedness[0][0].categoryName;


            const isRightHand =
            handedness === "Right";


        } else {

            console.log('未检测到手')
            await new Promise(resolve => setTimeout(resolve, 100));
            aiInfo.setGesture(null)
            // const video = this.modal.querySelector('video');
            // this.canvasCtx.drawImage(video, 0, 0, width, height);
            // ------------------------------------
            // 没检测到手
            // ------------------------------------

            // resultDiv.innerText =
            // "未检测到手";

        }


       
        // await new Promise(resolve => setTimeout(resolve, 50));
        // ------------------------------------
        // 下一帧继续检测
        // ------------------------------------

        // console.log('结束检测')
        requestAnimationFrame(this.detect.bind(this));

    }
    stopGesture(){
        this.isGestureActive = false;
        cancelAnimationFrame(this.detect);
        this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }


    // ========================================
    // 开始姿态识别
    // ========================================

    async startPoseDetection(poseLandmark) {

        console.log('开始弹窗姿态识别');
        console.log('poseLandmark',poseLandmark)

        // ------------------------------------
        // 检查视频 / 图片是否准备好
        // ------------------------------------

        if (this.videoType !== 'local') {

            const img = this.modal.querySelector('img');

            if (!img) {
                console.warn('视频流未准备好');
                return;
            }

        } else {

            const video = this.modal.querySelector('video');

            if (!video || video.readyState < 2) {
                console.warn('视频流未准备好');
                return;
            }
        }


        // ------------------------------------
        // 开启姿态识别
        // ------------------------------------

        this.isPoseActive = true;


        // ------------------------------------
        // 初始化
        // ------------------------------------

        await this.initPose(poseLandmark);
    }


    // ========================================
    // 初始化姿态识别
    // ========================================

    async initPose(poseLandmark) {

        try {

            console.log('开始初始化姿态识别');


            // ------------------------------------
            // 保存 Pose Landmarker
            // ------------------------------------

            poseLandmarker = poseLandmark;


            console.log(
                'poseLandmarker',
                poseLandmarker
            );


            // ------------------------------------
            // 开始检测
            // ------------------------------------

            this.detectPose();


        } catch (error) {

            console.error(
                "姿态识别初始化失败:",
                error
            );

        }

    }


    // ========================================
    // 绘制姿态骨骼连接线
    // ========================================

    drawPoseConnections(pose) {

        this.canvasCtx.beginPath();


        POSE_CONNECTIONS.forEach(
            ([startIndex, endIndex]) => {

                const start = pose[startIndex];
                const end = pose[endIndex];


                // ------------------------------------
                // 防止关键点不存在
                // ------------------------------------

                if (!start || !end) {
                    return;
                }


                // ------------------------------------
                // MediaPipe x/y 是 0~1
                // ------------------------------------

                const startX = this.mirror
                    ? (1 - start.x) * this.canvas.width
                    : start.x * this.canvas.width;

                const startY =
                    start.y * this.canvas.height;


                const endX = this.mirror
                    ? (1 - end.x) * this.canvas.width
                    : end.x * this.canvas.width;

                const endY =
                    end.y * this.canvas.height;


                // ------------------------------------
                // 绘制线段
                // ------------------------------------

                this.canvasCtx.moveTo(
                    startX,
                    startY
                );

                this.canvasCtx.lineTo(
                    endX,
                    endY
                );

            }
        );


        // ------------------------------------
        // 连接线样式
        // ------------------------------------

        this.canvasCtx.strokeStyle = "#00ff00";

        this.canvasCtx.lineWidth = 4;

        this.canvasCtx.lineCap = "round";

        this.canvasCtx.lineJoin = "round";


        this.canvasCtx.stroke();

    }


    // ========================================
    // 绘制姿态关键点
    // ========================================

    drawPosePoints(pose) {

        // ------------------------------------
        // 画面中心
        // ------------------------------------

        const centerX =
            this.canvas.width / 2;

        const centerY =
            this.canvas.height / 2;


        // ------------------------------------
        // 保存所有姿态关键点中心坐标
        // ------------------------------------

        const poseCenterPoints = {};


        // ------------------------------------
        // 只遍历指定的15个关键点
        // ------------------------------------

        POSE_DRAW_POINTS.forEach(index => {

            const point = pose[index];


            // ------------------------------------
            // 防止关键点不存在
            // ------------------------------------

            if (!point) {
                return;
            }


            // ------------------------------------
            // 计算 Canvas 上的位置
            // ------------------------------------

            const x = this.mirror
                ? (1 - point.x) * this.canvas.width
                : point.x * this.canvas.width;


            const y =
                point.y * this.canvas.height;


            // ------------------------------------
            // 转换成以画面中心为原点的坐标
            // ------------------------------------

            const centerPointX =
                Math.round(x - centerX);


            const centerPointY =
                Math.round(centerY - y);


            // ------------------------------------
            // 保存关键点坐标
            //
            // 例如：
            //
            // poseCenterPoints[0]  -> 鼻子
            // poseCenterPoints[2]  -> 左眼
            // poseCenterPoints[5]  -> 右眼
            //
            // poseCenterPoints[11] -> 左肩
            // poseCenterPoints[12] -> 右肩
            // ------------------------------------

            poseCenterPoints[index] = {

                x: centerPointX,

                y: centerPointY

            };


            // ------------------------------------
            // 绘制关键点
            // ------------------------------------

            this.canvasCtx.beginPath();

            this.canvasCtx.arc(
                x,
                y,
                7,
                0,
                Math.PI * 2
            );


            // ------------------------------------
            // 鼻子使用红色
            // 其他点使用青色
            // ------------------------------------

            if (index === 0) {

                this.canvasCtx.fillStyle =
                    "#ff0000";

            } else {

                this.canvasCtx.fillStyle =
                    "#00ffff";

            }


            this.canvasCtx.fill();


            // ------------------------------------
            // 白色边框
            // ------------------------------------

            this.canvasCtx.strokeStyle =
                "#ffffff";

            this.canvasCtx.lineWidth = 2;

            this.canvasCtx.stroke();


            // ------------------------------------
            // 绘制关键点编号
            // ------------------------------------

            this.canvasCtx.save();


            this.canvasCtx.translate(
                x,
                y
            );


            this.canvasCtx.fillStyle =
                "#ffffff";


            this.canvasCtx.font =
                "bold 16px Arial";


            this.canvasCtx.textBaseline =
                "alphabetic";


            this.canvasCtx.fillText(
                index,
                9,
                9
            );


            this.canvasCtx.restore();

        });


        // ------------------------------------
        // 将姿态关键点传出去
        // ------------------------------------

        if (aiInfo && aiInfo.setPose) {

            aiInfo.setPose(
                poseCenterPoints
            );

        }

    }


    // ========================================
    // 绘制完整姿态
    // ========================================

    async drawPoseLandmarks(pose) {

        // ------------------------------------
        // 先画骨骼
        // ------------------------------------

        this.drawPoseConnections(
            pose
        );


        // ------------------------------------
        // 再画关键点
        // ------------------------------------

        this.drawPosePoints(
            pose
        );

    }


    // ========================================
    // 实时姿态检测
    // ========================================

    async detectPose() {

        // ------------------------------------
        // 判断是否仍然开启姿态识别
        // ------------------------------------

        if (!this.isPoseActive) {
            return;
        }


        let width;

        let height;

        let imageData;


        // ====================================
        // 图片模式
        // ====================================

        if (this.videoType !== 'local') {

            const img =
                this.modal.querySelector('img');


            if (!img) {
                return;
            }


            // ------------------------------------
            // 图片加载失败
            // ------------------------------------

            if (
                img.complete &&
                img.naturalWidth === 0
            ) {

                console.log(
                    '图像加载失败'
                );

                return;
            }


            // ------------------------------------
            // 获取图片尺寸
            // ------------------------------------

            width = img.width;

            height = img.height;


            this.canvas.width =
                width;

            this.canvas.height =
                height;


            // ------------------------------------
            // 绘制原始图片
            // ------------------------------------

            this.canvasCtx.drawImage(
                img,
                0,
                0,
                width,
                height
            );


            // ------------------------------------
            // 获取 ImageData
            // ------------------------------------

            imageData =
                this.canvasCtx.getImageData(
                    0,
                    0,
                    width,
                    height
                );

        }

        // ====================================
        // 视频模式
        // ====================================

        else {

            const video =
                this.modal.querySelector('video');


            if (
                !video ||
                video.readyState < 2
            ) {

                return;
            }


            // ------------------------------------
            // 获取视频尺寸
            // ------------------------------------

            width =
                video.videoWidth;

            height =
                video.videoHeight;


            this.canvas.width =
                width;

            this.canvas.height =
                height;


            // ------------------------------------
            // 绘制视频
            // ------------------------------------

            this.canvasCtx.drawImage(
                video,
                0,
                0,
                width,
                height
            );


            // ------------------------------------
            // 获取 ImageData
            // ------------------------------------

            imageData =
                this.canvasCtx.getImageData(
                    0,
                    0,
                    width,
                    height
                );

        }


        // ====================================
        // 清除上一帧绘制
        // ====================================

        this.canvasCtx.clearRect(
            0,
            0,
            width,
            height
        );


        // ====================================
        // 获取时间戳
        // ====================================

        const now =
            performance.now();


        // ====================================
        // MediaPipe Pose 检测
        // ====================================

        const result =
            poseLandmarker.detectForVideo(
                imageData,
                now
            );


        // ====================================
        // 判断是否检测到人体
        // ====================================

        if (
            result.landmarks &&
            result.landmarks.length > 0
        ) {

            // ------------------------------------
            // 获取第一个人体
            // ------------------------------------

            const pose =
                result.landmarks[0];


            // ------------------------------------
            // 绘制姿态
            // ------------------------------------

            await this.drawPoseLandmarks(
                pose
            );


            // ------------------------------------
            // 如果需要，可以获取世界坐标
            // ------------------------------------

            // const worldPose =
            //     result.worldLandmarks[0];

        }

        // ====================================
        // 没有检测到人体
        // ====================================

        else {

            console.log(
                '未检测到人体'
            );


            // ------------------------------------
            // 等待100ms
            // ------------------------------------

            await new Promise(
                resolve =>
                    setTimeout(
                        resolve,
                        100
                    )
            );


            // ------------------------------------
            // 通知没有姿态
            // ------------------------------------

            if (
                aiInfo &&
                aiInfo.setPose
            ) {

                aiInfo.setPose(
                    null
                );

            }

        }


        // ====================================
        // 下一帧继续检测
        // ====================================

        requestAnimationFrame(
            this.detectPose.bind(this)
        );

    }
    stopPose(){
        this.isPoseActive = false;
        cancelAnimationFrame(this.detectPose);
        this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

}

// CommonJS 导出方式
module.exports = CameraModal;
