// 配置文件
module.exports = {
    pc: {
        port: 8080
    },
    moblie: {
        port: 6060
    },
    admin: {
        port: 4040,
        proxy: {
            target: `http://localhost:9090`
        }
    },
    passport: {
        port: 5050,
        proxy: {
            target: `http://localhost:9090` 
        }
    }
}