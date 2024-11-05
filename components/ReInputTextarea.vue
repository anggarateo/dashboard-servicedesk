<!-- eslint-disable vue/require-default-prop -->
<script setup>
import { v4 as uuidv4 } from 'uuid'

const id = uuidv4()
const emit = defineEmits(['update:modelValue', 'blur'])
function updateValue (value) {
  emit('update:modelValue', value)
}
const props = defineProps({
  imitation: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: null
  },
  value: {
    type: String,
    default: null
  },
  require: {
    type: Boolean,
    default: true
  },
  emptyText: {
    type: String,
    default: null
  },
  isEmpty: {
    type: Boolean,
    default: true
  },
  type: {
    type: String,
    default: 'text' // text, email, password
  },
  inputmode: {
    type: String,
    default: 'text' // text, email, tel
  },
  placeholder: {
    type: String,
    default: null
  },
  maxlength: {
    type: Number,
    default: 0
  },
  error: {
    type: String,
    default: null
  },
  disabled: {
    type: Boolean,
    default: false
  },
  round: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    default: null // right, left
  },
  iconPlacement: {
    type: String,
    default: 'inside' // inside, outside
  },
  modelValue: String
})
const inputTextKindClass = () => {
  return {
    'mt-1': props.label,
    'bg-white w-full py-3 px-4 border border-gray-300 rounded-xl placeholder-gray-400 ': props.type === 'text' || props.type === 'email' || props.type === 'password',
    'focus:ring focus:ring-opacity-90 focus:ring-offset-2 focus:ring-offset-white focus:ring-primary': (props.type === 'text' || props.type === 'email' || props.type === 'password') && !props.disabled && !props.error,
    'border-red-500 ring ring-offset-2 ring-offset-white ring-red-500': !props.disabled && props.error,
    'bg-gray-300 dark:bg-gray-700 cursor-not-allowed select-none': props.disabled,
    'rounded-full': props.round,
    'pl-16': props.icon === 'left' && props.iconPlacement === 'inside',
    'pr-16': props.icon === 'right' && props.iconPlacement === 'inside'
  }
}
</script>

<template>
  <div :class="{'relative': icon}">
    <div class="flex">
      <label v-if="label" :for="`inputText${id}`">{{ label }}</label>
      <div v-if="require" class=" text-error">
        *
      </div>
    </div>
    <div
      v-if="icon && iconPlacement === 'inside'"
      class="flex items-center absolute h-12 py-3 px-4"
      :class="{
        'mt-1': label,
        'right-0': icon === 'right',
        'left-0': icon === 'left'
      }"
    >
      <slot name="icon" />
    </div>
    <div :class="{ 'flex items-center w-full space-x-2': icon && iconPlacement === 'outside' }">
      <slot v-if="icon === 'left' && iconPlacement === 'outside'" name="icon" />
      <textarea
        v-if="!imitation"
        :id="`inputText${id}`"
        :ref="`inputText${id}`"
        rows="5"
        cols="33"
        :value="modelValue"
        :name="`inputText${id}`"
        :type="type"
        :inputmode="inputmode"
        :disabled="disabled"
        :placeholder="placeholder"
        class="duration-300"
        :class="[inputTextKindClass()]"
        style="outline: none !important;"
        :style="{ 'line-height: 1.5;': type === 'text' || type === 'email' || type === 'password' }"
        @input="updateValue($event.target.value)"
        @blur="$emit('blur')"
      />
      <div
        v-if="imitation"
        class="select-none"
        :class="[
          inputTextKindClass(),
          {
            'text-gray-400': imitation && emptyText && isEmpty,
            'cursor-text': !disabled
          }
        ]"
        style="height: calc((.75rem * 2) + 1.5rem + .2rem);"
      >
        <div class="whitespace-nowrap overflow-hidden">
          {{ emptyText }}
        </div>
      </div>
      <slot v-if="icon === 'right' && iconPlacement === 'outside'" name="icon" />
    </div>
    <ReErrorText v-if="error" :text="error" />
  </div>
</template>
