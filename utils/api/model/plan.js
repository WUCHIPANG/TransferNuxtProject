import httpReq from '~/utils/request'

const base = '/Plan'
const standard = '/PlanFile'
const urls = {
  projectList: base,
  projectDetail: base,
  projectAdd: base,
  projectEdit: base,
  projectDelete: base,
  flightList: base + '/Flight',
  flightAdd: base + '/Flight',
  flightDetail: base + '/Flight',
  flightEdit: base + '/Flight',
  flightDelete: base + '/Flight',
  windDirection: base + '/Flight/WindDirection',
  unexecutedReason: base + '/Flight/UnexecutedReason',
  status: base + '/Flight/Status',
  moduleNums: base + '/Flight/ModuleNums',
  notify: base + '/Flight/Notify',
  upload: standard,
  fileList: standard,
  fileDownload: standard,
  fileDelete: standard,
  stitchingAdd: standard + '/Flight/StitchingImage',
  stitchingDownload: standard + '/Flight/StitchingImage',
  stitchingDelete: standard + '/Flight/StitchingImage',
  nameList: base + '/NameList',
  list: base + '/list',
  range: base + '/Range',
  suggestionList: base + '/Suggestion',
  suggestionAdd: base + '/Suggestion',
}
export default {
  // 巡檢專案維護
  project: {
    list: {
      url: urls.projectList,
      name: '撈取巡檢專案清單',
      get: (params) => httpReq.get(urls.projectList, params)
    },
    detail: {
      url: urls.projectDetail,
      name: '撈取巡檢專案詳細資料',
      get: (planID) => httpReq.get(`${urls.projectDetail}/${planID}`)
    },
    add: {
      url: urls.projectAdd,
      name: '新增巡檢專案資訊',
      post: (params) => httpReq.post(urls.projectAdd, params)
    },
    edit: {
      url: urls.projectEdit,
      name: '修改巡檢專案資訊',
      put: (params) => httpReq.put(`${urls.projectEdit}/${params.planID}`, params)
    },
    delete: {
      url: urls.delete,
      name: '刪除巡檢專案資訊',
      delete: (planID) => httpReq.delete(`${urls.delete}/${planID}`)
    },
  },
  // 巡檢資料維護(飛行紀錄)
  flight: {
    list: {
      url: urls.flightList,
      name: '撈取巡檢飛行資料清單',
      get: (params) => httpReq.get(urls.flightList, params)
    },
    add: {
      url: urls.flightAdd,
      name: '新增巡檢飛行資料',
      post: (params) => httpReq.post(urls.flightAdd, params)
    },
    detail: {
      url: urls.flightDetail,
      name: '撈取巡檢飛行資料',
      get: (planFlightID) => httpReq.get(`${urls.flightDetail}/${planFlightID}`)
    },
    edit: {
      url: urls.flightEdit,
      name: '修改巡檢飛行資料',
      put: (planFlightID, params) => httpReq.put(`${urls.flightEdit}/${planFlightID}`, params)
    },
    delete: {
      url: urls.flightDelete,
      name: '刪除巡檢飛行資料',
      delete: (planFlightID) => httpReq.delete(`${urls.flightDelete}/${planFlightID}`)
    },
    windDirection: {
      url: urls.WindDirection,
      name: '撈取風向清單',
      get: () => httpReq.get(urls.WindDirection)
    },
    unexecutedReason: {
      url: urls.unexecutedReason,
      name: '修改巡檢飛行資料未執行原因',
      put: (planFlightID, params) => httpReq.put(`${urls.unexecutedReason}/${planFlightID}`, params)
    },
    status: {
      url: urls.status,
      name: '修改飛行任務狀態',
      put: (planFlightID, params) => httpReq.put(`${urls.status}/${planFlightID}`, params)
    },
    moduleNums: {
      url: urls.moduleNums,
      name: '修改飛行任務模組數量',
      put: (planFlightID, data) => httpReq.put(`${urls.moduleNums}/${planFlightID}`, data)
    },
    notify: {
      url: urls.notify,
      name: '新增巡檢飛行資料',
      post: (planFlightID, data) => httpReq.post(`${urls.notify}/${planFlightID}`, data)
    },
  },
  upload: {
    url: urls.upload,
    name: '上傳專案附件檔',
    post: (data, config = {}) => httpReq.post(urls.upload, data, config)
  },
  file: {
    list: {
      url: urls.fileList,
      name: '撈取專案附件清單',
      get: (params) => httpReq.get(urls.fileList, params)
    },
    download: {
      url: urls.fileDownload,
      name: '撈取專案附件清單',
      get: (fileID, params, config = { responseType: 'blob' }) => httpReq.get(`${urls.fileDownload}/${fileID}`, params, config)
    },
    delete: {
      url: urls.fileDelete,
      name: '刪除專案附件清單',
      delete: (fileID) => httpReq.delete(`${urls.fileDelete}/${fileID}`)
    },
  },
  stitching: {
    add: {
      url: urls.stitchingAdd,
      name: '上傳任務全景拼接圖',
      post: (data, config = {}) => httpReq.post(urls.stitchingAdd, data, config)
    },
    download: {
      url: urls.stitchingDownload,
      name: '取得全景拼接圖片',
      get: (planFlightID, data) => httpReq.get(`${urls.stitchingDownload}/${planFlightID}`, data)
    },
    delete: {
      url: urls.stitchingDelete,
      name: '刪除全景拼接圖圖片',
      delete: (planFlightID, fileType) => httpReq.delete(`${urls.stitchingDelete}/${planFlightID}?fileType=${fileType}`)
    },
  },
  nameList: {
    url: urls.nameList,
    name: '撈取全部巡檢專案清單',
    get: () => httpReq.get(urls.nameList)
  },
  // Mock API
  list: {
    url: urls.list,
    name: '撈取巡檢專案清單',
    get: (params) => httpReq.get(urls.list, params)
  },
  range: {
    url: urls.range,
    name: '修改專案飛行範圍',
    put: (planID, data) => httpReq.put(`${urls.range}/${planID}`, data)
  },
  suggestion: {
    list: {
      url: urls.suggestionList,
      name: '撈取建議註記清單',
      get: (params) => httpReq.get(urls.suggestionList, params)
    },
    add: {
      url: urls.suggestionAdd,
      name: '新增建議註記',
      post: (params) => httpReq.post(urls.suggestionAdd, params)
    },
  },
}
