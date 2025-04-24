import config from '@/config'
import httpReq from '@/utils/request'

export default {
  list: {
    url: `${config.API_URL}/Drone`,
    name: '取得無人機清單',
    get: async function(params) {
      return await httpReq.get(this.url, params)
    },
  },
  detail: {
    url: `${config.API_URL}/Drone`,
    name: '取得單筆無人機載具',
    get: async function(droneID) {
      return await httpReq.get(`${this.url}/${droneID}`)
    },
  },
}
