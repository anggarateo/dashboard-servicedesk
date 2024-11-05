<script setup>
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, sameAs, helpers } from '@vuelidate/validators'
const { $api, $toast } = useNuxtApp()

definePageMeta({
  layout: false,
  alias: '/invited-user'
})

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const form = reactive({
  password: '',
  confirmPassword: ''
})
const isBpbatam = ref(false)
const role = ref()
const rules = computed(() => {
  return {
    password: {
      required: helpers.withMessage('The password field is required', required),
      minLength: minLength(8)
    },
    confirmPassword: {
      required: helpers.withMessage('The confirm password field is required', required),
      minLength: minLength(8),
      sameAsPassword: sameAs(form.password)
    }
  }
})

const v$ = useVuelidate(rules, form)

const submitRegistration = async () => {
  loading.value = true
  if (!isBpbatam.value) v$.value.$validate()
  if (!v$.value.$error) {
    const { data, error } = await $api.aktivasiLink.postAktivasiLink({ password: form.password }, route.params.userId)

    if (data.value) {
      useNuxtApp().$toast.success(data.value?.message)
      router.push('/auth/login')
    }

    if (error.value) {
      useNuxtApp().$toast.warn(error.value?.data?.message)
    }
  } else {
    return false
  }
  loading.value = false
}
async function getEmail () {
  loading.value = true
  const {
    data,
    error,
    pending
  } = await $api.inviteLink.getInvitedLink(route.params.userId)
  if (data.value) {
    const status = data.value.data.status
    if (status !== 'Menunggu Registrasi') {
      let msg
      if (status === 'Registrasi') msg = 'digunakan'
      else msg = 'kadaluarsa'
      return $toast.warn('Link sudah ' + msg, { onClose: () => router.push('/auth/login') })
    }
    const email = data.value.data.sending_mail
    if (email.split('@')[1] === 'bpbatam.go.id') isBpbatam.value = true
    role.value = data.value.data.role.name
  }
  if (error.value) $toast.error(error.value.data.message)
  if (pending.value) loading.value = pending.value
  loading.value = false
}
getEmail()
</script>

<template>
  <div class="min-h-screen flex justify-center items-center p-4 lg:bg-primary">
    <div class="bg-white p-8 rounded-lg shadow-lg w-[480px]">
      <div v-if="isBpbatam" class="space-y-4 text-center">
        <h1 class="font-bold text-2xl">
          Klik konfirmasi untuk bergabung ke B-CARE {{ role ? `sebagai ${role}` : '' }}
        </h1>
        <CButton text="Konfirmasi" :loading="loading" @click="submitRegistration"/>
      </div>
      <template v-else>
        <h1 class="mb-6 font-bold text-2xl">
          Lengkapi kredensial Anda
        </h1>
        <form @submit.prevent>
          <ReInputText
            v-model="form.password"
            type="password"
            :required="true"
            label="Password"
            class="mb-4"
            placeholder="Isi password disini"
            :error="v$.password.$error ? v$.password.$errors[0].$message : ''"
            @change="v$.password?.$touch"
          />
          <ReInputText
            v-model="form.confirmPassword"
            type="password"
            :required="true"
            label="Konfirmasi Password"
            class="mb-4"
            placeholder="Isi konfirmasi password disini"
            :error="v$.confirmPassword.$error ? v$.confirmPassword.$errors[0].$message : ''"
            @change="v$.confirmPassword?.$touch"
          />
          <div class="flex justify-end">
            <CButton type="filled" text="Submit" :loading="loading" @click="submitRegistration" />
          </div>
        </form>
      </template>
    </div>
  </div>
</template>
