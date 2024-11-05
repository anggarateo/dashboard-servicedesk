<script setup lang="ts">
import { ModalReDS } from '~/constants/types'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

const props = defineProps<ModalReDS>()
const emits = defineEmits(['update:modelValue', 'signed', 'success'])
const { $api, $toast, $baseURL } = useNuxtApp()

const shown = ref(props.modelValue)
const disButton = ref(false)
const form = reactive({
  passphrase: ''
})
const rules = computed(() => {
  return {
    passphrase: {
      required
    }
  }
})
const v$ = useVuelidate(rules, form)

watch(() => shown.value, (val) => {
  emits('update:modelValue', val)
})

async function checkForm () {
  v$.value.$validate()
  if (v$.value.$error) {
    $toast.warn('Pastikan form sudah terisi')
  } else {
    await onDS()
    shown.value = false
  }
}
async function onDS () {
  disButton.value = true

  const {
    data: { value: res },
    error: { value: err },
    pending: { value: pend }
  } = await $api.ticket.DSReport({
    code_ticket: props.cdTicket,
    form_request: props.formRequest,
    passphrase: form.passphrase,
    trx_ticket_report_flow_stage_id: props.flowStageId
  },
  {
    onResponse ({ response }: { response: any }) {
      if (response.status === 206) {
        $toast.warn(response._data.message)
      }
    }
  })

  if (res) {
    if (res.data) {
      emits('signed', $baseURL() + res.data.path)
      emits('success', 'Berhasil tanda tangan')
    }
  }
  if (err) {
    const e: any = err
    $toast.error(e.data.message)
  }
  if (pend) disButton.value = pend

  disButton.value = false
}
</script>

<template>
  <ModalInfo
    v-model="shown"
    info
    :icon="false"
    type="preview"
    title="Tanda Tangan Ulang"
    :disabled-button="disButton"
    @close-info="shown = false"
    @close-all="checkForm"
  >
    <template #content>
      <ReInputText
        v-model="form.passphrase"
        label="Passphrase"
        type="password"
        placeholder="Masukkan passphrase"
        :error="v$?.passphrase?.$error ? v$?.passphrase?.$errors[0].$message : ''"
        @change="v$?.passphrase?.$touch"
      />
    </template>
  </ModalInfo>
</template>
