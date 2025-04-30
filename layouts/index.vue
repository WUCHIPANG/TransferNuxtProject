<template>
  <div>
    <template v-if="layoutType === 'edit'">
      <!-- edit 版型 -->
      <main class="flex flex-1 w-full min-h-screen bg-white">
        <div class="w-full">
          <header class="w-full p-4 h-[98px] grid place-items-center text-font32 edit-header">
            <div class="w-[95%] flex mx-auto justify-center relative">
              <BackList class="absolute mt-2 left-4" @click="backList" />
              {{ route.meta.title }}
            </div>
          </header>
          <div class="w-full p-4 h-[85%]">
            <slot />
          </div>
        </div>
      </main>
    </template>

    <template v-else-if="layoutType === 'default'">
      <!-- default 版型 -->
      <main class="flex w-full min-h-screen bg-surface-1">
        <div class="flex py-10 w-80 px-14">
          <Menu />
        </div>
        <div class="w-full">
          <header class="w-full h-[98px] p-4 grid place-items-center text-font32 relative">
            <div class="absolute left-0 transform -translate-y-1/2 top-1/2">
              <!-- <Breadcrumb class="hidden 2xl:block" /> -->
            </div>
            {{ route.meta.title }}
          </header>
          <div class="w-full p-4 h-[85%]">
            <slot />
          </div>
        </div>
      </main>
    </template>

    <template v-else>
      <!-- 其他情況，例如沒有 meta.layout -->
      <main class="flex items-center justify-center w-full min-h-screen">
        <div>
          <slot />
        </div>
      </main>
    </template>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import Menu from '~/components/TheMenu.vue'
import BackList from '~/components/BaseBackList.vue'

const route = useRoute()
const router = useRouter()

// 依照 route.meta.layout 自動切版型
const layoutType = computed(() => {
  return route.meta.layout || ''
})

function backList() {
  router.back()
}
console.log('【當前 route meta】', route.meta)
</script>
