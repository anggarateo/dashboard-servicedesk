<script lang="ts" setup>
const props = defineProps({
  modelValue: Boolean,
  idTicket: {
    type: String,
    required: true
  }
})
const emits = defineEmits(['update:modelValue', 'success'])
const shown = ref(props.modelValue)
const form = ref({
  trx_ticket_id: props.idTicket,
  grade: 3,
  message: ''
})
const { $api, $toast } = useNuxtApp()
const disButton = ref(false)

watch(() => shown.value, (val) => {
  emits('update:modelValue', val)
})

function closed () {
  shown.value = false
}
async function rating () {
  disButton.value = true
  const {
    data,
    error,
    pending
  } = await $api.ticket.rating(form.value)
  if (data.value) emits('success', true)
  if (error.value) $toast.error(error.value.data.message)
  if (pending.value) disButton.value = pending.value
  disButton.value = false
}
</script>
<template>
  <ModalInfo
    v-model="shown"
    title="Berikan Penilaian"
    info
    :icon="false"
    type="preview"
    :disabled-button="disButton"
    :on-key-enter="false"
    @close-info="closed()"
    @close-all="rating()"
  >
    <template #content>
      <div class="flex flex-col items-center gap-5">
        <CRatingStar
          v-model="form.grade"
          :size="40"
        />
        <textarea
          v-model="form.message"
          rows="5"
          placeholder="Deskripsikan penilaian Anda"
          class="w-full p-2 resize-none rounded-lg border border-neutral focus:ring focus:ring-opacity-90 focus:ring-offset-2 focus:ring-offset-white focus:ring-primary"
        ></textarea>
      </div>
    </template>
  </ModalInfo>
</template>