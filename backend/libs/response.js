'use strict'
import resCode from '../config/response-code.json'
import logger from '~/libs/logger'
import moment from 'moment'
import jwt from 'jsonwebtoken'
import auth from './auth'
// import Cache from 'node-cache'
// const cache = new Cache({ stdTTL: 300, checkperiod: 600 })

const nonAuthUri = [
  '/api/v1/auth/login',
  '/api/v1/auth/register',
  '/api/v1/auth/email-auth',
  '/api/v1/auth/email-auth-confirm',
  '/api/v1/auth/is-exist-email',
  '/api/v1/auth/forget-password',
  '/api/v1/auth/forget-password-confirm',
  '/api/v1/auth/change-password',
]
const secretkey = appConfig.get('crypto').secretkey

let response = {
  res: async (ctx, next) => {
    // ctx.cache = cache
    let ip =
      ctx.req.headers['x-forwarded-for'] || ctx.req.connection.remoteAddress
    try {
      const url = ctx.req.url.split('?')[0]
      
      if (ctx.req.url.indexOf('/images/') < 0) {
        if (nonAuthUri.indexOf(url) < 0) await auth.isLoggedIn(ctx, next)
      }
      // logger.info(`REQUEST:${ctx.request.method}${ctx.request.url}|${ip}|${ctx.request.header.referer}|params:${JSON.stringify(ctx.request.body)}`)
      await next()
    } catch (err) {
      console.log(err)
      if (err.name === 'SequelizeValidationError') {
        ctx.status = resCode.validationError.code
        ctx.body = {
          code: resCode.validationError.code,
          message: err.errors[0].message,
        }
      } else if (err.name === 'SequelizeUniqueConstraintError') {
        ctx.status = resCode.validationUniqueError.code
        ctx.body = {
          code: resCode.validationUniqueError.code,
          message: resCode.validationUniqueError.message,
          result: resCode.validationUniqueError,
        }
      } else {
        if (err.code) {
          ctx.status = err.code
          ctx.body = err
        } else {
          resCode.severError.error = err.message
          ctx.status = resCode.severError.code
          ctx.body = resCode.severError
        }
      }
    } finally {
      if (ctx.status === 200) {

        if (nonAuthUri.indexOf(ctx.req.url) < 0) {
          const user = ctx.session ? ctx.session.user : null

          if (user) {
            delete user.iat
            delete user.exp

            const accessToken = jwt.sign(user, secretkey, { algorithm: 'HS256', expiresIn: '1 days'})
            const refreshToken = jwt.sign({accessToken}, secretkey, { algorithm: 'HS256', expiresIn: '30 days'})
            
            // ctx.cache.set(user.id + ':accessToken', accessToken, 60 * 60 * 24)
            // ctx.cache.set(user.id + ':refreshToken', refreshToken, 60 * 60 * 24 * 30)

            ctx.set('access-token', accessToken)
            ctx.set('refresh-token', refreshToken)
          }
        }
        // logger.info(`RESPONSE:${ctx.request.method}${ctx.request.url}|${ip}|${ctx.request.header.referer}|result:${JSON.stringify(ctx.body.result)}`)
      } else {
        // logger.info(`RESPONSE:${ctx.request.method}${ctx.request.url}|${ip}|${ctx.request.header.referer}|result:${JSON.stringify(ctx.message)}`)
      }
    }
  },
  /**
   * 성공시 Response
   * @param ctx
   * @param data
   */
  send: (ctx, data, etc) => {
    ctx.set('Content-Type', 'application/json')
    if (Array.isArray(data) && data.length === 0) {
      ctx.body = resCode.noContent
    } else {
      ctx.body = {
        result: true,
        code: 200,
        data: data,
        ...etc
      }
    }
  },
  error: (ctx, error, data) => {
    ctx.set('Content-Type', 'application/json')
    Object.assign(resCode[error], data)
    ctx.body = {
      data: resCode[error],
    }
  },
  created: (ctx, id) => {
    resCode.created.id = id
    ctx.body = resCode.created
  },
  noContent: (ctx) => {
    ctx.body = resCode.noContent
  },
  badRequest: (ctx) => {
    ctx.throw(resCode.badRequest)
  },
  unauthorized: (ctx) => {
    ctx.throw(resCode.unauthorized)
  },
  forbidden: (ctx) => {
    ctx.throw(resCode.forbidden)
  },
  tooManyRequest: (ctx) => {
    ctx.throw(resCode.tooManyRequest)
  },
  severError: (ctx) => {
    ctx.throw(resCode.severError)
  },
  notImplemented: (ctx) => {
    ctx.throw(resCode.notImplemented)
  },
  loginError: (ctx) => {
    ctx.throw(resCode.loginError)
  },
  validationError: (ctx, error) => {
    resCode.validationError.error = error
    ctx.throw(resCode.validationError)
  },
  customError: (ctx, message) => {
    ctx.throw({
      code: resCode.customError.code,
      message: message,
    })
  },
}

// module.exports = response
export default response
