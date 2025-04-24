import config from '@/config'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import json from '/mock'

const mock = new MockAdapter(axios)

mock.onGet(`${config.MOCK_API_URL}/system/menu/list`)
  .reply(200, json.menuList)
  .onPost(`${config.MOCK_API_URL}/system/plan/upload`)
  .reply(200, json.planUpload)
  .onGet(`${config.MOCK_API_URL}/plan/list`)
  .reply(200, json.plan)
  .onGet(`${config.MOCK_API_URL}/auth/token`)
  .reply(200, json.token)
  .onGet(`${config.MOCK_API_URL}/Customer`)
  .reply(200, json.customerList)
  .onGet(`${config.MOCK_API_URL}/Customer/MethodData`)
  .reply(200, json.methodDataList)
  .onAny()
  .passThrough()

export default mock
