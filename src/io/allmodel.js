function calculateCenter(points) {
    let sumX = 0, sumY = 0;
    for (const point of points) {
        sumX += point.x;
        sumY += point.y;
    }
    return {
        x: sumX / points.length,
        y: sumY / points.length
    };
}

function processQRDetection(self, jsQR, aiInfo, Video) {
    if (!self.isQRDetectionActive) return;

    if (self.provider && self.provider.videoReady) {
        let imageData;
        try {
            imageData = self.getFrame({
                format: Video.FORMAT_IMAGE_DATA,
                cacheTimeout: self.runtime.currentStepTime
            });
        } catch (e) {
            console.log(e);
        }

        if (imageData) {
            self.canvas.width = Video.DIMENSIONS[0];
            self.canvas.height = Video.DIMENSIONS[1];
            self.canvasCtx.putImageData(imageData, 0, 0);

            const qrCode = jsQR(
                self.canvasCtx.getImageData(0, 0, self.canvas.width, self.canvas.height).data,
                self.canvas.width,
                self.canvas.height
            );

            self.canvasCtx.clearRect(0, 0, self.canvas.width, self.canvas.height);

            if (qrCode) {
                aiInfo.setQr(qrCode.data);
                let location = [
                    qrCode.location.topLeftFinderPattern,
                    qrCode.location.topRightFinderPattern,
                    qrCode.location.bottomRightAlignmentPattern,
                    qrCode.location.bottomLeftFinderPattern
                ];

                const center = calculateCenter(location);
                location.push({ x: Math.round(center.x), y: Math.round(center.y) });

                aiInfo.setQrLocation(location);

                const width = Math.round(Math.abs(qrCode.location.topLeftFinderPattern.x - qrCode.location.topRightFinderPattern.x));
                const height = Math.round(Math.abs(qrCode.location.topLeftFinderPattern.y - qrCode.location.bottomLeftFinderPattern.y));
                aiInfo.setQrWh([width, height]);

                const corners = qrCode.location;
                self.canvasCtx.beginPath();
                self.canvasCtx.moveTo(corners.topLeftCorner.x, corners.topLeftCorner.y);
                self.canvasCtx.lineTo(corners.topRightCorner.x, corners.topRightCorner.y);
                self.canvasCtx.lineTo(corners.bottomRightCorner.x, corners.bottomRightCorner.y);
                self.canvasCtx.lineTo(corners.bottomLeftCorner.x, corners.bottomLeftCorner.y);
                self.canvasCtx.closePath();

                self.canvasCtx.strokeStyle = 'red';
                self.canvasCtx.lineWidth = 2;
                self.canvasCtx.stroke();

                const updatedImage = self.canvasCtx.getImageData(0, 0, self.canvas.width, self.canvas.height);
                self.renderer.updateBitmapSkin(self.faceSkinId, updatedImage, 1);
                self.runtime.requestRedraw();

                self.runtime.emit('qrDetected', qrCode.data);
            } else {
                aiInfo.setQr(null);
                aiInfo.setQrLocation(null);
                self.runtime.emit('qrDetected', null);

                self.canvasCtx.clearRect(0, 0, self.canvas.width, self.canvas.height);
                const updatedImage = self.canvasCtx.getImageData(0, 0, self.canvas.width, self.canvas.height);
                self.renderer.updateBitmapSkin(self.faceSkinId, updatedImage, 1);
                self.runtime.requestRedraw();
            }
        }
    }

    requestAnimationFrame(() => processQRDetection(self,jsQR, aiInfo, Video));
}

function startQRDetection(self, Video, aiInfo, jsQR, StageLayering) {
    console.log('开始二维码检测');
    self.canvas.width = Video.DIMENSIONS[0];
    self.canvas.height = Video.DIMENSIONS[1];

    const { renderer } = self.runtime;
    self.renderer = renderer;
    if (!renderer) {
        console.error('Renderer 未初始化');
        return;
    }

    self.faceSkinId = renderer.createBitmapSkin(new ImageData(...Video.DIMENSIONS), 1);
    self.faceDrawableId = renderer.createDrawable(StageLayering.VIDEO_LAYER);

    if (renderer.markSkinAsPrivate) {
        renderer.markSkinAsPrivate(self.faceSkinId);
    }

    renderer.updateDrawableSkinId(self.faceDrawableId, self.faceSkinId);
    renderer.updateDrawableVisible(self.faceDrawableId, true);
    renderer.updateDrawableEffect(self.faceDrawableId, 'ghost', 0);

    self.isQRDetectionActive = true;
    processQRDetection(self,jsQR, aiInfo, Video);
}

function stopQRDetection(self) {
    self.isQRDetectionActive = false;
    cancelAnimationFrame(self.processQRDetection);  // 注意是否有动画帧绑定逻辑

    self.canvasCtx.clearRect(0, 0, self.canvas.width, self.canvas.height);
    const imageData = self.canvasCtx.getImageData(0, 0, self.canvas.width, self.canvas.height);
    self.renderer.updateBitmapSkin(self.faceSkinId, imageData, 1);
    self.runtime.requestRedraw();
}




//  // 初始化 OpenCV 和人脸检测
async function initializeOpenCV(that,cv) {

    const currentURL = window.location.href;

    // 获取前一级路径
    const oneLevelUp = currentURL.substring(0, currentURL.lastIndexOf('/'));
    // 获取前两级路径
    const twoLevelsUp = oneLevelUp.substring(0, oneLevelUp.lastIndexOf('/'));
    const modelPath =twoLevelsUp+'/static/model';  // 你的模型路径
    console.log(modelPath)
    console.log(window.location.href)

    try {
        const response = await fetch(modelPath+'/haarcascade_frontalface_default.xml');
        if (!response.ok) {
            throw new Error(`获取人脸模型失败: ${response.statusText}`);
        }
        const buffer = await response.arrayBuffer(); // 读取为二进制数据
        console.log('haarcascade_frontalface_default.xml加载成功');

        console.log(cv);

        console.log('OpenCV.js 已初始化');
        that.classifier = new cv.CascadeClassifier();
        const data = new Uint8Array(buffer);
        cv.FS_createDataFile('/', 'haarcascade_frontalface_default.xml', data, true, false, false);

        if (!that.classifier.load('haarcascade_frontalface_default.xml')) {
            console.error('无法加载人脸模型文件');
            return;
        }
        console.log('人脸模型加载成功');
        
        // cv.onRuntimeInitialized = () => {
            
        // };
    } catch (error) {
        console.error(`Error loading model: ${error.message}`);
    }
}

// 提取 LBP 特征
function extractLBPFeatures(faceImage,cv) {
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
function calculateHistogramDistance(hist1, hist2,cv) {
    return cv.compareHist(hist1, hist2, cv.HISTCMP_CHISQR);
}

// 查找最接近的人脸
function findClosestMatch(faceImage,cv,that) {
    const features = extractLBPFeatures(faceImage,cv);
    let minDistance = Infinity;
    let matchedName = '陌生人';

    // 设置一个阈值（可以根据实际情况调整）
    const threshold = 0.5;

    for (const entry of that.faceDatabase) {
        const distance = calculateHistogramDistance(features, entry.features,cv);
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
function learnNewFace(name,that,cv) {
    const features = extractLBPFeatures(that.faceImage,cv);
    that.faceDatabase.push({ name, features });
    console.log(`Learned new face: ${name}`);
}

function reSetFace(that){
    that.faceDatabase=[]
}

    // 启动人脸检测
async function startFaceDetection(that,Video,cv,aiInfo,StageLayering) {
    if (!that.classifier) {
        console.log('OpenCV 尚未初始化，开始初始化...');
        await initializeOpenCV(that,cv);
    }

    that.canvas.width = Video.DIMENSIONS[0];
    that.canvas.height = Video.DIMENSIONS[1];

    const { renderer } = that.runtime;
    that.renderer = renderer;
    if (!that.renderer) {
        console.error('Renderer 未初始化');
        return;
    }

    that.faceSkinId = that.renderer.createBitmapSkin(new ImageData(...Video.DIMENSIONS), 1);
    that.faceDrawableId = that.renderer.createDrawable(StageLayering.VIDEO_LAYER);

    if (that.renderer.markSkinAsPrivate) {
        that.renderer.markSkinAsPrivate(that.faceSkinId);
    }

    that.renderer.updateDrawableSkinId(that.faceDrawableId, that.faceSkinId);
    that.renderer.updateDrawableVisible(that.faceDrawableId, true);
    that.renderer.updateDrawableEffect(that.faceDrawableId, 'ghost', 0);

    that.isFaceDetectionActive = true;
    processVideo(that,Video,cv,aiInfo);
}

// 停止人脸检测
function stopFaceDetection(that,cv) {
    that.isFaceDetectionActive = false;
    clearTimeout(that.processVideoTimeout);
    if (that.src) that.src.delete();
    if (that.dst) that.dst.delete();
    if (that.gray) that.gray.delete();
    if (that.cap) that.cap.delete();
    if (that.faceImage) {
        that.faceImage.delete();
        that.faceImage = null;
    }

    try {
        cv.FS_unlink('/haarcascade_frontalface_default.xml');
    } catch (e) {
        console.log('模型文件之前不存在');
    }
    // if (that.faces) that.faces.delete();
    that.canvasCtx.clearRect(0, 0, that.canvas.width, that.canvas.height);
    const ImageData = that.canvasCtx.getImageData(0, 0, that.canvas.width, that.canvas.height);
    that.renderer.updateBitmapSkin(that.faceSkinId, ImageData, 1);
    that.runtime.requestRedraw();
}


async function processVideo(that,Video,cv,aiInfo) {
    if (!that.isFaceDetectionActive) return;

    const begin = Date.now();

    try {
        // 1. 获取当前帧
        const imageData = that.getFrame({
            format: Video.FORMAT_IMAGE_DATA,
            cacheTimeout: that.runtime.currentStepTime
        });

        // 2. 图像处理
        const srcMat = cv.matFromImageData(imageData);
        const grayMat = new cv.Mat();
        cv.cvtColor(srcMat, grayMat, cv.COLOR_RGBA2GRAY);

        const faces = new cv.RectVector();
        const minSize = new cv.Size(30, 30);
        const maxSize = new cv.Size(300, 300);
        that.classifier.detectMultiScale(grayMat, faces, 1.1, 3, 0, minSize, maxSize);

        // 3. 清空画布
        that.canvasCtx.clearRect(0, 0, that.canvas.width, that.canvas.height);
        aiInfo.setFaceNum(faces.size());

        for (let i = 0; i < faces.size(); i++) {
            const face = faces.get(i);

            const faceImage = srcMat.roi(face);
            const wh = [Math.round(face.width), Math.round(face.height)];
            aiInfo.setFaceWh(wh);
            aiInfo.setFaceLocation({
                x: Math.round(face.x - 255 + face.width / 2),
                y: Math.round(face.y - 223 + face.height / 2)
            });

            // 复制用于匹配的 faceImage
            that.faceImage = faceImage.clone(); // 避免外部引用影响原图

            const name = findClosestMatch(faceImage,cv,that);
            aiInfo.setIsSym(name !== '陌生人');
            aiInfo.setResultFace(name);

            // 绘制人脸框与标签
            that.canvasCtx.strokeStyle = 'red';
            that.canvasCtx.lineWidth = 2;
            that.canvasCtx.strokeRect(face.x, face.y, face.width, face.height);
            that.canvasCtx.fillStyle = 'red';
            that.canvasCtx.font = '16px Arial';
            that.canvasCtx.fillText(name, face.x, face.y - 10);

            // ✅ 释放每个 faceImage 临时 Mat
            faceImage.delete();
        }

        // 4. 更新渲染
        const renderedImage = that.canvasCtx.getImageData(0, 0, that.canvas.width, that.canvas.height);
        that.renderer.updateBitmapSkin(that.faceSkinId, renderedImage, 1);
        that.runtime.requestRedraw();

        // ✅ 释放 Mat 对象
        srcMat.delete();
        grayMat.delete();
        faces.delete();
    } catch (e) {
        console.warn('processVideo error:', e);

        // 出错时也清空画布，避免残影
        that.canvasCtx.clearRect(0, 0, that.canvas.width, that.canvas.height);
        const fallbackImage = that.canvasCtx.getImageData(0, 0, that.canvas.width, that.canvas.height);
        that.renderer.updateBitmapSkin(that.faceSkinId, fallbackImage, 1);
    }

    // 5. 控制帧率，使用 setTimeout 避免重入
    const delay = Math.max(0, 1000 / that.FPS - (Date.now() - begin));
    that.processVideoTimeout = setTimeout(() => processVideo(that,Video,cv,aiInfo), delay);
}



async function aprilTag(that,Video,aiInfo,StageLayering,Base64,Comlink){

    that.canvas.width = Video.DIMENSIONS[0];
    that.canvas.height = Video.DIMENSIONS[1];

    that.isAprilTagActive=true

    const {renderer} = that.runtime;
    that.renderer=renderer
    if (!that.renderer) {
        console.error('Renderer 未初始化');
        return;
    }

    // 创建一个新的 skin 和 drawable 用于 face detection
    that.faceSkinId = that.renderer.createBitmapSkin(new ImageData(...Video.DIMENSIONS), 1);
    that.faceDrawableId = that.renderer.createDrawable(StageLayering.VIDEO_LAYER);

    console.log('创建的 faceSkinId:', that.faceSkinId);
    
    if (that.renderer.markSkinAsPrivate) {
        that.renderer.markSkinAsPrivate(that.faceSkinId);
    }

    that.renderer.updateDrawableSkinId(that.faceDrawableId, that.faceSkinId);
    that.renderer.updateDrawableVisible(that.faceDrawableId, true);
    that.renderer.updateDrawableEffect(that.faceDrawableId, 'ghost', 0); // 确保没有透明度

    const currentURL = window.location.href;

    // 获取前一级路径
    const oneLevelUp = currentURL.substring(0, currentURL.lastIndexOf('/'));
    // 获取前两级路径
    const twoLevelsUp = oneLevelUp.substring(0, oneLevelUp.lastIndexOf('/'));
    const modelPath =twoLevelsUp+'/static/model';  // 你的模型路径
    // WebWorkers use `postMessage` and therefore work with Comlink.
    const Apriltag = Comlink.wrap(new Worker(modelPath+"/apriltag.js"));

    // must call that to init apriltag detector; argument is a callback for when the detector is ready
    window.apriltag = await new Apriltag(Comlink.proxy(() => {

        // set camera info; we must define these according to the device and image resolution for pose computation
        //window.apriltag.set_camera_info(double fx, double fy, double cx, double cy)

        window.apriltag.set_tag_size(5, .5);

        // start processing frames
        
        requestAnimationFrame(() => process_frame(that,aiInfo,Base64,Video));
    }));
}


function getAprilDistance(x1,y1,x2,y2){
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function mirrorImageData(imageData) {
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
async function process_frame(that,aiInfo,Base64,Video) {
    if(!that.isAprilTagActive) return
    // console.log('处理帧')
    // canvas.width = video.videoWidth;
    // canvas.height = video.videoHeight;
    // let ctx = canvas.getContext("2d");
    that.canvasCtx.clearRect(0, 0, that.canvas.width, that.canvas.height); 
    let imageData;

    try{
        imageData = that.getFrame({
            format: Video.FORMAT_IMAGE_DATA,
            cacheTimeout: that.runtime.currentStepTime
        });
    }catch(e){
        console.log(e)
    }

        // 始终复制原始 imageData，无论是否镜像
    const copied = new Uint8ClampedArray(imageData.data); // 拷贝 pixel 数据
    imageData = new ImageData(copied, imageData.width, imageData.height);

    if (that.mirror) {
        imageData = mirrorImageData(imageData);
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
    let grayscalePixels = new Uint8Array(that.canvasCtx.canvas.width * that.canvasCtx.canvas.height); // that is the grayscale image we will pass to the detector
    
    for (var i = 0, j = 0; i < imageDataPixels.length; i += 4, j++) {
        let grayscale = Math.round((imageDataPixels[i] + imageDataPixels[i + 1] + imageDataPixels[i + 2]) / 3);
        grayscalePixels[j] = grayscale; // single grayscale value
        imageDataPixels[i] = grayscale;
        imageDataPixels[i + 1] = grayscale;
        imageDataPixels[i + 2] = grayscale;
    }

    // that.canvasCtx.putImageData(imageData, 0, 0);


    if(that.detections.length==0){
        aiInfo.setAprilInfo(-1)
        aiInfo.setAprilLocation(null)
        aiInfo.setAprilWh(null)
    }
    // draw previous detection
    // that.detections.forEach(det => {
    //     // console.log(det)

    //     let distance=that.getAprilDistance(det.corners[0].x,det.corners[0].y,det.corners[1].x,det.corners[1].y)
    //     aiInfo.setAprilInfo(det.id)
    //     let xCenter=det.center.x-255
    //     let yCenter=-1*(det.center.y-223)
    //     aiInfo.setAprilLocation({
    //         x:Math.round(xCenter),
    //         y:Math.round(yCenter)
    //     })
    //     aiInfo.setAprilWh(Math.round(distance))

    //   // draw tag borders
    //   that.canvasCtx.beginPath();
    //   that.canvasCtx.lineWidth = "5";
    //   that.canvasCtx.strokeStyle = "red";
    //   that.canvasCtx.moveTo(det.corners[0].x, det.corners[0].y);
    //   that.canvasCtx.lineTo(det.corners[1].x, det.corners[1].y);
    //   that.canvasCtx.lineTo(det.corners[2].x, det.corners[2].y);
    //   that.canvasCtx.lineTo(det.corners[3].x, det.corners[3].y);
    //   that.canvasCtx.lineTo(det.corners[0].x, det.corners[0].y);
    //   that.canvasCtx.font = "bold 20px Arial";
    //     var txt = ""+det.id;
    //     that.canvasCtx.fillStyle = "red";
    //     that.canvasCtx.textAlign = "center";
    //     that.canvasCtx.fillText(txt, det.center.x, det.center.y+5);
    //     that.canvasCtx.stroke();
        
    // });

    let biggestDet = null;
    let maxEdgeLength = 0;
    that.detections.forEach(det => {
        const p1 = det.corners[0];
        const p2 = det.corners[1];
        const edgeLength = getAprilDistance(p1.x, p1.y, p2.x, p2.y);
    
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

        if(that.mirror){
            centerX = that.canvas.width - det.center.x;
            centerY=det.center.y;
            Corners = det.corners.map(p => ({
                x: that.canvas.width - p.x,
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
    
        const xCenter = centerX - 255;
        const yCenter = -1 * (centerY - 223);
        const distance = getAprilDistance(det.corners[0].x, det.corners[0].y, det.corners[1].x, det.corners[1].y);
    
        aiInfo.setAprilLocation({
            x: Math.round(xCenter),
            y: Math.round(yCenter)
        });
        aiInfo.setAprilWh(Math.round(distance));

        that.canvasCtx.beginPath();
        that.canvasCtx.lineWidth = "5";
        that.canvasCtx.strokeStyle = "red";
        that.canvasCtx.moveTo(Corners[0].x, Corners[0].y);
        that.canvasCtx.lineTo(Corners[1].x, Corners[1].y);
        that.canvasCtx.lineTo(Corners[2].x, Corners[2].y);
        that.canvasCtx.lineTo(Corners[3].x, Corners[3].y);
        that.canvasCtx.lineTo(Corners[0].x, Corners[0].y);
    
        that.canvasCtx.font = "bold 20px Arial";
        that.canvasCtx.fillStyle = "red";
        that.canvasCtx.textAlign = "center";
        that.canvasCtx.fillText(`${det.id}`,centerX, det.center.y + 5);
        that.canvasCtx.stroke();
        

        // 绘制框线和 ID
        // that.canvasCtx.beginPath();
        // that.canvasCtx.lineWidth = "5";
        // that.canvasCtx.strokeStyle = "red";
        // that.canvasCtx.moveTo(det.corners[0].x, det.corners[0].y);
        // that.canvasCtx.lineTo(det.corners[1].x, det.corners[1].y);
        // that.canvasCtx.lineTo(det.corners[2].x, det.corners[2].y);
        // that.canvasCtx.lineTo(det.corners[3].x, det.corners[3].y);
        // that.canvasCtx.lineTo(det.corners[0].x, det.corners[0].y);

        // that.canvasCtx.font = "bold 20px Arial";
        // that.canvasCtx.fillStyle = "red";
        // that.canvasCtx.textAlign = "center";
        // that.canvasCtx.fillText(`${det.id}`, det.center.x, det.center.y + 5);
        // that.canvasCtx.stroke();
        
    }
    
    // detect aprilTag in the grayscale image given by grayscalePixels
    that.detections = await apriltag.detect(grayscalePixels, that.canvasCtx.canvas.width, that.canvasCtx.canvas.height);
    
    if (that.imgSaveRequested && that.detections.length > 0) {
        let savep = Base64.bytesToBase64(that.canvasCtx.getImageData(0, 0, that.canvasCtx.canvas.width, that.canvasCtx.canvas.height).data);
        var det = JSON.stringify({
            det_data: that.detections[0],
            img_data: LZString.compressToUTF16(savep),
            img_width:  that.canvasCtx.canvas.width,
            img_height: that.canvasCtx.canvas.height
        });
    
        //console.log("Saving detection data.");
        // localStorage.setItem("detectData", det);
        // buttonToggle();
        // loadImg('saved_det');
    }

        // 渲染到 renderer
        const {renderer} = that.runtime;
        if (!renderer) {
            console.error('Renderer 未初始化');
            return;
        }

        // 更新 renderer 的 skin 内容
        const updatedImageData = that.canvasCtx.getImageData(0, 0, that.canvas.width, that.canvas.height);
        that.renderer.updateBitmapSkin(that.faceSkinId, updatedImageData, 1);
        that.runtime.requestRedraw();
    
    requestAnimationFrame(() => process_frame(that,aiInfo,Base64,Video));
}

function stopAprilTag(that){
    that.isAprilTagActive=false
    cancelAnimationFrame(process_frame);

    that.detections=[]
    that.imgSaveRequested=0;
    that.canvasCtx.clearRect(0, 0, that.canvas.width, that.canvas.height);  
    // 更新 renderer 的 skin 内容
    const ImageData = that.canvasCtx.getImageData(0, 0, that.canvas.width, that.canvas.height);
    that.renderer.updateBitmapSkin(that.faceSkinId, ImageData, 1);
        // 隐藏 drawable
    that.renderer.updateDrawableVisible(that.faceDrawableId, false);
    that.runtime.requestRedraw();
    console.log('停止了')
}


 // 启动颜色识别
function startColorDetection(that,Video,StageLayering,cv,aiInfo) {
    // if(mediaStream ==null){
    //     alert("摄像头未开启")
    //     return
    // }
    that.canvas.width = Video.DIMENSIONS[0];
    that.canvas.height = Video.DIMENSIONS[1];

    const {renderer} = that.runtime;
    that.renderer=renderer
    if (!that.renderer) {
        console.error('Renderer 未初始化');
        return;
    }

    // 创建一个新的 skin 和 drawable 用于 face detection
    that.faceSkinId = that.renderer.createBitmapSkin(new ImageData(...Video.DIMENSIONS), 1);
    that.faceDrawableId = that.renderer.createDrawable(StageLayering.VIDEO_LAYER);

    console.log('创建的 faceSkinId:', that.faceSkinId);
    
    if (that.renderer.markSkinAsPrivate) {
        that.renderer.markSkinAsPrivate(that.faceSkinId);
    }

    that.renderer.updateDrawableSkinId(that.faceDrawableId, that.faceSkinId);
    that.renderer.updateDrawableVisible(that.faceDrawableId, true);
    that.renderer.updateDrawableEffect(that.faceDrawableId, 'ghost', 0); // 确保没有透明度

    that.isColorDetectionActive = true;


    processColorDetection(that,Video,cv,aiInfo);
}

// 停止颜色识别
function stopColorDetection(that) {
    that.isColorDetectionActive = false;
    cancelAnimationFrame(processColorDetection);
    that.canvasCtx.clearRect(0, 0, that.canvas.width, that.canvas.height);  
    // 更新 renderer 的 skin 内容
    const ImageData = that.canvasCtx.getImageData(0, 0, that.canvas.width, that.canvas.height);
    that.renderer.updateBitmapSkin(that.faceSkinId, ImageData, 1);
    that.runtime.requestRedraw();
}



// 处理视频帧，进行颜色识别
function processColorDetection(that,Video,cv,aiInfo) {
    if (!that.isColorDetectionActive) return;
    // console.log('-----------')
    // let canvasOutput = document.getElementById('canvasOutput');
    // let ctx = canvasOutput.getContext('2d');

    let imageData;
        
    try{
        imageData = that.getFrame({
            format: Video.FORMAT_IMAGE_DATA,
            cacheTimeout: that.runtime.currentStepTime
        });
    }catch(e){
        console.log(e)
    }

    // ctx.drawImage(videoElement, 0, 0, canvasOutput.width, canvasOutput.height);
    if (imageData) {
        that.canvasCtx.putImageData(imageData, 0, 0); // 直接绘制到 canvas 上
    }

    let frame = cv.imread(that.canvas);  // 从canvas读取图像


    //-----------------中心点
    // 计算中心区域坐标
    let centerX = Math.floor(that.canvas.width / 2);
    let centerY = Math.floor(that.canvas.height / 2);
    let regionSize = 10;
    let x = centerX - regionSize / 2;
    let y = centerY - regionSize / 2;

    // 提取中心区域
    let roi = frame.roi(new cv.Rect(x, y, regionSize, regionSize));

    // 计算平均颜色
    let avgColor = getAverageColor(roi);
    let colorHex = rgbToHex(avgColor[0], avgColor[1], avgColor[2]);

    aiInfo.setColorRgb(avgColor)
    // 绘制中心区域边框
    that.canvasCtx.strokeStyle = '#000';
    that.canvasCtx.lineWidth = 2;
    that.canvasCtx.strokeRect(x, y, regionSize, regionSize);

    // 填充颜色
    that.canvasCtx.fillStyle = colorHex === '#ffffff' ? '#CCCCCC' : colorHex;
    that.canvasCtx.fillRect(x, y, regionSize, regionSize);

    // 保存到 colorGrid（可以只保存一格）
    that.colorGrid = [[colorHex]];

    roi.delete(); // 清理内存

   
        // 渲染到 renderer
        const {renderer} = that.runtime;
        if (!renderer) {
            console.error('Renderer 未初始化');
            return;
        }

        // 更新 renderer 的 skin 内容
        const updatedImageData = that.canvasCtx.getImageData(0, 0, that.canvas.width, that.canvas.height);
        that.renderer.updateBitmapSkin(that.faceSkinId, updatedImageData, 1);
        that.runtime.requestRedraw();

    frame.delete();  // 释放内存
    if (that.isColorDetectionActive) {
        
        requestAnimationFrame(() => processColorDetection(that,Video,cv,aiInfo));
    }
    // requestAnimationFrame(processColorDetection);  // 循环处理每一帧
}


function getColorAt(x, y,that) {
    let cellWidth = that.canvas.width / 8;
    let cellHeight = that.canvas.height / 6;

    let col = Math.floor(x / cellWidth);
    let row = Math.floor(y / cellHeight);

    if (row >= 0 && row < 6 && col >= 0 && col < 8) {
        return that.colorGrid[row][col];
    } else {
        return null; // 坐标超出范围
    }
}

// 获取图像的平均颜色
function getAverageColor(image) {
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

function getAverageColorByMask(image, mask) {
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
function rgbToHex(r, g, b) {
    return '#' + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase();
}


// 启动色块位置识别
function startColorPlaceDetection(that,Video,cv,StageLayering,aiInfo) {
    // if(mediaStream ==null){
    //     alert("摄像头未开启")
    //     return
    // }
    that.canvas.width = Video.DIMENSIONS[0];
    that.canvas.height = Video.DIMENSIONS[1];

    // 设置蓝色范围的 HSV 值
    that.lower_blue = new cv.Mat(1, 3, cv.CV_8UC1); // 1行3列矩阵
    that.upper_blue = new cv.Mat(1, 3, cv.CV_8UC1); // 1行3列矩阵

    // 直接将数据赋值到 Mat 对象
    that.lower_blue.data.set([100, 150, 100]); // 下限 (H=100, S=150, V=100)
    that.upper_blue.data.set([140, 255, 255]); // 上限 (H=140, S=255, V=255)

    // 红色范围的 HSV 值
    that.lower_red1 = new cv.Mat(1, 3, cv.CV_8UC1); // 1行3列矩阵
    that.upper_red1 = new cv.Mat(1, 3, cv.CV_8UC1);
    that.lower_red1.data.set([0, 150, 70]); // 红色下限 (H=0, S=150, V=50)
    that.upper_red1.data.set([10, 255, 255]); // 红色上限 (H=10, S=255, V=255)

    // 黄色范围的 HSV 值
    that.lower_yellow = new cv.Mat(1, 3, cv.CV_8UC1);
    that.upper_yellow = new cv.Mat(1, 3, cv.CV_8UC1);
    that.lower_yellow.data.set([25, 150, 50]); // 黄色下限 (H=25, S=150, V=50)
    that.upper_yellow.data.set([35, 255, 255]); // 黄色上限 (H=35, S=255, V=255)

    // 绿色范围的 HSV 值
    that.lower_green = new cv.Mat(1, 3, cv.CV_8UC1);
    that.upper_green = new cv.Mat(1, 3, cv.CV_8UC1);
    that.lower_green.data.set([50, 150, 50]); // 绿色下限 (H=50, S=150, V=50)
    that.upper_green.data.set([70, 255, 255]); // 绿色上限 (H=70, S=255, V=255)

    // 黑色范围的 HSV 值
    that.lower_black = new cv.Mat(1, 3, cv.CV_8UC1);
    that.upper_black = new cv.Mat(1, 3, cv.CV_8UC1);
    that.lower_black.data.set([0, 0, 0]); // 黑色下限 (H=0, S=0, V=0)
    that.upper_black.data.set([180, 255, 50]); // 黑色上限 (H=180, S=255, V=50)

    // 白色范围的 HSV 值
    that.lower_white = new cv.Mat(1, 3, cv.CV_8UC1);
    that.upper_white = new cv.Mat(1, 3, cv.CV_8UC1);
    that.lower_white.data.set([0, 0, 200]); // 白色下限 (H=0, S=0, V=200)
    that.upper_white.data.set([180, 50, 255]); // 白色上限 (H=180, S=50, V=255)

    //capColor = new cv.VideoCapture(videoElement);

    const {renderer} = that.runtime;
    that.renderer=renderer
    if (!that.renderer) {
        console.error('Renderer 未初始化');
        return;
    }

    // 创建一个新的 skin 和 drawable 用于 face detection
    that.faceSkinId = that.renderer.createBitmapSkin(new ImageData(...Video.DIMENSIONS), 1);
    that.faceDrawableId = that.renderer.createDrawable(StageLayering.VIDEO_LAYER);

    console.log('创建的 faceSkinId:', that.faceSkinId);
    
    if (that.renderer.markSkinAsPrivate) {
        that.renderer.markSkinAsPrivate(that.faceSkinId);
    }

    that.renderer.updateDrawableSkinId(that.faceDrawableId, that.faceSkinId);
    that.renderer.updateDrawableVisible(that.faceDrawableId, true);
    that.renderer.updateDrawableEffect(that.faceDrawableId, 'ghost', 0); // 确保没有透明度

    that.isColorPlaceDetectionActive = true;


    processColorPlaceDetection(that,Video,cv,aiInfo);
}

// 停止颜色识别
function stopColorPlaceDetection(that) {

    that.lower_blue=null;
    that.upper_blue=null;
    that.capColor=null;
    that.lower_red1=null;
    that.upper_red1=null;
    that.lower_yellow=null;
    that.upper_yellow=null;
    that.lower_green=null;
    that.upper_green=null;
    that.lower_black=null;
    that.upper_black=null;
    that.lower_white=null;
    that.upper_white=null

    that.isColorPlaceDetectionActive = false;
    cancelAnimationFrame(that.processColorPlaceDetection);
    that.canvasCtx.clearRect(0, 0, that.canvas.width, that.canvas.height);  
    // 更新 renderer 的 skin 内容
    const ImageData = that.canvasCtx.getImageData(0, 0, that.canvas.width, that.canvas.height);
    that.renderer.updateBitmapSkin(that.faceSkinId, ImageData, 1);
    that.runtime.requestRedraw();
}



// 处理视频帧，进行色块位置识别
function processColorPlaceDetection(that,Video,cv,aiInfo) {
    if (!that.isColorPlaceDetectionActive) return;
    let imageData;

    try {
        imageData = that.getFrame({
            format: Video.FORMAT_IMAGE_DATA,
            cacheTimeout: that.runtime.currentStepTime
        });
    } catch (e) {
        console.log(e);
        return;
    }

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
        cv.inRange(dst, that.lower_red1, that.upper_red1, mask);
    } else if (color === 'yellow') {
        cv.inRange(dst, that.lower_yellow, that.upper_yellow, mask);
    } else if (color === 'green') {
        cv.inRange(dst, that.lower_green, that.upper_green, mask);
    } else if (color === 'blue') {
        cv.inRange(dst, that.lower_blue, that.upper_blue, mask);
    } else if (color === 'black') {
        cv.inRange(dst, that.lower_black, that.upper_black, mask);
    } else if (color === 'white') {
        cv.inRange(dst, that.lower_white, that.upper_white, mask);
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

    const cx = that.canvas.width / 2;
    const cy = that.canvas.height / 2;
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
        aiInfo.setRegion('none');
    }

    // aiInfo.setHaveColor(colorNum);
    // aiInfo.setColorLocation(location);

    // Canvas 设置与渲染
    that.canvas.width = Video.DIMENSIONS[0];
    that.canvas.height = Video.DIMENSIONS[1];

    let imageDataToRender = new ImageData(new Uint8ClampedArray(src.data), src.cols, src.rows);
    that.canvasCtx.putImageData(imageDataToRender, 0, 0);

    // 绘制完整的区域分割线
    const ctx = that.canvasCtx;
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;

    

    // 画中间正方形
    ctx.strokeRect(cx - r, cy - r, 100, 100);

    // 从四角连线到中间
    ctx.beginPath();
    ctx.moveTo(0, 0);         ctx.lineTo(cx - r, cy - r);
    ctx.moveTo(that.canvas.width, 0); ctx.lineTo(cx + r, cy - r);
    ctx.moveTo(0, that.canvas.height); ctx.lineTo(cx - r, cy + r);
    ctx.moveTo(that.canvas.width, that.canvas.height); ctx.lineTo(cx + r, cy + r);
    ctx.stroke();

    // 渲染到 renderer
    const updatedImageData = that.canvasCtx.getImageData(0, 0, that.canvas.width, that.canvas.height);
    if (that.renderer) {
        that.renderer.updateBitmapSkin(that.faceSkinId, updatedImageData, 1);
        that.runtime.requestRedraw();
    }

    // 清理
    src.delete();
    dst.delete();
    mask.delete();
    contours.delete();
    hierarchy.delete();

    if (that.isColorPlaceDetectionActive) {
        
        requestAnimationFrame(() => processColorPlaceDetection(that,Video,cv,aiInfo));
    }
}


 // 启动色块检测
function startWColorBlockDetection(that,Video,cv,StageLayering,aiInfo) {
    console.log('执行了颜色追踪')

    // 设置蓝色范围的 HSV 值
    that.lower_blue = new cv.Mat(1, 3, cv.CV_8UC1); // 1行3列矩阵
    that.upper_blue = new cv.Mat(1, 3, cv.CV_8UC1); // 1行3列矩阵

    // 直接将数据赋值到 Mat 对象
    that.lower_blue.data.set([100, 150, 100]); // 下限 (H=100, S=150, V=100)
    that.upper_blue.data.set([140, 255, 255]); // 上限 (H=140, S=255, V=255)

    // 红色范围的 HSV 值
    that.lower_red1 = new cv.Mat(1, 3, cv.CV_8UC1); // 1行3列矩阵
    that.upper_red1 = new cv.Mat(1, 3, cv.CV_8UC1);
    that.lower_red1.data.set([0, 150, 70]); // 红色下限 (H=0, S=150, V=50)
    that.upper_red1.data.set([10, 255, 255]); // 红色上限 (H=10, S=255, V=255)

    // 黄色范围的 HSV 值
    that.lower_yellow = new cv.Mat(1, 3, cv.CV_8UC1);
    that.upper_yellow = new cv.Mat(1, 3, cv.CV_8UC1);
    that.lower_yellow.data.set([20, 100, 50]); // 黄色下限 (H=25, S=150, V=50)
    that.upper_yellow.data.set([40, 255, 255]); // 黄色上限 (H=35, S=255, V=255)

    // 绿色范围的 HSV 值
    that.lower_green = new cv.Mat(1, 3, cv.CV_8UC1);
    that.upper_green = new cv.Mat(1, 3, cv.CV_8UC1);
    that.lower_green.data.set([35, 80, 40]); // 绿色下限 (H=50, S=150, V=50)
    that.upper_green.data.set([85, 255, 255]); // 绿色上限 (H=70, S=255, V=255)

    // 黑色范围的 HSV 值
    that.lower_black = new cv.Mat(1, 3, cv.CV_8UC1);
    that.upper_black = new cv.Mat(1, 3, cv.CV_8UC1);
    that.lower_black.data.set([0, 0, 0]); // 黑色下限 (H=0, S=0, V=0)
    that.upper_black.data.set([180, 255, 50]); // 黑色上限 (H=180, S=255, V=50)

    // 白色范围的 HSV 值
    that.lower_white = new cv.Mat(1, 3, cv.CV_8UC1);
    that.upper_white = new cv.Mat(1, 3, cv.CV_8UC1);
    that.lower_white.data.set([0, 0, 200]); // 白色下限 (H=0, S=0, V=200)
    that.upper_white.data.set([180, 50, 255]); // 白色上限 (H=180, S=50, V=255)

    //capColor = new cv.VideoCapture(videoElement);

    const {renderer} = that.runtime;
    that.renderer=renderer
    if (!that.renderer) {
        console.error('Renderer 未初始化');
        return;
    }

    // 创建一个新的 skin 和 drawable 用于 face detection
    that.faceSkinId = that.renderer.createBitmapSkin(new ImageData(...Video.DIMENSIONS), 1);
    that.faceDrawableId = that.renderer.createDrawable(StageLayering.VIDEO_LAYER);

    console.log('创建的 faceSkinId:', that.faceSkinId);
    
    if (that.renderer.markSkinAsPrivate) {
        that.renderer.markSkinAsPrivate(that.faceSkinId);
    }

    that.renderer.updateDrawableSkinId(that.faceDrawableId, that.faceSkinId);
    that.renderer.updateDrawableVisible(that.faceDrawableId, true);
    that.renderer.updateDrawableEffect(that.faceDrawableId, 'ghost', 0); // 确保没有透明度

    that.isColorBlockDetectionActive = true;
    processColorBlockDetectionW(that,Video,cv,aiInfo);
}

// 停止色块检测
function stopWColorBlockDetection(that) {
    that.isColorBlockDetectionActive = false;
    that.lower_blue=null;
    that.upper_blue=null;
    that.capColor=null;
    that.lower_red1=null;
    that.upper_red1=null;
    that.lower_yellow=null;
    that.upper_yellow=null;
    that.lower_green=null;
    that.upper_green=null;
    that.lower_black=null;
    that.upper_black=null;
    that.lower_white=null;
    that.upper_white=null
    cancelAnimationFrame(that.processColorBlockDetectionW);
    // await new Promise(resolve => setTimeout(resolve, 1000)); 
    that.canvasCtx.clearRect(0, 0, that.canvas.width, that.canvas.height);  
    // 更新 renderer 的 skin 内容
    const ImageData = that.canvasCtx.getImageData(0, 0, that.canvas.width, that.canvas.height);
    that.renderer.updateBitmapSkin(that.faceSkinId, ImageData, 1);
    that.runtime.requestRedraw();
    console.log('停止')
}
// 处理每一帧
function processColorBlockDetectionW(that,Video,cv,aiInfo) {
    //if (!capColor) return;


    // console.log('处理帧')
    let imageData;
        
    try{
        imageData = that.getFrame({
            format: Video.FORMAT_IMAGE_DATA,
            cacheTimeout: that.runtime.currentStepTime
        });
    }catch(e){
        console.log(e)
    }
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
        cv.inRange(dst, that.lower_red1, that.upper_red1, mask);
    }else if(aiInfo.getWhatColor()=='yellow'){
        // 创建掩码
        cv.inRange(dst, that.lower_yellow, that.upper_yellow, mask);
    }else if(aiInfo.getWhatColor()=='green'){
        // 创建掩码
        cv.inRange(dst, that.lower_green, that.upper_green, mask);
    }else if(aiInfo.getWhatColor()=='blue'){
        // 创建掩码
        cv.inRange(dst, that.lower_blue, that.upper_blue, mask);
    }else if(aiInfo.getWhatColor()=='black'){
        // 创建掩码
        cv.inRange(dst, that.lower_black, that.upper_black, mask);
    }else if(aiInfo.getWhatColor()=='white'){
        // 创建掩码
        cv.inRange(dst, that.lower_white, that.upper_white, mask);
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
        location.x = maxRect.x - 255 + maxRect.width / 2;
        location.y = maxRect.y - 223 + maxRect.height / 2;

        let wh = [maxRect.width, maxRect.height];
        aiInfo.setColorWh(wh);
        aiInfo.setHaveColor(colorNum)
        aiInfo.setColorLocation(location)

        cv.rectangle(
            src,
            new cv.Point(maxRect.x, maxRect.y),
            new cv.Point(maxRect.x + maxRect.width, maxRect.y + maxRect.height),
            [255, 0, 0, 255],
            2
        );
    } else {
        colorNum = 0;
        aiInfo.setColorWh([0,0]);
        aiInfo.setHaveColor(colorNum)
        aiInfo.setColorLocation({
            x:0,
            y:0
        })
    }
    // // 遍历所有轮廓
    // for (let i = 0; i < contours.size(); i++) {
    //     let contour = contours.get(i);
    //     if (cv.contourArea(contour) > 500) { // 过滤掉小的轮廓
    //         let rect = cv.boundingRect(contour);
    //         let aspectRatio = rect.width / rect.height;

    //         let wh=[rect.width,rect.height]
    //         aiInfo.setColorWh(wh)
    //         // 长宽比符合矩形
    //         if (aspectRatio > 0.5 && aspectRatio < 2) {
    //             colorNum++
    //             if(cv.contourArea(contour)>len){
    //                 len=cv.contourArea(contour)
    //                 location.x=rect.x-255+rect.width/2
    //                 location.y=rect.y-223+rect.height/2
    //             }
    //             // 绘制矩形框
    //             cv.rectangle(src, new cv.Point(rect.x,rect.y),new cv.Point(rect.x+rect.width,rect.y+rect.height), [255, 0, 0, 255], 2); 
    //             // console.log("目标颜色坐标: (" + rect.x + ", " + rect.y + ")( "+ rect.width +","+rect.height+")");
    //             // send_colorRect1(rect.x,rect.x+rect.width,rect.y,rect.y+rect.height)
    //         }
    //     }
    // }
    

    // console.log(src)
    // console.log(contours)

    // 渲染到 canvas 上
    that.canvas.width = Video.DIMENSIONS[0];
    that.canvas.height = Video.DIMENSIONS[1];
    
    // 获取图像的 ImageData
    let imageDataToRender = new ImageData(new Uint8ClampedArray(src.data), src.cols, src.rows);

    // 在 canvas 上渲染
    that.canvasCtx.putImageData(imageDataToRender, 0, 0);

    // 渲染到 renderer
    const {renderer} = that.runtime;
    if (!renderer) {
        console.error('Renderer 未初始化');
        return;
    }

    // 更新 renderer 的 skin 内容
    const updatedImageData = that.canvasCtx.getImageData(0, 0, that.canvas.width, that.canvas.height);
    that.renderer.updateBitmapSkin(that.faceSkinId, updatedImageData, 1);
    that.runtime.requestRedraw();

    // 释放内存
    src.delete();
    dst.delete();
    mask.delete();
    contours.delete();
    hierarchy.delete();

    // 请求下一帧
    if (that.isColorBlockDetectionActive) {
        
        requestAnimationFrame(() => processColorBlockDetectionW(that,Video,cv,aiInfo));
    }
}

async function startTrafficpre(that,Video,StageLayering,tfjs,aiInfo) {


    that.canvas = document.createElement('canvas');
    that.canvas.width = Video.DIMENSIONS[0];
    that.canvas.height = Video.DIMENSIONS[1];
    that.canvasCtx = that.canvas.getContext('2d');

    const { renderer } = that.runtime;
    that.renderer = renderer;
    that.faceSkinId = that.renderer.createBitmapSkin(new ImageData(...Video.DIMENSIONS), 1);
    that.faceDrawableId = that.renderer.createDrawable(StageLayering.VIDEO_LAYER);
    that.renderer.updateDrawableSkinId(that.faceDrawableId, that.faceSkinId);
    that.renderer.updateDrawableVisible(that.faceDrawableId, true);
    that.renderer.updateDrawableEffect(that.faceDrawableId, 'ghost', 0);



    const currentURL = window.location.href;
    const oneLevelUp = currentURL.substring(0, currentURL.lastIndexOf('/'));
    const twoLevelsUp = oneLevelUp.substring(0, oneLevelUp.lastIndexOf('/'));
    const modelPath = twoLevelsUp + '/static/model/tfjs_model4/';

    try {
        that.traficModel = await tfjs.loadGraphModel(modelPath + 'model.json');
        console.log('Model loaded');
        that.timerTraffic = setInterval(() => detectTraffic(that,Video,tfjs,aiInfo), 100);
    } catch (error) {
        console.error('Error loading model:', error);
    }
}



async function detectTraffic(that,Video,tfjs,aiInfo) {
    if (!that.traficModel || !that.provider) return;


        let imageData;
        
    try{
        imageData = that.getFrame({
            format: Video.FORMAT_IMAGE_DATA,
            cacheTimeout: that.runtime.currentStepTime
        });
    }catch(e){
        console.log(e)
    }
    if (!imageData) {
        console.warn("No image data available.");
        return;
    }



    
    try {
        
        //     // 1. 截取并处理图像
        //     const webcamTensor = tfjs.browser.fromPixels(imageData)
        //         .resizeNearestNeighbor([128, 128])  // 模型输入大小
        //         .toFloat()
        //         .div(255.0)
        //         .expandDims()  // [1, 128, 128, 3]
        //         .transpose([0, 3, 1, 2]);  // 变成 [1, 3, 128, 128]

        //     // 3. 推理
        //     const output = that.traficModel.execute({ 'images:0': webcamTensor }); // [1, 10, 336]

        //    const raw = output.squeeze();                  // [10, 336]

        //     // 拆分为 bbox 和分类得分
        //     const boxes = raw.slice([0, 0], [10, 4]);      // [10, 4]
        //     const scores = raw.slice([0, 4], [10, 332]);   // [10, 332]

        //     // 取每个检测结果的最大类别分数和索引
        //     const confidences = scores.max(-1);            // [10]
        //     const classes = scores.argMax(-1);             // [10]

        //     // 使用 await 打印结果
        //     const confArr = await confidences.array();

        //     console.log(confArr);

        //     let sliceConf=confArr.slice(4)
        //     const max = Math.max(...sliceConf);
        //     // 找出最大值在原数组中的索引
        //     const slicedIndex = sliceConf.indexOf(max);   // 在 sliced 中的索引
        //     const originalIndex = slicedIndex + 4;     // 加上偏移量，得到在原数组中的索引

        //     aiInfo.setTraffic(originalIndex);


        const [origWidth, origHeight] = Video.DIMENSIONS; // 原始图像尺寸
        const modelInputSize = 416; // 模型输入尺寸

        const confArr = tfjs.tidy(() => {
        const webcamTensor = tfjs.browser.fromPixels(imageData)
            .resizeNearestNeighbor([416, 416])
            .toFloat()
            .div(255.0)
            .expandDims()
            .transpose([0, 3, 1, 2]);

        const output = that.traficModel.execute({ 'images:0': webcamTensor });

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
    // const updatedImageData = that.canvasCtx.getImageData(0, 0, that.canvas.width, that.canvas.height);
    // that.renderer.updateBitmapSkin(that.faceSkinId, updatedImageData, 1);
    // that.runtime.requestRedraw();
            
    } catch (error) {
        console.error('Traffic detection failed:', error);
    }
}

function stopTraffic(that){
    clearInterval(that.timerTraffic)
}

function stopVideo(that,Video,StageLayering){
    that.canvas.width = Video.DIMENSIONS[0];
    that.canvas.height = Video.DIMENSIONS[1];
    const {renderer} = that.runtime;
    that.renderer=renderer
    if (!that.renderer) {
        console.error('Renderer 未初始化');
        return;
    }

    // 创建一个新的 skin 和 drawable 用于 face detection
    that.faceSkinId = that.renderer.createBitmapSkin(new ImageData(...Video.DIMENSIONS), 1);
    that.faceDrawableId = that.renderer.createDrawable(StageLayering.VIDEO_LAYER);

    console.log('创建的 faceSkinId:', that.faceSkinId);
    
    if (that.renderer.markSkinAsPrivate) {
        that.renderer.markSkinAsPrivate(that.faceSkinId);
    }

    that.renderer.updateDrawableSkinId(that.faceDrawableId, that.faceSkinId);
    that.renderer.updateDrawableVisible(that.faceDrawableId, true);
    that.renderer.updateDrawableEffect(that.faceDrawableId, 'ghost', 0); // 确保没有透明度


    that.canvasCtx.clearRect(0, 0, that.canvas.width, that.canvas.height);  
    // 更新 renderer 的 skin 内容
    const imageData = that.canvasCtx.getImageData(0, 0, that.canvas.width, that.canvas.height);
    that.renderer.updateBitmapSkin(that.faceSkinId, imageData, 1);
    that.renderer.updateDrawableVisible(that.faceDrawableId, false);
    that.runtime.requestRedraw();
}

// 用 CommonJS 的方式导出
module.exports = {
    startQRDetection,
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
};
