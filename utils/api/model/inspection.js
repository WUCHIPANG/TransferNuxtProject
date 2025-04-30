import httpReq from '~/utils/request'

const base = '/Inspection'
const urls = {
  list: base,
  image: base + '/ImageInfo',
  infoList: base + '/ImageInfo/List',
  info: base + '/Info',
  result: base + '/ImageAndPath',
}
export default {
  // 取得AI巡檢結果列表
  list: {
    url: urls.list,
    name: '取得AI巡檢結果列表',
    get: (params) => httpReq.get(urls.list, params)
  },
  image: {
    info: {
      url: urls.image,
      name: 'AI巡檢結果檢視-取得單筆異常圖片詳細資訊',
      get: (id) => httpReq.get(`${urls.image}/${id}`)
    },
  },
  infoList: {
    url: urls.infoList,
    name: '取得巡檢結果資訊',
    get: (params) => httpReq.get(`${urls.infoList}/${params.planFlightID}`, params)
  },
  // 取得巡檢結果檢視、任務、案場資訊
  info: {
    url: urls.info,
    name: '取得巡檢相關資訊',
    get: (planID, params) => httpReq.get(`${urls.info}/${planID}`, params)
  },
  // 取得巡檢結果檢視、路線、異常點未
  result: {
    url: urls.result,
    name: '取得巡檢結果資訊',
    get: (planID) => httpReq.get(`${urls.result}/${planID}`)
  },
}
