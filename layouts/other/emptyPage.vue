<template>
  <div>
    <h1>empty page</h1>
    <button class="simple-button" @click="goLoginPage">goLoginPage</button>
    <router-view />
  </div>
</template>

<script setup>
import { getCurrentInstance } from 'vue'

const router = useRouter()
const { proxy } = getCurrentInstance()

const goLoginPage = () => {
  proxy.$TOOL.data.clear()
  proxy.$TOOL.cookie.remove('TOKEN')
  router.replace({ path: '/login' })
}
</script>
