import { pip, pipOut } from '../asstes/animation/pip.js'

class Pip {
    constructor(context) {
        this.container = context.container
        this.video = context.video
        this.init()
    }

    init() {
        this.pipBtn = this.container.querySelector('.player-video-btn-pip')
        this.initAnimation()

        this.pipBtn.addEventListener('click', () => {
            if (document.pictureInPictureElement) {
                document.exitPictureInPicture().then(() => {
                    this.pipBtn.classList.add('closed')
                })
            } else {
                this.video.requestPictureInPicture().then(() => {
                    this.pipBtn.classList.remove('closed')
                })
            }
        })
    }

    initAnimation() {
        this.pipAnimation = lottie.loadAnimation({
            container: this.container.querySelector('.bp-svgicon-pip-on'),
            renderer: 'svg',
            loop: false,
            autoplay: false,
            animationData: pip
        })

        this.pipOutAnimation = lottie.loadAnimation({
            container: this.container.querySelector('.bp-svgicon-pip-off'),
            renderer: 'svg',
            loop: false,
            autoplay: false,
            animationData: pipOut
        })

        this.pipBtn.addEventListener('mouseenter', () => {
            this.pipBtn.classList.contains('closed') ? this.pipAnimation.play() : this.pipOutAnimation.play()
        })
        this.pipAnimation.addEventListener('complete', () => {
            this.pipAnimation.stop()
        })
        this.pipOutAnimation.addEventListener('complete', () => {
            this.pipOutAnimation.stop()
        })
    }

    destroy() {
        this.pipAnimation.destroy()
        this.pipOutAnimation.destroy()
        this.pipBtn.removeEventListener('mouseenter', () => {})
        this.pipBtn.removeEventListener('click', () => {})
        // this.pipAnimation.removeEventListener('complete', () => {})
        // this.pipOutAnimation.removeEventListener('complete', () => {})
    }
}

export default Pip