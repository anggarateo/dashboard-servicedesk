<script lang="ts" setup>
interface Rating {
  id: string,
  author: string,
  grade: number,
  message: string
}
interface Props {
  rating: Rating
}

const props = defineProps<Props>()
const showMsg = ref(false)
</script>

<template>
  <div
    class="relative"
    @mouseenter="showMsg = true"
    @mouseleave="showMsg = false"
    @mouseover="showMsg = true"
    @click="showMsg = !showMsg"
  >
    <CRatingStar
      :rating="rating.grade"
      readonly
    />

    <div
      v-show="showMsg"
      class="absolute bottom-5 sm:-left-[110%] bg-white rounded-md shadow-md w-screen h-fit max-w-full sm:max-w-[calc(100vw/5)] max-h-24 overflow-auto p-2"
      @mouseleave="showMsg = false"
      @click="showMsg = false"
    >
      {{ rating.message }}
    </div>
  </div>
</template>
