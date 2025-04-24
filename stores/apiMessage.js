import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useApiMessageStore = defineStore('apiMessageSate', () => {
  const code = ref('')
  const status = ref('')
  const message = ref('')
  const errMsg = ref('')
  function setApiMessage(info) {
    code.value = info.code
    status.value = info.status
    message.value = info.message
    errMsg.value = info.errMsg
  }

  return { code, status, message, errMsg, setApiMessage }
})
