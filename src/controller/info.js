class Info {
    constructor(context) {
        this.player = context

        this.init()
    }

    init() {
        this.infoPanel = this.player.container.querySelector('.player-video-info-container')

        this.infoPanel.querySelector('.player-video-info-close').addEventListener('click', () => {
            this.hide()
        })
    }

    show() {
        this.update()
        this.infoPanel.classList.add('active')
    }

    hide() {
        this.infoPanel.classList.remove('active')
    }

    toggle() {
        this.infoPanel.classList.contains('active') ? this.hide() : this.show()
    }

    update() {
        this.infoPanel.querySelector('.info-desktop-resolution .info-value').innerHTML = `${window.screen.width} x ${window.screen.height} (${window.screen.colorDepth}bit)`
        this.infoPanel.querySelector('.info-resolution .info-value').innerHTML = `${this.player.video.videoWidth} x ${this.player.video.videoHeight}`
        this.infoPanel.querySelector('.info-duration .info-value').innerHTML = this.player.video.duration
        this.infoPanel.querySelector('.info-volume .info-value').innerHTML = `${parseInt(this.player.video.volume * 1000) / 10}%`
    }
}

export default Info