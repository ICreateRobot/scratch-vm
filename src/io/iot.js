//const BASE_URL = "http://192.168.20.161:3000";

class iot {
    constructor(runtime) {
        this.runtime = runtime;
    }

     getBaseUrl(){
        const ip = this.runtime.ioServer;
        if(!ip){
            console.warn("IoT server not connected");
            return null;
        }
        return `http://${ip}:3000`;
    }

    //发送控制数据
    async sendIotData(id, service, action, value = null) {
        const BASE_URL = this.getBaseUrl();
        if(!BASE_URL){
            return null;
        }

        try {
            const body = { id, service, action, data: value ?? {} };

            const res = await fetch(`${BASE_URL}/iot/call`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });

            return await res.json();

        } catch (err) {
            console.error(err);
            return null;
        }
    }

    //获取实体信息
    async getEntityState(id,service, dataType = null) {
        const BASE_URL = this.getBaseUrl();

        if(!BASE_URL){
            return null;
        }
        
        try {
            const body = { id, service};
            const res = await fetch(`${BASE_URL}/iot/state`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(body)
                });


            const result = await res.json();

            console.log("result", result);

            if (dataType === "state") {
                return result.state;
            }else if (dataType == "current_position") {
                return result.attributes.current_position
            }


            return result.state;  

            //return await res.json();
        } catch (err) {
            console.error(err);
            return null;
        }
    }
}

module.exports = iot;