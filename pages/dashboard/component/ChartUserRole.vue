<script setup>
import { DoughnutChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const { $api, $toast } = useNuxtApp()

const totalUserRole = ref(0)
const state = reactive({
  data: {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        '#2953A1',
        '#009376',
        '#FCB700',
        '#B01030',
        '#444444',
        '#7F98C7'
      ],
      hoverOffset: 4
    }]
  },
  options: {
    responsive: true,
    plugins: {
      datalabels: {
        color: '#E2E8F0',
        font: {
          weight: 'bold',
          size: 14
        }
      },
      legend: {
        position: 'bottom'
      },
      title: {
        display: false,
        text: 'Chart.js Doughnut Chart'
      }
    }
  },
  plugins: [{
    id: 'text',
    beforeDraw: function (chart) {
      const width = chart.width
      const height = chart.height
      const ctx = chart.ctx
      ctx.restore()

      const fontSizeTop = (height / 320).toFixed(2)
      ctx.font = fontSizeTop + 'em sans-serif'
      ctx.textBaseline = 'middle'

      const textTop = 'Total'
      const textXTop = Math.round((width - ctx.measureText(textTop).width) / 2)
      const textYTop = height / 2.5

      ctx.fillText(textTop, textXTop, textYTop)

      const fontSize = (height / 180).toFixed(2)
      ctx.font = fontSize + 'em sans-serif'
      ctx.textBaseline = 'middle'

      const text = totalUserRole.value
      const textX = Math.round((width - ctx.measureText(text).width) / 2)
      const textY = height / 2

      ctx.fillText(text, textX, textY)
      ctx.save()
    }
  }]
})

async function fetchUserRole () {
  const { data, error } = await $api.dashboard.getUserRole(null, null)

  if (data.value) {
    const datasets = data.value.data.datasets

    state.data.labels = data.value.data.labels
    // state.data.labels = data.value.data.labels.slice(0, 5).map((el, i) => {
    //   return `${el} (${datasets[i]})`
    // })
    state.data.datasets[0].data = datasets
    totalUserRole.value = datasets.reduce((partialSum, a) => partialSum + a, 0)
  }

  if (error.value) {
    $toast.error(error.value.data.message)
  }
}

onMounted(() => {
  fetchUserRole()
})

</script>
<template>
  <div>
    <div class="flex flex-col h-full px-8 py-4 space-y-2 bg-white rounded-lg shadow-md">
      <div>
        <h1 class="text-2xl font-bold">
          User Role
        </h1>
        <h4 class="text-gray-400">
          Perbandingan jumlah user di setiap role
        </h4>
      </div>
      <DoughnutChart
        :chart-data="state.data"
        :options="state.options"
        :plugins="state.plugins"
      />
    </div>
  </div>
</template>
