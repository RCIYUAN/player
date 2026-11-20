import format from '../utils/format.js'

class Progress {
    constructor(context) {
        this.player = context

        this.progress = context.container.querySelector('.player-video-progress')
        this.normal = context.container.querySelector('.player-video-progress .bui-bar-normal')
        this.thumb = context.container.querySelector('.player-video-progress .bui-thumb')
        this.barDetail = context.container.querySelector('.player-video-progress .player-video-progress-detail')
        this.barDetailTime = context.container.querySelector('.player-video-progress .player-video-progress-detail-time')
        this.buffer =  context.container.querySelector('.player-video-progress .bui-bar-buffer')

        this.video = context.video
        this.init()
    }

    init() {
        const thumbMove =  (event) => {
            let percentage = (event.clientX - this.progress.getBoundingClientRect().left) / this.progress.clientWidth
            this.setProgress(percentage)
            this.video.currentTime = percentage * this.video.duration
        }
        const thumbUp = (event) => {
            document.removeEventListener('mouseup', thumbUp)
            document.removeEventListener('mousemove', thumbMove)
            this.progress.classList.remove('track-moving')
        } 

        this.progress.addEventListener('mousedown', (event) => {
            event.preventDefault()
            document.addEventListener('mousemove', thumbMove)
            document.addEventListener('mouseup', thumbUp)
            this.progress.classList.add('track-moving')
            thumbMove(event)
        })

        this.progress.addEventListener('mousemove', (event) => {
            let distance = (event.clientX - this.progress.getBoundingClientRect().left)
            distance = Math.max(distance, 1)
            distance = Math.min(distance, this.progress.clientWidth)

            let percentage = distance / this.progress.clientWidth
            percentage = Math.max(percentage, 0)
            percentage = Math.min(percentage, 1)

            this.barDetailTime.innerText = format.formatTime(percentage * this.video.duration)
            this.barDetail.style.left = `${distance}px`
        })
    }

    setProgress(percentage) {
        percentage = Math.max(percentage, 0)
        percentage = Math.min(percentage, 1)

        this.normal.style.webkitTransform = `scaleX(${(Math.max(percentage, .001))})`
        this.normal.style.transform = `scaleX(${(Math.max(percentage, .001))})`

        let offset = (this.progress.clientWidth * percentage) - (this.thumb.clientWidth / 2)
        this.thumb.style.webkitTransform = `translateX(${offset}px)`
        this.thumb.style.transform = `translateX(${offset}px)`
    }

    setBuff(percentage) {
        this.buffer.style.webkitTransform = `scaleX(${(Math.max(percentage, .001))})`
        this.buffer.style.transform = `scaleX(${(Math.max(percentage, .001))})`
    }

    destroy() {
        this.progress.removeEventListener('mousedown', () => {})
        this.progress.removeEventListener('mousemove', () => {})
    }
}

export default Progress