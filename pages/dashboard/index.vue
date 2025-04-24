<template>
  <div>
    目前規畫中…
  </div>
  <!-- {{ pageDetail }} -->
</template>

<script setup>
import { ref } from 'vue'
const route = useRoute()

const pageDetail = ref('')
pageDetail.value = route.meta.title
</script>
