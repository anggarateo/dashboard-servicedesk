<script lang='ts' setup>
import { Icon } from '@iconify/vue'
import type { Header, Item, ServerOptions } from 'vue3-easy-data-table'
import ModalForm from '@/pages/content/components/ModalForm.vue'

definePageMeta({
  alias: '/konten' // sesuai dari api/role-menu
})

const { $api } = useNuxtApp()

const headers: Header[] = [
  { text: 'SECTION', value: 'label' }
]
const items = ref<Item[]>([])
const loading = ref(false)

const serverItemsLength: any = ref(0)
const serverOptions = ref<ServerOptions>({
  page: 1,
  rowsPerPage: 20
})
const search = ref()

const modalFormType: any = ref('')
const modalItem: any = ref(null)
const modalShow: any = ref(false)
const cHeader: Header[] = [
  { text: 'NO',}
]

async function fetchContent () {
  loading.value = true
  const { data, error } = await $api.content.getContent(null, {
    per_page: serverOptions.value.rowsPerPage,
    ...serverOptions.value,
    q: search.value
  })

  if (data.value) {
    items.value = data.value?.data.map((v: any, i: any) => ({
      label: toTitleCase(v.code),
      ...v
    }))
  }

  if (error.value) {
    useNuxtApp().$toast.error('Error!!!')
  }
  loading.value = false
}

function toTitleCase (str: any) {
  return str.replace(/_/g, ' ').replace(/\w\S*/g, function (txt: any) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}

const openModal = (type: any, item: any) => {
  modalShow.value = true
  modalFormType.value = type
  modalItem.value = item
}

const modalOnClosed = () => {
  modalShow.value = false
  fetchContent()
}

onMounted(() => {
  fetchContent()
})

watch(() => search.value, (val) => {
  let timer: any
  timer = setTimeout(() => {
    clearTimeout(timer)
    fetchContent()
  }, 1000)
})
watch(() => serverOptions.value, () => {
  fetchContent()
}, { deep: true })
</script>

<template>
  <div class="p-4">
    <!-- Cards -->
    <div class="shadow-md bg-white h-auto rounded-xl p-4">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:justify-between mb-4">
        <div>
          <h1 class="text-2xl font-bold">
            Konten
          </h1>
        </div>
        <div class="flex flex-row items-center gap-2 justify-end">
          <ReInputText
            v-model="search"
            placeholder="Masukan nama konten"
            :require="false"
            icon="left"
          >
            <template #icon>
              <Icon
                icon="heroicons:magnifying-glass-20-solid"
                width="24"
              />
            </template>
          </ReInputText>
        </div>
      </div>

      <vue-table
        v-model:server-options="serverOptions"
        table-class-name="template-table"
        table-height="420"
        :headers="headers"
        :items="items"
        :server-items-length="serverItemsLength"
        :loading="loading"
        :hide-rows-per-page="true"
        show-index
        buttons-pagination
      >
        <template #expand="item">
          <div>
            <!-- Header -->
            <div class="grid grid-cols-12 space-x-4 rounded-md bg-primary-500 text-white font-bold p-3">
              <span class="hidden sm:block">NO</span>
              <span class="col-span-2">TIPE</span>
              <span class="col-start-4 col-span-8">ISI KONTEN</span>
              <span class="hidden sm:block">AKSI</span>
            </div>
            <!-- Content -->
            <div class="grid grid-cols-12 items-center space-x-4 p-4">
              <span class="hidden sm:block">1</span>
              <div class="col-span-2">
                Judul
              </div>
              <div class="col-start-4 col-span-8">
                <p class="truncate mb-1">
                  {{ item.langs.id.title || '-' }}
                </p>
                <p class="text-sm font-bold text-error-500 truncate">
                  {{ item.langs.en.title || '-' }}
                </p>
              </div>
              <CButton
                class="!p-2"
                icon="solar:pen-bold"
                icon-position="left"
                size="small"
                @click="openModal('title', item)"
              />
            </div>

            <div class="grid grid-cols-12 items-center space-x-4 p-4">
              <span class="hidden sm:block">2</span>
              <div class="col-span-2">
                Deskripsi
              </div>
              <div class="col-start-4 col-span-8">
                <p class="truncate mb-1">
                  {{ item.langs.id.content || '-' }}
                </p>
                <p class="text-sm font-bold text-error-500 truncate">
                  {{ item.langs.en.content || '-' }}
                </p>
              </div>
              <CButton
                class="!p-2"
                icon="solar:pen-bold"
                icon-position="left"
                size="small"
                @click="openModal('content', item)"
              />
            </div>
          </div>
        </template>
        <template #empty-message>
          <EmptyState content="Konten" code-menu="konten" />
        </template>
      </vue-table>
    </div>

    <ModalForm v-model="modalShow" :form-type="modalFormType" :item="modalItem" @close="modalOnClosed" />
  </div>
</template>

<style scoped>
.expendable-table {
  --easy-table-header-background-color: #2953A1 !important;
  --easy-table-header-font-color: #fff !important;
}

</style>
