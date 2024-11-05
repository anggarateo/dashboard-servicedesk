<script lang="ts" setup>
const props = defineProps({
  id: {
    type: String,
    required: true
  },
  value: {
    type: String,
    default: null
  },
  modelValue: {
    type: String,
    default: null
  }
})

const isChecked = computed(() => {
  return props.modelValue === props.value
})
</script>

<template>
  <label :for="`radio${id}`" class="flex items-center gap-2">
    <input
      :id="`radio${id}`"
      type="radio"
      class="hidden"
      :checked="isChecked"
      :value="value"
      @change="$emit('update:modelValue', $event.target.value)"
    >
    <Icon
      :name="isChecked ? 'material-symbols:check-circle' : 'ic:baseline-radio-button-unchecked'"
      class="w-5 h-5"
      :class="isChecked ? 'text-primary' : 'text-neutral-600'"
    />
    <slot />
  </label>
</template>
