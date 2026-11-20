class Episode {
    constructor(context) {
        this.player = context
        this.container = context.container
        this.epList = context.epList
        this.epInfo = context.epInfo
        this.epIndex = 0
        this.nextTimer = null
        this.init()
    }

    init() {
        this.epBtn = this.container.querySelector('.player-video-btn-episode')
        this.epListWrap = this.container.querySelector('.player-video-btn-episode-list')

        this.epListWrap.innerHTML = this.drawList()

        this.epBtn.addEventListener('mouseenter', () => {
            this.clearPanelTimer(true)
            this.selectShowTimer = window.setTimeout(() => {
                this.epBtn.classList.add('player-episode-show')
            }, 300, false)
        })

        this.epBtn.addEventListener('mouseleave', () => {
            this.selectHideTimer = window.setTimeout(() => {
                this.clearPanelTimer()
            }, 200, false)
        })
        this.eps = this.container.querySelectorAll('.player-video-episode-item')
        for (let i = 0; i < this.epList.length; i++) {
            this.eps[i].addEventListener('click', () => {
                if (this.epList[i].ep_id == this.epInfo.ep_id) {
                    return
                }
                window.selectEp && window.selectEp(this.epList[i])
            })
        }

        this.nextBtn = this.container.querySelector('.player-video-btn-next')
        if (this.epList[this.epIndex + 1]) {
            this.nextBtn.style.display = 'inline-block'
            this.nextBtn.addEventListener('click', () => {
                this.next(0)
            })
        }

        this.epListWrap.scrollTop = 30 * this.epIndex
    }

    next(time) {
        let nextEp = this.epList[this.epIndex + 1]
        if (nextEp) {
            time > 0 && this.player.toast.addTopHinter(`即将播放 ${nextEp.format_title} ${nextEp.title}`)
            clearTimeout(this.nextTimer)
            this.nextTimer = setTimeout(() => {
                window.selectEp && window.selectEp(nextEp)
            }, time || 0)
        }
    }

    drawList() {
        let html = ''
        for (let i = 0; i < this.epList.length; i++) {
            let active = ''
            if (this.epList[i].ep_id == this.epInfo.ep_id) {
                this.epIndex = this.epList[i].i
                active = 'player-active'
            }
            html += `<li class="player-video-episode-item ${active}">${this.epList[i].format_title} ${this.epList[i].title}</li>`
        }
        return html
    }

    clearPanelTimer(bool) {
        this.selectShowTimer && clearTimeout(this.selectShowTimer),
        this.selectHideTimer && (clearTimeout(this.selectHideTimer), this.selectHideTimer = null),
        bool || this.epBtn.classList.remove('player-episode-show')
    }

    destroy() {
        this.epBtn.removeEventListener('mouseenter', () => {})
        this.epBtn.removeEventListener('mouseleave', () => {})
        for (let i = 0; i < this.epList.length; i++) {
            this.eps[i].removeEventListener('click', () => {})
        }
        this.nextBtn.removeEventListener('click', () => {})
        clearTimeout(this.nextTimer)
    }
}

export default Episode