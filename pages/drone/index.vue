<template>
  {{ pageDetail }}
</template>

<script setup>
import { ref } from 'vue'
const route = useRoute()

const pageDetail = ref('')
pageDetail.value = route.meta.title
</script>
