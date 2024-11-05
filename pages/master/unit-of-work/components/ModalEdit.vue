<script lang="ts" setup>
const emits = defineEmits(['update:modelValue', 'success'])
const props = defineProps({
  modelValue: Boolean,
  update: { // value: akun_wa | is_active_send_wa | is_active_send_email
    type: String,
    required: true
  },
  detail: {
    type: Object,
    default: () => {}
  }
})

const { $api, $toast } = useNuxtApp()

const shown = ref(props.modelValue)
const loading = ref(false)
const form = ref(props.detail)

function title () {
  if (props.update === 'akun_wa') {
    return 'Kode Akun Whatsapp'
  } else if (props.update === 'is_active_send_wa' && form.value.is_active_send_wa) {
    return 'Aktifkan Notifikasi Whatsapp'
  } else if (props.update === 'is_active_send_wa' && !form.value.is_active_send_wa) {
    return 'Nonaktifkan Notifikasi Whatsapp'
  } else if (props.update === 'is_active_send_email' && form.value.is_active_send_email) {
    return 'Aktifkan Notifikasi Email'
  } else if (props.update === 'is_active_send_email' && !form.value.is_active_send_email) {
    return 'Nonaktifkan Notifikasi Email'
  } else if (props.update === 'no_wa') {
    return 'Nomor Whatsapp'
  }
}

function closeConfirm () {
  shown.value = false
  emits('update:modelValue', false)
}

async function submit () {
  loading.value = true

  const {
    data,
    error,
    pending
  } = await $api.global.updateUnitOfWork(form.value.id, form.value)

  if (data.value) {
    emits('success', data.value.message)
    closeConfirm()
  }

  if (error.value) {
    const err: any = error.value
    $toast.error(err.data.message)
  }

  if (pending.value) { loading.value = pending.value }

  loading.value = false
}

function onSubmit () {
  if (form.value.no_wa && form.value.no_wa[0] !== '8') return $toast.warn('Pastikan nomor whatsapp valid')

  submit()
}
</script>
<template>
  <ModalInfo
    v-model="shown"
    info
    type="preview"
    :title="title()"
    :disabled-button="loading"
    @close-info="closeConfirm()"
    @close-all="onSubmit()"
    @closed="closeConfirm()"
  >
    <template #content>
      <ReInputText
        v-if="update === 'akun_wa'"
        v-model="form.akun_wa"
        placeholder="Masukkan kode akun whatsapp"
        :require="false"
      />

      <ReInputText
        v-if="update === 'no_wa'"
        v-model="form.no_wa"
        icon="left"
        inputmode="tel"
        type="number"
        placeholder="8XX"
        :require="false"
      >
        <template #icon>
          <h1 class="text-neutral-400 font-medium">
            +62
          </h1>
        </template>
      </ReInputText>
    </template>
  </ModalInfo>
</template>