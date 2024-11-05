<template>
  <div class="p-4 space-y-4">
    <div class="w-full h-full bg-white shadow rounded-lg">
      <div class="flex p-4 flex-col md:flex-row md:justify-between">
        <div class="flex flex-col">
          <div class=" font-bold text-2xl">
            IT Assets
          </div>
          <span class=" text-sm text-neutral-400">Daftar assets IT yang telah dibuat di B-CARE</span>
        </div>
        <div class="w-full lg:w-fit flex flex-col items-end">
          <div class="flex flex-col lg:flex-row items-end lg:items-center">
            <div class="m-2">
              <ReInputText
                v-model="search"
                type="text"
                placeholder="Cari IT Assets"
                icon="left"
                :require="false"
              >
                <template #icon>
                  <Icon name="circum:search" color="black" size="22" />
                </template>
              </ReInputText>
            </div>
            <div v-if="$checkPermission('it_asset', 'create')" class="m-2">
              <CButton class="h-full" text="Tambah IT Asset" icon-position="left" @click="typeModal = 'create', showModal = true" />
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
          <template #item-action="item">
            <div v-if="$checkPermission('it_asset', 'update') || $checkPermission('it_asset', 'delete')" class="operation-wrapper">
              <CButton
                v-if="$checkPermission('it_asset', 'delete')"
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
                v-if="$checkPermission('it_asset', 'update')"
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
import type { Header } from 'vue3-easy-data-table'
import { useModal } from 'vue-final-modal'
import ModalForm from '@/pages/master/appassets/components/ModalForm.vue'
import ModalInfo from '@/components/ModalInfo.vue'

definePageMeta({
  alias: '/it_asset' // sesuai dari api/role-menu
})

useHead({
  title: 'Master IT Assets'
})
onMounted(() => {
  fetchData()
})
const { $api, $toast } = useNuxtApp()

const showModal = ref(false)
const loading = ref(false)

const headers: Header[] = [
  { text: 'NO', value: 'no' },
  { text: 'NAMA', value: 'name' },
  { text: 'KATEGORI', value: 'category' },
  { text: 'AKSI', value: 'action', width: 100 }
]

const items: any = ref([])
const delData = ref()
const dataModal = ref({})
const typeModal = ref('create')
const serverOptions = ref({
  page: 1,
  rowsPerPage: 25
})
const serverItemsLength = ref(0)
const search = ref()

const fetchData = async () => {
  loading.value = true
  try {
    const { data } = await $api.appAsset.getList({
      q: search.value,
      page: serverOptions.value.page,
      per_page: serverOptions.value.rowsPerPage
    })
    if (data.value) {
      serverItemsLength.value = data.value.meta.total
      const val:Array<any> = []
      data.value.data.map((item: any, i : number) =>
        val.push({
          no: i++ + 1,
          id: item.id,
          name: item.name,
          category: item.it_asset_category.name
        })
      )
      items.value = val
    }
  } catch (e:any) {
    $toast.error(e)
  }
  loading.value = false
}
function emitModal (e: any) {
  showModal.value = false
  if (e === 'proses') {
    fetchData()
  }
}
const editData = (item: any) => {
  dataModal.value = item
  showModal.value = true
  typeModal.value = 'update'
}
const deleteData = (item: any) => {
  modalChange.open()
  delData.value = item
}
const modalChange = useModal({
  component: ModalInfo,
  attrs: {
    title: 'Hapus Kategori',
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
    const { data } = await $api.appAsset.delete(delData.value.id)
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
}, { deep: true })
watch(() => serverOptions.value, (val) => {
  fetchData()
}, {
  deep: true
})
</script>
