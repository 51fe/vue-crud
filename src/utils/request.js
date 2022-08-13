import axios from 'axios'
import { Message } from 'element-ui'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API
})

// request拦截器
service.interceptors.request.use(
  config => {
    const method = config.method.toLocaleLowerCase()
    console.log(config)
    if(['post', 'put'].includes(method)) {
      config.headers['Content-Type'] = 'application/json'
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    const { data, status, config, headers, statusText } = response
    if (status < 200 || status > 300) {
      Message({
        message: getAction(config) || statusText,
        type: 'error',
        duration: 5 * 1000
      })
    } else {
      const action = getAction(config)
      if(action) {
        Message({
          message: action + '成功',
          type: 'success'
        })
      }
    const count = headers['x-total-count']
      if(count) {
        return {
          list: data,
          total: parseInt(count)
        }
      }
      return data
    }
  },
  error => {
    Message({
      message: error.response?.statusText ?? '未知错误',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error.code)
  }
)

function getAction(config) {
  const method = config.method.toLocaleLowerCase()
  let action = ''
  if(method === 'put') {
    action = '修改'
  } else if(method === 'delete') {
    action = '删除'
  }
  return action
}
export default service
