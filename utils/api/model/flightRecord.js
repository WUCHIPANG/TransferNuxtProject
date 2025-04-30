import httpReq from '~/utils/request'

const base = '/FlightRecord'
const urls = {
  summary: base + '/Summary',
  recordList: base,
  recordDetail: base + '/',
  imgList: base + '/Image',
  imgDetail: base + '/Image/',
  FRFileList: base + '/FRFile',
  FRFile: base + '/FRFile/',
  pathList: base + '/Path/',
  uploadFlightRecord : base + '/UploadFlightRecord',
  UploadFlightRecordFile: base + '/UploadFlightRecordFile',
  planFRFileTypeList: base + '/FRFileType',
  planFRFileList: base + '/Plan/Flight/FRFile',
  relation: base + '/Plan/Flight/FRFile/Relation',
  activeAIProcess: '/InspectionManage/AIAnalysis',
  delete: base + '/Plan/Flight/FRFile'
}
export default {
  summary: {
    url: urls.summary,
    name: '取得飛行紀錄摘要',
    get: (params) => httpReq.get(urls.summary, params)
  },
  recordList: {
    url: urls.recordList,
    name: '取得飛行記錄清單',
    get: (params) => httpReq.get(urls.recordList, params)
  },
  recordDetail: {
    url: urls.recordDetail,
    name: '取得飛行記錄Detail',
    get: (params) => httpReq.get(urls.recordDetail, params)
  },
  imgList: {
    url: urls.imgList,
    name: '取得圖片記錄清單',
    get: (params) => httpReq.get(urls.imgList, params)
  },
  imgDetail: {
    url: urls.imgDetail,
    name: '取得圖片記錄資訊',
    get: (params) => httpReq.get(urls.imgDetail, params)
  },
  FRFileList: {
    url: urls.FRFileList,
    name: '取得飛行紀錄檔案清單',
    get: (params) => httpReq.get(urls.FRFileList, params)
  },
  FRFile: {
    url: urls.FRFile,
    name: '取得飛行紀錄圖片/影片',
    get: (params) => httpReq.get(urls.FRFile + params)
  },
  pathList: {
    url: urls.pathList,
    name: '取得飛行紀錄路線清單',
    get: (params) => httpReq.get(urls.pathList + params)
  },
  uploadFlightRecord: {
    url: urls.uploadFlightRecord,
    name: '上傳飛行記錄檔',
    post: (data, config = {}) => httpReq.post(urls.uploadFlightRecord, data, config)
  },
  UploadFlightRecordFile: {
    url: urls.UploadFlightRecordFile,
    name: '上傳飛行記錄圖片/影像檔',
    post: (data, config = {}) => httpReq.post(urls.UploadFlightRecordFile, data, config)
  },
  planFRFileTypeList: {
    url: urls.planFRFileTypeList,
    name: '撈取任務檔案類型清單(可見光+熱顯)',
    get: (params) => httpReq.get(urls.planFRFileTypeList, params)
  },
  planFRFileList: {
    url: urls.planFRFileList,
    name: '撈取任務檔案清單(可見光+熱顯)',
    get: (params) => httpReq.get(urls.planFRFileList, params)
  },
  relation: {
    url: urls.relation,
    name: '建立可見光與熱顯與溫度的對應關係',
    put: (data = {}) => httpReq.put(urls.relation, data)
  },
  activeAIProcess: {
    url: urls.activeAIProcess,
    name: '觸發AI分析',
    post: (data = {}) => httpReq.post(urls.activeAIProcess, data)
  },
  delete: {
    url: urls.delete,
    name: '刪除飛行紀錄圖片(熱顯or可見光)清單',
    delete: (fileID) => httpReq.delete(`${urls.delete}/${fileID}`)
  },
}
