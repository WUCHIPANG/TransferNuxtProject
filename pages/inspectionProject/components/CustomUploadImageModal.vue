<template>
  <div>
    <TransitionRoot appear :show="isOpen" as="template">
      <Dialog as="div" class="relative z-onMapFirst">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-modalBG backdrop-blur" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex items-center justify-center min-h-full p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="relative p-6 overflow-hidden text-left align-middle transform bg-white border border-devider rounded-3xl ransition-all ">
                <span class="absolute cursor-pointer icon-close top-4 right-4" @click="closeModal" />
                <DialogTitle as="h3" class="text-font16">
                  <div class="flex text-center justify-center items-center">
                    <div v-if="failList.length===0" class="rounded-full p-2 bg-success text-white">共 {{ countSuccess.length }} 張</div>
                    <div v-else class="flex items-center">
                      <button
                        class="p-1 hover:bg-activeBGHover"
                        :class="orderNo===0 ?'text-neutral-70':'cursor-pointer'"
                        :disabled="orderNo===0"
                        @click="previous"
                      >
                        <span class="icon-arrow-left" />
                      </button>
                      <div class="rounded-full p-2 mx-2 bg-[#FEF1F1] text-danger border border-danger"><span class="icon-warning-report mr-3" /> {{ orderNo+1 }} - {{ failList.length }}</div>
                      <button
                        class="p-1 hover:bg-activeBGHover"
                        :class="(orderNo+1)===failList.length ?'text-neutral-70':'cursor-pointer'"
                        :disabled="(orderNo+1)===failList.length"
                        @click="next"
                      >
                        <span class="icon-arrow-right" />
                      </button>
                    </div>
                  </div>
                </DialogTitle>
                <div class="mt-6">
                  <div class="text-font20Regular">
                    <DropZone :plan-id="propPlanID" :plan-flight-id="propFlightID" @uploadFilesInfo="uploadInfo" />
                  </div>
                </div>

                <div class="flex justify-around mt-6">
                  <button
                    class="w-[49%] h-[52px] rounded-xl text-font20 flex justify-center items-center cursor-pointer text-neutral-50 hover:bg-neutral-98"
                    @click="closeModal"
                  >
                    取消
                  </button>
                  <button
                    class="w-[49%] h-[52px] rounded-xl text-font20 flex justify-center items-center cursor-pointer"
                    :class="isDisabledConfirm? ' text-neutral-50 bg-neutral-90':'text-active bg-activeBG hover:bg-activeBGHover'"
                    :disabled="isDisabledConfirm"
                    @click="openConfirmDialog"
                  >
                    執行 AI 分析
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
    <!-- 執行AI分析確認視窗 -->
    <CheckDialog
      v-model="checkDialog.isShow"
      class="z-onMapFirst"
    >
      <template #title>{{ checkDialog.msg.title }}</template>
      <template #detail>{{ checkDialog.msg.detail }}</template>
      <template #cancelButtonText>取消</template>
      <template #confirmButton>
        <button class="modal-button text-active bg-activeBG hover:bg-activeBGHover" @click="startAnalyze">確定</button>
      </template>
    </CheckDialog>
  </div>
</template>

<script setup>
import { defineProps, ref, getCurrentInstance, nextTick } from 'vue'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'
import { useVModel } from '@vueuse/core'
import DropZone from '@/views/inspectionProject/components/CustomUploadImage.vue'
import CheckDialog from '@/components/BaseModal.vue'
import { setAlertMessage } from '@/utils/messages.js'

const { proxy } = getCurrentInstance()
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
})
const isOpen = useVModel(props, 'modelValue')
const propPlanID = useVModel(props, 'planId')
const propFlightID = useVModel(props, 'planFlightId')

const isDisabledConfirm = ref(true)
const fileList = ref([])
const countSuccess = ref([])
const failList = ref([])
const uploadInfo = (info) => {
  fileList.value = info.value
  failList.value = []
  if (fileList.value.findIndex(e => e.status !== 'success' && e.status !== null) > -1) { // 改成 !=='success' && !=='' 判斷 測試看看
    fileList.value.forEach((e, idx) => {
      if (e.status === 'fail' || e.status === 'error') {
        e.idx = `file-${idx}`
        failList.value.push(e)
      }
    })

    nextTick(() => {
      // 滾動到第一個上傳失敗的檔案
      document.querySelector(`.file-view > #${failList.value[orderNo.value].idx}`).scrollIntoView()
    })
  }
  // 檔案列表中的檔案皆上傳成功才可以執行AI分析
  countSuccess.value = fileList.value.filter(e => e.status === 'success')
  if (fileList.value.length > 0 && fileList.value.length === countSuccess.value.length) {
    isDisabledConfirm.value = false
  } else {
    isDisabledConfirm.value = true
  }
}

// ---- Tigger AI analyze---
// 再次確認用彈窗
const checkDialog = ref({
  isShow: false,
  msg: {
    title: '確認執行？',
    detail: '開始執行 AI 分析？',
  },
})
const openConfirmDialog = () => {
  checkDialog.value.isShow = true
}
const startAnalyze = async() => {
  try {
    const payload = {
      planID: propPlanID.value,
      planFlightID: propFlightID.value,
    }
    const res = await proxy.$API.flightRecord.activeAIProcess.post(payload)
    if (res.status === 'success') {
      setAlertMessage('success', 'AI 分析中…', false)
      checkDialog.value.isShow = false
      // 更新任務執行狀態
      updatePlanMissionStatus()
      closeModal()
    }
  } catch (err) {
    console.log('執行AI分析發生問題： ', err)
    isDisabledConfirm.value = false
  }
}
// ---- Tigger AI analyze---
// ---- 更新任務執行狀態 ----
const updatePlanMissionStatus = async() => {
  try {
    const res = await proxy.$API.plan.flight.status.put(propFlightID.value)
  } catch (err) {
    console.log('更新飛行任務執行狀態發生問題：', err)
  }
}
// ---- 更新任務執行狀態 ----
// ---- 檢視上傳失敗的檔案 ---
const orderNo = ref(0)
const previous = () => {
  if (orderNo.value > 0) {
    orderNo.value -= 1
    nextTick(() => {
      document.querySelector(`.file-view > #${failList.value[orderNo.value].idx}`).scrollIntoView()
    })
  }
}
const next = () => {
  if (failList.value.length > 1 && orderNo.value < failList.value.length) {
    orderNo.value += 1
    nextTick(() => {
      document.querySelector(`.file-view > #${failList.value[orderNo.value].idx}`).scrollIntoView()
    })
  }
}
// ---- 檢視上傳失敗的檔案 ---
// 關閉上傳視窗
const closeModal = () => {
  fileList.value = []
  countSuccess.value = []
  failList.value = []
  orderNo.value = 0
  isOpen.value = false
}

</script>

