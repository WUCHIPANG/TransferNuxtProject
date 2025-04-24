<template>
  <div v-for="groupItem in apiMethodList" :key="groupItem.methodGroupCode" class="bg-surface-3 h-[116px] rounded-2xl p-6">
    <p class="text-font20Regular">{{ groupItem.methodGroupName }}</p>
    <div class="mt-6 px-6 text-left text-font20Regular grid gap-4 grid-cols-2">
      <label v-for="method in groupItem.methods" :key="method.methodID" class="inline-flex items-center w-full">
        <input
          v-model="method.isChecked"
          type="checkbox"
          class="form-checkbox"
          @change="updateSelect"
        >
        <span>{{ method.methodName }}</span>
      </label>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, watch, onMounted, getCurrentInstance } from 'vue'
import { useVModel } from '@vueuse/core'

const { proxy } = getCurrentInstance()
const emit = defineEmits(['updateSelMethod'])
const props = defineProps({
  apiSelMethod: { type: Array, default: () => [] },
})

const apiSelectMethod = useVModel(props, 'apiSelMethod')

const isFinishInit = ref(false)
onMounted(() => {
  getMethodDataList()
})

watch(isFinishInit, () => {
  if (isFinishInit.value === true) {
    if (apiSelectMethod.value.length > 0) {
      initApiSelected()
    }
  }
})
watch(apiSelectMethod, () => {
  if (apiSelectMethod.value.length > 0 && isFinishInit.value === true) {
    initApiSelected()
  }
}, { deep: true })

const apiMethodList = ref([])
const getMethodDataList = async() => {
  try {
    const res = await proxy.$API.customer.methodData.get()
    if (res.status === 'success') {
      res.responseData.forEach(item => {
        item.methods.forEach(ele => {
          Object.assign(ele, { isChecked: false })
        })
      })
      apiMethodList.value = res.responseData
      isFinishInit.value = true
    }
  } catch (err) {
    console.log('取得客戶功能清單發生錯誤： ', err)
  }
}

const selectList = ref([])
const updateSelect = () => {
  selectList.value = []
  apiMethodList.value.forEach(methodGroup => {
    methodGroup.methods.filter(item => {
      if (item.isChecked === true) {
        selectList.value.push(item.methodID)
      }
    })
  })

  emit('updateSelMethod', selectList)
}

const initApiSelected = () => {
  selectList.value = apiSelectMethod.value
  apiSelectMethod.value.forEach((item) => {
    apiMethodList.value.forEach(methodGroup => {
      methodGroup.methods.forEach(el => {
        if (el.methodID === item) {
          el.isChecked = true
        }
      })
    })
  })
}
</script>
