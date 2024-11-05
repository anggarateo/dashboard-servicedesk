<script setup>

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  checked: {
    type: Boolean,
    default: false
  }
})

function handleChange (event) {
  emit('update:modelValue', event.target.checked)
}

</script>

<template>
  <label :for="props.id" class="flex items-center space-x-2">
    <input
      :id="props.id"
      type="checkbox"
      class="w-4 h-4 accent-primary form-checkbox"
      :checked="props.checked"
      @change="handleChange"
    >
    <span class="text-gray-700">{{ label }}</span>
  </label>
</template>
