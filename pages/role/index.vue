<script setup>
import ComponentModalForm from './components/ModalForm.vue'
import ModalInfo from '@/components/ModalInfo.vue'
import { useModal } from 'vue-final-modal'

useHead({ title: 'Role' })

definePageMeta({
  alias: '/role',
  components: {
    ComponentModalForm
  }
})

const deletedTitle = ref()
const deletedItem = ref()

const modalDelete = useModal({
  component: ModalInfo,
  attrs: {
    title: deletedTitle,
    info: true,
    type: 'delete',
    onCloseInfo () {
      modalDelete.close()
    },
    onCloseAll () {
      deleteRole(deletedItem.value)
      modalDelete.close()
    }
  }
})

const headers = ref([
  { text: 'NAMA ROLE', value: 'name' },
  { text: 'HAK AKSES', value: 'menus' },
  { text: 'AKSI', value: 'action' }
])
const items = ref([])
const showModalAdd = ref(false)
const detailRole = ref()
const loading = ref(false)
const serverParams = ref({
  q: ''
})
const { $toast, $api } = useNuxtApp()

const getData = async () => {
  loading.value = true
  const {
    data,
    pending,
    error
  } = await $api.role.get.getRoles(serverParams.value)
  
  data.value ? items.value = data.value.data : items.value
  pending.value ? loading.value = true : loading.value
  if (error.value) $toast.error(error.value.data.message)
  loading.value = false
}

getData()

const deleteRole = async (item) => {
  loading.value = true
  const {
    data,
    pending,
    error
  } = await $api.role.get.deleteRole(item.id)
  
  if (data.value) {
    $toast.success(`Role ${item.name} dihapus`)
    getData()
  }
  pending.value ? loading.value = true : loading.value
  if (error.value) $toast.error(error.value.data.message)
  loading.value = false
}
const onDeleteRole = (data) => {
  deletedTitle.value = `Hapus role ${data.name}?`
  deletedItem.value = data
  modalDelete.open()
}
const onEditRole = (data, update = false) => {
  detailRole.value = {
    ...data,
    update: update
  }
  showModalAdd.value = true
}

watch(() => serverParams.value, (val) => {
  let timer
  timer = setTimeout(() => {
    clearTimeout(timer)
    getData()
  }, 1000)
}, { deep: true })
</script>
<template>
  <div class="m-4 p-6 rounded-lg shadow space-y-8 bg-white">
    <div class="flex flex-col md:flex-row md:justify-between">
      <div class="flex flex-col">
        <h1 class="text-xl font-bold">
          Role
        </h1>
        <h1>
          Daftar role yang telah dibuat di B-CARE
        </h1>
      </div>
      <div class="flex flex-col items-end lg:flex-row lg:items-center gap-2">
        <ReInputText
          v-model="serverParams.q"
          type="text"
          placeholder="Cari Role"
          icon="left"
          :require="false"
        >
          <template #icon>
            <Icon name="circum:search" color="black" size="22" />
          </template>
        </ReInputText>
        <CButton v-if="$checkPermission('role', 'create')" text="Tambah Role" icon-position="left" @click="showModalAdd = true"/>
      </div>
    </div>
    <div>
      <EasyDataTable
        :headers="headers"
        :items="items"
        :loading="loading"
        show-index
        table-class-name="template-table"
        theme-color="#193261"
        buttons-pagination
      >
        <template #item-menus="item">
          <div class="flex flex-wrap gap-x-6">
            <div v-for="(menu, i) in item.menus" :key="i">
              <h1>
                {{ menu.merge_name }}
              </h1>
            </div>
            <CButton
              v-if="item.menus.length === 8"
              class="!py-1"
              icon="mdi:eye-outline"
              size="small"
              title="Lihat selengkapnya"
              @click="onEditRole(item)"
            />
          </div>
        </template>
        <template #item-action="item">
          <div class="flex flex-row gap-2">
            <CButton
              v-if="$checkPermission('role', 'delete')"
              :title="'Hapus role ' + item.name"
              size="small"
              icon="ic:baseline-delete-forever"
              color="error"
              @click="onDeleteRole(item)"
            />
            <CButton
              v-if="$checkPermission('role', 'update')"
              :title="'Edit role ' + item.name"
              size="small"
              icon="material-symbols:edit"
              @click="onEditRole(item, true)"
            />
          </div>
        </template>
        <template #empty-message>
          <EmptyState content="Role" code-menu="role" @clicked="showModalAdd = true" />
        </template>
      </EasyDataTable>
    </div>
    <ComponentModalForm
      :show="showModalAdd"
      :detail="detailRole"
      @close="detailRole = null, showModalAdd = false"
      @submit="getData()"
    />
  </div>
</template>
