<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  apiParams: {
    type: Object,
    default: () => {}
  }
})
const emits = defineEmits(['update:modelValue'])
const { $api, $localUser, $checkPermission, $toast } = useNuxtApp()

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
const selected = ref(props.modelValue)

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
  let params

  if ($checkPermission('pengelolaan_tiket', 'units')){
    params = {
      units_of_work_id: $localUser().units_of_work_id
    }
  } else {
    params = props.apiParams
  }

  const { data, error } = await $api.ticket.getServices(
    {
      page: state.configOptions.page,
      q: searchService.value,
      per_page: 1000,
      ...params
    }
  )

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

watch(() => searchService.value, () => {
  state.configOptions.page = 1
  getData()
})
watch(() => selected.value, (val) => {
  emits('update:modelValue', val)
})
watch(() => props.modelValue, (val) => {
  selected.value = val
})
watch(() => props.apiParams, (val) => {
  selected.value = ''
  state.configOptions.page = 1
  getData()
}, {
  deep: true
})
</script>

<template>
  <v-select
    v-model="selected"
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
