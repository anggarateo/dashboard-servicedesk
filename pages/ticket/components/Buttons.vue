<script lang="ts" setup>
const props = defineProps({
  detail: {
    type: Object,
    required: true
  },
  statusTicket: {
    type: String,
    required: true
  }
})

const emits = defineEmits([
  'check-info-ticket',
  'reject-ticket'
])

const scrollY = ref()
const y = ref()
const hscreen = ref()
const handleScroll = () => {
  scrollY.value = window.scrollY
  hscreen.value = document.body.offsetHeight
  y.value = window.innerHeight
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
<template>
  <div
    class="fixed bottom-0 space-y-2 bg-white p-4 z-[999]"
    :class="{
      'bottom-4': Math.round(scrollY) + y === hscreen,
      'right-16': statusTicket !== 'progress' && statusTicket !== 'open' && statusTicket !== 'req-open' && statusTicket !== 're-open'
    }"
  >
    <CButton
      v-if="$checkPermission('pengelolaan_tiket', 'previous-flow') && statusTicket === 'progress' && detail?.is_user_flow_active"
      class="w-full"
      color="secondary"
      text="Koreksi / Revisi"
      @click="emits('check-info-ticket', 'previous-flow')"
    />
    <CButton
      v-if="$checkPermission('pengelolaan_tiket', 'change-service') && statusTicket === 'open'"
      class="w-full"
      color="secondary"
      text="Ganti Layanan"
      @click="emits('check-info-ticket', 'change-service')"
    />
    <CButton
      v-if="statusTicket === 'close' || statusTicket === 'resolved' || statusTicket === 'rejected'"
      class="w-full"
      text="Re-Open Tiket"
      @click="emits('check-info-ticket', 're-open')"
    />
    <CButton
      v-if="$checkPermission('pengelolaan_tiket', 'close') && statusTicket === 'progress'"
      class="w-full"
      color="error"
      text="Close Tiket"
      @click="emits('check-info-ticket', 'close')"
    />
    <CButton
      v-if="
        ($checkPermission('pengelolaan_tiket', 'confirm') && detail?.is_user_flow_active && (statusTicket === 'open' || statusTicket === 're-open'))
        || ($checkPermission('pengelolaan_tiket', 're-open') && statusTicket === 'req-open')
      "
      class="w-full"
      text="Konfirmasi Tiket"
      @click="statusTicket === 'req-open' ? emits('check-info-ticket', 'req-open') : emits('check-info-ticket', 'confirm')"
    />
    <template v-if="$checkPermission('pengelolaan_tiket', 'confirm') && detail?.is_user_flow_active && statusTicket === 'progress'">
      <CButton
        v-if="detail?.flow_progress_user?.id !== $localUser().id"
        class="w-full"
        text="Tangani Tiket"
        size="small"
        color="success"
        @click="emits('check-info-ticket', 'handle-flow')"
      />
      <CButton
        v-if="$checkPermission('pengelolaan_tiket', 'confirm_all') || $checkPermission('pengelolaan_tiket', 'assign_confirm') || detail?.flow_progress_user?.id === $localUser()?.id"
        class="w-full"
        text="Tiket Telah Ditangani"
        size="small"
        @click="emits('check-info-ticket', 'handled')"
      />
    </template>
    <CButton
      v-if="$checkPermission('pengelolaan_tiket', 'reject') && detail?.is_user_flow_active && (statusTicket === 'open' || statusTicket === 'req-open' || statusTicket === 're-open')"
      class="w-full"
      text="Tolak Tiket"
      color="error"
      @click="emits('reject-ticket')"
    />
  </div>
</template>
