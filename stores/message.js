import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAlertMessageStore = defineStore('alertMessageState', () => {
  const type = ref('')
  const message = ref('')
  const cancelBtn = ref('')
  function setAlertMessage(info) {
    type.value = info.type
    message.value = info.message
    cancelBtn.value = info.cancelBtn
  }

  return { type, message, cancelBtn, setAlertMessage }
})

