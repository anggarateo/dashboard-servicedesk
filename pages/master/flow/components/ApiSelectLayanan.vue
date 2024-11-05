<script setup>
const { $api, $checkPermission, $localUser, $toast } = useNuxtApp()

const state = reactive({
  data: [],
  configOptions: {
    observer: null,
    page: 1,
    total: 0,
    search: ''
  }
})
const selectRef = ref(null)
const searchService = ref('')

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

  const { data, error } = await $api.ticket.getAllServices({
    page: state.configOptions.page,
    q: searchService.value,
    per_page: 1000,
    ...byUnit
  })

  if (data.value) {
    state.configOptions.total = data.value.data.length

    // const result = data.value.data.map(val => ({
    //   name: val.langs.id.name,
    //   ...val
    // }))

    state.data = data.value.data
  }

  if (error.value) {
    $toast.error(error.value.data.message)
  }
}

onMounted(() => {
  state.configOptions.observer = new IntersectionObserver(infiniteScroll)
})

watch(() => searchService.value, () => {
  state.configOptions.page = 1
  getData()
})
</script>

<template>
  <v-select
    label="name"
    :options="state.data"
    :reduce="o => o.id"
    class="select-custom"
    @open="selectOpen"
    @close="selectClose"
    @search="query => searchService = query"
  >
    <template #list-footer>
      <li v-show="optionsHasNextPage" ref="selectRef" class="loader">
        Loading more options...
      </li>
    </template>
  </v-select>
</template>
