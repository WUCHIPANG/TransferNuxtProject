const normalizePath = (path) => {
  // Nuxt 3 route path like `/xxx/[id]`，需要標準化
  return path.replace(/:([^/]+)/g, '[$1]').replace(/\/$/, '')
}

const autoFixPathFromComponent = (path, componentPath) => {
  if (!componentPath) return path

  const folders = componentPath.split('/')
  if (folders.length >= 2) {
    const parent = folders[0]
    if (!path.startsWith(`/${parent}`)) {
      // 自動補上缺失的 /父層資料夾
      path = `/${parent}${path}`
    }
  }
  return path
}

/**
 * 根據後端回傳的 menu 補齊 route.meta.layout
 * @param {Array} menuList - 後端回傳的 menu 陣列
 * @param {Router} router - Vue Router 實例 (必須從 setup() 中取得 useRouter())
 */
export function patchRoutesFromMenu(menuList, router) {
  if (!router || !router.getRoutes) {
    console.error('❌ router 無效，請從 setup() 中傳入 useRouter() 回傳值')
    return
  }

  menuList.forEach(item => {
    const originalPath = item.path
    const layout = item.meta?.layout
    const componentPath = item.component

    const fixedPath = autoFixPathFromComponent(originalPath, componentPath)

    const matchedRoute = router.getRoutes().find(r => {
      return normalizePath(r.path) === normalizePath(fixedPath)
    })

    if (matchedRoute) {
      matchedRoute.meta.layout = layout
      matchedRoute.meta.title = item.meta?.title
      matchedRoute.meta.transition = item.meta?.transition
      console.log('✅ 成功補上 layout 給:', matchedRoute.path)
    } else {
      console.warn('❌ 找不到路由:', fixedPath)
    }

    // 遞迴 children
    if (item.children?.length) {
      patchRoutesFromMenu(item.children, router)
    }
  })
}