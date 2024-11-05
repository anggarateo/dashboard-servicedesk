<script lang="ts" setup>
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { useModal } from 'vue-final-modal'
import ModalInfo from '@/components/ModalInfo.vue'
import FormIncidentReport from './FormIncidentReport.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  shownModal: {
    type: String,
    default: null
  },
  statusTicket: {
    type: String,
    required: true
  },
  idTicket: {
    type: String,
    required: true
  },
  cdTicket: {
    type: String,
    default: ''
  },
  formRequest: {
    type: String,
    default: ''
  },
  isFlowTagIncident: {
    type: Boolean,
    default: false
  },
  trxFlowStageId: {
    type: String,
    default: ''
  }
  // formInfoTicket: {
  //   type: Object,
  //   required: true
  // }
})
const emits = defineEmits(['update:modelValue', 'success', 'closed', 'signed'])
const { $api, $toast, $baseURL } = useNuxtApp()
const shownConfirm = ref(props.modelValue)
const disButton = ref(false)
const categoryService = ref()
const files = ref(Array())
const form: any = ref({
  status_flow_id: '',
  note: '',
  files: [],
  request_service_id: '',
  passphrase: ''
})
const rules = computed(() => {
  let require
  if (props.shownModal === 'change-service') {
    require = {
      request_service_id: {
        required
      },
      note: {
        required
      }
    }
  } else if (props.statusTicket === 'open' || props.statusTicket === 're-open' || props.statusTicket === 'req-open' || props.shownModal === 'reject' || props.shownModal === 'close' || props.shownModal === 're-open') {
    require = {
      note: {
        required
      }
    }
  } else if (props.statusTicket === 'progress' && (props.shownModal === 'confirm' || props.shownModal === 'handled')) {
    require = {
      status_flow_id: {
        required
      },
      note: {
        required
      }
    }
  }

  if (require && props.formRequest && props.shownModal !== 'previous-flow') {
    require = {
      ...require,
      passphrase: {
        required
      }
    }
  }

  return require
})
const v$ = useVuelidate(rules, form.value)
const flowStageId = ref('')
const isReqService = ref(false)
const isRequiredService = ref(false)

onMounted(() => {
  if (props.isFlowTagIncident && (props.shownModal === 'confirm' || props.shownModal === 'handled') && props.statusTicket === 'progress') form.value.status_flow_id = localUuid.statusFlow.find(el => el.code === 'incident-report')?.id

  props.shownModal === 'change-service'
    ? isRequiredService.value = true
    : isRequiredService.value = false
})

watch(() => categoryService.value, (val) => {
  if (val) {
    if (props.shownModal !== 'change-service') {
      modalReqService.open()
    } else {
      form.value.request_service_id = val.split(',')[0]
    }
  } else {
    form.value.request_service_id = ''
  }
})
watch(() => props.isFlowTagIncident, (val) => {
  if (val && (props.shownModal === 'confirm' || props.shownModal === 'handled') && props.statusTicket === 'progress') {
    form.value.status_flow_id = localUuid.statusFlow.find(el => el.code === 'incident-report')?.id
  }
})
watch(() => form.value.status_flow_id, (val) => {
  props.shownModal === 'handled' && val === localUuid.statusFlow.find(el => el.code === 'req-service')?.id
    ? isRequiredService.value = true
    : isRequiredService.value = false
})

async function uploadFile (e: any) {
  disButton.value = true
  const {
    data,
    error,
    pending
  } = await $api.ticket.uploadFile(jsonToFormData({ file: e.target.files[0] }))
  if (data.value) files.value.push(data.value.data)
  if (error.value) $toast.error(error.value.data.message)
  if (pending.value) disButton.value = pending.value
  disButton.value = false
}
function closeConfirm () {
  v$.value.$reset()
  shownConfirm.value = false
  emits('update:modelValue', false)
  files.value.pop()
}
function checkNote () {
  v$.value.$validate()
  if (v$.value.$error) {
    $toast.warn('Pastikan form sudah terisi')
  } else {
    if (files.value.length) form.value.files = files.value
    onConfirm()
  }
}
// async function updateTicket () {
//   disButton.value = true
//   const {
//     data,
//     error,
//     pending
//   } = await $api.ticket.updateTicket(props.idTicket, jsonToFormData(props.formInfoTicket))
//   if (data.value) await confirmTicket('verifyTicket')
//   if (error.value) $toast.error(error.value.data.message)
//   if (pending.value) disButton.value = pending.value
//   disButton.value = false
// }
async function confirmTicket (method: any) {
  disButton.value = true
  const {
    data,
    error,
    pending
  } = await $api.ticket[method](props.idTicket, jsonToFormData(form.value))

  if (data.value) {
    flowStageId.value = data.value?.data?.trx_ticket_report_flow_stage_id
    if (props.formRequest && rules.value) await onDS()
    emits('success', data.value.message)
  }
  if (error.value) $toast.error(error.value.data.message)
  if (pending.value) disButton.value = pending.value
  disButton.value = false
}
async function onConfirm () {
  if (props.shownModal === 'confirm' || props.shownModal === 'handled') await confirmTicket('verifyTicket')
  else if (props.shownModal === 'reject') await confirmTicket('rejectTicket')
  else if (props.shownModal === 'close') await confirmTicket('closeTicket')
  // else if (props.shownModal === 'handled') await confirmTicket('verifyTicket')
  else if (props.shownModal === 'req-open') await confirmTicket('approveReOpenTicket')
  else if (props.shownModal === 're-open') await confirmTicket('reOpenTicket')
  else if (props.shownModal === 'handle-flow') await handlingFlow()
  else if (props.shownModal === 'change-service') await confirmTicket('changeService')
  else if (props.shownModal === 'previous-flow') await confirmTicket('previousFlow')
  closeConfirm()
}

async function handlingFlow () {
  disButton.value = true

  const {
    data,
    error,
    pending
  } = await $api.ticket.handleFlow(props.idTicket, { user_id: '' })

  if (data.value) emits('success', data.value.message)
  if (error.value) $toast.error(error.value.data.message)
  if (pending.value) disButton.value = pending.value
  
  disButton.value = false
}

const modalReqService = useModal({
  component: ModalInfo,
  attrs: {
    title: 'Apakah Anda yakin akan menambah layanan?',
    info: true,
    type: 'yesOrNo',
    onCloseInfo () {
      closeReqService(false)
    },
    onCloseAll () {
      closeReqService(true)
    }
  }
})

function closeReqService (yes: Boolean) {
  if (yes) {
    form.value.request_service_id = categoryService.value.split(',')[0]
  } else {
    categoryService.value = null
    form.value.request_service_id = ''
  }
  modalReqService.close()
}

function title () {
  const modal = props.shownModal
  const status = props.statusTicket
  let result

  if (modal === 'close') {
    result = 'Close Tiket'
  } else if (modal === 'reject') {
    result = 'Tolak Tiket'
  } else if (modal === 'confirm') {
    result = 'Konfirmasi Tiket'
  } else if (modal === 'req-open') {
    result = 'Konfirmasi Buka Kembali Tiket'
  } else if (modal === 're-open') {
    result = 'Buka Kembali Tiket'
  } else if (modal === 'handle-flow') {
    result = 'Tangani Alur Tiket'
  } else if (modal === 'change-service') {
    result = 'Ganti Layanan Tiket'
  } else if (modal === 'previous-flow') {
    result = 'Kembali ke Layanan Tiket Sebelumnya'
  } else if (status === 'progress') {
    result = 'Penanganan Tiket'
  }

  return result
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
    passphrase: form.value.passphrase,
    trx_ticket_report_flow_stage_id: flowStageId.value
  },
  {
    onResponse ({ response }: { response: any }) {
      if (response.status === 206) {
        $toast.warn(response._data.message)
      }
    }
  })

  if (res) {
    if (res.data) emits('signed', $baseURL() + res.data.path)
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
    v-model="shownConfirm"
    :title="title()"
    type="preview"
    info
    :icon="shownModal === 'reject'"
    :disabled-button="disButton"
    @closed="emits('closed')"
    @close-info="closeConfirm()"
    @close-all="checkNote()"
  >
    <template #icon>
      <svg width="57" height="56" viewBox="0 0 57 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4.5" y="4" width="48" height="48" rx="24" fill="#D1FADF"/>
        <rect x="4.5" y="4" width="48" height="48" rx="24" stroke="#ECFDF3" stroke-width="8"/>
        <path d="M38.5 27.0799V27.9999C38.4988 30.1563 37.8005 32.2545 36.5093 33.9817C35.2182 35.7088 33.4033 36.9723 31.3354 37.5838C29.2674 38.1952 27.0573 38.1218 25.0345 37.3744C23.0117 36.6271 21.2847 35.246 20.111 33.4369C18.9373 31.6279 18.3798 29.4879 18.5217 27.3362C18.6636 25.1844 19.4972 23.1362 20.8983 21.4969C22.2994 19.8577 24.1928 18.7152 26.2962 18.24C28.3996 17.7648 30.6003 17.9822 32.57 18.8599M38.5 19.9999L28.5 30.0099L25.5 27.0099" stroke="#039855" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </template>
    <template
      v-if="shownModal !== 'handle-flow'"
      #content
    >
      <div class="space-y-8 h-[calc(100vh-16rem)] overflow-x-hidden overrlow-auto">
        <h1>
          Silahkan melengkapi informasi dibawah ini
        </h1>
        <div class="space-y-4 px-2">
          <DropdownPagination
            v-if="(shownModal === 'confirm' || shownModal === 'handled') && statusTicket === 'progress'"
            v-show="!isFlowTagIncident"
            v-model="form.status_flow_id"
            api-module="ticket"
            api-method="getStatusFlow"
            :api-params="trxFlowStageId ? { trx_flow_stage_id: trxFlowStageId } : {}"
            option-label="name"
            option-value="id"
            label="Tindakan"
            placeholder="Pilih tindakan"
            :disabled="isFlowTagIncident"
            :error="v$.status_flow_id.$error ? v$.status_flow_id.$errors[0].$message : ''"
            @change="v$.status_flow_id?.$touch"
          />
          <CheckBox
            v-if="!isRequiredService"
            v-model="isReqService"
            id="requestAddService"
            label="Request Penambahan Layanan"
          />
          <DropdownPagination
            v-if="shownModal === 'confirm' || shownModal === 'handled' || shownModal === 'change-service'"
            v-show="isRequiredService ? shownModal === 'confirm' || isRequiredService : isReqService"
            v-model="categoryService"
            api-module="ticket"
            api-method="getServices"
            option-label="name"
            :option-value="['id', 'service_category', 'id']"
            option-custom
            label="Layanan"
            placeholder="Pilih layanan"
            :required="isRequiredService"
            :optional="shownModal === 'confirm'"
            :clearable="shownModal === 'confirm'"
            :error="v$?.request_service_id?.$error ? v$?.request_service_id?.$errors[0].$message : ''"
            @change="v$?.request_service_id?.$touch"
          />
          <div class="space-y-2">
            <h1>
              {{ shownModal === 're-open' || shownModal === 'req-open' || shownModal === 'change-service' || shownModal === 'previous-flow' ? 'Catatan' : shownModal === 'close' ? 'Delivery Solusi' : 'Catatan Internal' }} <span v-if="shownModal !== 'previous-flow'" class="text-error">*</span>
            </h1>
            <h1 v-if="shownModal === 'reject'" class="text-error text-xs italic !mt-0">
              Note: akan dikirim juga ke komentar umum
            </h1>
            <FormIncidentReport
              v-if="form.status_flow_id === localUuid.statusFlow.find(el => el.code === 'incident-report')?.id"
              :error="v$?.note?.$error ? v$?.note?.$errors[0].$message : ''"
              v-model="form.note"
            />
            <ReTextEditor
              v-model="form.note"
              :placeholder="shownModal === 're-open' || shownModal === 'req-open' || shownModal === 'change-service' || shownModal === 'previous-flow' ? 'Tuliskan catatan' : shownModal === 'close' ? 'Uraikan solusi yang didapat untuk pemohon' : 'Tuliskan catatan internal disini'"
              :inline-image="false"
              :error="v$?.note?.$error ? v$?.note?.$errors[0].$message : ''"
              :dropzone-only="form.status_flow_id === localUuid.statusFlow.find(el => el.code === 'incident-report')?.id ? true : false"
              @change="v$?.note?.$touch"
              @upload="uploadFile($event)"
              @cancel-upload="files.splice($event, 1)"
            />
          </div>

          <ReInputText
            v-if="formRequest && shownModal !== 'previous-flow'"
            v-model="form.passphrase"
            label="Passphrase"
            type="password"
            placeholder="Masukkan passphrase"
            :error="v$?.passphrase?.$error ? v$?.passphrase?.$errors[0].$message : ''"
            @change="v$?.passphrase?.$touch"
          />
        </div>
      </div>
    </template>
  </ModalInfo>
</template>