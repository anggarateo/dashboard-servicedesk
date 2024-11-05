<script lang="ts" setup>
import jsonToFormData from '~/utils/jsonToFormData'
import { useProfileStore } from '~/store/profile'
import { isValidNIK } from 'nusantara-valid'

useHead({ title: 'Profile' })
definePageMeta({
  alias: '/profil',
  middleware: 'auth'
})

const user = ref()
const activeTab = ref('profile')
const disButton = ref(false)
const updateProfile = ref()
const updatePassword = ref()
const resetPassword = ref(false)
const loading = ref(false)
const profileStore: any = useProfileStore()
const invalid = ref({
  minLength: false,
  minCapital: false,
  minNumber: false,
  isNew: '',
  confirmed: ''
})
const { $api, $toast, $localUser, $mitt } = useNuxtApp()
const route = useRoute()
const router = useRouter()

const getData = async () => {
  disButton.value = true
  loading.value = true
  const {
    data,
    pending,
    error
  } = await $api.profile.getProfile()
  if (data.value) user.value = data.value.data
  if (error.value) $toast.error(error.value.data.message)
  if (pending.value) disButton.value = pending.value
  disButton.value = false
  loading.value = false
}
getData()
const onUpdate = async () => {
  disButton.value = true
  loading.value = true

  let body
  activeTab.value === 'profile'
   ? body = jsonToFormData(updateProfile.value)
   : activeTab.value === 'password'
     ? body = jsonToFormData(updatePassword.value)
     : body = new FormData()

  const {
    data,
    pending,
    error
  } = await $api.profile.updateProfile(body)
  if (data.value) {
    $toast.success('Profil telah diperbarui')
    user.value = data.value.data
    profileStore.$patch((state: any) => {
      state.user.avatar = data.value.data.avatar
    })
    activeTab.value = 'profile'

    if (activeTab.value === 'profile') {
      const localUser = {
        ...$localUser(),
        fullname: data.value.data.fullname,
        phone: data.value.data.phone,
        id_card_number: data.value.data.id_card_number,
        is_passphrase: data.value.data.is_passphrase
      }

      $mitt.emit('profile', localUser)

      if (route.query?.redirectTo) {
        const path = route.query.redirectTo
        const query = route.query?.idTicket

        router.replace(`/${path}${query ? '/' + query : ''}`)
      }
    }
    
  }
  if (error.value) $toast.error(error.value.data.message)
  if (pending.value) disButton.value = pending.value
  resetPassword.value = true
  disButton.value = false
  loading.value = false
}

watch(() => activeTab.value, (val) => {
  if (val === 'password' && !updatePassword.value) disButton.value = true
  else disButton.value = false
})

function validation (val = invalid.value, payload = updateProfile.value) {
  if (activeTab.value === 'profile') {
    if (
      payload.firstname
      && payload.phone
      && payload.phone !== '62'
      && payload.phone !== '62null'
      // && payload.id_card_number
      // && isValidNIK(payload.id_card_number)
    ) {
      return onUpdate()
    } else if (!payload.firstname) {
      return $toast.warn('Nama wajib diisi')
    } else if (!payload.phone || payload.phone === '62' || payload.phone === '62null') {
      return $toast.warn('Nomor telepon wajib diisi')
    }
    // else if (!payload.id_card_number) {
    //   return $toast.warn('NIK wajib diisi')
    // } else if (!isValidNIK(payload.id_card_number)) {
    //   return $toast.warn('NIK tidak valid')
    // }
  } else if (activeTab.value === 'password') {
    if (val.minLength && val.minCapital && val.minNumber && !val.isNew && !val.confirmed) {
      return onUpdate()
    } else if (!val.minLength) {
      return $toast.warn('Minimal 8 karakter')
    } else if (!val.minCapital) {
      return $toast.warn('Mengandung setidaknya 1 huruf besar')
    } else if (!val.minNumber) {
      return $toast.warn('Mengandung setidaknya 1 angka')
    } else if (val.isNew) {
      return $toast.warn(val.isNew)
    } else if (val.confirmed) {
      return $toast.warn(val.confirmed)
    }
  }
}
</script>
<template>
  <div class="w-full min-h-screen p-4 rounded-lg shadow" @keypress.enter="validation()">
    <div class="space-y-2">
      <Tab
        :tabs="[
          { id: 'profile', name: 'Edit Profil' },
          { id: 'password', name: 'Kata Sandi' }
        ]"
        :active-tab="activeTab"
        type="underlined-primary"
        styles="font-semibold rounded-lg m-2 mx-1"
        @switch-tab="activeTab = $event.id"
      />
      <div class="w-full p-8 space-y-10 bg-white shadow-md rounded-lg">
        <ProfileEdit
          v-show="activeTab === 'profile'"
          :user="user"
          :loading="loading"
          @updated="updateProfile = $event"
        />
        <ProfilePassword
          v-show="activeTab === 'password'"
          :reset-form="resetPassword"
          @updated="disButton = false, updatePassword = $event"
          @invalid="disButton = true, invalid = $event"
          @reset="resetPassword = false"
        />
        <div class="flex flex-row justify-end">
          <CButton
            text="Simpan Perubahan"
            :disabled="disButton"
            @click="validation()"
          />
        </div>
      </div>
    </div>
  </div>
</template>
