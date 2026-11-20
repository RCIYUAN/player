import { post } from '../utils/format.js'

class Heartbeat {
    constructor(context) {
        this.player = context
        this.HearBeatTimer = null
        this.timer = 30 * 1000
    }

    start() {
        this.clear()
        // 30秒上报一次
        this.HearBeatTimer = setInterval(() => {
            this.send()
        }, this.timer)
    }

    clear() {
        clearInterval(this.HearBeatTimer)
        this.send()
    }

    send() {
        post(`/heartbeat`).then(res => {

        })
    }

    // online() {
    //     post(`/room/${this.player.epInfo.ep_id}`).then(res => {
    //         if (res.code == 0) {
                
    //         }
    //     })
    // }
}

export default Heartbeat