<template>
  <div class="p-4 space-y-4">
    <div class="w-full h-full shadow bg-white rounded-lg">
      <div class="flex p-4 flex-col md:flex-row md:justify-between">
        <div class="flex flex-col">
          <div class=" font-bold text-2xl">
            Master Layanan
          </div>
          <span class=" text-sm text-neutral-400">Daftar layanan yang telah dibuat di B-CARE</span>
        </div>
        <div class="w-full md:w-fit flex flex-col items-end">
          <div class="flex flex-col lg:flex-row items-end lg:items-center">
            <div class="m-2">
              <ReInputText
                v-model="search"
                type="text"
                placeholder="Cari Layanan"
                icon="left"
                :require="false"
              >
                <template #icon>
                  <Icon name="circum:search" color="black" size="22" />
                </template>
              </ReInputText>
            </div>
            <div v-if="$checkPermission('list_layanan', 'create')" class="m-2">
              <CButton class="h-full" text="Tambah Layanan" icon-position="left" @click="showModal = true" />
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
            <EmptyState content="List Layanan" code-menu="list_layanan" />
          </template>
          <template #expand="item">
            <div style="padding: 15px">
              <vue-table
                :headers="cheaders"
                :items="item.services"
                table-class-name="customize-table"
                :hide-footer="true"
              >
                <template #empty-message>
                  <EmptyState content="List Layanan" code-menu="list_layanan" />
                </template>
                <template #item-icon="{ icon }">
                  <img
                    v-if="icon"
                    :src="$handlePathMedia(icon)"
                    :alt="icon"
                    width="46"
                    height="46"
                    @error="imgError = true"
                  >
                  <h1 v-else-if="!icon || imgError" class="text-center">-</h1>
                </template>
                <template #item-service="{ langs }">
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
                <template #item-sla_response="child">
                  <div class="flex flex-col items-center gap-2">
                    <CLabelText
                      title="Rendah"
                      :text="child.low"
                      text-color="text-success-500"
                      bg-color="bg-success-200"
                      text-size="text-xs"
                    />
                    <CLabelText
                      title="Sedang"
                      :text="child.medium"
                      text-color="text-primary-500"
                      bg-color="bg-primary-200"
                      text-size="text-xs"
                    />
                    <CLabelText
                      title="Tinggi"
                      :text="child.high"
                      text-color="text-error-500"
                      bg-color="bg-error-200"
                      text-size="text-xs"
                    />
                    <h1 class="capitalize">
                      {{ child.sla_unit }}
                    </h1>
                  </div>
                </template>
                <template #item-show="items">
                  <div class="operation-wrapper">
                    <Toggle v-model="items.is_show_homepage" @change="onToggle(items)" />
                  </div>
                </template>
                <template #item-action="items">
                  <div class="operation-wrapper">
                    <CButton
                      v-if="$checkPermission('list_layanan', 'delete')"
                      class="m-2"
                      type="filled"
                      color="error"
                      icon-position="left"
                      icon="typcn:trash"
                      text=""
                      size="small"
                      @click="deleteData(items)"
                    />
                    <CButton
                      type="filled"
                      color="primary"
                      icon-position="left"
                      icon="mdi:eye-outline"
                      text=""
                      size="small"
                      @click="$router.push('/master/service/list/'+items.id)"
                    />
                  </div>
                </template>
              </vue-table>
            </div>
          </template>
        </vue-table>
      </div>
    </div>
    <ModalForm :show="showModal" type="create" @close="emitModal" />
  </div>
</template>
<script lang="ts" setup>
import type { Header } from 'vue3-easy-data-table'
// eslint-disable-next-line import/default
import Toggle from '@vueform/toggle'
import { useModal } from 'vue-final-modal'
import ModalForm from '@/pages/master/service/list/components/ModalForm.vue'
import ModalInfo from '@/components/ModalInfo.vue'

definePageMeta({
  alias: '/list_layanan', // sesuai dari api/role-menu
  components: { Toggle }
})

useHead({
  title: 'Master Layanan'
})
const { $api, $toast, $checkPermission, $localUser } = useNuxtApp()

const showModal = ref(false)
const loading = ref(false)
const delData = ref()
const serverOptions = ref({
  page: 1,
  rowsPerPage: 25
})
const serverItemsLength = ref(0)
const search = ref()
const imgError = ref(false)

onMounted(() => {
  fetchData()
})

const emitModal = (e: any) => {
  showModal.value = false
  if (e === 'proses') {
    fetchData()
  }
}
const headers: Header[] = [
  { text: 'NO', value: 'no' },
  { text: 'KATEGORI', value: 'category' }
]

const items: any = ref([])
const cheaders: Header[] = [
  { text: 'NO', value: 'no' },
  { text: 'ICON', value: 'icon' },
  { text: 'LAYANAN', value: 'service' },
  { text: 'UNIT KERJA', value: 'unit' },
  { text: 'SLA Respon', value: 'sla_response' },
  { text: 'DESKRIPSI', value: 'description' },
  // { text: 'PENANGGUNG JAWAB', value: 'pj' },
  { text: 'SHOW', value: 'show' },
  { text: 'AKSI', value: 'action', width: 100 }
]
const shownTitle = ref()
const shownItem = ref()
// const citems:any = ref([])

const fetchData = async () => {
  loading.value = true

  const byUnit = $checkPermission('list_layanan', 'view') ? { units_of_work_id: $localUser().units_of_work_id } : {}
  
  try {
    const { data } = await $api.service.getList({
      q: search.value,
      page: serverOptions.value.page,
      per_page: serverOptions.value.rowsPerPage,
      ...byUnit
    })
    if (data.value) {
      serverItemsLength.value = data.value.meta.total
      const val:Array<any> = []
      // eslint-disable-next-line array-callback-return
      data.value.data.map((item: any, i : number) => {
        const subval:Array<any> = []
        item.services.map((subitem: any, j : number) =>
          subval.push({
            no: j++ + 1,
            icon: subitem.photo_url,
            id: subitem.id,
            langs: subitem.langs,
            unit: subitem.unit_of_work.name,
            // pj: subitem.person_responsible.name,
            active: subitem.is_show_homepage,
            low: subitem.sla_response_low,
            medium: subitem.sla_response_medium,
            high: subitem.sla_response_high,
            sla_unit: subitem.sla_response_unit ? localeString(subitem.sla_response_unit) : '-',
            service_category: item,
            ...subitem
          })
        )
        val.push({
          no: i++ + 1,
          category: item.name,
          services: subval
        })
      })
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
    title: 'Hapus Layanan',
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
    const { data, error } = await $api.service.delete(delData.value.id)
    if (data.value) {
      $toast.success('Data berhasil dihapus!')
      fetchData()
    }
    if (error.value) $toast.error(error.value.data.message)
  } catch (e:any) {
    $toast.error(e)
  }
}
const onToggle = (data: any) => {
  data.is_show_homepage ? shownTitle.value = `Tampilkan ${data.langs.id.name} di halaman depan?` : shownTitle.value = `Sembunyikan ${data.langs.id.name} di halaman depan?`
  shownItem.value = data
  modalToggle.open()
}
const toggled = async (item: any) => {
  loading.value = true
  const form = {
    service_category_id: item.service_category.id,
    units_of_work_id: item.unit_of_work.id,
    is_show_homepage: item.is_show_homepage,
    langs: item.langs,
    // person_responsible_id: item.person_responsible.id,
    phone: item.phone,
    sla_response_low: item.sla_response_low,
    sla_response_medium: item.sla_response_medium,
    sla_response_high: item.sla_response_high
  }
  const {
    data,
    pending,
    error
  } = await $api.service.patch(item.id, form)
  if (data.value) {
    item.is_show_homepage ? $toast.success(`Layanan ${item.langs.id.name} ditampilkan`) : $toast.warn(`Layanan ${item.langs.id.name} disembunyikan`)
    fetchData()
  }
  if (pending.value) loading.value = pending.value
  if (error.value) $toast.error(error.value.data.message)
  loading.value = false
}
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
