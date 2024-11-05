<script setup>
import ComponentModalForm from '@/pages/knowledgebase/components/ModalForm.vue'
import ModalInfo from '@/components/ModalInfo.vue'
import { useModal } from 'vue-final-modal'
import Toggle from '@vueform/toggle'

useHead({ title: 'FAQ' })
definePageMeta({
  alias: '/basis_pengetahuan',
  components: {
    ComponentModalForm,
    Toggle
  }
})

const deletedTitle = ref()
const deletedItem = ref()
const shownTitle = ref()
const shownItem = ref()

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
      deleted(deletedItem.value)
      modalDelete.close()
    }
  }
})
const modalToggle = useModal({
  component: ModalInfo,
  attrs: {
    title: shownTitle,
    info: true,
    type: 'yesOrNo',
    onCloseInfo () {
      modalToggle.close()
    },
    onCloseAll () {
      toggled(shownItem.value)
      modalToggle.close()
    }
  }
})

const headers = ref([
  { text: 'TANGGAL', value: 'created_at' },
  { text: 'KATEGORI', value: 'service_category.description' },
  { text: 'JUDUL', value: 'title' },
  { text: 'PENULIS', value: 'writer.fullname' },
  { text: 'TAMPILKAN DI HALAMAN DEPAN?', value: 'is_show_homepage' },
  { text: '', value: 'action' }
])
const items = ref([])
const showModalAdd = ref(false)
const loading = ref(false)
const propsDetail = ref()
const serverOptions = ref({
  page: 1,
  rowsPerPage: 25
})
const serverItemsLength = ref(0)
const search = ref()
// const shownFilter = ref(false)
// const filterOptions = ref({
//   categories: []
// })
// const filterActive = ref({
//   categories: []
// })
// const serverFilter = ref({
//   category: {}
// })
const { $toast, $api } = useNuxtApp()

const deleted = async (item) => {
  loading.value = true
  const {
    data,
    pending,
    error
  } = await $api.knowledgebase.deleteKnowledgebase(item.id)
  if (data.value) {
    $toast.success(`FAQ ${item.langs.id.title} dihapus`)
    getData()
  }
  if (pending.value) loading.value = pending.value
  if (error.value) $toast.error(error.value.data.message)
  loading.value = false
}
const onDelete = (data) => {
  deletedTitle.value = `Hapus FAQ ${data.langs.id.title}?`
  deletedItem.value = data
  modalDelete.open()
}

const onToggle = (data) => {
  data.is_show_homepage ? shownTitle.value = `Tampilkan ${data.langs.id.title} di halaman depan?` : shownTitle.value = `Sembunyikan ${data.langs.id.title} di halaman depan?`
  shownItem.value = data
  modalToggle.open()
}
const toggled = async (item) => {
  loading.value = true
  if (!item.langs.en.title && !item.langs.en.content) delete item.langs.en
  const form = {
    service_category_id: item.service_category.id,
    service_id: item.service.id,
    is_show_homepage: item.is_show_homepage,
    langs: item.langs
  }
  const {
    data,
    pending,
    error
  } = await $api.knowledgebase.updateKnowledgebase(item.id, form)
  if (data.value) {
    item.is_show_homepage ? $toast.success(`FAQ ${item.langs.id.title} ditampilkan`) : $toast.warn(`FAQ ${item.langs.id.title} disembunyikan`)
    getData()
  }
  if (pending.value) loading.value = pending.value
  if (error.value) $toast.error(error.value.data.message)
  loading.value = false
}

const getData = async () => {
  loading.value = true
  const {
    data,
    pending,
    error
  } = await $api.knowledgebase.getKnowledgebase({
    q: search.value,
    page: serverOptions.value.page,
    per_page: serverOptions.value.rowsPerPage
    // ...serverFilter.value.category
  })

  if (data.value) {
    items.value = data.value.data
    serverItemsLength.value = data.value.meta.total
  }
  if (pending.value) loading.value = pending.value
  if (error.value) $toast.error(error.value.data.message)

  loading.value = false
}
getData()
// async function getFilterCategory () {
//   loading.value = true
//   const {
//     data,
//     error,
//     pending
//   } = await $api.knowledgebase.getFaqCategory()
//   if (data.value) {
//     data.value.data.forEach(el => {
//       filterOptions.value.categories.push({
//         label: el.name,
//         value: el.id
//       })
//     })
//   }
//   if (error.value) $toast.error(error.value.data.message)
//   if (pending.value) loading.value = pending.value
//   loading.value = false
// }
// getFilterCategory()

watch(() => search.value, (val) => {
  let timer
  timer = setTimeout(() => {
    clearTimeout(timer)
    getData()
  }, 1000)
})
watch(() => serverOptions.value, (val) => {
  getData()
}, {
  deep: true
})
// watch(() => filterActive.value, (val) => {
//   if (val) {
//     if (val.categories.length) {
//       serverFilter.value.category = {}
//       val.categories.forEach((el, i) => {
//         serverFilter.value.category[`service_category_id[${i}]`] = el
//       })
//     } else {
//       serverFilter.value.category = {}
//     }
//   }
//   getData()
// }, { deep: true })
</script>
<template>
  <div class="m-4 p-6 rounded-lg shadow space-y-8 bg-white">
    <div class="flex flex-col sm:flex-row justify-between">
      <div class="flex flex-col" :class="{ 'w-full lg:w-1/3': $checkPermission('basis_pengetahuan', 'create') }">
        <h1 class="text-xl font-bold text-neutral">
          FAQ
        </h1>
        <h1>
          Daftar FAQ yang telah dibuat di B-CARE
        </h1>
      </div>
      <div class="flex flex-col lg:flex-row items-end lg:items-center gap-2 justify-end">
        <ReInputText
          v-model="search"
          class="w-fit"
          type="text"
          placeholder="Cari FAQ"
          icon="left"
          :require="false"
        >
          <template #icon>
            <Icon name="circum:search" color="black" size="22" />
          </template>
        </ReInputText>
        <CButton
          v-if="$checkPermission('basis_pengetahuan', 'create')"
          text="Tambah FAQ"
          icon-position="left"
          @click="showModalAdd = true"
        />
      </div>
    </div>
    <EasyDataTable
      v-model:server-options="serverOptions"
      :server-items-length="serverItemsLength"
      :headers="headers"
      :items="items"
      :loading="loading"
      show-index
      table-class-name="template-table"
    >
      <template #item-created_at="{ created_at }">
        {{ created_at ? $formatDate(created_at, 'dd MMMM yyyy - HH:mm', { locale: $localeId() }).replace('-', 'Pukul') : '-' }}
      </template>
      <template #item-title="item">
        <h1>
          {{ item.langs.id.title }}
        </h1>
        <h1 class="font-medium text-error">
          {{ item.langs?.en?.title }}
        </h1>
      </template>
      <template #item-is_show_homepage="item">
        <div class="text-center">
          <Toggle v-model="item.is_show_homepage" @change="onToggle(item)" />
        </div>
      </template>
      <template #item-action="item">
        <div v-if="$checkPermission('basis_pengetahuan', 'update') || $checkPermission('basis_pengetahuan', 'delete')" class="flex flex-row gap-2">
          <CButton
            v-if="$checkPermission('basis_pengetahuan', 'delete')"
            title="Hapus FAQ"
            size="small"
            icon="ic:baseline-delete-forever"
            color="error"
            @click="onDelete(item)"
          />
          <CButton
            v-if="$checkPermission('basis_pengetahuan', 'update')"
            title="Edit FAQ"
            size="small"
            icon="material-symbols:edit"
            @click="propsDetail = item, showModalAdd = true"
          />
        </div>
      </template>
      <template #empty-message>
        <EmptyState content="FAQ" code-menu="basis_pengetahuan" @clicked="showModalAdd = true" />
      </template>
    </EasyDataTable>
    <ComponentModalForm
      :show="showModalAdd"
      :detail="propsDetail"
      @close="showModalAdd = false, propsDetail = null"
      @submit="getData"
    />
  </div>
</template>
