<template>
  <div id="CSIMap" class="w-screen h-screen" />
</template>

<script setup>
import { watch, computed, onMounted } from 'vue'
import { CSIMap } from '../script/CSIMap'
import { usePageState, useMapState, useComponentsState, useBoundsLatLngStore, useCenterLatlngStore, usePolygonStore, useSelectPlaceStore } from '@/stores/mapState'
import { drawPolygonWhite, drawPolygonPrimary, noFillPlaceStyle, fillPlaceStyle, polygonWarning } from '../script/leafletOption'

const props = defineProps({
  // 編輯"案場" & "巡檢" & "結果審核"共用
  editPolygon: {
    type: Object,
    required: false,
    default: () => {},
  },
  placeList: {
    type: Array,
    required: false,
    default: () => [],
  },
  // 巡檢結果審核清單 地圖放大縮小
  changeSize: {
    type: Boolean,
    default: false,
  },
  // 傳入 Input 輸入的中心位置
  centerLatLngPoint: {
    type: Object,
    default: () => {},
  },
  // 圖片來自的座標位置
  imgPosition: {
    type: Object,
    default: () => { },
  },
  cantClickMap: {
    type: Boolean,
    default: false,
  },
})

// 中心點輸入後 監聽資料 地圖移動到輸入位置
watch(() => props.centerLatLngPoint, () => {
  Map.map.setView([props.centerLatLngPoint.lat, props.centerLatLngPoint.lng], 17)
})
// 繪製 圖片來自的座標位置
let marker = ''
watch(() => props.imgPosition, () => {
  if (marker) {
    Map.map.removeLayer(marker)
  }
  const numberIconOption = {
    iconAnchor: [20, 50],
  }
  const markerStyle = Map.createDivIcon('numberIcon-point', '', numberIconOption)
  const markerOption = {
    icon: markerStyle,
  }
  marker = Map.addMarker(props.imgPosition, markerOption)
})
// 使用 Store
const pageState = usePageState()

const mapState = useMapState()
const componentsState = useComponentsState()
const boundsState = useBoundsLatLngStore()
const centerState = useCenterLatlngStore()
const polygonState = usePolygonStore()
const selectPlaceState = useSelectPlaceStore()


const emit = defineEmits(['toggleLock', 'getFlightRecordSummary'])

const mapModel = computed(() => mapState.model)
const mapBoundsIsLock = computed(() => mapState.boundsIsLock)
const editPolygonBtn = computed(() => componentsState.editPolygonBtn)

onMounted(() => {
  initMap(setMap)
})

// ========== 監聽 Props 資料 ==========
// All：監聽 Edit 模式傳進來的資料(含結果審核)
let inspectionPlace = null
watch(() => props.editPolygon, (value) => {
  switch (pageState.name) {
    case 0:
      drawPolygonLayer(value.placeRange, noFillPlaceStyle, value.placeViewRange)
      break
    case 1:
      if (inspectionPlace !== null) {
        Map.removeLayer(Map.layerGroup, inspectionPlace)
      }
      if (editPolygonLayer !== null) {
        Map.removeLayer(Map.layerGroup, editPolygonLayer)
        Map.removeLayer(Map.layerGroup, editButtonDom)
      }
      if (pageState.type === 1) {
        if (props.editPolygon.placeRange !== undefined) {
          inspectionPlace = Map.createdPolygon(value.placeRange, noFillPlaceStyle)
          Map.addLayerTo(inspectionPlace, Map.layerGroup)
          const polygonStyle = value.status === 1 ? polygonWarning : drawPolygonPrimary
          const isUnexecuted = value.status === 1
          // 需要被編輯的 Polygon 才用 drawPolygonLayer()
          drawPolygonLayer(value.realFlightRange, polygonStyle, value.placeViewRange, isUnexecuted)
        }
      }
      break
  }
  // 切換結果審核列表時,移除標註的桃紅色點位
  if (marker) {
    Map.map.removeLayer(marker)
  }
})

// Inspection (新增巡檢)：監聽 Customer 的所有 Place，並畫出來。
watch(() => props.placeList, (value) => {
  if (pageState.name === 1 && pageState.type === 0) {
    if (value.length === 1) {
      const inspectionPlace = Map.createdPolygon(value[0].placeRange, fillPlaceStyle)
      Map.addLayerTo(inspectionPlace, Map.map)
      Map.setFitBounds(value[0].placeViewRange)
      Map.setMaxBounds(value[0].placeViewRange)
    } else {
      const placesGroup = Map.createLayerGroup()
      value.forEach((item) => {
        const inspectionPlace = Map.createdPolygon(item.placeRange, fillPlaceStyle)
        Map.addLayerTo(inspectionPlace, placesGroup)
      })
      // 用點擊 Map 上的 Place 來做選擇(暫時不用)
      // Map.eachAllLayer(placesGroup, (layer) => {
      //   Map.on(layer, 'click', (e) => {
      //     Map.setFitBounds(e.target._latlngs)
      //     Map.setMaxBounds(e.target._latlngs)
      //   })
      // })
      Map.addLayerTo(placesGroup, Map.map)
    }
  }
})

// ========== Store 監聽 =========
// All：監聽 Store 的 MapState 並做" Map 上的各種監聽事件"與 pointsColumn 元件的 toggle
watch(mapModel, () => {
  switch (mapState.model) {
    case 0: // Show Modal
      // console.log('Map Model：Show')
      Map.switchMapOption('boxZoom', false)
      Map.switchMapOption('scrollWheelZoom', false)
      componentsState.pointsColumn = false
      Map.endPolygon()
      // 只有在"巡檢""編輯"狀態，Show Model 禁止點擊動作
      if (pageState.name === 1 && pageState.type === 1) {
        Map.off(Map.map, 'click')
      }
      break
    case 1: // Boxzoom Modal
      // console.log('Map Model：Boxzoom')
      Map.off(Map.map, 'click')
      Map.switchMapOption('boxZoom', true)
      Map.switchMapOption('scrollWheelZoom', true)
      componentsState.pointsColumn = false
      Map.endPolygon()
      getBoundsLatlng()
      break
    case 2: // Draw Modal
      // console.log('Map Model：Draw')
      Map.off(Map.map, 'boxzoomend')
      Map.off(Map.map, 'zoomend')
      Map.off(Map.map, 'moveend')
      Map.switchMapOption('boxZoom', false)
      Map.switchMapOption('scrollWheelZoom', false)
      componentsState.pointsColumn = true
      drawLayer()
      break
  }
})

// Space：監聽 Store 的 boundsIsLock 狀態
watch(mapBoundsIsLock, () => {
  if (mapState.boundsIsLock) {
    // 鎖定地圖暫時拿掉(取得四邊角度功能 v2.0 要拿掉 - 鎖定的基準要在討論)
    // let boundsArray = null
    // if (boundsState.bounds.leftTop !== null) {
    //   boundsArray = Object.values(boundsState.bounds)
    // }
    // Map.setMaxBounds(boundsArray)

    switch (pageState.name) {
      case 0: // 案場
        if (pageState.type === 1) {
          // 編輯
          Map.addLayerTo(editPolygonLayer, Map.layerGroup)
          // 這裡是放要編輯的 Polygon 經緯度
          polygonState.latlngs = pageState.name === 0 ? JSON.parse(JSON.stringify(props.editPolygon.placeRange)) : JSON.parse(JSON.stringify(props.editPolygon.realFlightRange))
        }
        break
      case 1: // 巡檢
        if (pageState.type === 1) {
          // 編輯
          // 這裡是放要編輯的 Polygon 經緯度
          polygonState.latlngs = pageState.name === 0 ? JSON.parse(JSON.stringify(props.editPolygon.placeRange)) : JSON.parse(JSON.stringify(props.editPolygon.realFlightRange))
        }
        break
    }
  } else {
    switch (pageState.name) {
      // 案場
      case 0:
        Map.setMaxBounds(setMap.mapView.initMapBounds)
        polygonState.latlngs.splice(0)
        if (pageState.type === 1) {
          Map.addLayerTo(editPolygonLayer, Map.layerGroup)
        }
        break
      // 巡檢
      case 1:
        Map.setMaxBounds(setMap.mapView.initMapBounds)
        if (editPolygonLayer !== null) {
          Map.removeLayer(Map.layerGroup, editPolygonLayer)
        }
        polygonState.latlngs.splice(0)
        if (pageState.type === 1) {
          Map.addLayerTo(editPolygonLayer, Map.layerGroup)
        }
        break
    }
  }
})


// 監聽 Store ComponentsState 裡的 editPolygonBtn 顯示或出現
watch(editPolygonBtn, () => {
  if (componentsState.editPolygonBtn) {
    if (props.cantClickMap) {
      console.log('cant click')
    } else {
      Map.addLayerTo(editButtonDom, Map.layerGroup)
      const editButton = document.getElementById('editButton')
      editButton.addEventListener('click', editPolygon)
    }
  } else {
    Map.removeLayer(Map.layerGroup, editButtonDom)
  }
})

// All：監聽 Store usePolygonStore 裡 latlng 陣列的變化
polygonState.$subscribe(() => {
  let layer = Map.drawLayer.polygon.layer
  if (layer !== null) {
    Map.removeLayer(Map.layerGroup, layer)
    Map.startPolygon()
    const tempAry = JSON.parse(JSON.stringify(polygonState.latlngs)).reverse()
    tempAry.forEach((item) => {
      Map.drawing(item)
    })
  }
})

// Inspection：監聽 Store usePolygonStore 裡 selectPolygon 陣列的變化
selectPlaceState.$subscribe(() => {
  Map.setFitBounds(selectPlaceState.selectPlaceView)
})

// ========== Init Map ==========
let Map = null
// 設定地圖相關資料
const setMap = {
  // 地圖其他設定選項
  mapOption: {
    boxZoom: false,
    zoomSnap: 0.1,
    zoomDelta: 0.1,
  },
  // 地圖初始可視範圍
  mapView: {
    viewCenter: [23.689804541429606, 120.91993590267593],
    initMapBounds: null,
    zoom: 8,
  },
  // 地圖圖資來源(以 Google 圖資為例)
  mapSource: {
    url: 'https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
    option: {
      crossOrigin: true,
      maxZoom: 20, // 地圖最大縮放級別。
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'], // 設定上方 url 中的 {s} 這個參數
      attribution: 'Map data: © Google Maps',
    },
  },
}
const initMap = (setMap) => {
  Map = new CSIMap('CSIMap', setMap.mapOption, setMap.mapView, setMap.mapSource)
  Map.setZoomPosition('bottomright')
  Map.removeControl('zoomControl') // 這個設定要在多操作看看在，再決定在哪個模式出現。
  setMap.mapView.initMapBounds = Object.values(Map.getViewBoundsLatLng(Map.map))
  Map.setMaxBounds(setMap.mapView.initMapBounds)
  Map.map.setMinZoom(setMap.mapView.zoom)
}

// ========== 設定邊界四個角經緯度 ==========
const getBoundsLatlng = () => {
  Map.on(Map.map, 'boxzoomend', (e) => {
    setBoundsStore(e)
  })
  Map.on(Map.map, 'zoomend', () => {
    setBoundsStore(Map.map)
  })
  Map.on(Map.map, 'moveend', () => {
    setBoundsStore(Map.map)
  })
}

// 取得地圖最大可視範圍四個角經緯度並轉換成 UI/UX 設計的欄位
const setBoundsStore = (layer) => {
  const tempLatLng = Map.getViewBoundsLatLng(layer)
  boundsState.bounds.leftTop = tempLatLng.northWest
  boundsState.bounds.rightTop = tempLatLng.northEast
  boundsState.bounds.leftBottom = tempLatLng.southWest
  boundsState.bounds.rightBottom = tempLatLng.southEast
  centerState.center.centerPoint = tempLatLng.centerPoint
}

// ========== 手動畫圖層 ==========
const drawLayer = () => {
  const layer = Map.drawLayer.polygon.layer
  if (layer !== null) {
    Map.removeLayer(Map.layerGroup, layer)
  }
  if (editPolygonLayer !== null) {
    Map.removeLayer(Map.layerGroup, editPolygonLayer)
  }
  const pathIconStyle = pageState.name === 0 ? 'numberIcon-circle' : 'numberIcon-square'
  const drawPolygonStyle = pageState.name === 0 ? drawPolygonWhite : drawPolygonPrimary
  Map.setIconNumberStyle(pathIconStyle)
  Map.setPolygonStyle(drawPolygonStyle)
  Map.startPolygon()
  // 在 edit 狀態
  if (polygonState.latlngs.length > 0) {
    const tempAry = JSON.parse(JSON.stringify(polygonState.latlngs)).reverse()
    tempAry.forEach((item) => {
      Map.drawing(item)
    })
  }
  Map.on(Map.map, 'click', (e) => {
    componentsState.promptWord = false
    Map.drawing(e.latlng)
    polygonState.latlngs.unshift(e.latlng)
  })
}

// ========== 畫出需要被編輯的 Polygon 才用 ==========
let editPolygonLayer = null // 存放要編輯的"案場圖層"
let editButtonDom = null // 暫存 Edit Button Dom
const drawPolygonLayer = (placeRange, polygonStyle, viewRange = [], isWarning = false) => {
  editPolygonLayer = Map.createdPolygon(placeRange, polygonStyle)
  Map.addLayerTo(editPolygonLayer, Map.layerGroup)
  Map.addLayerTo(Map.layerGroup, Map.map)
  viewRange.length === 0 ? Map.setFitBounds(placeRange) : Map.setFitBounds(viewRange)
  // 取得案場 Place 的中心點像素座標。
  const centerLatLng = editPolygonLayer.getCenter()
  const btnSet = {
    className: 'editButton',
    html: `<button class="editButton" id="editButton">
              <p class="mb-3 icon-edit"></p>
              編輯${pageState.name === 0 ? '範圍' : '任務'}
              ${isWarning ? '<div class="icon-assignment_late text-warning"></div>' : ''}
          </button>`,
  }
  editButtonDom = Map.addEditButton(btnSet, centerLatLng)


  Map.on(editPolygonLayer, 'click', () => {
    switch (pageState.name) {
      case 0:
        // 下列這個步驟會導致 projectSet 的資料無法傳輸到 index，暫時不要用
        // emit('toggleLock')
        break
      case 1:
        if (mapState.model !== 2) {
          if (componentsState.uploadDataBtn !== true) {
            mapState.model = 0
            componentsState.editPolygonBtn = true
          }
        }
        break
    }
  })
}

// 點擊 Polygon 上的編輯 Button 觸發 function
const editPolygon = () => {
  componentsState.editPolygonBtn = false
  switch (pageState.name) {
    case 0:
      Map.removeLayer(Map.layerGroup, editPolygonLayer)
      componentsState.deleteBtn = true
      setTimeout(() => {
        mapState.model = 2
      }, 300)
      break
    case 1:
      componentsState.taskContent = false
      mapState.model = 1
      mapState.boundsIsLock = false
      componentsState.deleteBtn = true
      componentsState.uploadDataBtn = true
      emit('getFlightRecordSummary')
      break
  }
}

// Map放大縮小
watch(() => props.changeSize, () => {
  setTimeout(() => {
    Map.map.invalidateSize(true, { animation: true })
    Map.setFitBounds(props.editPolygon.placeViewRange)
  }, 200)
})
</script>

