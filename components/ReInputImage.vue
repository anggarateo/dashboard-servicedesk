<script setup>
import { v4 as uuidv4 } from 'uuid'

const id = uuidv4()
const emit = defineEmits(['update:modelValue', 'blur'])
const priview = ref()

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  require: {
    type: Boolean,
    default: true
  },
  error: {
    type: String,
    default: null
  },
  image: {
    type: String,
    default: null
  },
  modelValue: null
})
function updateValue (obj) {
  const image = URL.createObjectURL(obj)
  priview.value = image
  emit('update:modelValue', obj)
}
</script>
<template>
  <div class="flex flex-col items-center justify-center w-full">
    <div class="flex w-full ml-0 mb-1">
      <label v-if="label" :for="`inputText${id}`">{{ label }}</label>
      <div v-if="require" class=" text-error">
        *
      </div>
    </div>
    <div
      class="flex flex-col w-full h-52 border-4 border-neutral-400 border-dashed hover:bg-gray-100 hover:border-gray-300 rounded-xl relative"
    >
      <div v-if="!priview" class="flex flex-col w-full h-full items-center justify-center">
        <Icon name="majesticons:image-plus-line" color="black" size="24" />
        <p class="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
          Pilih file
        </p>
      </div>
      <div v-if="priview" class="flex flex-col items-center justify-center">
        <img :src="priview" class="object-fill h-48 w-96" :alt="label">
      </div>
      <input
        :id="`inputImage${id}`"
        class="z-10 opacity-0 absolute w-full h-full"
        type="file"
        accept=".jpeg,.jpg,.png,image/jpeg,image/png"
        aria-label="upload image button"
        @input="updateValue($event.target.files[0])"
        @blur="$emit('blur')"
      >
    </div>
    <div class=" w-full ml-0">
      <ReErrorText v-if="error" :text="error" />
    </div>
  </div>
</template>
