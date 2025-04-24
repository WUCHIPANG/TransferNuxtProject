<template>
  <div>
    <!-- table -->
    <div class="pr-14">
      <div class="overflow-hidden rounded-lg ring-1 ring-devider">
        <table class="min-w-full table-hover">
          <thead class=" bg-surface-5">
            <tr>
              <th scope="col" class="w-20 py-5 text-center text-font20Regular table-th">序號</th>
              <th scope="col" class=" py-5 text-center text-font20Regular table-th">角色名稱</th>
              <th scope="col" class="px-6 text-left text-font20Regular table-th">備註</th>
              <th scope="col" class="w-24 px-6  text-font20Regular table-th">檢視</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(item, index) in roleList" :key="item.roleID">
              <td class="py-6 text-center text-font20Regular ">{{ index + 1 }}</td>
              <td class="py-6 text-center text-font20Regular table-td">
                <span>{{ item.roleName }}</span>
              </td>
              <td class="p-6 text-font20Regular table-td">{{ item.remark }}</td>
              <td class="w-16 text-font20Regular table-td">
                <!-- <EditICon  @click="edit(item.roleID)" /> -->
                <div
                  class="rounded-full mx-auto h-10 w-10 flex items-center justify-center cursor-pointer hover:bg-activeBG"
                  @click="edit(item.roleID)"
                >
                  <span class="icon-visibility-on text-primary-70" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance } from 'vue'
import EditICon from '@/components/BaseEditIcon.vue'
const route = useRoute()
const { proxy } = getCurrentInstance()
const pageDetail = ref('')
const router = useRouter()
pageDetail.value = route.meta.title
// to 編輯頁
const edit = (roleID) => {
  router.push(`/roleManage/roleDetail/${roleID}`)
}
const roleList = ref()
const getRoleList = async() => {
  try {
    let params = {
      page: 1,
      pageSize: 10,
    }
    const res = await proxy.$API.role.list.get(params)
    roleList.value = res.responseData
  } catch (err) {
    // 驗證失敗時的動作
    console.log('取得角色清單發生錯誤： ', err)
  }
}
onMounted(() => {
  getRoleList()
})
</script>
