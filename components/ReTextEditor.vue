<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Heading from '@tiptap/extension-heading'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import TextAlign from '@tiptap/extension-text-align'
import OrderedList from '@tiptap/extension-ordered-list'
import CharacterCount from '@tiptap/extension-character-count'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import ReTextEditorMenuBar from './ReTextEditorMenuBar.vue'
import Image from '@tiptap/extension-image'
import checkFileSize from '~/utils/maxFileSize'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  isTopRounded: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  },
  acceptedFile: {
    type: String,
    default: `
      image/*,
      application/pdf,
      application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel,
      application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document
    `
  },
  image: {
    type: String,
    default: null
  },
  btnConfirm: {
    type: String,
    default: null
  },
  inlineImage: {
    type: Boolean,
    default: true
  },
  disabledBtn: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: 'Write something …'
  },
  wDropzone: {
    type: String,
    default: 'w-[calc(100vw/2.1)]'
  },
  dropzoneOnly: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'upload', 'confirmed', 'cancel-upload'])

const editor = useEditor({
  content: props.modelValue,
  onUpdate ({ editor }) {
    // The content has changed.
    emit('update:modelValue', editor.getHTML())
  },
  extensions: [
    StarterKit.configure({
      history: false
    }),
    // Heading.configure({
    //   levels: [1, 2, 3]
    // }),
    Placeholder.configure({
      placeholder: props.placeholder
    }),
    TaskList,
    TaskItem,
    Underline,
    // OrderedList.configure({
    //   itemTypeName: 'listItem'
    // }),
    TextAlign.configure({
      // types: ['heading', 'paragraph'],
      types: ['paragraph'],
      defaultAlignment: 'left'
    }),
    CharacterCount.configure({
      limit: 10000
    }),
    Image.configure({
      inline: true
    })
  ]
})

watch(() => props.modelValue, (value) => {
  const isSame = editor.value.getHTML() === value

  if (isSame) {
    return
  }

  editor.value.commands.setContent(value, false)
})
watch(() => props.image, (val) => {
  if (val) editor.value.commands.setImage({ src: val })
})

const files = ref([{
  preview: null
}])
const sizeDropzone = computed(() => {
  return props.wDropzone
})

function onUpload (e) {
  if (!checkFileSize(e.target.files[0].size)) return
  if (props.acceptedFile.includes(e.target.files[0].type) || (props.acceptedFile.includes('image/') && e.target.files[0].type.includes('image/'))) {
    if (props.inlineImage) {
      emit('upload', e)
    } else {
      emit('upload', e)
      files.value.push({ preview: e.target.files[0] })
    }
  } else {
    useNuxtApp().$toast.error('Ekstensi file tidak sesuai')
  }
}
</script>

<template>
  <div>
    <template v-if="editor">
      <div
        class="border rounded-b-lg shadow-md editor"
        :class="{
          'border-red-500 ring ring-offset-2 ring-offset-white ring-red-500 rounded': error
        }"
      >
        <template v-if="!dropzoneOnly">
          <ReTextEditorMenuBar
            :class="{'rounded-t-lg border-t': props.isTopRouded }"
            class="shadow-md editor__header"
            :editor="editor"
          >
            <template v-if="btnConfirm" #btn>
              <CButton
                :text="btnConfirm"
                :loading="disabledBtn"
                @click="$emit('confirmed'), files.splice(1)"
              />
            </template>
          </ReTextEditorMenuBar>
          <editor-content class="editor__content" :editor="editor" />
        </template>
        <div class="editor__footer">
          <div class="space-y-2 w-full">
            <span />
            <div
              class="relative h-24 bg-primary-200/30 hover:bg-primary-200/50 rounded flex items-center"
            >
              <div class="flex flex-row gap-2 items-center absolute w-full justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                  <path opacity="0.4" d="M20.5 10.69H17.61C15.24 10.69 13.31 8.76 13.31 6.39V3.5C13.31 2.95 12.86 2.5 12.31 2.5H8.07C4.99 2.5 2.5 4.5 2.5 8.07V16.93C2.5 20.5 4.99 22.5 8.07 22.5H15.93C19.01 22.5 21.5 20.5 21.5 16.93V11.69C21.5 11.14 21.05 10.69 20.5 10.69Z" fill="#2953A1"/>
                  <path d="M15.7997 2.71048C15.3897 2.30048 14.6797 2.58048 14.6797 3.15048V6.64048C14.6797 8.10048 15.9197 9.31048 17.4297 9.31048C18.3797 9.32048 19.6997 9.32048 20.8297 9.32048C21.3997 9.32048 21.6997 8.65048 21.2997 8.25048C19.8597 6.80048 17.2797 4.19048 15.7997 2.71048Z" fill="#2953A1"/>
                  <path d="M11.5295 12.97L9.52945 10.97C9.51945 10.96 9.50945 10.96 9.50945 10.95C9.44945 10.89 9.36945 10.84 9.28945 10.8C9.27945 10.8 9.27945 10.8 9.26945 10.8C9.18945 10.77 9.10945 10.76 9.02945 10.75C8.99945 10.75 8.97945 10.75 8.94945 10.75C8.88945 10.75 8.81945 10.77 8.75945 10.79C8.72945 10.8 8.70945 10.81 8.68945 10.82C8.60945 10.86 8.52945 10.9 8.46945 10.97L6.46945 12.97C6.17945 13.26 6.17945 13.74 6.46945 14.03C6.75945 14.32 7.23945 14.32 7.52945 14.03L8.24945 13.31V17.5C8.24945 17.91 8.58945 18.25 8.99945 18.25C9.40945 18.25 9.74945 17.91 9.74945 17.5V13.31L10.4695 14.03C10.6195 14.18 10.8095 14.25 10.9995 14.25C11.1895 14.25 11.3795 14.18 11.5295 14.03C11.8195 13.74 11.8195 13.26 11.5295 12.97Z" fill="#2953A1"/>
                </svg>
                <h1>
                  Drop file disini atau <span class="text-blue-700 cursor-pointer hover:underline">pilih file</span>
                </h1>
              </div>
              <input
                class="opacity-0 absolute w-full h-full"
                type="file"
                :accept="acceptedFile"
                @change="onUpload($event)"
              >
            </div>
            <template v-if="!inlineImage"></template>
            <div
              v-for="(file, i) in files"
              :key="i"
              :class="{
                'hidden': !file.preview
              }"
              class="relative h-6 bg-primary-200/30 hover:bg-primary-200/50 rounded flex items-center"
            >
              <div class="flex flex-row gap-2 items-center absolute">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                  <path opacity="0.4" d="M20.5 10.69H17.61C15.24 10.69 13.31 8.76 13.31 6.39V3.5C13.31 2.95 12.86 2.5 12.31 2.5H8.07C4.99 2.5 2.5 4.5 2.5 8.07V16.93C2.5 20.5 4.99 22.5 8.07 22.5H15.93C19.01 22.5 21.5 20.5 21.5 16.93V11.69C21.5 11.14 21.05 10.69 20.5 10.69Z" fill="#2953A1"/>
                  <path d="M15.7997 2.71048C15.3897 2.30048 14.6797 2.58048 14.6797 3.15048V6.64048C14.6797 8.10048 15.9197 9.31048 17.4297 9.31048C18.3797 9.32048 19.6997 9.32048 20.8297 9.32048C21.3997 9.32048 21.6997 8.65048 21.2997 8.25048C19.8597 6.80048 17.2797 4.19048 15.7997 2.71048Z" fill="#2953A1"/>
                  <path d="M11.5295 12.97L9.52945 10.97C9.51945 10.96 9.50945 10.96 9.50945 10.95C9.44945 10.89 9.36945 10.84 9.28945 10.8C9.27945 10.8 9.27945 10.8 9.26945 10.8C9.18945 10.77 9.10945 10.76 9.02945 10.75C8.99945 10.75 8.97945 10.75 8.94945 10.75C8.88945 10.75 8.81945 10.77 8.75945 10.79C8.72945 10.8 8.70945 10.81 8.68945 10.82C8.60945 10.86 8.52945 10.9 8.46945 10.97L6.46945 12.97C6.17945 13.26 6.17945 13.74 6.46945 14.03C6.75945 14.32 7.23945 14.32 7.52945 14.03L8.24945 13.31V17.5C8.24945 17.91 8.58945 18.25 8.99945 18.25C9.40945 18.25 9.74945 17.91 9.74945 17.5V13.31L10.4695 14.03C10.6195 14.18 10.8095 14.25 10.9995 14.25C11.1895 14.25 11.3795 14.18 11.5295 14.03C11.8195 13.74 11.8195 13.26 11.5295 12.97Z" fill="#2953A1"/>
                </svg>
                <h1>
                  {{ file.preview?.name }}
                </h1>
              </div>
              <h1
                v-if="file.preview"
                class="hover:underline text-error absolute right-2 cursor-pointer"
                @click="files.splice(i, 1), $emit('cancel-upload', i - 1)"
              >
                Cancel
              </h1>
            </div>
          </div>
        </div>
      </div>
      <ReErrorText v-if="error" :text="error" />
    </template>
  </div>
</template>

<style scope>
/* .editor */
.editor {
  background-color: #FFF;
  color: #0D0D0D;
  display: flex;
  flex-direction: column;
  max-height: 26rem;
}

/* .editor__header */
.editor__header {
  align-items: center;
  background: #ffffff;
  display: flex;
  flex: 0 0 auto;
  flex-wrap: wrap;
  padding: 0.5rem;
}

/* .editor__content */
.editor__content {
  flex: 1 1 auto;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 1rem;
  height: 14rem;
  -webkit-overflow-scrolling: touch;
}

/* .editor__footer */
.editor__footer {
  align-items: center;
  border-top: 4px dashed #f1f1f1;
  display: flex;
  flex: 0 0 auto;
  flex-wrap: wrap;
  font-size: 12px;
  font-weight: 600;
  justify-content: space-between;
  padding: 1rem 0.75rem;
  white-space: nowrap;
}

.ProseMirror {
  height: 100% !important;
}

.ProseMirror > * + * {
  margin-top: 0.75em;
}

.ProseMirror:focus {
  outline: none !important;
}

.ProseMirror ul,
.ProseMirror ol {
  padding: 0 1rem;
}

.ProseMirror ol {
  list-style: decimal !important;
}

.ProseMirror ul {
  list-style: disc !important;
}

/* Placeholder (at the top) */
.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}

.ProseMirror h1 {
  line-height: 1.1;
}

.ProseMirror h1 {
  font-size: 1.5rem !important; /* 20px */
  font-weight: bold;
}

</style>
