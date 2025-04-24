import httpReq from '~/utils/request'

export default {
  // 巡檢類型清單
  list: {
    url: `/InspectionType`,
    name: '撈取巡檢類型',
    get: (params) => httpReq.get('/InspectionType', params)
  },
}
