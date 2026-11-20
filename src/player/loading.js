import loading from '../asstes/animation/loading.js'

class Loading {
    constructor(player) {
        this.container = player.container.querySelector('.player-video-panel')
        this.buffIcon = player.container.querySelector('.player-video-state-buff-icon')
        this.init()
    }

    init() {
        this.stages = [['播放器初始化', false], ['加载用户配置', false], ['加载视频地址', false], ['加载视频内容', false]]
        this.contextBox = this.container.querySelector('.player-video-panel-text')

        this.animation = lottie.loadAnimation({
            container: this.buffIcon,
            renderer: 'svg',
            loop: true,
            autoplay: false,
            animationData: loading
        })
    }

    ready(index) {
        let dom = document.createElement('div')
        dom.className = 'player-video-panel-row'
        dom.setAttribute('stage', index)
        dom.innerHTML = `${this.stages[index][0]}...`
        this.stages[index][1] || (this.stages[index][1] = true,
        this.contextBox.appendChild(dom))
    }

    complete() {
        setTimeout(() => {
            this.hide()
        }, 200)
    }

    hide() {
        this.container.style.display = 'none'
    }

    destroy() {
        this.animation.destroy()
    }
}

export default Loading