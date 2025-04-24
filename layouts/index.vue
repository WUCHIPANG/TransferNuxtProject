<template>
  <template v-if="layout === 'edit'">
    <main class="min-h-screen w-full bg-white flex-1 flex">
      <div class="w-full">
        <header class="w-full p-4 h-[98px] grid place-items-center text-font32 edit-header">
          <div class="w-[95%] flex  mx-auto justify-center relative">
            <BackList class="mt-2 absolute left-4 " @click="backList" />
            {{ route.meta.title }}
            <!-- <span class="icon-setting text-2xl mt-1 cursor-pointer" /> -->
          </div>
        </header>

        <div v-if="route.meta.transition==='slide-in-right'" class="w-full p-4 h-[85%]">
          <router-view v-slot="{ Component, route }">
            <TransitionRoot
              appear
              :show="showSlide"
              as="template"
              enter="duration-300 ease-out"
              enter-from="translate-x-full"
              enter-to="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leave-from="translate-x-0"
              leave-to="translate-x-full"
            >
              <component :is="Component" :key="route.path" />
            </TransitionRoot>
          </router-view>
        </div>
        <div v-else class="w-full p-4 h-[85%]">
          <router-view />
        </div>
      </div>
    </main>
  </template>
  <template v-else-if="layout==='default'">
    <main class="min-h-screen w-full bg-surface-1 flex">
      <div class="flex w-80 py-10 px-14 ">
        <Menu />
      </div>
      <div class="w-full">
        <header class="w-full h-[98px] p-4 grid place-items-center text-font32  relative">
          <div class=" absolute left-0 top-1/2 transform -translate-y-1/2 ">
            <!-- <Breadcrumb class="hidden 2xl:block" /> -->
          </div>
          {{ route.meta.title }}
        </header>
        <div class="w-full p-4 h-[85%]">
          <router-view />
        </div>
      </div>
    </main>
  </template>
  <template v-else>
    <router-view />
  </template>
</template>

<script setup>
import { ref, watch, onMounted, getCurrentInstance } from 'vue'
import { TransitionRoot } from '@headlessui/vue'
import Menu from '../components/TheMenu.vue'
import Breadcrumb from '../components/TheBradcrumb.vue'
import BackList from '../components/BaseBackList.vue'
const route = useRoute()
const router = useRouter()
const { proxy } = getCurrentInstance()
const showSlide = ref(false)

const layout = ref('')
watch(() => route.name, () => {
  // 當路由名稱改變的時候，取 meta 裡的layout來判斷要套用哪個版型
  layout.value = route.meta.layout
  if (route.meta.transition === 'slide-in-right') {
    showSlide.value = true
  }
})
onMounted(() => {
  // 當畫面重新整理的時候，再去取一次meta裡的layout 來判斷版型
  layout.value = route.meta.layout
  if (route.meta.transition === 'slide-in-right') {
    showSlide.value = true
  }
})
const backList = () => {
  if (proxy.$TOOL.session.get('PAGE_TYPE') !== null) {
    proxy.$TOOL.session.remove('PAGE_TYPE')
  }
  if (route.meta.transition === 'slide-in-right') {
    showSlide.value = false
  }
  router.back()
}
</script>
