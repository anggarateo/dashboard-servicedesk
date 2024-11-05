<script lang="ts" setup>
import type { ServerOptions } from 'vue3-easy-data-table'
import DetailShown from '@/pages/tim/components/detail.vue'

definePageMeta({
  alias: '/team',
  components: {
    DetailShown
  }
})

const { $api, $toast } = useNuxtApp()
const loading = ref(false)
const serverOptions = ref<ServerOptions>({
  page: 1,
  rowsPerPage: 10
})
const serverItemsLength = ref(0)
const headers = [
  { text: 'LAYANAN', value: 'service.name' },
  { text: 'ALUR', value: 'flow_stage.name' }
]
const items = ref(Array())
const subHeaders = [
  { text: 'NAMA AGEN', value: 'fullname' },
  { text: 'EMAIL', value: 'email' },
  { text: 'ROLE', value: 'role.name' },
  { text: 'UNIT KERJA', value: 'units_of_work.name' },
  { text: 'JABATAN', value: 'position.name' },
  { text: 'AKSI', value: 'action' },
]
const detail = ref()

async function getData () {
  loading.value = true
  const {
    data,
    error,
    pending
  } = await $api.global.getTeams({
    page: serverOptions.value.page,
    per_page: serverOptions.value.rowsPerPage
  })
  if (data.value) {
    items.value = data.value.data
    serverItemsLength.value = data.value.meta.total
  }
  if (error.value) $toast.error(error.value.data.message)
  if (pending.value) loading.value = pending.value
  loading.value = false
}
getData()
function getDetail (data: any, service: any) {
  detail.value = {
    service: service,
    data: data
  }
}

watch(serverOptions.value, () => { getData() }, { deep: true })
</script>
<template>
  <div>
    <DetailShown v-if="detail" :service="detail?.service" :detail="detail?.data" @close="detail = null" />
    <div v-else class="m-4 p-6 rounded-lg shadow space-y-8 bg-white">
      <div class="flex flex-col md:flex-row md:justify-between">
        <div class="flex flex-col">
          <h1 class="text-xl font-bold">
            Tim
          </h1>
          <h1>
            Daftar tim yang telah dibuat di B-CARE
          </h1>
        </div>
        <div class="flex flex-row gap-2 justify-end">
          <ReInputText
            type="text"
            placeholder="Masukkan Nama Tim"
            icon="left"
            :require="false"
          >
            <template #icon>
              <Icon name="circum:search" color="black" size="22" />
            </template>
          </ReInputText>
        </div>
      </div>
      <EasyDataTable
        v-model:server-options="serverOptions"
        table-class-name="template-table"
        :headers="headers"
        :items="items"
        :server-items-length="serverItemsLength"
        :loading="loading"
        :hide-rows-per-page="true"
        show-index
      >
        <template #empty-message>
          <EmptyState content="Tim" code-menu="team" />
        </template>
        <template #expand="item">
          <EasyDataTable
            id="team"
            :headers="subHeaders"
            :items="item.teams"
            table-class-name="template-table"
            hide-footer
            show-index
          >
            <EmptyState content="Tim" code-menu="team" />
            <template #item-action="subItem">
              <CButton
                icon="ic:baseline-remove-red-eye"
                size="small"
                @click="getDetail(subItem, item.service)"
              />
            </template>
          </EasyDataTable>
        </template>
      </EasyDataTable>
    </div>
  </div>
</template>
<style scoped>
.template-table#team {
  --easy-table-header-background-color: #2953A1;
  --easy-table-header-item-padding: 8px;
  --easy-table-header-font-color: white;
  --easy-table-header-font-size: 10px;
}
</style>