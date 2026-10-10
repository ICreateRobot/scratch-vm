//提示窗口
class toast {
    constructor () {
        this._username = '';
    }

   guiToast(id, message, type, time) {
        window.dispatchEvent(
            new CustomEvent('gui-toast', { detail: {id, message, type, time}})
        );
    }
}

module.exports = toast;
