<template>
  <div class="h-[92%] absolute top-10 left-[2%] z-onMapFirst">
    <div class="overflow-visible contentColumn">
      <!-- ===== Header ===== -->
      <div
        class="rounded-t-3xl text-neutral-20"
        :class="[taskContentState === 0 ? 'bg-white text-black' : 'bg-warning text-white']"
      >
        <p class="pt-8 pb-6 text-center text-font24">{{ taskContentState === 0 ? '巡檢任務列表' : '未執行原因' }}</p>
      </div>
      <!-- ===== Body ===== -->
      <ul
        v-if="taskContentState === 0"
        class="h-[87%] pt-4 pb-24 step-ul overflow-y-auto"
      >
        <li v-for="(flight, index) in props.flightList" :key="flight.planFlightID">
          <div :class="['taskCard relative', {'taskCrad-action': clickPlanFlightID === flight.planFlightID}]">
            <p class="taskCard-header">{{ index + 1 }}</p>
            <ul
              class="taskCard-body step-ul"
              @click="getFlightDetail(flight.planFlightID)"
            >
              <li>{{ getDateTime(flight.startTime, flight.endTime, 'date') }}</li>
              <li>{{ getDateTime(flight.startTime, flight.endTime, 'time') }}</li>
              <li>{{ flight.placeName }}</li>
            </ul>
            <div class="taskCard-footer">
              <button
                class="px-1 pb-1 icon-more_vert"
                @click="toggleMore(flight.planFlightID)"
              />
              <p
                v-if="flight.status !== 0"
                :class="[{'icon-check-circle text-success': flight.status === 2}, {'icon-assignment_late text-warning': flight.status === 1},]"
              />
            </div>
            <!-- More 欄位 -->
            <ul
              v-if="more === flight.planFlightID"
              class="taskCard-more step-ul"
            >
              <li>
                <button
                  class="text-warning border-warning bg-[#FBECDB]/50 hover:bg-warning"
                  @click="nonExecution(flight.planFlightID)"
                >
                  <span class="icon-assignment_late" />
                  未執行
                </button>
              </li>
              <li>
                <button
                  class="text-danger border-danger bg-[#FEF1F1]/50 hover:bg-danger"
                  @click="deleteFlight(flight.planFlightID)"
                >
                  <span class="icon-delete" />
                  刪除
                </button>
              </li>
            </ul>
          </div>
        </li>
      </ul>
      <div
        v-else
        class="px-4 pt-6 pb-20 h-[89%]"
      >
        <label for="reason">
          <p class="mb-4 icon-summarize labelTitle">說明(選填)</p>
          <textarea
            id="reason"
            v-model="nonExecutionReason.reason"
            class="setProject-input h-[93%]"
            name="reason"
            cols="30"
            rows="10"
          />
        </label>
      </div>
      <!-- ===== Footer ===== -->
      <div class="absolute bottom-0 w-full p-2 bg-white rounded-3xl">
        <button
          class="w-full column-btn-lg"
          :class="[taskContentState === 0 ? 'bg-primary-30' : 'bg-warning']"
          @click="taskContentState === 0 ? addInspection() : setUnexecutedReason()"
        >
          {{ taskContentState === 0 ? '新增任務' : '確定' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, watch, onUnmounted } from 'vue'
import { useMapState, useComponentsState } from '@/stores/mapState'

// 取得最外層 index 的 reload 方法
const reload = inject('reload')

const props = defineProps({
  flightList: {
    type: Array,
    require: true,
    default: () => [],
  },
  flightUnexecutedReason: {
    type: String,
    require: false,
    default: () => '',
  },
})

// 使用 route 方法
const route = useRoute()
const router = useRouter()

// 以下是正在優化的 Store
const mapState = useMapState()
const componentsState = useComponentsState()

// 使用 Emit
const emit = defineEmits(['getFlightDetail', 'deleteFlight', 'setUnexecutedReason'])

// TaskContent 元件狀態 => 0：顯示任務列表、1：顯示更改狀態為未執行
const taskContentState = ref(0)

// 未執行原因
const nonExecutionReason = ref({
  planFlightID: null,
  reason: null,
})

// 監聽 props 進來的 flightUnexecutedReason
watch(() => props.flightUnexecutedReason, (value) => {
  nonExecutionReason.value.reason = value
})

// 依照 UI/UX 設定的格式擷取日期、時間
const getDateTime = (start, end, target) => {
  if (target === 'date') {
    return `${start.substring(5, 10)} ~ ${end.substring(5, 10)}`
  } else if (target === 'time') {
    return `${start.substring(11, 16)} ~ ${end.substring(11, 16)}`
  }
}

// 取得被點擊的 PlanFlight Detail 資訊
const clickPlanFlightID = ref(null)
const getFlightDetail = (planFlightID) => {
  componentsState.projectSet = true
  mapState.model = 0
  clickPlanFlightID.value = planFlightID
  // 當使用者點擊列表卡片時，就要先取得飛行紀錄檔案(FlightRecord)
  // 如果再 EditBtn 才取得飛行紀錄檔案(FlightRecord)，會因非同步導致匯入按鈕群判斷錯誤
  emit('getFlightDetail', planFlightID)
}

// 該 Plan 已經有巡檢的狀況下增加巡檢任務
const addInspection = () => {
  router.push({ name: 'inspection-data-detail-map', params: { id: route.params.id, type: 'add' }})
  setTimeout(() => {
    reload()
  }, 200)
}

// 任意切換開關每個任務列表中的 More 視窗
const more = ref(null)
const toggleMore = (planFlightID) => {
  const temp = planFlightID
  if (temp === more.value) {
    more.value = null
  } else {
    more.value = planFlightID
  }
}

// 切換巡檢任務狀態為"未執行"
const nonExecution = (planFlightID) => {
  mapState.model = 1
  componentsState.deleteBtn = true
  taskContentState.value = 1
  emit('getFlightDetail', planFlightID)
  nonExecutionReason.value.planFlightID = planFlightID
}

// 傳到父層去 Call API 更改狀態為"未執行"
const setUnexecutedReason = () => {
  emit('setUnexecutedReason', nonExecutionReason.value)
  componentsState.deleteBtn = false
}

// 刪除點選的巡檢任務(PlanFlight)
const deleteFlight = (planFlightID) => {
  emit('deleteFlight', planFlightID)
}

// 當點擊其他地方時，more 元件要關掉
const getClickTarget = (e) => {
  const clickTarget = Array.from(e.target.classList)
  const target = clickTarget.findIndex(item => item === 'icon-more_vert')
  if (target === -1) {
    more.value = null
  }
}

// ========== 生命週期 ==========

window.addEventListener('click', getClickTarget)

onUnmounted(() => {
  window.removeEventListener('click', getClickTarget)
})

</script>
