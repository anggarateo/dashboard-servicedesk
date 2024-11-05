<script lang="ts" setup>
const { $api, $toast } = useNuxtApp()
const headers = [
  { text: 'NAMA AGENT', value: 'fullname' },
  { text: 'JUMLAH TIKET DITANGANI', value: 'total_tickets' },
  { text: 'RATING', value: 'average_rating' }
]
const items = ref(Array())
const loading = ref(false)
const categoryService = ref()
const params = ref({
  service_id: ''
})

async function getData () {
  loading.value = true
  const {
    data,
    error,
    pending
  } = await $api.dashboard.getLeaderboardAgent(params.value)
  if (data.value) items.value = data.value.data
  if (error.value) $toast.error(error.value.data.message)
  if (pending.value) loading.value = pending.value
  loading.value = false
}
getData()

watch(() => categoryService.value, (val) => {
  if (val) {
    const result = val.split(',')
    params.value.service_id = result[0]
  } else {
    params.value.service_id = ''
  }
  getData()
})
</script>
<template>
  <div class="p-7 space-y-8 bg-white rounded-lg">
    <div class="flex flex-col md:flex-row justify-between gap-2">
      <div>
        <h1 class="text-lg font-semibold">
          Leaderboard Agent
        </h1>
        <h1 class="text-xs text-neutral-400">
          Perkembangan dari tiket, pemohon dan agent
        </h1>
      </div>
      <DropdownPagination
        v-model="categoryService"
        api-module="ticket"
        api-method="getServices"
        option-label="name"
        :option-value="['id', 'service_category', 'id']"
        option-custom
        :required="false"
        placeholder="Pilih layanan"
        class="w-full md:max-w-sm"
        clearable
      />
    </div>
    <div class="space-y-2 text-center">
      <EasyDataTable
        :headers="headers"
        :items="items"
        :loading="loading"
        hide-footer
        show-index
        table-class-name="template-table"
      >
        <template #item-total_tickets="{ total_tickets }">
          <div class="text-center">
            {{ total_tickets }}
          </div>
        </template>
        <template #item-average_rating="{ average_rating }">
          <CRatingStar :rating="average_rating" readonly />
        </template>
      </EasyDataTable>
      <CButton
        text="Lihat Semua"
        type="text"
        icon-position="right"
        icon="material-symbols:arrow-forward"
        @click="$router.push('/tim')"
      />
    </div>
  </div>
</template>