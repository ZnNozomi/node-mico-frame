/**
 *  @Author: wx
 *  @Date: 2019/1/10
 *  @Last Modified time: 2019/1/10
 */

import {Context} from 'koa'
import {Controller, Get, Log, Post} from '../decorator/index'

@Controller('/api')
export default class Api {

  @Get('/')
  async dataFun(ctx: Context, next: Function) {
    return ctx.sendSuccess({data: 'something'}, 'OK')
  }

}
