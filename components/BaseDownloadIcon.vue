<template>
  <div
    class="group hoverBtn relative rounded mx-auto p-1 m-1  flex items-center justify-center cursor-pointer hover:bg-activeBG"
    @mouseover="showText = true"
    @mouseleave="showText = false"
  >
    <span class="text-primary-70" :class="showText ? ' text-sm' : 'icon-download '">{{ showText ? props.text : '' }}</span>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const showText = ref(false)
const props = defineProps({
  text: {
    type: String,
    default: '',
  },
})
</script>
