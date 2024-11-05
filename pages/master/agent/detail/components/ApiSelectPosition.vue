<script setup>
const { $api, $toast } = useNuxtApp()

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
})

const position = ref([])
const searchPosition = ref('')

const fetchPosition = async () => {
  try {
    const { data } = await $api.agent.getAgentPosition(null, { q: searchPosition.value, per_page: 1000 })

    position.value = data.value?.data
  } catch (e) {
    $toast.error(e.value.data.message)
  }
}

onMounted(() => {
  fetchPosition()
})

watch(() => searchPosition.value, () => {
  fetchPosition()
})
</script>

<template>
  <v-select
    label="name"
    class="style-chooser w-full"
    :placeholder="'Select position'"
    :options="position"
    :clearable="false"
    :disabled="props.disabled"
    @search="query => searchPosition = query"
  />
</template>
