<script setup>
const { $api, $toast } = useNuxtApp()

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
const searchSla = ref('')

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
  const { data, error } = await $api.flow.getSla(null, { page: state.configOptions.page, q: searchSla.value, per_page: 1000 })

  if (data.value) {
    state.data = data.value.data
  }

  if (error.value) {
    $toast.error(error.value.data.message)
  }
}

onMounted(() => {
  state.configOptions.observer = new IntersectionObserver(infiniteScroll)
})

watch(() => searchSla.value, () => {
  state.configOptions.page = 1
  getData()
})
</script>

<template>
  <v-select
    label="name"
    :options="state.data"
    class="select-custom"
    @open="selectOpen"
    @close="selectClose"
    @search="query => searchSla = query"
  >
    <template #list-header>
      <div class="flex flex-row justify-end space-x-2 px-4 py-2">
        <div class="inline-flex items-center space-x-1">
          <div class="p-1 bg-green-800 rounded-full" />
          <span class="text-xs">Rendah</span>
        </div>
        <div class="inline-flex items-center space-x-1">
          <div class="p-1 bg-blue-800 rounded-full" />
          <span class="text-xs">Sedang</span>
        </div>
        <div class="inline-flex items-center space-x-1">
          <div class="p-1 bg-red-800 rounded-full" />
          <span class="text-xs">Tinggi</span>
        </div>
      </div>
    </template>
    <template #option="option">
      <div class="flex flex-col">
        <span class="font-bold">{{ option.name }}</span>
        <div class="inline-flex items-center space-x-2">
          <span class="py-1 px-1 text-xs rounded-md bg-green-200 text-green-600">{{ option.sla_low }} Jam</span>
          <span class="py-1 px-1 text-xs rounded-md bg-blue-200 text-blue-600">{{ option.sla_medium }} Jam</span>
          <span class="py-1 px-1 text-xs rounded-md bg-red-200 text-red-600">{{ option.sla_height }} Jam</span>
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
