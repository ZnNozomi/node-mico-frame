/**
 *  @Author: wx
 *  @Date: 2019/1/10
 *  @Last Modified time: 2019/1/10
 */

// require('module-alias/register')

import * as Koa from 'koa'
import * as json from 'koa-json'
import * as bodyparser from 'koa-bodyparser'
import * as logger from 'koa-logger'
import * as path from 'path'
import * as koaStatic from 'koa-static'  // 静态资源服务插件

import errorHandle from './middleware/errorHandle'
import successHandle from './middleware/successHandle'
import Router from './decorator/index'

const app = new Koa()

app.use(errorHandle())
app.use(successHandle())
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))

app.use(json())
app.use(logger())

app.use(koaStatic(path.resolve(__dirname, '../public')))

const controllerPath = path.resolve(__dirname, './controller')
const router = new Router(app, controllerPath)
router.init()

app.listen(1233)
