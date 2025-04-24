<template>
  <div class="flex">
    <ol class="flex">
      <li
        v-for="(item, i) in breadcrumbList"
        :key="i"
        class="text-font20 text-white py-[6px] px-4"
        :class="item.meta.type === 'main' ? 'bg-primary-60 rounded-s-lg' : 'bg-primary-70 rounded-e-lg' ">
        <router-link :to="item.path">{{ item.meta.title }}</router-link>
      </li>
    </ol>
  </div>
</template>
<script setup>
import { ref, watch, onMounted } from 'vue'
const route = useRoute()
const router = useRouter()
const breadcrumbList = ref([])
const isHome = () => {
  return route.name === '無人機智慧巡檢服務後台'
}
const getBreadcrumbs = () => {
  let matched = route.matched
  if (!isHome(matched[0])) {
    matched = [{ path: '/', meta: { title: '無人機智慧巡檢服務後台', type: 'main' }}].concat(matched)
  }
  const newMatched = matched.filter(item => {
    if (item.name !== 'layout') {
      return true
    }
  })
  breadcrumbList.value = newMatched
}
watch(route, () => {
  getBreadcrumbs()
})
onMounted(() => {
  getBreadcrumbs()
})
</script>
