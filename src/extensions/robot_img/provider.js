// import {requestVideoStream, requestDisableVideo} from './camera.js';
// import log from '../log.js';

const imageLoad = require('../../util/imageLoad')
const socket = require('../../util/socket-connect')
let lastHash = null;
let unchangedFrames = 0;
const MAX_UNCHANGED = 8;
/**
 * Video Manager for video extensions that handle image-based video streams.
 */
class Provider {
    constructor () {
        /**
         * Default value for mirrored frames.
         * @type boolean
         */
        this.mirror = false;

        /**
         * Cache frames for this many ms.
         * @type number
         */
        this._frameCacheTimeout = 16;

        /**
         * Image element to hold the image stream
         * @private
         */
        this._img = null;

        /**
         * Canvas element to render frames
         * @private
         */
        this._canvas = null;

        /**
         * Context for the canvas
         * @private
         */
        this._context = null;

        /**
         * Stores the last update time for caching
         * @private
         */
        this._lastUpdate = 0;

        this.channelLoad = new BroadcastChannel('isLoading');
        this.timer=null
    }

    static get FORMAT_IMAGE_DATA () {
        return 'image-data';
    }

    static get FORMAT_CANVAS () {
        return 'canvas';
    }

    /**
     * Dimensions the image stream is analyzed at after being rendered to the canvas.
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

    /**
     * Request video be enabled. Sets up image stream, creates video skin, and enables preview.
     *
     * @return {Promise.<VideoProvider>} resolves a promise to this video provider when video is ready.
     */
    enableVideo () {
        this.enabled = true;
        return this._setupImageStream();
    }

    /**
     * Disable the image stream (turn video off).
     */
    disableVideo () {
        console.log('disable')
        this.enabled = false;
        this._teardown();
    }

    /**
     * async part of disableVideo
     * @private
     */
    _teardown () {
        if (this._img) {
            this._img.src = ''; // Clear the image source to stop the stream
            this._img = null;
        }
        if (this._canvas) {
            this._canvas = null;
            this._context = null;
        }
    }

    /**
     * Return frame data from the image feed in a specified dimensions, format, and mirroring.
     *
     * @param {object} frameInfo A descriptor of the frame you would like to receive.
     * @param {Array.<number>} frameInfo.dimensions [width, height] array of numbers. Defaults to [480, 360]
     * @param {boolean} frameInfo.mirror If you specifically want a mirror/non-mirror frame, defaults to true
     * @param {string} frameInfo.format Requested video format, available formats are 'image-data' and 'canvas'.
     * @param {number} frameInfo.cacheTimeout Will reuse previous image data if the time since capture is less than
     *                                        the cacheTimeout. Defaults to 16ms.
     *
     * @return {ArrayBuffer|Canvas|string|null} Frame data in requested format, null when errors.
     */
    getFrame ({
        dimensions = Provider.DIMENSIONS,
        mirror = this.mirror,
        format = Provider.FORMAT_IMAGE_DATA,
        cacheTimeout = this._frameCacheTimeout
    }) {
        if (!this._img || !this.enabled) {
            imageLoad.setIsImage(false)
            return null;
        }
        if (this._img && this._img.complete && this._img.naturalWidth === 0) {
            // 图像加载失败
            imageLoad.setIsImage(false)
            return null;
        }
        // console.log('执行了')
        try{
            const [width, height] = dimensions;
            const now = Date.now();
            // console.log( this._context)
    
            // Check if the image needs to be redrawn or if it's within cacheTimeout
            if (this._lastUpdate + cacheTimeout < now) {
                this._lastUpdate = now;
    
                if (mirror) {
                    this._context.scale(-1, 1);
                    this._context.translate(width * -1, 0);
                }
    
                // Draw the image onto the canvas
                this._context.drawImage(this._img, 0, 0, this._img.width, this._img.height, 0, 0, width, height);
                this._context.setTransform(1, 0, 0, 1, 0, 0);
            }
    
            // console.log(this._canvas.toDataURL('image/png'))
            // Return frame in requested format
            if (format === Provider.FORMAT_IMAGE_DATA) {
                return this._context.getImageData(0, 0, width, height);
            } else if (format === Provider.FORMAT_CANVAS) {
                return this._canvas;
            }
    
            return null;
        }catch(e){
            return null
        }

       
    }

    /**
     * Method called when an error happens. Default implementation is just to log error.
     *
     * @abstract
     * @param {Error} error An error object from getUserMedia or other source of error.
     */
    onError (error) {
        console.log.error('Unhandled video io device error', error);
    }

    /**
     * Create an image stream using the provided URL.
     * @private
     * @return {Promise} Resolves when the image stream is set up.
     */

    

    

    hashImageData(data) {
        let hash = 0;
        for (let i = 0; i < data.length; i += 1000) {
            hash += data[i]; // 简单 hash 算法
        }
        return hash;
    }
    _setupImageStream () {
        console.log('setupImage')
        // Create the img element and set its src to the network camera feed URL
        this._img = document.createElement('img');
        this._img.crossOrigin = "anonymous";  // 允许跨域访问

        //  // 先不设置src，等待后续处理
        // const setImageSrc = () => {
        //     const timestamp = new Date().getTime();
        //     this._img.src = `http://192.168.4.1:8081/video_feed`;  // 加时间戳强制刷新图片
        // };
        
        // // 设置 src 时，每次都强制重新加载
        // this._img.onload = () => {
        //     console.log('Image loaded, currentSrc:', this._img.currentSrc);
            
        //     // Create a canvas to render the image frames
        //     this._canvas = document.createElement('canvas');
        //     this._canvas.width = Provider.DIMENSIONS[0];
        //     this._canvas.height = Provider.DIMENSIONS[1];
        //     this._context = this._canvas.getContext('2d');
        // };

        // // 处理图片加载失败的情况
        // this._img.onerror = (error) => {
        //     console.error('Failed to load image feed:', error);
        //     // 尝试重新加载
        //     setImageSrc();  // 再次尝试加载图像
        // };

        // setImageSrc();  // 初次加载图片

        // return new Promise((resolve, reject) => {
        //     // 我们可以通过 onload 事件来确保图片已成功加载
        //     this._img.onload = () => {
        //         if (this._img.currentSrc) {
        //             resolve(this);
        //         }
        //     };
        //     // 超时处理（防止死循环）
        //     setTimeout(() => {
        //         if (!this._img.currentSrc) {
        //             reject('Failed to initialize image stream');
        //         }
        //     }, 5000); // 5秒超时
        // });
        const timestamp = new Date().getTime();
        if(socket.getIp().length>0){
            this._img.src = `http://${socket.getIp()}:8081/video_feed?${timestamp}`;  // Set the image feed URL here
        }else{
            this._img.src = `http://192.168.4.1:8081/video_feed?${timestamp}`;  // Set the image feed URL here
        }
        

        // 设置 6 秒超时检测
        // const loadTimeout = setTimeout(() => {
        //     alert("加载超时，请检查网络或摄像头状态！");
        //     this.channelLoad.postMessage(false)
        // }, 6000);
        this.timer=setTimeout(() => {
            if(!imageLoad.getIsImage()){
                alert("加载超时，请检查网络或摄像头状态！");
                this.channelLoad.postMessage(false)
            }
            
        }, 5000);
        this._img.onload = () => {
            clearTimeout(this.timer)
            console.log('Image loaded, currentSrc:', this._img.currentSrc);
            console.log(this._img)
            this.channelLoad.postMessage(false)
            imageLoad.setIsImage(true)
            imageLoad.setPlayGround('robotImg')
            // Create a canvas to render the image frames
            this._canvas = document.createElement('canvas');
            this._canvas.width = Provider.DIMENSIONS[0];
            this._canvas.height = Provider.DIMENSIONS[1];
            this._context = this._canvas.getContext('2d');

            // setInterval(() => {
            //     if (!this._context || !this._canvas) return;
            //     // this._context.drawImage(this._img, 0, 0);
            //     const imageData = this._context.getImageData(0, 0, this._canvas.width, this._canvas.height);
            //     const hash = this.hashImageData(imageData.data);
        
            //     if (hash === lastHash) {
            //         unchangedFrames++;
            //     } else {
            //         unchangedFrames = 0;
            //     }
            //     lastHash = hash;
        
            //     if (unchangedFrames >= MAX_UNCHANGED) {
            //         console.warn("图像静止太久，可能断流！");
            //         this.channelLoad.postMessage(false);
            //         alert("图传已中断！");
            //     }
            // }, 1000);
            // this._context.scale(-1, 1);

            // Start the image update loop
            // this._startImageLoop();
        };
        // // 处理图片加载失败的情况
        this._img.onerror = (error) => {
            console.error('Failed to load image feed:', error);
            // this.channelLoad.postMessage(false)
            // alert('图传加载失败，请检查后重试')
        };
        console.log(this._img.src)

        return new Promise((resolve, reject) => {
            // this.time=setTimeout(() => {
            //     if(!imageLoad.getIsImage()){
            //         alert("加载超时，请检查网络或摄像头状态！");
            //         this.channelLoad.postMessage(false)
            //         reject('Failed to initialize image stream');
            //     }
                
            // }, 4000);
            if (!this._img) {
                this.channelLoad.postMessage(false)
                alert('图传加载失败，请检查后重试')
                reject('Failed to initialize image stream');
            } else {
                resolve(this);
            }
        });
    }

    /**
     * Start the image loop to continuously fetch the next frame from the image stream.
     * @private
     */
    _startImageLoop () {
        setInterval(() => {
            if (this._img) {
                // Reload the image to get the next frame
                this._img.src = `http://${socket.getIp()}:8081/video_feed` + new Date().getTime(); // Adding timestamp to force reload
            }
        }, 100);  // Fetch a new image every 100ms (adjust based on your feed's speed)
    }

    get videoReady () {
        return this._img !== null && this.enabled;
    }
}

// export default Provider;
module.exports=Provider