import config from '@/config'
import httpReq from '@/utils/request'

export default {
  summary: {
    url: `${config.API_URL}/FlightRecord/Summary`,
    name: '取得飛行紀錄摘要',
    get: async function(params) {
      return await httpReq.get(this.url, params)
    },
  },
  recordList: {
    url: `${config.API_URL}/FlightRecord`,
    name: '取得飛行記錄清單',
    get: async function(params) {
      return await httpReq.get(this.url, params)
    },
  },
  recordDetail: {
    url: `${config.API_URL}/FlightRecord/`,
    name: '取得飛行記錄Detail',
    get: async function(params) {
      return await httpReq.get(this.url + params)
    },
  },
  imgList: {
    url: `${config.API_URL}/FlightRecord/Image`,
    name: '取得圖片記錄清單',
    get: async function(params) {
      return await httpReq.get(this.url, params)
    },
  },
  imgDetail: {
    url: `${config.API_URL}/FlightRecord/Image/`,
    name: '取得圖片記錄資訊',
    get: async function(params) {
      return await httpReq.get(this.url + params)
    },
  },
  FRFileList: {
    url: `${config.API_URL}/FlightRecord/FRFile`,
    name: '取得飛行紀錄檔案清單',
    get: async function(params) {
      return await httpReq.get(this.url, params)
    },
  },
  FRFile: {
    url: `${config.API_URL}/FlightRecord/FRFile/`,
    name: '取得飛行紀錄圖片/影片',
    get: async function(params) {
      return await httpReq.get(this.url + params)
    },
  },
  pathList: {
    url: `${config.API_URL}/FlightRecord/Path/`,
    name: '取得飛行紀錄路線清單',
    get: async function(params) {
      return await httpReq.get(this.url + params)
    },
  },
  uploadFlightRecord: {
    url: `${config.API_URL}/FlightRecord/UploadFlightRecord`,
    name: '上傳飛行記錄檔',
    post: async function(data, config = {}) {
      return await httpReq.post(this.url, data, config)
    },
  },
  UploadFlightRecordFile: {
    url: `${config.API_URL}/FlightRecord/UploadFlightRecordFile`,
    name: '上傳飛行記錄圖片/影像檔',
    post: async function(data, config = {}) {
      return await httpReq.post(this.url, data, config)
    },
  },
  planFRFileTypeList: {
    url: `${config.API_URL}/FlightRecord/Plan/Flight/FRFileType`,
    name: '撈取任務檔案類型清單(可見光+熱顯)',
    get: async function(params) {
      return await httpReq.get(this.url, params)
    },
  },
  planFRFileList: {
    url: `${config.API_URL}/FlightRecord/Plan/Flight/FRFile`,
    name: '撈取任務檔案清單(可見光+熱顯)',
    get: async function(params) {
      return await httpReq.get(this.url, params)
    },
  },
  relation: {
    url: `${config.API_URL}/FlightRecord/Plan/Flight/FRFile/Relation`,
    name: '建立可見光與熱顯與溫度的對應關係',
    put: async function(data = {}) {
      return await httpReq.put(this.url, data)
    },
  },
  activeAIProcess: {
    url: `${config.API_URL}/InspectionManage/AIAnalysis`,
    name: '觸發AI分析',
    post: async function(data = {}) {
      return await httpReq.post(this.url, data)
    },
  },
  delete: {
    url: `${config.API_URL}/FlightRecord/Plan/Flight/FRFile`,
    name: '刪除飛行紀錄圖片(熱顯or可見光)清單',
    delete: async function(fileID) {
      return await httpReq.delete(`${this.url}/${fileID}`)
    },
  },
}
