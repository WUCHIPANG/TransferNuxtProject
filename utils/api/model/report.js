import httpReq from '~/utils/request'

const base = '/Report'
const urls = {
  planReport: base + '/PlanReport',
  planFlightReport: base + '/PlanReport',
  planReportAll: base + '/PlanFlightAllReport',
  planFlightAIResult: base + '/PlanFlightAIResult',
}
export default {
  planReport: {
    url: urls.planReport,
    name: '匯出專案分級表',
    get: (planID, params, config = { responseType: 'blob' }) => httpReq.get(`${urls.planReport}/${planID}`, params, config)
  },
  planFlightReport: {
    url: urls.planFlightReport,
    name: '匯出任務總表',
    get: (planFlightID, params, config = { responseType: 'blob' }) => httpReq.get(`${urls.planFlightReport}/${planFlightID}`, params, config)
  },
  planReportAll: {
    url: urls.planReportAll,
    name: '匯出專案總表',
    get: (planID, params, config = { responseType: 'blob' }) => httpReq.get(`${urls.planReportAll}/${planID}`, params, config)
  },
  planFlightAIResult: {
    url: urls.planFlightAIResult,
    name: '新增異常點位與事件資訊',
    post: (data) => httpReq.post(urls.planFlightAIResult, data, { responseType: 'blob' })
  },
}
