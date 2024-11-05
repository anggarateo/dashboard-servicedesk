<script setup>
import { useModal } from 'vue-final-modal'
// eslint-disable-next-line
import Toggle from '@vueform/toggle'
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import ModalInfo from '@/components/ModalInfo.vue'
import jsonToFormData from '@/utils/jsonToFormData'
import ApiSelectJenisLaporan from '@/pages/laporan/components/ApiSelectJenisLaporan.vue'

definePageMeta({
  components: { Toggle }
})
const { $api, $toast, $checkPermission, $localUser } = useNuxtApp()
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
const lang = ref(true)
const showHome = ref(true)
const categoryData = ref(Array())
const unitData = ref(Array())
const loading = ref(false)
const formData = reactive({
  img: null,
  category: '',
  nameID: '',
  descID: '',
  nameENG: '',
  descENG: '',
  unit: '',
  sla_response_low: '',
  sla_response_medium: '',
  sla_response_high: '',
  sla_response_unit: '',
  sla_same: false,
  spm_low: '',
  spm_medium: '',
  spm_high: '',
  spm_unit: '',
  spm_same: false,
  path_report: ''
})
const units = ref([
  { label: 'Hari', value: 'day' },
  { label: 'Jam', value: 'hour' },
  { label: 'Menit', value: 'minute' }
])
watch(() => formData, (val) => {
  if (val.sla_same) {
    formData.sla_response_high = val.sla_response_low
    formData.sla_response_medium = val.sla_response_low
  }

  if (val.spm_same) {
    formData.spm_high = val.spm_low
    formData.spm_medium = val.spm_low
  }
}, { deep: true })
watch(() => props.show, async (val, oldVal) => {
  shown.value = val
  if (val) { await getCategory(); await getUnit() }
  if (!oldVal && props.type === 'update') {
    getData()
  } else {
    formData.img = null
    formData.nameID = ''
    formData.descID = ''
    formData.nameENG = ''
    formData.descENG = ''
    lang.value = false
    showHome.value = false
    formData.sla_response_low = ''
    formData.sla_response_medium = ''
    formData.sla_response_high = ''
    formData.sla_response_unit = ''
    formData.spm_low = ''
    formData.spm_medium = ''
    formData.spm_high = ''
    formData.spm_unit = ''
    formData.path_report = ''
  }
})
const getData = async () => {
  formData.nameID = props.data.langs.id.name
  formData.descID = props.data.langs.id.description
  formData.nameENG = props.data.langs.en.name
  formData.descENG = props.data.langs.en.description
  showHome.value = props.data.is_show_homepage
  formData.category = props.data.service_category.id
  formData.unit = props.data.unit_of_work.id
  formData.sla_response_low = props.data.sla_response_low
  formData.sla_response_medium = props.data.sla_response_medium
  formData.sla_response_high = props.data.sla_response_high
  formData.sla_response_unit = units.value.filter(el => el.value === props.data.sla_response_unit)
  if (props.data.langs.en.name || props.data.langs.en.description) {
    lang.value = true
  } else {
    lang.value = false
  }
  formData.path_report = props.data.path_report
}

const rules = computed(() => {
  const isENG = {
    category: {
      required: helpers.withMessage('Kategori wajib diisi!', required)
    },
    nameID: {
      required: helpers.withMessage('Nama Layanan wajib diisi!', required)
    },
    descID: {
      required: helpers.withMessage('Deskripsi Layanan wajib diisi!', required)
    },
    nameENG: {
      required: helpers.withMessage('Nama Layanan wajib diisi!', required)
    },
    descENG: {
      required: helpers.withMessage('Deskripsi Layanan wajib diisi!', required)
    },
    unit: {
      required: helpers.withMessage('Unit Kerja wajib diisi!', required)
    }
  }
  const isID = {
    category: {
      required: helpers.withMessage('Kategori wajib diisi!', required)
    },
    nameID: {
      required: helpers.withMessage('Nama Layanan wajib diisi!', required)
    },
    descID: {
      required: helpers.withMessage('Deskripsi Layanan wajib diisi!', required)
    },
    unit: {
      required: helpers.withMessage('Unit Kerja wajib diisi!', required)
    }
  }
  return lang.value ? isENG : isID
})

const v$ = useVuelidate(rules, formData)

const searchCategory = ref('')
const searchUnit = ref('')

const submitForm = async () => {
  v$.value.$validate()
  if (!v$.value.$error) {
    const isparam = {
      service_category_id: formData.category,
      units_of_work_id: formData.unit,
      is_show_homepage: showHome.value,
      langs: {
        id: {
          name: formData.nameID,
          description: formData.descID
        },
        en: {
          name: formData.nameENG,
          description: formData.descENG
        }
      },
      sla_response_low: formData.sla_response_low,
      sla_response_medium: formData.sla_response_medium,
      sla_response_high: formData.sla_response_high,
      sla_response_unit: typeof formData.sla_response_unit === 'string' ? formData.sla_response_unit : formData.sla_response_unit[0].value,
      path_report: formData.path_report
    }
    let param
    if (formData.img) {
      const img = { image: formData.img }
      param = jsonToFormData({ ...isparam, ...img })
    }
    else {
      param = jsonToFormData(isparam)
    }
    if (props.type === 'create') {
      await postData(param)
    } else {
      await patchData(props.data.id, param)
    }
  } else {
    $toast.warn('pastikan form sudah terisi!')
  }
}

const postData = async (param) => {
  loading.value = true
  const { data, error, pending } = await $api.service.post(param)
  if (data.value) {
    $toast.success('Data berhasil ditambahkan!')
    closeFullscreen('proses')
  }
  if (error.value) {
    const val = error.value
    $toast.error(val.data.message)
  }
  if (pending.value) {
    loading.value = pending.value
  }
  loading.value = false
}

const patchData = async (id, param) => {
  loading.value = true
  const { data, error, pending } = await $api.service.patch(id, param)
  if (data.value) {
    $toast.success('Data berhasil diedit!')
    closeFullscreen('proses')
  }
  if (error.value) {
    const val = error.value
    $toast.error(val.data.message)
  }
  if (pending.value) {
    loading.value = pending.value
  }
  loading.value = false
}

function changeAlert () {
  titleInfo.value = 'Keluar tanpa menyimpan?'
  if (formData.nameID !== '' || formData.descID !== '') {
    modalChange.open()
  } else {
    closeFullscreen()
  }
}
function closeFullscreen (val) {
  shown.value = false
  emits('close', val)
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
const getCategory = async () => {
  loading.value = true
  try {
    const { data, pending } = await $api.category.getList({ q: searchCategory.value, per_page: 1000 })
    if (data.value) { categoryData.value = data.value.data }
    if (pending.value) { loading.value = pending.value}
  } catch (e) {
    $toast.error(e)
  }
  loading.value = false
}

const getUnit = async () => {
  loading.value = true

  const byUnit = $checkPermission('list_layanan', 'view') ? { units_of_work_id: $localUser().units_of_work_id } : {}
  
  try {
    const { data, pending } = await $api.global.getUnitOfWork({
      q: searchUnit.value,
      per_page: 1000,
      ...byUnit
    })
    if (data.value) {
      unitData.value = data.value.data
    }
    if (pending.value) { loading.value = pending.value}
  } catch (e) {
    $toast.error(e)
  }
  loading.value = false
}

watch(() => searchCategory.value, () => {
  getCategory()
})
watch(() => searchUnit.value, () => {
  getUnit()
})
</script>
<template>
  <ModalFullscreen v-model="shown" :title="`${props.data ? 'Edit' : 'Tambah'} Layanan`" :width="4" @close-fullscreen="changeAlert()" @keypress.enter="submitForm">
    <div class="pl-8 pr-8 overflow-auto">
      <div class=" flex flex-col w-full items-end mb-2">
        <div>
          <Toggle v-model="lang" labelledby="toggle-label" />
          <label id="toggle-label" class="ml-2">Bahasa Inggris</label>
        </div>
      </div>
      <ReInputImage
        v-model="formData.img"
        class="mb-4"
        :require="false"
      />
      <div class="mb-4 space-y-2">
        <div class="flex flex-row">
          <label>Kategori <span class="text-error">*</span></label>
        </div>
        <v-select
          id="default"
          v-model="formData.category"
          :options="categoryData"
          :get-option-label="option => option.langs.id.name"
          :reduce="option => option.id"
          placeholder="Pilih kategori layanan"
          class="style-chooser"
          @search="query => searchCategory = query"
        />
      </div>
      <ReInputText
        v-model="formData.nameID"
        class="mb-4"
        label="Nama Layanan"
        type="text"
        placeholder="Masukkan nama layanan"
      />
      <ReInputTextarea
        v-model="formData.descID"
        class="mb-4"
        label="Deskripsi"
        placeholder="Masukkan deskripsi disini"
      />
      <ReInputText
        v-model="formData.nameENG"
        class="mb-4"
        :hidden="!lang"
        label="Nama Layanan (Bahasa Inggris)"
        type="text"
        placeholder="Masukkan nama layanan dalam Bahasa Inggris"
      />
      <ReInputTextarea
        v-model="formData.descENG"
        class="mb-4"
        :hidden="!lang"
        label="Deskripsi (Bahasa Inggris)"
        placeholder="Deskripsi dalam Bahasa Inggris"
      />
      <DropDown
        v-if="type === 'update' && formData.sla_response_unit"
        label="Satuan SLA Respon"
        :value="formData.sla_response_unit"
        :data="units"
        class="mb-4"
        :required="false"
        clearable
        @input="formData.sla_response_unit = $event?.value"
      />
      <DropDown
        v-else
        label="Satuan SLA Respon"
        :data="units"
        class="mb-4"
        :required="false"
        clearable
        @input="formData.sla_response_unit = $event?.value"
      />
      <div class="flex flex-col lg:flex-row lg:justify-between">
        <label>SLA Respon</label>
        <div class="h-full items-center" style="justify-content: flex-end; gap: 8px; display: inline-flex">
          <div style="justify-content: flex-start; align-items: center; gap: 4px; display: flex">
            <div style="width: 8px; height: 8px; background: #009376; border-radius: 90px" />
            <div style="color: #444444; font-size: 12px; font-family: Poppins; font-weight: 400; letter-spacing: 0.36px; word-wrap: break-word">
              Rendah
            </div>
          </div>
          <div style="justify-content: flex-start; align-items: center; gap: 4px; display: flex">
            <div style="width: 8px; height: 8px; background: #2953A1; border-radius: 90px" />
            <div style="color: #444444; font-size: 12px; font-family: Poppins; font-weight: 400; letter-spacing: 0.36px; word-wrap: break-word">
              Sedang
            </div>
          </div>
          <div style="justify-content: flex-start; align-items: center; gap: 4px; display: flex">
            <div style="width: 8px; height: 8px; background: #B01030; border-radius: 90px" />
            <div style="color: #444444; font-size: 12px; font-family: Poppins; font-weight: 400; word-wrap: break-word">
              Tinggi
            </div>
          </div>
        </div>
      </div>
      <div v-if="(type !== 'update' && formData.sla_response_unit) || (type === 'update' && formData.sla_response_unit.length)" class="my-1 text-sm text-primary">
        <Icon name="material-symbols:info" color="#2953A1" size="18" />
        Inputan dalam satuan {{ typeof formData.sla_response_unit === 'string' ? localeString(formData.sla_response_unit) : localeString(formData.sla_response_unit[0].value) }}
      </div>
      <div class="flex">
        <ReInputText
          v-model="formData.sla_response_low"
          style="background: rgba(0, 147, 118, 0.15);"
          type="text"
          placeholder="Rendah"
          :require="false"
        />
        <ReInputText
          v-model="formData.sla_response_medium"
          style="background: rgba(41, 83, 161, 0.12);"
          class="ml-2"
          type="text"
          placeholder="Sedang"
          :require="false"
          :disabled="formData.sla_same"
        />
        <ReInputText
          v-model="formData.sla_response_high"
          style="background: rgba(176, 16, 48, 0.12);"
          class="ml-2"
          type="text"
          placeholder="Tinggi"
          :require="false"
          :disabled="formData.sla_same"
        />
      </div>
      <div class="text-sm mb-4 mt-1">
        <CheckBox
          id="sla_same"
          v-model="formData.sla_same"
          label="Samakan Nilai"
        />
      </div>
      <DropDown
        v-if="type === 'update' && formData.spm_unit"
        label="Satuan SPM"
        :value="formData.spm_unit"
        :data="units"
        class="mb-4"
        :required="false"
        clearable
        @input="formData.spm_unit = $event?.value"
      />
      <DropDown
        v-else
        label="Satuan SPM"
        :data="units"
        class="mb-4"
        :required="false"
        clearable
        @input="formData.spm_unit = $event?.value"
      />
      <div class="flex flex-col lg:flex-row lg:justify-between">
        <label>SPM</label>
        <div class="h-full items-center" style="justify-content: flex-end; gap: 8px; display: inline-flex">
          <div style="justify-content: flex-start; align-items: center; gap: 4px; display: flex">
            <div style="width: 8px; height: 8px; background: #009376; border-radius: 90px" />
            <div style="color: #444444; font-size: 12px; font-family: Poppins; font-weight: 400; letter-spacing: 0.36px; word-wrap: break-word">
              Rendah
            </div>
          </div>
          <div style="justify-content: flex-start; align-items: center; gap: 4px; display: flex">
            <div style="width: 8px; height: 8px; background: #2953A1; border-radius: 90px" />
            <div style="color: #444444; font-size: 12px; font-family: Poppins; font-weight: 400; letter-spacing: 0.36px; word-wrap: break-word">
              Sedang
            </div>
          </div>
          <div style="justify-content: flex-start; align-items: center; gap: 4px; display: flex">
            <div style="width: 8px; height: 8px; background: #B01030; border-radius: 90px" />
            <div style="color: #444444; font-size: 12px; font-family: Poppins; font-weight: 400; word-wrap: break-word">
              Tinggi
            </div>
          </div>
        </div>
      </div>
      <div v-if="(type !== 'update' && formData.spm_unit) || (type === 'update' && formData.spm_unit.length)" class="my-1 text-sm text-primary">
        <Icon name="material-symbols:info" color="#2953A1" size="18" />
        Inputan dalam satuan {{ typeof formData.spm_unit === 'string' ? localeString(formData.spm_unit) : localeString(formData.spm_unit[0].value) }}
      </div>
      <div class="flex">
        <ReInputText
          v-model="formData.spm_low"
          style="background: rgba(0, 147, 118, 0.15);"
          type="text"
          placeholder="Rendah"
          :require="false"
        />
        <ReInputText
          v-model="formData.spm_medium"
          style="background: rgba(41, 83, 161, 0.12);"
          class="ml-2"
          type="text"
          placeholder="Sedang"
          :require="false"
          :disabled="formData.sla_same"
        />
        <ReInputText
          v-model="formData.spm_high"
          style="background: rgba(176, 16, 48, 0.12);"
          class="ml-2"
          type="text"
          placeholder="Tinggi"
          :require="false"
          :disabled="formData.sla_same"
        />
      </div>
      <div class="text-sm mb-4 mt-1">
        <CheckBox
          id="spm_same"
          v-model="formData.spm_same"
          label="Samakan Nilai"
        />
      </div>
      <div class="mb-4 space-y-2">
        <div class="flex flex-row">
          <label>Unit Kerja <span class="text-error">*</span></label>
        </div>
        <v-select
          id="default"
          v-model="formData.unit"
          :options="unitData"
          label="name"
          :reduce="option => option.id"
          placeholder="Pilih unit kerja"
          class="style-chooser"
          @search="query => searchUnit = query"
        />
      </div>
      <div class="mb-4">
        <label for="form_report">Form Laporan</label>
        <ApiSelectJenisLaporan
          v-model="formData.path_report"
          param-type="ds_report"
          class="style-select"
          placeholder="Pilih form laporan"
        />
      </div>
      <div class="mb-4">
        <Toggle v-model="showHome" labelledby="toggle-label" />
        <label id="toggle-label" class="ml-2">Show at homepage</label>
      </div>
    </div>
    <template #footer>
      <div class="flex flex-row gap-3">
        <CButton class="w-full" text="Simpan" :loading="loading" @click="submitForm()" />
      </div>
    </template>
  </ModalFullscreen>
</template>

<style scoped>
.select-custom {
  --vs-search-input-placeholder-color: #B4B4B4;
  --vs-line-height: 36px;
  --vs-dropdown-max-height: 435px;
  --vs-border-radius: 0.5rem;
  --vs-dropdown-option-padding: 12px 20px;
}

.dp__theme_light {
  --dp-input-padding: 10px
}
</style>
