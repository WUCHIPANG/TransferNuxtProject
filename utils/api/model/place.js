import config from '@/config'
import httpReq from '@/utils/request'

export default {
  list: {
    url: `${config.API_URL}/Place`,
    name: '取得案場清單',
    get: async function(params) {
      return await httpReq.get(this.url, params)
    },
  },
  detail: {
    url: `${config.API_URL}/Place/`,
    name: '取得案場資訊',
    get: async function(params) {
      return await httpReq.get(this.url + params)
    },
  },
  add: {
    url: `${config.API_URL}/Place`,
    name: '新增案場資訊',
    post: async function(data = {}) {
      return await httpReq.post(this.url, data)
    },
  },
  update: {
    url: `${config.API_URL}/Place/`,
    name: '修改案場資訊',
    put: async function(params, data = {}) {
      return await httpReq.put(this.url + params, data)
    },
  },
  delete: {
    url: `${config.API_URL}/Place/`,
    name: '刪除案場資訊',
    delete: async function(placeID) {
      return await httpReq.delete(this.url + placeID)
    },
  },
  // Mock API
  mockPlaceList: {
    url: `${config.MOCK_API_URL}/Place`,
    name: '取得客戶案場清單',
    get: async function() {
      return await httpReq.get(this.url)
    },
  },

}
