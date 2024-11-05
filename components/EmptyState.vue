<script setup>
const props = defineProps({
  content: {
    type: String,
    required: true
  },
  codeMenu: {
    type: String,
    required: true
  }
})
</script>
<template>
  <div class="w-full flex justify-center">
    <div class="lg:w-1/3 flex flex-col gap-4 items-center">
      <img src="@/assets/img/EmptyState.png" alt="Empty State" width="118" height="118">
      <h1 class="font-semibold text-xl">
        {{ content }} kosong
      </h1>
      <h1 class="w-full text-sm text-center">
        {{ content }} yang telah dibuat akan ditampilkan disini. Silahkan menambah {{ content.toLowerCase() }} baru terlebih dahulu.
      </h1>
      <CButton
        v-if="$checkPermission(codeMenu, 'create')"
        class="w-full"
        :text="'Tambah ' + content"
        icon-position="left"
        @click="$emit('clicked')"
      />
    </div>
  </div>
</template>
