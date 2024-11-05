<script lang="ts" setup>
import { DoughnutChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const totalSla = ref(0)
const state = reactive({
  data: {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        '#2953A1',
        '#C01048'
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

      const text = totalSla.value
      const textX = Math.round((width - ctx.measureText(text).width) / 2)
      const textY = height / 2

      ctx.fillText(text, textX, textY)
      ctx.save()
    }
  }]
})
const { $api, $toast } = useNuxtApp()
const sla = ref({
  'group': null,
  'response': null,
  'resolve': null
})
const tabs = ref([
  { id: 'response', name: 'Respon' },
  { id: 'resolve', name: 'Resolve' },
  { id: 'group', name: 'Gabungan' }
])
const activeTab = ref('group')

async function getData () {
  const {
    data,
    error
  } = await $api.dashboard.getSlaPerform()
  if (data.value) {
    sla.value.group = data.value.data.group
    sla.value.response = data.value.data.response_ticket
    sla.value.resolve = data.value.data.resolve_ticket
  }
  if (error.value) $toast.error(error.value.data.message)
}
onMounted(async ()  => {
  await getData()
  chart(activeTab.value)
})
watch(() => activeTab.value, (val) => {
  if (val) {
    chart(val)
  }
})
function chart (val: any) {
  state.data.labels = sla.value[val].labels
  state.data.datasets[0].data = sla.value[val].datasets
  totalSla.value = sla.value[val].datasets.reduce((partialSum, a) => partialSum + a, 0)
}
</script>
<template>
  <div class="p-7 space-y-4 bg-white rounded-lg">
    <div>
      <h1 class="text-xl font-semibold">
        Performa SLA
      </h1>
      <h1 class="text-xs text-neutral-400">
        Perbandingan jumlah tiket yang memenuhi dan melewati SLA
      </h1>
    </div>
    <Tab
      :tabs="tabs"
      :active-tab="activeTab"
      @switch-tab="activeTab = $event.id"
    />
    <DoughnutChart
      :chart-data="state.data"
      :options="state.options"
      :plugins="state.plugins"
    />
  </div>
</template>