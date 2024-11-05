<script lang="ts" setup>
const props = defineProps({
  modelValue: {
    type: Number,
    required: true
  },
  pages: { // Total number of pages
    type: Number,
    required: true
  },
  rangeSize: { // Number of page around the current page
    type: Number,
    default: 1
  },
  activeColor: { // Background color of the current page
    type: String,
    default: '#2953A1'
  },
  hideFirstButton: { // Hide the button to go to the first page
    type:	Boolean,
    default: false
  },
  hideLastButton: { // Hide the button to go to the last page
    type:	Boolean,
    default: false
  },
  perPage: {
    type: [Array, Number],
    required: false
  }
})
const emit = defineEmits(['update:modelValue', 'per-page'])
const currentPage = ref(props.modelValue)
const perPage = ref(props.perPage)
const perPages = ref([
  1, 5, 10, 25, 50, 100
])

watch(() => props.modelValue, (val) => {
  currentPage.value = val
})
watch(() => currentPage.value, (val) => {
  emit('update:modelValue', val)
})
watch(() => perPage.value, (val) => {
  emit('per-page', val)
})
</script>
<template>
  <div class="flex flex-row gap-4 text-sm pb-10 justify-between">
    <div class="flex flex-row gap-2 items-center">
      <v-select
        id="pagination"
        v-model="perPage"
        class="style-chooser w-fit"
        :options="perPages"
        :clearable="false"
      />
      <h1>
        Baris
      </h1>
    </div>
    <VPagination
      v-model="currentPage"
      :pages="pages"
      :range-size="rangeSize"
      :active-color="activeColor"
      :hide-first-button="hideFirstButton"
      :hide-last-button="hideLastButton"
    />
  </div>
</template>