/**
 * @description 自動import導入所有 api 模塊
 */
const files = import.meta.glob('../utils/api/model/*.js', { eager: true })
const modules = {}
for (const key in files) {
  const name = key.replace(/(.*\/|\.js)/g, '')
  modules[name] = files[key].default
}

export const useApi = () => {
  return modules
}
