<script lang="ts" setup>
import Toggle from '@vueform/toggle'
import ModalForm from '@/pages/ticket/components/ModalForm.vue'
import { useTicketStore } from '~/store/ticket'
import Filter from './components/Filter.vue'
import CardRating from '@/pages/ticket/components/CardRating.vue'

definePageMeta({
  alias: '/pengelolaan_tiket', // sesuai dari api/role-menu
  components: {
    Toggle,
    Filter
  }
})

useHead({
  title: 'Tiket'
})
const { $api, $toast, $localUser } = useNuxtApp()

const showModal = ref(false)
const loading = ref(false)

const emitModal = (e: any) => {
  if (e) {
    activeTab.value = tabs.value[0]
    fetchList()
  }
  showModal.value = false
}
const headers = [
  { text: 'Informasi Tiket', value: 'info' },
  { text: '', value: 'status' },
  { text: '', value: 'action', width: 50 }
]
const items = ref([])
const serverOptions = ref({
  page: 1,
  rowsPerPage: 25
})
const serverItemsLength = ref(0)
const initTabs = () => ([
  {
    id: 'todo',
    name: 'To Do'
  },
  {
    id: 'process',
    name: 'Tersedia'
  },
  {
    id: 'finish',
    name: 'Telah Ditangani'
  },
  {
    id: 'all',
    name: 'Semua'
  },
  {
    id: 'viewer',
    name: 'Viewer'
  },
  {
    id: 'myTicket',
    name: 'Tiket Saya'
  }
])
const tabs = $localUser()?.roles.find((el: any) => el.name.toLowerCase() === 'superadmin')
  ? ref(initTabs().filter(el => el.id !== 'todo'))
  : ref(initTabs())
const activeTab = ref(tabs.value[0])
const ticketStore = useTicketStore()
const sortOptions = [
  { label: 'Terbaru', value: { sort_created_at: 'DESC' } },
  { label: 'Terlama', value: { sort_created_at: 'ASC' } },
  { label: 'Batas SLA Respon terdekat', value: { sort_response_limit: 'ASC' } },
  { label: 'Batas SLA Respon terlama', value: { sort_response_limit: 'DESC' } }
]
const sortBy = ref(sortOptions[0])
const serverParams = ref({
  q: ''
})
const showMyTicket = ref(false)
const idTicket = ref()
const showFilter = ref(false)
const filterParams = ref()
const showMore = ref(false)
const showMoreId = ref()
const scrollY = ref(0)

const getData = async () => {
  loading.value = true
  const {
    data,
    error,
    pending
  } = await $api.ticket.getList({
    ...serverParams.value,
    page: serverOptions.value.page,
    per_page: serverOptions.value.rowsPerPage,
    process_ticket: activeTab.value.id,
    ...filterParams.value
  })
  if (data.value) {
    items.value = data.value.data
    serverItemsLength.value = data.value.meta.total
  }
  if (error.value) {
    items.value = []
    serverItemsLength.value = 0
    $toast.error(error.value.data.message)
  }
  if (pending.value) loading.value = pending.value
  loading.value = false
}

const getDataListViewer = async () => {
  loading.value = true
  const {
    data,
    error,
    pending
  } = await $api.ticket.getListTicketViewer({
    ...serverParams.value,
    page: serverOptions.value.page,
    per_page: serverOptions.value.rowsPerPage,
    process_ticket: activeTab.value.id,
    ...filterParams.value
  })
  if (data.value) {
    items.value = data.value.data
    serverItemsLength.value = data.value.meta.total
  }
  if (error.value) {
    items.value = []
    serverItemsLength.value = 0
    $toast.error(error.value.data.message)
  }
  if (pending.value) loading.value = pending.value
  loading.value = false
}

watch(() => serverOptions.value, (val) => {
  if (!ticketStore.getStore) {
    fetchList()
  }
}, {
  deep: true
})
watch(() => activeTab.value, (val) => {
  if (!ticketStore.getStore) {
    fetchList()
  }
}, {
  deep: true
})
watch(() => serverParams.value, (val) => {
  if (!ticketStore.getStore) {
    let timer: any
    timer = setTimeout(() => {
      clearTimeout(timer)
      fetchList()
    }, 1000)
  }
}, {
  deep: true
})
watch(() => sortBy.value, (val) => {
  if (!ticketStore.getStore) {
    ticketStore.$patch({
      list: {
        sortBy: val
      }
    })
  }
}, {
  deep: true
})

onMounted(async () => {
  if (ticketStore.codeTicket) serverParams.value.q = ticketStore.codeTicket
  
  if (ticketStore.getStore && ticketStore.list.activeTab.id) {
    await getStore()
    scrollTo()
  } else {
    fetchList()
  }

  window.addEventListener('scroll', handleScroll)
  ticketStore.$patch({ getStore: false })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  ticketStore.$patch({
    list: {
      scrollY: scrollY.value
    }
  })
})

const handleScroll = () => {
  scrollY.value = window.scrollY
}

function scrollTo () {
  let timer: any
  
  timer = setTimeout(() => {
    clearTimeout(timer)
    window.scroll(0, ticketStore.list.scrollY)
  }, 10)
}

async function getStore () {
  activeTab.value = ticketStore.list.activeTab
  items.value = ticketStore.list.data
  serverItemsLength.value = ticketStore.list.total
  serverParams.value = ticketStore.list.serverParams
  serverOptions.value = ticketStore.list.serverOptions
  sortBy.value = ticketStore.list.sortBy
  filterParams.value = ticketStore.list.filterParams
  showFilter.value = ticketStore.list.showFilter
}

function sorted (val: any) {
  serverParams.value = {
    ...serverParams.value,
    ...val
  }
  const keys = Object.keys(serverParams.value)
  if (keys.length > 2) {
    const splice = keys.splice(1, 1)
    delete serverParams.value[splice[0]]
  }
}

async function fetchList () {
  if (activeTab.value.id === 'viewer') {
    await getDataListViewer()
  } else if (activeTab.value.id === 'myTicket') {
    await getMyTickets()
  } else if (activeTab.value.id === 'all') {
    await getAllTicket()
  } else {
    await getData()
  }

  ticketStore.$patch({
    list: {
      activeTab: activeTab.value,
      data: items.value,
      total: serverItemsLength.value,
      serverParams: serverParams.value,
      serverOptions: serverOptions.value,
      filterParams: filterParams.value,
      showFilter: showFilter.value
    }
  })
}

async function getMyTickets () {
  loading.value = true

  const {
    data,
    error,
    pending
  } = await $api.ticket.getMyTickets({
    ...serverParams.value,
    page: serverOptions.value.page,
    per_page: serverOptions.value.rowsPerPage,
    ...filterParams.value
  })

  if (data.value) {
    items.value = data.value.data
    serverItemsLength.value = data.value.meta.total
  }
  if (error.value) {
    items.value = []
    serverItemsLength.value = 0
    $toast.error(error.value.data.message)
  }
  if (pending.value) { loading.value = pending.value }

  loading.value = false
}

async function onApprove (val: Boolean) {
  loading.value = true

  const {
    data,
    error,
    pending
  } = await $api.ticket.accMyTicket(idTicket.value, { is_my_ticket: val })

  if (data.value) { $toast.success(data.value.message) }
  if (error.value) { $toast.success(error.value.data.message) }
  if (pending.value) { loading.value = pending.value }

  loading.value = false
}

async function accMyTicket (val: Boolean) {
  await onApprove(val)
  showMyTicket.value = false
  getMyTickets()
}

async function getAllTicket () {
  loading.value = true

  const {
    data,
    error,
    pending
  } = await $api.ticket.getListAll({
    ...serverParams.value,
    page: serverOptions.value.page,
    per_page: serverOptions.value.rowsPerPage,
    ...filterParams.value
  })

  if (data.value) {
    items.value = data.value.data
    serverItemsLength.value = data.value.meta.total
  }
  if (error.value) {
    items.value = []
    serverItemsLength.value = 0
    $toast.error(error.value.data.message)
  }
  if (pending.value) { loading.value = pending.value }

  loading.value = false
}

function showMoreInfo (id: String) {
  if (showMoreId.value === id) { showMore.value = !showMore.value }
  else { showMore.value = true }
  showMoreId.value = id
}
</script>
<template>
  <div class="p-4 space-y-4">
    <div class="w-full h-full shadow rounded-lg bg-white">
      <div class="flex flex-col md:flex-row p-4 justify-between">
        <div class="flex flex-col">
          <div class=" font-bold text-xl">
            Manajemen Tiket
          </div>
          <span class=" text-sm text-neutral-400">Daftar tiket yang telah dibuat di B-CARE</span>
        </div>
        <div class="w-full lg:w-fit flex flex-col items-end">
          <div class="flex flex-col lg:flex-row lg:items-center items-end gap-2">
            <div class="flex gap-2">
              <CButton
                icon="material-symbols:filter-list-rounded"
                :type="showFilter ? 'filled' : 'outlined'"
                @click="showFilter = !showFilter"
              />
              <ReInputText
                v-model="serverParams.q"
                type="text"
                placeholder="Cari Tiket"
                icon="left"
                :require="false"
              >
                <template #icon>
                  <Icon name="circum:search" color="black" size="22" />
                </template>
              </ReInputText>
            </div>
            <div v-if="$checkPermission('pengelolaan_tiket', 'create')">
              <CButton class="h-full" text="Tambah Tiket" icon-position="left" @click="showModal = true" />
            </div>
          </div>
        </div>
      </div>
      <Filter v-show="showFilter" @filter="filterParams = $event, fetchList()" @hide="showFilter = false" />
      <div class="p-4 space-y-2">
        <div class="flex flex-col lg:flex-row justify-between items-end overflow-auto gap-2 h-full">
          <Tab
            :tabs="tabs"
            :active-tab="activeTab.id"
            type="underlined"
            styles="text-sm font-semibold text-neutral-300"
            class="w-full lg:w-fit"
            :disabled="loading"
            @switch-tab="activeTab = $event"
          />
          <div class="flex items-end justify-end w-full lg:w-96 gap-2 h-full">
            <h1>
              Urutkan
            </h1>
            <DropDown
              :required="false"
              :data="sortOptions"
              :value="sortBy"
              class="w-full"
              @input="
                sortBy = $event,
                sorted($event.value)
              "
            />
          </div>
        </div>
        <vue-table
          v-model:server-options="serverOptions"
          :server-items-length="serverItemsLength"
          :loading="loading"
          :headers="headers"
          :items="items"
          table-class-name="template-table"
          id="compact"
        >
          <template #empty-message>
            <EmptyState :content="`List ${activeTab.id === 'myTicket' ? activeTab.name : `Tiket ${activeTab.name}` }`" code-menu="pengelolaan_tiket" @clicked="showModal = true" />
          </template>
          <template #item-info="item">
            <!-- mobile -->
            <div class="space-y-2 lg:hidden">
              <div>
                <h1 class="font-semibold">
                  Kode
                </h1>
                <div class="flex flex-row gap-1 items-center">
                  <h1>
                    {{ item.code_ticket }}
                  </h1>
                  <CButton
                    :title="`Copy ${item.code_ticket}`"
                    icon-position="left"
                    icon="bi:clipboard"
                    size="small"
                    type="text"
                    @click="$copyToClipboard(item.code_ticket)"
                  />
                </div>
              </div>
              <div>
                <h1 class="font-semibold">
                  Tanggal Masuk
                </h1>
                <h1>
                  {{ item.transaction_date_format }}
                </h1>
              </div>
              <div>
                <h1 class="font-semibold">
                  Pemohon
                </h1>
                <h1>
                  {{ item?.user?.name || '-' }}
                  {{ item?.user?.email ? `(${item.user.email})` : '' }}
                </h1>
              </div>
              <div>
                <h1 class="font-semibold">
                  Subjek
                </h1>
                <h1>
                  {{ item.title }}
                </h1>
              </div>
              <div>
                <h1 class="font-semibold">
                  Status
                </h1>
                <CLabelText
                  :text="item.status_ticket.name"
                  :text-color="$colorLabel(item.status_ticket.id).text"
                  :bg-color="$colorLabel(item.status_ticket.id).bg"
                  text-size="text-xs"
                  class="w-fit"
                />

                <CardRating
                  v-if="item.rating"
                  :rating="item.rating"
                />
              </div>

              <template v-if="showMore && item.id === showMoreId">
                <div>
                  <h1 class="font-semibold">
                    Layanan
                  </h1>
                  <h1>
                    {{ item.service.name }}
                  </h1>
                </div>
                <div>
                  <h1 class="font-semibold">
                    SLA Respon
                  </h1>
                  <div v-if="item.is_response_agent && item.response_agent_date <= item.response_agent_limit_date">
                    <CLabelText
                      :title="item.response_agent_sla_format"
                      :text="item.response_agent_date ? $formatDate(item.response_agent_date, 'dd MMMM yyyy - HH:mm').replace('-', 'Pukul') : item.response_agent_sla_format"
                      bg-color="bg-success-100"
                      text-color="text-success-500"
                      text-size="text-xs"
                      class="w-fit"
                    />
                  </div>
                  <vue-countdown
                    v-else
                    :time="new Date(item.response_agent_limit_date) - new Date()"
                    v-slot="{ days, hours, minutes, seconds }"
                  >
                    <div
                      class="flex items-center text-center"
                      :title="days ? `${days} hari lagi` : hours ? `${hours} jam lagi` : minutes ? `${minutes} menit lagi` : seconds ? `${seconds} detik lagi` : 'Melewati SLA'"
                    >
                      <CLabelText
                        :text="item.response_agent_date ? $formatDate(item.response_agent_date, 'dd MMMM yyyy - HH:mm').replace('-', 'Pukul') : item.response_agent_sla_format"
                        :bg-color="days || hours || minutes ? 'bg-primary-100' : seconds ? 'bg-secondary-100' : 'bg-error-100'"
                        :text-color="days || hours || minutes ? 'text-primary-500' : seconds ? 'text-secondary-500' : 'text-error-500'"
                        text-size="text-xs"
                        class="w-fit"
                      />
                      <Icon v-if="!days && !hours && !minutes && !seconds" name="ph:warning-circle-fill" class="text-error-500 text-xl" />
                    </div>
                  </vue-countdown>
                </div>
                <div>
                  <h1 class="font-semibold">
                    Estimasi Penyelesaian Tiket
                  </h1>
                  <div v-if="item.resolve_date <= item.resolve_limit_date">
                    <CLabelText
                      :title="item.resolve_sla_format"
                      :text="item.resolve_date ? $formatDate(item.resolve_date, 'dd MMMM yyyy - HH:mm').replace('-', 'Pukul') : item.resolve_sla_format"
                      :bg-color="item.resolve_date ? 'bg-success-100' : 'bg-stroke'"
                      :text-color="item.resolve_date ? 'text-success-500' : 'text-neutral-500'"
                      text-size="text-xs"
                      class="w-fit"
                    />
                  </div>
                  <vue-countdown
                    v-else
                    :time="new Date(item.resolve_limit_date) - new Date()"
                    v-slot="{ days, hours, minutes, seconds }"
                  >
                    <div
                      class="flex items-center text-center"
                      :title="days ? `${days} hari lagi` : hours ? `${hours} jam lagi` : minutes ? `${minutes} menit lagi` : seconds ? `${seconds} detik lagi` : 'Melewati SLA'"
                    >
                      <CLabelText
                        :text="item.resolve_date ? $formatDate(item.resolve_date, 'dd MMMM yyyy - HH:mm').replace('-', 'Pukul') : item.resolve_sla_format"
                        :bg-color="days || hours || minutes ? 'bg-primary-100' : seconds ? 'bg-secondary-100' : 'bg-error-100'"
                        :text-color="days || hours || minutes ? 'text-primary-500' : seconds ? 'text-secondary-500' : 'text-error-500'"
                        text-size="text-xs"
                        class="w-fit"
                      />
                      <Icon v-if="!days && !hours && !minutes && !seconds" name="ph:warning-circle-fill" class="text-error-500 text-xl" />
                    </div>
                  </vue-countdown>
                </div>
                <div>
                  <h1 class="font-semibold">
                    Tingkat Dampak
                  </h1>
                  <CLabelText
                    :text="item.impact_level.name"
                    :text-color="$colorLabel(item.impact_level.id).text"
                    :bg-color="$colorLabel(item.impact_level.id).bg"
                    text-size="text-xs"
                    class="w-fit"
                  />
                </div>
              </template>
              
              <div class="text-center">
                <CButton
                  :title="showMore && item.id === showMoreId ? 'Lebih Sedikit' : 'Selengkapnya'"
                  :icon="showMore && item.id === showMoreId ? 'ic:baseline-keyboard-arrow-up' : 'ic:baseline-keyboard-arrow-down'"
                  class="!p-0 !rounded-full"
                  @click="showMoreInfo(item.id)"
                />
              </div>
            </div>
            <!-- mobile -->

            <div class="hidden lg:block space-y-3">
              <div class="flex flex-row gap-2 items-center">
                <h1 class="w-1/2 font-semibold">
                  Kode
                </h1>
                <h1>
                  :
                </h1>
                <div class="w-full flex flex-row gap-1 items-center">
                  <h1>
                    {{ item.code_ticket }}
                  </h1>
                  <CButton
                    :title="`Copy ${item.code_ticket}`"
                    icon-position="left"
                    icon="bi:clipboard"
                    size="small"
                    type="text"
                    @click="$copyToClipboard(item.code_ticket)"
                  />
                </div>
              </div>
              <div class="flex flex-row gap-2">
                <h1 class="w-1/2 font-semibold">
                  Tanggal Masuk
                </h1>
                <h1>
                  :
                </h1>
                <h1 class="w-full">
                  {{ item.transaction_date_format }}
                </h1>
              </div>
              <div class="flex flex-row gap-2">
                <h1 class="w-1/2 font-semibold">
                  Pemohon
                </h1>
                <h1>
                  :
                </h1>
                <h1 class="w-full">
                  {{ item?.user?.name || '-' }}
                  {{ item?.user?.email ? `(${item.user.email})` : '' }}
                </h1>
              </div>
              <div class="flex flex-row gap-2">
                <h1 class="w-1/2 font-semibold">
                  Subjek
                </h1>
                <h1>
                  :
                </h1>
                <h1 class="w-full">
                  {{ item.title }}
                </h1>
              </div>
              <div class="flex flex-row gap-2">
                <h1 class="w-1/2 font-semibold">
                  Status
                </h1>
                <h1>
                  :
                </h1>
                <div class="flex w-full gap-2">
                  <CLabelText
                    :text="item.status_ticket.name"
                    :text-color="$colorLabel(item.status_ticket.id).text"
                    :bg-color="$colorLabel(item.status_ticket.id).bg"
                    text-size="text-xs"
                    class="w-fit"
                  />

                  <CardRating
                    v-if="item.rating"
                    :rating="item.rating"
                  />
                </div>
              </div>
            </div>
          </template>
          <template #item-status="item">
            <div class="space-y-3 hidden lg:block">
              <div class="flex flex-row gap-2">
                <h1 class="w-1/2 font-semibold">
                  Layanan
                </h1>
                <h1>
                  :
                </h1>
                <h1 class="w-full">
                  {{ item.service.name }}
                </h1>
              </div>
              <div class="flex flex-row gap-2">
                <h1 class="w-1/2 font-semibold">
                  SLA Respon
                </h1>
                <h1>
                  :
                </h1>
                <div class="flex w-full">
                  <div v-if="item.is_response_agent && item.response_agent_date <= item.response_agent_limit_date">
                    <CLabelText
                      :title="item.response_agent_sla_format"
                      :text="item.response_agent_date ? $formatDate(item.response_agent_date, 'dd MMMM yyyy - HH:mm').replace('-', 'Pukul') : item.response_agent_sla_format"
                      bg-color="bg-success-100"
                      text-color="text-success-500"
                      text-size="text-xs"
                      class="w-fit"
                    />
                  </div>
                  <vue-countdown
                    v-else
                    :time="new Date(item.response_agent_limit_date) - new Date()"
                    v-slot="{ days, hours, minutes, seconds }"
                  >
                    <div
                      class="flex items-center text-center"
                      :title="days ? `${days} hari lagi` : hours ? `${hours} jam lagi` : minutes ? `${minutes} menit lagi` : seconds ? `${seconds} detik lagi` : 'Melewati SLA'"
                    >
                      <CLabelText
                        :text="item.response_agent_date ? $formatDate(item.response_agent_date, 'dd MMMM yyyy - HH:mm').replace('-', 'Pukul') : item.response_agent_sla_format"
                        :bg-color="days || hours || minutes ? 'bg-primary-100' : seconds ? 'bg-secondary-100' : 'bg-error-100'"
                        :text-color="days || hours || minutes ? 'text-primary-500' : seconds ? 'text-secondary-500' : 'text-error-500'"
                        text-size="text-xs"
                        class="w-fit"
                      />
                      <Icon v-if="!days && !hours && !minutes && !seconds" name="ph:warning-circle-fill" class="text-error-500 text-xl" />
                    </div>
                  </vue-countdown>
                </div>
              </div>
              <div class="flex flex-row gap-2">
                <h1 class="w-1/2 font-semibold">
                  Estimasi Penyelesaian Tiket
                </h1>
                <h1>
                  :
                </h1>
                <div class="flex w-full">
                  <div v-if="item.resolve_date <= item.resolve_limit_date">
                    <CLabelText
                      :title="item.resolve_sla_format"
                      :text="item.resolve_date ? $formatDate(item.resolve_date, 'dd MMMM yyyy - HH:mm').replace('-', 'Pukul') : item.resolve_sla_format"
                      bg-color="bg-success-100"
                      text-color="text-success-500"
                      text-size="text-xs"
                      class="w-fit"
                    />
                  </div>
                  <vue-countdown
                    v-else
                    :time="new Date(item.resolve_limit_date) - new Date()"
                    v-slot="{ days, hours, minutes, seconds }"
                  >
                    <div
                      class="flex items-center text-center"
                      :title="days ? `${days} hari lagi` : hours ? `${hours} jam lagi` : minutes ? `${minutes} menit lagi` : seconds ? `${seconds} detik lagi` : 'Melewati SLA'"
                    >
                      <CLabelText
                        :text="item.resolve_date ? $formatDate(item.resolve_date, 'dd MMMM yyyy - HH:mm').replace('-', 'Pukul') : item.resolve_sla_format"
                        :bg-color="days || hours || minutes ? 'bg-primary-100' : seconds ? 'bg-secondary-100' : 'bg-error-100'"
                        :text-color="days || hours || minutes ? 'text-primary-500' : seconds ? 'text-secondary-500' : 'text-error-500'"
                        text-size="text-xs"
                        class="w-fit"
                      />
                      <Icon v-if="!days && !hours && !minutes && !seconds" name="ph:warning-circle-fill" class="text-error-500 text-xl" />
                    </div>
                  </vue-countdown>
                </div>
              </div>
              <div class="flex flex-row gap-2">
                <h1 class="w-1/2 font-semibold">
                  Tingkat Dampak
                </h1>
                <h1>
                  :
                </h1>
                <div class="flex w-full">
                  <CLabelText
                    :text="item.impact_level.name"
                    :text-color="$colorLabel(item.impact_level.id).text"
                    :bg-color="$colorLabel(item.impact_level.id).bg"
                    text-size="text-xs"
                    class="w-fit"
                  />
                </div>
              </div>
            </div>
          </template>
          <template #item-action="items">
            <div class="operation-wrapper space-y-2">
              <CButton
                v-if="activeTab.id === 'myTicket' && !items.is_verified"
                title="Verifikasi"
                color="success"
                icon-position="left"
                icon="material-symbols:check-circle"
                text=""
                size="small"
                @click="
                  idTicket = items.id,
                  showMyTicket = true
                "
              />
              <CButton
                title="Lihat Detail"
                type="filled"
                color="primary"
                icon-position="left"
                icon="mdi:eye-outline"
                text=""
                size="small"
                @click="activeTab.id === 'myTicket' ?
                  $router.push('/ticket/'+items.id+'/my-ticket') :
                  $router.push('/ticket/'+items.id)
                "
              />
            </div>
          </template>
        </vue-table>
      </div>
    </div>
    <ModalForm :show="showModal" type="create" @close="emitModal" />
    <ModalInfo
      v-model="showMyTicket"
      info
      type="yesOrNo"
      title="Apakah yakin ini tiket Anda?"
      :disabled-button="loading"
      @close-info="accMyTicket(false)"
      @close-all="accMyTicket(true)"
    />
  </div>
</template>