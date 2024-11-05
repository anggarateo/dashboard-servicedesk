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
const lang = ref(false)
const loading = ref(false)
const formData = reactive({
  // code: props.data ? props.data.code : '',
  nameID: '',
  descID: '',
  nameENG: '',
  descENG: ''
})
const rules = computed(() => {
  const isENG = {
    // code: {
    //   required: helpers.withMessage('code wajib diisi!', required)
    // },
    nameID: {
      required: helpers.withMessage('Nama Kategori wajib diisi!', required)
    },
    descID: {
      required: helpers.withMessage('Deskripsi Kategori wajib diisi!', required)
    },
    nameENG: {
      required: helpers.withMessage('Nama Kategori wajib diisi!', required)
    },
    descENG: {
      required: helpers.withMessage('Deskripsi Kategori wajib diisi!', required)
    }
  }
  const isID = {
    // code: {
    //   required: helpers.withMessage('code wajib diisi!', required)
    // },
    nameID: {
      required: helpers.withMessage('Nama Kategori wajib diisi!', required)
    },
    descID: {
      required: helpers.withMessage('Deskripsi Kategori wajib diisi!', required)
    }
  }
  return lang.value ? isENG : isID
})

const v$ = useVuelidate(rules, formData)
const submitForm = async () => {
  v$.value.$validate()
  if (!v$.value.$error) {
    const param = {
      // code: new Date().getTime(),
      langs: {
        id: {
          name: formData.nameID,
          description: formData.descID
        },
        en: {
          name: formData.nameENG,
          description: formData.descENG
        }
      }
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
  const { data, error, pending } = await $api.category.post(param)
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
  const { data, error, pending } = await $api.category.patch(id, param)
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
    formData.nameID = ''
    formData.descID = ''
    formData.nameENG = ''
    formData.descENG = ''
    lang.value = false
  }
})

const getData = async () => {
  const { data } = await $api.category.get(props.data.id)
  formData.nameID = data.value.data.langs.id.name
  formData.descID = data.value.data.langs.id.description
  formData.nameENG = data.value.data.langs.en.name
  formData.descENG = data.value.data.langs.en.description
  if (data.value.data.langs.en.name || data.value.data.langs.en.description) {
    lang.value = true
  } else {
    lang.value = false
  }
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
</script>
<template>
  <ModalFullscreen v-model="shown" :title="`${type === 'create' ? 'Tambah' : type === 'update' ? 'Edit' : ''} Kategori`" @close-fullscreen="changeAlert()" @keypress.enter="submitForm">
    <div class="pl-8 pr-8 overflow-auto">
      <div class=" flex flex-col w-full items-end mb-2">
        <div>
          <Toggle v-model="lang" labelledby="toggle-label" />
          <label id="toggle-label" class="ml-2">Bahasa Inggris</label>
        </div>
      </div>
      <ReInputText
        v-model="formData.nameID"
        class="mb-4"
        label="Nama Kategori"
        type="text"
        placeholder="Masukkan Nama Kategori Anda !"
        :error="`${v$.nameID.$error?v$.nameID.$errors[0].$message:''}`"
        @change="v$.nameID?.$touch"
      />
      <ReInputTextarea
        v-model="formData.descID"
        class="mb-4"
        label="Deskripsi"
        placeholder="Masukan deskripsi disini !"
        :error="`${v$.descID.$error?v$.descID.$errors[0].$message:''}`"
        @change="v$.descID?.$touch"
      />
      <ReInputText
        v-model="formData.nameENG"
        class="mb-4"
        :hidden="!lang"
        label="Nama Kategori (Bahasa Inggris)"
        type="text"
        placeholder="Nama Kategori dalam Bahasa Inggris !"
        :error="`${lang?v$.nameENG.$error?v$.nameENG.$errors[0].$message:'':null}`"
        @change="lang?v$.nameENG?.$touch:null"
      />
      <ReInputTextarea
        v-model="formData.descENG"
        :hidden="!lang"
        label="Deskripsi (Bahasa Inggris)"
        placeholder="Deskripsi dalam Bahasa Inggris !"
        :error="`${lang?v$.descENG.$error?v$.descENG.$errors[0].$message:'':null}`"
        @change="lang?v$.descENG?.$touch:null"
      />
    </div>
    <template #footer>
      <div class="flex flex-row gap-3">
        <CButton class="w-full" text="Simpan" :loading="loading" @click="submitForm()" />
      </div>
    </template>
  </ModalFullscreen>
</template>
