<template>
  <div class="p-4 space-y-4">
    <div class="w-full h-full shadow rounded-lg bg-white">
      <div class="flex flex-col md:flex-row p-4 gap-2">
        <div class="flex flex-col w-full">
          <div class=" font-bold text-2xl">
            Detail Layanan
          </div>
        </div>
        <div
          v-if="$checkPermission('list_layanan', 'update') || $checkPermission('list_layanan', 'delete')"
          class="w-full flex flex-col items-end sm:flex-row sm:justify-end gap-2"
        >
          <div v-if="$checkPermission('list_layanan', 'delete')">
            <CButton class="h-full" type="filled" text="Hapus Layanan" color="error" @click="deleteData" />
          </div>
          <div v-if="$checkPermission('list_layanan', 'update')">
            <CButton class="h-full" type="filled" text="Edit Layanan" color="primary" @click="editData" />
          </div>
        </div>
      </div>
      <div v-if="!loading" class=" w-full h-full p-4 justify-items-start flex flex-col md:flex-row md:items-center gap-4">
        <img
          style="width: 277px; height: 277px; border-radius: 11.54px"
          :src="$handlePathMedia(item.photo_url) || 'https://via.placeholder.com/277x277'"
          :alt="item.photo_url"
        >
        <div class="grid grid-cols-3 gap-4">
          <h1 class="text-neutral-400">
            Kategori
          </h1>
          <div class="col-span-2">
            <h1>
              {{ item.service_category?.langs?.id?.name || '-' }}
            </h1>
            <h1 class="text-error-500">
              {{ item.service_category?.langs?.en?.name || '-' }}
            </h1>
          </div>
          <h1 class="text-neutral-400">
            Nama Layanan
          </h1>
          <div class="col-span-2">
            <h1>
              {{ item.langs?.id?.name || '-' }}
            </h1>
            <h1 class="text-error-500">
              {{ item.langs?.en?.name || '-' }}
            </h1>
          </div>
          <h1 class="text-neutral-400">
            SLA Respon
          </h1>
          <div class="col-span-2 flex gap-2">
            <CLabelText
              title="Rendah"
              :text="item.sla_response_low || '-'"
              text-color="text-success-500"
              bg-color="bg-success-200"
              text-size="text-xs"
            />
            <CLabelText
              title="Sedang"
              :text="item.sla_response_medium || '-'"
              text-color="text-primary-500"
              bg-color="bg-primary-200"
              text-size="text-xs"
            />
            <CLabelText
              title="Tinggi"
              :text="item.sla_response_high || '-'"
              text-color="text-error-500"
              bg-color="bg-error-200"
              text-size="text-xs"
            />
            <h1 class="capitalize">
              {{ item.sla_response_unit ? localeString(item.sla_response_unit) : '-' }}
            </h1>
            <span v-if="!item.sla_response_unit" class="text-xs text-error self-end italic">
              *Satuan belum diatur
            </span>
          </div>
          <h1 class="text-neutral-400">
            Deskripsi
          </h1>
          <div class="col-span-2">
            <h1>
              {{ item.langs?.id?.description || '-' }}
            </h1>
            <h1 class="text-error-500">
              {{ item.langs?.en?.description || '-' }}
            </h1>
          </div>
          <h1 class="text-neutral-400">
            Unit Kerja
          </h1>
          <h1 class="col-span-2">
            {{ item?.unit_of_work?.name || '-' }}
          </h1>
          <h1 class="text-neutral-400">
            Form Laporan
          </h1>
          <h1 class="col-span-2">
            {{ item?.path_report || '-' }}
          </h1>
        </div>
      </div>
    </div>
    <ModalForm :show="showModal" :data="dataModal" type="update" @close="emitModal" />
  </div>
</template>
<script lang="ts" setup>
import { useModal } from 'vue-final-modal'
import ModalInfo from '@/components/ModalInfo.vue'
import ModalForm from '@/pages/master/service/list/components/ModalForm.vue'

definePageMeta({
  alias: '/list_layanan' // sesuai dari api/role-menu
})

useHead({
  title: 'Detail Layanan'
})
const loading = ref(true)
onMounted(async () => {
  loading.value = true
  await getData()
})
const { $api, $toast } = useNuxtApp()
const router = useRouter()
const route = useRoute()
const delData = ref()
const item = ref()
const showModal = ref(false)
const dataModal = ref({})

const getData = async () => {
  loading.value = true
  try {
    const { data } = await $api.service.get(route.params.id)
    item.value = data.value.data
    loading.value = false
  } catch (e:any) {
    $toast.error(e)
  }
}
const editData = () => {
  dataModal.value = item.value
  showModal.value = true
}
const emitModal = (e: any) => {
  showModal.value = false
  if (e === 'proses') {
    getData()
  }
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
    const { data, error } = await $api.service.delete(route.params.id)
    if (data.value) {
      $toast.success('Data berhasil dihapus!')
      router.back()
    }
    if (error.value) $toast.error(error.value.data.message)
  } catch (e:any) {
    $toast.error(e)
  }
}
</script>
