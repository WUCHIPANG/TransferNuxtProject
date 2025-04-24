import { useAlertMessageStore } from '~/stores/message.js'
import { useApiMessageStore } from '~/stores/apiMessage.js'

export function setAlertMessage(messageType, messageDetail, messageCancelBtn) {
  const messageStore = useAlertMessageStore()
  const msg = { type: '', message: '', cancelBtn: '' }
  msg.type = messageType
  msg.message = messageDetail
  msg.cancelBtn = messageCancelBtn === undefined ? true : messageCancelBtn
  messageStore.setAlertMessage(msg)
}

// API回傳
export function setApiMessage(msgCode, msgStatus, msgMessage, msgErr) {
  const messageStore = useApiMessageStore()
  const msg = { code: '', status: '', message: '', errMsg: '' }
  msg.code = msgCode
  msg.status = msgStatus
  msg.message = msgMessage
  msg.errMsg = msgErr
  messageStore.setApiMessage(msg)
}
