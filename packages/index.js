/**
 * @program: loquat-form-design
 *
 * @description: 导出表单设计器
 *
 * todo: 考虑稳定一段时间,采用typeScript重构项目
 * todo: 对外提供全局配置,工具包全部封装成一个新项目(类似xe-utils)
 * todo: Plugins,Configs全部使用按需加载,以及拔除$loquat原型
 *
 * @author: entfrm开发团队-王翔
 *
 * @create: 2021-07-19
 **/

import Configs from './config'
import Plugins from './plugins'
import FormDesign from './index.vue'
import permission from './directive'
import { deepClone, setPx, validateNull, get, kebabCase, noop } from '@utils'
import { KEY_COMPONENT_NAME } from '@/global/variable'
import imagePreview from '@components/ImagePreview'
import log from '@utils/log'

export default {
  install (Vue, opts = {}) {
    Vue.use(Configs)
    Vue.use(Plugins)
    Vue.use(permission)
    Vue.prototype.$loquat = {
      get: get,
      log: log,
      setPx: setPx,
      typeList: {
        img: /\.(gif|jpg|jpeg|png|GIF|JPG|PNG)/,
        video: /\.(swf|avi|flv|mpg|rm|mov|wav|asf|3gp|mkv|rmvb|ogg|mp4)/
      },
      deepClone: deepClone,
      validateNull: validateNull,
      imagePreview: imagePreview(Vue),
      axios: opts.axios || noop,
      remoteOption: opts.remoteOption || {},
      remoteFunc: opts.remoteFunc || {},
      qiniu: opts.qiniu || {
        up: 'https://upload.qiniup.com', // 存储地区，默认为华东，其他的如下表
        bucket: 'loquat', // 存储空间名称
        ak: 'z1KE2yt6JzO9zVxqPsnVo5m9AeI-dDTpia_qTb6X', // 七牛云相关密钥
        sk: 'outhjqeI2PiHZnKsQTZD5DGP3GLzEUf1-w5C0ak6', // 七牛云相关密钥
        deadline: 1 // token过期时间(单位:h)
      }
    }
    Vue.component(KEY_COMPONENT_NAME.concat(kebabCase(FormDesign.name)), FormDesign)
  }
}
