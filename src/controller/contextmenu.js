import ClipboardJS from 'clipboard'
class ContextMenu {
    constructor(context) {
        this.player = context
        this.menuList = [{
            text: '复制视频地址',
            custom: true
        }, {
            text: '视频统计信息',
            click: (player) => {
                player.info.toggle()
            }
        },{
            text: 'MoePlayer v0.5',
            link: 'https://www.kawayi.cc'
        }]
        this.href = window.location.href
        this.init()
    }

    init() {
        this.menu = this.player.container.querySelector('.player-contextmenu-container')
        this.menu.innerHTML = this.drawList()

        this.player.video.addEventListener('contextmenu', (event) => {
            event.preventDefault()
            const clientRect = this.player.container.getBoundingClientRect()
            this.show(event.clientX - clientRect.left, event.clientY - clientRect.top)
            return false
        })

        document.addEventListener('click', (event) => {
            if (this.player.video.contains(event.target) && this.menu.classList.contains('active')) {
                event.stopPropagation()
            }
            this.hide()
        }, true)

        this.menu.querySelectorAll('.menu-item').forEach((item, index) => {
            if (this.menuList[index].click) {
                item.addEventListener('click', (event) => {
                    event.preventDefault()
                    this.menuList[index].click(this.player)
                    return false
                })
            }
        })

        this.clipboard = new ClipboardJS('.copy')
    }

    drawList() {
        let html = ``
        for (let i = 0; i < this.menuList.length; i++) {
            if (this.menuList[i].custom) {
                html += `<a class="context-line menu-item copy" data-clipboard-text="${this.href}" href="javascript:void(0);">复制视频地址</a>`
            } else {
                html += `<a class="context-line menu-item" href="${this.menuList[i].link || 'javascript:void(0);'}" ${this.menuList[i].link ? 'target="_blank"' : ''}>${this.menuList[i].text}</a>`
            }
        }
        return html
    }

    show(x, y) {
        this.menu.classList.add('active')
        const clientRect = this.player.container.getBoundingClientRect()
        if (x + this.menu.offsetWidth >= clientRect.width) {
            this.menu.style.right = `${clientRect.width - x}px`
            this.menu.style.left = 'initial'
        } else {
            this.menu.style.right = 'initial'
            this.menu.style.left = `${x}px`
        }

        if (y + this.menu.offsetHeight >= clientRect.height) {
            this.menu.style.top = 'initial'
            this.menu.style.bottom = `${clientRect.height - y}px`
        } else {
            this.menu.style.top = `${y}px`
            this.menu.style.bottom = 'initial'
        }
    }

    hide() {
        this.menu.classList.remove('active')
    }
}

export default ContextMenu