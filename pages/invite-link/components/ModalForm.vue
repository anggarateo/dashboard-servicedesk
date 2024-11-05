<script setup>
import { useModal } from 'vue-final-modal'
// eslint-disable-next-line
import Toggle from '@vueform/toggle'
import { useVuelidate } from '@vuelidate/core'
import { required, email, helpers } from '@vuelidate/validators'
import ModalInfo from '@/components/ModalInfo.vue'

const { $api, $toast } = useNuxtApp()

definePageMeta({
  components: { Toggle }
})
const props = defineProps({
  show: {
    type: Boolean,
    required: true
  }
})
const emits = defineEmits(['close', 'submitted'])
const shown = ref(false)
const shownModalPreviewEmail = ref(false)
const titleInfo = ref()
const roles = ref([])
const contentPreviewEmail = ref('')
const errorMessageRoleId = ref(false)
const errorMessageExpiredate = ref(false)
const loading = ref(false)

const formData = reactive({
  sending_mail: '',
  role_id: '',
  expired_date: '',
  note: ''
})

async function fetchAgentRole () {
  try {
    const { data } = await $api.agent.getAgentRole(null, null)

    roles.value = data.value?.data.filter(el => el.name !== 'Pengadu')
  } catch (e) {
    $toast.error(e.value.data.message)
  }
}

onMounted(() => {
  fetchAgentRole()
})

const rules = computed(() => {
  return {
    sending_mail: {
      required: helpers.withMessage('The email field is required', required),
      email: helpers.withMessage('Invalid email format', email)
    },
    role_id: {
      required: helpers.withMessage('The role field is required', required)
    },
    expired_date: {
      required: helpers.withMessage('The expired date field is required', required)
    }
  }
})
const v$ = useVuelidate(rules, formData)

const saveForm = async () => {
  v$.value.$validate()
  if (!v$.value.$error) {
    errorMessageRoleId.value = false
    errorMessageExpiredate.value = false
    const dateObject = new Date(formData.expired_date)
    const formattedDate = dateObject.toISOString().split('T')[0]
    const param = {
      sending_mail: formData.sending_mail,
      role_id: formData.role_id,
      expired_date: formattedDate,
      note: ''
    }
    const {
      data,
      error
    } = await $api.inviteLink.getInviteLinkContent(param)
    if (data.value) {
      contentPreviewEmail.value = data.value?.data?.content?.body
      shownModalPreviewEmail.value = true
    }
    if (error.value) useNuxtApp().$toast.error(error.value.data.message)
  } else {
    errorMessageRoleId.value = true
    errorMessageExpiredate.value = true
    useNuxtApp().$toast.warn('pastikan form sudah terisi!')
  }
}

const submitForm = async () => {
  const dateObject = new Date(formData.expired_date)
  const formattedDate = dateObject.toISOString().split('T')[0]
  const param = {
    sending_mail: formData.sending_mail,
    role_id: formData.role_id,
    expired_date: formattedDate,
    note: ''
  }

  loading.value = true
  const { data, error } = await $api.inviteLink.postInviteLink(param)
  loading.value = false
  if (data.value) {
    useNuxtApp().$toast.success('Success!')
    clearForm()
    shownModalPreviewEmail.value = false
    shown.value = false
    emits('submitted')
  }

  if (error.value) {
    loading.value = false
    useNuxtApp().$toast.error(err.value?.data?.message)
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
      clearForm()
      modalChange.close()
      shown.value = false
      emits('close')
    }
  }
})

watch(() => props.show, (val) => {
  shown.value = val
})

function changeAlert (title) {
  titleInfo.value = title
  modalChange.open()
}

function clearForm () {
  formData.sending_mail = ''
  formData.role_id = ''
  formData.expired_date = ''
}

const copyLinkToClipboard = (str) => {
  const urlRegex = /(https:\/\/localhost:3011\/invite-link\/[a-zA-Z0-9-]+)/
  const match = str.match(urlRegex)

  if (match) {
    const url = match[0]
    navigator.clipboard.writeText(url)
      .then(() => {
        useNuxtApp().$toast.success('Copied')
      })
      .catch((error) => {
        useNuxtApp().$toast.success('Failed to copy: ', error)
      })
  } else {
    console.log('URL not found in the text.')
  }
}
</script>
<template>
  <div>
    <ModalFullscreen v-model="shown" title="Invite Link" :width="4" @close-fullscreen="changeAlert('Keluar tanpa menyimpan?')" @keypress.enter="saveForm">
      <div class="flex flex-col gap-4 p-4 overflow-auto pb-10">
        <ReInputText
          v-model="formData.sending_mail"
          label="Email"
          type="email"
          placeholder="Masukan email agent"
          :error="v$.sending_mail.$error ? v$.sending_mail.$errors[0].$message : ''"
          @change="v$.sending_mail?.$touch"
        />
        <div>
          <label for="role">Pilih Role<span class="text-error">*</span></label>
          <v-select
            v-model="formData.role_id"
            label="name"
            class="style-role"
            :placeholder="'Role name'"
            :reduce="role => role.id"
            :options="roles"
            :clearable="false"
          />
          <ReErrorText v-if="errorMessageRoleId" :text="v$.role_id.$error ? v$.role_id.$errors[0].$message : ''" />
        </div>
        <div>
          <label for="expired_date">Waktu Kadaluarsa<span class="text-error">*</span></label>
          <DatePicker v-model="formData.expired_date" />
          <ReErrorText v-if="errorMessageExpiredate" :text="v$.expired_date.$error ? v$.expired_date.$errors[0].$message : ''" />
        </div>
      </div>
      <template #footer>
        <CButton text="Simpan" icon="" class="w-full" @click="saveForm" />
      </template>
    </ModalFullscreen>

    <ModalInfo
      v-model="shownModalPreviewEmail"
      title="Link Berhasil Dibuat"
      type="preview"
      :info="true"
      :disabled-button="loading"
      @close-info="shownModalPreviewEmail = false"
      @close-all="submitForm"
    >
      <template #content>
        <div class="flex flex-row justify-between">
          <CButton
            text="Preview Email"
            type="text"
            size="small"
            icon="gridicons:dropdown"
            class="!px-0 py-1"
          />
          <CButton
            text="Salin Link"
            type="text"
            size="small"
            icon="bx:link"
            class="!px-0 py-1"
            @click="copyLinkToClipboard(contentPreviewEmail)"
          />
        </div>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div class="h-64 p-4 overflow-y-auto mb-4" v-html="contentPreviewEmail" />
      </template>
    </ModalInfo>
  </div>
</template>

<style scoped>
.style-role {
  --vs-search-input-placeholder-color: #B4B4B4;
  --vs-line-height: 36px;
  --vs-dropdown-max-height: 135px;
  --vs-border-radius: 0.5rem;
}

.dp__theme_light {
  --dp-input-padding: 10px
}
</style>
