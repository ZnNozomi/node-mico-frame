/**
 *  @Author: wx
 *  @Date: 2019/1/10
 *  @Last Modified time: 2019/1/10
 */

import {Context} from 'koa'

const sendHandle = () => {

  // 处理请求成功方法
  const reqSuccess = (ctx: Context) => {
    return (data: any, msg = 'success') => {
      ctx.set('Content-Type', 'application/json')
      ctx.body = {
        code: '00001',
        data,
        msg
      }
    }
  }

  // 处理请求失败方法
  const reqError = (ctx: Context) => {
    return (msg = 'fail') => {
      ctx.set('Content-Type', 'application/json')
      ctx.body = {
        code: '00003',
        data: null,
        msg
      }
    }
  }

  return async (ctx: Context, next: Function) => {
    ctx.sendSuccess = reqSuccess(ctx)
    ctx.sendError = reqError(ctx)
    await next()
  }

}

export default sendHandle
