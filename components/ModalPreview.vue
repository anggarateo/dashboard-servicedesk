<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal'

defineProps({
  file: {
    type: Object,
    default: {
      full_path: null,
      filename: null
    }
  }
})
</script>

<template>
  <VueFinalModal
    class="flex flex-row justify-center bg-neutral-500/50"
    content-class="h-fit max-h-screen w-fit flex flex-col items-center gap-4 overflow-auto py-8"
    content-transition="vfm-fade"
    @closed="$emit('closeInfo')"
  >
    <Icon
      name="material-symbols:close"
      class="fixed text-white right-5 top-5 cursor-pointer hover:text-stroke text-2xl"
      @click="$emit('closeInfo')"
    />
    <h1 class="text-white">
      {{ file.filename }}
    </h1>
    <div class="bg-white border rounded-lg p-4">
      <object
        :data="$baseURL() + file.path"
        :class="
          file.type.toLowerCase() === 'pdf'
          ? 'w-[calc(100vw-10rem)] h-[calc(100vh-10rem)]'
          : 'max-w-[calc(100vw-10rem)] max-h-[calc(100vh-10rem)]'
        "
      />
    </div>
  </VueFinalModal>
</template>
