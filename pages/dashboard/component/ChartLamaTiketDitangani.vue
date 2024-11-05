<script setup>
import { BarChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

Chart.register(ChartDataLabels, ...registerables)

const { $api, $toast } = useNuxtApp()

const totalAverageTicketHandled = ref(0)
const unit = ref('')
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
            return value === 0 ? '' : value + ' ' + unit.value
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
  const { data, error } = await $api.dashboard.getAverageTicketHandle(null, params.value.service_id ? { service_id: params.value.service_id } : '')

  if (data.value) {
    const datasets = data.value.data.datasets

    state.data.labels = data.value.data.labels
    state.data.datasets[0].data = datasets
    totalAverageTicketHandled.value = data.value.data.total_average
    unit.value = data.value.data.satuan
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
          Rata-rata Lama Tiket Ditangani
        </h1>
        <h4 class="text-gray-400">
          Informasi rata-rata lama tiket ditangani
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
          Belum ada tiket yang selesai.
        </h1>
        <h1 v-else class="text-2xl font-bold">
          {{ totalAverageTicketHandled || 0 }} {{ unit }} / Tiket
        </h1>

        <h4 class="text-gray-400">
          Rata-rata Keseluruhan
        </h4>
      </div>
    </div>
  </div>
</template>
