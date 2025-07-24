const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type')
class bricksevent {
    getInfo() {
    return {
        id: 'bricksevent',
        name: 'When',
        blocks: [
        {
            blockType: BlockType.HAT,
            opcode: 'when',
            text: '开始',
            isEdgeActivated: false, // required boilerplate
            arguments: {

            }
        }
        ]
    };
    }
    // when(args) {
    // return Scratch.Cast.toBoolean(args.CONDITION);
    // }
    when(){
        
    }
}

// Scratch.vm.runtime.on('BEFORE_EXECUTE', () => {
//     // startHats is the same as before!
//     Scratch.vm.runtime.startHats('whenunsandboxed_when');
// });

module.exports = bricksevent;
