import Koa, { DefaultContext, DefaultState } from 'koa'
import KoaRouter from '@koa/router'
import bodyParser from 'koa-body'
import cors from '@koa/cors'
import config from './common/config'
import api from './api'
import { routes as authRoutes } from './services/auth-service'
import session from 'koa-session'

const app = new Koa()

app.keys = ['some secret hurr']

const CONFIG: Partial<session.opts<DefaultState, DefaultContext, any>> = {
  key: 'koa.sess' /** (string) cookie key (default is koa.sess) */,
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 86400000,
  autoCommit: true /** (boolean) automatically commit headers (default true) */,
  overwrite: true /** (boolean) can overwrite or not (default true) */,
  httpOnly: true /** (boolean) httpOnly or not (default true) */,
  signed: false /** (boolean) signed or not (default true) */,
  rolling:
    true /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */,
  renew:
    false /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/,
  secure: false /** (boolean) secure cookie*/,
  sameSite: undefined,
}

app.use(session(CONFIG, app))

app.use(async (ctx, next) => {
  if (ctx.request.path.match('(.*)/auth/')) {
    return next()
  } else {
    if (!ctx.session?.isAuthenticated) {
      ctx.status = 401
    } else {
      return next()
    }
  }
})

app.use(cors({ credentials: true }))

app.on('error', (err) => {
  console.error(err)
})

app.use(bodyParser())

const publicRouter = new KoaRouter()

authRoutes(publicRouter)

app.use(publicRouter.routes())
app.use(api.routes())

export default app
