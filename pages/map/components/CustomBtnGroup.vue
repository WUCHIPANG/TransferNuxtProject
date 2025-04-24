<template>
  <div class="w-[181px] absolute bottom-14 right-[2%] z-onMapFirst">
    <button
      v-if="componentsState.uploadDataBtn"
      class="w-full column-btn-lg bg-[#029F96] mb-3"
      @click="importFlightData"
    >
      <p class="icon-route btn-margin">
        {{ props.flightRecord.recordCount === undefined ? '匯入資訊' : '重置資訊' }}
      </p>
    </button>
    <button
      v-if="componentsState.uploadPhotoBtn"
      class="w-full column-btn-lg bg-[#0199BA] mb-3"
      @click="importPhoto"
    >
      <p class="icon-add-photo-alternate btn-margin">
        {{ props.flightImages.length === undefined ? '匯入圖片' : '補充圖片' }}
      </p>
    </button>
    <button
      v-if="componentsState.deleteBtn"
      class="w-full column-btn-lg bg-danger"
      @click="deletePlaceOrTask"
    >
      <p class="icon-delete btn-margin">{{ `刪除${pageState.name === 0 ? '案場' : '任務'}` }}</p>
    </button>
  </div>
</template>

<script setup>
import { usePageState, useComponentsState } from '@/stores/mapState'

const props = defineProps({
  flightRecord: {
    type: Object,
    required: true,
    default: () => {},
  },
  flightImages: {
    type: Object,
    required: true,
    default: () => {},
  },
})

// 使用 Store
const pageState = usePageState()
const componentsState = useComponentsState()

// 向父層傳輸
const emit = defineEmits(['deletePlaceOrTask', 'openImportFlightRecord', 'openImportPhoto'])

// 匯入圖片
const importPhoto = () => {
  emit('openImportPhoto')
}

// 匯入資料
const importFlightData = () => {
  emit('openImportFlightRecord')
}

// 刪除案場或任務
const deletePlaceOrTask = () => {
  emit('deletePlaceOrTask')
}

</script>
