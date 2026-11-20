import './asstes/css/style.scss'

import Template from './player/template.js'
import Progress from './controller/progress.js'
import Loading from './player/loading.js'
import Episode from './controller/episode.js'
import Speed from './controller/speed.js'
import Volume from './controller/volume.js'
import Pip from './controller/pip.js'
import FullScreen from './controller/fullscreen.js'
import Tooltips from './controller/tooltips.js'
import HotKey from './controller/hotkey.js'
import Sendbar from './player/sendbar.js'
import Info from './controller/info.js'
import ContextMenu from './controller/contextmenu.js'
import Toast from './player/toast.js'
import Feedback from './player/feedback.js'
// import Danmaku from './danmaku/manager.js'
import Danmaku from './player/danmaku.js'
import Console from './player/console.js'
import storage from './utils/storage.js'
import format from './utils/format.js'
import {play, pause} from './asstes/animation/play.js'

class Main {
    constructor(context) {

        if (process.env.NODE_ENV == "production") {
            // 禁止打开控制台
            new Console()
        }

        this.options = context
        this.container = context.container
        this.epList = context.epList
        this.epInfo = context.epInfo
        this.template = new Template(this)
        this.container.innerHTML = this.template.renderPlayer()
        this.video = document.createElement('video')
        this.template.renderVideo(this.video)
        this.loading = new Loading(this)
        this.loading.ready(0)
        this.config = storage.get('player_config') || {
            speed: 1,
            volume: 0.5,
            danmaku: true,
            autoplay: true
        }
        this.played = false
        // this.isReload = false
        this.errorNum = 0
        this.firstScreen = true
        this.timer = null
        this.curTime = 0
        this.focus = true
        this.loading.ready(1)
        this.controller = {
            speed: new Speed(this),
            progress: new Progress(this),
            volume: new Volume(this),
            fullscreen: new FullScreen(this),
            pip: new Pip(this),
            episode: new Episode(this)
        }
        this.toast = new Toast(this)

        this.tooltips = new Tooltips(this)
        this.info = new Info(this)
        this.contextmenu = new ContextMenu(this)
        this.hotkey = new HotKey(this)
        this.feedback = new Feedback(this)

        this.danmaku = new Danmaku(this)
        
        this.sendbar = new Sendbar(this)
        
        this.playerWrap = this.container.querySelector('.player-video-wrap')
        this.playerBtn = this.container.querySelector('.player-video-wrap .player-video-btn-start')
        this.playerVideo = this.container.querySelector('.player-video-wrap .player-video')
        
        this.init()
    }

    init() {
        this.bindEvent()
        this.initAnimation(play)
        this.config.autoplay && this.play()
        this.video.paused ? this.playerWrap.classList.add('video-control-show') : this.playerWrap.classList.remove('video-control-show')


        const hlsPlayer = () => {
            let hls = new Hls()
            hls.loadSource(this.epInfo.vurl)
            hls.attachMedia(this.video)

            hls.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                    switch(data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            this.toast.addTopHinter('网络错误')
                            hls.startLoad()
                            break
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            hls.recoverMediaError()
                            break
                        default:
                            hls.destroy()
                            break
                    }
                }
            })
        }

        const mp4Player = () => {
            this.video.src = this.epInfo.vurl
        }

        if (/m3u8(#|\?|$)/i.exec(this.epInfo.vurl) && Hls.isSupported()) {
            hlsPlayer()
        } else {
            mp4Player()
        }
    }

    initAnimation(icon) {
        this.btnAnimation = lottie.loadAnimation({
            container: this.container.querySelector('.bp-svgicon-start'),
            autoplay: false,
            loop: false,
            animationData: icon
        })
    }

    setAnimation(state) {
        this.lastState !== state && (this.btnAnimation && (this.btnAnimation.destroy(),
        this.initAnimation('play' == state ? play : pause)),
        this.lastState = state,
        this.btnAnimation.play())
    }

    bindEvent() {
        document.addEventListener('click', () => {
            this.focus = false
        }, true)
        this.playerWrap.addEventListener('click', () => {
            this.focus = true
        }, true)
        this.video.addEventListener('loadstart', () => {
            this.loading.ready(2)
        })
        this.video.addEventListener('loadedmetadata', () => {
            this.loading.ready(3)
        })
        this.video.addEventListener('loadeddata', () => {
            this.loading.complete()
        })
        this.video.addEventListener('playing', () => {
            this.firstScreen = false
            this.setState('play')
        })
        this.video.addEventListener('play', () => {
            this.setState('play')
            this.config.danmaku && this.danmaku && this.danmaku.play()
            window.hearbeat && window.hearbeat(this.video.currentTime)
        })
        this.video.addEventListener('pause', () => {
            this.setState('pause')
            this.danmaku && this.danmaku.pause()
            window.hearbeat && window.hearbeat(this.video.currentTime)
        })
        // 能播放
        this.video.addEventListener('canplay', () => {
            this.container.querySelector('.player-video-time-total').innerText = format.formatTime(this.video.duration)
        })
        // 进度条
        this.video.addEventListener('progress', () => {
            let percentage = this.video.buffered.length ? this.video.buffered.end(this.video.buffered.length - 1) / this.video.duration : 0
            this.controller.progress.setBuff(percentage)
        })
        // 正在播放
        this.video.addEventListener('timeupdate', () => {
            this.container.querySelector('.player-video-time-now').innerText = format.formatTime(this.video.currentTime)
            let percentage = this.video.currentTime / this.video.duration
            this.controller.progress.setProgress(percentage)

            if (!this.played && this.video.currentTime >= (this.video.duration * 0.8)) {
                window.incPlay && window.incPlay()
                this.played = true
            }

            // 更新弹幕时间戳
            this.danmaku && this.danmaku.update(this.video.currentTime)

            // 记录观看时间 每30秒一次
            if (this.video.currentTime > 0 && (this.video.currentTime - this.curTime >= 30)) {
                this.curTime = this.video.currentTime
                window.hearbeat && window.hearbeat(this.curTime)
                this.sendbar.showOnline()
            }
        })
        // 进度条已经移动到了新的位置
        this.video.addEventListener('seeked', () => {
            this.curTime = this.video.currentTime
            this.danmaku.clear()
            if (!this.video.paused) {
                this.danmaku && this.danmaku.play()
            }
        })
        this.video.addEventListener('ratechange', () => {
            // if (this.danmaku) {
            //     this.danmaku.dm.options.global.scale = (2 / this.video.playbackRate)
            //     this.danmaku.dm.rescale()
            // }
        })
        // 播放出错
        this.video.addEventListener('error', () => {
            this.danmaku && this.danmaku.pause()
            // if (!this.isReload) {
            //     this.isReload = true
            //     this.video.load()
            //     this.toast.addTopHinter('尝试一次重新加载')
            // } else {
            //     this.toast.addTopHinter('视频加载失败')
            //     this.feedback.postFeedback()
            // }
            if (0 == this.errorNum) {
                this.video.load()
                this.video.play()
                this.toast.addTopHinter('尝试一次重新加载')
            } else if (1 == this.errorNum && this.epInfo.backup_vurl) {
                // this.video.src = this.epInfo.backup_vurl
                if (/m3u8(#|\?|$)/i.exec(this.epInfo.backup_vurl) && Hls.isSupported()) {
                    let hls = new Hls()
                    hls.loadSource(this.epInfo.backup_vurl)
                    hls.attachMedia(this.video)
                } else {
                    this.video.src = this.epInfo.backup_vurl
                }
                this.video.play()
                this.toast.addTopHinter('正在为您更换备份链接')
            } else {
                this.toast.addTopHinter('视频加载失败')
            }
            // 暂时取消反馈
            // this.feedback.postFeedback()
            this.errorNum++
        })
        // 播放缓冲
        this.video.addEventListener('waiting', () => {
            if (this.video.currentTime > 0) {
                this.setState('buff')
                this.danmaku && this.danmaku.pause()
            }
        })
        // 播放结束
        this.video.addEventListener('ended', () => {
            this.setState('ended')
            this.controller.episode.next(2000)
            this.danmaku && this.danmaku.pause()
        })
        this.playerBtn.addEventListener('click', (event) => {
            event.stopPropagation()
            this.toggle()
        })
        this.playerVideo.addEventListener('click', (event) => {
            event.stopPropagation()
            this.toggle()
        })
        // 鼠标移入
        this.playerWrap.addEventListener('mousemove', (event) => {
            if (!this.config.autoplay && this.firstScreen) {
                return
            }
            this.playerWrap.classList.add('video-control-show')
            this.playerWrap.classList.remove('no-cursor')
            this.playerWrap.classList.remove('progress-shadow-show')

            let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
            let height = this.playerWrap.clientHeight
            let clientY = event.clientY - this.playerWrap.offsetTop + scrollTop

            let time
            if (clientY < height / 3) {
                time = 3000
            } else if (clientY < height / 3 * 2) {
                time = 500
            } else {
                time = 3000
            }
            window.clearTimeout(this.timer)
            this.timer = window.setTimeout(() => {
                this.playerWrap.classList.remove('video-control-show')
                this.playerWrap.classList.add('no-cursor')
            }, time)
        })
        // 鼠标移出
        this.playerWrap.addEventListener('mouseleave', () => {
            if (!this.config.autoplay && this.firstScreen) {
                return
            }
            window.clearTimeout(this.timer)
            this.playerWrap.classList.remove('video-control-show')
            this.playerWrap.classList.add('progress-shadow-show')
        })
    }

    removeEvent() {
        this.video.removeEventListener('loadstart', () => {})
        this.video.removeEventListener('loadedmetadata', () => {})
        this.video.removeEventListener('loadeddata', () => {})
        this.video.removeEventListener('play', () => {})
        this.video.removeEventListener('pause', () => {})
        this.video.removeEventListener('playing', () => {})
        this.video.removeEventListener('canplay', () => {})
        this.video.removeEventListener('progress', () => {})
        this.video.removeEventListener('timeupdate', () => {})
        this.video.removeEventListener('waiting', () => {})
        this.video.removeEventListener('ended', () => {})
        this.video.removeEventListener('error', () => {})
        this.video.removeEventListener('seeked', () => {})
        this.video.removeEventListener('ratechange', () => {})

        this.playerBtn.removeEventListener('click', () => {})
        this.playerVideo.removeEventListener('click', () => {})

        this.playerWrap.removeEventListener('click', () => {})
        this.playerWrap.removeEventListener('mouseleave', () => {})
        this.playerWrap.removeEventListener('mouseleave', () => {})

        document.removeEventListener('click', () => {})
        this.container.removeEventListener('click', () => {})
    }

    play() {
        this.video.play()
        this.setState('play')
    }

    pause() {
        this.video.pause()
        this.setState('pause')
    }

    toggle() {
        this.video.paused ? this.play() : this.pause()
    }

    setState(state) {
        this.loading.animation.stop()
        if ('play' == state) {
            this.setAnimation(state)
            this.playerWrap.classList.remove('video-state-pause', 'video-state-buff')
            this.playerBtn.classList.remove('video-state-pause')
        } else if ('pause' == state) {
            this.setAnimation(state)
            this.playerWrap.classList.add('video-state-pause')
            this.playerWrap.classList.remove('video-state-buff')
            this.playerBtn.classList.add('video-state-pause')
        } else if ('ended' == state) {
            this.playerWrap.classList.add('video-state-pause')
            this.playerWrap.classList.remove('video-state-buff')
            this.playerBtn.classList.add('video-state-pause')
        } else if ('buff' == state) {
            this.playerWrap.classList.add('video-state-buff')
            this.loading.animation.play()
        }
    }

    destroy() {
        this.removeEvent()
        this.controller.speed.destroy()
        this.controller.volume.destroy()
        this.controller.progress.destroy()
        this.controller.fullscreen.destroy()
        this.controller.pip.destroy()
        this.controller.episode.destroy()
        // this.speedController.destroy()
        this.loading.destroy()
        
        
        this.btnAnimation.destroy()
        
        this.danmaku.destroy()
        
        this.tooltips.destroy()
        this.hotkey.destroy()
        this.sendbar.destroy()
        this.focus = false
    }
}

export default Main