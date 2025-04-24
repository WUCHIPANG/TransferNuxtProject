<template>
  <div class="w-[40vw]">
    <div class="mt-3">
      <div class="input-type w-full cursor-pointer relative" :class="uploadStatus===''||uploadStatus==='success'?'input-shadow':'input-error'" @click="$refs.file.click()">
        <div class="bg-primary-90 rounded-lg h-full absolute top-0 left-0 z-0" :style="{ width: percent + '%' }" />
        <div class="flex z-10 absolute top-0 left-3 w-full ">
          <input
            type="button"
            class="p-2 rounded text-white text-font16Regular h-8 mt-3 mx-2 cursor-pointer"
            :class="uploadStatus===''||uploadStatus==='success'?'bg-primary-50':'bg-danger'"
            :value="percent===0?'選擇': percent > 0 && percent < 100 ? '上傳中' :(uploadStatus!=='success'&&uploadStatus!=='') ?'上傳檔案失敗':'完成' "
          >
          <span class="text-font16Regular mt-5" :class="percent > 0 ? 'text-active' : 'text-neutral-70'">{{ inputText }}</span>
          <input
            id="file"
            ref="file"
            type="file"
            autocomplete="file"
            name="file"
            class="form-input text-font20Regular hidden"
            @change="handlerUpload"
            @click="uploadRe"
          >
          <span v-if="uploadStatus===''|| uploadStatus==='success'" class=" text-font20 text-neutral-20 mt-5 absolute right-6">{{ percent }}%</span>
          <span v-else class="text-font20 text-danger mt-5 absolute right-6 icon-retry" @click="uploadRe" />
          <!-- multiple -->
        </div>
      </div>
    </div>
    <ApiMsgDialog />
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, defineProps, defineEmits } from 'vue'
import ApiMsgDialog from '@/components/BaseApiMsg.vue'
import { useVModel } from '@vueuse/core'

const emit = defineEmits(['updateStatus'])
const props = defineProps({
  modelValue: Boolean,
  planId: {
    type: String,
    default: '',
  },
  planFlightId: {
    type: String,
    default: '',
  },
  droneBrand: {
    type: Number,
    default: 0,
  },
})
const { proxy } = getCurrentInstance()
const propPlanID = useVModel(props, 'planId')
const porpFlightID = useVModel(props, 'planFlightId')
const propDroneBrand = useVModel(props, 'droneBrand')

// ---- 上傳檔案 ----
const inputText = ref('選擇檔案位置')
const percent = ref(0)
const uploadFile = ref()
const uploadStatus = ref('')
// Axios Config
const config = {
  headers: { 'Content-Type': 'multipart/form-data' },
  onUploadProgress: (progressEvent) => {
    const { loaded, total } = progressEvent
    let processStatus = Math.floor((loaded * 100) / total)
    percent.value = processStatus
  },
}
const handlerUpload = async(e) => {
  percent.value = 0
  inputText.value = '選擇檔案位置'
  const file = e.target.files[0]
  const reader = new FileReader()
  if (file !== undefined) {
    uploadFile.value = file
    inputText.value = file.name
    reader.readAsText(file)
    await callUpload()
  }
}
const callUpload = async() => {
  try {
    let data = {
      planID: propPlanID.value,
      planFlightID: porpFlightID.value,
      droneBrand: propDroneBrand.value,
      file: uploadFile.value,
    }
    const resUpload = await proxy.$API.flightRecord.uploadFlightRecord.post(data, config)
    if (resUpload.status === 'success') {
      uploadStatus.value = resUpload.status
      emit('updateStatus', resUpload.status)
    } else {
      uploadStatus.value = resUpload.status
    }
  } catch (err) {
    // 上傳失敗時的動作
    console.log('檔案上傳發生錯誤： ', err)
    uploadStatus.value = 'error'
  }
}
// 再次點擊上傳
const uploadRe = () => {
  percent.value = 0
  inputText.value = '選擇檔案位置'
  uploadStatus.value = ''
}

</script>
