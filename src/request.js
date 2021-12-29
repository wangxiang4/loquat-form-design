/**
 * @program: loquat-form-design
 *
 * @description: 第三方axios请求库
 *
 * @author: entfrm开发团队-王翔
 *
 * @create: 2021-07-19
 */
import axios from 'axios'
import log from '@utils/log'
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
axios.defaults.validateStatus = function (status) {
  return status >= 200 && status <= 500 // 默认的
}
// 创建axios实例
const service = axios.create({
  // 超时
  timeout: 30000
})

// request拦截器
service.interceptors.request.use(
  config => {
    log.warning('正在使用第三方axios请求,请求前配置处理完毕!')
    return config
    // 经过对内部源码的剖析,内部采用Promise.resolve(config)链式调用,所以此处没有拒绝回调
  }, undefined
)

// 响应拦截器
service.interceptors.response.use(res => {
  log.success('正在使用第三方axios请求,响应成功!')
  return res.data
},
error => {
  log.danger('正在使用第三方axios请求,响应失败!')
  return Promise.reject(new Error(error))
})

export default service
