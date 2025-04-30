import httpReq from '~/utils/request'

const urls = {
  list: '/InspectionType'
}
export default {
  // 巡檢類型清單
  list: {
    url: urls.list,
    name: '撈取巡檢類型',
    get: (params) => httpReq.get(urls.list, params)
  },
}
