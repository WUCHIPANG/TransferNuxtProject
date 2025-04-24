<template>
  <div class="h-[95%] px-14 relative">
    <!-- 基本資料 title -->
    <div class=" pt-6 flex mb-[130px]">
      <div class="w-1/2">
        <span class="text-font24">基本資料:</span>
        <form class="h-full mt-8 pr-6">
          <!-- input -->
          <div class="space-y-6 h-full">
            <div>
              <label for="planName" class="block text-font20" :class="errors.planName ? 'text-danger' : ''">專案名稱</label>
              <div class="mt-2 mr-5">
                <div class="flex input-type w-full relative" :class="errors.planName ? 'input-error' : 'input-shadow'">
                  <input
                    id="planName"
                    v-model="form.planName"
                    type="text"
                    autocomplete="planName"
                    name="planName"
                    placeholder="請輸入專案名稱"
                    class="form-input text-font20Regular placeholder:text-gray-400"
                    @blur="handleBlurValidate('planName')"
                  >
                  <span class="icon-clear absolute top-1/2 right-3 transform  -translate-y-1/2 cursor-pointer" @click="clear" />
                </div>
                <div v-if="errors.planName" class="text-danger text-font16Regular mt-2">{{ errors.planName }}</div>
              </div>
            </div>
            <div>
              <label for="chooseClient" class="block text-font20" :class="errors.chooseClient ? 'text-danger' : ''">客戶名稱</label>
              <div class="mt-2 mr-5">
                <div class="flex input-type w-full relative cursor-pointer" :class="errors.chooseClient ? 'input-error' : 'input-shadow'">
                  <select
                    v-model="form.chooseClient"
                    class="form-input input-select border-none text-font20Regular"
                    :class="form.chooseClient != '' ? '' : 'text-neutral-80'"
                    @blur="handleBlurValidate('chooseClient')"
                  >
                    <option value="" disabled>----- 下拉選擇客戶 -----</option>
                    <option
                      v-for="item in customerList"
                      :key="item.customerID"
                      :value="item.customerID"
                      class="text-neutral-20"
                      :disabled="item.isEnable === '0' || item.expireTime < moment(new Date()).format('YYYY-MM-DD')"
                    >
                      {{ item.customerName }}
                      <span v-if="item.isEnable === '0'">(已停用)</span>
                      <span v-else-if="item.expireTime < moment(new Date()).format('YYYY-MM-DD')">
                        (已過期)
                      </span>
                    </option>
                  </select>
                  <span class="icon-arrow-down absolute right-2 top-1/2 transform -translate-y-1/2" />
                </div>
                <div v-if="errors.chooseClient" class="text-danger text-font16Regular mt-2">
                  {{ errors.chooseClient }}
                </div>
              </div>
            </div>
            <div>
              <label for="chooseType" class="block text-font20" :class="errors.chooseType ? 'text-danger' : ''">巡檢類型</label>
              <div class="mt-2 mr-5">
                <div class="flex input-type w-full relative cursor-pointer" :class="errors.chooseType ? 'input-error' : 'input-shadow'">
                  <select
                    v-model="form.chooseType"
                    class="form-input input-select border-none text-font20Regular"
                    :class="form.chooseType != '' ? '' : 'text-neutral-80'"
                    @blur="handleBlurValidate('chooseType')"
                  >
                    <option value="" disabled>----- 下拉選擇 -----</option>
                    <option
                      v-for="item in types"
                      :key="item.inspectionTypeID"
                      :value="item.inspectionTypeID"
                      class=" text-neutral-20"
                    >
                      {{ item.typeName }}
                    </option>
                  </select>
                  <span class="icon-arrow-down absolute right-2 top-1/2 transform -translate-y-1/2" />
                </div>
                <div v-if="errors.chooseType" class="text-danger text-font16Regular mt-2">{{ errors.chooseType }}</div>
              </div>
            </div>
            <div>
              <label for="username" class="block text-font20">狀態</label>
              <div class="mt-2 mr-5">
                <div class="w-full">
                  <Switch
                    v-model="enabled"
                    :class="enabled ? 'bg-primary-90' : 'bg-neutral-90'"
                    class="relative inline-flex h-[64px] w-full  shrink-0 cursor-pointer rounded-lg border-6 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                  >
                    <span class=" absolute top-4 left-3 h-[52px] w-1/2 text-font20Regular text-neutral-20 ">啟用</span>
                    <span class=" absolute top-4 right-3 h-[52px] w-1/2 text-font20Regular text-neutral-20">停用</span>
                    <span
                      aria-hidden="true"
                      :class="enabled ? 'translate-x-0' : 'translate-x-[100%]'"
                      class="pointer-events-none flex items-center justify-center  h-[52px] w-1/2 transform rounded-lg bg-white shadow-lg ring-0 transition duration-200 ease-in-out text-font20Regular text-neutral-20"
                    >
                      {{ enabled ? '啟用' : '停用' }}
                    </span>
                  </Switch>
                </div>
              </div>
            </div>
            <div class="h-[120px]">
              <label for="remark" class="block text-font20">備註
                <span class="ml-1 text-font16Regular text-neutral-50">(選填)</span>
              </label>
              <div class="flex rounded-lg ring-inset ring-devider h-[95%] w-full pl-2 mt-2 input-shadow">
                <textarea
                  id="remark"
                  v-model="form.remark"
                  type="text"
                  name="remark"
                  autocomplete="remark"
                  class="form-textarea placeholder:text-gray-400 w-full "
                />
              </div>
            </div>
          </div>
        </form>
      </div>
      <div class="w-1/2">
        <span class="text-font24">附件:</span>
        <div class="h-full mt-8 pr-6">
          <div>
            <label for="planName" class="block text-font20">上傳檔案</label>
            <div class="mt-3">
              <div class="flex input-type w-full input-shadow cursor-pointer relative" @click="$refs.file.click()">
                <div class="bg-primary-90 rounded-lg h-full absolute top-0 left-0 z-0" :style="{ width: percent + '%' }" />
                <div class="flex z-10 absolute top-0 left-3 w-full ">
                  <input
                    type="button"
                    class="bg-primary-50 p-2 rounded text-white text-font16Regular h-8 mt-3 mx-2 cursor-pointer"
                    :value="percent !== 0 && percent !== 100 ? '上傳中' : '選擇'"
                  >
                  <span class=" text-font16Regular mt-5" :class="percent > 0 ? 'text-active' : 'text-neutral-70'">{{ inputText }}</span>
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
                  <span class=" text-font20 text-neutral-20 mt-5 absolute right-6">{{ percent }}%</span>
                  <!-- multiple -->
                </div>
              </div>
            </div>
          </div>
          <!-- 檔案Table -->
          <div class=" mt-6 relative">
            <table class="min-w-full overflow-hidden ring-1 rounded-lg ring-devider table-hover">
              <thead class=" bg-surface-5">
                <tr>
                  <th scope="col" class="px-2 py-5 text-center text-font20Regular table-th">序號</th>
                  <th scope="col" class="px-3 py-5 text-center text-font20Regular table-th">上傳人員</th>
                  <th scope="col" class="px-3 py-5 text-left text-font20Regular table-th">檔案名稱</th>
                  <th scope="col" class="px-3 py-5 text-center text-font20Regular table-th">上傳日期</th>
                  <th scope="col" class="px-3 py-5 text-center text-font20Regular table-th">管理</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(item, index) in planFiles" :key="item.fileID">
                  <td class="px-2 py-5 w-[10vh] text-center text-font20Regular ">{{ index + 1 }}</td>
                  <td class="px-3 py-5 w-[25vh] text-center text-font20Regular table-td">
                    {{ item.uploadUserName }}
                  </td>
                  <td class="px-3 py-5 max-w-[35vh] overflow-hidden text-font20Regular text-active underline table-td cursor-pointer" @click="downloadFile(item.fileID, item.fileName)">
                    <div class="group hoverBtn flex items-center justify-start cursor-pointer hover:bg-activeBG">
                      <p class="truncate">{{ item.fileName }}</p>
                      <div class="tooltip group-hover:opacity-100 z-10 w-auto transition-opacity absolute left-1/2 -translate-x-1/2 opacity-0 m-4 mx-auto">
                        <div class="z-10 flex justify-center bg-[#121212] px-2 py-1 text-sm text-gray-100 rounded-md relative">
                          {{ item.fileName }}
                          <div class="triangle absolute -top-[4px]" />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-3 py-5 w-[20vh] text-center text-font20Regular table-td">
                    {{ moment(item.uploadDate).format('YYYY-MM-DD HH:mm:ss') }}
                  </td>
                  <td class="px-2 w-[10vh] text-center text-font20Regular table-td">
                    <DeleteICon @click="deleteModal('file',item)" />
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-if="noFileTip" class="text-center p-32 w-full h-full absolute top-0 left-0">
              <span class=" text-neutral-50 text-font20Regular">暫無附件</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- fixed footer -->
    <div class="w-full bg-white px-14 py-6 text-right fixed bottom-0 right-0 left-0 h-28">
      <div class="flex justify-between h-full">
        <span class=" text-font16 text-neutral-50 flex items-end">上次編輯: {{ updateTime }}</span>
        <div class="space-x-6">
          <Button class="bg-danger" @click="deleteModal('project',detail)">刪除專案</Button>
          <Button class="bg-primary-50" @click="submitPlanForm">確定變更</Button>
        </div>
      </div>
    </div>
    <!-- 刪除確認彈窗 -->
    <Dialog v-model="openDialog">
      <template #title>{{ modalMessage.title }}</template>
      <template #detail>{{ modalMessage.detail }}</template>
      <template #cancelButtonText> 關閉</template>
      <template #confirmButton>
        <button class="modal-button text-danger bg-dangerBG hover:bg-dangerBGHover" @click="del">刪除</button>
      </template>
    </Dialog>
    <ApiMsgDialog />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from 'vue'
import { Switch } from '@headlessui/vue'
import Schema from 'async-validator'
import moment from 'moment'
// 元件
import Button from '@/components/BaseButton.vue'
import Dialog from '@/components/BaseModal.vue'
import DeleteICon from '@/components/BaseDeleteIcon.vue'
import ApiMsgDialog from '@/components/BaseApiMsg.vue'
import { setAlertMessage } from '@/utils/messages.js'
const { proxy } = getCurrentInstance()
const route = useRoute()
const router = useRouter()
// 啟用停用元件
const enabled = ref(true)

// ---- Form Input ----
const form = reactive({
  planName: '',
  chooseClient: '',
  chooseType: '',
  remark: '',
})
const file = ref()

// ---- 驗證 ----
const errors = ref({})
const rules = {
  planName: [{ required: true, message: '此欄位為必填，請輸入專案名稱！' }],
  chooseClient: [{ required: true, message: '請選擇客戶名稱！' }],
  chooseType: [{ required: true, message: '請選擇巡檢類型！' }],
}
const validator = new Schema(rules)
const validateForm = () => {
  return new Promise((resolve, reject) => {
    validator.validate(form, { firstFields: true }, (err, fields) => {
      if (err) {
        errors.value = err.reduce((accumulator, currentValue) => {
          accumulator[currentValue.field] = currentValue.message
          return accumulator
        }, {})
        reject(err)
      } else {
        errors.value = {}
        resolve(fields)
      }
    })
  })
}
const handleBlurValidate = (fieldName) => {
  validator.validate({ [fieldName]: form[fieldName] }, (err, fields) => {
    if (err && fields[fieldName] !== undefined) {
      errors.value = { [fieldName]: fields[fieldName][0].message }
    } else {
      delete errors.value[fieldName]
      // console.log('errors >>>', errors.value)
    }
  })
}

// ---- 送出更改資料 ----
const submitPlanForm = async() => {
  try {
    await validateForm()
    let data = {
      planID: route.params.id,
      planName: form.planName,
      customerID: form.chooseClient,
      InspectionTypeID: form.chooseType,
      isEnable: enabled.value === true ? 1 : 0,
      remark: form.remark,
      updateTime: updateTime.value,
    }
    const res = await proxy.$API.plan.project.edit.put(data)
    if (res.status === 'success') {
      setAlertMessage('success', '巡檢專案資料更改成功！', false)
      if (proxy.$TOOL.session.get('PAGE_TYPE') === null) {
        router.back()
      } else {
        router.push(proxy.$TOOL.session.get('PAGE_TYPE'))
        proxy.$TOOL.session.remove('PAGE_TYPE')
      }
    }
  } catch (err) {
    // 驗證失敗時的動作
    console.log('更改巡檢專案資料發生錯誤： ', err)
  }
}

// ---- 上傳檔案 ----
const inputText = ref('選擇檔案位置')
const percent = ref(0)
const uploadFile = ref()
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
  e.target.value = ''
}
const callUpload = async() => {
  try {
    let data = {
      planID: route.params.id,
      file: uploadFile.value,
    }
    const res = await proxy.$API.plan.upload.post(data, config)
    if (res.status === 'success') {
      setAlertMessage('success', '專案附件檔上傳成功！', false)
      percent.value = 0
      inputText.value = '選擇檔案位置'
      getPlanFileList()
    }
  } catch (err) {
    // 驗證失敗時的動作
    console.log('檔案上傳發生錯誤： ', err)
  }
}
// 再次點擊上傳
const uploadRe = () => {
  percent.value = 0
  inputText.value = '選擇檔案位置'
}

// ---- 上傳附件檔案清單 ----
const planFiles = ref()
const noFileTip = ref(false)
const getPlanFileList = async() => {
  try {
    let params = {
      planID: route.params.id,
      orderBy: JSON.stringify([{ columnName: 'uploadDate', isDesc: 0 }]),
      page: 1,
      pageSize: 100,
    }
    const resPlanFile = await proxy.$API.plan.file.list.get(params)
    if (resPlanFile.status === 'success') {
      planFiles.value = resPlanFile.responseData.length !== 0 ? resPlanFile.responseData.reverse() : ''
      if (planFiles.value === '') {
        noFileTip.value = true
      } else {
        noFileTip.value = false
      }
    }
  } catch (err) {
    // 驗證失敗時的動作
    console.log('取得專案附件檔清單發生錯誤： ', err)
  }
}

// ---- 下載檔案 ----
const downloadFile = async(fileID, filename) => {
  try {
    const resDownloadFile = await proxy.$API.plan.file.download.get(fileID)
    let url = URL.createObjectURL(resDownloadFile)
    let a = document.createElement('a')
    a.style = 'display: none'
    a.target = '_blank'
    a.download = filename
    a.href = url
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setAlertMessage('success', '專案附件檔下載成功！', false)
  } catch (err) {
    // 驗證失敗時的動作
    console.log('專案附件檔下載發生錯誤： ', err)
  }
}

// ---- 刪除附件檔案 ----
const deleteFile = async() => {
  try {
    const res = await proxy.$API.plan.file.delete.delete(modalMessage.delID)
    openDialog.value = false
    getPlanFileList()
    setAlertMessage('success', '專案附件檔刪除成功！', false)
    // 回復 modalMessage 成預設值
    modalMessage.detail = ''
    modalMessage.delID = ''
    modalMessage.delt = ''
  } catch (err) {
    // 驗證失敗時的動作
    console.log('刪除專案附件檔發生錯誤： ', err)
    openDialog.value = false
  }
}

// ---- 清除 客戶名稱Input ----
const clear = () => {
  form.planName = ''
}

// ---- 刪除巡檢專案資料 ----
const delProject = async() => {
  try {
    await proxy.$API.plan.project.delete.delete(modalMessage.delID)
    openDialog.value = false
    setAlertMessage('success', '巡檢專案資料刪除成功！', false)
    router.back()
  } catch (err) {
    // 驗證失敗時的動作
    console.log('刪除巡檢專案資料發生錯誤： ', err)
    openDialog.value = false
  }
}

// ---- 刪除專案及檔案確認彈窗 ----
const openDialog = ref(false)
// 刪除確認彈窗
const modalMessage = reactive({
  title: '確定刪除?',
  detail: '',
  delID: '',
  delType: '', // project or file
})
const deleteModal = (type, item) => {
  if (type === 'project') {
    modalMessage.detail = '確定刪除專案' + item.planName + '?'
    modalMessage.delID = item.planID
  } else {
    modalMessage.detail = `確定刪除 ${item.fileName} ？`
    modalMessage.delID = item.fileID
  }
  modalMessage.delType = type
  openDialog.value = true
}
const del = () => {
  modalMessage.delType === 'project' ? delProject() : deleteFile()
}

// ---- 進入取得 巡檢專案詳細資料 ----
const detail = ref()
const updateTime = ref('')
const getPlanDetail = async() => {
  try {
    const res = await proxy.$API.plan.project.detail.get(route.params.id)
    if (res.status === 'success') {
      detail.value = res.responseData
      form.planName = detail.value.planName
      enabled.value = detail.value.isEnable === 1
      form.remark = detail.value.remark
      updateTime.value = detail.value.updateTime

      types.value.forEach((item) => {
        if (item.inspectionTypeID === detail.value.inspectionTypeID) {
          form.chooseType = item.inspectionTypeID
        }
      })

      customerList.value.forEach((item) => {
        if (item.customerID === detail.value.customerID) {
          form.chooseClient = item.customerID
        }
      })
    }
  } catch (err) {
    // 驗證失敗時的動作
    console.log('取得巡檢專案資料發生錯誤： ', err)
  }
}

// ---- 進入取得 巡檢類型 ----
const types = ref()
const getPlanType = async() => {
  try {
    let params = {
      page: 1,
      pageSize: 100,
    }
    const resTypes = await proxy.$API.type.list.get(params)
    if (resTypes.status === 'success') {
      types.value = resTypes.responseData
    }
  } catch (err) {
    // 驗證失敗時的動作
    console.log('取得巡檢類型發生錯誤： ', err)
  }
}

// ---- 進入取得 客戶清單 ----
const customerList = ref()
const getCustomer = async() => {
  try {
    let params = {
      page: 1,
      pageSize: 100,
    }

    // const resCustomer = await proxy.$API.customer.list.get(params)
    const resCustomer = await proxy.$API.customer.nameList.get()
    if (resCustomer.status === 'success') {
      customerList.value = resCustomer.responseData
    }
  } catch (err) {
    // 驗證失敗時的動作
    console.log('取得客戶資料發生錯誤： ', err)
  }
}
onMounted(async() => {
  await getPlanType()
  await getCustomer()
  getPlanDetail()
  getPlanFileList()
})
</script>
