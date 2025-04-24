<template>
  <div class=" w-10 h-8 mx-auto rounded flex items-center justify-center text-font16 " :class="type==='active'?'bg-active text-white':'bg-neutral-90 text-neutral-50'"><slot /></div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  type: String,
})


</script>
