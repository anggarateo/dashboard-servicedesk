<script lang='ts' setup>

import { Icon } from '@iconify/vue'
import type { Header, Item, ServerOptions } from 'vue3-easy-data-table'

definePageMeta({
  alias: '/pengadu' // sesuai dari api/role-menu
})

const { $api } = useNuxtApp()

const headers: Header[] = [
  { text: 'Nama', value: 'fullname' },
  { text: 'Email', value: 'email' },
  { text: 'Role', value: 'role' }
]
const items = ref<Item[]>([])
const loading = ref(false)
const serverItemsLength: any = ref(0)
const serverOptions = ref<ServerOptions>({
  page: 1,
  rowsPerPage: 20
})
const search = ref()

const fetchUser = async () => {
  try {
    loading.value = true

    const { data } = await $api.user.getUser(null, {
      per_page: serverOptions.value.rowsPerPage,
      page: serverOptions.value.page,
      q: search.value
    })

    if (data.value) {
      items.value = data.value.data
      serverItemsLength.value = data.value.meta.total
      loading.value = false
    }
  } catch (e) {
    loading.value = false
  }
}

// initial load
// fetchUser()
onMounted(() => {
  fetchUser()
})

watch(serverOptions, () => { fetchUser() }, { deep: true })
watch(() => search.value, () => {
  let timer: any
  timer = setTimeout(() => {
    clearTimeout(timer)
    fetchUser()
  }, 1000)
})

</script>

<template>
  <div class="p-4">
    <!-- Cards -->
    <div class="shadow-md bg-white h-auto rounded-xl p-4">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:justify-between mb-4">
        <div>
          <h1 class="text-2xl font-bold">
            Daftar Pemohon
          </h1>
        </div>
        <div class="flex flex-row items-center gap-2 justify-end">
          <ReInputText
            v-model="search"
            placeholder="Masukan nama user"
            :require="false"
            icon="left"
          >
            <template #icon>
              <Icon
                icon="heroicons:magnifying-glass-20-solid"
                width="24"
              />
            </template>
          </ReInputText>
        </div>
      </div>

      <vue-table
        v-model:server-options="serverOptions"
        table-class-name="template-table"
        table-height="420"
        :headers="headers"
        :items="items"
        :server-items-length="serverItemsLength"
        :loading="loading"
        :hide-rows-per-page="true"
        buttons-pagination
        show-index
      >
        <template #empty-message>
          <EmptyState content="User" code-menu="user" />
        </template>
        <template #item-role>
          <CLabelText
            :text="'Pemohon'"
            text-size="text-xs"
            bg-color="bg-primary-100"
            text-color="text-primary-500"
          />
        </template>
      </vue-table>
    </div>
  </div>
</template>
