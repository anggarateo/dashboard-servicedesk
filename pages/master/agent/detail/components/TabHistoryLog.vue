<script setup>
import localId from 'date-fns/locale/id'

const { $api, $toast } = useNuxtApp()
const route = useRoute()

const loading = ref(false)

const logData = ref([])
const logTotalData = ref(0)
const page = ref(0)

const fetchHistoryLayanan = async () => {
  loading.value = true
  const { data, error } = await $api.agent.getHistoryPerubahan(route.params.id, null, { page: page.value })

  if (data.value) {
    loading.value = false
    if (data.value.data) {
      logData.value.push(...data.value.data.log_detail.result)
      logTotalData.value = data.value.data.log_detail.total_count
    }
  }

  if (error.value) {
    loading.value = false
    $toast.error(error.value.data.message)
  }
}

function showMore () {
  page.value++
  fetchHistoryLayanan()
}

onMounted(() => {
  fetchHistoryLayanan()
})
</script>

<template>
  <ul class="flex flex-col gap-2">
    <li v-for="(log, index) in logData" :key="index" class="flex flex-row items-baseline gap-6 py-2">
      <p class=" text-neutral-500">
        {{ log.log_date }}
      </p>
      <div class="grow">
        <p class="text-neutral-500">
          <span class="font-bold text-gray-800">{{ log.description }}</span> dari {{ log.log_json.desc.from[0].name }} ke {{ log.log_json.desc.to[0].name }}
        </p>
        <p class="text-sm text-neutral-500">
          Oleh <span class="capitalize text-primary-400">{{ log.log_json.user }}</span>
        </p>
      </div>
      <p class="text-neutral-500">
        {{ $distanceDate(log.log_date, new Date(), { addSuffix: true, locale: localId }) }}
      </p>
    </li>
    <div v-if="logData.length < logTotalData" class="flex items-center justify-center">
      <div
        title="Tampilkan lebih banyak"
        class="text-2xl border rounded-full cursor-pointer text-primary-500 border-stroke hover:bg-primary-100"
        @click="showMore()"
      >
        <Icon name="mingcute:arrows-down-fill" />
      </div>
    </div>
    <div v-if="!logData?.length" class="py-4">
      <EmptyState content="History perubahan" />
    </div>
  </ul>
</template>
