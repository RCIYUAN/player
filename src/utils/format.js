function timeZone(time) {
    return time.setTime(time.getTime() + 60 * (time.getTimezoneOffset() + 480) * 1000), time
}

const add0 = (num) => num < 10 ? '0' + num : '' + num

const Format = {
    formatTime(duration) {
        let hour = Math.floor(duration / 3600)
        let min = Math.floor((duration - hour * 3600) / 60)
        let sec = Math.floor(duration - hour * 3600 - min * 60)
        return (hour > 0 ? [hour, min, sec] : [min, sec]).map(add0).join(':')
    },
    formatDate(timestamp) {
        let date = timeZone(new Date(timestamp))
        // return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
        // let date = timeZone(new Date(timestamp))
        let month = date.getMonth() + 1,
            day = date.getDate(),
            hour = date.getHours(),
            minute = date.getMinutes()

        return `${add0(month)}-${add0(day)} ${add0(hour)}:${add0(minute)}`
    }
}

export default Format