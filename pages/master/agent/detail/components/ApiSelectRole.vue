<script setup>
const { $api, $toast } = useNuxtApp()

const roles = ref([])
const observer = ref(null)
const page = ref(1)
const limit = ref(1000)
const itemRefs = ref([])
const search = ref('')

const fetchAgentRole = async () => {
  try {
    const { data } = await $api.agent.getAgentRole(null, { page: page.value })

    roles.value = data.value?.data
  } catch (e) {
    $toast.error(e.value.data.message)
  }
}

const filtered = computed(() => {
  return roles.value
})

const paginated = computed(() => {
  return filtered.value.slice(0, limit.value)
})

const hasNextPage = computed(() => {
  return paginated.length < filtered.value.length
})

const onOpen = async () => {
  if (hasNextPage.value) {
    await fetchAgentRole()
    observer.value.observe(itemRefs.value)
  }
}

const onClose = () => {
  observer.value.disconnect()
}

async function infiniteScroll ([{ isIntersecting, target }]) {
  if (isIntersecting) {
    const ul = target.offsetParent
    const scrollTop = target.offsetParent.scrollTop

    page.value = page.value + 1
    limit.value += 10

    await fetchAgentRole()

    ul.scrollTop = scrollTop
  }
}

onMounted(() => {
  observer.value = new IntersectionObserver(infiniteScroll)

  fetchAgentRole()
})

</script>

<template>
  <v-select
    multiple
    label="name"
    class="style-chooser w-52"
    :placeholder="'Select role'"
    :reduce="role => role.id"
    :options="paginated"
    :clearable="false"
    @search="(query) => (search = query)"
    @open="onOpen"
    @close="onClose"
  >
    <template #list-footer>
      <li v-show="hasNextPage" ref="itemRefs" class="loader">
        Loading more options...
      </li>
    </template>
  </v-select>
</template>
