class HotKey {
    constructor(context) {
        this.player = context

        this.init()
        
    }

    init() {
        document.addEventListener('keydown', (e) => {
            const event = e || window.event
            if (this.player.focus) {
                this.activeEvent(event)
            }
        })
    }

    activeEvent(event) {
        switch (event.keyCode) {
            // esc退出网页全屏
            case 27:
                event.preventDefault()
                if (this.player.controller.fullscreen.isFullScreen('webfullscreen')) {
                    this.player.controller.fullscreen.toggle('webfullscreen')
                }
                break
            // 空格键播放暂停
            case 32:
                event.preventDefault()
                this.player.toggle()
                break
            case 13:
                event.preventDefault()
                this.player.controller.fullscreen.toggle('fullscreen')
                break
            case 37:
                event.preventDefault()
                this.player.video.currentTime -= 5
                break
            case 39:
                event.preventDefault()
                this.player.video.currentTime += 5
                break
        }
    }

    destroy() {
        document.removeEventListener('keydown', () => {})
    }
}

export default HotKey