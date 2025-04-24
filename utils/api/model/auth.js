import httpReq from '~/utils/request'

export default {
  // login: {
  //   url: `${config.API_URL}/Login`,
  //   name: '登入獲取USER資訊及MENU',
  //   post: async function(data = {}) {
  //     return await httpReq.post(this.url, data)
  //   },
  // },
  login: {
    url: '/Login',
    name: '登入',
    post: (data = {}) => httpReq.post('/Login', data),
  },
  // Mock API
  token: {
    url: `/auth/token`,
    name: '登入獲取TOKEN',
    get: () => httpReq.get('/auth/token')
  },
}
