import httpReq from '~/utils/request'

const urls = {
  login: '/Login',
  token: '/auth/token',
}
export default {
  login: {
    url: urls.login,
    name: '登入',
    post: (data = {}) => httpReq.post(urls.login, data),
  },
  // Mock API
  token: {
    url: urls.token,
    name: '登入獲取TOKEN',
    get: () => httpReq.get(urls.token)
  },
}
