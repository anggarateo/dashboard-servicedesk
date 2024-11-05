<script lang="ts" setup>
import type { ServerOptions } from 'vue3-easy-data-table'
import Toggle from '@vueform/toggle'
import ModalEdit from '~/pages/master/unit-of-work/components/ModalEdit.vue'

definePageMeta({
  alias: '/unit_kerja'
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
  { text: 'UNIT KERJA', value: 'name' },
  { text: 'KODE AKUN', value: 'akun_wa' },
  { text: 'WHATSAPP', value: 'no_wa' },
  { text: 'NOTIFIKASI WHATSAPP', value: 'is_active_send_wa' },
  { text: 'NOTIFIKASI EMAIL', value: 'is_active_send_email' }
]
const items = ref(Array())
const showModal = ref(false)
const propsDetail = ref()
const updateField = ref()
const onSync = ref(false)

async function fetchList () {
  loading.value = true

  const {
    data,
    error,
    pending
  } = await $api.global.getUnitOfWork({
    q: search.value,
    page: serverOptions.value.page,
    per_page: serverOptions.value.rowsPerPage
  })

  if (data.value) {
    items.value = data.value.data
    serverItemsLength.value = data.value.meta.total
  }
  if (error.value) {
    const err: any = error.value
    $toast.error(err.data.message)
  }
  if (pending.value) { loading.value = pending.value }

  loading.value = false
}

async function handleSync () {
  onSync.value = true

  const {
    data,
    error,
    pending
  } = await $api.global.syncUnitOfWork()

  if (data.value) { $toast.success(data.value) }
  if (error.value) {
    const err: any = error.value
    $toast.error(err.data.message)
  }
  if (pending.value) { onSync.value = pending.value }

  onSync.value = false
}

function modalClosed (message: string) {
  $toast.success(message)
  fetchList()
}

function onToggle (field: string, data: any) {
  updateField.value = field
  propsDetail.value = data
  showModal.value = true
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
            Unit Kerja
          </div>
          <span class=" text-sm text-neutral-400">Daftar pengaturan unit kerja di B-CARE</span>
        </div>
        <div class="w-full lg:w-fit flex flex-col items-end">
          <div class="flex items-end lg:items-center gap-2 flex-col lg:flex-row">
            <ReInputText
              v-model="search"
              type="text"
              placeholder="Cari Unit Kerja"
              icon="left"
              :require="false"
            >
              <template #icon>
                <Icon name="circum:search" color="black" size="22" />
              </template>
            </ReInputText>
            <CButton
              v-if="$checkPermission('unit_kerja', 'update')"
              class="h-full"
              text="Sinkronisasi"
              type="outlined"
              :loading="onSync"
              @click="handleSync"
            />
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
      >
        <template #empty-message>
          <EmptyState content="Unit Kerja" />
        </template>
        <template #item-akun_wa="item">
          <div class="flex items-center justify-center gap-2">
            <h1>
              {{ item.akun_wa || '-' }}
            </h1>
            <div
              v-if="$checkPermission('unit_kerja', 'update')"
              title="Edit Kode Akun"
              class="cursor-pointer"
              @click="onToggle('akun_wa', item)"
            >
              <Icon name="majesticons:pencil-alt-line" class="text-xl" />
            </div>
          </div>
        </template>
        <template #item-no_wa="item">
          <div class="flex items-center justify-center gap-2">
            <h1>
              {{ item?.no_wa ? '+62' + item.no_wa : '-' }}
            </h1>
            <div
              v-if="$checkPermission('unit_kerja', 'update')"
              title="Edit WhatsApp"
              class="cursor-pointer"
              @click="onToggle('no_wa', item)"
            >
              <Icon name="majesticons:pencil-alt-line" class="text-xl" />
            </div>
          </div>
        </template>
        <template #item-is_active_send_wa="item">
          <div class="text-center">
            <Toggle
              v-model="item.is_active_send_wa"
              :disabled="!$checkPermission('unit_kerja', 'update')"
              @change="onToggle('is_active_send_wa', item)"
            />
          </div>
        </template>
        <template #item-is_active_send_email="item">
          <div class="text-center">
            <Toggle
              v-model="item.is_active_send_email"
              :disabled="!$checkPermission('unit_kerja', 'update')"
              @change="onToggle('is_active_send_email', item)"
            />
          </div>
        </template>
      </EasyDataTable>
    </div>
    <ModalEdit
      v-if="showModal"
      v-model="showModal"
      :detail="propsDetail"
      :update="updateField"
      @success="modalClosed"
    />
  </div>
</template>