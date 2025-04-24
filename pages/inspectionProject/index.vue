<template>
  <div class="relative h-full">
    <div class="flex flex-wrap justify-between pr-16">
      <div class="relative flex flex-wrap">
        <!-- 查詢關鍵字 -->
        <div class="flex mr-3 mb-1">
          <span v-if="route.name !== 'inspection-data-list'" class="mr-2 text-font20 leading-15">關鍵字查詢</span>
          <span v-if="route.name === 'inspection-data-list'" class="mr-2 text-font20 leading-15">巡檢專案名稱</span>
          <div class="relative w-60">
            <Multiselect
              v-if="planNameList"
              v-model="searchPlanName"
              :options="planNameList"
              :close-on-select="true"
              :clear-on-select="false"
              placeholder="請輸入專案名稱"
              class="z-10 w-full h-16 p-5 form-input bg-white input-shadow rounded-4xl placeholder:text-neutral-70 custom-multiselect-class indexMultiselect"
              label="planName"
              track-by="planID"
              select-label=""
              deselect-label=""
              @select="searchSelect"
            >
              <template #noResult>無符合專案名稱資料</template>
            </Multiselect>
            <span
              class="absolute cursor-pointer  top-6 right-5 z-50
              "
              :class="searchNameIcon ? 'icon-clear' : 'icon-search'"
              @click="delNameSearch"
            />
          </div>
          <div v-if="route.name !== 'inspection-data-list'" class="relative w-60 ml-2">
            <Multiselect
              v-if="customerList"
              v-model="searchCustomer"
              :options="customerList"
              :close-on-select="true"
              :clear-on-select="false"
              placeholder="請輸入客戶名稱"
              class="z-10 w-full h-16 p-5 form-input bg-white input-shadow rounded-4xl placeholder:text-neutral-70 custom-multiselect-class indexMultiselect"
              label="customerName"
              track-by="customerID"
              select-label=""
              deselect-label=""
              @select="searchSelect"
            >
              <template #noResult>無符合客戶名稱資料</template>
            </Multiselect>
            <span
              class="absolute cursor-pointer  top-6 right-5 z-50
              "
              :class="searchCustomerIcon ? 'icon-clear' : 'icon-search'"
              @click="delCustomerSearch"
            />
          </div>
        </div>
        <!-- 查詢巡檢日期 -->
        <div v-if="route.name === 'inspection-data-list'" class="flex mr-3 mb-1">
          <span class="mr-2 text-font20 leading-15">巡檢日期</span>
          <div class=" relative w-[390px]">
            <span class="z-10 icon-calendar text-font24 absolute top-5 left-4" />
            <form
              class="relative w-full h-16 p-5 pl-12 form-input bg-white input-shadow rounded-4xl cursor-pointer"
              @submit.prevent
            >
              <div class="mb-4 flex absolute top-1/2 transform -translate-y-1/2 w-[330px]">
                <VueDatePicker
                  v-model="date"
                  hide-input-icon
                  input-class-name="dp-custom-input"
                  calendar-cell-class-name="dp-custom-cell"
                  :format="format"
                  range
                  placeholder="YYYY/MM/DD HH:mm ~ YYYY/MM/DD HH:mm"
                  @cleared="clearSearchDate"
                />
              </div>
            </form>
          </div>
        </div>
        <!-- 查詢狀態 -->
        <div class="flex  mr-3 mb-1">
          <span class="mr-2 text-font20 leading-15">狀態</span>
          <Listbox v-slot="{ open }" v-model="enableState">
            <div class="relative">
              <ListboxButton class="relative w-32 h-16 dropDown-type cursor-pointer focus:outline-none">
                <div class="block truncate text-font20Regular text-neutral-20 w-full min-w-[8rem]">
                  <span
                    class=""
                    :class="enableState.name !== undefined ? enableState.name.length > 4 ? 'mr-8 ml-2' : '-ml-6' : ''"
                  >
                    {{ enableState.name }}
                  </span>
                </div>
                <span class="pointer-events-none absolute inset-y-0 right-1 flex items-center pr-2">
                  <span v-if="open" class="icon-arrow-up" />
                  <span v-else class="icon-arrow-down" />
                </span>
              </ListboxButton>
              <transition
                leave-active-class="transition duration-100 ease-in"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
              >
                <ListboxOptions class="listboxOP absolute left-1/2 transform -translate-x-1/2 z-10 w-32 mt-2 origin-top-right bg-white shadow-lg rounded-3xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <ListboxOption
                    v-for="item in states"
                    v-slot="{ active }"
                    :key="item.id"
                    :value="item"
                    as="template"
                  >
                    <li
                      class="m-2 px-4 py-2 text-center text-font20Regular focus-visible:mx-2 cursor-pointer"
                      :class="[active ? 'bg-active text-white rounded' : '']"
                    >
                      <span>
                        {{ item.name }}
                      </span>
                    </li>
                  </ListboxOption>
                </ListboxOptions>
              </transition>
            </div>
          </Listbox>
        </div>
        <!-- 查詢巡檢類型 -->
        <div v-if="route.name !== 'inspection-data-list'" class="flex mr-3 mb-1">
          <span class="mr-2 text-font20 leading-15">巡檢類型</span>
          <Listbox v-slot="{ open }" v-model="inspectionType">
            <div class="relative">
              <ListboxButton class="relative w-auto h-16 dropDown-type cursor-pointer focus:outline-none border-2 border-red-800">
                <div class="block truncate text-font20Regular text-neutral-20 w-full min-w-[8rem]">
                  <span
                    class=""
                    :class="inspectionType.typeName !== undefined ? inspectionType.typeName.length > 4 ? 'mr-8 ml-2' : '-ml-6' : ''"
                  >
                    {{ inspectionType.typeName }}
                  </span>
                </div>
                <span class="pointer-events-none absolute inset-y-0 right-1 flex items-center pr-2">
                  <span v-if="open" class="icon-arrow-up" />
                  <span v-else class="icon-arrow-down" />
                </span>
              </ListboxButton>

              <transition
                leave-active-class="transition duration-100 ease-in"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
              >
                <ListboxOptions class="listboxOP absolute left-1/2 transform -translate-x-1/2 z-10 w-32 min-w-[8rem] mt-2 origin-top-right bg-white shadow-lg rounded-3xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <ListboxOption
                    v-for="item in dropDownTypes"
                    v-slot="{ active }"
                    :key="item.typeID"
                    :value="item"
                    as="template"
                  >
                    <li
                      class="m-2 px-4 py-2 text-center text-font20Regular focus-visible:mx-2 cursor-pointer"
                      :class="[active ? 'bg-active text-white rounded' : '']"
                    >
                      <span>
                        {{ item.typeName }}
                      </span>
                    </li>
                  </ListboxOption>
                </ListboxOptions>
              </transition>
            </div>
          </Listbox>
        </div>
      </div>
      <IconAddBtn v-if="route.name !== 'inspection-data-list'" @click="add" />
    </div>
    <!-- 巡檢專案清單 -->
    <div class=" mt-10 pr-14 mb-5">
      <div class="overflow-hidden rounded-lg ring-1 ring-devider table-hover">
        <table class="min-w-full table-hover">
          <thead class=" bg-surface-5">
            <tr>
              <th scope="col" class="w-20 py-5 text-center text-font20Regular table-th">序號</th>
              <th scope="col" class="w-20 py-5 text-center text-font20Regular table-th">狀態</th>
              <th
                v-if="route.name !== 'inspection-data-list'"
                scope="col"
                class="px-6 text-center w-36 text-font20Regular table-th"
              >
                巡檢類型
              </th>
              <th scope="col" class="px-6 text-left text-font20Regular table-th">巡檢專案名稱</th>
              <th scope="col" class="px-6 text-left text-font20Regular table-th">客戶名稱</th>
              <th
                v-if="route.name === 'inspection-data-list'"
                scope="col"
                class="px-6 text-left text-font20Regular table-th"
              >
                巡檢日期
              </th>
              <th scope="col" class="px-6 text-left text-font20Regular table-th">備註</th>
              <th
                scope="col"
                class="px-8 text-center text-font20Regular table-th"
                :colspan="route.name === 'inspection-manage-list' ? 3 : route.name === 'project-maintain-list' ? 2 : 1"
              >
                管理
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(item, index) in tableData" :key="item.planID">
              <td class="py-6 text-center text-font20Regular ">{{ index + 1 }}</td>
              <td class="py-6 text-center text-font20Regular table-td">
                <Tag :type="+item.isEnable === 1 ? 'active' : 'disabled'">{{ +item.isEnable === 1 ? '啟用' : '停用' }}</Tag>
              </td>
              <td v-if="route.name !== 'inspection-data-list'" class="py-5 text-center text-font20Regular table-td">
                {{ item.inspectionTypeName }}
              </td>
              <td class="p-6 text-font20Regular table-td">{{ item.planName }}</td>
              <td class="p-6 text-font20Regular table-td">
                {{ item.customerName }}
              </td>
              <td v-if="route.name === 'inspection-data-list'" class="px-6 py-5 text-font20Regular table-td">
                <span v-if="item.planStartTime !== null && item.planEndTime !== null">
                  {{ moment(item.planStartTime).format('YYYY-MM-DD HH:mm') }} ~
                  {{ moment(item.planEndTime).format('YYYY-MM-DD HH:mm') }}
                </span>
              </td>
              <td class="p-6 text-font20Regular table-td">{{ item.remark }}</td>
              <td v-if="route.name !== 'project-maintain-list'" class="w-16 text-font20Regular table-td">
                <div
                  v-if="item.flightTotal === 0"
                  class="group hoverBtn relative rounded-full mx-auto h-10 w-10 flex items-center justify-center cursor-pointer hover:bg-activeBG"
                  @mouseover="showAddText(item)"
                  @mouseleave="hideAddText(item)"
                  @click="map(item.planID, 'add')"
                >
                  <!-- <span class="icon-add_circle text-primary-60" /> -->
                  <span class="text-primary-60" :class="item.showAddText ? ' text-sm text-center' : 'icon-add_circle '">
                    {{ item.showAddText ? '新增任務' : '' }}
                  </span>
                </div>
                <div
                  v-else
                  class="group hoverBtn relative rounded-full mx-auto h-10 w-10 flex items-center justify-center cursor-pointer hover:bg-activeBG"
                  @mouseover="showEditText(item)"
                  @mouseleave="hideEditText(item)"
                  @click="map(item.planID, 'edit')"
                >
                  <span class="text-primary-60" :class="item.showEditText ? ' text-sm text-center' : 'icon-layers '">
                    {{ item.showEditText ? '編輯任務' : '' }}
                  </span>
                </div>
              </td>
              <td v-if="route.name !== 'inspection-data-list'" class="w-16 text-font20Regular table-td">
                <EditICon @click="edit(item.planID)" />
              </td>
              <td v-if="route.name !== 'inspection-data-list'" class="w-16 text-center text-font20Regular table-td">
                <DeleteICon @click="deleteModal(item)" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- 分頁 -->
    <div v-if="itemTotal > 10" class=" flex justify-center pr-14">
      <BasePagination
        :total="itemTotal"
        :current="currentPage"
        @update:current="updateCurrent"
        @pagination="getPagination"
      />
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
import { ref, reactive, watch, getCurrentInstance, onMounted } from 'vue'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.css'
import moment from 'moment'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
const { proxy } = getCurrentInstance()

// 元件
import IconAddBtn from '@/components/BaseIconAddBtn.vue'
import EditICon from '@/components/BaseEditIcon.vue'
import DeleteICon from '@/components/BaseDeleteIcon.vue'
import Tag from '@/components/BaseTag.vue'
import BasePagination from '@/components/BasePagination.vue'
import Dialog from '@/components/BaseModal.vue'
import ApiMsgDialog from '@/components/BaseApiMsg.vue'
import { setAlertMessage } from '@/utils/messages.js'
import { useSearchDataStore } from '@/stores/searchData.js'
const searchData = useSearchDataStore()
const router = useRouter()
const route = useRoute()

// ---- Route name切換 清空 搜尋條件 ----
watch(() => route.name, () => {
  searchPlanName.value = ''
  searchCustomer.value = ''
  searchStartTime.value = ''
  searchEndTime.value = ''
  date.value = null
  enableState.value = states[0]
  inspectionType.value = dropDownTypes.value[0]
})

// 管理 - icon hover
const showAddText = (item) => {
  item.showAddText = true
}

const hideAddText = (item) => {
  item.showAddText = false
}
const showEditText = (item) => {
  item.showEditText = true
}

const hideEditText = (item) => {
  item.showEditText = false
}
// ---- 查詢關鍵字 ----
const searchNameIcon = ref(false)
const searchCustomerIcon = ref(false)

// 刪除 關鍵字查詢Input內容
const delNameSearch = () => {
  searchPlanName.value = ''
  getPagination(1)
}
const delCustomerSearch = () => {
  searchCustomer.value = ''
  getPagination(1)
}

// ---- 查詢巡檢日期 ----
const searchStartTime = ref()
const searchEndTime = ref()
const date = ref([])
// 格式化 如果沒有選擇第二個時間 自動帶入現在時間
const format = (date) => {
  let dateInput = ''
  if (date[1] === null || date[1] === undefined) {
    dateInput = moment(new Date()).format('YYYY-MM-DD HH:mm')
  } else {
    dateInput = moment(date[1]).format('YYYY-MM-DD HH:mm')
  }
  // 判斷 只選一個日期 是否大於今日
  let returnDate = ''
  if (date[0] > new Date()) {
    returnDate = `${dateInput} ~ ${moment(date[0]).format('YYYY-MM-DD HH:mm')}`
  } else {
    returnDate = `${moment(date[0]).format('YYYY-MM-DD HH:mm')} ~ ${dateInput}`
  }
  return returnDate
}
// 如果沒有選擇第二個時間 自動帶入現在時間
watch(date, () => {
  if (date.value !== null) {
    let start = moment(date.value[0]).format('YYYY-MM-DD HH:mm')
    let end = moment(date.value[1]).format('YYYY-MM-DD HH:mm')
    if (date.value[1] === null || date.value[1] === undefined) {
      if (date.value[0] > new Date()) {
        searchStartTime.value = moment(new Date()).format('YYYY-MM-DD HH:mm')
        searchEndTime.value = moment(date.value[0]).format('YYYY-MM-DD HH:mm')
      } else {
        searchStartTime.value = moment(date.value[0]).format('YYYY-MM-DD HH:mm')
        searchEndTime.value = moment(new Date()).format('YYYY-MM-DD HH:mm')
      }
    } else {
      searchStartTime.value = start
      searchEndTime.value = end
    }
  }
  if (route.name === 'inspection-data-list') {
    // getPagination(1)
    watchCallPagination(1)
  }
})
// 清除 搜尋時間INPUT
const clearSearchDate = () => {
  searchStartTime.value = ''
  searchEndTime.value = ''
  getPagination(1)
}

// ---- 查詢狀態 ----
const states = [
  { id: null, name: '全部' },
  { id: 1, name: '啟用' },
  { id: 0, name: '停用' },
]
const enableState = ref(states[0])
watch(enableState, () => {
  // getPagination(1)
  watchCallPagination(1)
})

// ---- 查詢巡檢類型 ----
const dropDownTypes = ref()
const inspectionType = ref('')
watch(inspectionType, () => {
  if (!isUpdatingType.value) {
    // getPagination(1)
    watchCallPagination(1)
  }
})
let changeCount = 0 // 計數器，追蹤變數變化次數
const watchCallPagination = (page) => {
  changeCount++ // 當任一變數發生變化，計數器 +1

  if (changeCount === 1) {
    setTimeout(() => {
      if (changeCount === 1) {
        getPagination(page) // 如果只有一個變數發生變化，就呼叫 getPagination
      }
      changeCount = 0 // 計數器歸零
    }, 0)
  }
}
// to map頁面
const map = (planID, type) => {
  storeSearchData()
  if (route.name === 'inspection-manage-list') {
    router.push({ name: 'inspection-manage-detail-map', params: { id: planID, type: type }})
  } else if (route.name === 'inspection-data-list') {
    router.push({ name: 'inspection-data-detail-map', params: { id: planID, type: type }})
  }
}

// to 編輯頁
const edit = (planID) => {
  storeSearchData()
  router.push(`/projectMaintain/projectDetail/${planID}`)
}
// 儲存搜尋條件 進入管理頁面返回時使用
const storeSearchData = () => {
  let storeSearch = {}
  if (searchPlanName.value) {
    storeSearch.planName = searchPlanName.value
  }
  if (searchCustomer.value) {
    storeSearch.customerID = searchCustomer.value
  }
  if (enableState.value) {
    storeSearch.isEnable = enableState.value
  }
  if (inspectionType.value) {
    storeSearch.InspectionTypeID = inspectionType.value
  }
  if (searchStartTime.value) {
    storeSearch.searchStartTime = searchStartTime.value
  }
  if (searchEndTime.value) {
    storeSearch.searchEndTime = searchEndTime.value
  }
  storeSearch.page = currentPage.value
  searchData.addData(storeSearch)
}
// to 新增頁
const add = () => {
  proxy.$TOOL.session.set('PAGE_TYPE', route.path)
  router.push('/projectManage/projectAdd')
}

// ---- 分頁切換 ----
const getPagination = (page) => {
  currentPage.value = page
  getPlanList()
}
const updateCurrent = (newValue) => {
  currentPage.value = newValue
}
// ---- 刪除巡檢專案資料 ----
const openDialog = ref(false)
// 刪除彈窗訊息
const modalMessage = reactive({
  title: '確定刪除?',
  detail: '',
  delID: '',
})
// 刪除確認彈窗
const deleteModal = (item) => {
  modalMessage.detail = '確定刪除專案' + item.planName + '?'
  modalMessage.delID = item.planID
  openDialog.value = true
}
const del = async() => {
  try {
    await proxy.$API.plan.project.delete.delete(modalMessage.delID)
    openDialog.value = false
    setAlertMessage('success', '巡檢專案資料刪除成功！', false)
    getPlanList()
  } catch (err) {
    // 驗證失敗時的動作
    console.log('刪除巡檢專案資料發生錯誤： ', err)
  }
}

// ---- 取得巡檢專案清單 ----
const tableData = ref()
const types = ref()
const itemTotal = ref()
const currentPage = ref(1)

const searchPlanName = ref()
const searchCustomer = ref()

const getPlanList = async() => {
  try {
    const payload = {
      orderBy: JSON.stringify([{ columnName: 'customerName', isDesc: 0 }]),
      page: currentPage.value,
      pageSize: 10,
    }
    if (searchPlanName.value !== '' && searchPlanName.value !== undefined) {
      payload.planName = searchPlanName.value.planName
    }
    if (searchCustomer.value !== '' && searchCustomer.value !== undefined) {
      payload.customerID = searchCustomer.value.customerID
    }
    if (enableState.value.id !== null) {
      payload.isEnable = enableState.value.id
    }
    if (inspectionType.value.typeID !== null) {
      payload.InspectionTypeID = inspectionType.value.inspectionTypeID
    }
    if (searchStartTime.value) {
      payload.searchStartTime = searchStartTime.value
    }
    if (searchEndTime.value) {
      payload.searchEndTime = searchEndTime.value
    }
    isUpdatingType.value = false
    const res = await proxy.$API.plan.project.list.get(payload)
    if (res.status === 'success') {
      tableData.value = res.responseData
      itemTotal.value = res.total
    }
  } catch (err) {
    console.log('取得巡檢專案清單發生錯誤： ', err)
  }
}
const searchSelect = () => {
  getPagination(1)
}

// 搜尋列表 取全部清單資料
const planNameList = ref([])
const customerList = ref([])
const getPlanListAll = async() => {
  try {
    const res = await proxy.$API.plan.nameList.get()
    planNameList.value = res.responseData
  } catch (err) {
    console.log('取得巡檢專案清單發生錯誤： ', err)
  }
}

// 搜尋使用 取全部客戶列表
const getCustomerList = async() => {
  const res = await proxy.$API.customer.nameList.get()
  customerList.value = res.responseData
  getPagination(1)
}

// 搜尋Input變化 Icon跟著變化
watch(searchPlanName, (val) => {
  if (val !== '') {
    searchNameIcon.value = true
  } else {
    searchNameIcon.value = false
  }
  getPlanList()
})
watch(searchCustomer, (val) => {
  if (val !== '') {
    searchCustomerIcon.value = true
  } else {
    searchCustomerIcon.value = false
  }
  getPlanList()
})
const isUpdatingType = ref(false) // 控制是否觸發 inspectionType watch
// ---- 進入取得巡檢類型 ----
const getPlanType = async() => {
  try {
    let params = {
      page: 1,
      pageSize: 100,
    }
    const resTypes = await proxy.$API.type.list.get(params)
    if (resTypes.status === 'success') {
      types.value = resTypes.responseData
      dropDownTypes.value = resTypes.responseData
      dropDownTypes.value.unshift({ typeID: null, typeName: '全部' })
      isUpdatingType.value = true
      inspectionType.value = dropDownTypes.value[0]
    }
  } catch (err) {
    // 驗證失敗時的動作
    console.log('取得巡檢類型發生錯誤： ', err)
  }
}

// 取出
const storeData = ref(searchData.data)
onMounted(async() => {
  await getPlanType()
  // 如有儲存的搜尋資料 使用完後刪除
  if (searchData.data) {
    if (searchData.data.searchStartTime) {
      // 將日期字串轉換成 Date 物件
      const startDate = new Date(storeData.value.searchStartTime)
      const endDate = new Date(storeData.value.searchEndTime)
      const dateArray = [startDate, endDate]
      date.value = dateArray
    }
    if (storeData.value.planName) {
      searchPlanName.value = storeData.value.planName
    }
    if (storeData.value.customerID) {
      searchCustomer.value = storeData.value.customerID
    }
    enableState.value = storeData.value.isEnable
    inspectionType.value = storeData.value.InspectionTypeID
    // currentPage.value = storeData.value.page
    searchData.deleteData()
    getPlanListAll()
    getCustomerList()
  } else {
    getPlanList()
    getPlanListAll()
    getCustomerList()
  }
})

</script>

<style>
.dp-custom-input {
  border: none;
}

.dp-custom-cell {
  border-radius: 50%;
}

.custom-multiselect-class .multiselect__tag {
  color: #000000;
  margin-right: 5px;
  margin-bottom: 5px;
  padding: 2px 5px;
  border-radius: 3px;
}

/* 下拉搜尋選單 */
.indexMultiselect {
  @apply box-border p-[14px]
}

.indexMultiselect .multiselect__select {
  display: none;
}

.indexMultiselect .multiselect__tags {
  @apply block bg-white text-font14 border-none
}

.indexMultiselect .multiselect__content-wrapper {
  @apply top-[72px] left-[1px] bg-white shadow-lg rounded-3xl ring-1 ring-black ring-opacity-5 focus:outline-none
}

.indexMultiselect .multiselect__content-wrapper ul> :not([hidden])~ :not([hidden]) {
  margin: 0;
}

.indexMultiselect .multiselect__content {
  @apply p-3
}

.indexMultiselect .multiselect__option--highlight {
  @apply bg-active rounded
}

.indexMultiselect .multiselect__option--highlight::after {
  @apply bg-active rounded
}

.indexMultiselect .multiselect__option--selected.multiselect__option--highlight {
  @apply bg-active
}

.indexMultiselect .multiselect__option--selected.multiselect__option--highlight::after {
  @apply bg-active
}

::-webkit-scrollbar-button {
  /* height:15px; */
  /* background: transparent; */
}

</style>
