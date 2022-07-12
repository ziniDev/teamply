'use strict'
import crypto from 'crypto'
import sha512 from 'js-sha512'

const algorithm = 'aes-256-cbc'
const secretKey = sha512('zhfpstmqhdks').substring(0, 32)
const secretIV = sha512('Korens_Work_Apps').substring(0, 16)

const models = {
    encrypt: (string) => {
        const cipher = crypto.createCipheriv(algorithm, secretKey, secretIV)
        let result = cipher.update(string, 'utf8', 'base64')
        result += cipher.final('base64')
        return [
            result.substring(0,12),
            result.substring(12,result.length)
        ]
    },

    decrypt: (string1, string2) => {
        let string = string1 + string2
        const decipher = crypto.createDecipheriv(algorithm, secretKey, secretIV)
        let result2 = decipher.update(string, 'base64', 'utf8')
        result2 += decipher.final('utf8')
        return result2
    }
}

module.exports = models
