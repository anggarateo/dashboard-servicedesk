<!-- eslint-disable vue/valid-v-slot -->
<script lang="ts" setup>
import type { Header, Item, ServerOptions } from 'vue3-easy-data-table'
import { useModal } from 'vue-final-modal'
import ModalForm from '@/pages/master/flow/components/ModalForm.vue'
import ModalInfo from '@/components/ModalInfo.vue'

definePageMeta({
  alias: '/alur' // sesuai dari api/role-menu
})

useHead({
  title: 'Master Alur'
})

const { $api, $toast, $checkPermission, $localUser } = useNuxtApp()
const showModal = ref(false)
const flowId = ref(0)
const headers: Header[] = [
  { text: 'KATEGORI', value: 'service_category.name' },
  { text: 'LAYANAN', value: 'service.name' },
  { text: 'UNIT KERJA', value: 'unit_of_work.name' },
  { text: 'AKSI', value: 'action' }
]
const items = ref<Item[]>([])
const loading = ref(false)
const serverItemsLength: any = ref(0)
const serverOptions = ref<ServerOptions>({
  page: 1,
  rowsPerPage: 20
})

const searchQuery = ref('')
const debounce: any = ref(null)

const cheaders = ref([
  { text: 'Nama Tahapan', value: 'name' },
  { text: 'Jenis SLA', value: 'type_sla.name' },
  { text: 'SLA Rendah', value: 'sla.sla_low' },
  { text: 'SLA Sedang', value: 'sla.sla_medium' },
  { text: 'SLA Tinggi', value: 'sla.sla_height' },
  { text: 'Agent', value: 'agents' }
])

async function getList () {
  loading.value = true

  const byUnit = $checkPermission('alur', 'view') ? { units_of_work_id: $localUser().units_of_work_id } : {}
  
  const { data, error } = await $api.flow.getList(null, {
    q: searchQuery.value,
    per_page: serverOptions.value.rowsPerPage,
    ...serverOptions.value,
    ...byUnit
  })

  if (data.value) {
    items.value = data.value.data
    serverItemsLength.value = data.value?.meta?.total
    loading.value = false
  }

  if (error.value) {
    $toast.error('Unable to get data.', { position: 'bottom-right' })
    loading.value = false
  }
}

const onSubmit = (val: Boolean) => {
  if (val) {
    getList()
    showModal.value = false
  }
}

const deleteFlow = async () => {
  const { data, error } = await $api.flow.deleteList(flowId.value, null, null)

  if (data.value) {
    getList()
    $toast.success('Berhasil dihapus', { position: 'bottom-right' })
  }

  if (error.value) {
    $toast.error('Hapus gagal', { position: 'bottom-right' })
  }
}

function handleSearch (e: any) {
  clearTimeout(debounce.value)
  debounce.value = setTimeout(() => {
    searchQuery.value = e.target.value
    getList()
  }, 600)
}

const alert = useModal({
  component: ModalInfo,
  attrs: {
    title: 'Apakah Anda yakin?',
    info: true,
    type: 'delete',
    onCloseInfo () {
      alert.close()
    },
    onCloseAll () {
      deleteFlow()
      alert.close()
    }
  }
})

onMounted(() => {
  getList()
})

watch(() => serverOptions.value, () => {
  getList()
}, { deep: true })
</script>

<template>
  <div class="p-4 space-y-4">
    <div class="w-full h-full bg-white shadow rounded-lg">
      <div class="flex p-4 flex-col md:flex-row md:justify-between">
        <div class="flex flex-col">
          <div class=" font-bold text-2xl">
            Master Tahapan
          </div>
          <span class=" text-sm text-neutral-400">Daftar tahapan yang telah dibuat di B-CARE</span>
        </div>
        <div class="w-full lg:w-fit flex flex-col items-end">
          <div class="flex flex-col lg:flex-row items-end lg:items-center">
            <div class="m-2">
              <ReInputText
                type="text"
                placeholder="Masukkan Nama alur !"
                icon="left"
                :require="false"
                @keyup="handleSearch"
              >
                <template #icon>
                  <Icon name="circum:search" color="black" size="22" />
                </template>
              </ReInputText>
            </div>
            <div v-show="false" class="m-2">
              <CButton class="h-full" type="outlined" icon-position="left" icon="bi:filter" text="" />
            </div>
            <div class="m-2">
              <CButton class="h-full" text="Tambah alur" icon-position="left" @click="showModal = true" />
            </div>
          </div>
        </div>
      </div>
      <div class="p-4">
        <vue-table
          v-model:server-options="serverOptions"
          :headers="headers"
          :items="items"
          :server-items-length="serverItemsLength"
          :loading="loading"
          :hide-rows-per-page="true"
          show-index
          table-height="420"
          table-class-name="template-table"
        >
          <template #item-action="item">
            <div v-if="$checkPermission('alur', 'update') || $checkPermission('alur', 'delete')" class="flex flex-row gap-2">
              <CButton
                v-if="$checkPermission('alur', 'delete')"
                title="Hapus Alur"
                size="small"
                icon="ic:baseline-delete-forever"
                color="error"
                @click="
                  flowId = item.id,
                  alert.open()
                "
              />
              <NuxtLink
                v-if="$checkPermission('alur', 'update')"
                :to="'/master/flow/' + item.id"
              >
                <CButton
                  :title="'Edit alur ' + item.category"
                  size="small"
                  icon="material-symbols:edit"
                />
              </NuxtLink>
            </div>
          </template>
          <template #empty-message>
            <EmptyState content="List tahapan" code-menu="alur" />
          </template>
          <template #expand="item">
            <div style="padding: 15px">
              <vue-table
                show-index
                :headers="cheaders"
                :items="item.stages"
                table-class-name="template-table"
                :hide-footer="true"
              >
                <template #empty-message>
                  <EmptyState content="List tahapan" code-menu="alur" />
                </template>
                <template #item-agents="agents">
                  <ol class="list-decimal text-left">
                    <li v-for="agent in agents.agents" :key="agent.id">
                      {{ agent.fullname }}
                    </li>
                  </ol>
                </template>
                <template #item-sla.sla_low="sla">
                  {{ sla.sla !== null ? sla.sla.sla_low : sla.sla_custom ? sla.sla_custom.sla_low : '-' }}
                </template>
                <template #item-sla.sla_medium="sla">
                  {{ sla.sla !== null ? sla.sla.sla_medium : sla.sla_custom ? sla.sla_custom.sla_medium : '-' }}
                </template>
                <template #item-sla.sla_height="sla">
                  {{ sla.sla !== null ? sla.sla.sla_height : sla.sla_custom ? sla.sla_custom.sla_height : '-' }}
                </template>
              </vue-table>
            </div>
          </template>
        </vue-table>
      </div>
    </div>
    <ModalForm
      v-model="showModal"
      @close="showModal = false"
      @submitted="onSubmit"
    />
  </div>
</template>
