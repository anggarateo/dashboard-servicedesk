<script setup>

const props = defineProps({
  text: {
    type: String,
    default: '',
    required: true
  },
  color: {
    type: String,
    default: 'blue' // Default color is blue, you can change it as needed
  }
})

const computedClass = computed(() => {
  return `bg-${props.color}-100 text-${props.color}-800 text-md font-medium px-4 py-2 rounded-xl`
})

</script>

<template>
  <div :class="computedClass">
    {{ props.text }}
  </div>
</template>
