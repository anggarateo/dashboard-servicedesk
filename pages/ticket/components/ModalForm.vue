<script setup lang="ts">
import { useModal } from 'vue-final-modal'
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import ModalInfo from '@/components/ModalInfo.vue'
import Toggle from '@vueform/toggle/src/Toggle'

const { $api, $toast, $formatDate, $localUser } = useNuxtApp()
const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  type: {
    type: String,
    default: 'create'
  },
  data: {
    type: Object,
    default: null
  }
})
const emits = defineEmits(['close'])
const shown = ref(false)
const titleInfo = ref()
const showHome = ref(true)
const loading = ref(false)
const initForm = () => ({
  transaction_date: '',
  ticket_type: '',
  report_source_id: '',
  name: '',
  email: '',
  phone: '',
  service_category_id: '',
  service_id: '',
  impact_level_id: '',
  title: '',
  content: '',
  is_anonymous: false,
  files: []
})
const form = reactive(initForm())
const ticketTypes = ref([
  {
    label: 'Tiket Eksternal',
    value: 'external'
  },
  {
    label: 'Tiket Internal',
    value: 'internal'
  }
])
const categoryService = ref()
const files = ref(Array())
const date = ref()
const forMe = ref(false)
const selectTicketType = ref(Array())
const serviceFilter = ref({
  isShow: false,
  units_of_work_id: '',
  service_category_id: ''
})
const serviceParams = ref({})
const categoryParams = ref({
  units_of_work_id: ''
})

watch(() => props.show, (val, oldVal) => {
  shown.value = val
  if (!val) {
    Object.assign(form, initForm())
    showHome.value = false
  }
})
watch(() => categoryService.value, (val) => {
  if (val) {
    const result = val.split(',')
    form.service_category_id = result[1]
    form.service_id = result[0]
  }
})
watch(() => form.is_anonymous, (val) => {
  if (val) form.name = 'Anonim'
  else form.name = ''
})
watch(() => date.value, (val) => {
  if (val) form.transaction_date = $formatDate(val, 'yyyy-MM-dd HH:mm')
})
watch(() => forMe.value, (val) => {
  if (val) {
    selectTicketType.value = [ticketTypes.value[1]]
    form.ticket_type = ticketTypes.value[1].value
    form.units_of_work_id = $localUser().units_of_work_id
    form.email = $localUser().email
    form.name = $localUser().fullname
    form.position_text = $localUser().POS_NM
    form.phone = $localUser()?.phone || ''
  }
})
watch(() => serviceFilter.value, (val) => {
  serviceParams.value = val

  categoryParams.value.units_of_work_id = val.units_of_work_id

  if (!val.isShow) {
    serviceParams.value = {}
  }
}, {
  deep: true
})

const rules = computed(() => {
  return {
    transaction_date: {
      required
    },
    ticket_type: {
      required
    },
    report_source_id: {
      required
    },
    name: {
      required
    },
    email: {
      required,
      email
    },
    phone: {
      required
    },
    service_category_id: {
      required
    },
    service_id: {
      required
    },
    impact_level_id: {
      required
    },
    title: {
      required
    },
    content: {
      required
    }
  }
})


const v$ = useVuelidate(rules, form)

const submitForm = async () => {
  v$.value.$validate()
  if (!v$.value.$error) {
    if (files.value.length) form.files = files.value
    form.phone = form.phone && !forMe.value ? `62${form.phone}` : form.phone
    createTicket(jsonToFormData(form))
  } else {
    $toast.warn('pastikan form sudah terisi!')
  }
}
const createTicket = async (body: FormData) => {
  loading.value = true
  const {
    data,
    error,
    pending
  } = await $api.ticket.createTicket(body)
  if (data.value) {
    $toast.success('Tiket berhasil dibuat')
    files.value.pop()
    closeFullscreen(true)
  }
  if (error.value) $toast.error(error.value.data.message)
  if (pending.value) loading.value = pending.value
  loading.value = false
}
const uploadFile = async (e: any) => {
  loading.value = true
  const {
    data,
    error,
    pending
  } = await $api.ticket.uploadFile(jsonToFormData({ file: e.target.files[0] }))
  if (data.value) files.value.push(data.value.data)
  if (error.value) $toast.error(error.value.data.message)
  if (pending.value) loading.value = pending.value
  loading.value = false
}

function changeAlert () {
  titleInfo.value = 'Keluar tanpa menyimpan?'
  if (JSON.stringify(form) !== JSON.stringify(initForm())) {
    modalChange.open()
  } else {
    closeFullscreen(false)
  }
}
function closeFullscreen (added: boolean) {
  shown.value = false
  Object.assign(form, initForm())
  v$.value.$reset()
  emits('close', added)
}

const modalChange = useModal({
  component: ModalInfo,
  attrs: {
    title: titleInfo.value,
    info: true,
    type: 'change',
    onCloseInfo () {
      modalChange.close()
    },
    onCloseAll () {
      modalChange.close()
      shown.value = false
      emits('close')
    }
  }
})
</script>
<template>
  <ModalFullscreen v-model="shown" title="Tambah Tiket" :width="5" @close-fullscreen="changeAlert()" @keypress.enter="submitForm">
    <div class="px-8 overflow-auto overflow-x-hidden space-y-4 p-2">
      <div class="flex justify-end gap-2">
        <Toggle v-model="forMe"/>
        <h1>
          Buat untuk saya
        </h1>
      </div>
      <div>
        <label for="transaction_date">Tanggal tiket masuk<span class="text-error">*</span></label>
        <DatePicker
          v-model="date"
          :preset-range="false"
          format="HH:mm - dd/MM/yyyy"
          time
          :max-date="new Date()"
        />
        <ReErrorText v-if="v$.transaction_date.$error" :text="v$.transaction_date.$error ? v$.transaction_date.$errors[0].$message : ''" />
      </div>
      <DropDown
        v-if="selectTicketType.length"
        label="Jenis Tiket"
        placeholder="Pilih Jenis Tiket"
        :value="selectTicketType"
        :data="ticketTypes"
        :error="v$.ticket_type.$error ? v$.ticket_type.$errors[0].$message : ''"
        @change="v$.ticket_type.$touch"
        @input="form.ticket_type = $event.value"
      />
      <DropDown
        v-else
        label="Jenis Tiket"
        placeholder="Pilih Jenis Tiket"
        :data="ticketTypes"
        :error="v$.ticket_type.$error ? v$.ticket_type.$errors[0].$message : ''"
        @change="v$.ticket_type.$touch"
        @input="form.ticket_type = $event.value"
      />
      <DropdownPagination
        v-model="form.report_source_id"
        api-module="ticket"
        api-method="getReportSources"
        option-label="name"
        option-value="id"
        label="Sumber Laporan"
        placeholder="Pilih sumber laporan"
        :error="v$.report_source_id.$error ? v$.report_source_id.$errors[0].$message : ''"
        @change="v$.report_source_id.$touch"
      />
      <div class="space-y-2">
        <ReInputText
          v-show="!form.is_anonymous"
          v-model="form.name"
          label="Nama Pemohon"
          type="text"
          placeholder="Masukkan nama pemohon"
          :disabled="forMe"
          :error="v$.name.$error ? v$.name.$errors[0].$message : ''"
          @change="v$.name.$touch"
          @input="$event.target.value.toLowerCase() === 'anonim' ? form.is_anonymous = true : form.is_anonymous = false"
        />
        <div class="flex flex-row px-2.5 gap-1 text-xs">
          <CheckBox
            v-model="form.is_anonymous"
            :checked="form.is_anonymous"
            id="anonym"
            label="Anonim"
          />
          <h1 class="text-error">
            (Nama Anda tidak akan terpublikasi pada laporan)
          </h1>
        </div>
      </div>
      <DropdownPagination
        v-show="form.ticket_type === 'internal'"
        v-model="form.units_of_work_id"
        api-module="global"
        api-method="getUnitOfWork"
        option-label="name"
        option-value="id"
        uniq-by="id"
        label="Unit Kerja"
        placeholder="Pilih unit kerja"
        :disabled="forMe"
      />
      <ReInputText
        v-show="form.ticket_type === 'internal'"
        v-model="form.position_text"
        label="Jabatan"
        type="text"
        placeholder="Masukkan jabatan pemohon"
      />
      <ReInputText
        v-model="form.email"
        label="Email"
        type="email"
        placeholder="Masukkan email pemohon"
        :disabled="forMe"
        :error="v$.email.$error ? v$.email.$errors[0].$message : ''"
        @change="v$.email.$touch"
      />
      <ReInputText
        label="Nomor Telepon"
        v-model="form.phone"
        :icon="forMe ? '' : 'left'"
        inputmode="tel"
        type="number"
        placeholder="8XX"
        :disabled="forMe && $localUser()?.phone"
        :error="v$.phone.$error ? v$.phone.$errors[0].$message : ''"
        @change="v$.phone.$touch"
      >
        <template v-if="!forMe" #icon>
          <h1 class="text-neutral-400 font-medium">
            +62
          </h1>
        </template>
      </ReInputText>
      <div class="space-y-2">
        <label>
          Layanan <span class="text-error">*</span>
        </label>
        <CheckBox
          v-model="serviceFilter.isShow"
          :checked="serviceFilter.isShow"
          id="serviceFilter"
          label="Tampilkan Detail"
        />
        <DropdownPagination
          v-show="serviceFilter.isShow"
          v-model="serviceFilter.units_of_work_id"
          api-module="global"
          api-method="getUnitOfWork"
          :api-params="{ is_flow_exist: true }"
          option-label="name"
          option-value="id"
          uniq-by="id"
          placeholder="Pilih unit"
          :required="false"
          clearable
        />
        <DropdownPagination
          v-show="serviceFilter.isShow"
          v-model="serviceFilter.service_category_id"
          api-module="ticket"
          api-method="getCategories"
          :api-params="categoryParams"
          watch-params
          option-label="name"
          option-value="id"
          uniq-by="id"
          placeholder="Pilih kategori"
          :required="false"
          clearable
        />
        <DropdownPagination
          v-model="categoryService"
          api-module="ticket"
          api-method="getServices"
          :api-params="serviceParams"
          watch-params
          option-label="name"
          :option-value="['id', 'service_category', 'id']"
          option-custom
          :required="false"
          placeholder="Pilih layanan"
          :error="v$.service_id.$error ? v$.service_id.$errors[0].$message : ''"
          @change="v$.service_id?.$touch"
        />
      </div>
      <DropdownPagination
        v-model="form.impact_level_id"
        api-module="ticket"
        api-method="getImpacts"
        option-label="name"
        option-value="id"
        label="Tingkat dampak"
        placeholder="Pilih tingkat dampak"
        :error="v$.impact_level_id.$error ? v$.impact_level_id.$errors[0].$message : ''"
        @change="v$.impact_level_id?.$touch"
      />
      <ReInputText
        v-model="form.title"
        label="Subjek Tiket"
        placeholder="Tuliskan judul tiket yang singkat, padat dan mudah dipahami konteksnya"
        :error="v$.title.$error ? v$.title.$errors[0].$message : ''"
        @change="v$.title?.$touch"
      />
      <div class="space-y-2">
        <h1>
          Deskripsi<span class="text-error">*</span>
        </h1>
        <ReTextEditor
          v-model="form.content"
          :inline-image="false"
          :error="v$.content.$error ? v$.content.$errors[0].$message : ''"
          @change="v$.content?.$touch"
          @upload="uploadFile($event)"
          @cancel-upload="files.splice($event, 1)"
        />
      </div>
    </div>
    <template #footer>
      <div class="flex flex-row gap-3">
        <CButton
          class="w-full"
          text="Simpan"
          :loading="loading"
          @click="submitForm()"
        />
      </div>
    </template>
  </ModalFullscreen>
</template>
