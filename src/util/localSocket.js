// let socket=null
// function setSocket(){
//     socket = new WebSocket('ws://localhost:8084');
//     socket.addEventListener('open', (event) => {
//         console.log('WebSocket connection opened22222');
//     });
// }

// function getSocket(){
//     return socket
// }

// module.exports={setSocket,getSocket}


let socket = null;
let bleChannel = null;

// 判断是否为 Electron 环境
function isElectron() {
  return typeof window !== 'undefined' && !!window.process && !!window.process.versions && !!window.process.versions.electron;
}

function setSocket() {
    console.log('***************************')
    console.log(isElectron())
  if (isElectron()) {
    // Electron 环境：使用真实 WebSocket
    socket = new WebSocket('ws://localhost:8084');
    socket.addEventListener('open', () => {
      console.log('🔌 [Electron] WebSocket connected (8084)');
    });
  } else {
    // 浏览器环境：使用 BroadcastChannel 模拟
    console.log('[Browser] Using BroadcastChannel to simulate BLE socket');
    bleChannel = new BroadcastChannel('ble-data');

    socket = {
      send(data) {
        console.log(' [Browser] Simulated BLE send:', data);
        bleChannel.postMessage(data);

        // （可选）模拟回执，例如 waitForThreeZeros()
        const ackChannel = new BroadcastChannel('ble-ack');
        setTimeout(() => {
          ackChannel.postMessage([0, 0, 0]); // 模拟 ACK 信号
        }, 100);
      },
      close() {
        bleChannel?.close();
      }
    };
  }
}

function getSocket() {
  return socket;
}

module.exports = { setSocket, getSocket };
