<script lang="ts" setup>
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'

useHead({ title: 'Forgot Password' })
definePageMeta({
  layout: 'auth'
})

const disButton = ref(true)
const form = ref({ email: '' })
const rules = computed(() => {
  return {
    email: {
      required,
      email
    }
  }
})
const v$ = useVuelidate(rules, form.value)
const { $api, $toast } = useNuxtApp()
const resetPassword = async () => {
  disButton.value = true
  const {
    data,
    error,
    pending
  } = await $api.forgotPassword.request(form.value)
  if (data.value) $toast.success(data.value.message, { onClose: () => useRouter().push('/auth/login') })
  if (error.value) $toast.error(error.value.data.message)
  if (pending.value) disButton.value = pending.value
  disButton.value = false
}

watch(() => form.value.email, (val) => {
  if (val) v$.value.$validate()
})
watch(() => v$.value.$error, (val) => {
  disButton.value = val
})
</script>
<template>
  <div class="min-h-screen bg-primary flex flex-row items-center justify-center" @keypress.enter="resetPassword">
    <div class="bg-white p-10 rounded-xl space-y-6 w-full sm:w-1/2 xl:w-1/3">
      <div class="flex flex-row justify-center">
        <img src="/logo-auth.png" alt="Logo B-CARE">
      </div>
      <h1 class="text-2xl text-primary font-bold text-center">
        Lupa password?
      </h1>
      <ReInputText
        v-model="form.email"
        label="Email"
        type="email"
        placeholder="Masukkan email Anda"
        auto-complete="email"
        :error="v$.email.$error ? v$.email.$errors[0].$message : ''"
        @change="v$.email?.$touch"
      />
      <CButton text="Reset Password" class="w-full" :disabled="disButton" @click="resetPassword"/>
    </div>
  </div>
</template>