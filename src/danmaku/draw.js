class Draw {
    constructor(textData, context) {
        this.textData = textData
        this.config = context.config
        this.width = 0
        this.height = 0
        this.element = null
        this.start = 0
        this.end = 0
        this.speed = 0
        this.rest = 0
        this.x = 0
        this.y = 0
        this.bottom = 0
        this.color = 16777215
        this.precise = 0
        this.startTime = Date.now()
        this.pauseTime = 0
        this.parent = context.container.querySelector('.player-video-danmaku')
        this.browserPrefix = ['', '-webkit-', '-moz-', '-ms-']
        this.init()
    }

    init() {
        this.element = this.textRender(this.textData, this.config)
        let element = this.element.getBoundingClientRect()
        this.width = element.width
        this.height = element.height
        this.distance = this.config.width + 1
        // this.vDistance = this.config.height
        this.dWidth = element.width
        this.dHeight = element.height
        this.X = 'X'
        this.Y = 'Y'
        this.wdistance = this.distance
        this.start = this.textData.duration
        if (1 == this.textData.mode) {
            this.getSpeed()
            this.distance -= this.precise * this.speed
            this.rest = (this.distance + this.dWidth) / this.speed
            this.end = this.start + this.rest * this.config.videoSpeed
            this.middle = this.start + this.distance / this.speed * this.config.videoSpeed
        } else {
            this.end = this.start + (this.textData.duration || this.config.duration) * this.config.videoSpeed
        }

        this.element.addEventListener('transitionend', () => {
            this.free()
        })
    }

    getSpeed() {
        this.speed = (512 * 1 + this.dWidth) / (this.config.duration) * (this.config.videoSpeed || 1)
    }

    setY(value) {
        this.y = value
        this.bottom = this.y + this.dHeight
    }

    textRender(textData, config) {
        let element = document.createElement('div'),
            style = ''

        element.innerText = textData.content.replace(/\r/g, '\r\n')
        element.className = 'danmaku-item'
        style += `left: ${config.width}px;`
        element.style.cssText = style

        this.parent.appendChild(element)
        return element
    }

    getX() {
        return this.pauseTime = this.pauseTime || Date.now(),
        this.distance - (Date.now() - this.pauseTime + 1000 * ((this.distance + this.dWidth) / this.speed - this.rest)) / 1000 * this.speed
    }

    getRight() {
        console.log(this.getX())
        return this.getX() + this.dWidth
    }

    render() {
        this.renderStyle(false, this.distance + this.dWidth, this.rest)

        console.log(`${this.textData.dm_id}:${this.getRight()}`)
    }

    renderStyle(scroll, width, rest) {
        for (let i = 0; i < this.browserPrefix.length; i ++) {
            this.element.style.cssText += `${this.browserPrefix[i]}transform: translate${this.X}(${(scroll ? 1 : -1) * width}px) translate${this.Y}(0px) translateZ(0px); ${this.browserPrefix[i]}transition: ${this.browserPrefix[i]}transform ${rest}s linear;`
        }
    }

    free() {
        this.element.removeEventListener('transitionend', () => {})
        this.config = null
        this.textData = null
        this.parent.removeChild(this.element)
        this.element.remove()
        this.element = null
    }
}

export default Draw