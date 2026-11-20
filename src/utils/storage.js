const Storage = {
    set: (key, value) => {
        localStorage.setItem(key, JSON.stringify(value))
    },
    get: (key) => {
        let value = localStorage.getItem(key)
        return JSON.parse(value)
    },
    remove: (key) => {
        return localStorage.removeItem(key)
    }
}

export default Storage