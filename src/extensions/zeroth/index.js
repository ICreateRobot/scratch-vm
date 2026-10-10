const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type');

const blockIconURI = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM0Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+cGVuLWljb248L3RpdGxlPjxnIHN0cm9rZT0iIzU3NUU3NSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik04Ljc1MyAzNC42MDJsLTQuMjUgMS43OCAxLjc4My00LjIzN2MxLjIxOC0yLjg5MiAyLjkwNy01LjQyMyA1LjAzLTcuNTM4TDMxLjA2NiA0LjkzYy44NDYtLjg0MiAyLjY1LS40MSA0LjAzMi45NjcgMS4zOCAxLjM3NSAxLjgxNiAzLjE3My45NyA0LjAxNUwxNi4zMTggMjkuNTljLTIuMTIzIDIuMTE2LTQuNjY0IDMuOC03LjU2NSA1LjAxMiIgZmlsbD0iI0ZGRiIvPjxwYXRoIGQ9Ik0yOS40MSA2LjExcy00LjQ1LTIuMzc4LTguMjAyIDUuNzcyYy0xLjczNCAzLjc2Ni00LjM1IDEuNTQ2LTQuMzUgMS41NDYiLz48cGF0aCBkPSJNMzYuNDIgOC44MjVjMCAuNDYzLS4xNC44NzMtLjQzMiAxLjE2NGwtOS4zMzUgOS4zYy4yODItLjI5LjQxLS42NjguNDEtMS4xMiAwLS44NzQtLjUwNy0xLjk2My0xLjQwNi0yLjg2OC0xLjM2Mi0xLjM1OC0zLjE0Ny0xLjgtNC4wMDItLjk5TDMwLjk5IDUuMDFjLjg0NC0uODQgMi42NS0uNDEgNC4wMzUuOTYuODk4LjkwNCAxLjk4MiAxLjM5NiAyLjg1NU0xMC41MTUgMzMuNzc0Yy0uNTczLjMwMi0xLjE1Ny41Ny0xLjc2NC44M0w0LjUgMzYuMzgybDEuNzg2LTQuMjM1Yy4yNTgtLjYwNC41My0xLjE4Ni44MzMtLTEuNzU3LjY5LjE4MyAxLjQ0OC42MjUgMi4xMDggMS4yODIuNjYuNjU4IDEuMTAyIDEuNDEyIDEuMjg3IDIuMTAyIiBmaWxsPSIjNEM5N0ZGIi8+PC9nPjwvc3ZnPg==';

const currentMode = require('../../util/mode');
const formatMessage = require('format-message');
const socket = require('../../util/localSocket');
// AK: ak_29173d2e9ee25d21112ccd0388f11e03
// SK:4b26ff2f4cd045822b40f238b87d05e32e06c8b9b5482f6856adb517097c4a01
//CN0125MH00100106066
class Zeroth {
    constructor(runtime) {
        this.runtime = runtime;

        this.mode = true;

        this.channelMode = new BroadcastChannel('mode');

        this.channelMode.addEventListener('message', event => {
            this.mode = event.data;
            currentMode.setMode(event.data);
        });

        if (!socket.getSocket()) {
            socket.setSocket();
        }

        /*
         * 乐享 API 配置
         */
        this.configData = {
            accessKey: '',
            secret: '',
            deviceSN: '',
            deviceTypeId: '2'
        };

        /*
         * API 地址
         */
        this.baseURL = 'https://api-open-test.joyin-ai.com';

        /*
         * 保存已经生成的 Nonce
         */
        this.usedNonces = new Set();

        /*
         * 加载配置
         */
        this.loadConfig();

        /*
         * 注入 CSS
         */
        this.injectConfigModalStyle();
        this.injectDeviceModalStyle();
    }

    getInfo() {
        return {
            id: 'zeroth',

            name: formatMessage({
                id: 'zeroth.name',
                default: '乐享机器人',
                description: 'zeroth.name'
            }),

            color1: '#9400d3',

            blocks: [
                /*
                 * 配置按钮
                 */
                {
                    func: 'config',
                    blockType: BlockType.BUTTON,
                    text: formatMessage({
                        id: 'zeroth.config',
                        default: '配置',
                        description: 'zeroth.config'
                    })
                },

                /*
                 * 设备绑定按钮
                 */
                {
                    func: 'deviceBinding',
                    blockType: BlockType.BUTTON,
                    text: formatMessage({
                        id: 'zeroth.deviceBinding',
                        default: '设备绑定',
                        description: 'zeroth.deviceBinding'
                    })
                },

                /*
                 * 前进
                 */
                {
                    opcode: 'moveForward',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'zeroth.moveForward',
                        default: '[PLACE]以线速度 [SPEED] 前进 [TIME] 毫秒',
                        description: 'zeroth.moveForward'
                    }),
                    arguments: {
                        PLACE: {
                            type: ArgumentType.STRING,
                            menu: 'PLACE_MENU'
                        },
                        SPEED: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0.2
                        },

                        TIME: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 2000
                        }
                    }
                },

                /*
                 * 后退
                 */
                {
                    opcode: 'moveBackward',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'zeroth.moveBackward',
                        default: '[PLACE]以线速度 [SPEED] 后退 [TIME] 毫秒',
                        description: 'zeroth.moveBackward'
                    }),
                    arguments: {
                        PLACE: {
                            type: ArgumentType.STRING,
                            menu: 'PLACE_MENU'
                        },
                        SPEED: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0.2
                        },

                        TIME: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 2000
                        }
                    }
                },

                /*
                 * 左转
                 */
                {
                    opcode: 'turnLeft',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'zeroth.turnLeft',
                        default: '[PLACE]以角速度 [SPEED] 左转 [TIME] 毫秒',
                        description: 'zeroth.turnLeft'
                    }),
                    arguments: {
                        PLACE: {
                            type: ArgumentType.STRING,
                            menu: 'PLACE_MENU'
                        },
                        SPEED: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0.5
                        },

                        TIME: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1000
                        }
                    }
                },

                /*
                 * 右转
                 */
                {
                    opcode: 'turnRight',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'zeroth.turnRight',
                        default: '[PLACE]以角速度 [SPEED] 右转 [TIME] 毫秒',
                        description: 'zeroth.turnRight'
                    }),
                    arguments: {
                        PLACE: {
                            type: ArgumentType.STRING,
                            menu: 'PLACE_MENU'
                        },
                        SPEED: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0.5
                        },

                        TIME: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1000
                        }
                    }
                },

                /*
                 * 停止
                 */
                {
                    opcode: 'stop',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'zeroth.stop',
                        default: '停止',
                        description: 'zeroth.stop'
                    }),
                    arguments: {}
                },

                /*
                 * 急停
                 */
                {
                    opcode: 'emergencyStop',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'zeroth.emergencyStop',
                        default: '紧急停止',
                        description: 'zeroth.emergencyStop'
                    }),
                    arguments: {}
                },

                {
                    opcode: 'chargeStart',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'zeroth.chargeStart',
                        default: '开始回充',
                        description: 'zeroth.chargeStart'
                    }),
                    arguments: {}
                },

                {
                    opcode: 'chargeStop',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'zeroth.chargeStop',
                        default: '停止回充',
                        description: 'zeroth.chargeStop'
                    }),
                    arguments: {}
                },
                {
                    opcode: 'chargeCancel',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'zeroth.chargeCancel',
                        default: '取消回充',
                        description: 'zeroth.chargeCancel'
                    }),
                    arguments: {}
                },
                {
                    opcode: 'chargeState',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'zeroth.chargeState',
                        default: '获取回充状态',
                        description: 'zeroth.chargeState'
                    }),
                    arguments: {},
                    disableMonitor: true
                },

                {
                    opcode: 'chargeLeave',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'zeroth.chargeLeave',
                        default: '开始出桩',
                        description: 'zeroth.chargeLeave'
                    }),
                    arguments: {},
                    // disableMonitor: true
                },
                {
                    opcode: 'chargeLeaveState',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'zeroth.chargeLeaveState',
                        default: '离桩状态',
                        description: 'zeroth.chargeLeaveState'
                    }),
                    arguments: {},
                    disableMonitor: true
                },
                {
                    opcode: 'action',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'zeroth.action',
                        default: '执行 [ACTION] 动作',
                        description: 'zeroth.action'
                    }),
                    arguments: {
                        ACTION:{
                            type: ArgumentType.STRING,
                            menu: 'ACTION_MENU'
                        }
                        
                    },
                },

                {
                    opcode: 'actionModel',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'zeroth.actionModel',
                        default: '执行 [MODEL] 动作',
                        description: 'zeroth.actionModel'
                    }),
                    arguments: {
                        MODEL:{
                            type: ArgumentType.STRING,
                            menu: 'MODEL_MENU'
                        }
                        
                    },
                },
                {
                    opcode: 'headContral',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'zeroth.headContral',
                        default: '设置头部[MODEL]',
                        description: 'zeroth.headContral'
                    }),
                    arguments: {
                        MODEL:{
                            type: ArgumentType.STRING,
                            menu: 'MODEL_MENU'
                        }
                        
                    },
                },

            ],

            menus: {
                ACTION_MENU: {
                    acceptReporters: false,
                    items: [
                        {
                            text: formatMessage({
                                id: 'zeroth.ACTION_MENU.mini_salute',
                                default: '敬礼',
                                description: 'zeroth.ACTION_MENU.mini_salute'
                            }),
                            value:'mini_salute'
                        },
                        {
                            text: formatMessage({
                                id: 'zeroth.ACTION_MENU.mini_smirk',
                                default: '偷笑',
                                description: 'zeroth.ACTION_MENU.mini_smirk'
                            }),
                            value:'mini_smirk'
                        },
                        {
                            text: formatMessage({
                                id: 'zeroth.ACTION_MENU.mini_scratch_head',
                                default: '挠头',
                                description: 'zeroth.ACTION_MENU.mini_scratch_head'
                            }),
                            value:'mini_scratch_head'
                        },
                        {
                            text: formatMessage({
                                id: 'zeroth.ACTION_MENU.mini_cheer',
                                default: '欢呼',
                                description: 'zeroth.ACTION_MENU.mini_cheer'
                            }),
                            value:'mini_cheer'
                        },
                        {
                            text: formatMessage({
                                id: 'zeroth.ACTION_MENU.mini_happy',
                                default: '开心',
                                description: 'zeroth.ACTION_MENU.mini_happy'
                            }),
                            value:'mini_happy'
                        },
                        {
                            text: formatMessage({
                                id: 'zeroth.ACTION_MENU.mini_hands_on_hips',
                                default: '叉腰',
                                description: 'zeroth.ACTION_MENU.mini_hands_on_hips'
                            }),
                            value:'mini_hands_on_hips'
                        },
                        {
                            text: formatMessage({
                                id: 'zeroth.ACTION_MENU.mini_squat',
                                default: '下蹲',
                                description: 'zeroth.ACTION_MENU.mini_squat'
                            }),
                            value:'mini_squat'
                        },
                      
                        {
                            text: formatMessage({
                                id: 'zeroth.ACTION_MENU.mini_sway',
                                default: '摇摆',
                                description: 'zeroth.ACTION_MENU.mini_sway'
                            }),
                            value:'mini_sway'
                        },
                        {
                            text: formatMessage({
                                id: 'zeroth.ACTION_MENU.mini_nod',
                                default: '点头',
                                description: 'zeroth.ACTION_MENU.mini_nod'
                            }),
                            value:'mini_nod'
                        },
                        {
                            text: formatMessage({
                                id: 'zeroth.ACTION_MENU.mini_shake_head',
                                default: '摇头',
                                description: 'zeroth.ACTION_MENU.mini_shake_head'
                            }),
                            value:'mini_shake_head'
                        },
                        {
                            text: formatMessage({
                                id: 'zeroth.ACTION_MENU.mini_handshake',
                                default: '握手',
                                description: 'zeroth.ACTION_MENU.mini_handshake'
                            }),
                            value:'mini_handshake'
                        },
                        {
                            text: formatMessage({
                                id: 'zeroth.ACTION_MENU.mini_turn_left',
                                default: '左转',
                                description: 'zeroth.ACTION_MENU.mini_turn_left'
                            }),
                            value:'mini_turn_left'
                        },
                        {
                            text: formatMessage({
                                id: 'zeroth.ACTION_MENU.mini_turn_right',
                                default: '右转',
                                description: 'zeroth.ACTION_MENU.mini_turn_right'
                            }),
                            value:'mini_turn_right'
                        },
                    ]
                },
                MODEL_MENU: {
                    acceptReporters: false,
                    items: [
                        {
                            text: formatMessage({
                                id: 'zeroth.MODEL_MENU.stand_up',
                                default: '站立',
                                description: 'zeroth.MODEL_MENU.stand_up'
                            }),
                            value:'stand_up'
                        },
                        {
                            text: formatMessage({
                                id: 'zeroth.MODEL_MENU.lock_foot',
                                default: '锁脚',
                                description: 'zeroth.MODEL_MENU.lock_foot'
                            }),
                            value:'lock_foot'
                        },
                        {
                            text: formatMessage({
                                id: 'zeroth.MODEL_MENU.split_foot',
                                default: '分脚',
                                description: 'zeroth.MODEL_MENU.split_foot'
                            }),
                            value:'split_foot'
                        },
                        {
                            text: formatMessage({
                                id: 'zeroth.MODEL_MENU.vision_boarding',
                                default: '视觉上车',
                                description: 'zeroth.MODEL_MENU.vision_boarding'
                            }),
                            value:'vision_boarding'
                        },
                        {
                            text: formatMessage({
                                id: 'zeroth.MODEL_MENU.get_off',
                                default: '下车',
                                description: 'zeroth.MODEL_MENU.get_off'
                            }),
                            value:'get_off'
                        },
                    ]
                },
                PLACE_MENU: {
                    acceptReporters: false,
                    items: [
                        {
                            text: formatMessage({
                                id: 'zeroth.PLACE_MENU.on_foot',
                                default: '双脚',
                                description: 'zeroth.PLACE_MENU.on_foot'
                            }),
                            value:'on_foot'
                        },
                        {
                            text: formatMessage({
                                id: 'zeroth.PLACE_MENU.on_car',
                                default: '车上',
                                description: 'zeroth.PLACE_MENU.on_car'
                            }),
                            value:'on_car'
                        }
                    ]
                },
            }
        };
    }

    /*
     * =========================================================
     * 配置相关
     * =========================================================
     */

    loadConfig() {
        try {
            const value = localStorage.getItem(
                'zeroth-joyin-config'
            );

            if (!value) {
                return;
            }

            const config = JSON.parse(value);

            this.configData.accessKey =
                config.accessKey || '';

            this.configData.secret =
                config.secret || '';

            this.configData.deviceSN =
                config.deviceSN || '';

            this.configData.deviceTypeId =
                config.deviceTypeId || '2';
        } catch (error) {
            console.error(
                '[Zeroth] load config failed:',
                error
            );
        }
    }

    saveConfig() {
        try {
            localStorage.setItem(
                'zeroth-joyin-config',
                JSON.stringify(this.configData)
            );
        } catch (error) {
            console.error(
                '[Zeroth] save config failed:',
                error
            );
        }
    }

    /*
     * =========================================================
     * Config 弹窗
     * =========================================================
     */

    config() {
        this.createConfigModal();
    }

    createConfigModal() {
        const oldModal =
            document.getElementById(
                'zeroth-config-modal'
            );

        if (oldModal) {
            oldModal.remove();
        }

        const modal =
            document.createElement('div');

        modal.id =
            'zeroth-config-modal';

        modal.innerHTML = `
            <div class="zeroth-config-overlay">
                <div class="zeroth-config-panel">

                    <div class="zeroth-config-header">
                        <div class="zeroth-config-title">
                            乐享机器人配置
                        </div>

                        <button
                            type="button"
                            class="zeroth-config-close"
                            id="zeroth-config-close"
                        >
                            ×
                        </button>
                    </div>

                    <div class="zeroth-config-description">
                        配置乐享开放平台信息后，即可使用积木控制机器人。
                    </div>

                    <div class="zeroth-config-form">

                        <div class="zeroth-config-field">
                            <label>
                                Access Key
                            </label>

                            <input
                                id="zeroth-access-key"
                                type="text"
                                autocomplete="off"
                                placeholder="请输入 Access Key"
                            />
                        </div>

                        <div class="zeroth-config-field">
                            <label>
                                Secret
                            </label>

                            <div class="zeroth-secret-wrapper">

                                <input
                                    id="zeroth-secret"
                                    type="password"
                                    autocomplete="off"
                                    placeholder="请输入 Secret"
                                />

                                <button
                                    type="button"
                                    id="zeroth-secret-toggle"
                                    class="zeroth-secret-toggle"
                                >
                                    显示
                                </button>

                            </div>
                        </div>

                        <div class="zeroth-config-field">
                            <label>
                                Device-SN
                            </label>

                            <input
                                id="zeroth-device-sn"
                                type="text"
                                autocomplete="off"
                                placeholder="请输入机器人 Device-SN"
                            />
                        </div>

                        <div class="zeroth-config-field">
                            <label>
                                Device-Type-Id
                            </label>

                            <select
                                id="zeroth-device-type-id"
                            >
                                <option value="2">
                                    M-1（类型 2）
                                </option>

                                <option value="3">
                                    W-1（类型 3）
                                </option>
                            </select>
                        </div>

                    </div>

                    <div class="zeroth-config-tip">

                        <span class="zeroth-config-tip-icon">
                            i
                        </span>

                        <span>
                            Secret 仅用于生成 API 请求签名。
                        </span>

                    </div>

                    <div class="zeroth-config-footer">

                        <button
                            type="button"
                            id="zeroth-config-cancel"
                            class="zeroth-config-button zeroth-config-cancel"
                        >
                            取消
                        </button>

                        <button
                            type="button"
                            id="zeroth-config-save"
                            class="zeroth-config-button zeroth-config-save"
                        >
                            保存配置
                        </button>

                    </div>

                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const accessKeyInput =
            document.getElementById(
                'zeroth-access-key'
            );

        const secretInput =
            document.getElementById(
                'zeroth-secret'
            );

        const deviceSNInput =
            document.getElementById(
                'zeroth-device-sn'
            );

        const deviceTypeInput =
            document.getElementById(
                'zeroth-device-type-id'
            );

        accessKeyInput.value =
            this.configData.accessKey || '';

        secretInput.value =
            this.configData.secret || '';

        deviceSNInput.value =
            this.configData.deviceSN || '';

        deviceTypeInput.value =
            this.configData.deviceTypeId || '2';

        document
            .getElementById('zeroth-config-close')
            .addEventListener('click', () => {
                this.closeConfigModal();
            });

        document
            .getElementById('zeroth-config-cancel')
            .addEventListener('click', () => {
                this.closeConfigModal();
            });

        document
            .getElementById('zeroth-config-save')
            .addEventListener('click', () => {
                this.saveConfigFromModal();
            });

        document
            .getElementById('zeroth-secret-toggle')
            .addEventListener('click', () => {
                const button =
                    document.getElementById(
                        'zeroth-secret-toggle'
                    );

                const input =
                    document.getElementById(
                        'zeroth-secret'
                    );

                if (input.type === 'password') {
                    input.type = 'text';
                    button.textContent = '隐藏';
                } else {
                    input.type = 'password';
                    button.textContent = '显示';
                }
            });

        const overlay =
            modal.querySelector(
                '.zeroth-config-overlay'
            );

        overlay.addEventListener(
            'click',
            event => {
                if (event.target === overlay) {
                    this.closeConfigModal();
                }
            }
        );

        modal.addEventListener(
            'keydown',
            event => {
                if (event.key === 'Enter') {
                    this.saveConfigFromModal();
                }

                if (event.key === 'Escape') {
                    this.closeConfigModal();
                }
            }
        );

        setTimeout(() => {
            accessKeyInput.focus();
        }, 50);
    }

    saveConfigFromModal() {
        const accessKeyInput =
            document.getElementById(
                'zeroth-access-key'
            );

        const secretInput =
            document.getElementById(
                'zeroth-secret'
            );

        const deviceSNInput =
            document.getElementById(
                'zeroth-device-sn'
            );

        const deviceTypeInput =
            document.getElementById(
                'zeroth-device-type-id'
            );

        if (
            !accessKeyInput ||
            !secretInput ||
            !deviceSNInput ||
            !deviceTypeInput
        ) {
            return;
        }

        const accessKey =
            accessKeyInput.value.trim();

        const secret =
            secretInput.value.trim();

        const deviceSN =
            deviceSNInput.value.trim();

        const deviceTypeId =
            deviceTypeInput.value;

        if (!accessKey) {
            this.showConfigError(
                accessKeyInput,
                '请输入 Access Key'
            );

            return;
        }

        if (!secret) {
            this.showConfigError(
                secretInput,
                '请输入 Secret'
            );

            return;
        }

        if (!deviceSN) {
            this.showConfigError(
                deviceSNInput,
                '请输入 Device-SN'
            );

            return;
        }

        if (
            deviceTypeId !== '2' &&
            deviceTypeId !== '3'
        ) {
            this.showConfigError(
                deviceTypeInput,
                'Device-Type-Id 无效'
            );

            return;
        }

        this.configData.accessKey =
            accessKey;

        this.configData.secret =
            secret;

        this.configData.deviceSN =
            deviceSN;

        this.configData.deviceTypeId =
            deviceTypeId;

        this.saveConfig();

        this.closeConfigModal();

        this.showConfigToast(
            '配置保存成功'
        );
    }

    showConfigError(input, message) {
        if (!input) {
            return;
        }

        input.classList.add(
            'zeroth-config-input-error'
        );

        input.focus();

        let errorElement =
            input.parentElement.querySelector(
                '.zeroth-config-error'
            );

        if (!errorElement) {
            errorElement =
                document.createElement('div');

            errorElement.className =
                'zeroth-config-error';

            input.parentElement.appendChild(
                errorElement
            );
        }

        errorElement.textContent =
            message;

        const clearError = () => {
            input.classList.remove(
                'zeroth-config-input-error'
            );

            if (errorElement) {
                errorElement.remove();
            }

            input.removeEventListener(
                'input',
                clearError
            );
        };

        input.addEventListener(
            'input',
            clearError
        );
    }

    closeConfigModal() {
        const modal =
            document.getElementById(
                'zeroth-config-modal'
            );

        if (!modal) {
            return;
        }

        modal.remove();
    }

    showConfigToast(message) {
        const oldToast =
            document.getElementById(
                'zeroth-config-toast'
            );

        if (oldToast) {
            oldToast.remove();
        }

        const toast =
            document.createElement('div');

        toast.id =
            'zeroth-config-toast';

        toast.className =
            'zeroth-config-toast';

        toast.textContent =
            message;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add(
                'zeroth-config-toast-show'
            );
        }, 10);

        setTimeout(() => {
            toast.classList.remove(
                'zeroth-config-toast-show'
            );

            setTimeout(() => {
                toast.remove();
            }, 250);
        }, 1800);
    }

    /*
     * =========================================================
     * 设备绑定 / 解绑
     * =========================================================
     */

    deviceBinding() {
        this.createDeviceBindingModal();
    }

    createDeviceBindingModal() {
        const oldModal =
            document.getElementById(
                'zeroth-device-modal'
            );

        if (oldModal) {
            oldModal.remove();
        }

        const modal =
            document.createElement('div');

        modal.id =
            'zeroth-device-modal';

        const deviceSN =
            this.configData.deviceSN || '';

        const deviceTypeId =
            this.configData.deviceTypeId || '';

        modal.innerHTML = `
            <div class="zeroth-device-overlay">

                <div class="zeroth-device-panel">

                    <div class="zeroth-device-header">

                        <div>
                            <div class="zeroth-device-title">
                                设备绑定
                            </div>

                            <div class="zeroth-device-subtitle">
                                管理当前配置的机器人设备
                            </div>
                        </div>

                        <button
                            type="button"
                            id="zeroth-device-close"
                            class="zeroth-device-close"
                        >
                            ×
                        </button>

                    </div>

                    <div class="zeroth-device-content">

                        <div class="zeroth-device-info-card">

                            <div class="zeroth-device-info-title">
                                当前设备
                            </div>

                            <div class="zeroth-device-info-row">

                                <span class="zeroth-device-info-label">
                                    Device-SN
                                </span>

                                <span
                                    id="zeroth-device-sn-value"
                                    class="zeroth-device-info-value"
                                >
                                    ${this.escapeHtml(
                                        deviceSN || '未配置'
                                    )}
                                </span>

                            </div>

                            <div class="zeroth-device-info-row">

                                <span class="zeroth-device-info-label">
                                    Device-Type-Id
                                </span>

                                <span
                                    class="zeroth-device-info-value"
                                >
                                    ${this.escapeHtml(
                                        deviceTypeId || '未配置'
                                    )}
                                </span>

                            </div>

                        </div>

                        <div class="zeroth-device-description">
                            绑定设备后，当前账号将获得该机器人的使用权限。
                            解绑后将解除当前设备与账号之间的绑定关系。
                        </div>

                        <div
                            id="zeroth-device-result"
                            class="zeroth-device-result"
                        ></div>

                        <div class="zeroth-device-actions">

                            <button
                                type="button"
                                id="zeroth-device-bind"
                                class="zeroth-device-action-button zeroth-device-bind-button"
                            >
                                <span class="zeroth-device-button-icon">
                                    ✓
                                </span>

                                <span>
                                    绑定设备
                                </span>
                            </button>

                            <button
                                type="button"
                                id="zeroth-device-unbind"
                                class="zeroth-device-action-button zeroth-device-unbind-button"
                            >
                                <span class="zeroth-device-button-icon">
                                    −
                                </span>

                                <span>
                                    解绑设备
                                </span>
                            </button>

                        </div>

                    </div>

                    <div class="zeroth-device-footer">

                        <button
                            type="button"
                            id="zeroth-device-cancel"
                            class="zeroth-device-cancel"
                        >
                            关闭
                        </button>

                    </div>

                </div>

            </div>
        `;

        document.body.appendChild(modal);

        /*
         * 关闭
         */
        document
            .getElementById('zeroth-device-close')
            .addEventListener('click', () => {
                this.closeDeviceBindingModal();
            });

        document
            .getElementById('zeroth-device-cancel')
            .addEventListener('click', () => {
                this.closeDeviceBindingModal();
            });

        /*
         * 绑定
         */
        document
            .getElementById('zeroth-device-bind')
            .addEventListener('click', () => {
                this.bindDevice();
            });

        /*
         * 解绑
         */
        document
            .getElementById('zeroth-device-unbind')
            .addEventListener('click', () => {
                this.unbindDevice();
            });

        /*
         * 点击遮罩关闭
         */
        const overlay =
            modal.querySelector(
                '.zeroth-device-overlay'
            );

        overlay.addEventListener(
            'click',
            event => {
                if (event.target === overlay) {
                    this.closeDeviceBindingModal();
                }
            }
        );

        /*
         * ESC 关闭
         */
        modal.addEventListener(
            'keydown',
            event => {
                if (event.key === 'Escape') {
                    this.closeDeviceBindingModal();
                }
            }
        );
    }

    /*
     * =========================================================
     * 绑定设备
     * =========================================================
     */

    async bindDevice() {
        /*
         * 检查配置
         */
        if (!this.checkApiConfig()) {
            return;
        }

        const button =
            document.getElementById(
                'zeroth-device-bind'
            );

        this.setDeviceButtonsLoading(true);

        this.showDeviceResult(
            '正在绑定设备，请稍候...',
            'loading'
        );

        try {
            const result =
                await this.request(
                    'POST',
                    '/api/v1/user/bind/robot/biz',
                    {
                        device_sn:
                            'CN0125MH00100106066'
                    }
                );

            console.log(
                '[Zeroth] bind device result:',
                result
            );

            if (
                result &&
                (
                    result.code === 200 ||
                    result.code === 0
                )
            ) {
                let message =
                    result.msg ||
                    '设备绑定成功';

                /*
                 * 如果接口返回 created，
                 * 给用户补充显示。
                 */
                if (
                    result.data &&
                    typeof result.data.created === 'boolean'
                ) {
                    if (result.data.created) {
                        message +=
                            '，已创建用户并完成绑定';
                    } else {
                        message +=
                            '，设备此前已经绑定';
                    }
                }

                this.showDeviceResult(
                    message,
                    'success'
                );
            } else {
                const message =
                    result &&
                    result.msg
                        ? result.msg
                        : '设备绑定失败';

                this.showDeviceResult(
                    message,
                    'error'
                );
            }
        } catch (error) {
            console.error(
                '[Zeroth] bind device failed:',
                error
            );

            this.showDeviceResult(
                error.message ||
                    '设备绑定失败',
                'error'
            );
        } finally {
            this.setDeviceButtonsLoading(false);
        }
    }

    /*
     * =========================================================
     * 解绑设备
     * =========================================================
     */

    async unbindDevice() {
        /*
         * 检查配置
         */
        if (!this.checkApiConfig()) {
            return;
        }

        this.setDeviceButtonsLoading(true);

        this.showDeviceResult(
            '正在解绑设备，请稍候...',
            'loading'
        );

        try {
            const result =
                await this.request(
                    'POST',
                    '/api/v1/user/unbind/robot/biz',
                    {
                        device_sn:
                            'CN0125MH00100106066'
                    }
                );

            console.log(
                '[Zeroth] unbind device result:',
                result
            );

            if (
                result &&
                (
                    result.code === 200 ||
                    result.code === 0
                )
            ) {
                this.showDeviceResult(
                    result.msg ||
                        '设备解绑成功',
                    'success'
                );
            } else {
                const message =
                    result &&
                    result.msg
                        ? result.msg
                        : '设备解绑失败';

                this.showDeviceResult(
                    message,
                    'error'
                );
            }
        } catch (error) {
            console.error(
                '[Zeroth] unbind device failed:',
                error
            );

            this.showDeviceResult(
                error.message ||
                    '设备解绑失败',
                'error'
            );
        } finally {
            this.setDeviceButtonsLoading(false);
        }
    }

    /*
     * 检查 API 配置
     */
    checkApiConfig() {
        if (!this.configData.accessKey) {
            this.showDeviceResult(
                '请先点击 config 配置 Access Key',
                'error'
            );

            return false;
        }

        if (!this.configData.secret) {
            this.showDeviceResult(
                '请先点击 config 配置 Secret',
                'error'
            );

            return false;
        }

        if (!this.configData.deviceSN) {
            this.showDeviceResult(
                '请先点击 config 配置 Device-SN',
                'error'
            );

            return false;
        }

        if (!this.configData.deviceTypeId) {
            this.showDeviceResult(
                '请先点击 config 配置 Device-Type-Id',
                'error'
            );

            return false;
        }

        return true;
    }

    /*
     * 设置绑定按钮加载状态
     */
    setDeviceButtonsLoading(loading) {
        const bindButton =
            document.getElementById(
                'zeroth-device-bind'
            );

        const unbindButton =
            document.getElementById(
                'zeroth-device-unbind'
            );

        if (!bindButton || !unbindButton) {
            return;
        }

        bindButton.disabled =
            loading;

        unbindButton.disabled =
            loading;

        if (loading) {
            bindButton.classList.add(
                'zeroth-device-button-loading'
            );

            unbindButton.classList.add(
                'zeroth-device-button-loading'
            );

            bindButton.dataset.oldText =
                bindButton.innerText;

            unbindButton.dataset.oldText =
                unbindButton.innerText;

            bindButton.innerHTML =
                '<span class="zeroth-device-spinner"></span>处理中...';

            unbindButton.innerHTML =
                '<span class="zeroth-device-spinner"></span>处理中...';
        } else {
            bindButton.classList.remove(
                'zeroth-device-button-loading'
            );

            unbindButton.classList.remove(
                'zeroth-device-button-loading'
            );

            bindButton.innerHTML = `
                <span class="zeroth-device-button-icon">
                    ✓
                </span>
                <span>
                    绑定设备
                </span>
            `;

            unbindButton.innerHTML = `
                <span class="zeroth-device-button-icon">
                    −
                </span>
                <span>
                    解绑设备
                </span>
            `;
        }
    }

    /*
     * 显示绑定结果
     */
    showDeviceResult(message, type) {
        const result =
            document.getElementById(
                'zeroth-device-result'
            );

        if (!result) {
            return;
        }

        result.className =
            'zeroth-device-result';

        if (type === 'success') {
            result.classList.add(
                'zeroth-device-result-success'
            );
        }

        if (type === 'error') {
            result.classList.add(
                'zeroth-device-result-error'
            );
        }

        if (type === 'loading') {
            result.classList.add(
                'zeroth-device-result-loading'
            );
        }

        result.textContent =
            message;
    }

    /*
     * 关闭设备绑定窗口
     */
    closeDeviceBindingModal() {
        const modal =
            document.getElementById(
                'zeroth-device-modal'
            );

        if (!modal) {
            return;
        }

        modal.remove();
    }

    /*
     * HTML 转义
     */
    escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    /*
     * =========================================================
     * Timestamp
     * =========================================================
     */

    generateTimestamp() {
        return Math.floor(
            Date.now() / 1000
        ).toString();
    }

    /*
     * =========================================================
     * Nonce
     * =========================================================
     */

    generateNonce() {
        let nonce = '';

        do {
            const randomPart =
                Math.random()
                    .toString(36)
                    .substring(2, 15);

            const timePart =
                Date.now().toString(36);

            nonce =
                `${timePart}-${randomPart}`;
        } while (
            this.usedNonces.has(nonce)
        );

        this.usedNonces.add(nonce);

        setTimeout(() => {
            this.usedNonces.delete(nonce);
        }, 5 * 60 * 1000);

        return nonce;
    }
    /*
    * =========================================================
    * SHA256
    * =========================================================
    */

    async sha256Hex(text) {
        const encoder =
            new TextEncoder();

        const data =
            encoder.encode(text);

        const hashBuffer =
            await crypto.subtle.digest(
                'SHA-256',
                data
            );

        return this.bufferToHex(
            hashBuffer
        );
    }

    /*
    * =========================================================
    * HMAC-SHA256
    * =========================================================
    */

    async hmacSha256Hex(
        key,
        text
    ) {
        const encoder =
            new TextEncoder();

        const keyData =
            encoder.encode(key);

        const textData =
            encoder.encode(text);

        const cryptoKey =
            await crypto.subtle.importKey(
                'raw',
                keyData,
                {
                    name: 'HMAC',
                    hash: 'SHA-256'
                },
                false,
                ['sign']
            );

        const signatureBuffer =
            await crypto.subtle.sign(
                'HMAC',
                cryptoKey,
                textData
            );

        return this.bufferToHex(
            signatureBuffer
        );
    }

    /*
    * =========================================================
    * ArrayBuffer -> 小写十六进制
    * =========================================================
    */

    bufferToHex(buffer) {
        const bytes =
            new Uint8Array(buffer);

        let result = '';

        for (let i = 0; i < bytes.length; i++) {
            result +=
                bytes[i]
                    .toString(16)
                    .padStart(2, '0');
        }

        return result;
    }

    /*
     * =========================================================
     * Signature
     * =========================================================
     *
     * 当前暂时留空。
     *
     * 后续拿到乐享 v2 签名规则之后，
     * 只需要修改这里。
     */

    async generateSignature({
        method,
        path,
        query,
        body,
        accessKey,
        secret,
        timestamp,
        nonce
    }) {
        /*
         * =========================================================
         * 1. method
         * 必须大写
         * =========================================================
         */
    
        method =
            String(method || '')
                .trim()
                .toUpperCase();
    
        /*
         * =========================================================
         * 2. path
         * 为空时使用 /
         * =========================================================
         */
    
        path =
            String(path || '/');
    
        if (!path.startsWith('/')) {
            path = '/' + path;
        }
    
        /*
         * =========================================================
         * 3. query
         *
         * 对齐 Go:
         *
         * r.URL.Query().Encode()
         *
         * key 按字典序排序
         * URL 编码
         * 空格使用 +
         * =========================================================
         */
    
        const queryPairs = [];
    
        if (query && typeof query === 'object') {
            Object.keys(query)
                .sort()
                .forEach(key => {
                    const value = query[key];
    
                    if (
                        value === undefined ||
                        value === null
                    ) {
                        queryPairs.push([
                            key,
                            ''
                        ]);
    
                        return;
                    }
    
                    /*
                     * 如果 value 是数组，
                     * 按多个 query 参数处理。
                     *
                     * 例如：
                     *
                     * {
                     *     id: ['1', '2']
                     * }
                     *
                     * =>
                     *
                     * id=1&id=2
                     */
    
                    if (Array.isArray(value)) {
                        value.forEach(item => {
                            queryPairs.push([
                                key,
                                String(item)
                            ]);
                        });
    
                        return;
                    }
    
                    queryPairs.push([
                        key,
                        String(value)
                    ]);
                });
        }
    
        /*
         * URLSearchParams 会：
         *
         * - URL encode
         * - 空格编码成 +
         *
         * 因此符合文档要求。
         */
    
        const queryParams =
            new URLSearchParams();
    
        queryPairs.forEach(
            ([key, value]) => {
                queryParams.append(
                    key,
                    value
                );
            }
        );
    
        const canonicalQuery =
            queryParams.toString();
    
        /*
         * =========================================================
         * 4. bodyHash
         *
         * 对原始 JSON 字符串进行 SHA256。
         *
         * 无 body：
         *
         * SHA256("")
         *
         * =========================================================
         */
    
        let rawBody = '';
    
        if (body !== null && body !== undefined) {
            if (typeof body === 'string') {
                rawBody = body;
            } else {
                /*
                 * 注意：
                 *
                 * 这里必须和真正 fetch() 发送的 body
                 * 使用完全相同的 JSON.stringify() 结果。
                 */
    
                rawBody =
                    JSON.stringify(body);
            }
        }
    
        const bodyHash =
            await this.sha256Hex(rawBody);
    
        /*
         * =========================================================
         * 5. Header 相关字段
         * =========================================================
         */
    
        const contentType =
            'application/json'
                .trim()
                .toLowerCase();
    
        /*
         * 当前 API 地址：
         *
         * https://api-open-test.joyin-ai.com
         *
         * 这里需要取 host。
         *
         * 注意：
         *
         * 文档 Python 示例使用：
         *
         * parsed.netloc
         *
         * 所以这里也使用 URL.host。
         */
    
        const apiURL =
            new URL(
                this.baseURL + path
            );
    
        const host =
            apiURL.host
                .trim()
                .toLowerCase();
    
        /*
         * =========================================================
         * 6. 固定签名版本
         * =========================================================
         */
    
        const signatureVersion =
            'v2';
    
        const apiVersion =
            'v1';
    
        /*
         * =========================================================
         * 7. Device 信息
         * =========================================================
         */
    
        const deviceSN =
            String(
                this.configData.deviceSN ||
                ''
            ).trim();
    
        const deviceTypeId =
            String(
                this.configData.deviceTypeId ||
                ''
            ).trim();
    
        /*
         * =========================================================
         * 8. Access Key
         * =========================================================
         */
    
        const ak =
            String(
                accessKey || ''
            ).trim();
    
        /*
         * =========================================================
         * 9. Secret Key
         * =========================================================
         */
    
        const sk =
            String(
                secret || ''
            ).trim();
    
        /*
         * =========================================================
         * 10. 生成签名串
         *
         * 顺序必须严格保持和 API 文档一致。
         * =========================================================
         */
    
        const stringToSign = [
            `method=${method}`,
    
            `path=${path}`,
    
            `query=${canonicalQuery}`,
    
            `bodyHash=${bodyHash}`,
    
            'signedHeaders=content-type;host;device-sn;device-type-id;x-api-version',
    
            `device_sn=${deviceSN}`,
    
            `device_type_id=${deviceTypeId}`,
    
            `contentType=${contentType}`,
    
            `host=${host}`,
    
            `signature_version=${signatureVersion}`,
    
            `access_key=${ak}`,
    
            `timestamp=${timestamp}`,
    
            `nonce=${nonce}`,
    
            `api_version=${apiVersion}`
        ].join('\n');
    
        /*
         * =========================================================
         * 11. 输出签名串，方便调试
         * =========================================================
         */
    
        console.log(
            '[Zeroth] string_to_sign:'
        );
    
        console.log(
            stringToSign
        );
    
        /*
         * =========================================================
         * 12. HMAC-SHA256
         *
         * 使用 SK 作为 HMAC Key
         * =========================================================
         */
    
        const signature =
            await this.hmacSha256Hex(
                sk,
                stringToSign
            );
    
        console.log(
            '[Zeroth] signature:',
            signature
        );
    
        return signature;
    }

    /*
     * =========================================================
     * Header
     * =========================================================
     */

    buildHeaders({
        timestamp,
        nonce,
        signature
    }) {
        return {
            'Content-Type': 'application/json',

            'X-Access-Key':
                this.configData.accessKey,

            'X-Timestamp':
                timestamp,

            'X-Nonce':
                nonce,

            'X-Signature':
                signature,

            'Device-SN':
                this.configData.deviceSN,

            'Device-Type-Id':
                this.configData.deviceTypeId,

            'X-Api-Version':
                'v1',

            'X-Signature-Version':
                'v2'
        };
    }

    /*
     * =========================================================
     * 通用 API 请求
     * =========================================================
     */

    // async request(
    //     method,
    //     path,
    //     body = null,
    //     query = {}
    // ) {
    //     if (!this.configData.accessKey) {
    //         throw new Error(
    //             '请先配置 Access Key'
    //         );
    //     }

    //     if (!this.configData.secret) {
    //         throw new Error(
    //             '请先配置 Secret'
    //         );
    //     }

    //     if (!this.configData.deviceSN) {
    //         throw new Error(
    //             '请先配置 Device-SN'
    //         );
    //     }

    //     if (!this.configData.deviceTypeId) {
    //         throw new Error(
    //             '请先配置 Device-Type-Id'
    //         );
    //     }

    //     /*
    //      * 每次请求生成新的 Timestamp
    //      */
    //     const timestamp =
    //         this.generateTimestamp();

    //     /*
    //      * 每次请求生成新的 Nonce
    //      */
    //     const nonce =
    //         this.generateNonce();

    //     /*
    //      * 生成签名
    //      */
    //     const signature =
    //         await this.generateSignature({
    //             method,
    //             path,
    //             query,
    //             body,
    //             accessKey:
    //                 this.configData.accessKey,
    //             secret:
    //                 this.configData.secret,
    //             timestamp,
    //             nonce
    //         });

    //     /*
    //      * 组装请求 Header
    //      */
    //     const headers =
    //         this.buildHeaders({
    //             timestamp,
    //             nonce,
    //             signature
    //         });

    //     console.log(
    //         '=============================='
    //     );

    //     console.log(
    //         '[Zeroth] Joyin API Request'
    //     );

    //     console.log(
    //         'Method:',
    //         method
    //     );

    //     console.log(
    //         'URL:',
    //         this.baseURL + path
    //     );

    //     console.log(
    //         'Headers:',
    //         headers
    //     );

    //     console.log(
    //         'Body:',
    //         body
    //     );

    //     console.log(
    //         'Query:',
    //         query
    //     );

    //     console.log(
    //         'Timestamp:',
    //         timestamp
    //     );

    //     console.log(
    //         'Nonce:',
    //         nonce
    //     );

    //     console.log(
    //         '=============================='
    //     );

    //     /*
    //      * 当前签名还没有实现。
    //      */
    //     // if (!signature) {
    //     //     console.warn(
    //     //         '[Zeroth] X-Signature 当前为空。'
    //     //     );

    //     //     console.warn(
    //     //         '[Zeroth] 请先实现 generateSignature()。'
    //     //     );

    //     //     return {
    //     //         success: false,
    //     //         signatureRequired: true,
    //     //         timestamp,
    //     //         nonce,
    //     //         headers,
    //     //         body
    //     //     };
    //     // }

    //     /*
    //      * URL
    //      */
    //     let url =
    //         this.baseURL + path;

    //     const searchParams =
    //         new URLSearchParams();

    //     Object.keys(query || {})
    //         .forEach(key => {
    //             if (
    //                 query[key] !== undefined &&
    //                 query[key] !== null
    //             ) {
    //                 searchParams.append(
    //                     key,
    //                     String(query[key])
    //                 );
    //             }
    //         });

    //     const queryString =
    //         searchParams.toString();

    //     if (queryString) {
    //         url += `?${queryString}`;
    //     }

    //     let response;

    //     try {
    //         response =
    //             await fetch(url, {
    //                 method,
    //                 headers,

    //                 body:
    //                     body === null
    //                         ? undefined
    //                         : JSON.stringify(body)
    //             });
    //     } catch (error) {
    //         console.error(
    //             '[Zeroth] Joyin API network error:',
    //             error
    //         );

    //         throw new Error(
    //             '网络请求失败，请检查网络连接'
    //         );
    //     }

    //     const text =
    //         await response.text();

    //     let data;

    //     try {
    //         data =
    //             text
    //                 ? JSON.parse(text)
    //                 : null;
    //     } catch (error) {
    //         data = text;
    //     }

    //     console.log(
    //         '[Zeroth] Joyin API Response:',
    //         response.status,
    //         data
    //     );

    //     if (!response.ok) {
    //         throw new Error(
    //             `HTTP ${response.status}: ${
    //                 typeof data === 'string'
    //                     ? data
    //                     : JSON.stringify(data)
    //             }`
    //         );
    //     }

    //     return data;
    // }
    async request(
        method,
        path,
        body = null,
        query = {}
    ) {
        if (!this.configData.accessKey) {
            throw new Error(
                '请先配置 Access Key'
            );
        }
    
        if (!this.configData.secret) {
            throw new Error(
                '请先配置 Secret'
            );
        }
    
        if (!this.configData.deviceSN) {
            throw new Error(
                '请先配置 Device-SN'
            );
        }
    
        if (!this.configData.deviceTypeId) {
            throw new Error(
                '请先配置 Device-Type-Id'
            );
        }
    
        /*
         * 每次请求生成新的 Timestamp
         */
        const timestamp =
            this.generateTimestamp();
    
        /*
         * 每次请求生成新的 Nonce
         */
        const nonce =
            this.generateNonce();
    
        /*
         * 生成签名
         *
         * 这里完全保持你原来的逻辑
         */
        const signature =
            await this.generateSignature({
                method,
                path,
                query,
                body,
                accessKey:
                    this.configData.accessKey,
                secret:
                    this.configData.secret,
                timestamp,
                nonce
            });
    
        /*
         * 生成 Joyin 请求 Header
         *
         * 这里仍然由前端生成
         */
        const headers =
            this.buildHeaders({
                timestamp,
                nonce,
                signature
            });
    
        /*
         * 构造 Joyin URL
         */
        let url =
            this.baseURL + path;
    
        /*
         * 构造 Query
         */
        const searchParams =
            new URLSearchParams();
    
        Object.keys(query || {})
            .forEach(key => {
                if (
                    query[key] !== undefined &&
                    query[key] !== null
                ) {
                    searchParams.append(
                        key,
                        String(query[key])
                    );
                }
            });
    
        const queryString =
            searchParams.toString();
    
        if (queryString) {
            url += `?${queryString}`;
        }
    
        /*
         * =====================================================
         * 非常重要
         *
         * 在前端先把 Body 序列化一次。
         *
         * 这样发送给 Node 的 body
         * 就是最终要发送给 Joyin 的原始字符串。
         * =====================================================
         */
        let rawBody;
    
        if (
            body === null ||
            body === undefined
        ) {
            rawBody = null;
        } else if (
            typeof body === 'string'
        ) {
            rawBody = body;
        } else {
            rawBody =
                JSON.stringify(body);
        }
    
        /*
         * 调试日志
         */
        console.log(
            '=============================='
        );
    
        console.log(
            '[Zeroth] Joyin API Request'
        );
    
        console.log(
            'Method:',
            method
        );
    
        console.log(
            'Joyin URL:',
            url
        );
    
        console.log(
            'Proxy URL:',
            'http://localhost:3001/api/joyin/proxy'
        );
    
        console.log(
            'Headers:',
            headers
        );
    
        console.log(
            'Body:',
            rawBody
        );
    
        console.log(
            'Query:',
            query
        );
    
        console.log(
            'Timestamp:',
            timestamp
        );
    
        console.log(
            'Nonce:',
            nonce
        );
    
        console.log(
            '=============================='
        );
    
        /*
         * =====================================================
         * 请求本地 Node 代理
         *
         * 不再直接请求 Joyin
         * =====================================================
         */
        let response;
    
        try {
            response =
                await fetch(
                    'http://localhost:3001/api/joyin/proxy',
                    {
                        method: 'POST',
    
                        headers: {
                            'Content-Type':
                                'application/json'
                        },
    
                        body:
                            JSON.stringify({
                                url,
                                method,
                                headers,
                                body: rawBody
                            })
                    }
                );
        } catch (error) {
            console.error(
                '[Zeroth] Joyin Proxy network error:',
                error
            );
    
            throw new Error(
                '无法连接本地 Joyin 代理服务，请确认 Node 代理服务已经启动'
            );
        }
    
        /*
         * 读取 Node 返回的数据
         *
         * Node 返回的就是 Joyin 原始响应
         */
        const text =
            await response.text();
    
        let data;
    
        try {
            data =
                text
                    ? JSON.parse(text)
                    : null;
        } catch (error) {
            data = text;
        }
    
        console.log(
            '[Zeroth] Joyin API Response:',
            response.status,
            data
        );
    
        /*
         * 保持你原来的错误处理逻辑
         */
        if (!response.ok) {
            throw new Error(
                `HTTP ${response.status}: ${
                    typeof data === 'string'
                        ? data
                        : JSON.stringify(data)
                }`
            );
        }
    
        return data;
    }

    /*
     * =========================================================
     * 机器人运动
     * =========================================================
     */

    async move(
        linearX,
        angularZ,
        durationMs,
        place
    ) {
        linearX =
            Number(linearX);

        angularZ =
            Number(angularZ);

        durationMs =
            Number(durationMs);

        if (!Number.isFinite(linearX)) {
            linearX = 0;
        }

        if (!Number.isFinite(angularZ)) {
            angularZ = 0;
        }

        if (!Number.isFinite(durationMs)) {
            durationMs = 1000;
        }

        durationMs =
            Math.max(
                1,
                Math.floor(durationMs)
            );

        return this.request(
            'POST',
            '/api/v1/open/interaction/cmd',
            {
                cmd_type:
                    'motion.control',

                status:
                    'move',

                data: {
                    linear_x:
                        linearX,

                    angular_z:
                        angularZ,

                    duration_ms:
                        durationMs,

                    mode:
                        place
                }
            }
        );
    }

    moveForward(args) {
        const speed =
            Math.abs(
                Number(args.SPEED)
            );

        const time =
            Number(args.TIME);
        const place = args.PLACE

        return this.move(
            speed,
            0,
            time,
            place
        );
    }

    moveBackward(args) {
        const speed =
            Math.abs(
                Number(args.SPEED)
            );

        const time =
            Number(args.TIME);

        const place = args.PLACE

        return this.move(
            -speed,
            0,
            time,
            place
        );
    }

    turnLeft(args) {
        const speed =
            Math.abs(
                Number(args.SPEED)
            );

        const time =
            Number(args.TIME);

        const place = args.PLACE

        return this.move(
            0,
            speed,
            time,
            place
        );
    }

    turnRight(args) {
        const speed =
            Math.abs(
                Number(args.SPEED)
            );

        const time =
            Number(args.TIME);
        const place = args.PLACE

        return this.move(
            0,
            -speed,
            time,
            place
        );
    }

    stop() {
        return this.request(
            'POST',
            '/api/v1/open/interaction/cmd',
            {
                cmd_type:
                    'motion.control',

                status:
                    'stop'
            }
        );
    }

    emergencyStop() {
        return this.request(
            'POST',
            '/api/v1/open/interaction/cmd',
            {
                cmd_type:
                    'motion.control',

                status:
                    'emergency_stop'
            }
        );
    }

    chargeStart(){
        return this.request(
            'POST',
            '/api/v1/open/charge/start'
            
        );
    }

    chargeStop(){
        return this.request(
            'POST',
            '/api/v1/open/charge/stop'
            
        );
    }
    chargeCancel(){
        return this.request(
            'POST',
            '/api/v1open/charge/cancel'
            
        );
    }
    chargeState(){
        return this.request(
            'GET',
            '/api/v1/open/charge/status'
            
        );
    }


    chargeLeave(){
        return this.request(
            'POST',
            '/api/v1/open/charge/leave'
            
        );
    }
    chargeLeaveState(){
        return this.request(
            'GET',
            '/v1/device/status'
            
        );
    }

    action(args){
        return this.request(
            'POST',
            '/api/v1/device/interaction/cmd',
            {
                cmd_type:
                    args.ACTION,

                status:
                    'on'
            }
        );
    }
    actionModel(args){
        return this.request(
            'POST',
            '/api/v1/open/interaction/cmd',
            {
                cmd_type:
                    'motion.action',

                status:
                    'start',
                data:{
                    action:args.MODEL
                }
            }
        );
    }
    /*
     * =========================================================
     * Config 弹窗 CSS
     * =========================================================
     */

    injectConfigModalStyle() {
        if (
            document.getElementById(
                'zeroth-config-style'
            )
        ) {
            return;
        }

        const style =
            document.createElement('style');

        style.id =
            'zeroth-config-style';

        style.textContent = `
            #zeroth-config-modal {
                position: fixed;
                left: 0;
                top: 0;
                width: 100vw;
                height: 100vh;
                z-index: 999999;
                font-family: Arial, sans-serif;
            }

            .zeroth-config-overlay {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(0, 0, 0, 0.42);
            }

            .zeroth-config-panel {
                width: 430px;
                max-width: calc(100vw - 40px);
                background: #ffffff;
                border-radius: 14px;
                box-shadow:
                    0 18px 50px rgba(0, 0, 0, 0.22);
                overflow: hidden;
                box-sizing: border-box;
            }

            .zeroth-config-header {
                height: 64px;
                padding: 0 22px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid #eeeeee;
                box-sizing: border-box;
            }

            .zeroth-config-title {
                font-size: 20px;
                font-weight: 600;
                color: #333333;
            }

            .zeroth-config-close {
                width: 34px;
                height: 34px;
                border: none;
                background: transparent;
                color: #888888;
                font-size: 27px;
                line-height: 30px;
                border-radius: 7px;
                cursor: pointer;
            }

            .zeroth-config-close:hover {
                background: #f3f3f3;
                color: #333333;
            }

            .zeroth-config-description {
                padding: 18px 22px 4px 22px;
                color: #777777;
                font-size: 13px;
                line-height: 20px;
            }

            .zeroth-config-form {
                padding: 18px 22px 8px 22px;
            }

            .zeroth-config-field {
                margin-bottom: 17px;
            }

            .zeroth-config-field label {
                display: block;
                margin-bottom: 7px;
                color: #444444;
                font-size: 14px;
                font-weight: 500;
            }

            .zeroth-config-field input,
            .zeroth-config-field select {
                width: 100%;
                height: 42px;
                padding: 0 12px;
                border: 1px solid #d9d9d9;
                border-radius: 7px;
                outline: none;
                background: #ffffff;
                color: #333333;
                font-size: 14px;
                box-sizing: border-box;
            }

            .zeroth-config-field input:focus,
            .zeroth-config-field select:focus {
                border-color: #575e75;
                box-shadow:
                    0 0 0 3px rgba(
                        87,
                        94,
                        117,
                        0.10
                    );
            }

            .zeroth-config-field input::placeholder {
                color: #aaaaaa;
            }

            .zeroth-secret-wrapper {
                position: relative;
            }

            .zeroth-secret-wrapper input {
                padding-right: 58px;
            }

            .zeroth-secret-toggle {
                position: absolute;
                right: 8px;
                top: 50%;
                transform: translateY(-50%);
                border: none;
                background: transparent;
                color: #777777;
                font-size: 12px;
                cursor: pointer;
                padding: 5px 6px;
            }

            .zeroth-secret-toggle:hover {
                color: #333333;
            }

            .zeroth-config-input-error {
                border-color: #e05252 !important;
                box-shadow:
                    0 0 0 3px rgba(
                        224,
                        82,
                        82,
                        0.10
                    ) !important;
            }

            .zeroth-config-error {
                margin-top: 5px;
                color: #e05252;
                font-size: 12px;
            }

            .zeroth-config-tip {
                margin: 2px 22px 20px 22px;
                padding: 10px 12px;
                display: flex;
                align-items: flex-start;
                gap: 8px;
                background: #f7f7f8;
                border-radius: 7px;
                color: #777777;
                font-size: 12px;
                line-height: 18px;
                box-sizing: border-box;
            }

            .zeroth-config-tip-icon {
                width: 16px;
                height: 16px;
                flex: 0 0 16px;
                margin-top: 1px;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1px solid #999999;
                border-radius: 50%;
                color: #777777;
                font-size: 10px;
                box-sizing: border-box;
            }

            .zeroth-config-footer {
                padding: 15px 22px;
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                border-top: 1px solid #eeeeee;
                background: #fafafa;
                box-sizing: border-box;
            }

            .zeroth-config-button {
                height: 38px;
                padding: 0 19px;
                border-radius: 7px;
                font-size: 14px;
                cursor: pointer;
                box-sizing: border-box;
            }

            .zeroth-config-cancel {
                border: 1px solid #d7d7d7;
                background: #ffffff;
                color: #555555;
            }

            .zeroth-config-cancel:hover {
                background: #f3f3f3;
            }

            .zeroth-config-save {
                border: 1px solid #575e75;
                background: #575e75;
                color: #ffffff;
            }

            .zeroth-config-save:hover {
                background: #4c5369;
            }

            .zeroth-config-toast {
                position: fixed;
                left: 50%;
                bottom: 35px;
                z-index: 1000000;
                padding: 10px 18px;
                border-radius: 7px;
                background: #333333;
                color: #ffffff;
                font-size: 13px;
                opacity: 0;
                transform:
                    translate(-50%, 10px);
                transition:
                    opacity 0.2s,
                    transform 0.2s;
                pointer-events: none;
            }

            .zeroth-config-toast-show {
                opacity: 1;
                transform:
                    translate(-50%, 0);
            }

            @media (max-width: 520px) {
                .zeroth-config-panel {
                    max-width:
                        calc(100vw - 24px);
                }

                .zeroth-config-header {
                    padding: 0 18px;
                }

                .zeroth-config-form {
                    padding-left: 18px;
                    padding-right: 18px;
                }

                .zeroth-config-description {
                    padding-left: 18px;
                    padding-right: 18px;
                }

                .zeroth-config-tip {
                    margin-left: 18px;
                    margin-right: 18px;
                }

                .zeroth-config-footer {
                    padding-left: 18px;
                    padding-right: 18px;
                }
            }
        `;

        document.head.appendChild(style);
    }

    /*
     * =========================================================
     * 设备绑定弹窗 CSS
     * =========================================================
     */

    injectDeviceModalStyle() {
        if (
            document.getElementById(
                'zeroth-device-style'
            )
        ) {
            return;
        }

        const style =
            document.createElement('style');

        style.id =
            'zeroth-device-style';

        style.textContent = `
            #zeroth-device-modal {
                position: fixed;
                left: 0;
                top: 0;
                width: 100vw;
                height: 100vh;
                z-index: 999999;
                font-family: Arial, sans-serif;
            }

            .zeroth-device-overlay {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(0, 0, 0, 0.42);
            }

            .zeroth-device-panel {
                width: 440px;
                max-width: calc(100vw - 40px);
                background: #ffffff;
                border-radius: 14px;
                overflow: hidden;
                box-shadow:
                    0 18px 50px rgba(0, 0, 0, 0.22);
                box-sizing: border-box;
            }

            .zeroth-device-header {
                min-height: 72px;
                padding: 0 22px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid #eeeeee;
                box-sizing: border-box;
            }

            .zeroth-device-title {
                color: #333333;
                font-size: 20px;
                font-weight: 600;
            }

            .zeroth-device-subtitle {
                margin-top: 5px;
                color: #999999;
                font-size: 12px;
            }

            .zeroth-device-close {
                width: 34px;
                height: 34px;
                border: none;
                background: transparent;
                color: #888888;
                font-size: 27px;
                line-height: 30px;
                border-radius: 7px;
                cursor: pointer;
            }

            .zeroth-device-close:hover {
                background: #f3f3f3;
                color: #333333;
            }

            .zeroth-device-content {
                padding: 20px 22px 22px 22px;
            }

            .zeroth-device-info-card {
                padding: 15px 16px;
                background: #f7f7f8;
                border-radius: 9px;
                box-sizing: border-box;
            }

            .zeroth-device-info-title {
                margin-bottom: 12px;
                color: #444444;
                font-size: 14px;
                font-weight: 600;
            }

            .zeroth-device-info-row {
                min-height: 29px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 15px;
            }

            .zeroth-device-info-label {
                color: #888888;
                font-size: 13px;
            }

            .zeroth-device-info-value {
                max-width: 260px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: #333333;
                font-size: 13px;
                font-family: Consolas, monospace;
            }

            .zeroth-device-description {
                margin-top: 15px;
                color: #777777;
                font-size: 12px;
                line-height: 19px;
            }

            .zeroth-device-result {
                min-height: 0;
                margin-top: 14px;
                padding: 0;
                border-radius: 7px;
                font-size: 13px;
                line-height: 20px;
                box-sizing: border-box;
            }

            .zeroth-device-result:not(:empty) {
                padding: 10px 12px;
            }

            .zeroth-device-result-success {
                background: #eef8f1;
                color: #368052;
            }

            .zeroth-device-result-error {
                background: #fff1f1;
                color: #d44d4d;
            }

            .zeroth-device-result-loading {
                background: #f4f4f5;
                color: #777777;
            }

            .zeroth-device-actions {
                margin-top: 18px;
                display: flex;
                gap: 12px;
            }

            .zeroth-device-action-button {
                flex: 1;
                height: 48px;
                border-radius: 8px;
                border: 1px solid;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 7px;
                font-size: 14px;
                cursor: pointer;
                transition:
                    background 0.15s,
                    border-color 0.15s;
            }

            .zeroth-device-bind-button {
                border-color: #575e75;
                background: #575e75;
                color: #ffffff;
            }

            .zeroth-device-bind-button:hover:not(:disabled) {
                background: #4c5369;
            }

            .zeroth-device-unbind-button {
                border-color: #d5d5d5;
                background: #ffffff;
                color: #555555;
            }

            .zeroth-device-unbind-button:hover:not(:disabled) {
                background: #f5f5f5;
            }

            .zeroth-device-action-button:disabled {
                opacity: 0.65;
                cursor: not-allowed;
            }

            .zeroth-device-button-icon {
                font-size: 16px;
                line-height: 1;
            }

            .zeroth-device-spinner {
                width: 14px;
                height: 14px;
                border: 2px solid rgba(255,255,255,0.35);
                border-top-color: currentColor;
                border-radius: 50%;
                animation:
                    zeroth-device-spin 0.7s linear infinite;
            }

            .zeroth-device-unbind-button
                .zeroth-device-spinner {
                border-color: rgba(0,0,0,0.15);
                border-top-color: #555555;
            }

            @keyframes zeroth-device-spin {
                from {
                    transform: rotate(0deg);
                }

                to {
                    transform: rotate(360deg);
                }
            }

            .zeroth-device-footer {
                height: 65px;
                padding: 0 22px;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                border-top: 1px solid #eeeeee;
                background: #fafafa;
                box-sizing: border-box;
            }

            .zeroth-device-cancel {
                height: 38px;
                padding: 0 20px;
                border: 1px solid #d7d7d7;
                border-radius: 7px;
                background: #ffffff;
                color: #555555;
                font-size: 14px;
                cursor: pointer;
            }

            .zeroth-device-cancel:hover {
                background: #f3f3f3;
            }

            @media (max-width: 520px) {
                .zeroth-device-panel {
                    max-width:
                        calc(100vw - 24px);
                }

                .zeroth-device-header {
                    padding-left: 18px;
                    padding-right: 18px;
                }

                .zeroth-device-content {
                    padding-left: 18px;
                    padding-right: 18px;
                }

                .zeroth-device-footer {
                    padding-left: 18px;
                    padding-right: 18px;
                }

                .zeroth-device-actions {
                    flex-direction: column;
                }
            }
        `;

        document.head.appendChild(style);
    }
}

module.exports = Zeroth;