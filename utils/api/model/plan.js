import config from '@/config'
import httpReq from '@/utils/request'

export default {
  // 巡檢專案維護
  project: {
    list: {
      url: `${config.API_URL}/Plan`,
      name: '撈取巡檢專案清單',
      get: async function(params) {
        return await httpReq.get(this.url, params)
      },
    },
    detail: {
      url: `${config.API_URL}/Plan`,
      name: '撈取巡檢專案詳細資料',
      get: async function(planID) {
        return await httpReq.get(`${this.url}/${planID}`)
      },
    },
    add: {
      url: `${config.API_URL}/Plan`,
      name: '新增巡檢專案資訊',
      post: async function(params) {
        return await httpReq.post(this.url, params)
      },
    },
    edit: {
      url: `${config.API_URL}/Plan`,
      name: '修改巡檢專案資訊',
      put: async function(params) {
        return await httpReq.put(`${this.url}/${params.planID}`, params)
      },
    },
    delete: {
      url: `${config.API_URL}/Plan`,
      name: '刪除巡檢專案資訊',
      delete: async function(planID) {
        return await httpReq.delete(`${this.url}/${planID}`)
      },
    },
  },
  // 巡檢資料維護(飛行紀錄)
  flight: {
    list: {
      url: `${config.API_URL}/Plan/Flight`,
      name: '撈取巡檢飛行資料清單',
      get: async function(params) {
        return await httpReq.get(this.url, params)
      },
    },
    add: {
      url: `${config.API_URL}/Plan/Flight`,
      name: '新增巡檢飛行資料',
      post: async function(params) {
        return await httpReq.post(this.url, params)
      },
    },
    detail: {
      url: `${config.API_URL}/Plan/Flight`,
      name: '撈取巡檢飛行資料',
      get: async function(planFlightID) {
        return await httpReq.get(`${this.url}/${planFlightID}`)
      },
    },
    edit: {
      url: `${config.API_URL}/Plan/Flight`,
      name: '修改巡檢飛行資料',
      put: async function(planFlightID, params) {
        return await httpReq.put(`${this.url}/${planFlightID}`, params)
      },
    },
    delete: {
      url: `${config.API_URL}/Plan/Flight`,
      name: '刪除巡檢飛行資料',
      delete: async function(planFlightID) {
        return await httpReq.delete(`${this.url}/${planFlightID}`)
      },
    },
    windDirection: {
      url: `${config.API_URL}/Plan/Flight/WindDirection`,
      name: '撈取風向清單',
      get: async function() {
        return await httpReq.get(this.url)
      },
    },
    unexecutedReason: {
      url: `${config.API_URL}/Plan/Flight/UnexecutedReason`,
      name: '修改巡檢飛行資料未執行原因',
      put: async function(planFlightID, params) {
        return await httpReq.put(`${this.url}/${planFlightID}`, params)
      },
    },
    status: {
      url: `${config.API_URL}/Plan/Flight/Status`,
      name: '修改飛行任務狀態',
      put: async function(planFlightID, params) {
        return await httpReq.put(`${this.url}/${planFlightID}`, params)
      },
    },
    moduleNums: {
      url: `${config.API_URL}/Plan/Flight/ModuleNums`,
      name: '修改飛行任務模組數量',
      put: async function(planFlightID, data) {
        return await httpReq.put(`${this.url}/${planFlightID}`, data)
      },
    },
    notify: {
      url: `${config.API_URL}/Plan/Flight/Notify`,
      name: '新增巡檢飛行資料',
      post: async function(planFlightID, data) {
        return await httpReq.post(`${this.url}/${planFlightID}`, data)
      },
    },
  },
  upload: {
    url: `${config.API_URL}/PlanFile`,
    name: '上傳專案附件檔',
    post: async function(data, config = {}) {
      return await httpReq.post(this.url, data, config)
    },
  },
  file: {
    list: {
      url: `${config.API_URL}/PlanFile`,
      name: '撈取專案附件清單',
      get: async function(params) {
        return await httpReq.get(this.url, params)
      },
    },
    download: {
      url: `${config.API_URL}/PlanFile`,
      name: '撈取專案附件清單',
      get: async function(fileID, params, config = { responseType: 'blob' }) {
        return await httpReq.get(`${this.url}/${fileID}`, params, config)
      },
    },
    delete: {
      url: `${config.API_URL}/PlanFile`,
      name: '刪除專案附件清單',
      delete: async function(fileID) {
        return await httpReq.delete(`${this.url}/${fileID}`)
      },
    },
  },
  stitching: {
    add: {
      url: `${config.API_URL}/PlanFile/Flight/StitchingImage`,
      name: '上傳任務全景拼接圖',
      post: async function(data, config = {}) {
        return await httpReq.post(this.url, data, config)
      },
    },
    download: {
      url: `${config.API_URL}/PlanFile/Flight/StitchingImage`,
      name: '取得全景拼接圖片',
      get: async function(planFlightID, data) {
        return await httpReq.get(`${this.url}/${planFlightID}`, data)
      },
    },
    delete: {
      url: `${config.API_URL}/PlanFile/Flight/StitchingImage`,
      name: '刪除全景拼接圖圖片',
      delete: async function(planFlightID, fileType) {
        return await httpReq.delete(`${this.url}/${planFlightID}?fileType=${fileType}`)
      },
    },
  },
  nameList: {
    url: `${config.API_URL}/Plan/NameList`,
    name: '撈取全部巡檢專案清單',
    get: async function() {
      return await httpReq.get(this.url)
    },
  },
  // Mock API
  list: {
    url: `${config.MOCK_API_URL}/plan/list`,
    name: '撈取巡檢專案清單',
    get: async function(params) {
      return await httpReq.get(this.url, params)
    },
  },
  range: {
    url: `${config.API_URL}/Plan/Range`,
    name: '修改專案飛行範圍',
    put: async function(planID, data) {
      return await httpReq.put(`${this.url}/${planID}`, data)
    },
  },
  suggestion: {
    list: {
      url: `${config.API_URL}/Plan/Suggestion`,
      name: '撈取建議註記清單',
      get: async function(params) {
        return await httpReq.get(this.url, params)
      },
    },
    add: {
      url: `${config.API_URL}/Plan/Suggestion`,
      name: '新增建議註記',
      post: async function(params) {
        return await httpReq.post(this.url, params)
      },
    },
  },
}
