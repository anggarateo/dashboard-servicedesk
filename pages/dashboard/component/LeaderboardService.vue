<script lang="ts" setup>
const { $api, $toast } = useNuxtApp()
const topThree = ref(Array())
const maxRate = ref(0)

async function getData () {
  const {
    data,
    error
  } = await $api.dashboard.getLeaderboardService()
  if (data.value) {
    topThree.value = data.value.data.items
    maxRate.value = data.value.data.max_rating
  }
  if (error.value) $toast.error(error.value.data.message)
}
getData()
</script>
<template>
  <div class="p-6 space-y-4 bg-white rounded-lg">
    <div>
      <div class="flex justify-center">
        <img src="@/assets/img/leadboard.png" alt="Leaderboard">
      </div>
      <h1 class="text-lg font-semibold">
        Leaderboard Service
      </h1>
      <h1 class="text-xs text-neutral-400">
        Layanan dengan tingkat kepuasan pelanggan terbaik
      </h1>
    </div>
    <div v-if="topThree.length" class="space-y-6 text-sm">
      <div class="flex flex-row gap-2 items-center">
        <img src="@/assets/img/rank1.png" alt="Rank 1">
        <h1 class="w-full">
          {{ topThree[0].service.name }}
        </h1>
        <h1>
          <span class="text-base font-bold">{{ Math.round(topThree[0].rating) }}</span>/<span class="text-xs">{{ maxRate }}</span>
        </h1>
      </div>
      <div class="flex flex-row gap-2 items-center">
        <img src="@/assets/img/rank2.png" alt="Rank 2">
        <h1 class="w-full">
          {{ topThree[1].service.name }}
        </h1>
        <h1>
          <span class="text-base font-bold">{{ Math.round(topThree[1].rating) }}</span>/<span class="text-xs">{{ maxRate }}</span>
        </h1>
      </div>
      <div class="flex flex-row gap-2 items-center">
        <img src="@/assets/img/rank3.png" alt="Rank 3">
        <h1 class="w-full">
          {{ topThree[2].service.name }}
        </h1>
        <h1>
          <span class="text-base font-bold">{{ Math.round(topThree[2].rating) }}</span>/<span class="text-xs">{{ maxRate }}</span>
        </h1>
      </div>
    </div>
  </div>
</template>