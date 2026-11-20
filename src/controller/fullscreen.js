import {webfullscreen, webfullscreenExit, fullscreen} from '../asstes/animation/fullscreen.js'

class Fullscreen {
    constructor(context) {
        this.player = context
        this.container = context.container
        this.video = context.video
        this.mode = 'normal'
        this.init()
    }

    init() {
        this.webFullscreen = this.container.querySelector('.player-video-web-fullscreen')
        this.fullscreen = this.container.querySelector('.player-video-fullscreen')

        this.initAnimation()

        document.addEventListener('fullscreenchange', () => {
            if (this.isFullScreen('fullscreen')) {
                this.onVideoMode('fullscreen')
            } else {
                this.onVideoMode('normal')
            }
        })
    }

    initAnimation() {
        this.webFullScreenOnAnimation = lottie.loadAnimation({
            container: this.container.querySelector('.bp-svgicon-web-full-on'),
            renderer: 'svg',
            loop: false,
            autoplay: false,
            animationData: webfullscreen
        })

        this.webFullScreenOffAnimation = lottie.loadAnimation({
            container: this.container.querySelector('.bp-svgicon-web-full-off'),
            renderer: 'svg',
            loop: false,
            autoplay: false,
            animationData: webfullscreenExit
        })

        this.fullScreenOnAnimation = lottie.loadAnimation({
            container: this.container.querySelector('.bp-svgicon-fullscreen-on'),
            renderer: 'svg',
            loop: false,
            autoplay: false,
            animationData: fullscreen
        })

        this.fullScreenOffAnimation = lottie.loadAnimation({
            container: this.container.querySelector('.bp-svgicon-fullscreen-off'),
            renderer: 'svg',
            loop: false,
            autoplay: false,
            animationData: fullscreen
        })

        this.webFullscreen.addEventListener('mouseenter', () => {
            this.mode == 'webfullscreen' ? this.webFullScreenOffAnimation.play() : this.webFullScreenOnAnimation.play()
        })
        this.fullscreen.addEventListener('mouseenter', () => {
            this.mode == 'fullscreen' ? this.fullScreenOffAnimation.play() : this.fullScreenOnAnimation.play()
        })

        this.webFullScreenOnAnimation.addEventListener('complete', () => {
            this.webFullScreenOnAnimation.stop()
        })
        this.webFullScreenOffAnimation.addEventListener('complete', () => {
            this.webFullScreenOffAnimation.stop()
        })
        this.fullScreenOnAnimation.addEventListener('complete', () => {
            this.fullScreenOnAnimation.stop()
        })
        this.fullScreenOffAnimation.addEventListener('complete', () => {
            this.fullScreenOffAnimation.stop()
        })

        this.webFullscreen.addEventListener('click', () => {
            this.toggle('webfullscreen')
        })
        this.fullscreen.addEventListener('click', () => {
            this.toggle('fullscreen')
        })
    }

    onVideoMode(mode) {
        this.mode = mode
        switch(mode) {
            case 'normal':
                document.body.classList.remove('player-fullscreen-fix')
                this.container.classList.remove('fullscreen')
                this.container.classList.remove('webfullscreen')
                this.webFullscreen.classList.remove('closed')
                this.fullscreen.classList.add('video-state-fullscreen-off')
                this.player.sendbar.bottomArea()
                break
            case 'fullscreen':
                document.body.classList.add('player-fullscreen-fix')
                this.container.classList.add('fullscreen')
                this.webFullscreen.classList.remove('closed')
                this.fullscreen.classList.remove('video-state-fullscreen-off')
                this.player.sendbar.centerArae()
                break
            case 'webfullscreen':
                document.body.classList.add('player-fullscreen-fix')
                this.container.classList.add('webfullscreen')
                this.webFullscreen.classList.add('closed')
                this.player.sendbar.centerArae()
                break
        }
    }

    request(mode) {
        switch(mode) {
            case 'fullscreen':
                if (this.container.requestFullscreen) {
                    this.container.requestFullscreen()
                } else if (this.container.mozRequestFullScreen) {
                    this.container.mozRequestFullScreen()
                } else if (this.container.webkitRequestFullscreen) {
                    this.container.webkitRequestFullscreen()
                } else if (this.template.$video.webkitEnterFullscreen) {
                    this.video.webkitEnterFullscreen()
                } else if (this.template.$video.webkitEnterFullScreen) {
                    this.video.webkitEnterFullScreen()
                } else if (this.container.msRequestFullscreen) {
                    this.container.msRequestFullscreen()
                }
                this.onVideoMode('fullscreen')
                break
            case 'webfullscreen':
                this.onVideoMode('webfullscreen')
                break
        }
    }

    exit(mode) {
        if ('fullscreen' == mode) {
            if (document.cancelFullScreen) {
                document.cancelFullScreen()
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen()
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen()
            } else if (document.webkitCancelFullscreen) {
                document.webkitCancelFullscreen()
            } else if (document.msCancelFullScreen) {
                document.msCancelFullScreen()
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
        this.onVideoMode('normal')
    }

    isFullScreen(mode) {
        return document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement || this.container.classList.contains('webfullscreen')
    }

    toggle(mode) {
        if (this.isFullScreen(mode)) {
            this.exit(mode)
        } else {
            this.request(mode)
        }
    }

    destroy() {
        this.webFullscreen.removeEventListener('mouseenter', () => {})
        this.fullscreen.removeEventListener('mouseenter', () => {})
        this.webFullscreen.removeEventListener('click', () => {})
        this.fullscreen.removeEventListener('click', () => {})
        this.webFullScreenOnAnimation.destroy()
        this.webFullScreenOffAnimation.destroy()
        this.fullScreenOnAnimation.destroy()
        this.fullScreenOffAnimation.destroy()
        document.removeEventListener('fullscreenchange', () => {})
    }
}

export default Fullscreen