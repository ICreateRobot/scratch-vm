let imageIsLoad=false

let qrIsLoad=false

let faceDetIsLoad=false

let itemIsLoad=false

let colorDete=false

let colorReco=false

let faceReco=false

let isMicphLoad=false

let isAprilTag=false

let isColorPlace = false

let isK210Load=false

let k210IsFailed=true

let isTraffic=false


let modeEnterTime=Date.now();

let isHaveMode=false
let isComputerCamera=false

let cameraPlace='0'


let whatCameraOpen={
    playground:'',
    dialogCam:''
}

let camObj;

let tm_ai_images;
let tm_ai_net;
let tm_ai_computer;

function setIsImage(a){
    imageIsLoad=a
}

function getIsImage(){
    return imageIsLoad
}

function setQr(a){
    qrIsLoad=a
}

function getQr(){
    return qrIsLoad
}

function setFaceDet(a){
    faceDetIsLoad=a
}

function getFaceDet(){
    return faceDetIsLoad
}

function setItem(a){
    itemIsLoad=a
}

function getItem(){
    return itemIsLoad
}

function setColorDete(a){
    colorDete=a
}

function getColorDete(){
    return colorDete
}

function setColorReco(a){
    colorReco=a
}

function getColorReco(){
    return colorReco
}

function setFaceReco(a){
    faceReco=a
}

function getFaceReco(){
    return faceReco
}

function getMicph(){
    return isMicphLoad
}

function setMicph(a){
    isMicphLoad=a
}

function getAprilTag(){
    return isAprilTag
}

function setAprilTag(a){
    isAprilTag=a
}

function getColorPlace(){
    return isColorPlace
}

function setColorPlace(a){
    isColorPlace=a
}

function setIsK210(a){
    isK210Load=a
}

function getIsK210(){
    return isK210Load
}

function getIsK210IsLoadFiled(){
    return k210IsFailed
}

function setIsK210IsLoadFiled(){
    k210IsFailed=true
}

function clearnk210(){
    k210IsFailed=false
}

function setIsTraffic(a){
    isTraffic=a
}

function getIsTraffic(){
    return isTraffic
}

function getModeTime(){
    return modeEnterTime
}

function setModeTime(a){
    modeEnterTime=a
}

function setHaveMode(a){
    isHaveMode=a
}

function getHaveMode(){
    return isHaveMode
}

function setComputer(a){
    isComputerCamera=a
}

function getComputer(){
    return isComputerCamera
}

function getCameraPlace(){
    return cameraPlace
}

function setCameraPlace(a){
    cameraPlace=a
}

function setPlayGround(a){
    whatCameraOpen.playground=a

}

function setDialog(a){
    whatCameraOpen.dialogCam=a
}

function getWhatCamera(){
    return whatCameraOpen
}

function setCamObj(a){
    camObj=a
}

function getCamObj(){
    return camObj
}

function getTmAiImages(){
    return tm_ai_images
}

function setTmAiImages(a){
    tm_ai_images=a
}

function getTmAiNet(){
    return tm_ai_net
}

function setTmAiNet(a){
    tm_ai_net=a
}

function getTmAiComputer(){
    return tm_ai_computer
}

function setTmAiComputer(a){
    tm_ai_computer=a
}
module.exports={
    setIsImage,
    getIsImage,
    setQr,
    getQr,
    setFaceDet,
    getFaceDet,
    setItem,
    getItem,
    setColorDete,
    getColorDete,
    setColorReco,
    getColorReco,
    setFaceReco,
    getFaceReco,
    setMicph,
    getMicph,
    getAprilTag,
    setAprilTag,
    getColorPlace,
    setColorPlace,
    setIsK210,
    getIsK210,
    getIsK210IsLoadFiled,
    setIsK210IsLoadFiled,
    clearnk210,
    setIsTraffic,
    getIsTraffic,
    getModeTime,
    setModeTime,
    setHaveMode,
    getHaveMode,
    setComputer,
    getComputer,
    getCameraPlace,
    setCameraPlace,
    setPlayGround,
    setDialog,
    getWhatCamera,
    setCamObj,
    getCamObj,
    getTmAiImages,
    setTmAiImages,
    getTmAiNet,
    setTmAiNet,
    getTmAiComputer,
    setTmAiComputer
}