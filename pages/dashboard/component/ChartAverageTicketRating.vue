<script setup>
import { BarChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

Chart.register(ChartDataLabels, ...registerables)

const { $api, $toast } = useNuxtApp()

const totalAverageTicketHandled = ref(0)
const categoryService = ref()

const params = ref({
  service_id: ''
})

const state = reactive({
  data: {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: '#2953A1',
        datalabels: {
          align: 'top',
          anchor: 'end',
          formatter: function (value) {
            return value
          }
        }
      }
    ]
  },
  options: {
    responsive: true,
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false
        }
      },
      y: {
        grid: {
          display: false,
          drawBorder: false
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      datalabels: {
        color: '#ffffff',
        font: {
          weight: 'bold'
        },
        formatter: function (value) {
          return value === 0 ? '' : value
        }
      }
    }
  }
})

async function fetchAverageTicket () {
  const { data, error } = await $api.dashboard.getAverageTicketRating(null, params.value.service_id ? { service_id: params.value.service_id } : '')

  if (data.value) {
    const datasets = data.value.data.datasets

    state.data.labels = data.value.data.labels
    state.data.datasets[0].data = datasets
    totalAverageTicketHandled.value = data.value.data.total_average
  }

  if (error.value) {
    $toast.error(error.value.data.message)
  }
}

watch(() => categoryService.value, (val) => {
  if (val) {
    const result = val.split(',')
    params.value.service_id = result[0]
  } else {
    params.value.service_id = ''
  }
  fetchAverageTicket()
})

onMounted(() => {
  fetchAverageTicket()
})
</script>
<template>
  <div>
    <div class="flex flex-col justify-between h-full px-8 py-4 space-y-4 bg-white rounded-lg shadow-md">
      <div>
        <h1 class="text-2xl font-bold">
          Rata-rata Kepuasan Pelanggan
        </h1>
        <h4 class="text-gray-400">
          Informasi rata-rata  kepuasan pelanggan
        </h4>
      </div>
      <DropdownPagination
        v-model="categoryService"
        api-module="ticket"
        api-method="getServices"
        option-label="name"
        :option-value="['id', 'service_category', 'id']"
        option-custom
        :required="false"
        placeholder="Pilih layanan"
        class="w-full"
        :clearable="true"
      />
      <BarChart :chart-data="state.data" :options="state.options" :height="200" />
      <div class="text-center">
        <h1 v-if="totalAverageTicketHandled === 0" class="text-2xl font-bold">
          Belum ada tiket yang di Rating.
        </h1>
        <h1 v-else class="inline-flex items-center text-2xl font-bold">
          <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 0L12.645 6.35942L19.5106 6.90983L14.2798 11.3906L15.8779 18.0902L10 14.5L4.12215 18.0902L5.72025 11.3906L0.489435 6.90983L7.35497 6.35942L10 0Z" fill="#FCB700"/>
          </svg>
          {{ totalAverageTicketHandled || 0 }}
          / 5
        </h1>

        <h4 class="text-gray-400">
          Rata-rata Keseluruhan
        </h4>
      </div>
    </div>
  </div>
</template>
