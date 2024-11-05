<script setup>

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  value: {
    type: Array,
    default: () => []
  },
  options: {
    type: Array,
    required: true,
    validator: (value) => {
      const hasLabel = value.every((option) =>
        Object.keys(option).includes("label")
      );
      const hasValue = value.every((option) =>
        Object.keys(option).includes("value")
      )
      return hasLabel && hasValue
    }
  },
  modelValue: {
    default: null
  }
})

const checked = ref(Array())
watch(() => checked.value, (val) => {
  emit('update:modelValue', val)
})
watch(() => props.modelValue, (val) => {
  checked.value = val
})
</script>

<template>
  <div class="space-y-4">
    <label
      v-for="(item, i) in options"
      :key="i"
      :for="i + item.value"
      class="flex items-center space-x-2"
    >
      <input
        :id="i + item.value"
        type="checkbox"
        class="w-4 h-4 accent-primary form-checkbox"
        :checked="value.includes(item.value)"
        :label="item.label"
        :value="item.value"
        v-model="checked"
      >
      <span class="text-gray-700">{{ item.label }}</span>
    </label>
  </div>
</template>
