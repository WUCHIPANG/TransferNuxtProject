<template>
  <div class="relative h-full">
    <div>
      <div class="flex flex-wrap justify-between pr-16">
        <div>
          <div class="inline-flex h-16 bg-white border rounded-full border-primary-90 typeGroup" role="group">
            <ul>
              <li
                v-for="item in inspectionType"
                :key="item.inspectionTypeID"
                class="inline-flex h-full cursor-pointer segmented-font hover:segmented-control focus:z-10 focus:segmented-control"
                :class="selectType === item.inspectionTypeID ? 'segmented-control' : ''"
                type="button"
                @click="inspectionSend(item)"
              >
                <span
                  v-if="item.typeName === '太陽能' && selectType === item.inspectionTypeID"
                  class="w-6 h-6 mr-2 fill-current icon-solar text-font24"
                />
                <span
                  v-if="item.typeName === '熱源' && selectType === item.inspectionTypeID"
                  class="w-6 h-6 mr-2 fill-current icon-heat text-font24"
                />
                <span
                  v-if="item.typeName === '土地' && selectType === item.inspectionTypeID"
                  class="w-6 h-6 mr-2 fill-current icon-land text-font24"
                />
                <span v-if="selectType !== item.inspectionTypeID" class="h-5" />
                <span>{{ item.typeName }}</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="">
          <!-- 查詢巡檢日期 -->
          <div class="flex mr-3">
            <span class="mr-2 text-font20 leading-15">巡檢日期</span>
            <div class="relative w-[350px]">
              <span class="absolute cursor-pointer icon-calendar text-font24 top-5 left-4" />
              <span
                class="absolute transform -translate-y-1/2 cursor-pointer icon-clear top-1/2 right-5"
                @click="clearSearch"
              />
              <VDatePicker
                v-model="range"
                :masks="masks"
                :popover="popover"
                mode="date"
                is24hr
                is-range
              >
                <template #default="{ inputValue, inputEvents }">
                  <div
                    class="w-full h-16 p-5 pl-12 bg-white cursor-pointer form-input input-shadow rounded-4xl"
                    v-on="inputEvents.start"
                  >
                    <span
                      v-if="range === null || range.start === '' || range.start === undefined"
                      class="font-sans text-sm text-neutral-70"
                    >
                      YYYY/MM/DD ~ YYYY/MM/DD
                    </span>
                    <span v-else-if="inputValue.start === null">{{ storeData.searchStartTime }} ~ {{
                      storeData.searchEndTime }}</span>
                    <span v-else>{{ inputValue.start }} ~ {{ inputValue.end }}</span>
                  </div>
                </template>
              </VDatePicker>
            </div>
          </div>
        </div>
      </div>
      <div class=" mt-10 pr-14 mb-5">
        <div class="overflow-hidden rounded-lg ring-1 ring-devider">
          <table class="min-w-full table-hover table-hover-border">
            <thead class=" bg-surface-5">
              <tr>
                <th scope="col" class="w-20 py-5 text-center text-font20Regular table-th">序號</th>
                <th scope="col" class=" py-5 text-center text-font20Regular table-th">巡檢專案名稱</th>
                <th scope="col" class="px-5 text-center text-font20Regular table-th">起迄日期</th>
                <th scope="col" class="px-6 text-center text-font20Regular table-th">案場數量</th>
                <th scope="col" class="px-6 text-center text-font20Regular table-th">已篩檢並發布</th>
                <th scope="col" class="px-6 text-center text-font20Regular table-th">未篩檢</th>
                <th scope="col" class="w-24 px-6  text-font20Regular table-th" colspan="3">功能</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(item, index) in inspectionManageList" :key="item.planID" class="bg-white  ">
                <td class="py-6 text-center text-font20Regular ">{{ index + 1 }}</td>
                <td class="py-6 text-center text-font20Regular table-td">
                  {{ item.planName }}
                </td>
                <td class="p-6 text-center text-font20Regular table-td">{{ moment(item.planStartTime).format('YYYY/MM/DD') }} ~ {{ moment(item.planEndTime).format('YYYY/MM/DD') }}</td>
                <td class="p-6 text-center text-font20Regular table-td">{{ item.placeCnt }}</td>
                <td class="p-6 text-center text-font20Regular table-td">{{ item.releaseCnt }}</td>
                <td class="p-6 text-center text-font20Regular table-td">{{ item.unFilteredCnt }}</td>
                <td class="w-16 text-font20Regular table-td">
                  <div
                    class="rounded-full mx-auto h-10 w-10 flex items-center justify-center cursor-pointer hover:bg-activeBG"
                    @click="view(item.planID)"
                  >
                    <span class="icon-visibility-on text-primary-70" />
                  </div>
                </td>
                <td class=" w-24 text-font20Regular table-td">
                  <DownloadICon :text="'專案分級表'" @click="download(item.planID, item.planName)" />
                </td>
                <td class=" w-20 text-font20Regular table-td">
                  <DownloadICon :text="'專案總表'" @click="downloadAll(item.planID, item.planName)" />
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="result === null" class="text-center p-3 bg-white">
            暫無資料
          </div>
        </div>
      </div>
      <!-- 分頁 -->
      <div v-if="itemTotal > 10" class="flex justify-center pr-14">
        <BasePagination
          :total="itemTotal"
          :current="currentPage"
          @update:current="updateCurrent"
          @pagination="getPagination"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, getCurrentInstance } from 'vue'
import moment from 'moment'
const router = useRouter()
// 元件
import BasePagination from '@/components/BasePagination.vue'
import DownloadICon from '@/components/BaseDownloadIcon.vue'
import { useSearchDataStore } from '@/stores/searchData.js'
import { setAlertMessage } from '@/utils/messages.js'
const route = useRoute()
const pageDetail = ref('')
pageDetail.value = route.meta.title

const { proxy } = getCurrentInstance()
const searchData = useSearchDataStore()
const storeData = ref(searchData.data)
onMounted(async() => {
  await getInspectionType()
  if (searchData.data) {
    range.value.start = storeData.value.searchStartTime
    range.value.end = storeData.value.searchEndTime
    searchData.deleteData()
  } else {
    getInspectionManageList()
  }
})

// 取得巡檢類型清單
const inspectionType = ref('')
const selectType = ref('')
const selectName = ref('')
const getInspectionType = async() => {
  try {
    let params = {
      page: 1,
      pageSize: 100,
    }
    const res = await proxy.$API.inspectionType.type.get(params)
    inspectionType.value = res.responseData
    // 預設第一筆
    selectType.value = inspectionType.value[0].inspectionTypeID
    selectName.value = inspectionType.value[0].typeName
  } catch (err) {
    console.log('取得巡檢類型清單發生錯誤： ', err)
  }
}

// 選擇巡檢類型
const inspectionSend = (item) => {
  selectType.value = item.inspectionTypeID
  selectName.value = item.typeName
  getPagination(1)
}

const inspectionManageList = ref()
// 取得AI巡檢結果列表
const getInspectionManageList = async() => {
  try {
    let params = {
      orderBy: JSON.stringify([{ columnName: 'planStartTime', isDesc: 1 }]),
      inspectionTypeID: selectType.value,
      page: currentPage.value,
      pageSize: 10,
    }
    if (searchStartTime.value) {
      params.searchStartTime = searchStartTime.value
    }
    if (searchEndTime.value) {
      params.searchEndTime = searchEndTime.value
    }
    const res = await proxy.$API.inspectionManage.list.get(params)
    if (res.status === 'success') {
      inspectionManageList.value = res.responseData
      itemTotal.value = res.total
    }
  } catch (err) {
    console.log('取得AI巡檢結果列表發生錯誤： ', err)
  }
}


// 分頁
const itemTotal = ref()
const currentPage = ref(1)
// 分頁切換
const getPagination = (page) => {
  currentPage.value = page
  getInspectionManageList()
}
// 更新分頁 顯示當頁碼背景色
const updateCurrent = (newValue) => {
  currentPage.value = newValue
}

// 日期設定
const range = ref({
  start: '',
  end: '',
})
const popover = ref({
  visibility: 'click',
})
const masks = ref({
  input: 'YYYY-MM-DD',
})
// 搜尋巡檢日期變化
const searchStartTime = ref()
const searchEndTime = ref()
watch(range, () => {
  searchStartTime.value = range.value === null || range.value.start === '' || range.value.start === undefined ? '' : moment(range.value.start).format('YYYY/MM/DD')
  searchEndTime.value = range.value === null || range.value.end === '' || range.value.end === undefined ? '' : moment(range.value.end).format('YYYY/MM/DD')
  getPagination(1)
}, { deep: true })


// 清除搜尋
const clearSearch = () => {
  if (range.value) {
    range.value.start = ''
    range.value.end = ''
    range.value = {
      start: '',
      end: '',
    }
    storeData.value = ''
  }
}

// 檢視專案內容
const view = (id) => {
  let storeSearch = {}
  if (searchStartTime.value) {
    storeSearch.searchStartTime = searchStartTime.value
  }
  if (searchEndTime.value) {
    storeSearch.searchEndTime = searchEndTime.value
  }
  storeSearch.page = currentPage.value
  searchData.addData(storeSearch)
  router.push(`/resultReview/pictureList/${id}`)
}
const download = async(planID, filename) => {
  try {
    const res = await proxy.$API.report.planReport.get(planID)

    let url = URL.createObjectURL(res)
    let a = document.createElement('a')
    a.style = 'display: none'
    a.target = '_blank'
    a.download = filename + '分級表'
    a.href = url
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setAlertMessage('success', '匯出專案分級表成功！', false)
  } catch (err) {
    console.log('匯出專案分級表發生錯誤： ', err)
  }
}
const downloadAll = async(planID, filename) => {
  try {
    const res = await proxy.$API.report.planReportAll.get(planID)
    let url = URL.createObjectURL(res)
    let a = document.createElement('a')
    a.style = 'display: none'
    a.target = '_blank'
    a.download = filename + '總表'
    a.href = url
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setAlertMessage('success', '匯出專案總表成功！', false)
  } catch (err) {
    console.log('匯出專案總表發生錯誤： ', err)
  }
}
</script>
