import httpReq from '~/utils/request'

const base = '/InspectionType'
const urls = {
  type: base,
  eventsRanks: base + '/EventsRanks',
}
export default {
  // 取得巡檢類型清單
  type: {
    url: urls.type,
    name: '撈取巡檢類型清單',
    get: (params) => httpReq.get(urls.type, params)
  },
  eventsRanks: {
    url: urls.eventsRanks,
    name: '撈取巡檢類型事件清單',
    get: (id) => httpReq.get(`${urls.eventsRanks}/${id}`)
  },
}
