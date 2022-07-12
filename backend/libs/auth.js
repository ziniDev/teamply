'use strict'
import crypto from 'crypto'
import models from '~/models'
import response from './response'
import logger from './logger'
import env from './env'
import jwt from 'jsonwebtoken'
const secretkey = appConfig.get('crypto').secretkey

const riroAuth = {
  isClient: async (ctx) => {
    if (!ctx.request.header.hasOwnProperty('client-id')) {
      response.unauthorized(ctx)
    } else {
      if (ctx.request.header['client-id'] !== appConfig.get('clientId')) {
        response.forbidden(ctx)
      }
    }
  },

  isLoggedIn: async (ctx, next) => {
    if (appConfig.get('whoami') !== 'local') await riroAuth.isClient(ctx)

    const userId = parseInt(ctx.request.header['user-id'] || 0)
    const accessToken = (ctx.request.header['authorization'] || '').replace('Bearer ', '')

    if (userId && accessToken) {
      // let cacheAccessToken = ctx.cache.get(userId + ':accessToken')

      // console.log(userId + ':accessToken')
      // console.log(cacheAccessToken)
      // console.log(accessToken)
      // if (appConfig.get('whoami') !== 'local' && cacheAccessToken !== accessToken) {
      //   response.forbidden(ctx)
      // }

      let tokenData
      try {
        tokenData = jwt.verify(accessToken, secretkey)

        if (tokenData.id !== userId) {
          response.forbidden(ctx)
        }

        await riroAuth.authorize(ctx, tokenData)
      } catch (e) {
        console.log(e)
      }

      if (!tokenData) {
        const refreshToken = (ctx.request.header['refresh-token'] || '').replace('Bearer ', '')

        if (refreshToken) {
          // let cacheRefreshToken = ctx.cache.get(userId + ':refreshToken')
          // if (cacheRefreshToken !== refreshToken) {
          //   response.forbidden(ctx)
          // }

          try {
            tokenData = jwt.verify(refreshToken, secretkey)
    
            if (tokenData.accessToken !== accessToken) {
              response.forbidden(ctx)
            }

          } catch (e) {
            console.log(e)
            response.unauthorized(ctx)
          }

        } else {
          response.unauthorized(ctx)
        }
      }

    } else {
      console.log('userId : ', userId)
      console.log('accessToken : ', accessToken)
      response.unauthorized(ctx)
    }
  },

  authorize: async (ctx, tokenData) => {
    let user
    if (!ctx.session) ctx.session = {}
    if (!ctx.user) ctx.user = {}
    
    if (ctx.session.user && ctx.session.user.id === ctx.user.id) {
      user = ctx.session.user
    } else {
      user = tokenData
    }
    ctx.session.user = user
  },
}

module.exports = riroAuth
