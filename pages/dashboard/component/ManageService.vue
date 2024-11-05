<script lang="ts" setup>
import ModalInfo from '@/components/ModalInfo.vue'
import { useModal } from 'vue-final-modal'
import Toggle from '@vueform/toggle'

const headers = [
  { text: 'LAYANAN', value: 'service' },
  { text: 'PENANGGUNG JAWAB', value: 'person_responsible.name' },
  { text: 'UNIT KERJA', value: 'unit_of_work.name' },
  { text: 'TAMPILKAN DI HALAMAN DEPAN?', value: 'is_show_homepage' },
  { text: '', value: 'action' }
]
const items = ref(Array())
const loading = ref(false)
const { $api, $toast } = useNuxtApp()
const shownTitle = ref()
const shownItem = ref()
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

async function getData () {
  loading.value = true
  const {
    data,
    error,
    pending
  } = await $api.dashboard.getManageService()
  if (data.value) items.value = data.value.data
  if (error.value) $toast.error(error.value.data.message)
  if (pending.value) loading.value = pending.value
  loading.value = false
}
getData()
async function toggled (item: any) {
  loading.value = true
  const {
    data,
    error,
    pending
  } = await $api.service.patch(item.id, jsonToFormData({
    is_show_homepage: item.is_show_homepage,
    service_category_id: item.service_category.id,
    langs: item.langs
  }))
  if (data.value) {
    item.is_show_homepage ? $toast.success(`Layanan ${item.langs.id.name} ditampilkan`) : $toast.warn(`Layanan ${item.langs.id.name} disembunyikan`)
    getData()
  }
  if (error.value) $toast.error(error.value.data.message)
  if (pending.value) loading.value = pending.value
  loading.value = false
}
function onToggle (data: any) {
  data.is_show_homepage ? shownTitle.value = `Tampilkan ${data.langs.id.name} di halaman depan?` : shownTitle.value = `Sembunyikan ${data.langs.id.name} di halaman depan?`
  shownItem.value = data
  modalToggle.open()
}
</script>
<template>
  <div class="p-7 space-y-8 bg-white rounded-lg">
    <div class="flex flex-col sm:flex-row gap-2 justify-between">
      <div>
        <h1 class="text-xl font-semibold">
          Manajemen Layanan
        </h1>
        <h1 class="text-xs text-neutral-400">
          Daftar layanan yang telah dibuat di B-CARE
        </h1>
      </div>
      <CButton
        text="Lihat Selengkapnya"
        type="text"
        icon-position="right"
        icon="material-symbols:arrow-forward"
        @click="$router.push('/master/service/list')"
      />
    </div>
    <EasyDataTable
      :headers="headers"
      :items="items"
      :loading="loading"
      show-index
      table-class-name="template-table"
      hide-footer
    >
      <template #item-service="item">
        <div class="flex flex-row gap-4">
          <img
            :src="$handlePathMedia(item.photo_url) || '/b-care.png'"
            :alt="item.photo_url"
            class="w-10 sm:w-20 h-10 sm:h-20"
            :class="{ 'opacity-50': !item.photo_url }"
          >
          <div class="text-sm">
            <h1 class="font-bold">
              {{ item.service_category.name }}
            </h1>
            <h1>
              {{ item.langs.id.name }}
            </h1>
          </div>
        </div>
      </template>
      <template #item-is_show_homepage="item">
        <div class="flex justify-center">
          <Toggle v-model="item.is_show_homepage" @change="onToggle(item)" />
        </div>
      </template>
      <template #item-action="item">
        <div class="flex justify-center">
          <CButton
            title="Edit Layanan"
            size="small"
            icon="material-symbols:edit"
            @click="$router.push(`/master/service/list/${item.id}`)"
          />
        </div>
      </template>
    </EasyDataTable>
  </div>
</template>
