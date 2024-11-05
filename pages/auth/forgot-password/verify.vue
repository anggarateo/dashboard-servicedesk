<script lang="ts" setup>
useHead({ title: 'Verify' })
definePageMeta({
  layout: 'auth'
})

const disButton = ref(true)
const form = ref({
  password: '',
  rePassword: ''
})
const inputType = ref({
  password: 'password',
  rePassword: 'password'
})
const validator = ref({
  minLength: false,
  minCapital: false,
  minNumber: false,
  confirmed: ''
})

watch(() => form.value.password, (val) => {
  const capitals: any[] = []
  if (val) {
    val.length >= 8 ? validator.value.minLength = true : validator.value.minLength = false
    for (let i = 0; i < val.length; i++) {
      if (val[i] === val[i].toUpperCase() && !val[i].match(/(\d+)/)) capitals.push(val[i])
    }
    capitals.length ? validator.value.minCapital = true : validator.value.minCapital = false
    val.match(/(\d+)/) ? validator.value.minNumber = true : validator.value.minNumber = false
    form.value.rePassword && form.value.rePassword !== val ? validator.value.confirmed = 'Kata sandi tidak sesuai!' : validator.value.confirmed = ''
  } else {
    capitals.pop()
    validator.value.minLength = false
    validator.value.minCapital = false
    validator.value.minNumber = false
    validator.value.confirmed = ''
  }
})
watch(() => form.value.rePassword, (val) => {
  if (val) {
    form.value.password && form.value.password !== val ? validator.value.confirmed = 'Kata sandi tidak sesuai!' : validator.value.confirmed = ''
  } else {
    validator.value.confirmed = ''
  }
})
watch(() => validator.value, (val) => {
  if (val.minLength && val.minCapital && val.minNumber && !val.confirmed && form.value) {
    disButton.value = false
  } else {
    disButton.value = true
  }
}, {
  deep: true
})

const { $api, $toast } = useNuxtApp()
const resetPassword = async () => {
  disButton.value = true
  const {
    data,
    error,
    pending
  } = await $api.forgotPassword.resetPassword({ token: useRoute().query.token, password: form.value.rePassword })
  if (data.value) $toast.success(data.value.message, { onClose: () => useRouter().push('/auth/login') })
  if (error.value) $toast.error(error.value.data.message)
  if (pending.value) disButton.value = pending.value
  disButton.value = false
}
</script>
<template>
  <div class="min-h-screen bg-primary flex flex-row items-center justify-center" @keypress.enter="resetPassword">
    <div class="bg-white p-10 rounded-xl space-y-6 w-full sm:w-1/2 xl:w-1/3">
      <div class="flex flex-row justify-center">
        <img src="/logo-auth.png" alt="Logo B-CARE">
      </div>
      <h1 class="text-2xl text-primary font-bold text-center">
        Reset Password
      </h1>
      <div class="space-y-2 w-full relative">
        <ReInputText
          v-model="form.password"
          class="w-full"
          :type="inputType.password"
          label="Masukkan Kata Sandi Baru"
          placeholder="Masukkan kata sandi baru Anda"
          auto-complete="off"
        />
        <Icon
          v-if="inputType.password === 'password'"
          name="ic:baseline-remove-red-eye"
          class="absolute right-3 top-9 text-xl text-primary-400 cursor-pointer"
          @click="inputType.password = 'text'"
        />
        <Icon
          v-else-if="inputType.password === 'text'"
          name="zondicons:view-hide"
          class="absolute right-3 top-9 text-xl text-primary-400 cursor-pointer"
          @click="inputType.password = 'password'"
        />
        <div class="pl-3 text-xs text-error-500">
          <div class="flex flex-row items-center gap-1" :class="{ 'text-success-500': validator.minLength }">
            <Icon :name="validator.minLength ? 'ic:baseline-check' : 'ic:baseline-close'" />
            <h1>
              Minimal 8 karakter
            </h1>
          </div>
          <div class="flex flex-row items-center gap-1" :class="{ 'text-success-500': validator.minCapital }">
            <Icon :name="validator.minCapital ? 'ic:baseline-check' : 'ic:baseline-close'" />
            <h1>
              Mengandung setidaknya 1 huruf besar
            </h1>
          </div>
          <div class="flex flex-row items-center gap-1" :class="{ 'text-success-500': validator.minNumber }">
            <Icon :name="validator.minNumber ? 'ic:baseline-check' : 'ic:baseline-close'" />
            <h1>
              Mengandung setidaknya 1 angka
            </h1>
          </div>
        </div>
      </div>
      <div class="relative w-full">
        <ReInputText
          v-model="form.rePassword"
          class="w-full"
          :type="inputType.rePassword"
          label="Ulangi Kata Sandi"
          placeholder="Ulangi kata sandi Anda"
          :error="validator.confirmed"
          auto-complete="off"
        />
        <Icon
          v-if="inputType.rePassword === 'password'"
          name="ic:baseline-remove-red-eye"
          class="absolute right-3 top-11 text-xl text-primary-400 cursor-pointer"
          @click="inputType.rePassword = 'text'"
        />
        <Icon
          v-else-if="inputType.rePassword === 'text'"
          name="zondicons:view-hide"
          class="absolute right-3 top-11 text-xl text-primary-400 cursor-pointer"
          @click="inputType.rePassword = 'password'"
        />
      </div>
      <CButton
        text="Reset Password"
        class="w-full"
        :disabled="disButton"
        @click="resetPassword"
      />
    </div>
  </div>
</template>