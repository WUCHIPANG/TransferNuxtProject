<template>
  <div class="h-[95%] px-14 relative">
    <!-- steper -->
    <div v-show="showSteper" class="w-full flex justify-center my-2">
      <ul class="flex justify-center items-center  bg-primary-50 rounded-full w-72 step-ul">
        <template v-for="(tab, index) in tabs" :key="index">
          <li class=" py-2" :class="activeTab === index ? 'text-white' : 'text-primary-80'">
            <div class="flex">
              <div v-if="index === 1" class="text-xs leading-3 mr-3 text-white">---------</div>
              <div v-if="activeTab === 1 && index === 0" class=" rounded-full w-4 h-4 flex justify-center ">
                <span class="icon-check-circle text-white" />
              </div>
              <div v-else class=" rounded-full w-4 h-4 flex justify-center " :class="activeTab === index || index === 0 ? 'bg-white' : 'bg-primary-80'">
                <span class="text-primary-50 text-xs font-medium">{{ index + 1 }}</span>
              </div>
              <span class=" text-xs font-bold ml-1" :class="index === 0 ? 'text-white' : ''">{{ tab }}</span>
              <div v-if="index === 0" class="text-xs leading-3 ml-3 text-white">---------</div>
            </div>
          </li>
        </template>
      </ul>
    </div>
    <!-- contents -->
    <div class="w-full h-full pb-50 pb-36">
      <!-- customer content -->
      <div v-show="activeTab===0">
        <div class=" pt-6 flex h-full">
          <div :class="((editRole==='manage'&&editMode==='add')||editRole==='customer')?'flex w-full':'w-1/2'">
            <div :class="editRole==='manage'&&editMode==='edit'?'':'w-1/2'">
              <span class="text-font24">客戶基本資料：</span>
              <form ref="info" class="h-full mt-8 pr-10">
                <div class="mt-8">
                  <label for="customerGUINumber" class="block text-font20">客戶統編/身份證字號</label>
                  <div class="mt-3">
                    <div class="flex input-type w-full mb-2" :class="errors.customerGUINumber ? 'input-error' : 'input-shadow'">
                      <input
                        id="customerGUINumber"
                        v-model="form.customerGUINumber"
                        type="text"
                        autocomplete="customerGUINumber"
                        name="customerGUINumber"
                        placeholder="請輸入公司統編 或 身份證字號"
                        class="form-input text-font20Regular placeholder:text-gray-400"
                        @blur="handleBlurValidate('customerGUINumber')"
                      >
                    </div>
                    <div v-if="errors.customerGUINumber" class="text-danger text-font16Regular">{{ errors.customerGUINumber }}</div>
                  </div>
                </div>
                <div class="mt-8">
                  <label for="customerName" class="block text-font20">客戶名稱</label>
                  <div class="mt-3">
                    <div class="flex input-type w-full mb-2" :class="errors.customerName ? 'input-error' : 'input-shadow'">
                      <input
                        id="customerName"
                        v-model="form.customerName"
                        type="text"
                        autocomplete="customerName"
                        name="customerName"
                        placeholder="請輸入名稱"
                        class="form-input text-font20Regular placeholder:text-gray-400"
                        @blur="handleBlurValidate('customerName')"
                      >
                    </div>
                    <div v-if="errors.customerName" class="text-danger text-font16Regular">{{ errors.customerName }}</div>
                  </div>
                </div>
                <div class="mt-8">
                  <label for="isEnable" class="block text-font20">狀態</label>
                  <div class="mt-3">
                    <div class="w-full mb-2">
                      <Switch v-model="form.isEnable" :class="form.isEnable ? 'bg-primary-90' : 'bg-neutral-90'" class="relative inline-flex h-[64px] w-full  shrink-0 cursor-pointer rounded-lg border-6 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                        <span class=" absolute top-4 left-3 h-[52px] w-1/2 text-font20Regular text-neutral-20 ">啟用</span>
                        <span class=" absolute top-4 right-3 h-[52px] w-1/2 text-font20Regular text-neutral-20">停用</span>
                        <span aria-hidden="true" :class="form.isEnable ? 'translate-x-0' : 'translate-x-[100%]'" class="pointer-events-none flex items-center justify-center  h-[52px] w-1/2 transform rounded-lg bg-white shadow-lg ring-0 transition duration-200 ease-in-out text-font20Regular text-neutral-20">
                          {{ form.isEnable ? '啟用' : '停用' }}
                        </span>
                      </Switch>
                    </div>
                  </div>
                </div>
                <div class="mt-8">
                  <label for="userEmail" class="block text-font20">管理帳號</label>
                  <div class="mt-3">
                    <div class="flex input-type w-full mb-2" :class="errors.userEmail ? 'input-error' : 'input-shadow'">
                      <input
                        id="userEmail"
                        v-model="form.userEmail"
                        type="text"
                        autocomplete="userEmail"
                        name="userEmail"
                        placeholder="設定管理帳號"
                        class="form-input text-font20Regular placeholder:text-gray-400"
                        @blur="handleBlurValidate('userEmail')"
                      >
                    </div>
                    <div v-if="errors.userEmail" class="text-danger text-font16Regular">{{ errors.userEmail }}</div>
                  </div>
                </div>
                <div class="mt-8">
                  <label for="authorizeNum" class="block text-font20">授權數量</label>
                  <div class="mt-3">
                    <div class="flex input-type w-full mb-2" :class="errors.authorizeNum ? 'input-error' : 'input-shadow'">
                      <input
                        id="authorizeNum"
                        v-model="form.authorizeNum"
                        type="number"
                        autocomplete="authorizeNum"
                        name="authorizeNum"
                        placeholder="設定授權數量"
                        min="1"
                        class="form-input text-font20Regular placeholder:text-gray-400"
                        @blur="handleBlurValidate('authorizeNum')"
                      >
                    </div>
                    <div v-if="errors.authorizeNum" class="text-danger text-font16Regular">{{ errors.authorizeNum }}</div>
                  </div>
                </div>
                <div class="mt-8">
                  <label for="expireTime" class="block text-font20">授權到期日</label>
                  <div class="mt-3">
                    <VDatePicker v-model="form.expireTime" mode="date">
                      <template #default="{ inputValue, togglePopover }">
                        <div class="flex items-center input-type w-full mb-2" :class="errors.expireTime ? 'input-error' : 'input-shadow'">
                          <span class="icon-calendar text-font20Regular px-2" @click="togglePopover()" />
                          <input
                            :value="inputValue"
                            class="form-input text-font20Regular placeholder:text-gray-400"
                            readonly
                            @blur="handleBlurValidate('expireTime')"
                            @click="togglePopover()"
                          >
                        </div>
                      </template>
                    </VDatePicker>
                    <div v-if="errors.expireTime" class="text-danger text-font16Regular">{{ errors.expireTime }}</div>
                  </div>
                </div>
              </form>
            </div>
            <div :class="editRole==='manage'&&editMode==='edit'?'mt-10':'w-1/2'">
              <span class="text-font24">功能設定：</span>
              <form ref="info" class="h-full mt-8 pr-10">
                <div class="w-full min-h-[45%] grid gap-4 grid-cols-2 mb-2" :class="errors.methodSetting ? 'input-error' : ''">
                  <MethodCard :api-sel-method="form.methodSetting" @update-sel-method="updateMethodSelect" />
                </div>
                <div v-if="errors.methodSetting" class="text-danger text-font16Regular">{{ errors.methodSetting }}</div>

                <div class="h-[45%] mt-8">
                  <label for="remark" class="block text-font20">備註<span class="ml-1 text-font16Regular text-neutral-50">(選填)</span></label>
                  <div class="flex rounded-lg ring-inset ring-devider w-full mt-3 input-shadow">
                    <textarea
                      id="remark"
                      v-model="form.remark"
                      type="text"
                      name="remark"
                      rows="10"
                      autocomplete="remark"
                      class="form-textarea px-6 py-5 placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
          <!-- place data -->
          <div v-if="editRole==='manage' && editMode==='edit'" class="w-1/2">
            <PlaceList
              :place-list="placeList"
              :edit-role="editRole"
              :customer-id="customerID"
              @update-place-list="getPlaceList"
            />
          </div>
        </div>
      </div>
      <!-- place content -->
      <div v-show="activeTab===1" class="pt-8 h-full">
        <!-- customer info -->
        <div class="h-[20vh]">
          <span class="text-font24">客戶基本資料：</span>
          <div class="w-full h-full mt-8 pr-10">
            <div class="w-full flex grid gap-4 grid-cols-3">
              <div class="w-full">
                <label for="customerGUINumber" class="block text-font20">客戶統編/身份證字號</label>
                <div class="mt-3 ">
                  <div class="flex input-type w-full ">
                    <input
                      id="customerGUINumber"
                      v-model="form.customerGUINumber"
                      type="text"
                      name="customerGUINumber"
                      class="form-input text-font20Regular text-neutral-70"
                      readonly
                    >
                  </div>
                </div>
              </div>
              <div class="w-full">
                <label for="customerGUINumber" class="block text-font20">客戶名稱</label>
                <div class="mt-3">
                  <div class="flex input-type w-full">
                    <input
                      id="customerName"
                      v-model="form.customerName"
                      type="text"
                      name="customerGUINumber"
                      class="form-input text-font20Regular text-neutral-70"
                      readonly
                    >
                  </div>
                </div>
              </div>
              <div class="w-full">
                <label for="isEnable" class="block text-font20">狀態</label>
                <div class="mt-3">
                  <div class="w-full">
                    <Switch
                      v-model="form.isEnable"
                      disabled
                      class="relative bg-neutral-90 inline-flex h-[64px] w-full  shrink-0 cursor-pointer rounded-lg border-6 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                    >
                      <span class=" absolute top-4 left-3 h-[52px] w-1/2 text-font20Regular text-neutral-20 ">啟用</span>
                      <span class=" absolute top-4 right-3 h-[52px] w-1/2 text-font20Regular text-neutral-20">停用</span>
                      <span aria-hidden="true" :class="form.isEnable ? 'translate-x-0' : 'translate-x-[100%]'" class="pointer-events-none flex items-center justify-center  h-[52px] w-1/2 transform rounded-lg bg-white shadow-lg ring-0 transition duration-200 ease-in-out text-font20Regular text-neutral-20">
                        {{ form.isEnable ? '啟用' : '停用' }}
                      </span>
                    </Switch>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- place data -->
        <div class="h-[80vh] mt-8 ">
          <PlaceList
            :place-list="placeList"
            :edit-role="editRole"
            :customer-id="customerID"
            @update-place-list="getPlaceList"
          />
        </div>
      </div>
    </div>
    <!-- footer -->
    <div class="w-full px-14 py-6 drop-shadow-md bg-white text-right fixed bottom-0 right-0 left-0 h-28">
      <div class="flex items-end" :class="editMode==='edit'?'justify-between':'justify-end'">
        <span v-if="editMode === 'edit' && editRole!== 'place'" class="text-font16 text-neutral-50 flex items-end">上次編輯: {{ form.updateTime }}</span>
        <div v-show="showSteper" class="space-x-6">
          <Button v-if="activeTab < tabs.length - 1" class="bg-neutral-70" @click="next">下一步</Button>
          <Button v-if="activeTab > 0" class="bg-neutral-70" @click="previous">上一步</Button>
          <Button v-show="activeTab === tabs.length - 1" class="bg-primary-50" @click="confirm">確定</Button>
        </div>
        <div v-show="!showSteper && editRole!== 'place'" class="space-x-6">
          <Button class="bg-primary-50" @click="confirm">確定</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance, onMounted, ref, reactive } from 'vue'
import moment from 'moment'

import { Switch } from '@headlessui/vue'
import Schema from 'async-validator'
import Button from '@/components/BaseButton.vue'
import MethodCard from '@/views/customer/customerMaintain/components/CustomMethodCard.vue'
import PlaceList from '@/views/customer/customerMaintain/components/CustomPlaceList.vue'
import { setAlertMessage } from '@/utils/messages.js'

const route = useRoute()
const router = useRouter()
const { proxy } = getCurrentInstance()

// page setting
const editRole = ref('')
const editMode = ref('add')
const customerID = ref('')
// steper
const showSteper = ref(false)
const activeTab = ref(0)
const tabs = ref(['客戶基本資料', '新增案場'])

// 客戶基本資料
const defaultForm = reactive({
  customerName: '', // 客戶名稱
  expireTime: '', // 授權到期日
  customerGUINumber: '', // 客戶統編/身份證字號
  isEnable: true, // 狀態
  remark: '', // 備註
  userEmail: '', // 管理帳號
  authorizeNum: 1, // 授權數量
  updateTime: null,
  methodSetting: [], // 功能設定
  customerAccountID: '',
})
// 功能設定
let form = reactive(Object.assign({}, defaultForm))

onMounted(() => {
  editRole.value = getEditPermission(route.name)

  if (editRole.value === 'manage' && editMode.value === 'add') {
    showSteper.value = true
    if (proxy.$TOOL.session.get('PAGE_TEMP_ID') !== null) {
      customerID.value = proxy.$TOOL.session.get('PAGE_TEMP_ID')
      proxy.$TOOL.session.remove('PAGE_TEMP_ID')
      getCustomerData()
      getPlaceList()
      activeTab.value = 1
    }
  }
  if (editMode.value === 'edit') {
    customerID.value = route.params.id
    getCustomerData()
    if (editRole.value === 'place' || editRole.value === 'manage') {
      getPlaceList()
    }
  }
})
// ---- 客戶基本資訊 ---- Start
// 表單驗證
const rules = {
  customerGUINumber: [{ required: true, message: '客戶統編/身分證字號為必填！' }],
  customerName: [{ required: true, message: '客戶名稱為必填！' }],
  userEmail: [{ required: true, message: '管理帳號為必填！' }, { required: true, type: 'email', message: '管理帳號必需為email格式！' }],
  authorizeNum: [{ required: true, type: 'number', min: 1, message: '授權數量必需大於 0！' }],
  expireTime: [{ required: true, message: '授權到期日為必填！' },
    { required: true,
      type: 'date',
      validator(rule, value) {
        let today = moment().format('YYYY/MM/DD')
        let checkDate = moment(value).isBefore(today)
        return !checkDate
      },
      message: '無效的授權到期日！' }],
  methodSetting: [{ required: true, type: 'array', min: 1, message: '至少需選擇一項功能！' }],
}
const errors = ref({})
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
    }
  })
}
// 新增客戶資訊
const submitCustomerForm = async() => {
  try {
    const validateRes = await validateForm().catch(() => {
      return false
    })
    if (!validateRes) {
      return
    }
    const payload = {
      customerName: form.customerName,
      authorizeNum: form.authorizeNum,
      expireTime: moment(form.expireTime).format('YYYY-MM-DD'),
      methodSetting: form.methodSetting,
      customerGUINumber: form.customerGUINumber,
      isEnable: form.isEnable === true ? 1 : 0,
      remark: form.remark,
      userEmail: form.userEmail,
    }
    const res = await proxy.$API.customer.add.post(payload)
    if (res.status === 'success') {
      customerID.value = res.responseData.customerID
      form.customerAccountID = res.responseData.customerAccountID
      setAlertMessage('success', '客戶基本資料建立成功！', false)
      if (editRole.value === 'manage' && editMode.value === 'add') {
        activeTab.value += 1
      }
      // 如果是從客戶維護功能進入，客戶資料建立完成後，就回列表頁面
      if (editRole.value === 'customer') {
        router.push({ name: 'customer-maintain', params: {}})
      }
    } else {
      setAlertMessage('danger', res.message, true)
    }
  } catch (err) {
    setAlertMessage('danger', '建立客戶基本資料發生問題！')
    console.log('建立客戶基本資料發生錯誤：', err)
  }
}
// 取得客戶詳細資訊
const getCustomerData = async() => {
  try {
    const res = await proxy.$API.customer.detail.get(customerID.value)
    if (res.status === 'success') {
      form.customerName = res.responseData.customerName
      form.expireTime = res.responseData.expireTime
      form.customerGUINumber = res.responseData.customerGUINumber
      form.isEnable = res.responseData.isEnable === 1
      form.remark = res.responseData.remark
      form.authorizeNum = res.responseData.authorizeNum
      form.updateTime = res.responseData.updateTime
      form.methodSetting = res.responseData.methodSetting
      form.userEmail = res.responseData.userEmail
      form.customerAccountID = res.responseData.customerAccountID
    }
  } catch (err) {
    setAlertMessage('danger', '取得客戶基本資料發生錯誤！')
    console.log('取得客戶基本資料發生錯誤：', err)
  }
}
// 更新客戶資訊
const updateCustomer = async(id) => {
  try {
    // await validateForm()
    const validateRes = await validateForm().catch(() => {
      return false
    })
    if (!validateRes) {
      return
    }
    const payload = {
      customerName: form.customerName,
      authorizeNum: form.authorizeNum,
      expireTime: moment(form.expireTime).format('YYYY-MM-DD'),
      methodSetting: form.methodSetting,
      customerGUINumber: form.customerGUINumber,
      isEnable: form.isEnable === true ? 1 : 0,
      remark: form.remark,
      userEmail: form.userEmail,
      customerAccountID: form.customerAccountID,
    }
    if (form.updateTime !== null && form.updateTime !== '') {
      payload.updateTime = form.updateTime
    }
    const res = await proxy.$API.customer.update.put(id, payload)
    if (res.status === 'success') {
      setAlertMessage('success', '客戶基本資料更新成功！', false)
      if (editRole.value === 'manage') {
        router.push({ name: 'customer-manage', params: {}})
      } else {
        router.push({ name: 'customer-maintain', params: {}})
      }
    } else {
      setAlertMessage('danger', res.message)
    }
  } catch (err) {
    setAlertMessage('danger', '更新客戶資訊發生錯誤！')
    console.log('更新客戶資訊發生錯誤：', err)
  }
}
// 功能設定
const updateMethodSelect = (val) => {
  form.methodSetting = val.value
}
// ---- 客戶基本資訊 ---- End


// ---- 客戶案場相關 ----Start
// 取得客戶案場清單
const placeList = ref(null)
const getPlaceList = async() => {
  try {
    placeList.value = null // 先清空list
    const payload = {
      customerID: customerID.value,
      orderBy: JSON.stringify([{ columnName: 'placeName', isDesc: 0 }]),
      page: 1,
      pageSize: 100,
    }
    const res = await proxy.$API.place.list.get(payload)
    if (res.status === 'success') {
      placeList.value = res.responseData
    }
  } catch (err) {
    setAlertMessage('danger', '取得案場清單發生錯誤！')
    console.log('取得案場清單發生錯誤：', err)
  }
}
// ---- 客戶案場相關 ----End

// 依照 route name 來區別畫面可操作的權限
const getEditPermission = (routeName) => {
  const strSplit = routeName.split('-')
  editMode.value = strSplit[2]
  switch (routeName) {
    case 'customer-manage-add':
    case 'customer-manage-edit':
      activeTab.value = 0
      return 'manage'
    case 'customer-maintain-add':
    case 'customer-maintain-edit':
      activeTab.value = 0
      return 'customer'
    case 'place-manage-edit':
      activeTab.value = 1
      return 'place'
  }
}
// 確定
const confirm = () => {
  if (editMode.value === 'add') {
    if (editRole.value === 'manage') {
      // 客戶管理時，按下確定-> 更新客戶資訊
      updateCustomer(customerID.value)
    } else {
      // 客戶維護時，按下確定-> 新增客戶
      submitCustomerForm()
    }
  } else {
    if (editRole.value !== 'place') {
      updateCustomer(customerID.value)
    }
  }
}
// 下一步
const next = () => {
  if (editMode.value === 'add' && customerID.value === '') {
    submitCustomerForm()
  } else {
    activeTab.value += 1
    getPlaceList()
  }
}
// 上一步
const previous = () => {
  activeTab.value -= 1
}
</script>

