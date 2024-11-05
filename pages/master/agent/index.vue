<script lang='ts' setup>
import { Icon } from '@iconify/vue'
import type { Header, Item, ServerOptions } from 'vue3-easy-data-table'

definePageMeta({
  alias: '/agent' // sesuai dari api/role-menu
})

const { $api, $checkPermission, $localUser, $toast } = useNuxtApp()

const showFilter = ref(false)
const headers: Header[] = [
  { text: 'Nama Agent', value: 'fullname' },
  { text: 'Email', value: 'email' },
  { text: 'Role', value: 'roles' },
  { text: 'Unit Kerja', value: 'units_of_work.name' },
  { text: 'Jabatan', value: 'position.name' },
  { text: 'Aksi', value: 'action' }
]
const items = ref<Item[]>([])
const loading = ref(false)
const serverItemsLength: any = ref(0)
const serverOptions = ref<ServerOptions>({
  page: 1,
  rowsPerPage: 20
})

const debounce: any = ref(null)
const searchQuery = ref('')

const roles: any = ref([])
const unitOfWorks: any = ref([])
const positions: any = ref([])

const fetchAgent = async () => {
  try {
    loading.value = true

    const byUnit = $checkPermission('agent', 'view') ? { units_of_work_id: $localUser().units_of_work_id } : {}

    const { data } = await $api.agent.getAgent(null, { ...serverOptions.value, q: searchQuery.value, ...byUnit })

    items.value = data.value?.data ?? []
    serverItemsLength.value = data.value?.meta?.total
    loading.value = false
  } catch (e) {
    $toast.error(e.value.data.message)
  }
}

// initial load
fetchAgent()

function handleSearch (e: any) {
  clearTimeout(debounce.value)
  debounce.value = setTimeout(() => {
    searchQuery.value = e.target.value
    fetchAgent()
  }, 600)
}

watch(serverOptions, () => { fetchAgent() }, { deep: true })

async function fetchAgentRole () {
  const { data, error } = await $api.agent.getAgentRole(null, null)

  if (data.value) {
    roles.value = data.value.data.map((val: any) => ({
      ...val,
      is_selected: false
    }))
  }

  if (error.value) {
    useNuxtApp().$toast.error('Error!!!')
  }
}

async function fetchAgentUnitOfWork () {
  const { data, error } = await $api.agent.getAgentUnitOfWork(null, null)

  if (data.value) {
    unitOfWorks.value = data.value.data.map((val: any) => ({
      ...val,
      is_selected: false
    }))
  }

  if (error.value) {
    useNuxtApp().$toast.error('Error!!!')
  }
}

async function fetchPosition () {
  const { data, error } = await $api.agent.getAgentPosition(null, null)

  if (data.value) {
    positions.value = data.value.data.map((val: any) => ({
      ...val,
      is_selected: false
    }))
  }

  if (error.value) {
    useNuxtApp().$toast.error('Error!!!')
  }
}

async function resetAllFilter () {
  await roles.value.forEach((el: any) => {
    el.is_selected = false
  })
  await unitOfWorks.value.forEach((el: any) => {
    el.is_selected = false
  })
  await positions.value.forEach((el: any) => {
    el.is_selected = false
  })

  fetchAgent()
}

onMounted(() => {
  fetchAgentRole()
  fetchAgentUnitOfWork()
  fetchPosition()
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
            Master Agent
          </h1>
          <h2 class="text-neutral">
            Daftar agent di B-CARE
          </h2>
        </div>
        <div class="flex flex-row items-center gap-2 justify-end">
          <ReInputText placeholder="Masukan nama agent" :require="false" icon="left" @keyup="handleSearch">
            <template #icon>
              <Icon
                icon="heroicons:magnifying-glass-20-solid"
                width="24"
              />
            </template>
          </ReInputText>
          <div v-show="false" class="relative">
            <CButton
              type="outlined"
              icon="octicon:filter-16"
              icon-position="left"
              @click="showFilter = !showFilter"
            />
            <div v-show="showFilter" class="w-[28rem] bg-white shadow-md rounded-b-lg border absolute top-16 right-0 z-50">
              <!-- Header -->
              <div class="flex flex-row justify-between shadow-md py-3 px-4">
                <h1 class="text-xl font-bold">
                  Filter
                </h1>
                <CButton
                  text="Reset"
                  type="text"
                  size="small"
                  icon=""
                  class="!px-0 py-1"
                  @click="resetAllFilter"
                />
              </div>
              <!-- Content -->
              <div class="p-4 overflow-y-auto h-[26rem]">
                <div class="mb-4">
                  <h1 class="font-bold text-neutral-500 text-sm mb-2">
                    Role
                  </h1>
                  <ul class="flex flex-row flex-wrap gap-2">
                    <li v-for="(role, i) in roles" :key="i">
                      <CButton
                        type="outlined"
                        :text="role.name"
                        size="small"
                        :icon="role.is_selected ? 'ion:checkmark-outline' : ''"
                        :icon-position="'right'"
                        @click="role.is_selected = !role.is_selected"
                      />
                    </li>
                  </ul>
                </div>
                <div class="mb-4">
                  <h1 class="font-bold text-neutral-500 text-sm mb-2">
                    Unit Kerja
                  </h1>
                  <ul class="flex flex-row flex-wrap gap-2">
                    <li v-for="(unit, i) in unitOfWorks" :key="i">
                      <CButton
                        type="outlined"
                        :text="unit.name"
                        size="small"
                        :icon="unit.is_selected ? 'ion:checkmark-outline' : ''"
                        :icon-position="'right'"
                        @click="unit.is_selected = !unit.is_selected"
                      />
                    </li>
                  </ul>
                </div>
                <div class="mb-4">
                  <h1 class="font-bold text-neutral-500 text-sm mb-2">
                    Posisi
                  </h1>
                  <ul class="flex flex-row flex-wrap gap-2">
                    <li v-for="(position, i) in positions" :key="i">
                      <CButton
                        type="outlined"
                        :text="position.name"
                        size="small"
                        :icon="position.is_selected ? 'ion:checkmark-outline' : ''"
                        :icon-position="'right'"
                        @click="position.is_selected = !position.is_selected"
                      />
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
        class="lg:max-w-full"
      >
        <template #empty-message>
          <EmptyState content="Agent" :code-menu="''" />
        </template>
        <template #item-roles="item">
          <div v-if="item.roles.length == 0">
            -
          </div>
          <div v-else>
            <p v-for="(v, i) in item.roles" :key="i">
              {{ v.name }}<span v-if="i < item.roles.length - 1">, </span>
            </p>
          </div>
        </template>
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item-units_of_work.name="item">
          {{ item && item.units_of_work && item.units_of_work.name ? item.units_of_work.name : '-' }}
        </template>
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item-position.name="item">
          {{ item && item.position && item.position.name ? item.position.name : '-' }}
        </template>
        <template #item-action="item">
          <div class="operation-wrapper">
            <NuxtLink :to="'/master/agent/detail/' + item.id">
              <CButton
                class="!p-2"
                icon="solar:pen-bold"
                icon-position="left"
                size="small"
              />
            </NuxtLink>
          </div>
        </template>
      </vue-table>
    </div>
  </div>
</template>
