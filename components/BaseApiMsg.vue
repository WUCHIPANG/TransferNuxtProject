<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" class="relative z-highest" @close="closeModal">
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
            <div
              class="relative z-10"
              aria-labelledby="modal-title"
              role="dialog"
              aria-modal="true"
            >
              <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

              <div class="fixed inset-0 z-10 overflow-y-auto">
                <div class="flex min-h-full items-center justify-center p-0 text-center">
                  <div class="relative transform overflow-hidden rounded-lg bg-white p-6 text-left shadow-xl transition-all my-8 w-full max-w-lg">
                    <div class="flex items-start">
                      <div class="mx-0 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                        <svg
                          class="h-6 w-6 text-red-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                      </div>
                      <div class="mt-0 text-left ml-4">
                        <h3 id="modal-title" class=" text-xl font-semibold leading-6 text-gray-900">{{ msgStatus }}</h3>
                        <div class="mt-2">
                          <p class=" text-base py-2 text-gray-500">{{ msgMessage }}</p>
                          <p class=" text-base text-gray-500">{{ msgErr }}</p>
                        </div>
                      </div>
                    </div>
                    <div class="mt-4 flex flex-row-reverse">
                      <button class=" rounded-xl p-3 text-danger bg-dangerBG hover:bg-dangerBGHover" @click="closeModal">確定</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref } from 'vue'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
} from '@headlessui/vue'
import { useApiMessageStore } from '@/stores/apiMessage.js'
const router = useRouter()
const messageStore = useApiMessageStore()
const isOpen = ref(false)
const msgCode = ref('')
const msgStatus = ref('')
const msgMessage = ref('')
const msgErr = ref('')
// call 範例
// 將 ResponseData Key 轉小寫
// const tempJson = proxy.$TOOL.toLocaleLowerCase(err.data)
// 1.ResponseData 狀態 2.ResponseData 訊息 3.自行輸入要顯示的訊息
// setApiMessage(code, tempJson.status, tempJson.message, '刪除巡檢專案資料發生錯誤')

messageStore.$subscribe((mutation, state) => {
  const { code, status, message, errMsg } = state
  if (message !== '') {
    msgCode.value = code
    msgStatus.value = status
    msgMessage.value = message
    msgErr.value = errMsg
    isOpen.value = true
  }
})

const closeModal = () => {
  isOpen.value = false
  messageStore.$patch((state) => {
    state.code = ''
    state.status = ''
    state.message = ''
    state.errMsg = ''
  })
  if (msgCode.value === 401) {
    router.replace({ path: '/login' })
  }
  // router.back()
}

</script>
