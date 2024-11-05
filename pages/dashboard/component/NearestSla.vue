<script lang="ts" setup>
const { $api, $toast } = useNuxtApp()
const slas = ref(Array())

async function getData () {
  const {
    data,
    error
  } = await $api.dashboard.getNearestSla()
  if (data.value) slas.value = data.value.data
  if (error.value) $toast.error(error.value.data.message)
}
getData()
</script>
<template>
  <div class="p-7 pt-0 space-y-8 bg-white rounded-lg max-h-96 overflow-auto">
    <h1 class="text-xl font-semibold sticky top-0 pt-7 bg-white">
      SLA Terdekat
    </h1>
    <div
      v-for="(sla) in slas"
      :key="sla.id"
      class="space-y-2 text-xs"
    >
      <h1 class="text-secondary-text">
        {{ sla.date_format }}
      </h1>
      <div class="flex flex-row gap-2 items-start">
        <h1>
          {{ sla.time_format }}
        </h1>
        <div class="pl-2 border-l-4 border-secondary-500 flex flex-row justify-between items-center w-full">
          <div>
            <h1>
              {{ sla.code_ticket }}
            </h1>
            <h1
              v-for="(service) in sla.services"
              :key="service.id"
              class="text-secondary-text"
            >
              {{ service.name }}
            </h1>
          </div>
          <CButton
            text="Detail"
            type="outlined"
            rounded
            @click="$router.push(`/ticket/${sla.id}`)"
          />
        </div>
      </div>
    </div>
  </div>
</template>