/**
 *  @Author: wx
 *  @Date: 2019/1/10
 *  @Last Modified time: 2019/1/10
 */

import {Context} from 'koa'

const errorHandle = () => {

  return async (ctx: Context, next: Function) => {

    try {

      await next()

    } catch (err) {

      ctx.status = err.status || 500

      if (ctx.status === 401) {

        return ctx.sendError('未授权，访问被拒绝')

      } else {

        throw err

      }
    }
  }
}

export default errorHandle
