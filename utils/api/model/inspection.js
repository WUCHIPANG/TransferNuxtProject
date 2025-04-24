import config from '@/config'
import httpReq from '@/utils/request'

export default {
  // 取得AI巡檢結果列表
  list: {
    url: `${config.API_URL}/Inspection`,
    name: '取得AI巡檢結果列表',
    get: async function(params) {
      return await httpReq.get(this.url, params)
    },
  },
  image: {
    info: {
      url: `${config.API_URL}/Inspection/ImageInfo`,
      name: 'AI巡檢結果檢視-取得單筆異常圖片詳細資訊',
      get: async function(id) {
        return await httpReq.get(`${this.url}/${id}`)
      },
    },
  },
  infoList: {
    url: `${config.API_URL}/Inspection/ImageInfo/List`,
    name: '取得巡檢結果資訊',
    get: async function(params) {
      return await httpReq.get(`${this.url}/${params.planFlightID}`, params)
    },
  },
  // 取得巡檢結果檢視、任務、案場資訊
  info: {
    url: `${config.API_URL}/Inspection/Info`,
    name: '取得巡檢相關資訊',
    get: async function(planID, params) {
      return await httpReq.get(`${this.url}/${planID}`, params)
    },
  },
  // 取得巡檢結果檢視、路線、異常點未
  result: {
    url: `${config.API_URL}/Inspection/ImageAndPath`,
    name: '取得巡檢結果資訊',
    get: async function(planID) {
      return await httpReq.get(`${this.url}/${planID}`)
    },
  },
}
