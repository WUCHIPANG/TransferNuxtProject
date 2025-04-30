import axios from 'axios'
import tool from '~/utils/tool'
import { setApiMessage } from '~/utils/messages.js'

let instance = null

function getInstance() {
  if (instance) return instance

  const config = useRuntimeConfig() // ✅ 延遲在安全區域內取得 Nuxt composable

  instance = axios.create({
    baseURL: config.public.apiBaseUrl,
    timeout: 10000,
  })

  // Request 攔截器
  instance.interceptors.request.use((cfg) => {
    const token = tool.cookie.get('TOKEN')
    if (token) cfg.headers.Authorization = 'Bearer ' + token
    cfg.headers['X-Requested-With'] = 'XMLHttpRequest'
    return cfg
  }, (err) => Promise.reject(err))

  // Response 攔截器
  instance.interceptors.response.use(
    (res) => res,
    (err) => {
      const { status, data } = err?.response || {}
      setApiMessage(status, data?.status, data?.message, '伺服器錯誤')
      return Promise.reject(err.response)
    }
  )

  return instance
}

export default {
  get:    (url, params = {}, config = {}) => getInstance().get(url, { params, ...config }).then(r => r.data),
  post:   (url, data = {}, config = {})  => getInstance().post(url, data, config).then(r => r.data),
  put:    (url, data = {}, config = {})  => getInstance().put(url, data, config).then(r => r.data),
  patch:  (url, data = {}, config = {})  => getInstance().patch(url, data, config).then(r => r.data),
  delete: (url, data = {}, config = {})  => getInstance().delete(url, { data, ...config }).then(r => r.data),
}