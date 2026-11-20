import { post } from '../utils/axios.js'

class Feedback {
    constructor(context) {
        this.player = context
    }

    postFeedback() {
        const data = {
            media_id: this.player.options.epInfo.media_id,
            ep_id: this.player.options.epInfo.ep_id,
            title: this.player.options.title,
            url: window.location.href,
        }
        try {
            post(`/feedback/video`, data)
        } catch (err) {
            console.log('连接失败')
        }
        
    }
}

export default Feedback