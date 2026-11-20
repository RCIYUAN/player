import { statePlay, progress, danmakuSwitch, next } from './icons.js'

class Template {
    constructor(context) {
        this.player = context
    }

    renderPlayer() {
        return `
            <div class="moe-player">
                <div class="player-video-wrap video-state-pause video-control-show" aria-label="卡哇伊播放器">
                    ${this.renderTop()}
                    <div class="player-video-state">
                        <span class="player-iconfont player-video-state-play">
                            <span class="bp-svgicon">${statePlay}</span>
                        </span>
                        <div class="player-video-state-buff-icon"></div>
                        <div class="player-video-state-buff-text">正在缓冲...</div>
                    </div>
                    <div class="player-video-panel">
                        <div class="player-video-panel-blur">
                            <div class="player-video-panel-blur-image" style="background-image: url(${this.player.options.cover});"></div>
                            <div class="player-video-panel-blur-image-detail"></div>
                        </div>
                        <div class="player-video-panel-text"></div>
                    </div>
                    <div class="player-video-danmaku"></div>
                    <div class="player-video"></div>
                    <div class="player-video-control-wrap">
                        <div class="player-video-control-mask"></div>
                        <div class="player-video-control">
                            <div class="player-video-control-top">${this.renderProgress()}</div>
                            <div class="player-video-control-bottom">
                                <div class="player-video-control-bottom-left">
                                    ${this.renderPlayBtn()}
                                    ${this.renderNextBtn()}
                                    ${this.renderTime()}
                                </div>
                                <div class="player-video-control-bottom-center"></div>
                                <div class="player-video-control-bottom-right">
                                    ${this.renderEpisode()}
                                    ${this.renderSpeed()}
                                    ${this.renderVolume()}
                                    ${this.renderPip()}
                                    ${this.renderFullscreen()}
                                </div>
                            </div>
                        </div>
                    </div>
                    ${this.renderInfoPanel()}
                    <div class="player-video-toast-wrap">
                        <div class="player-video-totast-list"></div>
                    </div>
                </div>
                <div class="player-video-bottom"></div>
                <div class="player-contextmenu-container"></div>
            </div>
        `
    }

    renderTop() {
        if (this.player.options.title) {
            return `
            <div class="player-video-top">
                <div class="player-video-top-mask"></div>
                <div class="player-video-top-title">${this.player.options.title}</div>
            </div> 
            `
        }
        return ``
    }

    renderInfoPanel() {
        return `
            <div class="player-video-info-container">
                <a href="javascript:void(0);" class="player-video-info-close">[x]</a>
                <div class="player-video-info-panel">
                    <div class="info-line info-desktop-resolution">
                        <span class="info-title">Desktop Resolution:</span>
                        <span class="info-value"></span>
                    </div>
                    <div class="info-line info-resolution">
                        <span class="info-title">Video Resolution:</span>
                        <span class="info-value"></span>
                    </div>
                    <div class="info-line info-duration">
                        <span class="info-title">Video Duration:</span>
                        <span class="info-value"></span>
                    </div>
                    <div class="info-line info-volume">
                        <span class="info-title">Video Volume:</span>
                        <span class="info-value"></span>
                    </div>
                </div>
            </div>
        `
    }

    renderVideo(video) {
        if (/m3u8(#|\?|$)/i.exec(this.player.epInfo.vurl) && Hls.isSupported()) {
            let hls = new Hls()
            hls.loadSource(this.player.epInfo.vurl)
            hls.attachMedia(video)
        } else {
            video.src = this.player.epInfo.vurl
        }
        video.preload = 'auto'
        this.player.options.container.querySelector('.player-video').appendChild(video)
    }

    renderProgress() {
        return `
            <div class="player-video-progress">
                <div class="player-video-progress-slider bui bui-slider" aria-label="进度条">
                    <div class="bui-track bui-track-autohide-thumb bui-track-video-progress">
                        <div class="bui-bar-wrap">
                        <div class="bui-bar bui-bar-buffer" style="transform: scaleX(0.001);"></div>
                        <div class="bui-bar bui-bar-normal" style="transform: scaleX(0.001);"></div>
                    </div>
                    <div class="bui-thumb" style="transform: translateX(-9px);">
                        <div class="bui-thumb-dot-special" style="width: 18px; height: 18px;">
                            <div>${progress}</div>
                        </div>
                    </div>
                    </div>
                </div>
                <div class="player-video-progress-detail">
                    <div class="player-video-progress-detail-container">
                        <div class="player-video-progress-detail-img">
                            <div class="player-video-progress-detail-time">00:00</div>
                        </div>
                    </div>
                    <div class="player-video-progress-detail-sign">
                        <div class="player-video-progress-detail-sign-down"></div>
                        <div class="player-video-progress-detail-sign-up"></div>
                    </div>
                </div>
            </div>
        `
    }

    renderPlayBtn() {
        return `
            <div class="player-video-btn player-video-btn-start">
                <button class="player-iconfont">
                    <span class="bp-svgicon bp-svgicon-start"></span>
                </button>
            </div>
        `
    }

    renderNextBtn() {
        return `
            <div class="player-video-btn player-video-btn-next">
                <button class="player-iconfont player-tooltips-trigger" data-text="下一话">
                    <span class="bp-svgicon">${next}</span>
                </button>
            </div>
        `
    }

    renderTime() {
        return `
            <div class="player-video-time">
                <div class="player-video-time-wrap">
                    <span class="player-video-time-now">00:00</span>
                    <span class="player-video-divider">/</span>
                    <span class="player-video-time-total">00:00</span>
                </div>
            </div>
        `
    }

    renderEpisode() {
        return `
            <div class="player-video-btn player-video-btn-episode">
                <button class="player-iconfont player-video-btn-episode-name" aria-label="选集">选集</button>
                <div class="player-video-btn-episode-menu-wrap">
                    <ul class="player-video-btn-episode-list"></ul>
                </div>
            </div>
        `
    }

    renderSpeed() {
        return `
            <div class="player-video-btn player-video-btn-speed">
                <button class="player-iconfont player-video-btn-speed-name" aria-label="倍速">倍速</button>
                <div class="player-video-btn-speed-menu-wrap"></div>
            </div>
        `
    }

    renderVolume() {
        return `
            <div class="player-video-btn player-video-btn-volume">
                <button class="player-iconfont player-iconfont-volume">
                    <span class="bp-svgicon bp-svgicon-volume"></span>
                </button>
                <button class="player-iconfont player-iconfont-volume-max">
                    <span class="bp-svgicon bp-svgicon-volume-max"></span>
                </button>
                <button class="player-iconfont player-iconfont-volume-min">
                    <span class="bp-svgicon bp-svgicon-volume-min"></span>
                </button>
                <div class="player-video-volumebar-wrap">
                    <div class="player-video-volume-num">50</div>
                    <div class="player-video-volumebar bui bui-slider">
                        <div class="bui-track bui-track-vertical">
                            <div class="bui-bar-wrap">
                                <div class="bui-bar bui-bar-normal" style="transform: scaleY(0.5);"></div>
                            </div>
                            <div class="bui-thumb" style="left: -5px; transform: translateY(-20.8px);">
                                <div class="bui-thumb-dot"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    }

    renderPip() {
        return `
            <div class="player-video-btn player-video-btn-pip closed">
                <button class="player-iconfont player-iconfont-pip-on player-tooltips-trigger" data-text="开启画中画"><span class="bp-svgicon bp-svgicon-pip-on"></span></button>
                <button class="player-iconfont player-iconfont-pip-off player-tooltips-trigger" data-text="关闭画中画"><span class="bp-svgicon bp-svgicon-pip-off"></span></button>
            </div>
        `
    }

    renderFullscreen() {
        return `
            <div class="player-video-btn player-video-web-fullscreen">
                <button class="player-iconfont player-iconfont-web-fullscreen-off player-tooltips-trigger" data-text="网页全屏">
                    <span class="bp-svgicon bp-svgicon-web-full-on"></span>
                </button>
                <button class="player-iconfont player-iconfont-web-fullscreen-on player-tooltips-trigger" data-text="退出网页全屏">
                    <span class="bp-svgicon bp-svgicon-web-full-off"></span>
                </button>
            </div>
            <div class="player-video-btn player-video-fullscreen video-state-fullscreen-off">
                <button class="player-iconfont player-iconfont-fullscreen-off player-tooltips-trigger" data-text="进入全屏">
                    <span class="bp-svgicon bp-svgicon-fullscreen-on"></span>
                </button>
                <button class="player-iconfont player-iconfont-fullscreen-on player-tooltips-trigger" data-text="退出全屏">
                    <span class="bp-svgicon bp-svgicon-fullscreen-off"></span>
                </button>
            </div>
        `
    }
}

export default Template