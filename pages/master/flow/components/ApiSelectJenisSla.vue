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
  const { data, error } = await $api.flow.getSlaType(null, { page: state.configOptions.page })

  if (data.value) {
    state.data.push(...data.value.data)
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
    label="name"
    :options="state.data"
    class="select-custom"
    @open="selectOpen"
    @close="selectClose"
  >
    <template #list-footer>
      <li v-show="optionsHasNextPage" ref="selectRef" class="loader">
        Loading more options...
      </li>
    </template>
  </v-select>
</template>
