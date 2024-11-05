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
const { $api, $toast } = useNuxtApp()
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
const titleInfo = ref(null)
const formData = reactive({
  name: '',
  category: ''
})
const loading = ref(false)
const rules = computed(() => {
  return {
    category: {
      required: helpers.withMessage('Kategori wajib diisi!', required)
    },
    name: {
      required: helpers.withMessage('Nama Layanan wajib diisi!', required)
    }
  }
})

const v$ = useVuelidate(rules, formData)

watch(() => props.show, (val, oldVal) => {
  shown.value = val
  if (!oldVal && props.type === 'update') {
    getData()
  } else {
    formData.name = ''
    formData.category = ''
  }
})
const submitForm = async () => {
  v$.value.$validate()
  if (!v$.value.$error) {
    const param = {
      name: formData.name,
      it_asset_category_id: formData.category
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
  const { data, error, pending } = await $api.appAsset.post(param)
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
  const { data, error, pending } = await $api.appAsset.patch(id, param)
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
function closeFullscreen (val) {
  v$.value.$reset()
  shown.value = false
  emits('close', val)
}
function changeAlert () {
  titleInfo.value = 'Keluar tanpa menyimpan?'
  if (formData.name || formData.category) {
    modalChange.open()
  } else {
    closeFullscreen()
  }
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
const getData = async () => {
  try {
    const { data } = await $api.appAsset.get(props.data.id)
    formData.name = data.value.data.name
    formData.category = data.value.data.it_asset_category.id
  } catch (e) {
    $toast.error(e)
  }
}
</script>
<template>
  <ModalFullscreen v-model="shown" title="Tambah IT ASSETS" :width="4" @close-fullscreen="changeAlert()" @keypress.enter="submitForm">
    <div class="px-8 space-y-4">
      <ReInputText
        v-model="formData.name"
        label="Nama"
        type="text"
        placeholder="Masukkan Nama"
        :error="v$.name.$error ? v$.name.$errors[0].$message : ''"
        @change="v$.name.$touch"
      />
      <DropdownPagination
        v-model="formData.category"
        api-module="appAsset"
        api-method="category"
        option-label="name"
        option-value="id"
        label="Kategori"
        placeholder="Pilih kategori IT Assets"
        :error="v$.category.$error ? v$.category.$errors[0].$message : ''"
        @change="v$.category.$touch"
      />
    </div>
    <template #footer>
      <div class="absolute bottom-8 w-[85%]">
        <CButton class="w-full" text="Simpan" :loading="loading" @click="submitForm()" />
      </div>
    </template>
  </ModalFullscreen>
</template>
