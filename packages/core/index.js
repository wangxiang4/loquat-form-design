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

export const LoquatCore = {
  remoteFunc,
  remoteOption
}

export * from './remoteFunc'
export * from './remoteOption'

export default LoquatCore
