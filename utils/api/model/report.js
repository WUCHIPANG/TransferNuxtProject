import config from '@/config'
import httpReq from '@/utils/request'

export default {
  planReport: {
    url: `${config.API_URL}/Report/PlanReport`,
    name: '匯出專案分級表',
    get: async function(planID, params, config = { responseType: 'blob' }) {
      return await httpReq.get(`${this.url}/${planID}`, params, config)
    },
  },
  planFlightReport: {
    url: `${config.API_URL}/Report/PlanFlightReport`,
    name: '匯出任務總表',
    get: async function(planFlightID, params, config = { responseType: 'blob' }) {
      return await httpReq.get(`${this.url}/${planFlightID}`, params, config)
    },
  },
  planReportAll: {
    url: `${config.API_URL}/Report/PlanFlightAllReport`,
    name: '匯出專案總表',
    get: async function(planID, params, config = { responseType: 'blob' }) {
      return await httpReq.get(`${this.url}/${planID}`, params, config)
    },
  },
  planFlightAIResult: {
    url: `${config.API_URL}/Report/PlanFlightAIResult`,
    name: '新增異常點位與事件資訊',
    post: async function(data) {
      return await httpReq.post(this.url, data, { responseType: 'blob' })
    },
  },
}
