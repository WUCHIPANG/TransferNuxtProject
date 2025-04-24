import httpReq from '~/utils/request'

export default {
  menu: {
    list: {
      url: `/system/menu/list`,
      name: '獲取選單',
      get: () => httpReq.get('/system/menu/list')
    },
  },
  plan: {
    upload: {
      url: `/system/plan/upload`,
      name: '上傳檔案',
      post: (data, config) => httpReq.post('/system/plan/upload', data, config),
    },
  },
  imgExtention: {
    url: `/System/Env/ImgExtensions`,
    name: '撈取圖檔副檔名限制清單',
    get: () => httpReq.get('/System/Env/ImgExtensions')
  },
}
