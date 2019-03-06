/**
 *  @Author: wx
 *  @Date: 2019/1/10
 *  @Last Modified time: 2019/1/10
 */

import {Context} from 'koa'
import * as R from 'ramda'
import * as KoaRouter from 'koa-router'
import * as glob from 'glob'
import {resolve} from 'path'

const pathPrefix: symbol = Symbol('pathPrefix')
const routeMap: any[] = []
let logTimes: number = 0

const changeToArr = R.unless(
   R.is(Array),
   R.of,
)

const resolvePath = R.unless(
   R.startsWith('/'),
   R.curryN(2, R.concat)('/'),
)

export default class Router {

  private app: any
  private router: any
  private routesPath: any

  constructor(app: any, routesPath: any) {
    this.app = app
    this.router = new KoaRouter()
    this.routesPath = routesPath
  }

  init = () => {

    const {app, router, routesPath} = this

    glob.sync(resolve(routesPath, './**/*.ts')).forEach(require)

    routeMap.forEach(({target, method, path, callback, descriptor}: any) => {
      const prefix = resolvePath(target[pathPrefix])
      router[method](prefix + path, ...callback)
    })

    app.use(router.routes())
    app.use(router.allowedMethods())
  }
}

export const Controller = (path: any) => (target: any) => {
  target.prototype[pathPrefix] = path
}

export const setRouter = (method: any) => (path: any) => (target: any, key: any, descriptor: any) => {
  routeMap.push({
    target,
    method,
    path: resolvePath(path),
    callback: changeToArr(target[key]),
    descriptor
  })
  return descriptor
}

export const Get = setRouter('get')
export const Post = setRouter('post')
export const Put = setRouter('put')
export const Delete = setRouter('delete')

export const convert = (middleware: any) => (target: any, key: any, descriptor: any) => {
  target[key] = R.compose(
     R.concat(
        changeToArr(middleware)
     ),
     changeToArr,
  )(target[key])

  return descriptor
}

export const Log = convert(async (ctx: Context, next: Function) => {
  logTimes++
  console.time(`${logTimes}: ${ctx.method} - ${ctx.url}`)
  await next()
  console.timeEnd(`${logTimes}: ${ctx.method} - ${ctx.url}`)
})
