<script setup>
const props = defineProps({
  paramType: {
    type: String,
    default: 'laporan'
  }
})

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
  const { data, error } = await $api.report.getReportType({
    type: props.paramType,
    page: 1,
    per_page: 1000
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
</script>

<template>
  <v-select
    label="jenis_laporan"
    :options="state.data"
    :reduce="o => o.rpt_design"
    class="select-custom"
    @open="selectOpen"
    @close="selectClose"
  >
    <template #list-footer>
      <li v-show="optionsHasNextPage && state.data.length < state.configOptions.total" ref="selectRef" class="loader">
        Loading more options...
      </li>
    </template>
  </v-select>
</template>
