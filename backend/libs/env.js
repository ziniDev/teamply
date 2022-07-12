'use strict'

// const env = process.env.NODE_ENV || "development"
// // const config from __dirname + "/../configs/config.json")[env]
// const config from '~/configs/config.json')[env]

module.exports = {
    env: () => {
        return process.env.NODE_ENV
    },
    port: () => {
        return appConfig.get('server.port')
    },
}
