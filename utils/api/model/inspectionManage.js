import httpReq from '~/utils/request'

const base = '/InspectionManage'
const urls = {
  list: base,
  planList: base,
  delDraft: base + '/Draft',
  planFightList: base + '/PlanFlight',
  planFightImage: base + '/PlanFlight/Image',
  imageInfo: base + '/PlanFlight/Image/Info',
  addErrorPoint: base + '/PlanFlight/Image/ErrorPoint',
  editErrorPoint: base + '/PlanFlight/Image/ErrorPoint',
  delErrorPoint: base + '/PlanFlight/Image/ErrorPoint',
  getTempData: base + '/PlanFlight/Image/TempData',
  release: base + '/Release',
  report: base + '/Report'
}
export default {
  // 後臺人工篩檢
  list: {
    url: urls.list,
    name: '取得AI巡檢結果列表',
    get: (params) => httpReq.get(urls.list, params)
  },
  planList: {
    url: urls.planList,
    name: '取得專案資訊與案場清單',
    get: (id) => httpReq.get(`${urls.planList}/${id}`)
  },
  delDraft: {
    url: urls.delDraft,
    name: '人工篩檢放棄變更(草稿刪除)',
    delete: (id) => httpReq.delete(`${urls.delDraft}/${id}`)
  },
  planFightList: {
    url: urls.planFightList,
    name: '取得案場的任務清單',
    get: (planID, params) => httpReq.get(`${urls.planFightList}/${planID}`, params)
  },

  planFightImage: {
    url: urls.planFightImage,
    name: '取得AI分析結果圖片及資訊',
    get: (planFlightID, params) => httpReq.get(`${urls.planFightImage}/${planFlightID}`, params)
  },
  imageInfo: {
    url: urls.imageInfo,
    name: '取得單筆AI分析結果',
    get: (id, data) => httpReq.get(`${urls.imageInfo}/${id}`, data)
  },
  addErrorPoint: {
    url: urls.addErrorPoint,
    name: '新增異常點位與事件資訊',
    post: (data) => httpReq.post(urls.addErrorPoint, data)
  },
  editErrorPoint: {
    url: urls.editErrorPoint,
    name: '修改異常點位資訊',
    put: (aiErrorPointID, data) => httpReq.put(`${urls.editErrorPoint}/${aiErrorPointID}`, data)
  },
  delErrorPoint: {
    url: urls.delErrorPoint,
    name: '刪除異常點位資訊',
    delete: (aiErrorPointID) => httpReq.delete(`${urls.delErrorPoint}/${aiErrorPointID}`)
  },
  getTempData: {
    url: urls.getTempData,
    name: '撈取溫度資訊',
    post: (data) => httpReq.post(urls.getTempData, data)
  },
  release: {
    url: urls.release,
    name: 'AI結果狀態為完成審核發佈',
    put: (aiResultID) => httpReq.put(`${urls.release}/${aiResultID}`)
  },
  report: {
    url: urls.report,
    name: 'AI人工篩檢產製報告',
    post: (aiResultID) => httpReq.post(`${urls.report}/${aiResultID}`)
  },
}
