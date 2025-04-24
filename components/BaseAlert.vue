<template>
  <div class="fixed top-0 w-full z-highest">
    <TransitionRoot
      appear
      :show="showAlert"
      enter="transition ease duration-500 transform"
      enter-from="opacity-0 -translate-y-12"
      enter-to="opacity-100 translate-y-0"
      leave="transition ease duration-300 transform"
      leave-from="opacity-100 translate-y-0"
      leave-to="opacity-0 -translate-y-12"
    >
      <div class="flex justify-center">
        <div
          id="alert-1"
          class="flex p-4 my-4 min-w-[20%] rounded-lg justify-between items-center "
          :class="alertBgStyle"
          role="alert"
        >
          <div class="my-3 text-font16">
            {{ messageDetail }}
          </div>
          <button
            v-if="haveCancelBtn"
            type="button"
            class="ml-2 -mx-1.5 -my-1.5 inline-flex justify-center items-center h-8 w-8 rounded-lg"
            :class="closeBtnStyle"
            data-dismiss-target="#alert-1"
            aria-label="Close"
            @click="dismissing"
          >
            <span class="icon-close" />
          </button>
        </div>
      </div>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { TransitionRoot } from '@headlessui/vue'
import { useAlertMessageStore } from '@/stores/message.js'

const messageStore = useAlertMessageStore()
const showAlert = ref(false)
const messageType = ref('')
const messageDetail = ref('')
const haveCancelBtn = ref(true)

// call 範例
// 1.類別 2.顯示的訊息內容 3.是否要X按鈕(如果無X按鈕會自己消失)
// setAlertMessage('success', '巡檢專案資料刪除成功！', false)

messageStore.$subscribe((mutation, state) => {
  const { type, message, cancelBtn } = state
  if (message !== '') {
    messageDetail.value = message
    messageType.value = type
    haveCancelBtn.value = cancelBtn
    setAlertStyle()
    showAlert.value = true
    if (cancelBtn === false) {
      dismissing(haveCancelBtn.value)
    }
  }
})

const alertBgStyle = ref('')
const closeBtnStyle = ref('')
const setAlertStyle = () => {
  switch (messageType.value) {
    case 'info':
      alertBgStyle.value = 'text-blue-800 bg-blue-50'
      closeBtnStyle.value = 'bg-blue-50 text-blue-500 focus:ring-2 focus:ring-blue-400 p-1.5 hover:bg-blue-200'
      break
    case 'danger':
      alertBgStyle.value = 'text-danger bg-red-50'
      closeBtnStyle.value = 'text-danger bg-red-50 focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200'
      break
    case 'success':
      alertBgStyle.value = 'text-green-800 bg-green-50 '
      closeBtnStyle.value = ' bg-green-50 text-green-500 focus:ring-2 focus:ring-green-400 p-1.5 hover:bg-green-200'
      break
    case 'warning':
      alertBgStyle.value = 'text-yellow-800 bg-yellow-50'
      closeBtnStyle.value = 'bg-yellow-50 text-yellow-500 focus:ring-2 focus:ring-yellow-400'
      break
    case 'dark':
      alertBgStyle.value = 'bg-gray-50'
      closeBtnStyle.value = 'bg-gray-50 text-gray-500 focus:ring-2 focus:ring-gray-400 p-1.5 hover:bg-gray-200'
      break
  }
}

const dismissing = (cancelBtn) => {
  if (cancelBtn === false) {
    setTimeout(() => {
      showAlert.value = false
    }, 2000)

    messageStore.$patch((state) => {
      state.type = ''
      state.message = ''
      state.cancelBtn = true
    })
  } else {
    showAlert.value = false

    messageStore.$patch((state) => {
      state.type = ''
      state.message = ''
    })
  }
}
</script>
