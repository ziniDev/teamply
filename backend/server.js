"use strict"
import logger from "~/libs/logger"
import Koa from "koa"
import Router from "@koa/router"
import koaBody from "koa-body"
import cors from "koa2-cors"
import koaLogger from "koa-logger"
import session from "koa-session"
import serve from "koa-static"
import response from "~/libs/response"
import apiV1Router from "~/routes/api_v1"

const app = new Koa()
const router = new Router()
router.use("/api/v1", apiV1Router.routes())

app.use(serve(__dirname + '/public'));
app.keys = ["key"]

const sessionConfig = {
  key: "attend:sess",
  maxAge: 3600000, // 1hour
  httpOnly: true,
}
const koaBodyOptions = {
  jsonLimit: "100mb",
  multipart: true,
}

let isDisableKeepAlive = false
app.use(async (ctx, next) => {
  try {
    if (isDisableKeepAlive) {
      ctx.set("Connection", "close")
    }
    await next()
  } catch (err) {
    ctx.app.emit("error", err, ctx)
    ctx.status = err.status || 500
    ctx.body = err.message
  }
})

app.on("error", (err, ctx) => {
  let errorStack = err.stack.split("From previous event:").map((_) => {
    return _.split("\n")
      .slice(1)
      .map((_) => _.trim())
      .filter((_) => _.length > 0)
  })

  let errorDump = {
    type: err.name,
    message: err.message,
    stack: errorStack,
    ctx: ctx,
  }

  logger.error("Uncaught error dumped.", errorDump)
})

app.use(koaLogger())
app.use(session(sessionConfig, app))
app.use(
  cors({
    credentials: true,
    exposeHeaders: [
      'access-token',
      'refresh-token',
    ]
  })
)
app.use(koaBody(koaBodyOptions))
// app.use(oas({
//     file: './configs/docs/openapi.yaml',
//     uiEndpoint: '/api/v2/docs',
// }));
app.use(response.res)
app.use(router.routes())
app.use(router.allowedMethods())

const listenPort = appEnv.port()

const server = app.listen(listenPort, () => {
  // process.send('ready')
  const port = server.address().port
  console.log(`Now listening on port(${port}) by ${appEnv.env()}`)
  logger.info(`Now listening on port(${port}) by ${appEnv.env()}`)
})

process.on("SIGINT", () => {
  isDisableKeepAlive = true
  // app.close(function() {
  //     logger.info('server closed')
  //     // process.exit(0)
  // })
})

logger.info(`Try to listen on port(${listenPort}) by ${appEnv.env()}`)
