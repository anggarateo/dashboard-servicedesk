<script setup>
import ModalInfo from '@/components/ModalInfo.vue'
import { useModal } from 'vue-final-modal'
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import Toggle from '@vueform/toggle'

defineComponent({
  components: {
    Toggle
  }
})

const titleInfo = ref()
const modalChange = useModal({
  component: ModalInfo,
  attrs: {
    title: titleInfo,
    info: true,
    type: 'change',
    onCloseInfo () {
      modalChange.close()
    },
    onCloseAll () {
      modalChange.close()
      closeFullscreen()
    }
  }
})

const emits = defineEmits(['close', 'submit'])

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  detail: {
    type: Object,
    default: null
  }
})

const shown = toRef(props, 'show')
const formChange = ref(false)
const initForm = () => ({
  service_category_id: null,
  is_show_homepage: false,
  langs: {
    id: {
      title: null,
      content: null
    },
    en: {
      title: null,
      content: null
    }
  }
})

const form = reactive(initForm())
const disButton = ref(false)
const language = ref(false)
const listService = ref([])
const selectedService = ref()
const filesId = ref()
const filesEn = ref()
const searchCategory = ref('')

watch(() => form, (val) => {
  if (
    (!props.detail &&
      (val.service_category_id || val.is_show_homepage ||
      val.langs.en.content || val.langs.en.title ||
      val.langs.id.content || val.langs.id.title)
    ) ||
    (props.detail &&
      (val.service_category_id !== props.detail?.service_category?.id ||
      val.is_show_homepage !== props.detail?.is_show_homepage ||
      val.langs.en.content !== props.detail?.langs?.en?.content ||
      val.langs.en.title !== props.detail?.langs?.en?.title ||
      val.langs.id.content !== props.detail?.langs?.id?.content ||
      val.langs.id.title !== props.detail?.langs?.id?.title)
    )
  ) {
    formChange.value = true
  } else {
    formChange.value = false
  }
},
{
  deep: true
})
watch (() => language.value, (val) => {
  if (!val) {
    form.langs.en.content = null
    form.langs.en.title = null
  }
})
watch(() => shown.value, (val) => {
  if (val && !props.detail) getCategories()
})
watch(() => props.detail, (val) => {
  if (val) {
    getDetail()
    getCategories()
  }
})
watch(() => searchCategory.value, () => {
  getCategories()
})

const changeAlert = (title) => {
  titleInfo.value = title
  if (formChange.value) {
    modalChange.open()
  } else {
    closeFullscreen()
  }
}

const closeFullscreen = () => {
  selectedService.value = null
  Object.assign(form, initForm())
  v$.value.$reset()
  emits('close')
}

const { $api, $toast } = useNuxtApp()

const getCategories = async () => {
  disButton.value = true
  const {
    data,
    pending,
    error
  } = await $api.category.getList({ q: searchCategory.value, per_page: 1000 })
  if (data.value) {
    listService.value = data.value.data
  }
  if (pending.value) disButton.value = pending.value
  if (error.value) $toast.error(error.value.data.message)
  disButton.value = false
}
const getDetail = async () => {
  disButton.value = true
  const {
    data,
    pending,
    error
  } = await $api.knowledgebase.detailKnowledgebase(props.detail.id)
  if (data.value) {
    Object.assign(form, { id: data.value.data.id })
    form.service_category_id = data.value.data.service_category.id
    form.is_show_homepage = data.value.data.is_show_homepage
    form.langs = data.value.data.langs
    if (data.value.data.langs.en.title || data.value.data.langs.en.content) {
      language.value = true
    } else {
      language.value = false
    }
  }
  if (pending.value) disButton.value = pending.value
  if (error.value) $toast.error(error.value.data.message)
  disButton.value = false
}

const rules = computed(() => {
  const idn = {
    service_category_id: {
      required: helpers.withMessage('Kategori harus dipilih!', required)
    },
    langs: {
      id: {
        title: {
          required: helpers.withMessage('Judul harus diisi!', required)
        },
        content: {
          required: helpers.withMessage('Deskripsi harus diisi', required)
        }
      }
    }
  }

  const eng = {
    service_category_id: {
      required: helpers.withMessage('Kategori harus dipilih!', required)
    },
    langs: {
      id: {
        title: {
          required: helpers.withMessage('Judul harus diisi!', required)
        },
        content: {
          required: helpers.withMessage('Deskripsi harus diisi', required)
        }
      },
      en: {
        title: {
          required: helpers.withMessage('Judul (bahasa inggris) harus diisi!', required)
        },
        content: {
          required: helpers.withMessage('Deskripsi (bahasa inggris) harus diisi', required)
        }
      }
    }
  }

  return language.value ? eng : idn
})

const v$ = useVuelidate(rules, form)

const submit = async () => {
  v$.value.$validate()
  if (!v$.value.$error) {
    disButton.value = true
    if (!language.value) delete form.langs.en
    let endpoint
    props.detail ? endpoint = $api.knowledgebase.updateKnowledgebase(form.id, form) : endpoint = $api.knowledgebase.addKnowledgebase(form)
    const {
      data,
      pending,
      error
    } = await endpoint

    if (data.value) {
      props.detail ? $toast.success('Berhasil mengubah FAQ') : $toast.success('Berhasil menambah FAQ')
      emits('submit')
      closeFullscreen()
    }
    if (pending.value) disButton.value = pending.value
    if (error.value) $toast.error(error.value.data.message)

    disButton.value = false
  } else $toast.warn('pastikan form sudah terisi!')
}

const uploadFile = async (e, lang) => {
  const file = e.target.files[0]
  const formData = new FormData()
  if (!file || !lang) return
  formData.append('image', file)
  const {
    data,
    error
  } = await $api.knowledgebase.uploadKnowledgebase(formData)

  if (data.value) {
    if (data.value.error) {
      $toast.error(data.value.message)
    } else {
      $toast.success(data.value.message)
      lang === 'id' ? filesId.value = data.value.data : lang === 'en' ? filesEn.value = data.value.data : $toast.error('language parameter must be \'id\' or \'en\'')
    }
  }
  if (error.value) $toast.error(error.value.data.message)
}
</script>
<template>
  <ModalFullscreen v-model="shown" :title="detail ? 'Ubah FAQ' : 'Tambah FAQ'" :width="7" @close-fullscreen="changeAlert('Keluar tanpa menyimpan?')" @keypress.enter="submit">
    <div class="px-14 space-y-4 overflow-auto pb-40">
      <div class="flex flex-row gap-4 justify-end">
        <Toggle v-model="language"/>
        <h1>
          Bahasa Inggris
        </h1>
      </div>
      <div class="relative">
        <svg class="absolute -top-0.5 -left-0.5 z-50" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path opacity="0.4" d="M3.12754 11.4749L6.52504 14.8724C7.92004 16.2674 10.185 16.2674 11.5875 14.8724L14.88 11.5799C16.275 10.1849 16.275 7.91985 14.88 6.51735L11.475 3.12735C10.7625 2.41485 9.78004 2.03235 8.77504 2.08485L5.02504 2.26485C3.52504 2.33235 2.33254 3.52485 2.25754 5.01735L2.07754 8.76735C2.03254 9.77985 2.41504 10.7624 3.12754 11.4749Z" fill="#2953A1"/>
          <path d="M7.12497 9.28484C8.3179 9.28484 9.28497 8.31778 9.28497 7.12484C9.28497 5.93191 8.3179 4.96484 7.12497 4.96484C5.93203 4.96484 4.96497 5.93191 4.96497 7.12484C4.96497 8.31778 5.93203 9.28484 7.12497 9.28484Z" fill="#2953A1"/>
        </svg>
        <div v-if="detail ? listService.length : true">
          <v-select
            id="default"
            v-model="form.service_category_id"
            :options="listService"
            :get-option-label="option => option.langs.id.name"
            :reduce="option => option.id"
            placeholder="Tambahkan kategori"
            class="style-chooser"
            :class="{
              'border border-red-500 ring ring-offset-2 ring-offset-white ring-red-500 rounded-xl': v$.service_category_id.$error
            }"
            @search="query => searchCategory = query"
          />
          <ReErrorText v-if="v$.service_category_id.$error" :text="v$.service_category_id.$errors[0].$message" />
        </div>
      </div>
      <ReInputText
        v-model="form.langs.id.title"
        :require="false"
        placeholder="Masukkan judul disini..."
        :error="v$.langs.id.title.$error ? v$.langs.id.title.$errors[0].$message : null"
        @change="v$.langs.id.title?.$touch"
      />
      <ReInputText
        v-if="language"
        v-model="form.langs.en.title"
        :require="false"
        label="(bahasa inggris)"
        placeholder="Masukkan judul disini..."
        :error="v$.langs.en.title.$error ? v$.langs.en.title.$errors[0].$message : null"
        @change="v$.langs.en.title?.$touch"
      />
      <ReTextEditor
        v-model="form.langs.id.content"
        :image="filesId"
        :error="v$.langs.id.content.$error ? v$.langs.id.content.$errors[0].$message : null"
        accepted-file="image/*"
        @change="v$.langs.id.content?.$touch"
        @upload="uploadFile($event, 'id')"
      />
      <div v-if="language" class="space-y-1">
        <h1>
          (bahasa inggris)
        </h1>
        <ReTextEditor
          v-model="form.langs.en.content"
          :image="filesEn"
          :error="v$.langs.en.content.$error ? v$.langs.en.content.$errors[0].$message : null"
          accepted-file="image/*"
          @change="v$.langs.en.content?.$touch"
          @upload="uploadFile($event, 'en')"
        />
      </div>
      <div class="flex flex-row gap-4">
        <Toggle v-model="form.is_show_homepage"/>
        <h1>
          Tampilkan di halaman depan
        </h1>
      </div>
    </div>
    <template #footer>
      <div class="flex flex-row gap-3 w-full">
        <CButton v-if="detail" class="w-full" text="Batal" type="outlined" @click="changeAlert('Batalkan perubahan?')" />
        <CButton class="w-full" text="Simpan" :loading="disButton" @click="submit" />
      </div>
    </template>
  </ModalFullscreen>
</template>
