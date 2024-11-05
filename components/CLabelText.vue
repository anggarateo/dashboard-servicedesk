<script setup>

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  textColor: {
    type: String,
    default: 'text-gray-700' // Default text color is gray-700
  },
  bgColor: {
    type: String,
    default: 'bg-gray-300' // Default background color is gray-300
  },
  textSize: {
    type: String,
    default: 'text-sm' // Default font size is small
  }
})

const computedClass = computed(() => {
  return `inline-block px-3 py-1 rounded-full font-bold ${props.bgColor} ${props.textColor} ${props.textSize}`
})

</script>

<template>
  <div :class="computedClass">
    <span>{{ text }}</span>
  </div>
</template>
