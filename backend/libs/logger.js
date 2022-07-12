'use strict'
import config      from 'config'
import env         from '~/libs/env'
global.appEnv = env
global.appConfig = config
import winston from 'winston'
import moment from 'moment'

const logFormat = winston.format.printf(_ => {
    return moment().format('YYYY-MM-DD HH:mm:ss.SSS') + ` [${_.level.toUpperCase()}] : ${_.message}`   // log 출력 포맷 정의
});

const options = {
    level: 'info',
    transports: [
        new winston.transports.Console({
            handleExceptions: true,
            json: true,
            colorize: true,
            format: logFormat
        })
    ],
    exitOnError: false,
}
if(appEnv.env() === 'prod'){
    options.level = 'info'
}

let logger = new winston.createLogger(options);

module.exports = {
    debug: (v) => {
        logger.debug.apply(logger, appendWhereInfo(v))
    },
    verbose: (v) => {
        logger.verbose.apply(logger, appendWhereInfo(v))
    },
    info: (v) => {
        logger.info.apply(logger, appendWhereInfo(v))
    },
    warn: (v) => {
        logger.warn.apply(logger, appendWhereInfo(v))
    },
    error: (v) => {
        logger.error.apply(logger, appendWhereInfo(v))
    },
}

const appendWhereInfo = (v) => {
    const stackInfo = getStackInfo(1) // 0번째 데이터는 위에 정의된 module.exports.xxx() 호출 스택이 나옴 -> 그래서 1번째 데이터 활용
    let message = {
        data: v,
        where: {
            file: stackInfo.file,
            line: stackInfo.line,
            method: stackInfo.method
        },
    }
    message = JSON.stringify(message)
    return [message]
}

const getStackInfo = (stackIndex) => {
    const stacklist = new Error().stack.split('\n').slice(3)
    // http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
    // do not remove the regex expresses to outside of this method (due to a BUG in node.js)
    const stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi
    const stackReg2 = /at\s+()(.*):(\d*):(\d*)/gi

    const s = stacklist[stackIndex] || stacklist[0]
    const sp = stackReg.exec(s) || stackReg2.exec(s)

    if (sp && sp.length === 5) {
        return {
            method: sp[1],
            file: sp[2],
            line: sp[3],
            pos: sp[4],
            stack: stacklist.join('\n'),
        }
    }

    return {
        method: 'unknown',
        file: 'unknown',
        line: -1,
        pos: -1,
        stack: null,
    }
}
