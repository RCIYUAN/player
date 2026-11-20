import { get, post } from '../utils/axios.js'
import format from '../utils/format.js'

class Danmaku {
    constructor(context) {
        this.player = context
        this.dm = null
        this.init()
    }
    init() {

        this.danmakuWrap = document.querySelector('.danmaku-block')
        if (this.danmakuWrap) {
            this.danmakuWrap.innerHTML = this.drawDanmu()
            this.danmakuHeader = this.danmakuWrap.querySelector('.danmaku-header')
            this.danmakuExpand = this.danmakuWrap.querySelector('.danmaku-expand')
            this.danmakuBody = this.danmakuWrap.querySelector('.danmaku-body')
            this.danmakuList = this.danmakuWrap.querySelector('.danmaku-list')

            this.danmakuHeader.addEventListener('click', () => {
                if (this.danmakuBody.classList.contains('expand')) {
                    this.danmakuBody.classList.remove('expand')
                    this.danmakuExpand.innerText = '展开'
                } else {
                    this.danmakuBody.classList.add('expand')
                    this.danmakuExpand.innerText = '收起'
                }
            })
        }


        this.dm = new CommentManager(
            document.querySelector('.player-video-danmaku')
        )
        this.dm.init()
        this.dm.options.global.scale = 2
        this.dm.options.global.opacity = 0.8
        this.load()

        window.addEventListener('resize', () => {
            this.dm.clear()
            this.dm.setBounds()
        })
    }

    // 加载弹幕
    load() {
        let list = []
        get(`/danmaku`, {
            media_id: this.player.options.epInfo.media_id, 
            ep_id: this.player.options.epInfo.ep_id
        }).then(res => {
            for (let i = 0; i < res.result.list.length; i++) {
                list.push({
                    'mode': res.result.list[i].mode,
                    'stime': res.result.list[i].stime,
                    'text': res.result.list[i].text,
                    'size': 25,
                    'color': 0xffffff,
                })
            }
            this.dm.load(list)
            this.danmakuWrap && (this.danmakuList.innerHTML = 0 < res.result.list.length ? this.drawList(res.result.list) : this.drawEmpty('弹幕空空如也'))
            this.player.container.querySelector('.player-video-info-danmaku .player-video-info-people-number').innerText = res.result.page.total || 0
        })
    }

    drawDanmu() {
        return `
            <div class="danmaku-wrap">
                <div class="danmaku-header">
                    <span class="danmaku-title">弹幕列表</span>
                    <span class="danmaku-expand">展开</span>
                </div>
                <div class="danmaku-body">
                    <div class="danmaku-title">
                        <div class="danmaku-stime">时间</div>
                        <div class="danmaku-text">弹幕内容</div>
                        <div class="danmaku-ctime">发送时间</div>
                    </div>
                    <ul class="danmaku-list"></ul>
                </div>
            </div>
        `
    }

    drawList(list) {
        let html = ''
        for (let i = 0; i < list.length; i++) {
            html += `<li class="danmaku-row">
                    <span class="danmaku-item-stime">${format.formatTime(list[i].stime / 1000)}</span>
                    <span class="danmaku-item-text">${list[i].text}</span>
                    <span class="danmaku-item-ctime">${format.formatDate(list[i].ctime * 1000)}</span>
                </li>`
        }
        return html
    }

    drawEmpty(text) {
        return `<div class="danmaku-load-state">${text}</div>`
    }

    play() {
        this.dm.start()
    }

    pause() {
        this.dm.stop()
    }

    clear() {
        this.dm.clear()
    }

    update(time) {
        this.dm.time(Math.floor(time * 1000))
    }

    send(data) {
        return new Promise((resolve, reject) => {
            post(`/danmaku/post`, data).then(res => {
                0 == res.code && this.dm.send(data)
                resolve(res)
            }).catch(reject)
        })
    }

    destroy() {
        window.removeEventListener('resize', () => {})

        this.danmakuWrap  && this.danmakuHeader.removeEventListener('click', () => {})
    }
}

export default Danmaku