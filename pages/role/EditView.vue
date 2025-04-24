<template>
  <div class="h-[95%] px-14 relative">
    <!-- 基本資料 title -->
    <div class=" pt-6 flex mb-[130px]">
      <div class="w-1/2">
        <span class="text-font24">角色基本資料:</span>
        <form class="h-full mt-8 pr-6">
          <!-- input -->
          <div class="space-y-6 h-full">
            <div>
              <label for="roleName" class="block text-font20">角色名稱</label>
              <div class="mt-2 mr-5">
                <div class="flex input-type input-shadow w-full pl-0 ">
                  <input
                    id="roleName"
                    v-model="form.roleName"
                    type="text"
                    autocomplete="roleName"
                    name="roleName"
                    class="form-input pl-3 rounded-lg text-font20Regular disabled:bg-surface-6 disabled:text-neutral-20"
                    disabled
                  >
                </div>
              </div>
            </div>
            <div>
              <label for="remark" class="block text-font20">備註
                <span class="ml-1 text-font16Regular text-neutral-50">(選填)</span>
              </label>
              <div class="mt-2 mr-5">
                <div class="flex input-type input-shadow w-full pl-0 ">
                  <input
                    id="remark"
                    v-model="form.remark"
                    type="text"
                    autocomplete="remark"
                    name="remark"
                    class="form-input pl-3 rounded-lg text-font20Regular disabled:bg-surface-6 disabled:text-neutral-20"
                    disabled
                  >
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div class="w-1/2">
        <span class="text-font24">帳號設定:</span>
        <div class="h-full mt-8 pr-6">
          <label for="planName" class="block text-font20">帳號列表</label>
          <div class=" mt-6 relative ring-1  ring-devider rounded-lg overflow-hidden  border-collapse">
            <table class="min-w-full table-hover">
              <thead class=" bg-surface-5">
                <tr>
                  <th scope="col" class="py-5 w-14 text-center text-font20Regular table-th">序號</th>
                  <th scope="col" class="px-6 text-left w-36 text-font20Regular table-th">帳號</th>
                  <th scope="col" class="px-6 text-left text-font20Regular table-th">名稱</th>
                </tr>
              </thead>
              <tbody class="bg-white">
                <tr v-for="(user, index) in empList" :key="user">
                  <td class="py-5 w-1/12 text-center text-font20Regular table-td">{{ index + 1 }}</td>
                  <td class="px-6 py-5 w-5/12 text-left text-font20Regular table-td">
                    {{ user }}
                  </td>
                  <td class="px-6 py-5 w-6/12 text-left text-font20Regular table-td">{{ user }}</td>
                </tr>
              </tbody>
            </table>
            <!-- <div v-if="noFileTip" class="text-center p-32 w-full h-full absolute top-0 left-0">
              <span class=" text-neutral-50 text-font20Regular">暫無附件</span>
            </div> -->
          </div>
        </div>
      </div>
    </div>
    <!-- fixed footer -->
    <div class="w-full bg-white px-14 py-6 text-right fixed bottom-0 right-0 left-0 h-28">
      <div class="h-full">
        <div class="space-x-6">
          <Button class="bg-primary-50" @click="send">確定</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from 'vue'
import Schema from 'async-validator'
// 元件
import Button from '@/components/BaseButton.vue'
const { proxy } = getCurrentInstance()
const route = useRoute()
const router = useRouter()

// input
const form = reactive({
  roleName: '',
  remark: '',
  authList: '',
})
// 驗證
// const errors = ref({})
// const rules = {
//   roleName: [{ required: true, message: '此欄位為必填，請輸入專案名稱！' }],
// }
// const validator = new Schema(rules)
// const validateForm = () => {
//   return new Promise((resolve, reject) => {
//     validator.validate(form, (err, fields) => {
//       if (err) {
//         errors.value = err.reduce((accumulator, currentValue) => {
//           accumulator[currentValue.field] = currentValue.message
//           return accumulator
//         }, {})
//         reject(err)
//       } else {
//         errors.value = {}
//         resolve(fields)
//       }
//     })
//   })
// }
// 詳細資料
const empList = ref('')
const detail = ref()
const getRoleDetail = async() => {
  try {
    const res = await proxy.$API.role.detail.get(route.params.id)
    if (res.status === 'success') {
      detail.value = res.responseData
      form.roleName = detail.value.roleName
      form.authList = detail.value.authList
      form.remark = '備註'
      empList.value = detail.value.empList.split(',')
    }
  } catch (err) {
    // 驗證失敗時的動作
    console.log('取得角色資料發生錯誤： ', err)
  }
}
const send = () => {
  router.push('/roleManage/roleList')
}
onMounted(async() => {
  getRoleDetail()
})
</script>

