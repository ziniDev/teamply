'use strict'
import Router from '@koa/router'
import testController from '~/controllers/test'
import response from "~/libs/response"

const api = new Router()

api.get('/health-check', (ctx) => {
    response.send(ctx)
})

api.get('/test', testController.test)

export default api
