import httpReq from '~/utils/request'

export default {
  list: {
    url: `/Role`,
    name: '撈取角色清單',
    get: (params) => httpReq.get('/Role', params)
  },
  detail: {
    url: `/Role`,
    name: '撈取角色資料',
    get: (roleID) => httpReq.get(`/Role/${roleID}`)
  },
  droneOperatorList: {
    url: `/Role/DroneOperator`,
    name: '撈取飛手資訊',
    get: () => httpReq.get('/Role/DroneOperator')
  },
}
