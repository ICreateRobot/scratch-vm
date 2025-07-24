
const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type')
const socket=require('../../util/socket-connect')
    

class robotevent {

    constructor(runtime){
        this.runtime=runtime

        this.reciveChannel = new BroadcastChannel('reciveChannel')
        this.reciveChannel.addEventListener('message',(event)=>{
            if(event.data[0]==0 && event.data[1]==1){
                this.runtime.startHats('robotevent_whenPressed', {
                    KEY: '0'
                });
            }else if(event.data[0]==1 && event.data[1]==0){
                this.runtime.startHats('robotevent_whenPressed', {
                    KEY: '1'
                });
            }else if(event.data[0]==0 && event.data[1]==0){
                this.runtime.startHats('robotevent_whenPressed', {
                    KEY: '2'
                });
            }

            // if(event.data[3])


        })
    }
    getInfo() {
    return {
        id: 'robotevent',
        name: '开始',
        color1: '#33ccff',
        blocks: [
            {
                blockType: BlockType.HAT,
                opcode: 'when',
                text: '开始',
                isEdgeActivated: false, // required boilerplate
                // branchCount: 1, // 表示有一个 statement 输入
                arguments: {
                    
                }
            },

            {
                blockType: BlockType.EVENT,
                opcode: 'whenPressed',
                text: '当 [KEY] 被按下',
                isEdgeActivated: false, // required boilerplate
                arguments: {
                    KEY: {
                        type: ArgumentType.STRING,
                        menu: 'key'
                    }
                }
            },

            // {
            //     blockType: BlockType.EVENT,
            //     opcode: 'whenSound',
            //     text: '当 声音 > [SOUND]',
            //     isEdgeActivated: false, // required boilerplate
            //     arguments: {
            //         SOUND: {
            //             type: ArgumentType.STRING,
            //             defaultValue:25
            //         }
            //     }
            // }

        ],
        menus: {
            key: {
              acceptReporters: false,
              items: [
                {
                  // startHats filters by *value*, not by text
                  text: '⬅️',
                  value: '0'
                },

                {
                    // startHats filters by *value*, not by text
                    text: '➡️',
                    value: '1'
                },
                {
                    // startHats filters by *value*, not by text
                    text: '⬅️+➡️',
                    value: '2'
                },
              ]
            }
        }
  
    };
    }
 
}

// Scratch.vm.runtime.on('BEFORE_EXECUTE', () => {
//     // startHats is the same as before!
//     Scratch.vm.runtime.startHats('whenunsandboxed_when');
// });


module.exports = robotevent;

