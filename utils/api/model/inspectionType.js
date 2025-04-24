import config from '@/config'
import httpReq from '@/utils/request'

export default {
  // 取得巡檢類型清單
  type: {
    url: `${config.API_URL}/InspectionType`,
    name: '撈取巡檢類型清單',
    get: async function(params) {
      return await httpReq.get(this.url, params)
    },
  },
  eventsRanks: {
    url: `${config.API_URL}/InspectionType/EventsRanks`,
    name: '撈取巡檢類型事件清單',
    get: async function(id) {
      return await httpReq.get(`${this.url}/${id}`)
    },
  },
}
