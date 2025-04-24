<template>
  <div class="w-[181px] absolute top-[130px] right-[2%] z-onMapFirst">
    <div class="p-4 mb-4 bg-white rounded-2xl">
      <button
        class="w-full mb-3 column-btn-sm"
        :class="[pageState.name === 0 ? 'bg-numberIcon-light' : 'bg-primary-30']"
        @click="deleteAllPoint"
      >
        全部清除
      </button>
      <ul class="max-h-[228px] overflow-y-auto">
        <li
          v-for="(point, index) in pointList"
          :key="point"
          class="relative py-2 mb-3 text-center last:mb-0"
        >
          <p
            class="text-font20"
            :class="[index === 0 ? 'text-neutral-20' : 'text-neutral-60']"
          >
            {{ `第 ${pointList.length - index} 點` }}
          </p>
          <button
            v-if="index === 0"
            class="absolute right-2 translate-y-[-50%] icon-clear top-1/2"
            @click="deletePoint"
          />
        </li>
      </ul>
    </div>
    <button
      class="w-full px-6 column-btn-lg"
      :class="`${lengthFlag ? 'btn-disabled' : pageState.name === 0 ? 'bg-numberIcon-light' : 'bg-primary-30'}`"
      :disabled="lengthFlag"
      @click="finishDrawPolygon"
    >
      完成
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { usePageState, usePolygonStore } from '@/stores/mapState'

const emit = defineEmits(['sendPolygonLayer'])

// 使用 Store
const pageState = usePageState()
const polygonLatLngState = usePolygonStore()

const pointList = ref(polygonLatLngState.latlngs)
const lengthFlag = ref(polygonLatLngState.latlngs.length < 3)

polygonLatLngState.$subscribe(() => {
  lengthFlag.value = polygonLatLngState.latlngs.length < 3
})


// 刪除全部點位
const deleteAllPoint = () => {
  // 用 splice() 去清除陣列，其他元件才能監聽到 Store 裡的 latlngs 陣列變化。
  polygonLatLngState.latlngs.splice(0)
}

// 刪除最後單一點位
const deletePoint = () => {
  // 移除 Store 裡 latlngs 陣列最後一筆經緯度。
  polygonLatLngState.latlngs.shift()
}

// 送出到 index 去組 API 所要的參數
const finishDrawPolygon = () => {
  const polygon = Object.values(polygonLatLngState.latlngs)
  polygon.forEach((item, index) => {
    const temp = {
      height: 0,
    }
    polygon[index] = { ...item, ...temp }
  })
  let parameterTemp = null
  switch (pageState.name) {
    case 0:
      parameterTemp = {
        placeRange: polygon,
      }
      if (pageState.type === 0) {
        emit('sendPolygonLayer', parameterTemp, 'addPlace')
      } else {
        emit('sendPolygonLayer', parameterTemp, 'editPlace')
      }
      break
    case 1:
      parameterTemp = {
        realFlightRange: polygon,
      }
      if (pageState.type === 0) {
        // 新增巡檢
        emit('sendPolygonLayer', parameterTemp, 'addPlanFlight')
      } else {
        // 編輯巡檢
        emit('sendPolygonLayer', parameterTemp, 'editPlanFlight')
      }
      break
  }
}

</script>
