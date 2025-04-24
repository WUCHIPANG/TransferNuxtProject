<template>
  <div class="h-[92%] absolute top-10 left-[2%] z-onMapFirst">
    <div class="contentColumn">
      <!-- ===== Header ===== -->
      <div
        class="rounded-t-3xl"
        :class="[mapState.boundsIsLock ? 'bg-white text-neutral-20' : 'bg-primary-30 text-white']"
      >
        <div class="relative">
          <p class="pt-8 pb-6 text-center text-font24">{{ pageState.name === 0 ? '設定案場' : '設定巡檢任務' }}</p>
          <button
            v-if="mapState.boundsIsLock"
            class="absolute right-4 top-1/2 translate-y-[-35%] text-xl"
            :class="[mapState.boundsIsLock ? 'icon-luckup' : 'icon-unluck']"
            @click="openLock"
          />
        </div>
      </div>
      <!-- ===== Body ===== -->
      <!-- 手動設定 -->
      <div class="contentWrap">
        <!-- 案場範圍設定 -->
        <div v-if="pageState.name === 0">
          <label for="caseName">
            案場名稱
            <input
              id="caseName"
              v-model="casePlace.name"
              :class="['setProject-input']"
              type="text"
              name="caseName"
              placeholder="請輸入案場名稱"
              :disabled="mapState.boundsIsLock"
              @change="judgeName"
            >
          </label>
          <div class="my-6">
            <p class="mb-2">設定顯示範圍</p>
            <p class="text-font14 text-warning">(範圍僅限台灣本島及澎湖地區)</p>
          </div>
          <ul class="setProjectColumn step-ul">
            <!-- <li>
              <label for="leftTop">
                <div class="labelTitle">
                  <span class="mr-2 icon-NorthWest">
                    <span class="path1" />
                    <span class="path2" />
                    <span class="path3" />
                    <span class="path4" />
                  </span>
                  <span>左上角經緯度</span>
                </div>
                <textarea
                  id="leftTop"
                  v-model="casePlace.bounds.leftTop"
                  :class="['setProject-textarea', { 'border-neutral-70': casePlace.bounds.leftTop === null }]"
                  type="text"
                  name="leftTop"
                  placeholder="左上角經緯度"
                  cols="30"
                  rows="2"
                  disabled
                />
              </label>
            </li>
            <li>
              <label for="rightTop">
                <div class="labelTitle">
                  <span class="mr-2 icon-NorthEast">
                    <span class="path1" />
                    <span class="path2" />
                    <span class="path3" />
                    <span class="path4" />
                  </span>
                  <span>右上角經緯度</span>
                </div>
                <textarea
                  id="rightTop"
                  v-model="casePlace.bounds.rightTop"
                  :class="['setProject-textarea', { 'border-neutral-70': casePlace.bounds.leftTop === null }]"
                  type="text"
                  name="rightTop"
                  placeholder="右上角經緯度"
                  cols="30"
                  rows="2"
                  disabled
                />
              </label>
            </li>
            <li>
              <label for="leftBottom">
                <div class="labelTitle">
                  <span class="mr-2 icon-southWest">
                    <span class="path1" />
                    <span class="path2" />
                    <span class="path3" />
                    <span class="path4" />
                  </span>
                  <span>左下角經緯度</span>
                </div>
                <textarea
                  id="leftBottom"
                  v-model="casePlace.bounds.leftBottom"
                  :class="['setProject-textarea', { 'border-neutral-70': casePlace.bounds.leftTop === null }]"
                  type="text"
                  name="leftBottom"
                  placeholder="左下角經緯度"
                  cols="30"
                  rows="2"
                  disabled
                />
              </label>
            </li>
            <li>
              <label for="rightBottom">
                <div class="labelTitle">
                  <span class="mr-2 icon-southEast">
                    <span class="path1" />
                    <span class="path2" />
                    <span class="path3" />
                    <span class="path4" />
                  </span>
                  <span>右下角經緯度</span>
                </div>
                <textarea
                  id="rightBottom"
                  v-model="casePlace.bounds.rightBottom"
                  :class="['setProject-textarea', { 'border-neutral-70': casePlace.bounds.leftTop === null }]"
                  type="text"
                  name="rightBottom"
                  placeholder="右下角經緯度"
                  cols="30"
                  rows="2"
                  disabled
                />
              </label>
            </li> -->
            <li>
              <label for="centerPoint">
                <div class="labelTitle">
                  <span class="mr-2 icon-southEast">
                    <span class="path1" />
                    <span class="path2" />
                    <span class="path3" />
                    <span class="path4" />
                  </span>
                  <span>中心點經緯度</span>
                </div>
                <template v-if="pageState.type === 0">
                  <input
                    id="centerPointLat"
                    v-model="casePlace.bounds.centerPointLat"
                    class="setProject-textarea mb-1"
                    type="number"
                    name="centerPointLat"
                    placeholder="緯度"
                    :disabled="mapState.boundsIsLock"
                  >
                  <input
                    id="centerPointLng"
                    v-model="casePlace.bounds.centerPointLng"
                    class="setProject-textarea"
                    type="number"
                    name="centerPointLng"
                    placeholder="經度"
                    :disabled="mapState.boundsIsLock"
                  >
                </template>
                <textarea
                  v-if="pageState.type === 1"
                  id="centerPoint"
                  v-model="casePlace.bounds.centerPoint"
                  :class="['setProject-textarea', { 'border-neutral-70': casePlace.bounds.centerPoint === null }]"
                  type="text"
                  name="centerPoint"
                  placeholder="中心點經緯度"
                  cols="30"
                  rows="2"
                  disabled
                />
              </label>
            </li>
            <!--  -->
            <li v-if="pageState.type === 0" class="flex justify-end">
              <button
                class="w-1/3 column-btn-sm "
                :class="(!casePlace.bounds.centerPointLat && !casePlace.bounds.centerPointLng) || mapState.boundsIsLock ? 'btn-disabled cursor-none' : 'bg-primary-30'"
                :disabled="(!casePlace.bounds.centerPointLat && !casePlace.bounds.centerPointLng) || mapState.boundsIsLock"
                @click="setLatLngPoint"
              >
                送出
              </button>
            </li>
            <li>
              <!-- 備註 -->
              <label for="remark">
                <p class="icon-summarize labelTitle">備註 (選填)</p>
                <textarea
                  id="remark"
                  v-model="casePlace.remark"
                  class="setProject-input h-[250px]"
                  :disabled="mapState.boundsIsLock"
                  name="remark"
                  cols="30"
                  rows="2"
                />
              </label>
            </li>
          </ul>
        </div>
        <!-- 巡檢範圍設定 -->
        <ul v-if="pageState.name === 1" class="setProjectColumn step-ul">
          <li>
            <label for="date">
              <p class="icon-calendar labelTitle">巡檢日期</p>
              <VDatePicker v-model="date" :masks="masks" :popover="popover">
                <template #default="{ inputValue, inputEvents }">
                  <input
                    id="date"
                    :class="['setProject-input']"
                    type="text"
                    name="date"
                    :value="inputValue"
                    placeholder="YYYY/MM/DD"
                    :disabled="mapState.boundsIsLock"
                    v-on="inputEvents"
                    @click="dateLinkTime"
                  >
                </template>
              </VDatePicker>
            </label>
          </li>
          <li>
            <label for="timeStart">
              <p class="icon-TimeRange labelTitle">巡檢時間</p>
              <div class="flex px-3 py-4 border rounded-lg border-customGray focus:border-active">
                <VDatePicker
                  v-model="time.start"
                  mode="time"
                  :rules="timeRules"
                  :popover="popover"
                  is24hr
                >
                  <template #default="{ inputValue, inputEvents }">
                    <input
                      id="timeStart"
                      class="w-[20%]"
                      type="text"
                      name="timeStart"
                      :value="inputValue"
                      placeholder="HH : MM"
                      :disabled="mapState.boundsIsLock"
                      v-on="inputEvents"
                    >
                  </template>
                </VDatePicker>
                <p>~</p>
                <VDatePicker
                  v-model="time.end"
                  mode="time"
                  :rules="timeRules"
                  :popover="popover"
                  is24hr
                >
                  <template #default="{ inputValue, inputEvents }">
                    <input
                      id="timeEnd"
                      class="w-[20%]"
                      type="text"
                      name="timeEnd"
                      :value="inputValue"
                      placeholder="HH : MM"
                      :disabled="mapState.boundsIsLock"
                      v-on="inputEvents"
                    >
                  </template>
                </VDatePicker>
              </div>
            </label>
          </li>
          <li>
            <label for="place">
              <p class="icon-CaseField labelTitle">選擇案場</p>
              <select
                id="place"
                v-model="setNewPlan.placeID"
                name="place"
                :class="['setProject-input']"
                :disabled="mapState.boundsIsLock || pageState.type === 1"
              >
                <option value="" selected disabled>----- 下拉選擇案場 -----</option>
                <template v-for="place in placeList" :key="place.placeID">
                  <option :value="place.placeID">{{ place.placeName }}</option>
                </template>
              </select>
            </label>
          </li>
          <li>
            <label for="pilot">
              <p class="icon-Pilot labelTitle">選擇飛手</p>
              <select
                id="pilot"
                v-model="setNewPlan.droneOperator"
                name="pilot"
                :class="['setProject-input']"
                :disabled="mapState.boundsIsLock"
              >
                <option value="" selected disabled>----- 下拉選擇飛手 -----</option>
                <template v-for="operator in droneOperator" :key="operator.code">
                  <option :value="operator.code">{{ operator.name }}</option>
                </template>
              </select>
            </label>
          </li>
          <li>
            <label for="drone">
              <p class="icon-drone labelTitle">選擇無人機</p>
              <select
                id="drone"
                v-model="setNewPlan.droneID"
                name="drone"
                :class="['setProject-input']"
                :disabled="mapState.boundsIsLock"
              >
                <option value="" selected disabled>----- 下拉選擇無人機 -----</option>
                <template v-for="drone in droneList" :key="drone.droneID">
                  <option :value="drone.droneID">{{ drone.droneName }}</option>
                </template>
              </select>
            </label>
          </li>
          <li>
            <label for="temperature">
              <p class="icon-Thermostat labelTitle">溫度</p>
              <input
                id="temperature"
                v-model.number="setNewPlan.temperature"
                type="number"
                name="temperature"
                :class="['setProject-input']"
                placeholder="請輸入溫度"
                :disabled="mapState.boundsIsLock"
              >
            </label>
          </li>
          <li>
            <label for="humidity">
              <p class="icon-Humidity labelTitle">濕度</p>
              <input
                id="humidity"
                v-model.number="setNewPlan.humidity"
                type="number"
                name="humidity"
                :class="['setProject-input']"
                placeholder="請輸入濕度"
                :disabled="mapState.boundsIsLock"
              >
            </label>
          </li>
          <li>
            <label for="irradiance">
              <p class="icon-flare labelTitle">輻照度</p>
              <input
                id="irradiance"
                v-model.number="setNewPlan.irradiance"
                type="number"
                name="irradiance"
                :class="['setProject-input']"
                placeholder="請輸入輻照度"
                :disabled="mapState.boundsIsLock"
              >
            </label>
          </li>
        </ul>
      </div>
      <!-- ===== Footer ===== -->
      <div class="absolute bottom-0 w-full p-2 bg-white">
        <button
          v-if="!mapState.boundsIsLock"
          class="w-full column-btn-lg"
          :class="[
            { 'btn-disabled': !canSendData },
            { 'cursor-none': !canSendData },
            { 'bg-primary-30': canSendData }
          ]"
          :disabled="!canSendData"
          @click="nextStep"
        >
          確定
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { usePageState, useMapState, useBoundsLatLngStore, useCenterLatlngStore, useSelectPlaceStore } from '@/stores/mapState'
import moment from 'moment'

// 使用 route 方法
const route = useRoute()

const props = defineProps({
  // 案場(Place) 使用
  placeData: {
    type: Object,
    default: () => ({}),
    require: false,
  },
  // 巡檢(Inspection) 使用
  placeList: {
    type: Array,
    default: () => [],
    require: false,
  },
  droneList: {
    type: Array,
    default: () => [],
    require: false,
  },
  droneOperator: {
    type: Array,
    default: () => [],
    require: false,
  },
})

// 使用 Emit 傳出去
const emit = defineEmits(['toggleLock', 'setPlaceView', 'getFormData', 'centerLatLng'])


// 使用 Store
const pageState = usePageState()
const mapState = useMapState()
const boundsState = useBoundsLatLngStore()
const centerState = useCenterLatlngStore()
const selectPlaceState = useSelectPlaceStore()

// 檢查欄位資料是否已填並往下一步驟去
const canSendData = ref(false)
// ========== 監聽 Props 資料 ==========
// edit Place：監聽 placeData 資料
watch(() => props.placeData, (value) => {
  switch (pageState.name) {
    case 0:
      casePlace.value.name = value.placeName
      boundsState.bounds.leftTop = value.placeViewRange[0]
      boundsState.bounds.rightTop = value.placeViewRange[1]
      boundsState.bounds.leftBottom = value.placeViewRange[2]
      boundsState.bounds.rightBottom = value.placeViewRange[3]
      casePlace.value.remark = value.remark
      judgeName()
      break
    case 1:
      emit('getFormData')
      setNewPlan.value.droneID = value.droneID
      setNewPlan.value.placeID = value.placeID
      setNewPlan.value.droneOperator = value.droneOperator
      setNewPlan.value.temperature = value.temperature
      setNewPlan.value.humidity = value.humidity
      setNewPlan.value.irradiance = value.irradiance
      setNewPlan.value.startTime = value.startTime
      setNewPlan.value.endTime = value.endTime
      break
  }
}, { deep: true })

// ========== Store 監聽 =========
// 手動設定 - (監聽 Store 傳進來的經緯度)
boundsState.$subscribe(() => {
  const tempLatLng = boundsState.bounds
  casePlace.value.bounds.leftTop = `${tempLatLng.leftTop.lat}\n${tempLatLng.leftTop.lng}`
  casePlace.value.bounds.rightTop = `${tempLatLng.rightTop.lat}\n${tempLatLng.rightTop.lng}`
  casePlace.value.bounds.leftBottom = `${tempLatLng.leftBottom.lat}\n${tempLatLng.leftBottom.lng}`
  casePlace.value.bounds.rightBottom = `${tempLatLng.rightBottom.lat}\n${tempLatLng.rightBottom.lng}`
  columnFlag.value.bounds = true
})
// 中心點位置
centerState.$subscribe(() => {
  const tempLatLng = centerState.center
  // if (tempLatLng.centerPoint) {
  casePlace.value.bounds.centerPoint = `${tempLatLng.centerPoint.lat}\n${tempLatLng.centerPoint.lng}`
  // casePlace.value.bounds.centerPointLat = `${tempLatLng.centerPoint.lat}`
  // casePlace.value.bounds.centerPointLng = `${tempLatLng.centerPoint.lng}`
  // }
})

// =============== 案場(Place) 相關 ====================
// 綁定 HTML 用的資料格式
const casePlace = ref({
  name: null,
  bounds: {
    leftTop: null,
    rightTop: null,
    leftBottom: null,
    rightBottom: null,
    centerPoint: null,
    centerPointLat: null,
    centerPointLng: null,
  },
  remark: null,
})

// 欄位判斷是否有填寫
const columnFlag = ref({
  name: false,
  bounds: false,
})

// 判斷 Place Name 是否正常輸入
const judgeName = () => {
  if (casePlace.value.name !== null && casePlace.value.name !== '') {
    columnFlag.value.name = true
  } else {
    columnFlag.value.name = false
  }
}

// 判斷欄位是否已填寫
watch(() => columnFlag.value, () => {
  if (columnFlag.value.name && columnFlag.value.bounds) {
    canSendData.value = true
  }
}, { deep: true })

// Lock Button 相關動作
const openLock = () => {
  emit('toggleLock')
}

// =========================================================
// The End
// =========================================================

// =============== 巡檢(Inspection) 相關 ====================
const setNewPlan = ref({
  droneID: '',
  placeID: '',
  droneOperator: '',
  realFlightRange: [],
  startTime: null,
  endTime: null,
  planID: route.params.id,
  temperature: null,
  humidity: null,
  irradiance: null,
})
// 日期設定
const date = ref(new Date())
const masks = ref({
  input: 'YYYY/MM/DD',
})

// 判斷日期與時間是否要連動(當在手動點擊日期的時候就會連動，如果是 props 資料進來就不要連動)
let dateLink = false
const dateLinkTime = () => {
  dateLink = true
}

watch(() => date.value, (newValue) => {
  if (dateLink) {
    time.value.start = newValue
    time.value.end = newValue
  }
})

// 時間設定
const time = ref({
  start: new Date(),
  end: new Date(),
})
const timeRules = ref({
  minutes: [0, 30],
})
const popover = ref({
  visibility: 'click',
})
// 新增巡檢：把時間格式改成 UI/UX 設計模式
watch(() => time.value, () => {
  setNewPlan.value.startTime = moment(time.value.start).format('YYYY/MM/DD, HH:mm')
  setNewPlan.value.endTime = moment(time.value.end).format('YYYY/MM/DD, HH:mm')
}, { deep: true })

// 編輯巡檢：將傳進來的時間資料做格式轉換，並帶回 VCalendar 的日期時間
watch(() => setNewPlan.value.startTime, () => {
  if (pageState.name === 1 && pageState.type === 1) {
    const startDateTime = moment(setNewPlan.value.startTime).format()
    const endDateTime = moment(setNewPlan.value.endTime).format()
    date.value = startDateTime
    time.value.start = startDateTime
    time.value.end = endDateTime
  }
}, { deep: true })

// 新增巡檢：選擇案場 Select 後與 Map 連動功能
watch(() => setNewPlan.value.placeID, () => {
  if (pageState.name === 1 && pageState.type === 0) {
    const selectPlace = props.placeList.find(item => item.placeID === setNewPlan.value.placeID)
    selectPlaceState.selectPlaceView = selectPlace.placeViewRange
  }
})

// 判斷欄位是否已填寫
watch(() => setNewPlan.value, () => {
  const tempArry = []
  Object.keys(setNewPlan.value).forEach((item, index) => {
    if (index < 7) {
      tempArry.push(setNewPlan.value[item] !== '' && setNewPlan.value[item] !== null)
    }
  })
  canSendData.value = tempArry.findIndex(item => !item) === -1
  if (pageState.type === 1) {
    canSendData.value = true
  }
}, { deep: true })


// =============== 送出欄位資料到 index ====================
// 將欄位資料傳到父層去組 API 要的參數，並切換到下一步。
const nextStep = () => {
  let parameterTemp = null
  if (pageState.name === 0) {
    const boundsData = Object.values(boundsState.bounds)
    // 把 height 屬性帶進 bounds 參數裡
    boundsData.forEach((item, index) => {
      const temp = {
        height: 0,
      }
      boundsData[index] = { ...item, ...temp }
    })
    parameterTemp = {
      placeName: casePlace.value.name,
      placeAddr: '',
      remark: casePlace.value.remark === null ? '' : casePlace.value.remark,
      placeViewRange: boundsData,
      updateTime: props.placeData.updateTime,
    }
  } else if (pageState.name === 1) {
    const tempUpdateTime = {
      updateTime: props.placeData.updateTime,
    }
    parameterTemp = Object.assign(setNewPlan.value, tempUpdateTime)
  }

  // 將參數送到傳到父層
  emit('setPlaceView', parameterTemp)
  emit('toggleLock')
}
const setCenterPoint = ref(null)
// 送出中心點位
const setLatLngPoint = () => {
  setCenterPoint.value = { lat: casePlace.value.bounds.centerPointLat, lng: casePlace.value.bounds.centerPointLng }
  emit('centerLatLng', setCenterPoint.value)
}
</script>
