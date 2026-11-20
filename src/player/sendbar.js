import { danmakuSwitch, danmakuType } from './icons.js'
import Storage from '../utils/storage.js'
import { post } from '../utils/axios.js'

class Sendbar {
    constructor(context) {
        this.player = context
        this.sendTimer = null
        this.init()
    }

    init() {
        this.bottom = this.player.container.querySelector('.player-video-bottom')
        this.center = this.player.container.querySelector('.player-video-control-bottom-center')
        // this.bottomArea()
        if (this.player.controller.fullscreen.isFullScreen('fullscreen')) {
            this.center.innerHTML = this.render()
        } else {
            this.bottom.innerHTML = this.render()
        }
        this.danmakuSwitch = this.player.container.querySelector('.player-video-danmaku-switch')
        this.sendBtn = this.player.container.querySelector('.player-video-btn-send')
        this.input = this.player.container.querySelector('.player-video-danmaku-input')
        this.people = this.player.container.querySelector('.player-video-info-people-number')
        this.sendbar = this.player.container.querySelector('.player-video-sendbar')
        
        // this.online()
        this.danmakuSwitch.addEventListener('click', () => {
            // 如果开启弹幕
            if (this.player.config.danmaku) {
                this.player.danmaku.pause()
                this.player.danmaku.clear()
                this.player.config.danmaku = false
                this.player.container.querySelector('.choose-danmaku').innerText = '关闭弹幕'
            } else {
                // 如果是关闭弹幕
                this.player.danmaku.play()
                this.player.config.danmaku = true
                this.player.container.querySelector('.choose-danmaku').innerText = '开启弹幕'
            }
            Storage.set('player_config', this.player.config)
        })
        

        this.sendBtn.addEventListener('click', () => {
            if (this.sendBtn.classList.contains('disabled')) return false
            let value = this.input.value.replace(/^\s+/, "").replace(/\s+$/, "")
            if ('' == value) return false
            let current = this.player.video.currentTime,
                duration = this.player.video.duration

            // 当前时长小于10秒 抛弃弹幕
            if (duration - current <= 10) return false
            let params = {
                media_id: this.player.options.epInfo.media_id,
                ep_id: this.player.options.epInfo.ep_id,
                mode: 1,
                text: value,
                stime: parseInt(current * 1000),
                color: 0xffffff,
                border: true
            }
            this.sendBtn.classList.add('disabled')
            this.player.danmaku.send(params).then(res => {
                this.sendBtn.classList.remove('disabled')
                if (1 === res.code) return false
                this.input.value = ''
            }).catch(err => {
                this.sendBtn.classList.remove('disabled')
            })
        })

        this.showOnline()
    }

    showOnline() {
        post(`/room/${this.player.epInfo.ep_id}`).then(res => {
            this.people.innerText = res.result || 1
        })
    }

    render() {
        return `
            <div class="player-video-sendbar">
                <div class="player-video-info">
                    <div class="player-video-info-people">
                        <span class="player-video-info-people-number">1</span>
                        <span class="player-video-info-people-text">人正在看</span>
                    </div>
                    <div class="player-video-info-danmaku">
                        <span>，</span>
                        <span class="player-video-info-people-number">0</span>
                        <span class="player-video-info-people-text">条弹幕</span>
                    </div>
                </div>
                <div class="player-video-danmaku-root">
                    <div class="player-video-danmaku-switch bui bui-switch">
                        <input class="bui-switch-input" type="checkbox" ${this.player.config.danmaku ? 'checked' : ''}></input>
                        <span class="bui-body">
                            <span class="bui-dot">
                                <span>${danmakuSwitch}</span>
                            </span>
                        </span>
                        <span class="choose-danmaku">${this.player.config.danmaku ? '关闭弹幕' : '开启弹幕'}</span>
                    </div>
                    <div class="player-video-danmaku-setting"></div>
                    <div class="player-video-danmaku-inputbar">
                        <div class="player-video-inputbar-wrap">
                            ${this.renderInput()}
                        </div>
                        <div class="player-video-btn-send">发送</div>
                    </div>
                </div>
            </div>
        `
    }

    renderInput() {
        if (this.player.options.userInfo.uid) {
            return `
                <div class="player-video-btn-danmaku">
                    <span class="player-iconfont player-iconfont-danmakutype">
                        <span class="bp-svgicon">${danmakuType}</span>
                    </span>
                </div>
                <input class="player-video-danmaku-input" placeholder="发个弹幕互动吧" maxlength="20" required>`
        } else {
            return `<div class="player-video-danmaku-wrap">登录后发送弹幕</div>`
        }
    }

    centerArae() {
        // this.center.innerHTML = this.sendbar
        this.center.appendChild(this.sendbar)
        this.bottom.innerHTML = ''
    }

    bottomArea() {
        this.bottom.appendChild(this.sendbar)
        this.center.innerHTML = ''
    }

    destroy() {
        this.danmakuSwitch.removeEventListener('click', () => {})
        this.sendBtn.removeEventListener('click', () => {})
    }
}

export default Sendbar