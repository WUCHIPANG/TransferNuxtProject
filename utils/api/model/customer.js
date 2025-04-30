import httpReq from '~/utils/request'

const base = '/Customer'
const urls = {
  list: base,
  detail: base + '/',
  add: base,
  update: base + '/',
  delete: base + '/',
  methodData: base + '/CustomerMethodData',
  nameList: base + '/NameList',
  mockCustomerList: base,
}
export default {
  list: {
    url: urls.list,
    name: '取得客戶清單',
    get: (params) => httpReq.get(urls.list, params)
  },
  detail: {
    url: urls.detail,
    name: '取得客戶詳細資訊',
    get: (params) => httpReq.get(urls.detail + params)
  },
  add: {
    url: urls.add,
    name: '新增客戶資訊',
    post: (data = {}) => httpReq.post(urls.add, data)
  },
  update: {
    url: urls.update,
    name: '修改客戶資訊',
    put: (params, data = {}) => httpReq.put(urls.update + params, data)
  },
  delete: {
    url: urls.delete,
    name: '刪除客戶資訊',
    delete: (params) => httpReq.delete(urls.delete + params)
  },
  methodData: {
    url: urls.methodData,
    name: '取得客戶功能設定清單',
    get: () => httpReq.get(urls.methodData)
  },
  nameList: {
    url: urls.nameList,
    name: '撈取全部客戶資料',
    get: () => httpReq.get(urls.nameList)
  },
  // Mock API
  mockCustomerList: {
    url: urls.mockCustomerList,
    name: '取得客戶清單',
    get: () => httpReq.get(urls.mockCustomerList)
  },

}
