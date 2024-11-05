<script lang="ts" setup>
import type { ServerOptions } from 'vue3-easy-data-table'
import ModalForm from '@/pages/master/config/components/ModalForm.vue'

definePageMeta({
  alias: '/config'
})

const { $api, $toast } = useNuxtApp()
const loading = ref(false)
const search = ref()
const serverOptions = ref<ServerOptions>({
  page: 1,
  rowsPerPage: 10
})
const serverItemsLength = ref(0)
const headers = [
  { text: 'NAMA', value: 'name' },
  { text: 'NILAI', value: 'value' },
  { text: 'CATATAN', value: 'note' },
  { text: '', value: 'action' }
]
const items = ref(Array())
const showModal = ref(false)
const propsDetail = ref()

async function fetchList () {
  loading.value = true

  const {
    data,
    error,
    pending
  } = await $api.global.getConfig({
    q: search.value,
    page: serverOptions.value.page,
    per_page: serverOptions.value.rowsPerPage
  })

  if (data.value) {
    items.value = data.value.data
    serverItemsLength.value = data.value.meta.total
  }

  if (error.value) { $toast.error(error.value?.data.message) }

  if (pending.value) { loading.value = pending.value }

  loading.value = false
}

function modalClosed (message: string) {
  $toast.success(message)
  fetchList()
}

onMounted(() => {
  fetchList()
})

watch(() => serverOptions.value, () => { fetchList() }, { deep: true })
watch(() => search.value, () => { fetchList() })
</script>
<template>
  <div class="p-4">
    <div class="w-full h-full shadow rounded-lg bg-white p-4 space-y-4">
      <div class="flex flex-col gap-2 md:flex-row md:justify-between">
        <div class="flex flex-col">
          <div class=" font-bold text-xl">
            Konfigurasi
          </div>
          <span class=" text-sm text-neutral-400">Daftar konfigurasi di B-CARE</span>
        </div>
        <div class="w-full md:w-fit flex flex-col items-end">
          <div class="flex items-center gap-2">
            <ReInputText
              v-model="search"
              type="text"
              placeholder="Cari Konfigurasi"
              icon="left"
              :require="false"
            >
              <template #icon>
                <Icon name="circum:search" color="black" size="22" />
              </template>
            </ReInputText>
          </div>
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
        class="lg:max-w-[1000px] 2xl:max-w-full"
      >
        <template #empty-message>
          <EmptyState content="Konfigurasi" />
        </template>
        <template #item-value="{ value }">
          <h1>
            {{ value || '-' }}
          </h1>
        </template>
        <template #item-note="{ note }">
          <h1>
            {{ note || '-' }}
          </h1>
        </template>
        <template #item-action="item">
          <CButton
            v-if="$checkPermission('config', 'update')"
            title="Edit Konfigurasi"
            size="small"
            icon="material-symbols:edit"
            @click="propsDetail = item, showModal = true"
          />
        </template>
      </EasyDataTable>
    </div>
    <ModalForm
      v-if="showModal"
      v-model="showModal"
      :detail="propsDetail"
      @success="modalClosed"
    />
  </div>
</template>