<template>
  <main class="min-h-screen w-full bg-surface-1 flex relative">
    <div
      :class="bigMap ? 'top-0 left-0 w-full h-full z-onMapFirst' : 'top-[116px] left-[28px]  w-[264px] h-[192px] overflow-hidden flex justify-center items-center  rounded-t-3xl '"
      class="absolute"
    >
      <span
        v-if="bigMap"
        class="z-highest icon-close cursor-pointer absolute top-5 right-7 text-white bg-[#CCCCCC4D] p-3 rounded-lg"
        @click="hideBigMap"
      />
      <!-- map 地圖-->
      <CSIMap
        :edit-polygon="editPolygonData"
        :change-size="bigMap"
        :img-position="imgPosition"
        :cant-click-map="cantClickMap"
        @toggle-lock="toggleMapLock"
      />
    </div>

    <div class="flex flex-col py-6 px-7 relative">
      <BackList class="mt-2 h-7" @click="backList" />
      <div class="flex input-type h-10 w-full relative cursor-pointer input-shadow">
        <select v-model="dropSelect" class="form-input input-select border-none bg-white px-3">
          <option v-for="place in placeList" :key="place.placeID" :value="place.placeID">{{ place.placeName }}</option>
        </select>
        <span class="icon-arrow-down absolute right-2 top-1/2 transform -translate-y-1/2 text-sm" />
      </div>
      <div class=" w-[264px] h-[770px] bg-white rounded-3xl menu-border relative mt-4">
        <div class="w-full">
          <div class="max-w-screen-lg mx-auto ">
            <div class="max-w-xl mx-auto ">
              <div class="w-full h-[192px] flex justify-center items-center rounded-t-3xl relative overflow-hidden">
                <!-- map 地圖放大 -->
                <span
                  class="icon-fullscreen absolute bottom-2 right-2 cursor-pointer text-3xl text-white z-onMapSecond"
                  @click="showBigMap"
                />
              </div>
              <!-- 任務列表 -->
              <ul class="picListUL">
                <li
                  v-for="(item, index) in planFightList"
                  :key="item.planFlightID"
                  class="w-full h-[85px] flex picList-li cursor-pointer"
                  :class="chooseTask === item.planFlightID ? 'border-2 border-primary-50' : 'border-b'"
                  @click="taskDetail(item.planFlightID)"
                >
                  <div
                    class=" w-5 border-r flex justify-center items-center hover:bg-primary-90"
                    :class="chooseTask === item.planFlightID ? 'bg-primary-50 text-white' : ''"
                  >
                    {{ index + 1 }}
                  </div>
                  <div class="p-4 space-y-1 w-[200px]">
                    <div class="mb-4">
                      <span
                        class="rounded py-1 px-2"
                        :class="chooseTask === item.planFlightID ? 'bg-[#EEF8FB]' : 'bg-[#F4F7FF]'"
                      >{{
                        moment(item.startTime).format('MM/DD') }}</span> ~ <span
                        class="rounded py-1 px-2"
                        :class="chooseTask === item.planFlightID ? 'bg-[#EEF8FB]' : 'bg-[#F4F7FF]'"
                      >{{
                        moment(item.endTime).format('MM/DD') }}</span>
                    </div>
                    <div class="ml-2 text-sm">
                      {{ moment(item.startTime).format('HH:mm') }} ~ {{
                        moment(item.endTime).format('HH:mm') }}
                    </div>
                  </div>
                  <div class="w-[44px] border-l flex flex-col justify-between items-center py-3">
                    <span class="icon-more_vert cursor-pointer" />
                    <span
                      :class="[getStatusIcon[item.status].className]"
                      :style="{ color: getStatusIcon[item.status].color }"
                      class="text-xl"
                    />
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full pr-6 h-[900px] ">
      <div class="w-full h-[10%] p-4  relative flex justify-between">
        <GreyMsg>
          <template #title>專案名稱</template>
          <template #data>{{ planName }}</template>
        </GreyMsg>
        <GreyMsg>
          <template #title>客戶名稱</template>
          <template #data>{{ customerName }}</template>
        </GreyMsg>
        <GreyMsg>
          <template #title>巡檢類型</template>
          <template #data> {{ inspectionTypeName }}</template>
        </GreyMsg>
      </div>

      <div class="w-full p-4 h-[90%]">
        <div class="bg-white w-full h-full rounded-3xl border">
          <div class="h-[10%] flex pl-32 items-center relative border-b justify-between">
            <div class="flex">
              <div class="w-32 text-xl">檔案狀態:</div>
              <div class="flex mt-1">
                <div class="text-left text-font20Regular w-32">
                  <input
                    id="0"
                    v-model="fileStatus[0]"
                    type="checkbox"
                    class="form-checkbox w-5 h-5"
                    value="0"
                    @change="updateSelectAll"
                  >
                  <label for="0">
                    <span>全部({{ cnt }})</span>
                  </label>
                </div>
                <div class="text-left text-font20Regular w-36">
                  <input
                    id="1"
                    v-model="fileStatus[1]"
                    type="checkbox"
                    class="form-checkbox w-5 h-5"
                    value="1"
                    @change="updateSelect(1)"
                  >
                  <label for="1">
                    <span>無異常({{ normalCnt }})</span>
                  </label>
                </div>
                <div class="text-left text-font20Regular w-32">
                  <input
                    id="2"
                    v-model="fileStatus[2]"
                    type="checkbox"
                    class="form-checkbox w-5 h-5"
                    value="2"
                    @change="updateSelect(2)"
                  >
                  <label for="2">
                    <span>異常({{ errorCnt }})</span>
                  </label>
                </div>
                {{ file }}
              </div>
            </div>
            <Button class="bg-[#4D94FF] text-2xl text-right mr-5" @click="confirm">
              <span>發 佈</span>
            </Button>
          </div>
          <div class="flex h-[90%]">
            <div class="w-1/6 border-r relative">
              <ul class="picListUL">
                <li
                  v-for="item in type"
                  :key="item.id"
                  class="w-full h-[72px] flex  items-center  border-b cursor-pointer hover:text-gray-700"
                  :class="chooseType === item.id ? 'bg-[#F4F7FF]' : 'bg-white'"
                  @click="typeDetail(item.id)"
                >
                  <div class=" w-2 h-full" :class="chooseType === item.id ? ' bg-primary-50' : ' bg-white'" />
                  <div class="px-4">
                    <span :class="item.icon" class="text-2xl relative top-1" />
                    <span class="ml-2 text-xl ">{{ item.label }}</span>
                  </div>
                </li>
              </ul>
              <div
                class="w-full h-[64px] bg-[#F4F7FF] rounded-bl-3xl absolute bottom-0 border-t  flex justify-center items-center text-primary-50 hover:text-primary-60  cursor-pointer"
                @click="download"
              >
                <!-- <span class="icon-log text-2xl mr-2" /> -->
                <span class="icon-download text-2xl mr-2" />
                <span>下載紀錄</span>
              </div>
            </div>
            <div class="w-5/6 bg-[#FBFBFB] p-4 overflow-y-auto rounded-br-3xl">
              <div class="flex flex-wrap ">
                <div
                  v-for="item in filteredPicList"
                  :key="item.imageFileID"
                  class="mx-[6px] mb-3 w-[237px] h-[240px] rounded-lg  p-1 m-1 relative cursor-pointer transition ease-in-out hover: duration-100 hover:resultList"
                  :class="item.errorPointCnt !== 0 ? 'bg-[#FF3333]' : 'bg-white'"
                  @click="getPlanFlightID(item.imageFileID)"
                >
                  <div class="relative">
                    <div class=" absolute top-2 right-2 bg-neutral-20 w-[45px] h-[22px] rounded px-[2px] text-white text-center">
                      {{ item.errorPointCnt }}
                    </div>
                    <img :src="imgBaseUrl + item.imageFileID" class=" rounded-t-lg w-full">
                    <div class=" space-y-1 text-white absolute transform top-1/2 -translate-y-1/2  left-1/2 -translate-x-1/2 px-5 py-6 rounded-2xl flex-col justify-center items-center  bg-[#616265ed] resultEdit hidden">
                      <div class="text-center">
                        <span class="icon-edit ml-1" />
                      </div>
                      <span class=" text-xl">編輯</span>
                    </div>
                  </div>
                  <div class=" absolute bottom-3 left-1/2 transform -translate-x-1/2 w-full text-center">
                    <span class=" text-base" :class="item.errorPointCnt !== 0 ? 'text-white' : ''">lat:{{ item.lat }}
                      lng:{{ item.lng }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ImgDialog
      :show-img-modal="errImg"
      :data="pictureID"
      :event-ranks="eventRanks"
      @update:file="updateID"
      @close-img-modal="closeImgModal"
      @img-position="getImgPosition"
    />
    <!-- 目前未用 -->
    <Dialog v-model="openDialog">
      <template #title>
        <div class="w-full flex justify-between">
          <div>
            <span class="icon-log text-2xl mr-2" />
            <span>更新編輯目的</span>
          </div>
          <div>
            <span class="icon-close text-base cursor-pointer" @click="openDialog = false" />
          </div>
        </div>
      </template>
      <template #detail>
        <div class="w-[880px] px-2 space-y-4">
          <div class="flex justify-between">
            <span class="text-font20">人員:王大明</span>
            <span class="text-font14 text-neutral-50">日期:2023/08/02</span>
          </div>
          <div>
            <div class="flex rounded-lg h-[275px] w-full pl-2 mt-2 input-shadow">
              <textarea
                id="remark"
                type="text"
                name="remark"
                autocomplete="remark"
                class="form-textarea placeholder:text-gray-400 w-full "
              />
            </div>
          </div>
        </div>
      </template>
      <template #cancelButtonText>取消</template>
      <template #confirmButton>
        <button class="modal-button text-danger bg-dangerBG hover:bg-dangerBGHover">確定</button>
      </template>
    </Dialog>
  </main>
</template>
<script setup>
import { onMounted, ref, getCurrentInstance, watch, computed } from 'vue'
import moment from 'moment'
import BackList from '@/components/BaseBackList.vue'
import GreyMsg from '@/components/BaseGreyMsg.vue'
import Button from '@/components/BaseSButton.vue'
import ImgDialog from './components/ImgModal.vue'
import Dialog from '@/components/BaseModal.vue'
import CSIMap from '../map/components/CustomCSIMap.vue'
import { setAlertMessage } from '@/utils/messages.js'
import {
  usePageState,
  useMapState,
} from '@/stores/mapState'
const route = useRoute()
const router = useRouter()
const { proxy } = getCurrentInstance()
const cantClickMap = ref(false)
if (route.path.indexOf('resultReview') > -1) {
  cantClickMap.value = true
}
// 返回列表
const backList = () => {
  // pageState.name = ''
  // pageState.type = ''
  router.back()
}

const chooseTask = ref(null) // 選到的任務
// 任務列表
const taskDetail = (id) => {
  chooseTask.value = id
  // 更改任務時,fileType改為第一個
  chooseType.value = 3
  getPlanFlightImage(chooseTask.value)
  getFlightDetail(chooseTask.value)
}
// fileType
const chooseType = ref(3)
// 先隱藏
const type = ref([
  // { id: 1, label: '可見光圖片', icon: 'icon-lightPic' },
  // { id: 2, label: '影片檔', icon: 'icon-film' },
  { id: 3, label: '紅外線圖片', icon: 'icon-redPic' },
  // { id: 4, label: '混合圖片', icon: 'icon-mixPic' },
])

// 選擇 fileType 分類
const typeDetail = (id) => {
  chooseType.value = id
  getPlanFlightImage(chooseTask.value)
}

// checkBox
const fileStatus = ref({
  0: true, // 全選
  1: true, // 無異常
  2: true, // 異常
})

// imageList 加入篩選狀態
const filteredPicList = computed(() => {
  if (fileStatus.value[0] || (fileStatus.value[1] && fileStatus.value[2])) {
    return imageList.value
  } else if (fileStatus.value[1]) {
    return imageList.value.filter(item => item.errorPointCnt === 0)
  } else if (fileStatus.value[2]) {
    return imageList.value.filter(item => item.errorPointCnt !== 0)
  }
  return []
})

// 全選
const updateSelectAll = () => {
  const status = fileStatus.value[0]
  fileStatus.value[1] = status
  fileStatus.value[2] = status
  // imgStatus.value = 0
  // getPlanFlightImage(flightID.value)
}
// 單選
const updateSelect = (status) => {
  fileStatus.value[0] = false
  if (fileStatus.value[1] === true && fileStatus.value[2] === true) {
    fileStatus.value[0] = true
  }
  // if (status === 1) {
  //   imgStatus.value = status
  // } else if (status === 2) {
  //   imgStatus.value = status
  // }
  // getPlanFlightImage(flightID.value)
  // if (id === 0) {
  //   const status = fileStatus.value[0]
  //   fileStatus.value[1] = status
  //   fileStatus.value[2] = status
  // } else {
  //   fileStatus.value[0] = false
  //   if (fileStatus.value[1] === true && fileStatus.value[2] === true) {
  //     fileStatus.value[0] = true
  //   }
  // }
}

const errImg = ref(false)
// 點擊圖片 圖片放大 向細方框
const pictureID = ref()
const getPlanFlightID = async(imgID) => {
  try {
    pictureID.value = imgID
    errImg.value = true
  } catch (err) {
    console.log('err', err)
  }
}

const updateID = (data) => {
  pictureID.value = data
}
// 關閉圖片放大
const closeImgModal = () => {
  errImg.value = false
  // 關閉繪製後重新取得 errorPointCnt
  getPlanFlightImage(chooseTask.value)
}
const imgPosition = ref()
// 取得圖片點位
const getImgPosition = (position) => {
  imgPosition.value = position
}
// 目前未用到
const openDialog = ref(false)
const showRemark = () => {
  openDialog.value = true
}
// 下載
const download = async() => {
  try {
    const res = await proxy.$API.report.planFlightReport.get(chooseTask.value)

    let url = URL.createObjectURL(res)
    let a = document.createElement('a')
    a.style = 'display: none'
    a.target = '_blank'
    a.download = planName.value + '任務巡檢報告'
    a.href = url
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setAlertMessage('success', '匯出專案任務巡檢報告成功！', false)
  } catch (err) {
    console.log('匯出專案任務巡檢報告發生錯誤： ', err)
  }
}
const dropSelect = ref(null)
const planList = ref()
const planName = ref()
const customerName = ref()
const inspectionTypeName = ref()
const inspectionTypeID = ref()
const placeList = ref([])

// 下拉選單
const getInspectionMagPlan = async() => {
  try {
    const res = await proxy.$API.inspectionManage.planList.get(route.params.id)
    if (res.status === 'success') {
      planList.value = res.responseData
      planName.value = planList.value.planName
      customerName.value = planList.value.customerName
      inspectionTypeName.value = planList.value.inspectionTypeName
      inspectionTypeID.value = planList.value.inspectionTypeID
      placeList.value = planList.value.placeList
      if (placeList.value.length > 0) {
        dropSelect.value = placeList.value[0].placeID
        // getInspectionMagPlanFlight(placeList.value[0].placeID)
        // 跑 watch 監聽 dropSelect
      }
      // 取得ranks列表資料顏色
      getEventsRanks(inspectionTypeID.value)
    }
  } catch (err) {
    console.log('取得專案資訊與案場清單發生錯誤： ', err)
  }
}

watch(dropSelect, () => {
  getInspectionMagPlanFlight(dropSelect.value)
})

const planFightList = ref()
const getInspectionMagPlanFlight = async(placeID) => {
  try {
    let params = {
      planID: route.params.id,
      placeID: placeID,
    }
    const res = await proxy.$API.inspectionManage.planFightList.get(params)
    if (res.status === 'success') {
      planFightList.value = res.responseData
      if (planFightList.value.length > 0) {
        chooseTask.value = planFightList.value[0].planFlightID
        getPlanFlightImage(planFightList.value[0].planFlightID)
        getFlightDetail(planFightList.value[0].planFlightID)
      }
    }
  } catch (err) {
    console.log('取得案場任務清單發生錯誤： ', err)
  }
}


const imageList = ref()
const imgStatus = ref()
const flightID = ref()
const aiResultID = ref()

const normalCnt = ref(null)
const errorCnt = ref(null)
const cnt = computed(() => {
  return normalCnt.value + errorCnt.value
})
// 圖片列表
const getPlanFlightImage = async(planFlightID) => {
  try {
    let params = {
      planFlightID: planFlightID,
      fileType: chooseType.value,
      status: imgStatus.value,
    }
    const res = await proxy.$API.inspectionManage.planFightImage.get(params)
    console.log('AI分析結果圖片資訊清單', res)
    if (res.status === 'success') {
      imageList.value = res.responseData.imageList
      flightID.value = planFlightID
      aiResultID.value = res.responseData.aiResultID
      normalCnt.value = res.responseData.normalCnt
      errorCnt.value = res.responseData.errorCnt
    }
  } catch (err) {
    console.log('取得AI分析結果圖片資訊清單發生錯誤： ', err)
  }
}

// 狀態ICON
const getStatusIcon = {
  0: { className: 'icon-pause', color: '#CCCCCC' }, // 先頂替 回傳狀態沒有0的資料
  1: { className: 'icon-status2', color: '#CCCCCC' }, // 無異常
  2: { className: 'icon-status1', color: '#CCCCCC' }, // 有異常
  6: { className: 'icon-status3', color: '#51B122' }, // 完成審核發佈
}
const imgBaseUrl = ref(import.meta.env.VITE_APP_IMG_BASE_URL)

const confirm = async() => {
  try {
    const res = await proxy.$API.inspectionManage.release.put(aiResultID.value)
    if (res.status === 'success') {
      setAlertMessage('success', '審核發佈成功！', false)
    } else if (res.status === 'fail') {
      setAlertMessage('danger', '審核發佈失敗！', false)
    }
    //
  } catch (err) {
    console.log('AI結果狀態完成審核發布發生錯誤： ', err)
  }
}


// 地圖
const editPolygonData = ref({})
// 使用 Store
const pageState = usePageState()
const mapState = useMapState()

// API：取得巡檢"飛行"(Flight)單筆資料
const getFlightDetail = async(planFlightID) => {
  try {
    const res = await proxy.$API.plan.flight.detail.get(planFlightID)
    if (res.status === 'success') {
      editPolygonData.value = JSON.parse(JSON.stringify(res.responseData))
      mapState.boundsIsLock = false
    }
  } catch (err) {
    console.log(err)
  }
}

// ========== 地圖鎖定功能 ==========
// 在 add 與 edit 不同功能時，針對"鎖定地圖"後會有不一樣的 MapState.model 與顯示不同元件。
const toggleMapLock = () => {
  mapState.boundsIsLock = !mapState.boundsIsLock
}
const getPageState = () => {
  pageState.name = 1
  pageState.type = 1
  pageState.nameText = 'resultReview'
}
const bigMap = ref(false)
const showBigMap = () => {
  bigMap.value = true
}
const hideBigMap = () => {
  bigMap.value = false
}
watch(bigMap, () => {

})
// ------ API: 取得ranks列表資料顏色 ------>
const eventRanks = ref()
const getEventsRanks = async(inspectionTypeID) => {
  try {
    const res = await proxy.$API.inspectionType.eventsRanks.get(inspectionTypeID)
    eventRanks.value = res.responseData
  } catch (err) {
    console.log('取得巡檢類型事件清單錯誤', err)
  }
}
onMounted(async() => {
  // 取得下拉選單
  await getInspectionMagPlan()
  getPageState()
})
</script>
