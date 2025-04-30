import httpReq from '~/utils/request'

const base = '/Role'
const urls = {
  list: base,
  detail: base + '/',
  droneOperatorList: base + '/DroneOperator'
}
export default {
  list: {
    url: urls.list,
    name: '撈取角色清單',
    get: (params) => httpReq.get(urls.list, params)
  },
  detail: {
    url: urls.detail,
    name: '撈取角色資料',
    get: (roleID) => httpReq.get(`${urls.detail}/${roleID}`)
  },
  droneOperatorList: {
    url: urls.droneOperatorList,
    name: '撈取飛手資訊',
    get: () => httpReq.get(urls.droneOperatorList)
  },
}
