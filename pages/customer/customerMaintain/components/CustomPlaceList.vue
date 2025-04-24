<template>
  <div>
    <span class="text-font24">案場維護 :</span>
    <div class="mt-6">
      <div class="w-full flex justify-between items-end">
        <span class="text-font20 ">案場列表</span>
        <button class="p-3 w-[141px] h-[48px] bg-activeBG rounded-xl text-font20 text-active ring-1 ring-active flex justify-center items-center cursor-pointer hover:bg-activeBGHover" @click="addPlace">
          <div class="flex justify-between items-baseline">
            <span class="icon-add mr-2" />
            <span>新增案場</span>
          </div>
        </button>
      </div>
      <div class="mt-6 overflow-hidden rounded-lg ring-1 ring-devider">
        <table class="min-w-full table-hover">
          <thead class=" bg-surface-5">
            <tr>
              <th scope="col" class="w-20 py-5 text-center text-font20Regular table-th">序號</th>
              <th scope="col" class="px-6 py-5 text-left text-font20Regular table-th">案場名稱</th>
              <th scope="col" class="px-6 text-center text-font20Regular table-th">備註</th>
              <th scope="col" class="w-10 px-6 text-center text-font20Regular table-th" colspan="2">管理</th>
            </tr>
          </thead>

          <tbody v-if="placeList!==null" class="bg-white divide-y divide-gray-200">
            <tr v-for="(item,index) in placeList" :key="item.placeID">
              <td class="py-6 text-center text-font20Regular ">{{ index+1 }}</td>
              <td class="p-6 text-left text-font20Regular table-td">{{ item.placeName }}</td>
              <td class="p-6 text-font20Regular table-td">{{ item.remark }}</td>
              <td class="w-16 text-font20Regular table-td">
                <EditICon @click="editPlace(item)" />
              </td>
              <td class="w-16 text-center text-font20Regular table-td">
                <DeleteICon @click="openDelDialog(item)" />
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="placeList===null" class="w-full h-full px-6 py-5 text-center text-font20Regular">
          <span>暫無案場</span>
        </div>
      </div>
    </div>
  </div>
  <Dialog v-model="openDialog">
    <template #title>{{ dialogInfo.title }}</template>
    <template #detail>{{ dialogInfo.detail }}</template>
    <template #cancelButtonText>取消</template>
    <template #confirmButton>
      <button class="modal-button text-danger bg-dangerBG hover:bg-dangerBGHover" @click="delPlace">刪除</button>
    </template>
  </Dialog>
</template>

<script setup>
import { getCurrentInstance, ref, reactive } from 'vue'
import EditICon from '@/components/BaseEditIcon.vue'
import DeleteICon from '@/components/BaseDeleteIcon.vue'
import Dialog from '@/components/BaseModal.vue'
import { setAlertMessage } from '@/utils/messages.js'

const router = useRouter()
const { proxy } = getCurrentInstance()

const emit = defineEmits(['updatePlaceList'])
const props = defineProps({
  placeList: { type: Array, require: true, default: () => [] },
  editRole: { type: String, default: '' },
  customerId: { type: String, default: '' },
})

const openDialog = ref(false)
const dialogInfo = reactive({})

// 導轉至新增案場地圖畫面
const addPlace = () => {
  if (props.editRole === 'manage') {
    router.push({ name: 'customer-detail-map', params: { id: props.customerId, type: 'add' }})
  }
  if (props.editRole === 'place') {
    router.push({ name: 'place-detail-map', params: { id: props.customerId, type: 'add' }})
  }
}
// 導轉至編輯案場地圖畫面
const editPlace = (row) => {
  if (props.editRole === 'manage') {
    router.push({ name: 'customer-detail-map', params: { id: props.customerId, type: 'edit' }, query: { placeId: row.placeID }})
  }
  if (props.editRole === 'place') {
    router.push({ name: 'place-detail-map', params: { id: props.customerId, type: 'edit' }, query: { placeId: row.placeID }})
  }
}
// 刪除案場資訊
const delPlace = async() => {
  try {
    const res = await proxy.$API.place.delete.delete(dialogInfo.delPlaceID)
    if (res.status === 'success') {
      setAlertMessage('success', '刪除案場成功！', false)
      openDialog.value = false

      // call api 更新案場列表
      emit('updatePlaceList')
    }
  } catch (err) {
    setAlertMessage('danger', '刪除案場發生錯誤！')
    console.log('刪除案場發生錯誤： ', err)
  }
}
const openDelDialog = (row) => {
  openDialog.value = true
  dialogInfo.title = '刪除案場'
  dialogInfo.detail = `確認刪除案場 ${row.placeName} ？`
  dialogInfo.delPlaceID = row.placeID
}
</script>
