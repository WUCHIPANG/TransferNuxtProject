import { getActivePinia } from 'pinia'
import { useAlertMessageStore } from '~/stores/message.js'
import { useApiMessageStore } from '~/stores/apiMessage.js'

export function setAlertMessage(messageType, messageDetail, messageCancelBtn) {
  if (!getActivePinia()) return // 避免未初始化
  const messageStore = useAlertMessageStore()
  const msg = { type: '', message: '', cancelBtn: '' }
  msg.type = messageType
  msg.message = messageDetail
  msg.cancelBtn = messageCancelBtn === undefined ? true : messageCancelBtn
  messageStore.setAlertMessage(msg)
}

// API回傳
export function setApiMessage(msgCode, msgStatus, msgMessage, msgErr) {
  if (!getActivePinia()) return // 避免未初始化
  const messageStore = useApiMessageStore()
  const msg = { code: '', status: '', message: '', errMsg: '' }
  msg.code = msgCode
  msg.status = msgStatus
  msg.message = msgMessage
  msg.errMsg = msgErr
  messageStore.setApiMessage(msg)
}
