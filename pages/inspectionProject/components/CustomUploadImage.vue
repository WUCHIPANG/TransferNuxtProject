<template>
  <div class="flex w-[70vw] h-[70vh]">
    <ul class="w-[25%] flex list-none flex-col flex-wrap ">
      <li
        v-for="tab in typeTabs"
        :key="tab.id"
        class="relative flex list-none border items-left text-neutral-20 text-font20Regular menu-item-border"
        :class="activeTab === tab.id ? 'bg-surface-3 border-l-8 border-l-primary-50': ''"
      >
        <div
          class="w-fit"
          :class="tab.disabled ? 'text-neutral-70':'cursor-pointer' "
          :disabled="tab.disabled"
          @click="changeActive(tab.id)"
        >
          <span class="mr-4" :class="tab.icon" />{{ tab.type }}
        </div>
      </li>
    </ul>
    <DropZone
      v-slot="{ dropZoneActive }"
      class="drop-zone w-[75%] h-full border m-auto overflow-y-auto transition duration-300"
      :class="files.length > 0 ?'':'flex flex-col items-center justify-center'"
      @files-dropped="addFiles"
    >
      <label for="file-input">
        <input
          id="file-input"
          type="file"
          multiple
          class="hidden w-full form-input text-font20Regular"
          @change="onInputChange"
        >
        <div v-if="files.length=== 0" class="flex items-baseline">
          <span v-if="dropZoneActive">
            <span class="text-neutral-70">請將檔案拖放至此區域</span>
          </span>
          <span v-else>
            <span>
              <span class="h-8 p-2 mx-2 mt-3 text-white rounded cursor-pointer bg-primary-50 text-font16Regular">選擇</span>
              <span class="text-neutral-70 ">選擇 檔案位置 或 整批拖曳至選區</span>
            </span>
          </span>
        </div>
      </label>

      <!-- file list -->
      <div v-if="files.length" class="file-view grid grid-cols-3 gap-2">
        <div v-for="(file,index) in files" :id="'file-'+index" :key="file.tmpID">
          <div v-if="file.fileUUID===''" class="w-[245px] h-[200px] bg-surface-1 m-4 border rounded-lg relative">
            <div v-if="file.status===null" class="absolute top-0 left-0 z-0 h-full rounded-lg bg-active" :style="{ width: percent + '%' }" />
            <div v-if="file.status==='fail'||file.status==='error'" class="absolute top-0 left-0 z-0 w-full h-full rounded-lg bg-danger" />
            <div v-if="file.status===null" class="absolute z-10 flex items-center justify-center w-full h-full">
              <span class="absolute rounded-full icon-clear text-active top-2 right-2 hover:shadow-md" @click="removeFile(file)" />
              <span class="absolute font-bold text-white text-7xl">{{ percent }}%</span>
            </div>
            <!-- upload fail or file type error -->
            <div v-if="file.status==='fail'||file.status==='error'" class="absolute z-10 flex flex-col items-center justify-center w-full h-full">
              <span class="font-bold text-white text-font24 ">{{ file.status ==='fail'?'上傳失敗':'檔案格式有誤' }}</span>
              <div class="flex">
                <span v-if="file.status==='fail'" class="m-5 font-bold text-white cursor-pointer icon-retry" @click="handlerRetry(file)" />
                <span class="m-5 font-bold text-white cursor-pointer icon-delete" @click="removeFile(file)" />
              </div>
            </div>
            <div class="w-[245px] text-white p-4 absolute bottom-0 truncate">{{ file.fileName }}</div>
          </div>
          <!-- upload success -->
          <div v-else class="w-[245px] h-50 m-4 rounded-lg overflow-hidden text-center border">
            <!-- Vedio file -->
            <div v-if="activeTab===2" class="w-[245px] h-[200px] flex items-center justify-center pt-10"><span class="text-6xl icon-video-camera-back text-success" /></div>
            <!-- Image file -->
            <img
              v-else
              class="w-[245px] h-[160px] object-fill"
              :src="file.url"
              :alt="file.fileName"
            >
            <div class="h-auto p-3">
              <p class="truncate text-font16">
                {{ file.fileName }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </DropZone>
  </div>
</template>

<script setup>
import { ref, watch, getCurrentInstance, defineProps, defineEmits } from 'vue'
import { useVModel } from '@vueuse/core'
import { useComponentsState } from '@/stores/mapState'
import DropZone from '@/views/inspectionProject/components/CustomDropZone.vue'
import { acceptFileTypes } from '@/utils/fileFunction.js'

const emit = defineEmits(['uploadFilesInfo'])
const props = defineProps({
  planId: {
    type: String,
    default: '',
  },
  planFlightId: {
    type: String,
    default: '',
  },
})
const { proxy } = getCurrentInstance()
const componentsState = useComponentsState()
const uploadDataBtnStatus = ref(componentsState.uploadDataBtn)

const propPlanID = useVModel(props, 'planId')
const propFlightID = useVModel(props, 'planFlightId')

// 目前AI 僅能辨視 紅外線檔案 所以只留紅外線tab，activeType 及 uploadType 預設值也先改為 3
// const typeTabs = ref([{ id: 1, type: '匯入可見光圖片', icon: 'icon-add-photo-alternate', disabled: false }, { id: 2, type: '匯入影片檔', icon: 'icon-video-camera-back', disabled: false }, { id: 3, type: '匯入紅外線圖片', icon: 'icon-image-infrared', disabled: false }, { id: 4, type: '匯入混合圖片', icon: 'icon-image-mixed', disabled: false }])
const typeTabs = ref([{ id: 3, type: '匯入紅外線圖片', icon: 'icon-image-infrared', disabled: false }])
const activeTab = ref(3)
const uploadType = ref(3)
const percent = ref(0)
const files = ref([])

const changeActive = (typeID) => {
  let targetTab = typeTabs.value.find(e => e.id === typeID)
  if (targetTab.disabled === false) {
    activeTab.value = typeID
    uploadType.value = typeID
    // 變更上傳類型的時候，檔案清單需清空重選
    files.value = []
  }
}

// ---- file list manage ----
const onInputChange = (e) => {
  addFiles(e.target.files)
  e.target.value = null
}
// 新增檔案
const addFiles = (newFiles) => {
  let newUploadableFiles = [...newFiles]
    .map((file) => new UploadableFile(file))
    .filter((file) => !fileExists(file.tmpID))
  newUploadableFiles.forEach(item => {
    let checkRes = fileTypeCheck(item)
    item.status = !checkRes ? 'error' : null
  })
  files.value = files.value.concat(newUploadableFiles)
  // 新增檔案後，直接上傳
  files.value.forEach(async(item) => {
    if (item.status === null) {
      let uploadResult = await handlerUpload(item)
      // 更新檔案的上傳結果
      item.status = uploadResult.status
      item.fileUUID = uploadResult.uuid
      item.url = import.meta.env.VITE_APP_IMG_BASE_URL + item.fileUUID
    }
  })
}
// 檢查檔案是否有重複
const fileExists = (otherId) => {
  return files.value.some(({ tmpID }) => tmpID === otherId)
}
// 檢查檔案格式
const fileTypeCheck = (file) => {
  const acceptType = acceptFileTypes(uploadType.value)
  const acceptIncludes = acceptType.includes(file.file.type)
  return acceptIncludes
}
// 移除檔案
const removeFile = (file) => {
  const index = files.value.indexOf(file)

  if (index > -1) files.value.splice(index, 1)
}

class UploadableFile {
  constructor(file) {
    this.file = file
    this.fileName = file.name
    this.fileUUID = ''
    this.tmpID = `${file.name}-${file.size}-${file.lastModified}-${file.type}`
    this.url = null
    this.status = null // 上傳成功：success | 上傳失敗：fail | 檔案檢核不通過：error
  }
}
watch(files, () => {
  let countSuccess = files.value.filter(e => e.status === 'success')
  // 如果檔案列表有還沒成功上傳的檔案，就不能切換檔案上傳類型
  if (files.value.length > 0 && countSuccess.length !== files.value.length) {
    typeTabs.value.forEach((item) => {
      if (item.id !== activeTab.value) {
        item.disabled = true
      }
    })
  } else if (files.value.length === 0 || files.value.length > 0 && files.value.length === countSuccess.length) {
    // 檔案列表沒有檔案或是所有檔案都上傳完成，則可以切換上傳的檔案類型
    typeTabs.value.forEach((item) => {
      item.disabled = false
    })
  }
  emit('uploadFilesInfo', files)
}, { deep: true })
// ---- file list manage ----

// ---- file upload -----
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
  const file = e.file
  const reader = new FileReader()
  if (file !== undefined) {
    reader.readAsText(file)
    return await callUpload(file)
  }
}
// 檔案上傳api
const callUpload = async(file) => {
  try {
    const payload = {
      planID: propPlanID.value,
      planFlightID: propFlightID.value,
      fileType: uploadType.value,
      file: file,
    }
    const uploadRes = await proxy.$API.flightRecord.uploadFlightRecordMediaFile.post(payload, config)
    if (uploadRes.status === 'success') {
      // 將百分比數字歸0
      percent.value = 0
      // 如果有檔案上傳成功，就修改 componentsState.uploadDataBtn
      if (!uploadDataBtnStatus.value) {
        componentsState.uploadDataBtn = true
        uploadDataBtnStatus.value = true
      }
      return { status: 'success', uuid: uploadRes.responseData.fileID }
    }
    percent.value = 0
    return { status: 'fail', uuid: '' }
  } catch (err) {
    console.log('上傳飛行紀錄圖片/影像檔發生錯誤：', err)
    percent.value = 0
    return { status: 'fail', uuid: '' }
  }
}
// 重新上傳
const handlerRetry = async(file) => {
  // 先將檔案列表中，要重新上傳的檔案status 改回未上傳(null)
  const index = files.value.indexOf(file)
  if (index > -1) {
    files.value[index].status = null
  }
  let uploadResult = await handlerUpload(files.value[index])
  // 更新檔案列表中，檔案的上傳結果
  files.value[index].status = uploadResult.status
  files.value[index].fileUUID = uploadResult.uuid
  files.value[index].url = import.meta.env.VITE_APP_IMG_BASE_URL + files.value[index].fileUUID
}
// ---- file upload -----

</script>
