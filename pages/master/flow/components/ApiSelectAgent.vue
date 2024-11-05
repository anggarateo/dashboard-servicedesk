<script setup>
const { $api, $checkPermission, $localUser, $toast } = useNuxtApp()

const state = reactive({
  data: [],
  dataAgentService: [],
  configOptions: {
    observer: null,
    page: 1,
    total: 0,
    search: ''
  }
})
const selectRef = ref(null)
const searchAgent = ref('')

const optionsHasNextPage = computed(() => {
  if (!state.data.length) {
    return true
  }
  return state.data.length < state.configOptions.total
})

async function selectOpen () {
  if (optionsHasNextPage.value) {
    await getData()
    state.configOptions.observer.observe(selectRef.value)
  }
}

function selectClose () {
  state.configOptions.observer.disconnect()
}

async function infiniteScroll ([{ isIntersecting, target }]) {
  if (isIntersecting) {
    const ul = target.offsetParent
    const scrollTop = target.offsetParent.scrollTop
    state.configOptions.page += 1
    await getData()
    ul.scrollTop = scrollTop
  }
}

async function getData () {
  const byUnit = $checkPermission('alur', 'view') ? { units_of_work_id: $localUser().units_of_work_id } : {}

  const { data, error } = await $api.flow.getAgent(null, {
    page: state.configOptions.page,
    q: searchAgent.value,
    per_page: 1000,
    ...byUnit
  })

  if (data.value) {
    state.configOptions.total = data.value.meta.total
    state.data = data.value.data
  }

  if (error.value) {
    $toast.error(error.value.data.message)
  }
}

onMounted(() => {
  state.configOptions.observer = new IntersectionObserver(infiniteScroll)
})

watch(() => searchAgent.value, () => {
  state.configOptions.page = 1
  getData()
})
</script>

<template>
  <v-select
    multiple
    label="fullname"
    :options="state.data"
    class="select-custom"
    @open="selectOpen"
    @close="selectClose"
    @search="query => searchAgent = query"
  >
    <template #option="option">
      <div class="flex flex-row items-center justify-between">
        <div class="flex flex-col">
          <div class="inline-flex items-center space-x-2">
            <span class="font-bold">{{ option.fullname }}</span>
          </div>
          <div>
            <span
              v-for="(v, i) in option.roles"
              :key="i"
              class="px-1 text-xs rounded-sm bg-primary-200 text-primary"
            >
              {{ v.name }}<span v-if="i < option.roles.length - 1">, </span>
            </span>
          </div>
        </div>
        <div class="inline-flex items-center space-x-2">
          <span class="px-1 text-xs rounded-sm bg-primary-200 text-primary">{{ option.total_alur }} Alur</span>
        </div>
      </div>
    </template>
    <template #list-footer>
      <li v-show="optionsHasNextPage" ref="selectRef" class="loader">
        Loading more options...
      </li>
    </template>
  </v-select>
</template>
