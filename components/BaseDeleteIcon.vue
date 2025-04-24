<template>
  <div
    class="group hoverBtn relative rounded-full mx-auto h-10 w-10 flex items-center justify-center cursor-pointer hover:bg-dangerBG"
    @mouseover="showText = true"
    @mouseleave="showText = false"
  >
    <span class="text-danger" :class="showText ? ' text-sm' : 'icon-delete '">{{ showText ? '刪除' : '' }}</span>
    <!-- <div
      class="tooltip group-hover:opacity-100 z-10 w-12 transition-opacity absolute left-1/2
    -translate-x-1/2 opacity-0 m-4 mx-auto"
    >
      <div class="z-10 flex justify-center bg-[#121212] py-1 text-sm text-gray-100 rounded-md relative">
        刪除
        <div class="triangle absolute -top-[4px]" />
      </div>
    </div> -->
  </div>
</template>
<script setup>
import { ref } from 'vue'
const showText = ref(false)
</script>
