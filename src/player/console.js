// class Console {
//     constructor() {
//         this.host = 'www.kawayi.cc'
//         this.init()
//     }
//     openCallback() {
//         console.log('控制台打开了')
//         try {
//             this.currentHost()
//         } catch(e) {
//             var btn = document.createElement('button')
//             btn.onclick = function() {
//                 this.currentHost()
//             }
//             btn.click()
//         }
//     }
//     currentHost() {
//         if (this.host !=  window.location.host) {
//             window.location.href = 'https://www.kawayi.cc'
//         } else {
//             window.open('about:blank', '_self')
//         }
//     }
//     observer() {
//         var dom = document.createElement('div'), that = this
//         Object.defineProperty(dom, 'id', {
//             get: function() {
//                 that.openCallback()
//             }
//         })
//         console.log(dom)
//     }
//     observerF() {
//         var obj = Object.create(null), t = Date.now(), that = this
//         Object.defineProperty(obj, 'a', {
//             get:  function() {
//                 if (Date.now() - t > 100) {
//                     that.openCallback()
//                 }
//             }
//         })
//         setInterval(function() {
//             t = Date.now()
//             (function(){})['constructor']('debugger')()
//             console.log(obj.a)
//         }, 200)
//     }
//     init() {
//         var ua = window.navigator.userAgent.toLowerCase()
//         ua.indexOf('firefox') >= 0 ? this.observerF() : this.observer()
//     }
// }

import { addListener, launch } from 'devtools-detector'

class Console {
    constructor() {
        this.host = 'www.kawayi.cc'
        this.init()
    }

    init() {
        const view = document.createElement('div')
        document.body.appendChild(view)
        addListener(isOpen => 
            (isOpen ? this.currentHost() : null)
        )
        launch()
    }

    currentHost() {
        if (this.host !=  window.location.host) {
            window.location.href = 'https://www.kawayi.cc'
        } else {
            window.open('about:blank', '_self')
        }
    }
}

export default Console