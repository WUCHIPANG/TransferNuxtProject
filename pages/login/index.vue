<template>
  <main class="container max-w-full py-12 px-14">
    <div class="flex w-full h-full login-wrap">
      <div class="w-[60vw] left-block">
        <img src="@/assets/imgs/front_page_img.svg" alt="front_img" class="h-full aspect-auto">
      </div>
      <div class="flex w-[40vw] right-block">
        <div class="flex flex-col justify-between flex-1 px-6 pt-12 ">
          <div class="logo-block">
            <img class="mx-auto w-400px h-46px" src="@/assets/imgs/csi-logo.svg" alt="csi logo">
          </div>
          <div class="w-4/5 px-8 py-8 mx-auto my-16 border rounded-3xl">
            <p class="text-center text-font24">無人機智慧巡檢服務平台</p>
            <form class="mt-10 space-y-8" @submit.prevent="submitForm">
              <div>
                <label for="userName" class="block text-font20 text-neutral-20">帳號</label>
                <div class="mt-4">
                  <input
                    id="userName"
                    v-model="form.account"
                    type="text"
                    autocomplete="userName"
                    placeholder="請輸入Email或系整員工編號"
                    class="w-full form-input input-type placeholder:text-neutral-80"
                    :class="errors.account?'input-error mb-4':'input-shadow'"
                  >
                </div>
                <span v-if="errors.account" class="text-danger">{{ errors.account }}</span>
              </div>
              <div>
                <div class="flex items-center justify-between">
                  <label for="password" class="block text-font20 text-neutral-20">密碼</label>
                </div>
                <div class="mt-4">
                  <label for="password" class="relative flex items-center justify-end">
                    <input
                      id="password"
                      v-model="form.password"
                      name="password"
                      :type="isVisible ? 'password' : 'text'"
                      autocomplete="current-password"
                      placeholder="請輸入密碼"
                      class="w-full form-input input-type placeholder:text-neutral-80"
                      :class="errors.password?'input-error mb-4':'input-shadow'"
                    >
                    <span class="absolute mr-5 cursor-pointer" @click="isVisible=!isVisible">
                      <i v-if="isVisible" class="icon-visibility-off text-font24" />
                      <i v-if="!isVisible" class="icon-visibility-on text-font24" />
                    </span>
                  </label>
                  <span v-if="errors.password" class="text-danger">{{ errors.password }}</span>
                  <div class="flex items-center justify-between mt-6">
                    <label class="inline-flex items-center ">
                      <input
                        v-model="form.isRemember"
                        type="checkbox"
                        class="border rounded text-active focus:ring focus:ring-offset-0 focus:ring-opacity-50"
                      >
                      <span class="ml-2">記住我</span>
                    </label>
                    <!-- <a href="#" class="text-active">忘記密碼？</a> -->
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  class="flex justify-center w-full h-16 py-5 leading-6 text-white shadow-sm rounded-2xl bg-primary-60 text-font24 hover:bg-active focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  登入
                </button>
              </div>
            </form>
          </div>
          <footer>
            <div class="flex justify-center mb-4">
              <p class="flex items-center justify-center mr-6 font-normal">
                <span class="text-lg"><i class="mr-3 icon-call" /></span>
                0800-001-568
              </p>
              <p class="flex items-center justify-center font-normal">
                <span class="text-lg"><i class="mr-3 icon-mail" /></span>
                csi_service@ch-si.com.tw
              </p>
            </div>
            <div class="flex flex-wrap items-baseline justify-center">
              <p class="flex items-center justify-center mr-3 font-normal ">
                <span class="text-lg"><i class="mr-3 icon-location-on" /></span>
                總公司 : 台北市大安區金山南路二段52號3樓
              </p>
              <p>高雄 : 高雄市苓雅區苓南路2號13樓</p>
            </div>
            <div class="p-6 text-center">
              <span>{{ copyRightStr }}</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  </main>
  <Dialog v-model="openDialog">
    <template #title>
      {{ dialogProp.title }}
    </template>
    <template #detail>
      {{ dialogProp.detail }}
    </template>
    <template #cancelButtonText>{{ dialogProp.cancelButtonText }}</template>
  </Dialog>
</template>

<script setup>
import { getCurrentInstance, ref, onMounted, reactive } from 'vue'
import Schema from 'async-validator'
import moment from 'moment'
import Dialog from '@/components/BaseModal.vue'
import { Base64 } from 'js-base64'

const { auth } = useApi()

const router = useRouter()
const { proxy } = getCurrentInstance()
const isVisible = ref(true)
const form = reactive({
  account: '',
  password: '',
  isRemember: true,
})
const openDialog = ref(false)
const dialogProp = reactive({
  title: '',
  detail: '',
  cancelButtonText: '',
})
const copyRightStr = ref('')

onMounted(() => {
  copyRightStr.value = `© ${moment().format('YYYY')} CSI 中華系統整合. All rights reserved.`
  proxy.$TOOL.data.remove('USER_INFO')
  proxy.$TOOL.data.remove('MENU')
  proxy.$TOOL.cookie.remove('TOKEN')
  // 記住我
  form.account = proxy.$TOOL.data.get('REMEMBER_ME')
})


// 表單驗證
const rules = {
  account: [{ required: true, message: '請輸入帳號！' }],
  password: [{ required: true, message: '請輸入密碼！' }],
}
const errors = ref({})
const validator = new Schema(rules)

const validateForm = () => {
  return new Promise((resolve, reject) => {
    validator.validate(form, (err, fields) => {
      if (err) {
        errors.value = err.reduce((accumulator, currentValue) => {
          accumulator[currentValue.field] = currentValue.message
          return accumulator
        }, {})
        reject(err)
      } else {
        errors.value = {}
        resolve(fields)
      }
    })
  })
}
const userInfo = ref({})
const submitForm = async() => {
  try {
    await validateForm()
    // 驗證成功時的動作
    const payload = {
      userAc: form.account,
      userPw: form.password,
    }

    // const res = await proxy.$API.auth.login.post(payload)
    const res = await auth.login.post(payload)
    if (res.status === 'success') {
      proxy.$TOOL.cookie.set('TOKEN', res.responseData.jwt)

      userInfo.value = res.responseData.employeeData
      // userInfo.value.authList = getAuthList(res.responseData.jwt.split('.')[1])
      proxy.$TOOL.data.set('USER_INFO', userInfo.value)
      if (res.responseData.authMenu.length === 0) {
        dialogProp.title = '無權限訪問'
        dialogProp.detail = '目前帳號無任何選單權限，請聯繫系統管理員'
        dialogProp.cancelButtonText = '關閉'

        openDialog.value = true
        return false
      }
    } else if (res.status === 'fail') {
      dialogProp.title = 'Error'
      dialogProp.detail = res.message + '，請聯繫系統管理員'
      dialogProp.cancelButtonText = '關閉'

      openDialog.value = true
    }

    proxy.$TOOL.data.set('MENU', res.responseData.authMenu)
    if (form.isRemember) {
      proxy.$TOOL.data.set('REMEMBER_ME', form.account)
    } else {
      proxy.$TOOL.data.remove('REMEMBER_ME')
    }
    router.replace({ path: '/' })
  } catch (err) {
    // 驗證失敗時的動作
    console.log(err)
  }
}
const getAuthList = (jwt) => {
  const authListJwt = JSON.parse(Base64.decode(jwt))
  if (authListJwt.auth) {
    return authListJwt.auth
  }
  return ''
}
</script>

