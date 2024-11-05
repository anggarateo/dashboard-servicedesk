<script setup>
import { useModal } from 'vue-final-modal'
// eslint-disable-next-line
import Toggle from '@vueform/toggle'

import ModalInfo from '@/components/ModalInfo.vue'
import ModalFullscreen from '@/components/ModalFullscreen.vue'

definePageMeta({
  components: { Toggle }
})

const { $api, $toast } = useNuxtApp()

const props = defineProps({
  item: {
    type: Object,
    default: null
  },
  formType: {
    type: String,
    default: ''
  }
})

const emits = defineEmits(['close'])
const titleInfo = ref('')
const language = ref(false)
const formData = reactive({
  id: {
    content: '',
    section: '',
    title: ''
  },
  en: {
    content: '',
    section: '',
    title: ''
  }
})

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
      emits('close')
      modalChange.close()
    }
  }
})

function changeAlert (title) {
  titleInfo.value = title
  modalChange.open()
}

const loading = ref(false)

const submitForm = async () => {
  loading.value = true
  const { data, error, pending } = await $api.content.updateContent(props.item.id, {
    langs: { ...formData }
  })

  if (data.value) {
    $toast.success('Success')
    emits('close')
    modalChange.close()
  }

  if (error.value) {
    $toast.success(error.value?.data?.message)
  }

  if (pending.value) {
    loading.value = pending.value
  }

  loading.value = false
}

watch(() => props.item, (value) => {
  formData.id.title = value.langs.id.title || ''
  formData.id.section = value.langs.id.section || ''
  formData.id.content = value.langs.id.content || ''

  formData.en.title = value.langs.en.title || ''
  formData.en.section = value.langs.en.section || ''
  formData.en.content = value.langs.en.content || ''
})

</script>
<template>
  <ModalFullscreen :title="formData.id.section" :width="4" @close-fullscreen="changeAlert('Keluar tanpa menyimpan?')" @keypress.enter="submitForm">
    <div class="p-4">
      <div class="flex flex-row gap-2 justify-end ml-auto mb-4">
        <Toggle v-model="language" />
        <label>
          Bahasa Inggris
        </label>
      </div>

      <div class="flex flex-col gap-2">
        <ReInputText
          v-if="props.formType == 'title' && !language"
          v-model="formData.id.title"
          placeholder="Masukan judul disini"
          label="Judul (id)"
          :require="true"
        />
        <ReInputText
          v-else-if="props.formType == 'title' && language"
          v-model="formData.en.title"
          placeholder="Masukan judul disini"
          label="Judul (en)"
          :require="true"
        />
        <div v-show="props.formType == 'content'">
          <ReInputTextarea
            v-if="props.formType == 'content' && !language"
            v-model="formData.id.content"
            placeholder="Masukan judul disini"
            label="Content (id)"
            :require="true"
          />
          <ReInputTextarea
            v-else-if="props.formType == 'content' && language"
            v-model="formData.en.content"
            placeholder="Masukan judul disini"
            label="Content (en)"
            :require="true"
          />
        </div>
      </div>
    </div>
    <template #footer>
      <CButton text="Simpan" icon="" class="w-full" :loading="loading" @click="submitForm" />
    </template>
  </ModalFullscreen>
</template>

<style scoped>
</style>
