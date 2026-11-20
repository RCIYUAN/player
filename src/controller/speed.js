import Storage from '../utils/storage.js'

class Speed {
    constructor(context) {
        this.rates = [
            {name: '3.0x', value: 3}, 
            {name: '2.0x', value: 2}, 
            {name: '1.5x', value: 1.5}, 
            {name: '1.25x', value: 1.25}, 
            {name: '1.0x', value: 1}, 
            {name: '0.75x', value: .75}, 
            {name: '0.5x', value: .5}
        ]
        this.container = context.options.container
        this.player = context
        this.config = context.config
        this.init()
    }

    render() {
        return `
        <ul class="-player-video-btn-speed-menu">
            ${this.drawList()}
        </ul>
        `
    }

    drawList() {
        let html = ''
        for (let i = 0; i < this.rates.length; i++) {
            html += `<li class="player-video-btn-speed-menu-list ${this.config.speed == this.rates[i].value ? 'player-active' : ''}" data-value="${this.rates[i].value}">${this.rates[i].name}</li>`
        }
        return html
    }

    init() {
        this.speedBtn = this.container.querySelector('.player-video-btn-speed')
        this.speedName = this.container.querySelector('.player-video-btn-speed-name')
        this.container.querySelector('.player-video-btn-speed-menu-wrap').innerHTML = this.render()

        this.speedBtn.addEventListener('mouseenter', () => {
            this.clearPanelTimer(true)
            this.selectShowTimer = window.setTimeout(() => {
                this.speedBtn.classList.add('player-speed-show')
            }, 300, false)
        })

        this.speedBtn.addEventListener('mouseleave', () => {
            this.selectHideTimer = window.setTimeout(() => {
                this.clearPanelTimer()
            }, 200, false)
        })

        this.speedList = this.container.querySelectorAll('.player-video-btn-speed-menu-list')
        for (let i = 0; i < this.rates.length; i++) {
            this.speedList[i].addEventListener('click', (event) => {
                event.stopPropagation()
                let speed = Number(event.target.dataset && event.target.dataset.value)
                speed && this.setSpeed(speed)
            })
        }

        this.setSpeed(Number(this.config.speed))
    }

    clearPanelTimer(bool) {
        this.selectShowTimer && clearTimeout(this.selectShowTimer),
        this.selectHideTimer && (clearTimeout(this.selectHideTimer), this.selectHideTimer = null),
        bool || this.speedBtn.classList.remove('player-speed-show')
    }

    getIndex(speed) {
        void 0 === speed && (speed = this.config.speed)
        return this.rates.findIndex(item => item.value == speed)
    }

    setSpeed(speed) {
        let index = this.getIndex(speed),
            active = this.getIndex(this.config.speed)
        
        this.speedList[active].classList.remove('player-active')
        this.speedList[index].classList.add('player-active')
        this.speedName.innerText = 1 === speed ? `倍速` : `${speed}x`
        this.config.speed = speed
        this.player.video.playbackRate = speed
        Storage.set('player_config', this.config)
    }

    destroy() {
        this.speedBtn.removeEventListener('mouseenter', () => {})
        this.speedBtn.removeEventListener('mouseleave', () => {})
        for (let i = 0; i < this.rates.length; i++) {
            this.speedList[i].removeEventListener('click', () => {})
        }
        this.clearPanelTimer()
    }
}

export default Speed