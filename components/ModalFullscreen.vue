<script setup>
import { VueFinalModal } from 'vue-final-modal'

const props = defineProps({
  title: {
    type: String,
    default: null
  },
  width: {
    type: Number,
    default: 4 // 1,2,3,4,5,6,7,8,9,10,11,12
  }
})

const fullScreen = ref(false)

function width () {
  switch (props.width) {
    case 1:
      return 'w-full md:w-1/12'
      break;
    case 2:
      return 'w-full md:w-2/12'
      break;
    case 3:
      return 'w-full md:w-3/12'
      break;
    case 4:
      return 'w-full md:w-4/12'
      break;
    case 5:
      return 'w-full md:w-5/12'
      break;
    case 6:
      return 'w-full md:w-6/12'
      break;
    case 7:
      return 'w-full md:w-7/12'
      break;
    case 8:
      return 'w-full md:w-8/12'
      break;
    case 9:
      return 'w-full md:w-9/12'
      break;
    case 10:
      return 'w-full md:w-10/12'
      break;
    case 11:
      return 'w-full md:w-11/12'
      break;
    case 12:
      return 'w-full md:w-12/12'
      break;
    default:
      return 'w-full md:w-4/12'
      break;
  }
}
</script>

<template>
  <VueFinalModal
    :content-class="
      fullScreen ? 'w-full h-full bg-white rounded-lg' :
      width() + ' h-full bg-white rounded-lg absolute right-0 overflow-auto'
    "
    :hide-overlay="fullScreen"
    content-transition="vfm-slide-right"
    :click-to-close="false"
    :esc-to-close="false"
    @closed="fullScreen = false"
  >
    <div class="flex flex-col space-y-2 max-h-screen">
      <div class="flex flex-row m-8 gap-4">
        <button class="w-fit" @click="$emit('closeFullscreen')">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
            <path d="M15.7901 19.2098C15.8839 19.1169 15.9583 19.0063 16.009 18.8844C16.0598 18.7625 16.0859 18.6318 16.0859 18.4998C16.0859 18.3678 16.0598 18.2371 16.009 18.1152C15.9583 17.9934 15.8839 17.8828 15.7901 17.7898L11.2101 13.2098C11.1164 13.1169 11.042 13.0063 10.9913 12.8844C10.9405 12.7625 10.9144 12.6318 10.9144 12.4998C10.9144 12.3678 10.9405 12.2371 10.9913 12.1152C11.042 11.9934 11.1164 11.8828 11.2101 11.7898L15.7901 7.20982C15.8839 7.11685 15.9583 7.00625 16.009 6.88439C16.0598 6.76253 16.0859 6.63183 16.0859 6.49982C16.0859 6.3678 16.0598 6.2371 16.009 6.11524C15.9583 5.99338 15.8839 5.88278 15.7901 5.78982C15.6028 5.60356 15.3493 5.49902 15.0851 5.49902C14.821 5.49902 14.5675 5.60356 14.3801 5.78982L9.79015 10.3798C9.22835 10.9423 8.91279 11.7048 8.91279 12.4998C8.91279 13.2948 9.22835 14.0573 9.79015 14.6198L14.3801 19.2098C14.5675 19.3961 14.821 19.5006 15.0851 19.5006C15.3493 19.5006 15.6028 19.3961 15.7901 19.2098Z" fill="#333333" />
          </svg>
        </button>
        <h1 class="text-2xl font-bold">
          {{ title }}
        </h1>
      </div>
      <button v-if="fullScreen" class="hidden md:block absolute top-1 right-3" title="Exit Full Screen" @click="fullScreen = false">
        <Icon name="ri:fullscreen-exit-line" size="26" />
      </button>
      <button v-else class="hidden md:block absolute top-1 right-3" title="Full Screen" @click="fullScreen = true">
        <Icon name="bytesize:fullscreen" size="24" />
      </button>
      <slot />
      <div class=" bg-white w-full bottom-0 p-10">
        <slot name="footer" />
      </div>
    </div>
  </VueFinalModal>
</template>
