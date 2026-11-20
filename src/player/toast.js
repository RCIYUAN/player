import { close } from './icons.js'

class Toast {
    constructor(context) {
        this.player = context
        this.init()
        this.timerInfo = []
        this.timeoutIndex = 0
    }

    init() {
        this.toastWrap = this.player.container.querySelector('.player-video-totast-list')
    }

    addTopHinter(text) {
        let index = this.timeoutIndex
        this.toastWrap.insertAdjacentHTML('beforeend', this.renderToast(text, index))
        clearTimeout(this.timerInfo[index])
        this.timerInfo[index] = window.setTimeout(() => {
            this.toastWrap.querySelector(`.toast-index-${index}`).remove()
            // this.toastWrap.querySelectorAll('.player-video-toast-item')[index].remove()
        }, 3000)

        this.timeoutIndex += 1
    }

    renderToast(text, index) {
        return `
            <div class="player-video-toast-item toast-index-${index}">
                <div class="player-video-toast-item-close"><span class="bp-svgicon">${close}</span></div>
                <div class="player-video-toast-item-text">${text}</div>
            </div>
        `
    }
}

export default Toast