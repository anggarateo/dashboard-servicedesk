<script lang="ts" setup>
import { DoughnutChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const totalTickets = ref(0)
const state = reactive({
  data: {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        '#F8CD4D',
        '#00B894',
        '#2953A1'
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
        display: false
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

      const text = totalTickets.value
      const textX = Math.round((width - ctx.measureText(text).width) / 2)
      const textY = height / 2

      ctx.fillText(text, textX, textY)
      ctx.save()
    }
  }]
})
const { $api, $toast } = useNuxtApp()

async function getData () {
  const {
    data,
    error
  } = await $api.dashboard.getTicketStatistic()
  if (data.value) {
    state.data.labels = data.value.data.labels
    state.data.datasets[0].data = data.value.data.datasets
    totalTickets.value = data.value.data.datasets.reduce((partialSum, a) => partialSum + a, 0)
  }
  if (error.value) $toast.error(error.value.data.message)
}
getData()
</script>
<template>
  <div class="p-7 space-y-8 bg-white rounded-lg">
    <h1 class="text-xl font-semibold">
      Statistik Tiket
    </h1>
    <DoughnutChart
      :chart-data="state.data"
      :options="state.options"
      :plugins="state.plugins"
    />
  </div>
</template>