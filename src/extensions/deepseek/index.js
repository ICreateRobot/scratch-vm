
const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type')
class DeepSeekExtension {
    constructor() {
        this.baseUrl = 'http://localhost:5000';
    }

    getInfo() {
        return {
            id: 'deepseek',
            name: 'DeepSeek AI',
            blocks: [
                {
                    opcode: 'askAI',
                    blockType: BlockType.REPORTER,
                    text: '问 AI: [QUESTION]',
                    arguments: {
                        QUESTION: {
                            type: ArgumentType.STRING,
                            defaultValue: '你好！'
                        }
                    }
                }
            ]
        };
    }

    askAI(args) {
        const question = args.QUESTION;
        return fetch(`${this.baseUrl}/ask`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                question: question
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                return data.response;
            } else {
                return '发生错误: ' + data.error;
            }
        })
        .catch(error => {
            console.error('API 错误:', error);
            return '连接服务器失败';
        });
    }
}

// Scratch.extensions.register(new DeepSeekExtension()); 
module.exports = DeepSeekExtension;