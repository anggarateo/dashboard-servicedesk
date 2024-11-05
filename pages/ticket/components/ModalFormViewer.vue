<script setup>
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import { useModal } from 'vue-final-modal'
import ApiSelectViewer from './ApiSelectViewer.vue'
import ModalInfo from '@/components/ModalInfo.vue'

const { $toast, $api } = useNuxtApp()
const emits = defineEmits(['close', 'submitted'])
const route = useRoute()
const state = reactive({
  form: {
    users: []
  }
})

const rules = computed(() => {
  return {
    form: {
      users: {
        required: helpers.withMessage('Required', required)
      }
    }
  }
})

const v$ = useVuelidate(rules, state)

const alertTitle = ref('')

const changeAlert = (title) => {
  alertTitle.value = title
  alert.open()
}

const alert = useModal({
  component: ModalInfo,
  attrs: {
    title: alertTitle.value,
    info: true,
    type: 'change',
    onCloseInfo () {
      alert.close()
    },
    onCloseAll () {
      alert.close()
      v$.value.$reset()
      state.form.users = []
      emits('close')
    }
  }
})

const submitData = async () => {
  v$.value.$validate()

  if (!v$.value.$error) {
    const formattedUserData = state.form.users.map(val => ({
      id: val.id,
      is_deleted: false
    }))

    const { data, error } = await $api.ticket.addViewerTicket(route.params.id, { users: formattedUserData })

    if (data.value) {
      $toast.success('Sukses', { position: 'bottom-right' })
      emits('submitted', true)
      emits('close')
      state.form.users = []
    }

    if (error.value) {
      $toast.error('Gagal.', { position: 'bottom-right' })
    }
  } else {
    $toast.warning('Lengkapi form dulu', { position: 'bottom-right' })
  }
}

</script>

<template>
  <ModalFullscreen title="Tambah Viewer" :width="4" @close-fullscreen="changeAlert('Keluar tanpa menyimpan?')" @keypress.enter="submitData">
    <div class="p-4">
      <div class="mb-4">
        <label for="layanan">Viewer <span class="text-error">*</span></label>
        <ApiSelectViewer
          v-model="state.form.users"
          placeholder="Pilih viewer"
        />
        <ReErrorText :text="v$.form.users.$error ? v$.form.users.$errors[0].$message : ''" />
      </div>
      <div>
        <CButton text="Simpan" class="w-full" @click="submitData" />
      </div>
    </div>
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
