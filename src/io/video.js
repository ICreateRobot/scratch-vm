const StageLayering = require('../engine/stage-layering');
const jsQR = require('jsqr');  // 引入 jsQR 库
const axios = require('axios')
// const cv = require('opencv.js');  // 引入 OpenCV.js
const path= require('path')
// const opencvPath=path.join(__dirname, './model/opencv1.js')
const cv = require('../util/model/opencv1')
const tfjs = require('../util/model/tfjs.js')
const tf=require('../util/model/tf-core.min.js')
// const tf=require('../util/model/tfjs.js')
require('../util/model/tf-converter.min.js')
require('../util/model/tfjs-backend-webgl@latest.js')

const tflite = require('../util/model/tfjs-tflite.js')
// require('../util/model/teachablemachine-image.min.js')
// require('../util/model/tf-backend-cpu.min.js')

const faceapi = require('../util/model/face-api.min.js')
tf.setBackend('webgl').then(()=>{
    console.log('webgl后台')
})
// require('../util/model/tf-converter.min.js')
const cocoSsd = require('../util/model/coco-ssd')

const handTrack = require('../util/model/handtrack.min.js')

const aiInfo = require('../util/aiInfo.js')
const imageLoad = require('../util/imageLoad')
const socket=require('../util/socket-connect')
// const { AprilTagFamily } = require('apriltag')

// const tagConfig36h11  = require('apriltag/families/36h11.json')
const { startQRDetection,
        stopQRDetection,
        startFaceDetection,
        stopFaceDetection,
        learnNewFace,
        reSetFace,
        aprilTag,
        stopAprilTag,
        startColorDetection,
        stopColorDetection,
        startColorPlaceDetection,
        stopColorPlaceDetection,
        startWColorBlockDetection,
        stopWColorBlockDetection,
        startTrafficpre,
        stopTraffic,
        stopVideo
    } = require('./allmodel');

// require('https://cdnjs.cloudflare.com/ajax/libs/mathjs/7.1.0/math.min.js')
require('../util/model/lz-string.min.js')
const Comlink = require('../util/model/comlink.js')
const Base64 = require('../util/model/base64.js')
let lastHash = null;
let unchangedFrames = 0;
const MAX_UNCHANGED = 10;

let traficModel
let model, webcam, labelContainer, maxPredictions;
let isLoadVideo=false
let THIS

class Video {
    constructor (runtime) {
        this.runtime = runtime;

        /**
         * @typedef VideoProvider
         * @property {Function} enableVideo - Requests camera access from the user, and upon success,
         * enables the video feed
         * @property {Function} disableVideo - Turns off the video feed
         * @property {Function} getFrame - Return frame data from the video feed in
         * specified dimensions, format, and mirroring.
         */
        this.provider = null;

        /**
         * Id representing a Scratch Renderer skin the video is rendered to for
         * previewing.
         * @type {number}
         */
        this._skinId = -1;

        /**
         * Id for a drawable using the video's skin that will render as a video
         * preview.
         * @type {Drawable}
         */
        this._drawable = -1;

        /**
         * Store the last state of the video transparency ghost effect
         * @type {number}
         */
        this._ghost = 0;

        /**
         * Store a flag that allows the preview to be forced transparent.
         * @type {number}
         */
        this._forceTransparentPreview = false;

        THIS=this
         this.isQRDetectionActive = false; // 记录二维码检测是否激活
        this.isFaceDetectionActive = false; // 记录人脸检测是否激活
        this.preQrData=''

        // 画布和上下文
        this.canvas = document.createElement('canvas');
        this.canvasCtx = this.canvas.getContext('2d');

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


        //颜色识别变量
        this.isColorDetectionActive=false

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


        this.detections=[];
        this.imgSaveRequested=0;
        this.isAprilTagActive=false

        this.isColorPlaceDetectionActive = false;

        this._canvas = document.createElement('canvas');
        this._canvas.width = Video.DIMENSIONS[0];
        this._canvas.height = Video.DIMENSIONS[1];
        this._context = this._canvas.getContext('2d');

        this.checkVideo=null
    }

    static get FORMAT_IMAGE_DATA () {
        return 'image-data';
    }

    static get FORMAT_CANVAS () {
        return 'canvas';
    }

    /**
     * Dimensions the video stream is analyzed at after its rendered to the
     * sample canvas.
     * @type {Array.<number>}
     */
    static get DIMENSIONS () {
        return [480, 360];
    }

    /**
     * Order preview drawable is inserted at in the renderer.
     * @type {number}
     */
    static get ORDER () {
        return 1;
    }


    get video (){
        return this.provider.video
    }

    get videoProvider(){
        return this.provider
    }
    /**
     * Set a video provider for this device. A default implementation of
     * a video provider can be found in scratch-gui/src/lib/video/video-provider
     * @param {VideoProvider} provider - Video provider to use
     */
    setProvider (provider) {
        this.provider = provider;
    }

    /**
     * Request video be enabled.  Sets up video, creates video skin and enables preview.
     *
     * ioDevices.video.requestVideo()
     *
     * @return {Promise.<Video>} resolves a promise to this IO device when video is ready.
     */
    enableVideo () {
        if (!this.provider) return null;
        return this.provider.enableVideo().then(() => this._setupPreview());
    }


    hashImageData(data) {
        let hash = 0;
        for (let i = 0; i < data.length; i += 1000) {
            hash += data[i]; // 简单 hash 算法
        }
        return hash;
    }
    async enableVideoIC () {
        if (!this.provider) return null;
        console.log('---------------------------')
        console.log(this.provider)
        this.disableVideo()
        
        window.addEventListener('offline', () => {
            if(this.provider.constructor.name!='VideoProvider'){
                imageLoad.setIsImage(false)
                console.log('Network is offline. Disabling video feed.');
                
    
                // this.stopQRDetection()
                // this.stopWGestureRecognition()
                // this.stopFaceDetection()
                // this.stopWItem()
                // this.stopWColorBlockDetection()
                // this.stopAprilTag()
                if(this.isQRDetectionActive){
                    this.stopQRDetection()
                }
                if(this.isGestureDetectionActive){
                    this.stopWGestureRecognition()
                }
                if(this.isFaceDetectionActive){
                    this.stopFaceDetection()
                }
                if(this.isStartObject){
                    this.stopWItem()
                }
                if(this.isColorBlockDetectionActive){
                    this.stopWColorBlockDetection()
                }
                if(this.isAprilTagActive){
                    this.stopAprilTag()
                }
                if(this.isColorDetectionActive){
                    this.stopColorDetection()
                }
    
                this.disableVideo();
                this.stopVideo()
            }
            
        });
        return this.provider.enableVideo().then(async () =>{
            this._setupPreview() 

            await new Promise(resolve => setTimeout(resolve, 1500));  
            if(this.checkVideo) clearInterval(this.checkVideo)
            unchangedFrames=0
            this.checkVideo=setInterval(async() => {
                if (!this._context || !this._canvas) return;
                try{
                    this._context.drawImage(this.provider._img, 0, 0);
                    const imageData = this._context.getImageData(0, 0, this._canvas.width, this._canvas.height);
                    const hash = this.hashImageData(imageData.data);
            
                    if (hash === lastHash) {
                        unchangedFrames++;
                    } else {
                        unchangedFrames = 0;
                    }
                    lastHash = hash;
            
                    if (unchangedFrames >= MAX_UNCHANGED) {
                        console.warn("图像静止太久，可能断流！");
                        // this.channelLoad.postMessage(false);
                        // alert("图传已中断！");
                        imageLoad.setIsImage(false)
                        imageLoad.setIsK210(false)
                        
                        if(this.isQRDetectionActive){
                            this.stopQRDetection()
                        }
                        if(this.isGestureDetectionActive){
                            this.stopWGestureRecognition()
                        }
                        if(this.isFaceDetectionActive){
                            this.stopFaceDetection()
                        }
                        if(this.isStartObject){
                            this.stopWItem()
                        }
                        if(this.isColorBlockDetectionActive){
                            this.stopWColorBlockDetection()
                        }
                        if(this.isAprilTagActive){
                            this.stopAprilTag()
                        }
                        if(this.isColorDetectionActive){
                            this.stopColorDetection()
                        }


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
                            let context=[]
                            context.push(str)
                            await socket.setSocket(context)
                        }else if(socket.checkWebSocketStatus()==2){
                            socket.getSocket().send(str);
                        }
                        await new Promise(resolve => setTimeout(resolve, 50));  
                        this.disableVideo();
                        this.stopVideo()
                        clearInterval(this.checkVideo)
                    }
                }catch(e){
                    console.log('filed'+e)
                    if(this.provider.constructor.name!='VideoProvider'){
                        this.disableVideo();
                        
                    }
                    clearInterval(this.checkVideo)
                    
                }
            }, 1000);
            // this._context.scale(-1, 1);

            // Start the image update loop
            // this._startImageLoop();
            
        } );
    }

    /**
     * Disable video stream (turn video off)
     * @return {void}
     */
    disableVideo () {
        this._disablePreview();
        if (!this.provider) return null;
        this.provider.disableVideo();
        this.disableVideoIC()
    }
    disableVideoIC(){
        isLoadVideo=false
        this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        clearInterval(this.checkVideo)
    }

    /**
     * Return frame data from the video feed in a specified dimensions, format, and mirroring.
     *
     * @param {object} frameInfo A descriptor of the frame you would like to receive.
     * @param {Array.<number>} frameInfo.dimensions [width, height] array of numbers.  Defaults to [480,360]
     * @param {boolean} frameInfo.mirror If you specificly want a mirror/non-mirror frame, defaults to the global
     *                                   mirror state (ioDevices.video.mirror)
     * @param {string} frameInfo.format Requested video format, available formats are 'image-data' and 'canvas'.
     * @param {number} frameInfo.cacheTimeout Will reuse previous image data if the time since capture is less than
     *                                        the cacheTimeout.  Defaults to 16ms.
     *
     * @return {ArrayBuffer|Canvas|string|null} Frame data in requested format, null when errors.
     */
    getFrame ({
        dimensions = Video.DIMENSIONS,
        mirror = this.mirror,
        format = Video.FORMAT_IMAGE_DATA,
        cacheTimeout = this._frameCacheTimeout
    }) {
        // if (this.provider) return this.provider.getFrame({dimensions, mirror, format, cacheTimeout});
        // return null;

        if (this.provider && this.provider.constructor.name!='VideoProvider'){
            // console.log(this.provider.getFrame({dimensions, mirror, format, cacheTimeout}))
            // eslint-disable-next-line no-negated-condition
            if(!this.provider.getFrame({dimensions, mirror, format, cacheTimeout})){
                if(isLoadVideo){
                    isLoadVideo=false
                    console.log('发送了一次关闭')
                    try{
                    
                        if(this.isQRDetectionActive){
                            this.stopQRDetection()
                        }
                        if(this.isGestureDetectionActive){
                            this.stopWGestureRecognition()
                        }
                        if(this.isFaceDetectionActive){
                            this.stopFaceDetection()
                        }
                        if(this.isStartObject){
                            this.stopWItem()
                        }
                        if(this.isColorBlockDetectionActive){
                            this.stopWColorBlockDetection()
                        }
                        if(this.isAprilTagActive){
                            this.stopAprilTag()
                        }
                        if(this.isColorDetectionActive){
                            this.stopColorDetection()
                        }
        
        
                        let jsonData = {
                            "command":"camera",
                            "params":{
                                "mode":0
                            }
                        }
                        // let str = `robot.close_camera()\r`;
                        let str = JSON.stringify(jsonData)
                        if(socket.checkWebSocketStatus()==4 || socket.checkWebSocketStatus()==0){
                            console.log('断开连接，尝试重连')
                            let context = []
                            context.push(str)
                            socket.setSocket(context)
                        } else if (socket.checkWebSocketStatus()==2){
                            socket.getSocket().send(str);
                        }
                        this.disableVideo();
                        this.stopVideo()
                    } catch (e){
                        this.disableVideo();
                    }
                }
            }else{
                isLoadVideo=true
            }
            return this.provider.getFrame({dimensions, mirror, format, cacheTimeout});
        }else if( this.provider.constructor.name=='VideoProvider'){
            return this.provider.getFrame({dimensions, mirror, format, cacheTimeout});
        }
        console.log('-----------------------------------------------')
        return null;
    }

    startQRDetection (){
        startQRDetection(this, Video, aiInfo, jsQR, StageLayering);
    }
    stopQRDetection (){
        stopQRDetection(this);
    }

    startFaceDetection(){
        startFaceDetection(this,Video,cv,aiInfo,StageLayering)
    }
    stopFaceDetection(){
        stopFaceDetection(this,cv)
    }

    learnNewFace(name){
        learnNewFace(name,this,cv)
    }

    reSetFace(){
        reSetFace(this)
    }

    aprilTag(){
        aprilTag(this,Video,aiInfo,StageLayering,Base64,Comlink)
    }

    stopAprilTag(){
        stopAprilTag(this)
    }

    startColorDetection(){
        startColorDetection(this,Video,StageLayering,cv,aiInfo)
    }

    stopColorDetection(){
        stopColorDetection(this)
    }

    startColorPlaceDetection(){
        startColorPlaceDetection(this,Video,cv,StageLayering,aiInfo)
    }

    stopColorPlaceDetection(){
        stopColorPlaceDetection(this)
    }

    startWColorBlockDetection(){
        startWColorBlockDetection(this,Video,cv,StageLayering,aiInfo)
    }

    stopWColorBlockDetection(){
        stopWColorBlockDetection(this)
    }

    startTrafficpre(){
        startTrafficpre(this,Video,StageLayering,tfjs,aiInfo)
    }

    stopTraffic(){
        stopTraffic(this)
    }
    stopVideo(){
        stopVideo(this,Video,StageLayering)
    }
    /**
     * Set the preview ghost effect
     * @param {number} ghost from 0 (visible) to 100 (invisible) - ghost effect
     */
    setPreviewGhost (ghost) {
        this._ghost = ghost;
        // Confirm that the default value has been changed to a valid id for the drawable
        if (this._drawable !== -1) {
            this.runtime.renderer.updateDrawableEffect(
                this._drawable,
                'ghost',
                this._forceTransparentPreview ? 100 : ghost
            );
        }
    }

    _disablePreview () {
        if (this._skinId !== -1) {
            this.runtime.renderer.updateBitmapSkin(this._skinId, new ImageData(...Video.DIMENSIONS), 1);
            this.runtime.renderer.updateDrawableVisible(this._drawable, false);
        }
        this._renderPreviewFrame = null;
    }

    _setupPreview () {
        const {renderer} = this.runtime;
        if (!renderer) return;

        if (this._skinId === -1 && this._drawable === -1) {
            this._skinId = renderer.createBitmapSkin(new ImageData(...Video.DIMENSIONS), 1);
            this._drawable = renderer.createDrawable(StageLayering.VIDEO_LAYER);
            renderer.updateDrawableSkinId(this._drawable, this._skinId);
            // TW: Video probably contains the user's face. This is private information.
            // This API won't exist if we're using a vanilla scratch-render
            if (renderer.markSkinAsPrivate) {
                renderer.markSkinAsPrivate(this._skinId);
            }
            if (renderer.markDrawableAsNoninteractive) {
                renderer.markDrawableAsNoninteractive(this._drawable);
            }
        }

        // if we haven't already created and started a preview frame render loop, do so
        if (!this._renderPreviewFrame) {
            renderer.updateDrawableEffect(this._drawable, 'ghost', this._forceTransparentPreview ? 100 : this._ghost);
            renderer.updateDrawableVisible(this._drawable, true);

            this._renderPreviewFrame = () => {
                clearTimeout(this._renderPreviewTimeout);
                if (!this._renderPreviewFrame) {
                    return;
                }

                this._renderPreviewTimeout = setTimeout(this._renderPreviewFrame, this.runtime.currentStepTime);

                const imageData = this.getFrame({
                    format: Video.FORMAT_IMAGE_DATA,
                    cacheTimeout: this.runtime.currentStepTime
                });

                if (!imageData) {
                    renderer.updateBitmapSkin(this._skinId, new ImageData(...Video.DIMENSIONS), 1);
                    return;
                }

                renderer.updateBitmapSkin(this._skinId, imageData, 1);
                this.runtime.requestRedraw();
            };

            this._renderPreviewFrame();
        }
    }

    get videoReady () {
        if (this.provider) return this.provider.videoReady;
        return false;
    }

    /**
     * Method implemented by all IO devices to allow external changes.
     * The only change available externally is hiding the preview, used e.g. to
     * prevent drawing the preview into project thumbnails.
     * @param {object} - data passed to this IO device.
     * @property {boolean} forceTransparentPreview - whether the preview should be forced transparent.
     */
    postData ({forceTransparentPreview}) {
        this._forceTransparentPreview = forceTransparentPreview;
        // Setting the ghost to the current value will pick up the forceTransparentPreview
        // flag and override the current ghost. The complexity is to prevent blocks
        // from overriding forceTransparentPreview
        this.setPreviewGhost(this._ghost);
    }
}


module.exports = Video;
