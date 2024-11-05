<script setup>
const { $api, $toast } = useNuxtApp()

const route = useRoute()

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
const searchViewer = ref('')

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
  const { data, error } = await $api.ticket.getListUserViewer({ idTicket: route.params.id, page: state.configOptions.page, q: searchViewer.value, per_page: 1000 })

  if (data.value) {
    state.configOptions.total = data.value?.meta?.total ?? 1
    state.data = data.value.data
  }

  if (error.value) {
    $toast.error(error.value.data.message)
  }
}

onMounted(() => {
  state.configOptions.observer = new IntersectionObserver(infiniteScroll)
})

watch(() => searchViewer.value, () => {
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
    @search="query => searchViewer = query"
  >
    <template #list-footer>
      <li v-show="optionsHasNextPage" ref="selectRef" class="loader">
        Loading more options...
      </li>
    </template>
  </v-select>
</template>
