<script lang="ts" setup>
const props = defineProps({
  modelValue: Boolean,
  categoryOptions: Array,
  categoryValue: Array
})
const emits = defineEmits(['update:modelValue', 'category'])
const shown = ref(props.modelValue)
const initForm = () => ({
  categories: []
})
const form = ref(initForm())

onMounted(() => {
  form.value.categories = props.categoryValue
})
watch(() => shown.value, (val) => {
  emits('update:modelValue', val)
})
watch(() => form.value, (val) => {
  if (val.categories) {
    emits('category', val.categories)
  } else if (!val.categories) {
    emits('category', val.categories)
  }
}, { deep: true })
</script>
<template>
  <div
    class="fixed z-[1000] h-screen w-screen left-0 top-0 overflow-auto"
  >
    <div class="w-[28rem] bg-white shadow-md rounded-b-lg border absolute right-[9rem] top-[11rem] z-[1001]">
      <!-- Header -->
      <div class="flex flex-row justify-between px-4 py-3 shadow-md">
        <h1 class="text-xl font-bold">
          Filter
        </h1>
        <CButton
          v-if="JSON.stringify(initForm()) !== JSON.stringify(form)"
          text="Reset"
          type="text"
          size="small"
          @click="form = initForm()"
        />
      </div>
      <!-- Content -->
      <div class="p-4 text-sm space-y-4">
        <div v-if="categoryOptions" class="space-y-2">
          <h1 class="font-semibold">
            Kategori
          </h1>
          <CheckBoxMulti v-model="form.categories" :options="categoryOptions" />
        </div>
      </div>
    </div>
    <div
      class="w-full h-full"
      @click="shown = false"
    />
  </div>
</template>