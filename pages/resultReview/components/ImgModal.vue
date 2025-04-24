<template>
  <TransitionRoot
    appear
    :show="isOpen"
    as="template"
    class="z-onMapFirst"
  >
    <Dialog as="div" class="relative">
      <!-- 背景霧面 -->
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="z-10 fixed inset-0 bg-modalBG backdrop-blur-[1px]" />
      </TransitionChild>
      <div class="fixed inset-0 z-40 overflow-y-auto">
        <div class="flex items-center justify-center min-h-full p-4 text-center relative">
          <!-- 各框線詳細資料 開始 -->
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class=" relative rounded-xl text-left align-middle transition-all  flex justify-center items-center">
              <div ref="imgDialog" class="max-w-full max-h-full">
                <div ref="divImg" class="relative flex justify-center items-center">
                  <span
                    class="z-highest icon-close cursor-pointer absolute -top-5 -right-12 text-white bg-[#CCCCCC4D] p-3 rounded-lg"
                    @click="close"
                  />

                  <div class=" border-8 border-white rounded-2xl relative">
                    <!-- 繪製用 -->
                    <div
                      v-if="canDrawRectangle"
                      :style="{ width: imgW + 'px', height: imgH + 'px' }"
                      class="bg-[#0000004D] absolute top-0"
                    />
                    <canvas v-show="canDrawRectangle" ref="canvasD" class="max-w-full max-h-full absolute top-0" />
                    <!-- 原始方框資料 -->
                    <canvas ref="canvasRef" class="max-w-full max-h-full" />
                    <div class=" h-[65px] bg-white flex justify-center items-center relative">
                      <!-- canDrawRectangle -->
                      <div
                        v-if="canDrawRectangle"
                        class="mt-2 w-[184px] bg-[#4D4D4D] rounded-[88px] p-3 border border-[#FFFFFF40]"
                      >
                        <div class=" z-highest">
                          <div class=" flex justify-center text-white text-font24">
                            繪製範圍
                          </div>
                        </div>
                      </div>
                      <!-- 問題總數 -->
                      <template v-else>
                        <div
                          v-if="selectedAiErrorPointID === null"
                          class="mt-2 w-[184px] bg-[#4D4D4D] rounded-[88px] p-3 border border-[#FFFFFF40]"
                        >
                          <div class=" z-highest">
                            <div class=" flex justify-center text-white text-font24">
                              問題總數 {{ errorRangeTotal }}
                            </div>
                          </div>
                        </div>
                        <!-- 方框切換 -->
                        <div v-else class="mt-2 w-[184px] bg-[#4D4D4D] rounded-[88px] p-3 border border-[#FFFFFF40]">
                          <div class=" z-highest">
                            <div class=" flex justify-between">
                              <div
                                class="rounded-full flex justify-center items-center"
                                :class="errorRange === 1 ? 'text-[#D9D9D940]' : 'cursor-pointer text-white'"
                                @click="errRangeLeft"
                              >
                                <span class="icon-arrow-left " />
                              </div>
                              <span class="tracking-wider mx-3 text-font24 leading-8 text-white">
                                {{ errorRange }} / {{ errorRangeTotal }}
                              </span>
                              <div
                                class="rounded-full flex justify-center items-center"
                                :class="errorRange === errorRangeTotal ? 'text-[#D9D9D940]' : 'cursor-pointer text-white'"
                                @click="errRangeRight"
                              >
                                <span class="icon-arrow-right " />
                              </div>
                            </div>
                          </div>
                        </div>
                      </template>
                      <!-- 啟動繪製按鈕 -->
                      <button
                        id="add-rectangle-button"
                        class="drawBtn ml-5 mt-2 w-32 h-16 bg-primary-60 text-font24 text-white rounded-2xl absolute right-2 hover:bg-primary-70"
                        @click="addBox"
                      >
                        <div class="mx-auto text-center">
                          <span>新增範圍</span>
                        </div>
                      </button>
                    </div>
                  </div>
                  <div
                    v-if="showDialog"
                    ref="dialogRef"
                    class=" absolute z-highest w-[450px]"
                    :style="{
                      bottom: '-110px',
                      left: '-230px'
                    }"
                  >
                    <div class="w-full h-full relative">
                      <!-- 詳細彈窗三角形 -->
                      <div
                        v-if="trianglePosition === 'left'"
                        class="triangleLeft z-10 absolute -left-3 top-1/2 transform -translate-y-1/2"
                      />
                      <div
                        v-if="trianglePosition === 'right'"
                        class="triangleRight z-10 absolute -right-3 top-1/2 transform -translate-y-1/2"
                      />
                      <!-- 彈窗 各方框詳細內容 -->
                      <div class=" w-full h-full rounded-[11px] bg-white mapPicTip relative">
                        <span
                          v-if="!canDrawRectangle"
                          class="icon-close cursor-pointer rounded  text-neutral-20 px-1 py-1 text-xs absolute top-1 right-1"
                          @click="showDialog = false"
                        />
                        <table class="border-collapse w-full h-full p-4 ">
                          <tr>
                            <td class="h-[20%] px-2 py-3 text-center w-[30%] text-font16 border-neutral-90 border-r border-b">
                              巡檢結果
                            </td>
                            <td class="px-3 text-left w-[70%] text-font16Regular border-neutral-90 border-b leading-5">
                              <div class="flex input-type h-8 relative cursor-pointer input-shadow w-11/12">
                                <select v-model="selectedEvent" class="form-input input-select border-none bg-white px-3" @change="handleChange">
                                  <option value="0" disabled>選擇結果</option>
                                  <option
                                    v-for="event in eventRanks"
                                    :key="event.errorEventID"
                                    :value="event.errorEventID"
                                  >
                                    {{ event.eventName }}
                                  </option>
                                </select>
                                <span class="icon-arrow-down absolute right-2 top-1/2 transform -translate-y-1/2 text-xs" />
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td class="h-[20%] px-2 py-3 text-center text-font16 border-neutral-90 border-r border-b border-t ">
                              異常等級
                            </td>
                            <td class="px-3 text-left text-font16Regular border-neutral-90 border-b border-t leading-5">
                              <!-- <div class="flex input-type h-8 relative cursor-pointer input-shadow w-11/12">
                                <select v-model="selectedRank" class="form-input input-select border-none bg-white px-3">
                                  <option value="0" disabled>選擇等級</option>
                                  <option v-for="rank in filteredRanks" :key="rank.errorRankID" :value="rank.errorRankID">

                                    {{ rank.errorRankName }}
                                  </option>
                                </select>
                                <span class="icon-arrow-down absolute right-2 top-1/2 transform -translate-y-1/2 text-xs" />
                              </div> -->
                              <Multiselect
                                v-model="selectedRank"
                                class="imgMultiselect custom-multiselect-class"
                                placeholder="選擇異常等級"
                                label="errorRankName"
                                track-by="errorRankID"
                                :options="filteredRanks"
                                :multiple="false"
                                select-label=""
                                deselect-label=""
                              >
                                <template #noOptions>請先選擇巡檢結果</template>
                              </Multiselect>
                            </td>
                          </tr>
                          <tr>
                            <td class="h-[20%] px-2 py-3 text-center text-font16 border-neutral-90 border-r border-b border-t ">
                              迴路編號
                            </td>
                            <td class="px-3 text-left text-font16Regular border-neutral-90 border-b border-t leading-5">
                              <div class="flex input-type h-8  relative cursor-pointer input-shadow w-11/12">
                                <input
                                  v-model="picInfo.loopSeqNo"
                                  type="text"
                                  class="form-input border-none bg-white w-full"
                                >
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td colspan="2" class="border-t w-full h-12">
                              <button
                                v-if="canDrawRectangle"
                                class="w-1/2 h-full text-danger border-r"
                                @click="cancelErrorPoint"
                              >
                                <span>取消</span>
                              </button>
                              <button
                                v-else
                                class="w-1/2 h-full text-danger border-r"
                                @click="delErrorPoint"
                              >
                                <span>刪除</span>
                              </button>
                              <button class="w-1/2 h-full text-active" @click="actionErrorPoint">確定</button>
                            </td>
                          </tr>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
  <MsgTip v-model="openDialog" class="z-highest">
    <template #title>訊息</template>
    <template #detail>{{ successMsg }}</template>
    <template #confirmButton>
      <button class="modal-button text-neutral-50 hover:bg-neutral-98" @click="confirmApiMsg">確定</button>
    </template>
  </MsgTip>
</template>
<script setup>
import { computed, onMounted, watch, ref, reactive, getCurrentInstance } from 'vue'
import MsgTip from '@/components/BaseModal.vue'
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.css'
import { setAlertMessage } from '@/utils/messages.js'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
} from '@headlessui/vue'
import { useVModel } from '@vueuse/core'
const { proxy } = getCurrentInstance()
const props = defineProps({
  showImgModal: Boolean,
  data: {
    type: Array,
    default: () => {
      return {}
    },
  },
  eventRanks: {
    type: Array,
    default: () => {
      return {}
    },
  },
})
const isOpen = useVModel(props, 'showImgModal')
const imgID = useVModel(props, 'data') // 每個點的異常圖片清單
const emit = defineEmits(['closeImgModal', 'imgPosition'])

onMounted(() => {
  if (canvasRef.value) {
    canvas = canvasRef.value
    ctx = canvas.getContext('2d')
  }
})

// ------ 關閉Error圖片彈窗 ------>
const closeType = ref(false)
const close = () => {
  isOpen.value = false
  showDialog.value = false
  emit('closeImgModal', false)
  emit('update:file', '')
  errorRange.value = 1
  errorRangeTotal.value = 0
  selectedAiErrorPointID.value = null
  showFilterErrPoint.value = false
  closeType.value = true
  canDrawRectangle.value = false
}
// ------ API: 取得ranks列表資料顏色 ------>
const selectedEvent = ref(0)
const selectedRank = ref([])
// ------ Ranks資料重組 下拉選單使用 ------>
const filteredRanks = computed(() => {
  const selectedEventObj = props.eventRanks.find(event => event.errorEventID === selectedEvent.value)
  if (selectedEventObj) {
    let newEventObj = []
    selectedEventObj.errorRanks.forEach((rank) => {
      newEventObj.push({ errorRankID: rank.errorRankID, errorRankName: `等級${rank.errorRank} - ${rank.errorRankName}` })
    })
    return newEventObj
  }

  return []
})
const options = ref([
  { errorRankID: 'Vue.js', errorRankName: 'JavaScript' },
  { errorRankID: 'Rails', errorRankName: 'Ruby' },
  { errorRankID: 'Sinatra', errorRankName: 'Ruby' },
  { errorRankID: 'Laravel', errorRankName: 'PHP' },
  { errorRankID: 'Phoenix', errorRankName: 'Elixir' },
])
// 巡檢結果切換時清空選擇的等級
const handleChange = () => {
  selectedRank.value = []
}
// ------ API: 進入後取得Image圖片及資料 ------>
const picRes = ref() // 背景圖片位置
const errorList = ref() // 圖片的error點位
const infoList = ref() // 圖片其他資訊
const pixWidth = ref()
const pixHeight = ref()
const position = ref()
const getImgErr = async() => {
  try {
    closeType.value = false
    const res = await proxy.$API.inspectionManage.imageInfo.get(imgID.value)
    infoList.value = res.responseData
    pixWidth.value = infoList.value.pixWidth
    pixHeight.value = infoList.value.pixHeight
    errorList.value = res.responseData.errorPointList // 點位資料
    errorRangeTotal.value = errorList.value.length
    position.value = [infoList.value.lat, infoList.value.lng]
    emit('imgPosition', position.value) // 送出圖片所在點位
    // 取得圖片
    picRes.value = ''
    picRes.value = import.meta.env.VITE_APP_IMG_BASE_URL + imgID.value

    drawMark() // 繪製
  } catch (err) {
    console.log('err', err)
  }
}

// ------ imgID資料更新時 重新取得img資訊 ------>
watch(imgID, () => {
  if (imgID.value) {
    getImgErr()
  }
}, { deep: true })

const showDialog = ref(false) // 方框詳細內容
const showDialogCoordinates = ref({ x: 0, y: 0 }) // 方框位置

// ------ Error框 ------>
const errorRange = ref(1) // error方框
const errorRangeTotal = ref(0) // error方框總數


// 切換errRange框(右)
const errRangeRight = () => {
  updateErrorRange(errorRange.value + 1)
}

// 切換errRange框(左)
const errRangeLeft = () => {
  updateErrorRange(errorRange.value - 1)
}

const updateErrorRange = (errValue) => {
  if (errValue >= 1 && errValue <= errorRangeTotal.value) {
    errorRange.value = errValue
    selectedAiErrorPointID.value = null
    showFilterErrPoint.value = false
    updateSelectedBox()
    const data = errorList.value[errorRange.value - 1]
    const pointCoords = getPointCoords(data.errorRange)
    handleCanvasClick(pointCoords.x, pointCoords.y, data, 'buttonChange')
  }
}
// ------ 更新選中的框 ------>
const updateSelectedBox = () => {
  const selectedData = errorList.value[errorRange.value - 1]
  selectedAiErrorPointID.value = selectedData ? selectedData.aiErrorPointID : null
  if (selectedAiErrorPointID.value === null) {
    showFilterErrPoint.value = false
  } else {
    showFilterErrPoint.value = true
  }
}

// ------ 點Canvas中的 Error框 或是 箭頭切換 ------>
const handleCanvasClick = (clickX, clickY, pointData, type) => {
  if (!canDrawRectangle.value) {
    for (const [index, data] of errorList.value.entries()) {
      // 右下角點座標
      const pointCoords = getPointCoords(data.errorRange)
      const withErrorRange =
        clickX >= data.errorRange[0].pixelX &&
        clickX <= pointCoords.x &&
        clickY >= data.errorRange[0].pixelY &&
        clickY <= pointCoords.y
      // 方框切換數使用 判斷是滑鼠點擊
      if (type !== 'buttonChange') {
        if (withErrorRange) {
          selectedAiErrorPointID.value = data.aiErrorPointID
          showFilterErrPoint.value = true
          errorRange.value = index + 1
          handleSelectChange(data.aiErrorPointID, pointCoords.x, pointCoords.y)
        }
      } else if (pointData.aiErrorPointID === data.aiErrorPointID) {
        selectedAiErrorPointID.value = data.aiErrorPointID
        showFilterErrPoint.value = true
        handleSelectChange(data.aiErrorPointID, pointCoords.x, pointCoords.y)
      }
    }
  }
}

// ------ 取得Error方框的右下角位置 ------>
const getPointCoords = (points) => {
  const bottomRightX = Math.max(points[0].pixelX, points[1].pixelX, points[2].pixelX, points[3].pixelX)
  const bottomRightY = Math.max(points[0].pixelY, points[1].pixelY, points[2].pixelY, points[3].pixelY)
  return { x: bottomRightX, y: bottomRightY }
}

// ------ 被選中的Error框 更新ID 重新繪製 ------>
const handleSelectChange = (aiErrorPointID, clickX, clickY) => {
  selectedAiErrorPointID.value = aiErrorPointID
  showFilterErrPoint.value = true
  drawMark()
  showDialogTip(selectedAiErrorPointID.value, clickX, clickY)
}


const picInfo = reactive({}) // 彈窗 方框的詳細資訊
const dialogRef = ref(null) // 詳細資訊DIV
const dialogHeight = ref(0) // 詳細內容彈窗的高

// ------ Error 方框 提示資料 ------>
const showDialogTip = (aiErrorPointID, clickX, clickY) => {
  selectedAiErrorPointID.value = aiErrorPointID
  showFilterErrPoint.value = true
  showDialog.value = true

  if (dialogRef.value) {
    dialogHeight.value = dialogRef.value.clientHeight
  }
  showDialogCoordinates.value = { x: clickX, y: clickY }
  updatePicInfo(aiErrorPointID)
}

// ------ Error 提示資料內容 ------>
const currentItem = ref() // 當下選種項目資料
const updatePicInfo = (aiErrorPointID) => {
  currentItem.value = errorList.value.find(item => item.aiErrorPointID === aiErrorPointID)
  if (currentItem.value) {
    selectedRank.value = [] // 重新選擇方框 清空資料
    picInfo.title = currentItem.value.aiErrorPointID
    picInfo.result = currentItem.value.errorEventList[0].errorRankName
    picInfo.level = currentItem.value.errorEventList[0].errorRank
    picInfo.loopSeqNo = currentItem.value.loopSeqNo
    selectedEvent.value = currentItem.value.errorEventList[0].errorEventID
    currentItem.value.errorEventList.forEach((event) => {
      selectedRank.value.push({ errorRankID: event.errorRankID, errorRankName: `等級${event.errorRank} - ${event.errorRankName}` })
    })
  }
}

const selectedAiErrorPointID = ref(null) // 在全局範圍中儲存被點擊的方框的aiErrorPointID
const showFilterErrPoint = ref(false)


const divImg = ref(null)
const canvasRef = ref(null)
let canvas
let ctx
watch(canvasRef, (newCanvasRef) => {
  if (newCanvasRef) {
    canvas = newCanvasRef
    ctx = canvas.getContext('2d')
  }
  canvasEventClick()
})
// ------ 繪製 ------>
async function drawMark() {
  const img = await loadImage(picRes.value)
  // 計算圖片的寬高比例
  // 缺圖片尺寸
  // const imgAspectRatio = pixWidth.value / pixHeight.value
  // console.log('imgAspectRatio', imgAspectRatio)
  // 計算畫布尺寸，保持圖片水平置中
  const canvasWidth = pixWidth.value
  const canvasHeight = pixHeight.value
  // 設置畫布尺寸，清除並繪製
  canvas.width = canvasWidth
  canvas.height = canvasHeight
  imgW.value = canvas.width
  imgH.value = canvas.height
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

  // 使用後端API回傳的errorList來繪製方框 並傳送index值
  errorList.value.forEach(data => {
    const isSelected = data.aiErrorPointID === selectedAiErrorPointID.value
    // 根據errorEventID找到匹配的事件等级
    const matchInfo = props.eventRanks.find(errIcon => errIcon.errorEventID === data.errorEventList[0].errorEventID)
    drawBox(ctx, data.errorRange, isSelected, matchInfo)
  })
}
if (canvasRef.value) {
  canvasEventClick()
}
const canvasEventClick = () => {
  canvas.addEventListener('click', (event) => {
    const clickX = event.offsetX
    const clickY = event.offsetY

    handleCanvasClick(clickX, clickY)
  })
}
// ------ 載入圖片 ------>
function loadImage(src) {
  return new Promise((resolve, reject) => {
    // 創建新Image對象
    const img = new Image()
    img.crossOrigin = '*'
    // 當圖片加載成功,調用resolve且傳遞Img
    img.onload = () => resolve(img)
    // 當圖片加載失敗,調用reject
    img.onerror = reject
    //  設置圖片的src,開始加載圖片
    img.src = src
  })
}

const boxWidth = ref(null) // 方框的寬
const boxHeight = ref(null) // 方框的高
// ------ 繪製方框 ------>
const drawBox = (ctx, points, isSelected, matchInfo) => {
  // 設定圓角半徑
  const cornerRadius = 4
  // 取得方框的四個頂點坐標
  const topLeftX = Math.min(points[0].pixelX, points[1].pixelX, points[2].pixelX, points[3].pixelX)
  const topLeftY = Math.min(points[0].pixelY, points[1].pixelY, points[2].pixelY, points[3].pixelY)
  const bottomRightX = Math.max(points[0].pixelX, points[1].pixelX, points[2].pixelX, points[3].pixelX)
  const bottomRightY = Math.max(points[0].pixelY, points[1].pixelY, points[2].pixelY, points[3].pixelY)
  boxWidth.value = bottomRightX - topLeftX
  boxHeight.value = bottomRightY - topLeftY

  // 繪製方框
  ctx.beginPath()
  ctx.moveTo(topLeftX + cornerRadius, topLeftY)
  ctx.lineTo(bottomRightX - cornerRadius, topLeftY)
  ctx.quadraticCurveTo(bottomRightX, topLeftY, bottomRightX, topLeftY + cornerRadius)
  ctx.lineTo(bottomRightX, bottomRightY - cornerRadius)
  ctx.quadraticCurveTo(bottomRightX, bottomRightY, bottomRightX - cornerRadius, bottomRightY)
  ctx.lineTo(topLeftX + cornerRadius, bottomRightY)
  ctx.quadraticCurveTo(topLeftX, bottomRightY, topLeftX, bottomRightY - cornerRadius)
  ctx.lineTo(topLeftX, topLeftY + cornerRadius)
  ctx.quadraticCurveTo(topLeftX, topLeftY, topLeftX + cornerRadius, topLeftY)
  ctx.closePath()
  // 設定筆畫顏色與寬度
  // 依照後端回的bgColor繪製框線並檢查是不是滑鼠點選的方框 aiErrorPointID，設定筆畫顏色

  if (matchInfo) {
    if (isSelected) {
      ctx.strokeStyle = matchInfo.colorSet
      ctx.lineWidth = 3
      ctx.fillStyle = matchInfo.colorSet + '00'
    } else {
      ctx.strokeStyle = matchInfo.colorSet
      ctx.lineWidth = 1
      // 設定填充顏色
      ctx.fillStyle = matchInfo.colorSet + '33'
    }
  }
  // 填充方框
  ctx.fill()
  ctx.stroke()
}


// ------ 計算 showDialog 的位置 ----->
const calDialogTopPosition = () => {
  // return showDialogCoordinates.value.y - dialogHeight.value / 2 - boxHeight.value / 2
  return showDialogCoordinates.value.y - 125 / 2
}

const trianglePosition = ref(null) // 依照詳細內容彈窗,三角形的位置
const calDialogLeftPosition = () => {
  const clickX = showDialogCoordinates.value.x
  // showDialog 的寬度
  const dialogWidth = 350 // 彈窗寬度
  // 確定彈窗顯示的左側位置
  const leftPosition = clickX - dialogWidth + 60
  // 確定彈窗顯示的右側位置
  const rightPosition = clickX + 15

  // 如果 rightPosition 在視窗內，就顯示在右側 ,三角形在左側
  if (rightPosition + dialogWidth <= window.innerWidth) {
    trianglePosition.value = 'left'
    return rightPosition
  }
  // 否則顯示在左側,三角形在右側
  trianglePosition.value = 'right'
  return Math.max(leftPosition, 0)
}


// 用於存儲使用者繪製的矩形的陣列
const marks = ref([])
// 是否可以繪製矩形
const canDrawRectangle = ref(false)

// ------ 彈窗 新增/修改 方框動作 ------>
let payload = {}
const actionErrorPoint = async() => {
  showDialog.value = false
  // selectedRank.value.forEach((rank) => {
  //   eventList.push({ errorEventID: selectedEvent.value, errorRankID: rank.errorRankID })
  // })
  let eventList = [{ errorEventID: selectedEvent.value, errorRankID: selectedRank.value.errorRankID }]
  payload = {
    loopSeqNo: picInfo.loopSeqNo,
    errorEventList: eventList,
    aiResultID: infoList.value.aiResultID,
    aiErrorImageID: infoList.value.aiErrorImageID,
  }
  // >0 滑鼠ADD繪製的BOX資料 else原始舊資料
  if (marks.value.length > 0) {
    addErrorPoint()
  } else {
    editErrorPoint()
  }
}

// ------ API: 新增繪製方框及資料 ------>
const addErrorPoint = async() => {
  try {
    const [x, y, width, height] = marks.value[0]
    payload.errorRange =
      [
        {
          pixelX: Math.round(x),
          pixelY: Math.round(y),
        },
        {
          pixelX: Math.round(x),
          pixelY: Math.round(y + height),
        },
        {
          pixelX: Math.round(x + width),
          pixelY: Math.round(y + height),
        },
        {
          pixelX: Math.round(x + width),
          pixelY: Math.round(y),
        },
      ]
    if (selectedEvent.value === 0 && selectedRank.value === []) {
      setAlertMessage('danger', '請選擇巡檢結果', false)
      showDialog.value = true
    } else {
      const res = await proxy.$API.inspectionManage.addErrorPoint.post(payload)
      showDialog.value = false
      addMarkType.value = res.status
      openDialog.value = true
      successMsg.value = res.message
    }
  } catch (err) {
    console.log('新增異常點位事件錯誤', err)
  }
}

// ------ API: 編輯方框資料 ------>
const editErrorPoint = async() => {
  try {
    const aiErrorPointID = selectedAiErrorPointID.value
    payload.errorRange =
      [
        {
          pixelX: currentItem.value.errorRange[0].pixelX,
          pixelY: currentItem.value.errorRange[0].pixelY,
        },
        {
          pixelX: currentItem.value.errorRange[1].pixelX,
          pixelY: currentItem.value.errorRange[1].pixelY,
        },
        {
          pixelX: currentItem.value.errorRange[2].pixelX,
          pixelY: currentItem.value.errorRange[2].pixelY,
        },
        {
          pixelX: currentItem.value.errorRange[3].pixelX,
          pixelY: currentItem.value.errorRange[3].pixelY,
        },
      ]
    const res = await proxy.$API.inspectionManage.editErrorPoint.put(aiErrorPointID, payload)
    if (res.status === 'success') {
      openDialog.value = true
      successMsg.value = res.message
    }
  } catch (err) {
    console.log('修改異常點位事件錯誤', err)
  }
}
// ------ 彈窗點擊取消 ------>
const cancelErrorPoint = () => {
  showDialog.value = false
  marks.value = [] // 清空矩形陣列
  if (canDrawRectangle.value) {
    drawNewMark()
  }
}
const successMsg = ref()
// ------ API: 刪除ErrorPoint ------>
const delErrorPoint = async() => {
  try {
    const res = await proxy.$API.inspectionManage.delErrorPoint.delete(currentItem.value.aiErrorPointID)
    if (res.status === 'success') {
      showDialog.value = false
      openDialog.value = true
      successMsg.value = res.message
      selectedAiErrorPointID.value = null
    }
  } catch (err) {
    console.log('刪除異常點位事件錯誤', err)
  }
}

// ------ 點新增按鈕 開始繪製方框 ------>
const addBox = () => {
  showDialog.value = false // 繪製時 關閉詳細內容彈窗
  canDrawRectangle.value = !canDrawRectangle.value // 是否可以繪製矩形
  selectedEvent.value = 0
  selectedRank.value = []
  picInfo.loopSeqNo = ''
  marks.value = [] // 清空矩形陣列
  drawNewMark()
}

// ------ 滑鼠繪製矩形 ------>
const canvasD = ref(null)
const imgW = ref()
const imgH = ref()

async function drawNewMark() {
  const canvasDraw = canvasD.value
  const ctxDraw = canvasDraw.getContext('2d')
  // 計算圖片的寬高比例
  // 缺圖片尺寸
  const imgAspectRatio = pixWidth.value / pixHeight.value

  // // 計算畫布尺寸，保持圖片水平置中
  const canvasWidth = pixWidth.value
  const canvasHeight = pixHeight.value

  // 設置畫布尺寸，清除並繪製
  canvasDraw.width = canvasWidth
  canvasDraw.height = canvasHeight
  imgW.value = canvasDraw.width
  imgH.value = canvasDraw.height

  // 繪製框的畫筆顏色
  ctxDraw.strokeStyle = '#F75000'
  ctxDraw.lineWidth = 3

  let addRectangleButton = document.getElementById('add-rectangle-button')
  // 更新新增矩形按钮的文字
  if (canDrawRectangle.value) {
    addRectangleButton.textContent = '取消繪製'
    // 啟用矩形繪製
    canvasDraw.addEventListener('mousedown', handleMouseDown)
    canvasDraw.addEventListener('mousemove', handleMouseMove)
    canvasDraw.addEventListener('mouseup', handleMouseUp)
  } else {
    addRectangleButton.textContent = '新增範圍'
    // 取消矩形繪製
    canvasDraw.removeEventListener('mousedown', handleMouseDown)
    canvasDraw.removeEventListener('mousemove', handleMouseMove)
    canvasDraw.removeEventListener('mouseup', handleMouseUp)
  }
  // 函數來繪制矩形
  function drawRect(x, y, width, height) {
    ctxDraw.strokeRect(x, y, width, height)
  }
  // 清除畫布的函數
  function clearCanvas() {
    // 清除整個畫布
    ctxDraw.clearRect(0, 0, canvasDraw.width, canvasDraw.height)
    // 重新繪製使用者繪製的矩形
    marks.value.forEach(([x, y, width, height]) => {
      drawRect(x, y, width, height)
    })
  }

  // 滑鼠互動
  let isPainting = false
  let startX, startY, currentX, currentY
  const mouseMove = ref(false) // 滑鼠有一棟不是只點一下

  // 滑鼠移動事件
  function handleMouseDown(e) {
    if (canDrawRectangle.value && marks.value.length < 1) {
      isPainting = true
      startX = e.clientX - canvasDraw.getBoundingClientRect().left
      startY = e.clientY - canvasDraw.getBoundingClientRect().top
    }
  }
  function handleMouseMove(e) {
    // 如果可以繪製矩形且正在繪製
    if (canDrawRectangle.value && isPainting) {
      currentX = e.clientX - canvasDraw.getBoundingClientRect().left
      currentY = e.clientY - canvasDraw.getBoundingClientRect().top
      clearCanvas()
      drawRect(startX, startY, currentX - startX, currentY - startY)
      mouseMove.value = true
    }
  }
  function handleMouseUp() {
    // 如果可以繪製矩形且正在繪製
    if (canDrawRectangle.value && isPainting) {
      isPainting = false
      const width = currentX - startX
      const height = currentY - startY
      if (!isNaN(width) && !isNaN(height) && mouseMove.value) {
        marks.value.push([startX, startY, width, height]) // 保留最後一個繪製的方框
        calDialogTopPosition()
        calDialogLeftPosition()
        showDialog.value = true
      }
      clearCanvas()
    }
    mouseMove.value = false
  }
}

const openDialog = ref(false)
const addMarkType = ref()
// 新增修改刪除後API訊息彈窗
const confirmApiMsg = () => {
  openDialog.value = false
  if (canDrawRectangle.value) {
    marks.value = []
    drawNewMark()
    // API 回傳Status 成功重新取得 Img和資料
    if (addMarkType.value === 'success') {
      getImgErr()
    }
  } else {
    getImgErr()
  }
  addMarkType.value = ''
}


</script>
<style>

/* 下拉搜尋選單 */
.imgMultiselect .multiselect__tag {
  @apply bg-active
}

.imgMultiselect .multiselect__content-wrapper ul> :not([hidden])~ :not([hidden]) {
  margin: 0;
}

.imgMultiselect .multiselect__content {
  @apply p-3
}

.imgMultiselect .multiselect__option--highlight {
  @apply bg-active rounded
}

.imgMultiselect .multiselect__option--highlight::after {
  @apply bg-active rounded
}

.imgMultiselect .multiselect__option--selected.multiselect__option--highlight {
  @apply bg-active
}

.imgMultiselect .multiselect__option--selected.multiselect__option--highlight::after {
  @apply bg-active
}

/* .multiselect__tag-icon:after{
  content:"\D7";
  color:rgba(255,255,255,.6);
  font-size:14px;
} */
</style>
