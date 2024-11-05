<script setup>

const props = defineProps({
  size: {
    type: Number,
    default: 20
  },
  maxRating: {
    type: Number,
    default: 5
  },
  modelValue: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 3
  },
  readonly: Boolean
})
const emits = defineEmits(['update:modelValue'])
const rated = ref(props.modelValue || props.rating)

watch(() => rated.value, (val) => {
  emits('update:modelValue', val)
})
</script>

<template>
  <div>
    <ClientOnly>
      <star-rating
        :star-size="props.size"
        :rating="rated"
        :max-rating="props.maxRating"
        :show-rating="false"
        :read-only="readonly"
        @update:rating="rated = $event"
      />
    </ClientOnly>
  </div>
</template>
