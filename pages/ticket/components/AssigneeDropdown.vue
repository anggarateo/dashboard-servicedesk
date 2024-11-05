<script setup>
import ModalInfo from '@/components/ModalInfo.vue'

const props = defineProps({
  options: {
    type: Array,
    default: () => []
  },
  value: {
    type: Object,
    default: null
  },
  idTicket: {
    type: String,
    required: true
  }
})
const emits = defineEmits(['success'])

const { $api, $toast } = useNuxtApp()

const selected = ref(props.value)
const errorText = ref('')
const shownModal = ref(false)
const loading = ref(false)

watch(() => selected.value, (val) => {
  if (val && JSON.stringify(val) !== JSON.stringify(props.value || {})) {
    shownModal.value = true
  }
})
watch(() => props.value, (val) => {
  selected.value = val
})

async function assignConfirm () {
  loading.value = true

  const {
    data,
    error,
    pending
  } = await $api.ticket.handleFlow(props.idTicket, { user_id: selected.value.id })

  if (data.value) { emits('success', data.value.message) }
  if (error.value) { $toast.error(error.value.data.message) }
  if (pending.value) { loading.value = pending.value }

  loading.value = false

  if (data.value) { shownModal.value = false }
}
</script>
<template>
  <div>
    <v-select
      id="ticket"
      v-model="selected"
      label="name"
      class="style-chooser ticket text-xs"
      :class="[
        { 'border border-red-500 ring ring-offset-2 ring-offset-white ring-red-500 rounded-xl': errorText }
      ]"
      placeholder="-"
      :options="options"
      :clearable="false"
      :disabled="!$checkPermission('pengelolaan_tiket', 'assign_confirm')"
    />
    <ReErrorText v-if="errorText" :text="errorText" />

    <ModalInfo
      v-model="shownModal"
      info
      type="yesOrNo"
      :title="`Apakah Anda yakin memilih ${selected?.name}?`"
      :disabled-button="loading"
      @before-close="selected = value"
      @close-info="
        selected = value,
        shownModal = false
      "
      @close-all="assignConfirm"
    />
  </div>
</template>