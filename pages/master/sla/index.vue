<template>
  <div class="p-4 space-y-4">
    <div class="w-full h-full bg-white shadow rounded-lg">
      <div class="flex p-4 flex-col md:flex-row">
        <div class="flex flex-col">
          <div class=" font-bold text-2xl">
            SLA
          </div>
          <span class=" text-sm text-neutral-400">Daftar Service Level Aggreement yang telah dibuat di B-CARE</span>
        </div>
        <div class="w-full flex flex-col items-end">
          <div class="flex flex-col lg:flex-row items-end lg:items-center">
            <div class="m-2">
              <ReInputText
                v-model="search"
                type="text"
                placeholder="Cari SLA"
                icon="left"
                :require="false"
              >
                <template #icon>
                  <Icon name="circum:search" color="black" size="22" />
                </template>
              </ReInputText>
            </div>
            <div v-if="$checkPermission('sla', 'create')" class="m-2">
              <CButton class="h-full" text="Tambah SLA" icon-position="left" @click="addData()" />
            </div>
          </div>
        </div>
      </div>
      <div class="p-4">
        <vue-table
          v-model:server-options="serverOptions"
          :server-items-length="serverItemsLength"
          :loading="loading"
          :headers="headers"
          :items="items"
          table-class-name="template-table"
        >
          <template #empty-message>
            <EmptyState content="List Kategori" code-menu="kategori_layanan" />
          </template>
          <template #item-unit="{ unit }">
            <h1 class="capitalize text-center">
              {{ unit }}
            </h1>
          </template>
          <template #item-action="item">
            <div v-if="$checkPermission('sla', 'update') || $checkPermission('sla', 'delete')" class="operation-wrapper">
              <CButton
                v-if="$checkPermission('sla', 'delete')"
                class="m-2"
                type="filled"
                color="error"
                icon-position="left"
                icon="typcn:trash"
                text=""
                size="small"
                @click="deleteData(item)"
              />
              <CButton
                v-if="$checkPermission('sla', 'update')"
                type="filled"
                color="primary"
                icon-position="left"
                icon="solar:pen-outline"
                text=""
                size="small"
                @click="editData(item)"
              />
            </div>
          </template>
        </vue-table>
      </div>
    </div>
    <ModalForm :show="showModal" :data="dataModal" :type="typeModal" @close="emitModal" />
  </div>
</template>
<script lang="ts" setup>
import { useModal } from 'vue-final-modal'
import type { Header } from 'vue3-easy-data-table'
import ModalForm from '@/pages/master/sla/components/ModalForm.vue'
import ModalInfo from '@/components/ModalInfo.vue'

definePageMeta({
  alias: '/sla' // sesuai dari api/role-menu
})

useHead({
  title: 'SLA'
})
const { $api, $toast } = useNuxtApp()
onMounted(() => {
  fetchData()
})
const headers: Header[] = [
  { text: 'NO', value: 'no' },
  { text: 'NAMA', value: 'name' },
  { text: 'RENDAH', value: 'low' },
  { text: 'SEDANG', value: 'middle' },
  { text: 'TINGGI', value: 'height' },
  { text: 'SATUAN', value: 'unit' },
  { text: 'AKSI', value: 'action', width: 100 }
]

const items:any = ref([])

const loading = ref(false)
const showModal = ref(false)
const typeModal = ref('create')
const dataModal = ref({})
const delData = ref()
const serverOptions = ref({
  page: 1,
  rowsPerPage: 25
})
const serverItemsLength = ref(0)
const search = ref()

const emitModal = (e: any) => {
  showModal.value = false
  if (e === 'proses') {
    fetchData()
  }
}

const fetchData = async () => {
  loading.value = true
  try {
    const { data } = await $api.sla.getList({
      q: search.value,
      page: serverOptions.value.page,
      per_page: serverOptions.value.rowsPerPage
    })
    if (data.value) {
      const val:Array<any> = []
      data.value.data.map((item: any, i : number) =>
        val.push({
          no: i++ + 1,
          id: item.id,
          name: item.name,
          low: item.sla_low,
          middle: item.sla_medium,
          height: item.sla_height,
          unit: item.sla_unit ? localeString(item.sla_unit) : '-'
        })
      )
      items.value = val
    }
    loading.value = false
  } catch (e:any) {
    $toast.error(e)
  }
}
const editData = (item: any) => {
  dataModal.value = item
  showModal.value = true
  typeModal.value = 'update'
}
const addData = () => {
  dataModal.value = {}
  showModal.value = true
  typeModal.value = 'create'
}
const deleteData = (item: any) => {
  modalChange.open()
  delData.value = item
}
const modalChange = useModal({
  component: ModalInfo,
  attrs: {
    title: 'Hapus SLA',
    info: true,
    type: 'delete',
    onCloseInfo () {
      modalChange.close()
    },
    onCloseAll () {
      modalChange.close()
      prosesDelete()
    }
  }
})

const prosesDelete = async () => {
  try {
    const { data } = await $api.sla.delete(delData.value.id)
    if (data.value) {
      $toast.success('Data berhasil dihapus!')
      fetchData()
    }
  } catch (e:any) {
    $toast.error(e)
  }
}

watch(() => search.value, (val) => {
  let timer: any
  timer = setTimeout(() => {
    clearTimeout(timer)
    fetchData()
  }, 1000)
})
watch(() => serverOptions.value, (val) => {
  fetchData()
}, {
  deep: true
})
</script>
