import config from '@/config'
import httpReq from '@/utils/request'

export default {
  // 後臺人工篩檢
  list: {
    url: `${config.API_URL}/InspectionManage`,
    name: '取得AI巡檢結果列表',
    get: async function(params) {
      return await httpReq.get(this.url, params)
    },
  },
  planList: {
    url: `${config.API_URL}/InspectionManage`,
    name: '取得專案資訊與案場清單',
    get: async function(id) {
      return await httpReq.get(`${this.url}/${id}`)
    },
  },
  delDraft: {
    url: `${config.API_URL}/InspectionManage/Draft`,
    name: '人工篩檢放棄變更(草稿刪除)',
    delete: async function(id) {
      return await httpReq.delete(`${this.url}/${id}`)
    },
  },
  planFightList: {
    url: `${config.API_URL}/InspectionManage/PlanFlight`,
    name: '取得案場的任務清單',
    get: async function(planID, params) {
      return await httpReq.get(`${this.url}/${planID}`, params)
    },
  },

  planFightImage: {
    url: `${config.API_URL}/InspectionManage/PlanFlight/Image`,
    name: '取得AI分析結果圖片及資訊',
    get: async function(planFlightID, params) {
      return await httpReq.get(`${this.url}/${planFlightID}`, params)
    },
  },
  imageInfo: {
    url: `${config.API_URL}/InspectionManage/PlanFlight/Image/Info`,
    name: '取得單筆AI分析結果',
    get: async function(id, data) {
      return await httpReq.get(`${this.url}/${id}`, data)
    },
  },
  addErrorPoint: {
    url: `${config.API_URL}/InspectionManage/PlanFlight/Image/ErrorPoint`,
    name: '新增異常點位與事件資訊',
    post: async function(data) {
      return await httpReq.post(this.url, data)
    },
  },
  editErrorPoint: {
    url: `${config.API_URL}/InspectionManage/PlanFlight/Image/ErrorPoint`,
    name: '修改異常點位資訊',
    put: async function(aiErrorPointID, data) {
      return await httpReq.put(`${this.url}/${aiErrorPointID}`, data)
    },
  },
  delErrorPoint: {
    url: `${config.API_URL}/InspectionManage/PlanFlight/Image/ErrorPoint`,
    name: '刪除異常點位資訊',
    delete: async function(aiErrorPointID) {
      return await httpReq.delete(`${this.url}/${aiErrorPointID}`)
    },
  },
  getTempData: {
    url: `${config.API_URL}/InspectionManage/PlanFlight/Image/TempData`,
    name: '撈取溫度資訊',
    post: async function(data) {
      return await httpReq.post(this.url, data)
    },
  },
  release: {
    url: `${config.API_URL}/InspectionManage/Release`,
    name: 'AI結果狀態為完成審核發佈',
    put: async function(aiResultID) {
      return await httpReq.put(`${this.url}/${aiResultID}`)
    },
  },
  report: {
    url: `${config.API_URL}/InspectionManage/Report`,
    name: 'AI人工篩檢產製報告',
    post: async function(aiResultID) {
      return await httpReq.post(`${this.url}/${aiResultID}`)
    },
  },
}
