<script lang="ts" setup>
const emits = defineEmits(['update:modelValue', 'success'])
const props = defineProps({
  modelValue: Boolean,
  detail: {
    type: Object,
    default: () => {}
  }
})

const { $api, $toast } = useNuxtApp()

const shown = ref(props.modelValue)
const loading = ref(false)
const form = ref({
  id: props.detail?.id || '',
  value: props.detail?.value || '',
  note: props.detail?.note || ''
})

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
  } = await $api.global.updateConfig(form.value.id, form.value)

  if (data.value) {
    emits('success', data.value.message)
    closeConfirm()
  }

  if (error.value) { $toast.error(error.value?.data.message) }

  if (pending.value) { loading.value = pending.value }

  loading.value = false
}

</script>
<template>
  <ModalFullscreen v-model="shown" title="Atur Konfigurasi" :width="4" @close-fullscreen="closeConfirm" @keypress.enter="submit">
    <div class="px-14 space-y-4 overflow-auto pb-40">
      <ReInputText
        v-model="form.value"
        label="Nilai"
        :require="false"
        placeholder="Masukkan nilai disini..."
      />
      <ReInputText
        v-model="form.note"
        label="Catatan"
        :require="false"
        placeholder="Masukkan catatan disini..."
      />
    </div>
    <template #footer>
      <div class="flex flex-row gap-3 w-full">
        <CButton class="w-full" text="Batal" type="outlined" @click="closeConfirm" />
        <CButton class="w-full" text="Simpan" :loading="loading" @click="submit" />
      </div>
    </template>
  </ModalFullscreen>
</template>