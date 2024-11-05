<script setup>
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, sameAs, helpers } from '@vuelidate/validators'
const { $api } = useNuxtApp()

definePageMeta({
  layout: false
})

const route = useRoute()
const router = useRouter()

const form = reactive({
  password: '',
  confirmPassword: ''
})

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
  v$.value.$validate()
  if (!v$.value.$error) {
    const { data, error } = await $api.aktivasiLink.postAktivasiLink({ password: form.password }, route.params.userId)

    if (data.value) {
      useNuxtApp().$toast.success('Registrasi berhasil, silahkan login.')
      router.push('/auth/login')
    }

    if (error.value) {
      useNuxtApp().$toast.warn(error.value?.data?.message)
    }
  } else {
    return false
  }
}

</script>

<template>
  <div class="min-h-screen flex justify-center items-center p-4 lg:bg-primary" @keypress.enter="submitRegistration">
    <div class="bg-white p-8 rounded-lg shadow-lg w-[480px]">
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
          <CButton type="filled" text="Submit" @click="submitRegistration" />
        </div>
      </form>
    </div>
  </div>
</template>
