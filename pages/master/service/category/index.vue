<template>
  <div class="p-4 space-y-4">
    <div class="w-full h-full shadow rounded-lg bg-white">
      <div class="flex p-4 flex-col md:flex-row md:justify-between">
        <div class="flex flex-col">
          <div class=" font-bold text-2xl">
            Kategori
          </div>
          <span class=" text-sm text-neutral-400">Daftar kategori layanan yang telah dibuat di B-CARE</span>
        </div>
        <div class="w-full md:w-fit flex flex-col items-end">
          <div class="flex flex-col lg:flex-row items-end lg:items-center">
            <div class="m-2">
              <ReInputText
                v-model="search"
                type="text"
                placeholder="Cari Nama Kategori"
                icon="left"
                :require="false"
              >
                <template #icon>
                  <Icon name="circum:search" color="black" size="22" />
                </template>
              </ReInputText>
            </div>
            <div v-if="$checkPermission('kategori_layanan', 'create')" class="m-2">
              <CButton class="h-full" text="Tambah Kategori" icon-position="left" @click="addData()" />
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
          <template #item-name="{ langs }">
            <h1>
              {{ langs.id.name }}
            </h1>
            <h1 class="font-medium text-error">
              {{ langs?.en?.name }}
            </h1>
          </template>
          <template #item-description="{ langs }">
            <h1>
              {{ langs.id.description }}
            </h1>
            <h1 class="font-medium text-error">
              {{ langs?.en?.description }}
            </h1>
          </template>
          <template #item-action="item">
            <div v-if="$checkPermission('kategori_layanan', 'update') || $checkPermission('kategori_layanan', 'delete')" class="operation-wrapper">
              <CButton
                v-if="$checkPermission('kategori_layanan', 'update')"
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
                v-if="$checkPermission('kategori_layanan', 'delete')"
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
import ModalForm from '@/pages/master/service/category/components/ModalForm.vue'
import ModalInfo from '@/components/ModalInfo.vue'

definePageMeta({
  alias: '/kategori_layanan' // sesuai dari api/role-menu
})

useHead({
  title: 'Master Kategori'
})
const { $api, $toast } = useNuxtApp()
onMounted(() => {
  fetchData()
})
const loading = ref(false)
const headers: Header[] = [
  { text: 'NO', value: 'no' },
  // { text: 'KODE KATEGORI', value: 'code' },
  { text: 'NAMA KATEGORI', value: 'name' },
  { text: 'DESKRIPSI', value: 'description' },
  { text: 'AKSI', value: 'action', width: 100 }
]

const items: any = ref([])

const showModal = ref(false)
const dataModal = ref({})
const typeModal = ref('create')
const delData = ref()
const serverOptions = ref({
  page: 1,
  rowsPerPage: 25
})
const serverItemsLength = ref(0)
const search = ref()

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
const addData = () => {
  dataModal.value = {}
  showModal.value = true
  typeModal.value = 'create'
}
const fetchData = async () => {
  loading.value = true
  try {
    const { data } = await $api.category.getList({
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
          code: item.code,
          langs: item.langs
        })
      )
      items.value = val
    }
  } catch (e:any) {
    $toast.error(e)
  }
  loading.value = false
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
    const { data } = await $api.category.delete(delData.value.id)
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
