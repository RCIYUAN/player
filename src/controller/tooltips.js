class Tooltips {
    constructor(context) {
        this.container = context.container

        this.init()
    }

    init() {
        this.tooltips = this.container.querySelectorAll('.player-tooltips-trigger')
        for (let i = 0; i < this.tooltips.length; i++) {
            this.tooltips[i].addEventListener('mouseenter', (event) => {
                let text = event.target.getAttribute('data-text')
                this.create(this.tooltips[i], text)
            })

            this.tooltips[i].addEventListener('mouseleave', () => {
                this.tooltips[i].querySelector('.player-tooltips').remove()
            })
        }
    }

    template(tip) {
        return `
            <div class="player-tooltips animation">
                <div class="tooltip">${tip}</div>
            </div>
        `
    }

    getElemPos(element) {
        let rect = element.getBoundingClientRect()
        return {
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height
        }
    }

    create(element, tip) {
        element.insertAdjacentHTML('beforeend', this.template(tip))
        let tooltips = element.querySelector('.player-tooltips'),
            root = this.getElemPos(element),
            tipPos = this.getElemPos(tooltips),
            top = root.top - 15 - tipPos.height,
            left = root.left + root.width / 2 - tipPos.width / 2;

        tooltips.style.top = `${top}px`
        tooltips.style.left = `${left}px`
        tooltips.classList.add('active')
    }

    destroy() {
        for (let i = 0; i < this.tooltips.length; i++) {
            this.tooltips[i].removeEventListener('mouseenter', () => {})
            this.tooltips[i].removeEventListener('mouseleave', () => {})
        }
    }
}

export default Tooltips