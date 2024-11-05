<script setup  lang="ts">

// eslint-disable-next-line import/default
import Toggle from '@vueform/toggle'
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength, helpers } from '@vuelidate/validators'
import { setToken } from '~/composables/useToken'

const { $api, $toast } = useNuxtApp()
useHead({
  title: 'Login SSO'
})

definePageMeta({
  layout: false,
  components: { Toggle }
})

const userLog = JSON.parse(localStorage.getItem('userLog') || '{ "email": "", "password": "" }')
const term = ref(false)
const formData = reactive({
  email: userLog?.email,
  password: userLog?.password
})
const rules = computed(() => {
  return {
    email: {
      required: helpers.withMessage('The username field is required', required)
    },
    password: {
      required: helpers.withMessage('The password field is required', required),
      minLength: minLength(4)
    }
  }
})
const inputType = ref('password')
const v$ = useVuelidate(rules, formData)

const submitForm = async () => {
  v$.value.$validate()
  if (!v$.value.$error) {
    try {
      const param = {
        username: formData.email,
        password: formData.password
      }
      const { data, error } = await $api.loginSso.postLogin(param)
      if (data.value) {
        // get current role user
        const userRole = await $api.role.get.getRoleUser(data.value.data.authorization.token)

        if (data.value.data.user.roles.length === 1 && data.value.data.user.roles.find(el => el.name.toLowerCase() === 'pengadu')) {
          return $toast.warn('Anda tidak dapat mengakses website ini')
        }

        if (userRole.data.value) {
          const permissions = {
            roles: data.value.data.user.roles,
            menus: userRole.data.value.data
          }
          localStorage.setItem('permissions', JSON.stringify(permissions))
          // get current role user

          localStorage.setItem('local', JSON.stringify(term.value))

          const user = {
            ...data.value?.data.user,
            ...data.value?.data.sso
          }
          localStorage.setItem('user', JSON.stringify(user))
          
          if (term.value) {
            localStorage.setItem('userLog', JSON.stringify(formData))
          }

          await setToken({ auth: data.value?.data.authorization, uploadMaxSize: data.value.data.max_upload_bytes })

          useRouter().push('/dashboard')
        }
        if (userRole.error.value) $toast.error(userRole.error.value.data.message)
      }
      if (error.value) {
        const val:any = error.value
        $toast.error(val?.data?.message || val?.message)
      }
    } catch (e:any) {
      $toast.warn('Connetion Error')
    }
  } else {
    $toast.warn('pastikan form sudah terisi!')
  }
}
</script>
<template>
  <main class="min-h-screen flex items-center bg-primary" @keypress.enter="submitForm">
    <div class=" flex flex-col w-full h-full items-center">
      <div class=" flex items-center h-full w-full sm:w-1/2 xl:w-1/3">
        <div
          class=" w-full h-full p-12 bg-white rounded-2xl justify-center flex flex-col items-center"
          style="box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.10); overflow: hidden; gap: 32px;"
        >
          <img src="/logo-auth.png" alt="Logo B-CARE">
          <div style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 16px; display: flex">
            <div style="align-self: stretch; color: #2953A1; font-size: 24px; font-family: Poppins; font-weight: 700; word-wrap: break-word">
              Login SSO
            </div>
            <div class="w-full">
              <ReInputText
                v-model="formData.email"
                label="Username"
                type="text"
                placeholder="Masukkan Username Anda"
                :error="`${v$.email.$error?v$.email.$errors[0].$message:''}`"
                @change="v$.email?.$touch"
              />
            </div>
            <div class=" w-full mt-2">
              <div class="flex">
                <label>Password</label>
                <div class=" text-error">
                  *
                </div>
              </div>
              <div class="relative w-full">
                <ReInputText
                  v-model="formData.password"
                  :type="inputType"
                  placeholder="Masukkan Password Anda"
                  :require="false"
                  :error="`${v$.password.$error?v$.password.$errors[0].$message:''}`"
                  @change="v$.password?.$touch"
                />
                <Icon
                  v-if="inputType === 'password'"
                  name="ic:baseline-remove-red-eye"
                  class="absolute text-xl cursor-pointer right-3 top-3 text-primary-400"
                  @click="inputType = 'text'"
                />
                <Icon
                  v-else-if="inputType === 'text'"
                  name="zondicons:view-hide"
                  class="absolute text-xl cursor-pointer right-3 top-3 text-primary-400"
                  @click="inputType = 'password'"
                />
              </div>
            </div>
            <div class=" flex w-full mt-2">
              <Toggle v-model="term" />
              <div class=" text-neutral-500 text-sm ml-2">
                Ingat Saya
              </div>
            </div>
          </div>
          <CButton class="w-full" text="Login" @click="submitForm()" />
          <div style="align-self: stretch; flex-direction: column; justify-content: center; align-items: center; gap: 8px; display: flex">
            <div style="width: 350px; height: 32px; position: relative">
              <div style="width: 250px; height: 0px; left: 50px; top: 16px; position: absolute; border: 0.50px #2953A1 solid" />
              <div style="height: 32px; padding: 8px; left: 95px; top: 0px; position: absolute; background: white; justify-content: center; align-items: center; gap: 8px; display: inline-flex">
                <div style="color: #7B809A; font-size: 14px; font-family: Poppins; font-weight: 400; line-height: 25.20px; word-wrap: break-word">
                  atau masuk dengan
                </div>
              </div>
            </div>
            <div style="align-self: stretch; justify-content: flex-start; align-items: flex-start; gap: 8px; display: inline-flex">
              <div class="w-full">
                <a href="/auth/login">
                  <CButton class="w-full !px-1" type="outlined" text="Email dan Kata Sandi" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
