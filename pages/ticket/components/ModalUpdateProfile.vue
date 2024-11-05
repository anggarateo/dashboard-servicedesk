<script lang="ts" setup>
import { ModalUpdateProfile } from "constants/types"

const props = defineProps<ModalUpdateProfile>()
const emits = defineEmits(['update:modelValue'])

const shown = ref(props.modelValue)

watch(() => shown.value, (val) => {
  emits('update:modelValue', val)
})
</script>

<template>
  <ModalInfo
    v-model="shown"
    title="Perbarui NIK"
    info
    type="yesOrNo"
    @close-info="shown = false"
    @close-all="$router.replace(`/profile?redirectTo=ticket&idTicket=${idTicket}`)"
  >
    <template #content>
      NIK belum ditambahkan, perbarui sekarang?
    </template>
  </ModalInfo>
</template>
