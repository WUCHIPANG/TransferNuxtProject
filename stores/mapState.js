import { ref } from 'vue'
import { defineStore } from 'pinia'

// PageState (Done)
export const usePageState = defineStore('pageState', () => {
  // name => 0：客戶管理 or 案場維護(案場範圍)、1：巡檢資料維護 or 巡檢專案維護(巡檢範圍)
  // type => 0：新增(add)、1：編輯(edit)
  const name = ref(0)
  const nameText = ref('')
  const type = ref(0)

  const reset = () => {
    name.value = 0
    nameText.value = ''
    type.value = 0
  }

  return { name, nameText, type, reset }
})

// MapState (Done)
export const useMapState = defineStore('mapState', () => {
  // 地圖狀態 (0:Show Model、1:Boxzoom Model、2:Draw Model)
  const model = ref(0)
  const boundsIsLock = ref(false)

  const reset = () => {
    model.value = 0
    boundsIsLock.value = false
  }

  return { model, boundsIsLock, reset }
})

// ComponentsState (Done)
export const useComponentsState = defineStore('componentsState', () => {
  const mapHeader = ref(false)
  const projectSet = ref(false)
  const taskContent = ref(false)
  const pointsColumn = ref(false)
  const uploadDataBtn = ref(false)
  const uploadPhotoBtn = ref(false)
  const deleteBtn = ref(false)
  const promptWordBtn = ref(false)
  const editPolygonBtn = ref(false)

  const reset = () => {
    mapHeader.value = false
    projectSet.value = false
    taskContent.value = false
    pointsColumn.value = false
    uploadDataBtn.value = false
    uploadPhotoBtn.value = false
    deleteBtn.value = false
    promptWordBtn.value = false
    editPolygonBtn.value = false
  }

  return { mapHeader, projectSet, taskContent, pointsColumn, uploadDataBtn, uploadPhotoBtn, deleteBtn, promptWordBtn, editPolygonBtn, reset }
})


// 紀錄可視範圍四個角的經緯度
export const useBoundsLatLngStore = defineStore('boundsState', () => {
  const bounds = ref({
    leftTop: null,
    rightTop: null,
    leftBottom: null,
    rightBottom: null,
  })

  const reset = () => {
    bounds.value = {
      leftTop: null,
      rightTop: null,
      leftBottom: null,
      rightBottom: null,
    }
  }

  return { bounds, reset }
})

// 紀錄可視範圍中心點的經緯度
export const useCenterLatlngStore = defineStore('centerState', () => {
  const center = ref({
    centerPoint: null,
  })

  const reset = () => {
    center.value = {
      centerPoint: null,
    }
  }

  return { center, reset }
})

// 紀錄 draw 用的 Polygon 的經緯度
export const usePolygonStore = defineStore('polygonState', () => {
  const latlngs = ref([]) // 用來存取 Draw 圖層(place 那邊之後要將 draw 跟一般 Polygon 分開)

  const reset = () => {
    latlngs.value = []
  }

  return { latlngs, reset }
})

// 紀錄巡檢用的 select space
export const useSelectPlaceStore = defineStore('selectPlaceState', () => {
  // 巡檢用
  const selectPlaceView = ref([])

  const reset = () => {
    selectPlaceView.value = []
  }

  return { selectPlaceView, reset }
})


// 紀錄該 Plan 中的 flightList 數量
export const useFlightListCount = defineStore('flightListState', () => {
  const listCount = ref(0)

  const reset = () => {
    listCount.value = 0
  }

  return { listCount, reset }
})

export const useMapLayerStore = defineStore('mapLayerState', () => {
  const layerList = ref([])

  return { layerList }
})
