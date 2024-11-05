<script setup>
const { $api, $toast } = useNuxtApp()

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
})

const unitOfWorks = ref([])
const searchUnit = ref('')

const fetchAgentUnitOfWork = async () => {
  try {
    const { data } = await $api.agent.getAgentUnitOfWork(null, { q: searchUnit.value, per_page: 1000 })

    unitOfWorks.value = data.value?.data
  } catch (e) {
    $toast.error(e.value.data.message)
  }
}

onMounted(() => {
  fetchAgentUnitOfWork()
})

watch(() => searchUnit.value, () => {
  fetchAgentUnitOfWork()
})
</script>

<template>
  <v-select
    label="name"
    class="style-chooser w-full"
    :placeholder="'Select unit of work'"
    :options="unitOfWorks"
    :clearable="false"
    :disabled="props.disabled"
    @search="query => searchUnit = query"
  />
</template>
