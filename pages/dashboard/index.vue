<template>
  <div class="w-full p-4">
    <div v-if="$checkPermission('dashboard', 'total-header')" class="flex flex-col md:flex-row gap-4">
      <div class="flex w-full md:w-4/12 h-full bg-white rounded-lg shadow ">
        <div class="items-center justify-center gap-4 m-4 rounded-full w-14 h-14 bg-stroke" style=" display: inline-flex">
          <div class="flex items-center justify-center w-full h-full ">
            <div style="width: 44px; height: 44px; position: relative">
              <Icon name="mingcute:ticket-fill" color="#193261" size="44" />
            </div>
          </div>
        </div>
        <div class="items-center justify-center gap-4 " style=" display: inline-flex">
          <div class="flex flex-col justify-center w-full h-full ">
            <div class="font-bold ">
              {{ dataTotalHeader && dataTotalHeader.total_ticket_open }}
            </div>
            <span class=" text-neutral-400">Tiket open</span>
          </div>
        </div>
      </div>
      <div class="flex w-full md:w-4/12 h-full bg-white rounded-lg shadow ">
        <div class="items-center justify-center gap-4 m-4 rounded-full w-14 h-14 bg-stroke" style=" display: inline-flex">
          <div class="flex items-center justify-center w-full h-full ">
            <div style="width: 44px; height: 44px; position: relative">
              <Icon name="streamline:interface-calendar-remove-calendar-date-day-delete-month-remove-subtract" color="#193261" size="44" />
            </div>
          </div>
        </div>
        <div class="items-center justify-center gap-4 " style=" display: inline-flex">
          <div class="flex flex-col justify-center w-full h-full ">
            <div class="font-bold ">
              {{ dataTotalHeader && dataTotalHeader.total_ticket_in_month }}
            </div>
            <span class=" text-neutral-400">Tiket bulan ini</span>
          </div>
        </div>
      </div>
      <div class="flex w-full md:w-4/12 h-full bg-white rounded-lg shadow ">
        <div class="items-center justify-center gap-4 m-4 rounded-full w-14 h-14 bg-stroke" style=" display: inline-flex">
          <div class="flex items-center justify-center w-full h-full ">
            <div style="width: 44px; height: 44px; position: relative">
              <Icon name="tdesign:earphone" color="#193261" size="44" />
            </div>
          </div>
        </div>
        <div class="items-center justify-center gap-4 " style=" display: inline-flex">
          <div class="flex flex-col justify-center w-full h-full ">
            <div class="font-bold ">
              {{ dataTotalHeader && dataTotalHeader.total_service }}
            </div>
            <span class=" text-neutral-400">Jumlah Layanan</span>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col py-4 space-y-4">
      <div v-if="$checkPermission('dashboard', 'todolist') || $checkPermission('dashboard', 'performance')" class="flex flex-col md:flex-row gap-4">
        <TicketTodolist v-if="$checkPermission('dashboard', 'todolist')" class="w-full md:w-2/5" />
        <ChartServicePerform v-if="$checkPermission('dashboard', 'service-perform')" class="w-full md:w-3/5" />
      </div>
      <ChartKinerjaServiceDesk v-if="$checkPermission('dashboard', 'performance')" />
      <ManageService v-if="$checkPermission('dashboard', 'manage-service')" />
      <div class="flex flex-col md:flex-row gap-4">
        <div class="w-full md:w-2/3 space-y-4">
          <ChartServicePerform v-if="$checkPermission('dashboard', 'service-perform')" />
          <div v-if="$checkPermission('dashboard', 'nearest-sla') || $checkPermission('dashboard', 'leaderboard-service')" class="flex flex-col sm:flex-row gap-4">
            <NearestSla v-if="$checkPermission('dashboard', 'nearest-sla')" class="w-full sm:w-1/2" />
            <LeaderboardService v-if="$checkPermission('dashboard', 'leaderboard-service')" class="w-full sm:w-1/2" />
          </div>
          <ChartLamaTiketDitangani v-if="$checkPermission('dashboard', 'average-handled')" />
          <ChartAverageTicketRating v-if="$checkPermission('dashboard', 'average-rating')" />
          <LeaderboardAgent v-if="$checkPermission('dashboard', 'leaderboard-agent')" />
        </div>
        <div class="w-full md:w-1/3 space-y-4">
          <TicketStatistic v-if="$checkPermission('dashboard', 'statistic')" />
          <SlaPerform v-if="$checkPermission('dashboard', 'sla-performance')" />
          <ChartUserRole v-if="$checkPermission('dashboard', 'user-role')" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Header, Item } from 'vue3-easy-data-table'
import ChartLamaTiketDitangani from './component/ChartLamaTiketDitangani.vue'
import ChartUserRole from './component/ChartUserRole.vue'
import ManageService from '~/pages/dashboard/component/ManageService.vue'
import LeaderboardService from '~/pages/dashboard/component/LeaderboardService.vue'
import ChartKinerjaServiceDesk from './component/ChartKinerjaServiceDesk.vue'
import ChartAverageTicketRating from './component/ChartAverageTicketRating.vue'
import LeaderboardAgent from '~/pages/dashboard/component/LeaderboardAgent.vue'
import NearestSla from '~/pages/dashboard/component/NearestSla.vue'
import TicketStatistic from '~/pages/dashboard/component/TicketStatistic.vue'
import TicketTodolist from '~/pages/dashboard/component/TicketTodolist.vue'
import ChartServicePerform from '~/pages/dashboard/component/ChartPerfoma.vue'
import SlaPerform from '~/pages/dashboard/component/SlaPerform.vue'

useHead({
  title: 'Dashboard'
})

const { $api, $toast, $config, $checkPermission } = useNuxtApp()

const headers: Header[] = [
  { text: 'NO', value: 'no' },
  { text: 'KODE KATEGORI', value: 'code' },
  { text: 'NAMA KATEGORI', value: 'name' },
  { text: 'DESKRIPSI', value: 'description' },
  { text: 'AKSI', value: 'action', width: 100 }
]

const items: Item[] = [{
  no: 1,
  code: '123',
  name: 'bahrul',
  description: 'coba'
}]

const dataTotalHeader: any = ref(null)

async function fetchTotalHeader () {
  const { data, error } = await $api.dashboard.getTotalHeader(null, null)

  if (data.value) {
    dataTotalHeader.value = data.value.data
  }

  if (error.value) {
    $toast.error(error.value.data.message)
  }
}

async function getCurrentAction () {
  const { data: { value: localAuth } } = await useFetch('/fakeapi/token')
  const user = JSON.parse(localAuth || '')

  const {
    data,
    error
  } = await $api.role.get.getRoleUser(user.token)

  if (data.value) {
    const localRole = JSON.parse(localStorage.getItem('permissions') || '')
    const permissions = {
      roles: localRole?.roles,
      menus: data.value.data
    }
    localStorage.setItem('permissions', JSON.stringify(permissions))
  }

  if (error.value) {
    $toast.error(error.value.data.message)
  }
}

onMounted(() => {
  if ($checkPermission('dashboard', 'total-header')) fetchTotalHeader()

  if (!$config.public.roleFromFirebase || $config.public.roleFromFirebase === 'false') {
    getCurrentAction()
  }
})
</script>
