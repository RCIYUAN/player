import { volumen, volumenMin } from '../asstes/animation/volume.js'
import storage from '../utils/storage.js'

class Volume {
    constructor(context) {
        this.container = context.container
        this.video = context.video
        this.config = context.config
        this.init()
    }

    init() {
        this.volumeBtn = this.container.querySelector('.player-video-btn-volume')
        this.volumeBar = this.container.querySelector('.player-video-btn-volume .player-video-volumebar-wrap .player-video-volumebar')
        this.volumeThumb = this.container.querySelector('.player-video-btn-volume .player-video-volumebar .bui-thumb')
        this.volumeNormal = this.container.querySelector('.player-video-btn-volume .player-video-volumebar .bui-bar-normal')
        this.volumeNum = this.container.querySelector('.player-video-btn-volume .player-video-volumebar-wrap .player-video-volume-num')

        this.initAnimation()

        this.volumeBtn.addEventListener('mouseenter', () => {
            this.clearPanelTimer(true)
            this.selectShowTimer = window.setTimeout(() => {
                this.volumeBtn.classList.add('player-volume-show')
            }, 300, false)
            this.play()
        })

        this.volumeBtn.addEventListener('mouseleave', () => {
            this.selectHideTimer = window.setTimeout(() => {
                this.clearPanelTimer()
            }, 200, false)
        })

        const volumeMove = (event) => {
            event.stopPropagation()
            let percentage = (this.volumeBar.getBoundingClientRect().bottom - event.clientY) / this.volumeBar.clientHeight
            this.setVolume(percentage)
        }

        const volumeUp = (event) => {
            event.stopPropagation()
            document.removeEventListener('mouseup', volumeUp)
            document.removeEventListener('mousemove', volumeMove)
        }

        this.volumeBar.addEventListener('mousedown', (event) => {
            event.stopPropagation()
            document.addEventListener('mousemove', volumeMove)
            document.addEventListener('mouseup', volumeUp)
            volumeMove(event)
        })

        let volumeBtns = this.container.querySelectorAll('.player-video-btn-volume .player-iconfont')
        for (let i = 0; i < volumeBtns.length; i++) {
            volumeBtns[i].addEventListener('click', (event) => {
                event.stopPropagation()
                event.preventDefault()
                if (0 === this.video.volume) {
                    this.setVolume(this.config.volume || 0.5)
                } else {
                    this.setVolume(0)
                }
            })
        }
        this.setVolume(this.config.volume)
    }

    setVolume(percentage) {
        percentage = Math.max(percentage, 0)
        percentage = Math.min(percentage, 1)
        if (0 == percentage) {
            this.volumeBtn.classList.add('video-state-volume-min')
        } else if (percentage >= .5) {
            this.volumeBtn.classList.add('video-state-volume-max')
        } else {
            this.volumeBtn.classList.remove('video-state-volume-min')
            this.volumeBtn.classList.remove('video-state-volume-max')
        }
        this.volumeNormal.style.webkitTransform = `scaleY(${(Math.max(percentage, .001))})`
        this.volumeNormal.style.transform = `scaleY(${(Math.max(percentage, .001))})`
        let offset = ((this.volumeBar.clientHeight || 60) * percentage) - ((this.volumeThumb.clientHeight || 12) / 2)
        this.volumeThumb.style.webkitTransform = `translateY(${-1 * offset}px)`
        this.volumeThumb.style.transform = `translateY(${-1 * offset}px)`
        this.volumeNum.innerText = Math.round(percentage * 100)
        this.video.volume = percentage
        if (0 !== percentage) {
            this.config.volume = percentage
            storage.set('player_config', this.config)
        }
    }

    clearPanelTimer(bool) {
        this.selectShowTimer && clearTimeout(this.selectShowTimer),
        this.selectHideTimer && (clearTimeout(this.selectHideTimer), this.selectHideTimer = null),
        bool || this.volumeBtn.classList.remove('player-volume-show')
    }

    initAnimation() {
        this.volumeMaxAnimation = lottie.loadAnimation({
            container: this.container.querySelector('.bp-svgicon-volume-max'),
            renderer: 'svg',
            loop: false,
            autoplay: false,
            animationData: volumen
        })
        this.volumeAnimation = lottie.loadAnimation({
            container: this.container.querySelector('.bp-svgicon-volume'),
            renderer: 'svg',
            loop: false,
            autoplay: false,
            animationData: volumen
        })
        this.volumeMinAnimation = lottie.loadAnimation({
            container: this.container.querySelector('.bp-svgicon-volume-min'),
            renderer: 'svg',
            loop: false,
            autoplay: false,
            animationData: volumenMin
        })
        this.volumeMaxAnimation.addEventListener('complete', () => {
            this.volumeMaxAnimation && this.volumeMaxAnimation.stop()
        })
        this.volumeAnimation.addEventListener('complete', () => {
            this.volumeAnimation && this.volumeAnimation.stop()
        })
        this.volumeMinAnimation.addEventListener('complete', () => {
            this.volumeMinAnimation && this.volumeMinAnimation.stop()
        })
    }

    play() {
        if (0 === this.video.volume) {
            this.volumeMinAnimation.play()
        } else if (this.video.volume >= .5) {
            this.volumeMaxAnimation.play()
        } else {
            this.volumeAnimation.play()
        }
    }

    volumeAnimationStop() {
        this.volumeAnimation && this.volumeAnimation.stop()
    }

    volumeMinAnimationStop() {
        this.volumeMinAnimation && this.volumeMinAnimation.stop()
    }

    volumeMaxAnimationStop() {
        this.volumeMaxAnimation && this.volumeMaxAnimation.stop()
    }

    destroy() {
        this.volumeBtn.removeEventListener('mouseenter', () => {})
        this.volumeBtn.removeEventListener('mouseleave', () => {})
        this.volumeBar.removeEventListener('mousedown', () => {})
        this.volumeAnimation.destroy()
        this.volumeMinAnimation.destroy()
        this.volumeMaxAnimation.destroy()
    }
}

export default Volume