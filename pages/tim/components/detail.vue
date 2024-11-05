<script lang="ts" setup>
const props = defineProps({
  service: {
    type: Object,
    required: true
  },
  detail: {
    type: Object,
    required: true
  }
})
const emits = defineEmits(['close'])
const { $api, $toast } = useNuxtApp()
const headers = [
  { text: 'ID', value: 'code_ticket' },
  { text: 'TGL MASUK', value: 'transaction_date' },
  { text: 'TGL SELESAI', value: 'end_date' },
  { text: 'SUBJEK TIKET', value: 'title' },
  { text: 'STATUS', value: 'status' },
  { text: 'PENILAIAN', value: 'grade' },
  { text: '', value: 'action' },
]
const items = ref(Array())
const loading = ref(false)

async function getTickets (id: String) {
  loading.value = true
  const {
    data,
    error,
    pending
  } = await $api.global.getTicketAgent(id)
  if (data.value) items.value = data.value.data
  if (error.value) $toast.error(error.value.data.message)
  if (pending.value) loading.value = pending.value
  loading.value = pending.value
}

onMounted(() => {
  getTickets(props.detail.id)
})
</script>
<template>
  <div class="m-4 p-6 space-y-8 rounded-lg shadow bg-white">
    <div class="space-y-2">
      <div class="flex flex-row gap-2 items-center">
        <div
          title="Kembali"
          class="cursor-pointer"
          @click="emits('close')"
        >
          <icon
            name="material-symbols:arrow-back-ios"
            size="20"
          />
        </div>
        <h1 class="text-2xl font-bold">
          Detail Agent
        </h1>
      </div>
      <div class="space-y-3 text-sm">
        <div class="flex flex-col sm:flex-row gap-2 gap-y-1">
          <h1 class="text-neutral-400 sm:w-1/6">
            Nama Agen
          </h1>
          <h1>
            {{ detail?.fullname || '-' }}
          </h1>
        </div>
        <div class="flex flex-col sm:flex-row gap-2 gap-y-1">
          <h1 class="text-neutral-400 sm:w-1/6">
            Email
          </h1>
          <h1>
            {{ detail?.email || '-' }}
          </h1>
        </div>
        <div class="flex flex-col sm:flex-row gap-2 gap-y-1">
          <h1 class="text-neutral-400 sm:w-1/6">
            Unit Kerja
          </h1>
          <h1>
            {{ detail?.units_of_work?.name || '-' }}
          </h1>
        </div>
        <div class="flex flex-col sm:flex-row gap-2 gap-y-1">
          <h1 class="text-neutral-400 sm:w-1/6">
            Jabatan
          </h1>
          <h1>
            {{ detail?.position?.name || '-' }}
          </h1>
        </div>
        <div class="flex flex-col sm:flex-row gap-2 gap-y-1">
          <h1 class="text-neutral-400 sm:w-1/6">
            Role
          </h1>
          <h1>
            {{ detail?.role?.name || '-' }}
          </h1>
        </div>
        <div class="flex flex-col sm:flex-row gap-2 gap-y-1">
          <h1 class="text-neutral-400 sm:w-1/6">
            Layanan
          </h1>
          <h1>
            {{ service?.name || '-' }}
          </h1>
        </div>
      </div>
    </div>
    <div class="text-sm space-y-4">
      <h1 class="font-semibold">
        History penanganan tiket
      </h1>
      <EasyDataTable
        :headers="headers"
        :items="items"
        :loading="loading"
        hide-footer
        table-class-name="template-table"
      >
        <template #item-transaction_date="{ transaction_date }">
          {{ transaction_date ? $formatDate(transaction_date, 'MM/dd/yyyy') : '-'}}
        </template>
        <template #item-status="{ status_ticket }">
          <div class="text-center">
            <CLabelText
              :text="status_ticket.name"
              :text-color="$colorLabel(status_ticket.id).text"
              :bg-color="$colorLabel(status_ticket.id).bg"
              text-size="text-xs"
            />
          </div>
        </template>
        <template #item-grade="{ grade }">
          <CRatingStar
            :rating="grade"
            readonly
          />
        </template>
        <template #item-action="{ id }">
          <NuxtLink
            :to="`/ticket/${id}`"
            class="hover:underline text-primary-500"
          >
            Detail
          </NuxtLink>
        </template>
      </EasyDataTable>
    </div>
  </div>
</template>