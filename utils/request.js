import axios from 'axios'
import tool from '~/utils/tool'
import { setApiMessage } from '~/utils/messages.js'

const config = useRuntimeConfig()

const instance = axios.create({
  baseURL: config.public.apiBaseUrl,
  timeout: 10000,
})

instance.interceptors.request.use((cfg) => {
  const token = tool.cookie.get('TOKEN')
  if (token) cfg.headers.Authorization = 'Bearer ' + token
  cfg.headers['X-Requested-With'] = 'XMLHttpRequest'
  return cfg
}, (err) => Promise.reject(err))

instance.interceptors.response.use((res) => res, (err) => {
  const { status, data } = err?.response || {}
  setApiMessage(status, data?.status, data?.message, '伺服器錯誤')
  return Promise.reject(err.response)
})

export default {
  get:    (url, params = {}, config = {}) => instance.get(url, { params, ...config }).then(r => r.data),
  post:   (url, data = {}, config = {})  => instance.post(url, data, config).then(r => r.data),
  put:    (url, data = {}, config = {})  => instance.put(url, data, config).then(r => r.data),
  patch:  (url, data = {}, config = {})  => instance.patch(url, data, config).then(r => r.data),
  delete: (url, data = {}, config = {})  => instance.delete(url, { data, ...config }).then(r => r.data),
}