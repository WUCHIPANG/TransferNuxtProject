import httpReq from '~/utils/request'

const base = '/Place'
const urls = {
  list: base,
  detail: base + '/',
  add: base,
  update: base + '/',
  delete: base + '/',
  mockPlaceList: base,
}
export default {
  list: {
    url: urls.list,
    name: '取得案場清單',
    get: (params) => httpReq.get(urls.list, params)
  },
  detail: {
    url: urls.detail,
    name: '取得案場資訊',
    get: (params) => httpReq.get(urls.detail + params)
  },
  add: {
    url: urls.add,
    name: '新增案場資訊',
    post: (data = {}) => httpReq.post(urls.add, data)
  },
  update: {
    url: urls.update,
    name: '修改案場資訊',
    put: (params, data = {}) => httpReq.put(urls.update + params, data)
  },
  delete: {
    url: urls.delete,
    name: '刪除案場資訊',
    delete: (placeID) => httpReq.delete(urls.delete + placeID)
  },
  // Mock API
  mockPlaceList: {
    url: urls.mockPlaceList,
    name: '取得客戶案場清單',
    get: () => httpReq.get(urls.mockPlaceList)
  },

}
