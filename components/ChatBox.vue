<script lang="ts" setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { addDays } from 'date-fns'

const props = defineProps({
  value: {
    type: String,
    default: ''
  },
  position: { // left | right
    type: String,
    default: ''
  },
  files: {
    type: Array,
    default: () => []
  },
  classWrapper: {
    type: String,
    default: ''
  },
  reply: {
    type: Boolean,
    default: false
  },
  time: {
    type: String,
    default: null
  }
})
const emit = defineEmits(['reply'])
const content = useEditor({
  content: props.value,
  editable: false,
  extensions: [
    StarterKit,
    Underline
  ]
})
const wrapper = computed(() => {
  return props.classWrapper
})
</script>
<template>
  <div
    :class="[
      {
        'bg-primary-100': position === 'right',
        'bg-secondary-100': position === 'left'
      },
      wrapper ? wrapper : 'p-4 rounded-md max-w-xl text-sm space-y-2'
    ]"
  >
    <div class="flex flex-row justify-between items-end">
      <EditorContent :editor="content" />
      <div
        v-if="reply && !files.length"
        title="Balas"
        class="cursor-pointer text-primary-500 hover:text-primary-700"
        @click="emit('reply')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
          <path d="M15.1668 4.95321V8.95321C15.1668 9.95321 14.8335 10.7865 14.2468 11.3732C13.6668 11.9532 12.8335 12.2865 11.8335 12.2865V13.7065C11.8335 14.2399 11.2402 14.5599 10.8002 14.2666L7.8335 12.2865H6.42017C6.4735 12.0865 6.50016 11.8799 6.50016 11.6665C6.50016 10.9865 6.24016 10.3599 5.8135 9.88656C5.3335 9.33989 4.62016 8.99988 3.8335 8.99988C3.08683 8.99988 2.40683 9.30656 1.92017 9.80656C1.86017 9.53989 1.8335 9.25321 1.8335 8.95321V4.95321C1.8335 2.95321 3.16683 1.61987 5.16683 1.61987H11.8335C13.8335 1.61987 15.1668 2.95321 15.1668 4.95321Z" stroke="currentColor" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M6.49984 11.6667C6.49984 11.88 6.47317 12.0867 6.41984 12.2867C6.35984 12.5533 6.25318 12.8133 6.11318 13.04C5.65318 13.8133 4.8065 14.3333 3.83317 14.3333C3.1465 14.3333 2.5265 14.0733 2.05983 13.6466C1.85983 13.4733 1.68649 13.2667 1.55316 13.04C1.30649 12.64 1.1665 12.1667 1.1665 11.6667C1.1665 10.9467 1.45317 10.2867 1.91984 9.80668C2.40651 9.30668 3.0865 9 3.83317 9C4.61984 9 5.33317 9.34001 5.81317 9.88668C6.23984 10.36 6.49984 10.9867 6.49984 11.6667Z" stroke="currentColor" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M4.8265 11.6533H2.83984" stroke="currentColor" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M3.8335 10.6799V12.6733" stroke="currentColor" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M6.1665 7H10.8332" stroke="currentColor" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h1 v-if="!reply && !files.length && time" class="text-neutral-300 text-xs font-medium">
        {{
          addDays(new Date(tglToDate(time)), 3) >= new Date() ?
          $distanceDate(tglToDate(time), new Date(), { addSuffix: true, locale: $localeId() })
          : time
        }}
      </h1>
    </div>
    <div class="flex flex-row justify-between items-end">
      <div>
        <div
          v-for="(file, i) in files"
          :key="i"
          class="flex flex-row gap-2 items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
            <path opacity="0.4" d="M20.5 10.69H17.61C15.24 10.69 13.31 8.76 13.31 6.39V3.5C13.31 2.95 12.86 2.5 12.31 2.5H8.07C4.99 2.5 2.5 4.5 2.5 8.07V16.93C2.5 20.5 4.99 22.5 8.07 22.5H15.93C19.01 22.5 21.5 20.5 21.5 16.93V11.69C21.5 11.14 21.05 10.69 20.5 10.69Z" fill="#2953A1"/>
            <path d="M15.7997 2.71048C15.3897 2.30048 14.6797 2.58048 14.6797 3.15048V6.64048C14.6797 8.10048 15.9197 9.31048 17.4297 9.31048C18.3797 9.32048 19.6997 9.32048 20.8297 9.32048C21.3997 9.32048 21.6997 8.65048 21.2997 8.25048C19.8597 6.80048 17.2797 4.19048 15.7997 2.71048Z" fill="#2953A1"/>
            <path d="M11.5295 12.97L9.52945 10.97C9.51945 10.96 9.50945 10.96 9.50945 10.95C9.44945 10.89 9.36945 10.84 9.28945 10.8C9.27945 10.8 9.27945 10.8 9.26945 10.8C9.18945 10.77 9.10945 10.76 9.02945 10.75C8.99945 10.75 8.97945 10.75 8.94945 10.75C8.88945 10.75 8.81945 10.77 8.75945 10.79C8.72945 10.8 8.70945 10.81 8.68945 10.82C8.60945 10.86 8.52945 10.9 8.46945 10.97L6.46945 12.97C6.17945 13.26 6.17945 13.74 6.46945 14.03C6.75945 14.32 7.23945 14.32 7.52945 14.03L8.24945 13.31V17.5C8.24945 17.91 8.58945 18.25 8.99945 18.25C9.40945 18.25 9.74945 17.91 9.74945 17.5V13.31L10.4695 14.03C10.6195 14.18 10.8095 14.25 10.9995 14.25C11.1895 14.25 11.3795 14.18 11.5295 14.03C11.8195 13.74 11.8195 13.26 11.5295 12.97Z" fill="#2953A1"/>
          </svg>
          <div
            class="text-neutral-500 hover:underline cursor-pointer"
            @click="$onPreviewFile(file)"
          >
            <span class="text-primary-600">{{ file.filename }}</span> {{ file.size }} KB
          </div>
        </div>
      </div>
      <div
        v-if="reply && files.length"
        title="Balas"
        class="cursor-pointer text-primary-500 hover:text-primary-700"
        @click="emit('reply')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
          <path d="M15.1668 4.95321V8.95321C15.1668 9.95321 14.8335 10.7865 14.2468 11.3732C13.6668 11.9532 12.8335 12.2865 11.8335 12.2865V13.7065C11.8335 14.2399 11.2402 14.5599 10.8002 14.2666L7.8335 12.2865H6.42017C6.4735 12.0865 6.50016 11.8799 6.50016 11.6665C6.50016 10.9865 6.24016 10.3599 5.8135 9.88656C5.3335 9.33989 4.62016 8.99988 3.8335 8.99988C3.08683 8.99988 2.40683 9.30656 1.92017 9.80656C1.86017 9.53989 1.8335 9.25321 1.8335 8.95321V4.95321C1.8335 2.95321 3.16683 1.61987 5.16683 1.61987H11.8335C13.8335 1.61987 15.1668 2.95321 15.1668 4.95321Z" stroke="currentColor" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M6.49984 11.6667C6.49984 11.88 6.47317 12.0867 6.41984 12.2867C6.35984 12.5533 6.25318 12.8133 6.11318 13.04C5.65318 13.8133 4.8065 14.3333 3.83317 14.3333C3.1465 14.3333 2.5265 14.0733 2.05983 13.6466C1.85983 13.4733 1.68649 13.2667 1.55316 13.04C1.30649 12.64 1.1665 12.1667 1.1665 11.6667C1.1665 10.9467 1.45317 10.2867 1.91984 9.80668C2.40651 9.30668 3.0865 9 3.83317 9C4.61984 9 5.33317 9.34001 5.81317 9.88668C6.23984 10.36 6.49984 10.9867 6.49984 11.6667Z" stroke="currentColor" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M4.8265 11.6533H2.83984" stroke="currentColor" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M3.8335 10.6799V12.6733" stroke="currentColor" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M6.1665 7H10.8332" stroke="currentColor" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h1 v-if="!reply && files.length && time" class="text-neutral-300 text-xs font-medium">
        {{
          addDays(new Date(tglToDate(time)), 3) >= new Date() ?
          $distanceDate(tglToDate(time), new Date(), { addSuffix: true, locale: $localeId() })
          : time
        }}
      </h1>
    </div>
  </div>
</template>