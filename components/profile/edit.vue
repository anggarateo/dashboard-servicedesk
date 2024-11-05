<script lang="ts" setup>
import Toggle from '@vueform/toggle'

const props = defineProps({
  user: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['updated'])

const avatar = ref()
const inputFile = ref()
const profile = ref({
  firstname: '',
  // lastname: '',
  // username: '',
  // email: '',
  // address: '',
  phone: '',
  avatar: null,
  id_card_number: '',
  is_passphrase: false
})
const payload = ref({
  firstname: '',
  phone: '',
  avatar: null,
  id_card_number: '',
  is_passphrase: false
})
const localPreview = ref(false)

const preview = (file: any) => {
  localPreview.value = true
  avatar.value = URL.createObjectURL(file)
  profile.value.avatar = file
}

watch(() => profile.value, (val) => {
  if (val) {
    payload.value.firstname = val.firstname
    payload.value.phone = `62${val.phone}`
    payload.value.avatar = val.avatar
    payload.value.id_card_number = val.id_card_number
    payload.value.is_passphrase = val.is_passphrase
    emit('updated', payload.value)
  }
}, {
  deep: true
})
watch(() => props.loading, () => {
  profile.value.firstname = props.user.firstname
  // profile.value.lastname = props.user.lastname
  // profile.value.username = props.user.username
  // profile.value.email = props.user.email
  // profile.value.address = props.user.address

  if (props.user.phone?.length >= 2 && props.user.phone[0] === '6' && props.user.phone[1] === '2') {
    profile.value.phone = props.user.phone.substring(2, props.user.phone.length)
  } else {
    profile.value.phone = props.user.phone
  }

  avatar.value = props.user.avatar
  profile.value.id_card_number = props.user.id_card_number
  profile.value.is_passphrase = props.user.is_passphrase
  emit('updated', profile.value)
})
</script>
<template>
  <div>
    <div v-if="loading" class="flex flex-col items-center gap-4">
      <SKeleton class="w-36 h-36 rounded-full" />
      <SKeleton v-for="i in 3" :key="i" class="w-full h-12 rounded-lg" />
    </div>
    <template v-else>
      <div class="flex flex-row justify-center">
        <div class="flex flex-col gap-4 items-center">
          <Avatar
            :avatar="avatar"
            :name="profile.firstname"
            :size="36"
            text-class="text-8xl"
            :local-preview="localPreview"
          />
          <div class="flex flex-col items-center sm:flex-row gap-2">
            <CButton
              text="Upload Foto Baru"
              @click="inputFile.click()"
            />
            <input
              ref="inputFile"
              class="hidden"
              type="file"
              accept="image/*"
              @change="preview($event.target.files[0])"
            >
            <CButton
              text="Hapus"
              type="outlined"
              color="error"
              @click="avatar = '', profile.avatar = null"
            />
          </div>
        </div>
      </div>
      <div class="space-y-6">
        <ReInputText label="Nama" v-model="profile.firstname" />
        <!-- <ReInputText label="Nama Belakang" v-model="profile.lastname" /> -->
        <!-- <ReInputText label="Username" v-model="profile.username" /> -->
        <ReInputText label="Email" :value="user.email" disabled />
        <!-- <ReInputText label="Alamat" v-model="profile.address" /> -->
        <ReInputText
          label="Nomor Telepon"
          v-model="profile.phone"
          icon="left"
          inputmode="tel"
          type="number"
          placeholder="8XX"
        >
          <template #icon>
            <h1 class="text-neutral-400 font-medium">
              +62
            </h1>
          </template>
        </ReInputText>
        <ReInputText label="NIK" v-model="profile.id_card_number" :require="false" />
        <div class="space-y-2">
          <h1>
            Passphrase
          </h1>
          
          <Toggle v-model="profile.is_passphrase" />
        </div>
      </div>
    </template>
  </div>
</template>