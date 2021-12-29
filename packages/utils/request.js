/**
 * @program: loquat-form-design
 *
 * @description: 数据源请求封装
 *
 * @author: entfrm开发团队-王翔
 *
 * @create: 2021-07-27
 */
import axios from 'loquat-axios'

// 更新默认配置
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
axios.defaults.validateStatus = function (status) {
  return status >= 200 && status <= 500 // 默认的
}

// 创建axios实例,每请求一次创建一次实例
const service = axios.create({
  // 超时
  timeout: 30000
})

service.interceptors.response.use(res => {
  return res.data
}, error => {
  return Promise.reject(new Error(error))
})

export default service
