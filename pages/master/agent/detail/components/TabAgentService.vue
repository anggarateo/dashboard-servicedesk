<script lang="ts" setup>
import type { Header, Item, ServerOptions } from 'vue3-easy-data-table'

const { $api, $toast } = useNuxtApp()

const route = useRoute()

const headers: Header[] = [
  { text: 'Kategori', value: 'service_category.name' },
  { text: 'Layanan', value: 'service.name' },
  { text: 'Tahapan', value: 'flow_stage.name' }
]
const items = ref<Item[]>([])
const loading = ref(false)
const serverItemsLength: any = ref(0)
const serverOptions = ref<ServerOptions>({
  page: 1,
  rowsPerPage: 20
})

const fetchHistoryLayanan = async () => {
  loading.value = true
  const { data, error } = await $api.agent.getHistoryLayanan(null, {
    ...serverOptions.value,
    per_page: serverOptions.value.rowsPerPage,
    user_id: route.params.id
  })

  if (data.value) {
    loading.value = false
    items.value = data.value.data
    serverItemsLength.value = data.value.meta.total
  }

  if (error.value) {
    loading.value = false
    $toast.error(error.value.data.message)
  }
}

onMounted(() => {
  fetchHistoryLayanan()
})

watch(() => serverOptions.value, () => {
  fetchHistoryLayanan()
}, { deep: true })
</script>

<template>
  <div class="py-2">
    <vue-table
      v-model:server-options="serverOptions"
      table-class-name="template-table"
      :headers="headers"
      :items="items"
      :server-items-length="serverItemsLength"
      :loading="loading"
      :hide-rows-per-page="true"
      table-height="420"
      show-index
    >
      <template #empty-message>
        <EmptyState content="Agent" :code-menu="''" />
      </template>
    </vue-table>
  </div>
</template>
