import axios from 'axios'
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
axios.defaults.validateStatus = function (status) {
  return status >= 200 && status <= 500 // 默认的
}

// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: process.env.VUE_APP_BASE_API,
  // 超时
  timeout: 30000
})

export default function (requestFunc, responseFunc, errorFunc) {
  // request拦截器
  service.interceptors.request.use(
    config => {
      new Function(`return ${requestFunc}`)()
      // 经过对内部源码的剖析,内部采用Promise.resolve(config)链式调用,所以此处没有拒绝回调
    }, undefined)
  // 响应拦截器
  service.interceptors.response.use(res => {
    new Function(`return ${responseFunc}`)()
    // eslint-disable-next-line handle-callback-err
  }, error => {
    new Function(`return ${errorFunc}`)()
  })
  return service
}
