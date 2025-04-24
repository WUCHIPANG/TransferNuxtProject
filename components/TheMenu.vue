<template>
  <div class=" w-[232px] bg-white rounded-3xl menu-border relative">
    <div class="flex items-center justify-center w-full h-24">
      <img src="/public/menuLogo.png">
    </div>
    <div class="w-full">
      <div class="max-w-screen-lg mx-auto ">
        <div class="grid max-w-xl mx-auto">
          <div v-for="item in menuList" :key="item.name">
            <details v-if="!item.meta.hidden" ref="details" class="group">
              <summary
                class="relative flex items-center font-medium list-none cursor-pointer text-neutral-20 text-font20Regular group-open:bg-surface-3 group-open:border-l-8 group-open:border-l-primary-50 group-open:duration-300 menu-item-border"
                :class="route.path === item.path ? 'bg-surface-3 border-l-8 border-l-primary-50': ''"
                @click="to(item.path, item.children, item.meta.type)"
              >
                <span :class="item.meta.icon" />
                <span class="ml-3 "> {{ item.meta.title }}</span>
                <span v-if="item.meta.type === 'menu'" class="absolute transition duration-500 group-open:rotate-180 right-3 top-6">
                  <span class="text-xs icon-arrow-down" />
                </span>
              </summary>
              <template v-if="item.meta.type === 'menu'">
                <div class="text-neutral-600 group-open:animate-fadeIn group-open:animate-duration-500 group-open:bg-surface-3">
                  <div class="w-full h-5 menu-item-linear" />
                  <template v-for="subItem in item.children" :key="subItem.name">
                    <ul v-if="!subItem.meta.hidden" class="items-center space-y-3">
                      <li class="menu-sub" :class="selectItem === subItem.path ? 'bg-active text-white' : ''" @click="subTo(subItem.path)">{{ subItem.meta.title }}</li>
                    </ul>
                  </template>
                  <div class="w-full h-5 menu-item-linear-bottom" />
                </div>
              </template>
            </details>
          </div>
        </div>
      </div>
    </div>
    <div class=" absolute bottom-0 flex justify-between items-center w-full h-[72px] bg-surface-2 border-x-4 border-b-4 border-white rounded-b-3xl px-4 py-3">
      <div class=" rounded-full bg-white w-12 h-12 p-0.5">
        <img src="../assets/user.png" class="w-auto h-auto ">
      </div>
      <div class="space-y-2">
        <p class="text-font20">{{ userInfo.name }}</p>
        <p class="text-font14">({{ userInfo.empNumber }})</p>
      </div>
      <span class="text-2xl cursor-pointer icon-logout" @click="logout" />
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
const router = useRouter()
const route = useRoute()
const { proxy } = getCurrentInstance()
const details = ref(null)
const menuList = ref(proxy.$TOOL.data.get('MENU'))
const userInfo = ref(proxy.$TOOL.data.get('USER_INFO'))
const selectItem = ref(null)
// console.log('menuList:', menuList.value)
onMounted(() => {
  // Add the onclick listeners.
  details.value.forEach((targetDetail) => {
    targetDetail.addEventListener('click', () => {
      // Close all the details that are not targetDetail.
      details.value.forEach((detail) => {
        if (detail !== targetDetail) {
          detail.removeAttribute('open')
        }
      })
    })
  })
})
const to = (path, children, type) => {
  if (type !== 'menu') {
    router.push(path)
    selectItem.value = path
  }
}
const subTo = (path) => {
  router.push(path)
  selectItem.value = path
}

const logout = () => {
  router.push('/login')
}
</script>
