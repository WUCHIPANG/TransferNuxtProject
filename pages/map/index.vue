<template>
  <div class="relative overflow-x-hidden">
    <Header
      :inspection="inspectionProject"
      @open-dialog="openBackDialog"
    />
    <ProjectSet
      v-if="componentsState.projectSet"
      :place-data="editPolygonData"
      :place-list="placeList"
      :drone-list="droneList"
      :drone-operator="droneOperator"
      @set-place-view="composedParameter"
      @toggle-lock="toggleMapLock"
      @get-form-data="getInspectionFormData"
      @center-lat-lng="getCenterLatLng"
    />
    <TaskContent
      v-if="componentsState.taskContent"
      :flight-list="flightList"
      :flight-unexecuted-reason="editPolygonData.unexecutedReason"
      @get-flight-detail="getFlightDataInf"
      @set-unexecuted-reason="setUnexecutedReason"
      @delete-flight="openCheckDelDialog"
    />
    <PointsColumn
      v-if="componentsState.pointsColumn"
      @send-polygon-layer="composedParameter"
    />
    <BtnGroup
      :flight-record="flightRecordData"
      :flight-images="flightRecordImageList"
      @open-import-flight-record="openImportFlightRecord"
      @open-import-photo="openImportPhoto"
      @delete-place-or-task="openCheckDelDialog"
    />
    <CSIMap
      :edit-polygon="editPolygonData"
      :place-list="placeList"
      :center-lat-lng-point="centerLatLngPoint"
      @toggle-lock="toggleMapLock"
      @get-flight-record-summary="switchImportBtn"
    />
    <button
      v-if="componentsState.promptWordBtn"
      class="absolute top-0 bottom-0 left-0 right-0 text-white text-font32 z-onMapSecond"
      @click="changeMapModel"
    >
      {{ pageState.name === 0 ? '點擊地圖規劃案場範圍' : '點擊規劃本次飛行任務範圍' }}
    </button>
    <!-- 匯入資訊 Dialog -->
    <UploadInfo
      v-model="uploadDialog.importFlightRecord"
      :plan-id="IDGroup.plan"
      :plan-flight-id="IDGroup.planFlight"
      :drone-brand="droneData.droneBrand"
      @show-upload-img-btn="updateUploadStatus"
    />
    <!-- 匯入圖片 Dialog -->
    <UploadImage
      v-model="uploadDialog.importImageRecord"
      :plan-id="IDGroup.plan"
      :plan-flight-id="IDGroup.planFlight"
    />
    <!-- 回上一頁彈窗 -->
    <Dialog
      v-model="backDialog.isShow"
      class="z-onMapFirst"
    >
      <template #title>{{ backDialog.msg.title }}</template>
      <template #detail>{{ backDialog.msg.detail }}</template>
      <template #cancelButtonText>取消</template>
      <template #confirmButton>
        <button class="modal-button text-active bg-activeBG hover:bg-activeBGHover" @click="back">確定</button>
      </template>
    </Dialog>
    <!-- 確認刪除彈窗 -->
    <Dialog
      v-model="checkDialog.isShow"
      class="z-onMapFirst"
    >
      <template #title>{{ checkDialog.msg.title }}</template>
      <template #detail>{{ checkDialog.msg.detail }}</template>
      <template #cancelButtonText>取消</template>
      <template #confirmButton>
        <button class="modal-button text-active bg-activeBG hover:bg-activeBGHover" @click="deleteData">確定</button>
      </template>
    </Dialog>
    <!-- 步驟完成彈窗 -->
    <Dialog
      v-model="finishDialog.isShow"
      :have-cancel-btn="finishDialog.haveCencelBtn"
      class="z-onMapFirst"
    >
      <template #title>{{ finishDialog.msg.title }}</template>
      <template #detail>{{ finishDialog.msg.detail }}</template>
      <template #confirmButton>
        <button class="w-full modal-button text-active bg-activeBG hover:bg-activeBGHover" @click="back">確定</button>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance, onUnmounted, inject, watch } from 'vue'
import {
  usePageState,
  useMapState,
  useComponentsState,
  usePolygonStore,
  useFlightListCount,
  useSelectPlaceStore,
  useBoundsLatLngStore,
} from '@/stores/mapState'
const { proxy } = getCurrentInstance()
// 地圖客制元件
import CSIMap from './components/CustomCSIMap.vue'
import Header from './components/CustomMapHeader.vue'
import ProjectSet from './components/CustomProjectSet.vue'
import TaskContent from './components/CustomTaskContent.vue'
import PointsColumn from './components/CustomPointsColumn.vue'
import BtnGroup from './components/CustomBtnGroup.vue'
// 檔案上傳相關元件
import UploadInfo from '../inspectionProject/components/CustomUploadInfoModal.vue'
import UploadImage from '../inspectionProject/components/CustomUploadImageModal.vue'
// 基本元件
import Dialog from '@/components/BaseModal.vue'
import { setAlertMessage } from '@/utils/messages.js'

// 取得最外層 index 的 reload 方法
const reload = inject('reload')

// 使用 route 方法
const route = useRoute()
const router = useRouter()

// 使用 Store
const pageState = usePageState()
const mapState = useMapState()
const componentsState = useComponentsState()
const polygonState = usePolygonStore()
const flightListState = useFlightListCount()
const selectPlaceState = useSelectPlaceStore()
const boundsState = useBoundsLatLngStore()
// 存放 ID 用
const IDGroup = ref({
  customer: null,
  place: null,
  plan: null,
  planFlight: null,
  inspectionType: null,
  drone: null,
})

// 存放案場 & 巡檢 Edit 時使用的 Data
const editPolygonData = ref({})

// 回 List 頁確認彈窗
const backDialog = ref({
  isShow: false,
  msg: {
    title: '',
    detail: '確定後將回到列表',
  },
  prevPage: null,
})

// 再次確認用彈窗
const checkDialog = ref({
  isShow: false,
  msg: {
    title: '確認刪除?',
    detail: '請確認是否刪除',
  },
})

// 功能完成提示彈窗
const finishDialog = ref({
  isShow: false,
  msg: {
    title: '',
    detail: '確定後將回到列表',
  },
  haveCencelBtn: false,
})

// ========== Index 初始載入時，取得 Url 資訊與 MapState、ComponentsState 切換 ==========

// 1. 取得 Url 上的路徑與參數來切換 pageState
const getPageState = (route) => {
  const pageTemp = route.path
  const { type } = route.params
  if (pageTemp.indexOf('customerManage') > -1) {
    pageState.name = 0
    pageState.nameText = 'customerManage'
  } else if (pageTemp.indexOf('placeManage') > -1) {
    pageState.name = 0
    pageState.nameText = 'placeManage'
  } else if (pageTemp.indexOf('inspectionDataMaintain') > -1) {
    pageState.name = 1
    pageState.nameText = 'inspectionDataMaintaine'
  } else if (pageTemp.indexOf('inspectionManage') > -1) {
    pageState.name = 1
    pageState.nameText = 'inspectionManage'
  } else {
    console.log('路徑匹配 PageState 錯誤')
  }
  switch (type) {
    case 'add':
      pageState.type = 0
      break
    case 'edit':
      pageState.type = 1
      break
  }
}

// 2. 從 URL 上面取的 customerID、placeID、planID 並 Call 相對應的 API
const getIDParameter = () => {
  const { name, type } = pageState
  switch (name) {
    case 0:
      // console.log('取 URL 判斷為 => 案場')
      IDGroup.value.customer = route.params.id
      APIParameter.value.customerID = IDGroup.value.customer
      if (type === 0) {
        backDialog.value.msg.title = '捨棄新增案場'
      } else {
        backDialog.value.msg.title = '捨棄編輯案場'
        IDGroup.value.place = route.query.placeId
        getPlaceDetail(IDGroup.value.place)
      }
      break
    case 1:
      // console.log('取 URL 判斷為 => 巡檢')
      IDGroup.value.plan = route.params.id
      getInspectionDetail(IDGroup.value.plan)
      getFlightList(IDGroup.value.plan)
      if (type === 0) {
        backDialog.value.msg.title = '捨棄新增任務'
      } else {
        backDialog.value.msg.title = '捨棄編輯任務'
      }
      break
  }
}

// 3. 依照 Page name & type 做最初的 components 載入，並做 Map Model 切換
const initComponents = (pageState) => {
  componentsState.projectSet = false
  componentsState.taskContent = false
  switch (pageState.name) {
    case 0:
      // type === 0 & type === 1 都使用下列設定
      componentsState.projectSet = true
      mapState.model = 1 // 切換 Map Model 為 Boxzoom
      break
    case 1:
      componentsState.mapHeader = true
      // 這邊之後還要先 call API 取的資料看有沒有 flight list 在元件切換
      if (pageState.type === 0) {
        componentsState.projectSet = true
      } else {
        componentsState.taskContent = true
      }
      break
  }
}

// ========== 地圖鎖定功能 ==========
// 在 add 與 edit 不同功能時，針對"鎖定地圖"後會有不一樣的 MapState.model 與顯示不同元件。
const toggleMapLock = () => {
  mapState.boundsIsLock = !mapState.boundsIsLock
  switch (pageState.name) {
    case 0:
      // 新增模式
      if (pageState.type === 0) {
        if (mapState.boundsIsLock) {
          componentsState.promptWordBtn = true
        } else {
          mapState.model = 1
          componentsState.promptWordBtn = false
        }
      } else {
        // 編輯模式
        if (mapState.boundsIsLock) {
          mapState.model = 0
          componentsState.editPolygonBtn = true
        } else {
          componentsState.editPolygonBtn = false
          mapState.model = 1
        }
      }
      break
    case 1:
      if (pageState.type === 0) {
        if (mapState.boundsIsLock) {
          componentsState.promptWordBtn = true
        } else {
          mapState.model = 1
          componentsState.promptWordBtn = false
        }
      } else {
        // 編輯模式
        if (mapState.boundsIsLock) {
          setTimeout(() => {
            mapState.model = 2
          }, 300)
        } else {
          mapState.model = 1
        }
      }
      break
  }
}

// ========== 地圖操作流程 ==========
// Map Model 轉場 1(Boxzoom) => 2(Draw)：操作提示字的 Click 動作。
const changeMapModel = () => {
  mapState.model = 2
  componentsState.promptWordBtn = false
}

// ========== 組合 API 所需的參數 ==========
// 組合案場(Place) & 巡檢(Inspection) API 需要的參數(data)與 Call API
const APIParameter = ref({})
const composedParameter = (parameter, callAPI = null) => {
  Object.assign(APIParameter.value, parameter)
  switch (callAPI) {
    case 'addPlace':
      addNewPlace(APIParameter.value)
      break
    case 'editPlace':
      editPlaceDetail(IDGroup.value.place, APIParameter.value)
      break
    case 'addPlanFlight':
      addPlanFlight(APIParameter.value)
      break
    case 'editPlanFlight':
      editFlightDetail(IDGroup.value.planFlight, APIParameter.value)
      break
  }
}

const centerLatLngPoint = ref(null)
const getCenterLatLng = (point) => {
  centerLatLngPoint.value = point
}

// ========== 開啟 Dialog Model & 回到上一頁 ==========

const getPrevPage = () => {
  if (mapState.model === 0) {
    if (flightListState.listCount > 0 && componentsState.projectSet) {
      backDialog.value.prevPage = { name: 'inspection-data-detail-map', params: { id: IDGroup.value.plan, type: 'edit' }}
    } else {
      backDialog.value.prevPage = { name: pageState.nameText === 'inspectionDataMaintaine' ? 'inspection-data-list' : 'inspection-manage-list' }
    }
  } else {
    if (flightListState.listCount > 0) {
      backDialog.value.prevPage = { name: 'inspection-data-detail-map', params: { id: IDGroup.value.plan, type: 'edit' }}
    } else {
      backDialog.value.prevPage = { name: pageState.nameText === 'inspectionDataMaintaine' ? 'inspection-data-list' : 'inspection-manage-list' }
    }
  }
}

const openBackDialog = () => {
  backDialog.value.isShow = true
  getPrevPage()
}

const back = () => {
  const back = router.options.history.state.back
  switch (pageState.name) {
    case 0:
      if (back === '/customerManage/add') {
        proxy.$TOOL.session.set('PAGE_TEMP_ID', IDGroup.value.customer)
        router.back()
      } else {
        router.back()
      }
      break
    case 1:
      if (backDialog.value.prevPage === null) {
        getPrevPage()
      }
      router.push(backDialog.value.prevPage)
      if (backDialog.value.prevPage.name === 'inspection-data-detail-map') {
        setTimeout(() => {
          reload()
        }, 200)
      }
      break
  }
}

// ========== 刪除案場(Place) or 巡檢(Inspection) ==========
let deleteListID = null
const openCheckDelDialog = (id) => {
  checkDialog.value.isShow = true
  deleteListID = id
}
const deleteData = () => {
  switch (pageState.name) {
    case 0:
      deletePlace(IDGroup.value.place)
      break
    case 1:
      deleteListID !== undefined ? deleteFlight(deleteListID) : deleteFlight(IDGroup.value.planFlight)
      break
  }
}

// ========== 開啟匯入巡檢資料與巡檢圖片相關 ==========

// 上傳檔案 Dialog
const uploadDialog = ref({
  importFlightRecord: false,
  importImageRecord: false,
})

// 取得巡檢飛行(Flight)資料(detail)、飛行紀錄檔案(FlightRecord)、飛行圖片記錄清單(FlightRecordImagesList)
const getFlightDataInf = (planFlightID) => {
  IDGroup.value.planFlight = planFlightID
  getFlightDetail(planFlightID)
  const params = {
    planFlightID: planFlightID,
  }
  getFlightRecord(params)
  getFlightRecordImageList(planFlightID)
}

// 判斷是要顯示"匯入巡檢"或"匯入圖片"按鈕
const switchImportBtn = () => {
  if (flightRecordData.value.recordCount === undefined) {
    componentsState.uploadDataBtn = true
  } else if (flightRecordData.value.recordCount !== undefined && flightRecordImageList.value.length === 0) {
    componentsState.uploadDataBtn = false
    componentsState.uploadPhotoBtn = true
  } else {
    componentsState.uploadDataBtn = true
    componentsState.uploadPhotoBtn = true
  }
}

// 開啟上傳巡檢飛行紀錄檔案 Dialog
const openImportFlightRecord = () => {
  uploadDialog.value.importFlightRecord = true
}

// 切換上傳欄位 Disabled 狀態
const isDisabledConfirm = ref(true)
const updateUploadStatus = (status) => {
  if (status === true) {
    isDisabledConfirm.value = false
    componentsState.uploadDataBtn = false
    componentsState.uploadPhotoBtn = true
  }
}

// 開啟上傳巡檢照片檔案 Dialog
const openImportPhoto = () => {
  uploadDialog.value.importImageRecord = true
}

// 匯入圖片
const goUpload = ref(false)

watch(() => uploadDialog.value.importImageRecord, () => {
  if (uploadDialog.value.importImageRecord === false) {
    activeConfirmBtn(uploadDialog.value.importImageRecord)
  }
}, { deep: true })

const activeConfirmBtn = (isActive) => {
  if (isActive === true) {
    isDisabledConfirm.value = false
  } else {
    isDisabledConfirm.value = true
    goUpload.value = false
  }
}

// ========== 巡檢：飛行資料未執行原因 ==========
const setUnexecutedReason = (unexecutedReason) => {
  const params = {
    unexecutedReason: unexecutedReason.reason,
    updateTime: editPolygonData.value.updateTime,
  }
  editUnexecutedReason(unexecutedReason.planFlightID, params)
}

// ========== 巡檢：取得表單欄位下拉選單資料列表 ======
const getInspectionFormData = () => {
  getDroneList()
  getPlaceList()
  getDroneOperatorList()
}

// ========== 案場相關 API 區 ==========
// API：新增案場資訊
const addNewPlace = async(data) => {
  try {
    const res = await proxy.$API.place.add.post(data)
    if (res.status === 'success') {
      finishDialog.value.isShow = true
      finishDialog.value.msg.title = '新增案場完成'
    }
  } catch (err) {
    console.log(err)
  }
}
// API：取得案場清單
const placeList = ref([])
const getPlaceList = async() => {
  const params = {
    customerID: IDGroup.value.customer,
    page: 1,
    pageSize: 10,
  }
  try {
    const res = await proxy.$API.place.list.get(params)
    if (res.status === 'success' && res.message === '撈取成功') {
      placeList.value = res.responseData
    } else {
      finishDialog.value.isShow = true
      finishDialog.value.msg.title = `案場${res.message}，請新增案場`
    }
  } catch (err) {
    console.log(err)
  }
}
// API：取得案場資訊
const getPlaceDetail = async(placeID) => {
  try {
    const res = await proxy.$API.place.detail.get(placeID)
    if (res.status === 'success') {
      editPolygonData.value = JSON.parse(JSON.stringify(res.responseData))
      polygonState.latlngs = JSON.parse(JSON.stringify(editPolygonData.value.placeRange))
    }
  } catch (err) {
    console.log(err)
  }
}
// API：編輯案場資訊
const editPlaceDetail = async(placeID, data) => {
  try {
    const res = await proxy.$API.place.update.put(placeID, data)
    if (res.status === 'success') {
      finishDialog.value.isShow = true
      finishDialog.value.msg.title = res.message
    } else if (res.status === 'fail') {
      finishDialog.value.isShow = true
      finishDialog.value.msg.title = res.message
      // 之後優化時這邊要在增加顯示更新失敗的訊息或流程。(6/26)
    }
  } catch (err) {
    console.log(err)
  }
}
// API：刪除案場
const deletePlace = async(placeID) => {
  try {
    const res = await proxy.$API.place.delete.delete(placeID)
    if (res.status === 'success') {
      finishDialog.value.isShow = true
      finishDialog.value.msg.title = res.message
    } else {
      finishDialog.value.isShow = true
      finishDialog.value.msg.title = res.message
    }
  } catch (err) {
    console.log(err)
  }
}

// ========== 巡檢相關 API 區 ==========
// API：新增巡檢飛行資料
const addPlanFlight = async(params) => {
  try {
    const res = await proxy.$API.plan.flight.add.post(params)
    if (res.status === 'success') {
      finishDialog.value.isShow = true
      finishDialog.value.msg.title = '新增巡檢任務完成'
      getFlightList(IDGroup.value.plan)
    }
  } catch (err) {
    console.log(err)
  }
}
// API：取得巡檢飛行資料清單
const flightList = ref([])
const getFlightList = async(planID) => {
  const params = {
    planID,
    page: 1,
    pageSize: 99,
  }
  try {
    const res = await proxy.$API.plan.flight.list.get(params)
    if (res.status === 'success') {
      flightList.value = JSON.parse(JSON.stringify(res.responseData))
      flightListState.listCount = flightList.value !== null ? flightList.value.length : 0
    }
  } catch (err) {
    console.log(err)
  }
}
// 給 Map 巡檢模式
const inspectionProject = ref({
  name: null,
  customer: null,
  type: null,
})
// API：取得巡檢"專案"(Plan)詳細資料
const getInspectionDetail = async(planID) => {
  try {
    const res = await proxy.$API.plan.project.detail.get(planID)
    if (res.status === 'success') {
      const data = res.responseData
      IDGroup.value.customer = data.customerID
      IDGroup.value.inspectionType = data.inspectionTypeID
      inspectionProject.value.name = data.planName
      inspectionProject.value.customer = data.customerName
      inspectionProject.value.type = data.inspectionTypeName
      // 當在巡檢頁面 & 新增巡檢時
      if (pageState.name === 1 && pageState.type === 0) {
        // 取得表單欄位下拉選單資料
        getInspectionFormData()
      }
    }
  } catch (err) {
    console.log(err)
  }
}
// API：取得巡檢"飛行"(Flight)單筆資料
const getFlightDetail = async(planFlightID) => {
  try {
    const res = await proxy.$API.plan.flight.detail.get(planFlightID)
    if (res.status === 'success') {
      editPolygonData.value = JSON.parse(JSON.stringify(res.responseData))
      IDGroup.value.planFlight = editPolygonData.value.planFlightID
      IDGroup.value.drone = editPolygonData.value.droneID
      getDroneData(IDGroup.value.drone)
      mapState.boundsIsLock = false
      componentsState.editPolygonBtn = false
    }
  } catch (err) {
    console.log(err)
  }
}
// API：修改巡檢飛行資料
const editFlightDetail = async(planFlightID, params) => {
  try {
    const res = await proxy.$API.plan.flight.edit.put(planFlightID, params)
    if (res.status === 'success' && res.message === '修改成功') {
      finishDialog.value.isShow = true
      finishDialog.value.msg.title = res.message
    }
  } catch (err) {
    console.log(err)
  }
}
// API：修改巡檢飛行狀態為為執行(設置未執行原因)
const editUnexecutedReason = async(planFlightID, params) => {
  try {
    const res = await proxy.$API.plan.flight.unexecutedReason.put(planFlightID, params)
    if (res.status === 'success' && res.message === '修改成功') {
      finishDialog.value.isShow = true
      finishDialog.value.msg.title = res.message
    } else {
      finishDialog.value.isShow = true
      finishDialog.value.msg.title = res.message
    }
  } catch (err) {
    console.log(err)
  }
}
// API：刪除巡檢飛行資料
const deleteFlight = async(planFlightID) => {
  try {
    const res = await proxy.$API.plan.flight.delete.delete(planFlightID)
    if (res.status === 'success' && res.message === '刪除成功') {
      getFlightList(IDGroup.value.plan)
      checkDialog.value.isShow = false
      if (mapState.model === 0) {
        setAlertMessage('success', '巡檢任務刪除成功！', false)
      }
      if (mapState.model === 1 || mapState.model === 2) {
        finishDialog.value.isShow = true
        finishDialog.value.msg.title = res.message
      }
      editPolygonData.value = {}
    }
  } catch (err) {
    console.log(err)
  }
}

// ========== 巡檢紀錄(FlighRecord)相關 API 區 ==========
// API：取得飛行紀錄摘要(FlightRecord 檔案)
const flightRecordData = ref({})
const getFlightRecord = async(params) => {
  flightRecordData.value = {}
  try {
    const res = await proxy.$API.flightRecord.summary.get(params)
    if (res.status === 'success' && (res.message === '撈取成功' || res.message === '查無資料')) {
      flightRecordData.value = res.responseData === null ? {} : res.responseData
    }
  } catch (err) {
    console.log(err)
  }
}

// API：取得巡檢圖片紀錄清單
const flightRecordImageList = ref({})
const getFlightRecordImageList = async(planFlightID) => {
  const params = {
    planFlightID,
    page: 1,
    pageSize: 99,
  }
  try {
    const res = await proxy.$API.flightRecord.imgList.get(params)
    if (res.status === 'success' && res.message === '撈取成功') {
      flightRecordImageList.value = res.responseData
    }
  } catch (err) {
    console.log(err)
  }
}

// ========== 無人機相關 API 區 ==========
// API：取得無人機列表
const droneList = ref([])
const getDroneList = async() => {
  const params = {
    page: 1,
    pageSize: 10,
  }
  try {
    const res = await proxy.$API.drone.list.get(params)
    if (res.status === 'success') {
      droneList.value = res.responseData
    }
  } catch (err) {
    console.log(err)
  }
}
// API：取得單筆無人機載具資料
const droneData = ref({})
const getDroneData = async(droneID) => {
  try {
    const res = await proxy.$API.drone.detail.get(droneID)
    if (res.status === 'success' && res.message === '撈取成功') {
      droneData.value = res.responseData
    }
  } catch (err) {
    console.log(err)
  }
}
// API：取得飛手資料
const droneOperator = ref([])
const getDroneOperatorList = async() => {
  try {
    const res = await proxy.$API.role.droneOperatorList.get()
    if (res.status === 'success') {
      droneOperator.value = res.responseData
    }
  } catch (err) {
    console.log(err)
  }
}


// ========== 生命週期 ==========

// 1. 取得 Url 並判斷 Page Name 與 type
getPageState(route)
// 2. 取得 ID 並做儲存
getIDParameter()

onMounted(() => {
  // 3. 依照 Page name & type 做最初的 components 載入
  initComponents(pageState)
})

onUnmounted(() => {
  // 卸載時，狀態恢復預設。
  pageState.reset()
  mapState.reset()
  componentsState.reset()
  polygonState.reset()
  flightListState.reset()
  selectPlaceState.reset()
  boundsState.reset()
})


</script>
