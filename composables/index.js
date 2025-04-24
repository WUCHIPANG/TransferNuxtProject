export const useConfig = () => {
  return {
    APP_NAME: import.meta.env.VITE_APP_TITLE, // 標題
    APP_NAME_SUB: '', // 次標題，無則留空
    DASHBOARD_URL: '/dashboard', // 首頁地址
    APP_VER: '1.1.0', // 版本號
    // 接口地址
    API_URL: import.meta.env.VITE_NODE_ENV === 'development' && import.meta.env.VITE_APP_PROXY === 'true' ? '/api' : import.meta.env.VITE_APP_API_BASE_URL, 
    // Mock api 接口地址 等專案api 都完成以後再看要不要移除
    MOCK_API_URL: import.meta.env.VITE_NODE_ENV === 'development' && import.meta.env.VITE_APP_PROXY === 'true' ? '/mockApi' : import.meta.env.VITE_APP_MOCK_API_BASE_URL,

    // 請求超時
    TIMEOUT: 10000,

    // TokenName
    TOKEN_NAME: 'Authorization',

    // Token前綴，注意最後有個空格，如不需要需設置空字符串
    TOKEN_PREFIX: 'Bearer ',

    // 追加其他頭
    HEADERS: {},

    // 請求是否開啟緩存
    REQUEST_CACHE: false,

    // 是否加密localStorage, 為空不加密，可填寫AES(模式ECB,移位Pkcs7)加密
    LS_ENCRYPTION: '',

    // localStorageAES加密秘鑰，位數建議填寫8的倍數
    // eslint-disable-next-line camelcase
    LS_ENCRYPTION_key: '2XNN4K8LC0ELVWN4',
  }
}