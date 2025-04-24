<template>
  <div class="relative h-full">
    <div class="flex flex-wrap justify-between pr-16">
      <div class="relative flex flex-wrap space-x-5">
        <!-- search -->
        <div class="flex">
          <span class="mr-2 text-font20 leading-15">關鍵字查詢</span>
          <div class="relative  w-80">
            <input
              v-model="search"
              type="text"
              class="w-full h-16 p-5 form-input bg-white input-shadow rounded-4xl placeholder:text-neutral-70 "
              placeholder="請輸入客戶ID或名稱"
              @blur="onSearch"
            >
            <span class="absolute cursor-pointer  top-6 right-5" :class="searchIcon ? 'icon-clear' : 'icon-search'" @click="del" />
          </div>
        </div>
        <!-- status -->
        <div class="flex">
          <span class="mr-2 text-font20 leading-15 ">狀態</span>
          <Listbox v-slot="{ open }" v-model="enableSatus">
            <div class="relative">
              <ListboxButton class="relative w-32 h-16 dropDown-type cursor-pointer focus:outline-none">
                <span class="block truncate text-font20Regular text-neutral-20  -ml-8">{{ enableSatus.name }}</span>
                <span class="pointer-events-none absolute inset-y-0 right-1 flex items-center pr-2">
                  <span v-if="open" class="icon-arrow-up" />
                  <span v-else class="icon-arrow-down" />
                </span>
              </ListboxButton>
              <transition
                leave-active-class="transition duration-100 ease-in"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
              >
                <ListboxOptions class="listboxOP absolute z-10 w-32 mt-2 origin-top-right bg-white shadow-lg rounded-3xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <ListboxOption
                    v-for="item in statusList"
                    v-slot="{ active }"
                    :key="item.id"
                    :value="item"
                    as="template"
                  >
                    <li class="m-2 px-4 py-2 text-center text-font20Regular focus-visible:mx-2 cursor-pointer" :class="[active ? 'bg-active text-white rounded' : '']">
                      <span>
                        {{ item.name }}
                      </span>
                    </li>
                  </ListboxOption>
                </ListboxOptions>
              </transition>
            </div>
          </Listbox>
        </div>
      </div>
      <!-- add  -->
      <IconAddBtn v-if="fromFeature!=='place'" @click="add" />
    </div>
    <!-- table -->
    <div class="mt-10 mb-5 pr-14">
      <div class="overflow-hidden rounded-lg ring-1 ring-devider">
        <table class="min-w-full table-hover">
          <thead class=" bg-surface-5">
            <tr>
              <th scope="col" class="w-20 py-5 text-center text-font20Regular table-th">序號</th>
              <th scope="col" class="w-20 py-5 text-center text-font20Regular table-th">狀態</th>
              <th scope="col" class="px-6 text-left text-font20Regular table-th">客戶統編/身分證字號</th>
              <th scope="col" class="px-6 text-left text-font20Regular table-th">客戶名稱</th>
              <th scope="col" class="px-6 text-left text-font20Regular table-th">授權到期日</th>
              <th scope="col" class="px-6 text-left text-font20Regular table-th">備註</th>
              <th scope="col" class="w-20 py-5 text-center text-font20Regular table-th">{{ fromFeature!=='place'?'編輯':'檢視' }}</th>
            </tr>
          </thead>
          <tbody v-if="customerList.length>0" class="bg-white divide-y divide-gray-200">
            <tr v-for="(item,index) in customerList" :key="item.id">
              <td class="py-6 text-center text-font20Regular ">{{ index+1 }}</td>
              <td class="py-6 text-center text-font20Regular table-td">
                <Tag :type="+item.isEnable===1?'active':'disabled'">{{ +item.isEnable=== 1 ?'啟用':'停用' }}</Tag>
              </td>
              <td class="p-6 text-left text-font20Regular table-td">{{ item.customerGUINumber }}</td>
              <td class="p-6 text-font20Regular table-td">{{ item.customerName }}</td>
              <td class="p-6 text-font20Regular table-td">{{ item.expireTime }}</td>
              <td class="p-6 text-font20Regular table-td">{{ item.remark }}</td>
              <td class="w-16 text-font20Regular table-td">
                <EditICon v-if="fromFeature!=='place'" @click="edit(item)" />
                <div
                  v-if="fromFeature==='place'"
                  class="rounded-full mx-auto h-10 w-10 flex items-center justify-center cursor-pointer hover:bg-activeBG"
                  @click="edit(item)"
                >
                  <span class="icon-visibility-on text-primary-70" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="customerList.length==0" class="m-w-full px-6 py-5 text-center text-font20Regular">
          <span>暫時無資料</span>
        </div>
      </div>
    </div>
    <!-- 分頁 -->
    <div class="flex justify-center pr-14">
      <BasePagination
        v-if="itemTotal>10"
        :total="itemTotal"
        :current="currentPage"
        @update:current="updateCurrent"
        @pagination="getPagination"
      />
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch, onMounted, getCurrentInstance } from 'vue'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
const { proxy } = getCurrentInstance()
import IconAddBtn from '@/components/BaseIconAddBtn.vue'
import EditICon from '@/components/BaseEditIcon.vue'
import Tag from '@/components/BaseTag.vue'
import BasePagination from '@/components/BasePagination.vue'
import { useSearchDataStore } from '@/stores/searchData.js'
const searchData = useSearchDataStore()
const route = useRoute()
const router = useRouter()
// 查詢 Bar 相關
const search = ref('')
const searchIcon = ref(false)
// 狀態下拉選單
const statusList = reactive([
  { id: null, name: '全部' },
  { id: 1, name: '啟用' },
  { id: 0, name: '停用' },
])
// 帳號啟用狀態
const enableSatus = ref(statusList[0])
// 分頁
const itemTotal = ref(0)
const currentPage = ref(1)
// 以router 判斷 物件是否 顯示
const fromFeature = ref(null)
const storeData = ref(searchData.data)
onMounted(() => {
  getEditPermission(route.name)
  // 判斷有無之前的搜尋條件
  if (searchData.data) {
    search.value = storeData.value.customerNameOrNumber
    enableSatus.value = storeData.value.isEnable
    searchData.deleteData()
  } else {
    getCustomerList()
  }
})

watch(() => route.name, () => {
  getEditPermission(route.name)
})
watch(enableSatus, () => {
  getPagination(1)
})
// 取得客戶清單
const customerList = ref([])
const getCustomerList = async() => {
  try {
    const payload = {
      orderBy: JSON.stringify([{ columnName: 'isEnable', isDesc: 1 }, { columnName: 'customerGUINumber', isDesc: 0 }]),
      page: currentPage.value,
      pageSize: 10,
    }

    if (search.value !== '') {
      payload.customerNameOrNumber = search.value
    }
    if (enableSatus.value.id !== null) {
      payload.isEnable = enableSatus.value.id
    }
    const res = await proxy.$API.customer.list.get(payload)
    if (res.status === 'success') {
      customerList.value = res.responseData !== null ? res.responseData : []
      itemTotal.value = res.total
    }
  } catch (err) {
    console.log('取得客戶清單發生錯誤： ', err)
  }
}
const onSearch = () => {
  // 輸入關鍵字查詢時將分頁條件重置回第一頁
  getPagination(1)
}
const updateCurrent = (newValue) => {
  currentPage.value = newValue
}
// 依照 route name 來區別畫面可操作的權限
const getEditPermission = (routeName) => {
  switch (routeName) {
    case 'place-manage':
      fromFeature.value = 'place'
      break
    case 'customer-manage':
      fromFeature.value = 'manage'
      break
    case 'customer-maintain':
      fromFeature.value = 'customer'
      break
  }
}
// 關鍵字查詢 Icon 切換
watch(search, (val) => {
  if (val !== '') {
    searchIcon.value = true
  } else {
    searchIcon.value = false
  }
})
// 刪除 關鍵字查詢 Input 內容
const del = () => {
  search.value = ''
  // 清除以後再重新查詢一次全部的資料
  getPagination(1)
}
// 分頁功能
const getPagination = (val) => {
  currentPage.value = val
  getCustomerList()
}
// 進入編輯畫面
const edit = (row) => {
  storeSearchData()
  if (fromFeature.value === 'manage') {
    router.push({ name: 'customer-manage-edit', params: { id: row.customerID }})
  }
  if (fromFeature.value === 'customer') {
    router.push({ name: 'customer-maintain-edit', params: { id: row.customerID }})
  }
  if (fromFeature.value === 'place') {
    router.push({ name: 'place-manage-edit', params: { id: row.customerID }})
  }
}
// 儲存搜尋條件 進入管理頁面返回時使用
const storeSearchData = () => {
  let storeSearch = {}
  if (search.value) {
    storeSearch.customerNameOrNumber = search.value
  }
  if (enableSatus.value) {
    storeSearch.isEnable = enableSatus.value
  }
  storeSearch.page = currentPage.value
  searchData.addData(storeSearch)
}
// 進入新增客戶畫面
const add = () => {
  if (fromFeature.value === 'manage') {
    router.push({ name: 'customer-manage-add', params: {}})
  }
  if (fromFeature.value === 'customer') {
    router.push({ name: 'customer-maintain-add', params: {}})
  }
}
</script>


