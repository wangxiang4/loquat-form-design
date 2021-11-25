/**
 * @program: loquat-form-design
 *
 * @description: 导出提供对外核心
 *
 * @author: entfrm开发团队-王翔
 *
 * @create: 2021-11-25
 */
import { remoteFunc } from './remoteFunc'
import { remoteOption } from './remoteOption'
import { setup } from './setup'

export const LoquatCore = {
  remoteFunc,
  remoteOption,
  setup
}

export * from './remoteFunc'
export * from './remoteOption'
export * from './setup'

export default LoquatCore
