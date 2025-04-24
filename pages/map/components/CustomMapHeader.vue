<template>
  <div
    class="flex w-[75%] absolute top-6 right-[2%] z-onMapFirst"
    :class="!componentsState.mapHeader ? 'justify-end' : 'justify-between'"
  >
    <div
      v-if="componentsState.mapHeader"
      class="flex w-[93%] justify-between"
    >
      <label class="title-input" for="projectName">
        <p>專案名稱</p>
        <input
          id="projectName"
          v-model="inspectionInformation.name"
          type="text"
          name="projectName"
          disabled
        >
      </label>
      <label class="title-input" for="clientName">
        <p>客戶名稱</p>
        <input
          id="clientName"
          v-model="inspectionInformation.customer"
          type="text"
          name="clientName"
          disabled
        >
      </label>
      <label class="title-input" for="inspectionType">
        <p>巡檢類型</p>
        <input
          id="inspectionType"
          v-model="inspectionInformation.type"
          type="text"
          name="inspectionType"
          disabled
        >
      </label>
    </div>
    <button
      class="icon-close close-btn"
      @click="backListPage"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useComponentsState } from '@/stores/mapState'

// 使用 Emit 傳出去
const emit = defineEmits(['openDialog'])

// 以下是正在優化的 Store
const componentsState = useComponentsState()

// Props 傳進來的資料
const props = defineProps({
  inspection: {
    type: Object,
    required: true,
  },
})
// 資料存放處
const inspectionInformation = ref({})

// (暫用) 判斷資料是否為有效資料
const getInspectionInformation = () => {
  if (props.inspection !== undefined) {
    inspectionInformation.value = props.inspection
  } else {
    console.log('資料未傳入')
  }
}
getInspectionInformation()

// "回到 List 頁面"與"刪除"
const backListPage = () => {
  emit('openDialog')
}


</script>
