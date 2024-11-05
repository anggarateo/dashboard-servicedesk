<script setup  lang="ts">

// eslint-disable-next-line import/default
import Toggle from '@vueform/toggle'
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength, helpers } from '@vuelidate/validators'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  getAdditionalUserInfo
} from 'firebase/auth'
import { useAuthStore } from '@/store/auth'
import { setToken } from '~/composables/useToken'

const { $api, $toast, $config } = useNuxtApp()
const store = useAuthStore()
useHead({
  title: 'Login'
})

definePageMeta({
  layout: 'auth',
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
      required: helpers.withMessage('The email field is required', required),
      email
    },
    password: {
      required: helpers.withMessage('The password field is required', required),
      minLength: minLength(6)
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
        email: formData.email,
        password: formData.password,
        device_id: store.device_id,
        token_fcm: store.token_fcm,
      }
      const { data, error } = await $api.login.postLogin(param)
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
          localStorage.setItem('avatar', data.value.data.user?.avatar ?? '')
          localStorage.setItem('user', JSON.stringify(data.value?.data.user))
          if (term.value) {
            localStorage.setItem('userLog', JSON.stringify(formData))
          }
          
          await setToken({ auth: data.value?.data.authorization, uploadMaxSize: data.value.data.max_upload_bytes })
          
          useRouter().replace('/')
        }
        if (userRole.error.value) { $toast.error(userRole.error.value.data.message) }
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

const auth: any = getAuth()

const loginInWithGoogle = async (): Promise<void> => {
  const provider = new GoogleAuthProvider()

  try {
    const result = await signInWithPopup(auth, provider)
    const credential = GoogleAuthProvider.credentialFromResult(result)
    const token = credential?.idToken

    const username = result.user?.email?.split('@') ?? ''

    const { data, error } = await $api.login.postLoginSosmed({
      firstname: getAdditionalUserInfo(result)?.profile?.given_name,
      lastname: getAdditionalUserInfo(result)?.profile?.family_name,
      username: username[0],
      email: result.user?.email ?? '',
      google_account_id: getAdditionalUserInfo(result)?.profile?.id,
      facebook_account_id: null,
      device_id: store.device_id,
      token_fcm: store.token_fcm,
      id_token: token
    })

    if (data.value) {
      // get current role user
      const userRole = await $api.role.get.getRoleUser(data.value.data.authorization.token)
      if (userRole.data.value) {
        const permissions = {
          roles: data.value.data.user.roles,
          menus: userRole.data.value.data
        }
        localStorage.setItem('permissions', JSON.stringify(permissions))
        localStorage.setItem('avatar', result.user?.photoURL ?? '')
        // get current role user
        localStorage.setItem('local', JSON.stringify(term.value))
        localStorage.setItem('user', JSON.stringify(data.value?.data.user))

        await setToken({ auth: data.value?.data.authorization, uploadMaxSize: data.value.data.max_upload_bytes })

        useRouter().replace('/')
      }
      if (userRole.error.value) { $toast.error(userRole.error.value.data?.message) }
    }
    if (error.value) {
      const val:any = error.value
      $toast.error(val?.data?.message || val?.message)
    }
  } catch (error) {
  }
}

</script>
<template>
  <main class="flex items-center min-h-screen bg-primary" @keypress.enter="submitForm">
    <div class="flex flex-col items-center w-full h-full ">
      <div class="flex items-center h-full w-full sm:w-1/2 xl:w-1/3">
        <div
          class="flex flex-col items-center justify-center w-full h-full p-12 bg-white rounded-2xl"
          style="box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.10); overflow: hidden; gap: 32px;"
        >
          <img src="/logo-auth.png" alt="Logo B-CARE">
          <div style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 16px; display: flex">
            <div style="align-self: stretch; color: #2953A1; font-size: 24px; font-family: Poppins; font-weight: 700; word-wrap: break-word">
              Login
            </div>
            <div style="align-self: stretch; flex-direction: column; justify-content: center; align-items: center; gap: 8px; display: flex">
              <div class="flex flex-col md:flex-row gap-2">
                <div class="w-full">
                  <a href="/auth/login-sso">
                    <CButton
                      class="w-full !py-2 !px-1.5"
                      type="outlined"
                      text="Portal BP Batam"
                      icon-img
                      icon="https://gitlab.bpbatam.go.id/uploads/-/system/appearance/header_logo/1/bp_batam.png"
                    />
                  </a>
                </div>
                <div class="w-full">
                  <CButton
                    class="w-full"
                    type="outlined"
                    text="Google"
                    icon="logos:google-icon"
                    @click="loginInWithGoogle"
                  />
                </div>
              </div>
              <div style="width: 350px; height: 32px; position: relative">
                <div style="width: 250px; height: 0px; left: 50px; top: 16px; position: absolute; border: 0.50px #2953A1 solid" />
                <div style="height: 32px; padding: 8px; left: 95px; top: 0px; position: absolute; background: white; justify-content: center; align-items: center; gap: 8px; display: inline-flex">
                  <div style="color: #7B809A; font-size: 14px; font-family: Poppins; font-weight: 400; line-height: 25.20px; word-wrap: break-word">
                    atau masuk dengan
                  </div>
                </div>
              </div>
            </div>
            <div class="w-full">
              <ReInputText
                v-model="formData.email"
                label="Email"
                type="email"
                placeholder="Masukkan Email Anda"
                :error="`${v$.email.$error?v$.email.$errors[0].$message:''}`"
                @change="v$.email?.$touch"
              />
            </div>
            <div class="w-full mt-2 ">
              <div class="flex flex-row justify-between">
                <div class="flex flex-row">
                  <label>Password</label>
                  <div class=" text-error">
                    *
                  </div>
                </div>
                <NuxtLink to="/auth/forgot-password" class="text-end text-error hover:underline">
                  Lupa Password?
                </NuxtLink>
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
            <div class="flex w-full mt-2 ">
              <Toggle v-model="term" />
              <div class="ml-2 text-sm text-neutral-500">
                Ingat Saya
              </div>
            </div>
          </div>
          <CButton class="w-full" text="Login" @click="submitForm()" />
        </div>
      </div>
    </div>
  </main>
</template>
