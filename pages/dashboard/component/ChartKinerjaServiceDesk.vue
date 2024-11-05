<script setup>
import { BarChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

Chart.register(ChartDataLabels, ...registerables)

const { $api, $toast } = useNuxtApp()

const year = ref(null)

const state = reactive({
  data: {
    labels: [],
    datasets: [
      {
        label: 'Tiket',
        data: [],
        backgroundColor: '#2953A1'
      },
      {
        label: 'Pemohon',
        data: [],
        backgroundColor: '#6DB9EF'
      },
      {
        label: 'Agent',
        data: [],
        backgroundColor: '#A9BAD9'
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

async function fetchAverageTicket (year) {
  const { data, error } = await $api.dashboard.getPerfomance(null, { year })

  if (data.value) {
    state.data.labels = data.value.data.labels
    state.data.datasets[0].data = data.value.data.tiket
    state.data.datasets[1].data = data.value.data.pengadu
    state.data.datasets[2].data = data.value.data.agent
    // totalAverageTicketHandled.value = data.value.data.total_average
    // unit.value = data.value.data.satuan
  }

  if (error.value) {
    $toast.error(error.value.data.message)
  }
}

watch(year, (val) => {
  fetchAverageTicket(val)
})

onMounted(() => {
  fetchAverageTicket()
})
</script>
<template>
  <div>
    <div class="flex flex-col justify-between h-full px-8 py-4 bg-white rounded-lg shadow-md">
      <div class="flex flex-col sm:flex-row sm:items-center mb-4">
        <div class="w-3/4">
          <h1 class="text-2xl font-bold">
            Kinerja Service Desk
          </h1>
          <h4 class="text-gray-400">
            Perkembangan dari tiket, pemohon, dan agent
          </h4>
        </div>
        <DatePicker v-model="year" :preset-range="false" year-picker placeholder="Pilih Tahun" class="!w-1/3" />
      </div>
      <BarChart :chart-data="state.data" :options="state.options" :height="300" />
    </div>
  </div>
</template>
