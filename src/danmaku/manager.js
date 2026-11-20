import Console from '../player/console.js'
import { get, post } from '../utils/axios.js'
import Draw from './draw.js'

class Manager {
    constructor(context) {
        this.player = context
        this.config = context.config
        this.container = context.container
        this.config.width = context.container.clientWidth
        this.config.height = context.container.clientHeight
        this.tracks = null
        this.danmukuList = []
        this.timeline = []
        this.index = 0
        window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (func) {
            return window.setTimeout(func, 1000 / 60)
        }
        window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame || function (func) {
            window.clearTimeout(func)
        }

        this.load()
    }

    // 加载弹幕
    load() {
        get(`/danmaku`, {
            media_id: this.player.options.epInfo.media_id, 
            ep_id: this.player.options.epInfo.ep_id
        }).then(res => {
            this.init(res.result.list, res.result.page.total)
        })
    }

    init(list, count) {
        this.player.container.querySelector('.player-video-info-danmaku .player-video-info-people-number').innerText = count || 0
        this.danmukuList = [].concat.apply([], list).sort((a, b) => a.duration - b.duration )

        this.resetTracks()
    }

    resetTracks() {
        const count = Math.floor(this.config.height / 30)
        this.tracks = new Array(count)
        for (let i = 0; i < count; i++) {
            this.tracks[i] = []
        }
    }

    send(data) {
        return new Promise((resolve, reject) => {
            post(`/danmaku/post`, data).then(res => {
                resolve(res)
            }).catch(reject)
        })
    }

    // 弹幕开始
    play() {
        this.animate && window.cancelAnimationFrame(this.animate)
        this.animate = window.requestAnimationFrame(() => {
            this.nextFrame()
        })
    }

    // 弹幕暂停
    pause() {

        this.animate && window.cancelAnimationFrame(this.animate)
        // for (let i = 0; i < this.timeline.length; i++) {
        //     this.timeline[i].pause()
        // }
    }

    nextFrame() {
        let item = this.danmukuList[this.index]
        const danmaku = []
        while(item && this.player.time() > parseFloat(item.duration)) {
            danmaku.push(new Draw(item, this))
            item = this.danmukuList[++this.index]
        }
        this.draw(danmaku)
        this.animate = window.requestAnimationFrame(() => {
            this.nextFrame()
        })
    }

    draw(danmaku) {
        
        for (let i = 0; i < danmaku.length; i++) {
            let y = this.checkTrack(danmaku[i])
            danmaku[i].y = y
            danmaku[i].render()
        }
        console.log(danmaku)
        // for (let i = 0; i < this.timeline.length; i++) {
        //     // let lastItem = this.timeline[i - 1]
        //     // for (let j = 0; j < this.maxRow; j++) {
        //     //     // 如果弹幕会追上 跳过
        //     //     if (lastItem) {
        //     //         continue
        //     //     }
        //     // }
        //     let lastItem = this.timeline[i - 1]
        //     for (let j = 0; j < this.maxRow; j++) {
        //         if (this.player.time() < this.lastItem.middle) {
        //             continue
        //         }
        //     }
            
        //     this.timeline[i].render()
        // }
    }

    checkTrack(element) {
        for (var i = 0; i < this.tracks.length; i++) {
            const item = this.tracks[i]
            if (item && item.length) {
                for (let j = 0; j < item.length; j++) {
                    const danRight = item[j].getRight() - (item[j].config.width + item[j].dWidth - 10)
                    if (danRight <= item[j].config.width * item[j].speed || danRight <= 0) {
                        break
                    }
                    if (j === item.length - 1) {
                        this.tracks[i].push(element)
                        return i
                    }
                }
            } else {
                this.tracks[i] = element
                return i
            }
        }
        return -1
    }
}

export default Manager