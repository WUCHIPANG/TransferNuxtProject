<template>
  <div>
    <VPagination
      v-model="page"
      :pages="total"
      active-color="#4D94FF"
      @update:model-value="updateHandler"
    />
  </div>
</template>
<script setup>
import VPagination from '@hennge/vue3-pagination'
import '@hennge/vue3-pagination/dist/vue3-pagination.css'
import { ref, defineEmits, defineProps, computed, watch } from 'vue'
import { useVModel } from '@vueuse/core'
const emit = defineEmits(['pagination'])
const props = defineProps({
  total: {
    type: Number,
    default: 1,
  },
  current: {
    type: Number,
    default: 1,
  },
})

const pageTotal = useVModel(props, 'total')
const total = computed(() => Math.ceil(pageTotal.value / 10))
const currentPage = useVModel(props, 'current')
const page = ref(1)
const updateHandler = () => {
  emit('pagination', page.value)
}
watch(currentPage, () => {
  page.value = currentPage.value
})
</script>
<style>
ul {
  font-size: 16px;
  line-height: 16px;
  font-weight: 500;
}

ul>li>button {
  width: 32px;
  height: 32px;
}

ul {
  @apply space-x-2
}

.Page-active {
  color: white;
}
</style>
