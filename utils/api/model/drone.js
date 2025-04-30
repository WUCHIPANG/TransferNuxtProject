import httpReq from '~/utils/request'

const base = '/Drone'
const urls = {
  list: base,
  detail: base,
}

export default {
  list: {
    url: urls.list,
    name: '取得無人機清單',
    get: (params) => httpReq.get(urls.list, params)
  },
  detail: {
    url: urls.detail,
    name: '取得單筆無人機載具',
    get: (droneID) => httpReq.get(`${urls.detail}/${droneID}`)
  },
}
