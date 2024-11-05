<script setup>
import { useModal } from 'vue-final-modal'
// eslint-disable-next-line
import Toggle from '@vueform/toggle'
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import ModalInfo from '@/components/ModalInfo.vue'

definePageMeta({
  components: { Toggle }
})
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
const { $api, $toast } = useNuxtApp()

const emits = defineEmits(['close'])
const shown = ref(false)
const titleInfo = ref()
const initForm = () => ({
  name: '',
  low: '',
  medium: '',
  high: '',
  same: false,
  unit: ''
})
const formData = reactive(initForm())
const units = ref([
  { label: 'Hari', value: 'day' },
  { label: 'Jam', value: 'hour' },
  { label: 'Menit', value: 'minute' }
])
const rules = computed(() => {
  return {
    name: {
      required: helpers.withMessage('Nama SLA wajib diisi!', required)
    },
    low: {
      required: helpers.withMessage('SLA rendah wajib diisi!', required)
    },
    medium: {
      required: helpers.withMessage('SLA sedang wajib diisi!', required)
    },
    high: {
      required: helpers.withMessage('SLA tinggi wajib diisi!', required)
    },
    unit: {
      required: helpers.withMessage('Satuan SLA wajib dipilih!', required)
    }
  }
})

const v$ = useVuelidate(rules, formData)
const submitForm = async () => {
  v$.value.$validate()
  if (!v$.value.$error) {
    const param = {
      name: formData.name,
      sla_low: formData.low,
      sla_medium: formData.medium,
      sla_height: formData.high,
      sla_unit: typeof formData.unit === 'string' ? formData.unit : formData.unit[0].value
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

const loading = ref(false)

const postData = async (param) => {
  loading.value = true
  const { data, error, pending } = await $api.sla.post(param)
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
  const { data, error, pending } = await $api.sla.patch(id, param)
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

watch(() => props.show, (val, oldVal) => {
  shown.value = val
  if (!oldVal && props.type === 'update') {
    getData()
  } else {
    Object.assign(formData, initForm())
  }
})
watch(() => formData, (val) => {
  if (val.same) {
    formData.high = val.low
    formData.medium = val.low
  }
}, { deep: true })

const getData = async () => {
  try {
    const { data } = await $api.sla.get(props.data.id)
    if (data.value) {
      formData.name = data.value.data.name
      formData.low = data.value.data.sla_low
      formData.medium = data.value.data.sla_medium
      formData.high = data.value.data.sla_height
      formData.unit = units.value.filter(el => el.value === data.value.data.sla_unit)
    }
  } catch (e) {
    $toast.error(e)
  }
}
function changeAlert (title) {
  titleInfo.value = title
  if (JSON.stringify(formData) !== JSON.stringify(initForm())) {
    modalChange.open()
  } else {
    closeFullscreen()
  }
}
function closeFullscreen (e = null) {
  shown.value = false
  emits('close', e)
}
</script>
<template>
  <ModalFullscreen v-model="shown" :title="type === 'update' ? 'Edit SLA' : 'Tambah SLA'" :width="4" @close-fullscreen="changeAlert('Keluar tanpa menyimpan?')" @keypress.enter="submitForm">
    <div class="pl-8 pr-8 space-y-2 overflow-auto pb-10">
      <ReInputText
        v-model="formData.name"
        label="Nama"
        type="text"
        placeholder="Masukkan Nama"
        :error="v$.name.$error ? v$.name.$errors[0].$message : ''"
        @change="v$.name.$touch"
      />
      <DropDown
        v-if="type === 'update' && formData.unit"
        label="Satuan"
        :value="formData.unit"
        :data="units"
        :error="v$.unit.$error ? v$.unit.$errors[0].$message : ''"
        @change="v$.unit.$touch"
        @input="formData.unit = $event.value"
      />
      <DropDown
        v-else
        label="Satuan"
        :data="units"
        :error="v$.unit.$error ? v$.unit.$errors[0].$message : ''"
        @change="v$.unit.$touch"
        @input="formData.unit = $event.value"
      />
      <div class="flex">
        <label>SLA</label>
        <div class=" text-error">
          *
        </div>
        <div class="w-full h-full items-center" style="justify-content: flex-end; gap: 8px; display: inline-flex">
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
      <div v-if="(type !== 'update' && formData.unit) || (type === 'update' && formData.unit.length)" class="text-sm text-primary">
        <Icon name="material-symbols:info" color="#2953A1" size="18" />
        Inputan dalam satuan {{ typeof formData.unit === 'string' ? localeString(formData.unit) : localeString(formData.unit[0].value) }}
      </div>
      <div class="flex">
        <ReInputText
          v-model="formData.low"
          style="background: rgba(0, 147, 118, 0.15);"
          type="text"
          placeholder="Rendah"
          :require="false"
        />
        <ReInputText
          v-model="formData.medium"
          style="background: rgba(41, 83, 161, 0.12);"
          class="ml-2"
          type="text"
          placeholder="Sedang"
          :require="false"
          :disabled="formData.same"
        />
        <ReInputText
          v-model="formData.high"
          style="background: rgba(176, 16, 48, 0.12);"
          class="ml-2"
          type="text"
          placeholder="Tinggi"
          :require="false"
          :disabled="formData.same"
        />
      </div>
      <div class="text-sm">
        <CheckBox
          id="same"
          v-model="formData.same"
          label="Samakan Nilai"
        />
      </div>
    </div>
    <template #footer>
      <CButton class="w-full" text="Simpan" :loading="loading" @click="submitForm()" />
    </template>
  </ModalFullscreen>
</template>
