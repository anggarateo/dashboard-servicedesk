<script lang="ts" setup>
const emit = defineEmits(['updated', 'invalid', 'reset'])
const props = defineProps({
  resetForm: {
    type: Boolean,
    default: false
  }
})

const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const validator = ref({
  minLength: false,
  minCapital: false,
  minNumber: false,
  isNew: '',
  confirmed: ''
})
const inputTypeOld = ref('password')
const inputTypeNew = ref('password')
const inputTypeConfirm = ref('password')

watch(() => oldPassword.value, (val) => {
  if (val) {
    newPassword.value && newPassword.value === val ? validator.value.isNew = 'Kata sandi baru harus beda dengan yang lama!' : validator.value.isNew = ''
  } else {
    validator.value.isNew = ''
    if (!newPassword.value && !confirmPassword.value) emit('reset')
  }
})
watch(() => newPassword.value, (val) => {
  const capitals: any[] = []
  if (val) {
    val.length >= 8 ? validator.value.minLength = true : validator.value.minLength = false
    for (let i = 0; i < val.length; i++) {
      if (val[i] === val[i].toUpperCase() && !val[i].match(/(\d+)/)) capitals.push(val[i])
    }
    capitals.length ? validator.value.minCapital = true : validator.value.minCapital = false
    val.match(/(\d+)/) ? validator.value.minNumber = true : validator.value.minNumber = false
    oldPassword.value && val === oldPassword.value ? validator.value.isNew = 'Kata sandi baru harus beda dengan yang lama!' : validator.value.isNew = ''
    confirmPassword.value && confirmPassword.value !== val ? validator.value.confirmed = 'Konfirmasi kata sandi tidak sesuai!' : validator.value.confirmed = ''
  } else {
    capitals.pop()
    validator.value.minLength = false
    validator.value.minCapital = false
    validator.value.minNumber = false
    validator.value.isNew = ''
    validator.value.confirmed = ''
    if (!oldPassword.value && !confirmPassword.value) emit('reset')
  }
})
watch(() => confirmPassword.value, (val) => {
  if (val) {
    newPassword.value && newPassword.value !== val ? validator.value.confirmed = 'Konfirmasi kata sandi tidak sesuai!' : validator.value.confirmed = ''
  } else {
    validator.value.confirmed = ''
    if (!oldPassword.value && !newPassword.value) emit('reset')
  }
})
watch(() => validator.value, (val) => {
  if (val.minLength && val.minCapital && val.minNumber && !val.isNew && !val.confirmed && oldPassword.value && newPassword.value && confirmPassword.value) {
    emit('updated', { current_password: oldPassword.value, new_password: newPassword.value, password_confirmation: confirmPassword.value })
  } else {
    emit('invalid', val)
  }
}, {
  deep: true
})
watch(() => props.resetForm, (val) => {
  if (val) {
    oldPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  }
})
</script>
<template>
  <div class="space-y-6">
    <div class="relative w-full">
      <ReInputText
        v-model="oldPassword"
        :type="inputTypeOld"
        label="Kata Sandi Lama"
        placeholder="Masukkan kata sandi lama Anda"
      />
      <Icon
        v-if="inputTypeOld === 'password'"
        name="ic:baseline-remove-red-eye"
        class="absolute text-xl cursor-pointer right-3 top-10 text-primary-400"
        @click="inputTypeOld = 'text'"
      />
      <Icon
        v-else-if="inputTypeOld === 'text'"
        name="zondicons:view-hide"
        class="absolute text-xl cursor-pointer right-3 top-10 text-primary-400"
        @click="inputTypeOld = 'password'"
      />
    </div>
    <div class="space-y-2">
      <div class="relative w-full">
        <ReInputText
          v-model="newPassword"
          :type="inputTypeNew"
          label="Kata Sandi Baru"
          placeholder="Masukkan kata sandi baru Anda"
          :error="validator.isNew"
        />
        <Icon
          v-if="inputTypeNew === 'password'"
          name="ic:baseline-remove-red-eye"
          class="absolute text-xl cursor-pointer right-3 top-10 text-primary-400"
          @click="inputTypeNew = 'text'"
        />
        <Icon
          v-else-if="inputTypeNew === 'text'"
          name="zondicons:view-hide"
          class="absolute text-xl cursor-pointer right-3 top-10 text-primary-400"
          @click="inputTypeNew = 'password'"
        />
      </div>
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
        v-model="confirmPassword"
        :type="inputTypeConfirm"
        label="Ulangi Kata Sandi Baru"
        placeholder="Ulangi kata sandi baru Anda"
        :error="validator.confirmed"
      />
      <Icon
        v-if="inputTypeConfirm === 'password'"
        name="ic:baseline-remove-red-eye"
        class="absolute text-xl cursor-pointer right-3 top-10 text-primary-400"
        @click="inputTypeConfirm = 'text'"
      />
      <Icon
        v-else-if="inputTypeConfirm === 'text'"
        name="zondicons:view-hide"
        class="absolute text-xl cursor-pointer right-3 top-10 text-primary-400"
        @click="inputTypeConfirm = 'password'"
      />
    </div>
  </div>
</template>