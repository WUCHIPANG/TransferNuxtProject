import config from '@/config'
import httpReq from '@/utils/request'

export default {
  list: {
    url: `${config.API_URL}/Customer`,
    name: '取得客戶清單',
    get: async function(params) {
      return await httpReq.get(this.url, params)
    },
  },
  detail: {
    url: `${config.API_URL}/Customer/`,
    name: '取得客戶詳細資訊',
    get: async function(params) {
      return await httpReq.get(this.url + params)
    },
  },
  add: {
    url: `${config.API_URL}/Customer`,
    name: '新增客戶資訊',
    post: async function(data = {}) {
      return await httpReq.post(this.url, data)
    },
  },
  update: {
    url: `${config.API_URL}/Customer/`,
    name: '修改客戶資訊',
    put: async function(params, data = {}) {
      return await httpReq.put(this.url + params, data)
    },
  },
  delete: {
    url: `${config.API_URL}/Customer/`,
    name: '刪除客戶資訊',
    delete: async function(params) {
      return await httpReq.delete(this.url + params)
    },
  },
  methodData: {
    url: `${config.API_URL}/Customer/CustomerMethodData`,
    name: '取得客戶功能設定清單',
    get: async function() {
      return await httpReq.get(this.url)
    },
  },
  nameList: {
    url: `${config.API_URL}/Customer/NameList`,
    name: '撈取全部客戶資料',
    get: async function() {
      return await httpReq.get(this.url)
    },
  },
  // Mock API
  mockCustomerList: {
    url: `${config.MOCK_API_URL}/Customer`,
    name: '取得客戶清單',
    get: async function() {
      return await httpReq.get(this.url)
    },
  },

}
