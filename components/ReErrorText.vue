<template>
  <div v-if="text" class="italic text-red-600 dark:text-red-400">
    {{ text }}
  </div>
</template>

<script>
export default {
  name: 'ReErrorText',

  props: {
    text: {
      type: String,
      default: null
    }
  }
}
</script>
