<script lang="ts" setup>
const props = defineProps({
  avatar: {
    type: String,
    default: null
  },
  name: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  textClass: {
    type: String,
    default: null
  },
  localPreview: {
    type: Boolean,
    default: false
  }
})

const { $baseURL } = useNuxtApp()

const sizing = computed(() => {
  return `w-${props.size} h-${props.size}`
})
const textclass = computed(() => {
  return props.textClass
})
const imgError = ref(false)
const srcAvatar = ref('')

watch(() => props, (val) => {
  if (val.localPreview) {
    srcAvatar.value = val.avatar
  } else {
    srcAvatar.value = $baseURL() + val.avatar
  }
}, {
  deep: true
})
</script>
<template>
  <div
    class="rounded-full"
    :class="[
      srcAvatar && !imgError ? 'bg-cover bg-center' : `${textclass} bg-secondary text-neutral-100 font-semibold flex items-center justify-center`,
      sizing
    ]"
    :style="{ 'background-image': `url(${srcAvatar})`}"
  >
    <h1 v-if="!srcAvatar || imgError">
      {{ name.charAt(0).toUpperCase() }}
    </h1>
    <img
      hidden
      :src="srcAvatar"
      :alt="srcAvatar"
      @error="imgError = true"
      @load="imgError = false"
    >
  </div>
</template>
