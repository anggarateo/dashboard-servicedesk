<script setup>
import { BarChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

Chart.register(ChartDataLabels, ...registerables)

const { $api, $toast } = useNuxtApp()

const state = reactive({
  data: {
    labels: [],
    datasets: [
      {
        label: 'Selesai',
        data: [],
        backgroundColor: '#2953A1'
      },
      {
        label: 'Aktif',
        data: [],
        backgroundColor: '#6DB9EF'
      }
    ]
  },
  options: {
    responsive: true,
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
          drawBorder: false
        }
      },
      y: {
        stacked: true,
        grid: {
          display: false,
          drawBorder: false
        }
      }
    },
    plugins: {
      datalabels: {
        color: '#ffffff',
        font: {
          weight: 'bold'
        },
        formatter: function (value) {
          return value === 0 ? '' : value
        }
      },
      legend: {
        display: true,
        position: 'bottom',
        align: 'start'
      }
    }
  }
})
const service = ref()
const param = ref({
  service_id: ''
})

async function fetchData () {
  const { data, error } = await $api.dashboard.getServicePerform(param.value)

  if (data.value) {
    state.data.labels = data.value.data.labels
    state.data.datasets[0].data = data.value.data.tiket_done
    state.data.datasets[1].data = data.value.data.tiket_active
  }

  if (error.value) {
    $toast.error(error.value.data.message)
  }
}

onMounted(() => {
  fetchData()
})

watch(() => service.value, (val) => {
  if (val) {
    const result = val.split(',')
    param.value.service_id = result[0]
    fetchData()
  } else {
    param.value.service_id = ''
  }
})
</script>
<template>
  <div>
    <div class="flex flex-col justify-between h-full px-8 py-4 bg-white rounded-lg shadow-md">
      <div class="flex flex-col md:flex-row md:items-center mb-4">
        <div class="w-4/5">
          <h1 class="text-2xl font-bold">
            Performa
          </h1>
          <h4 class="text-gray-400">
            Perbandingan jumlah tiket aktif dan tiket selesai ditangani
          </h4>
        </div>
        <DropdownPagination
          v-model="service"
          api-module="ticket"
          api-method="getServices"
          option-label="name"
          :option-value="['id', 'service_category', 'id']"
          option-custom
          :required="false"
          placeholder="Pilih layanan"
          class="w-full md:max-w-sm"
          clearable
        />
      </div>
      <BarChart :chart-data="state.data" :options="state.options" :height="300" />
    </div>
  </div>
</template>
