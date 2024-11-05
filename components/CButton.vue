<script setup>
const props = defineProps({
  type: {
    type: String,
    default: 'filled' // filled, outlined, text
  },
  dashed: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: null // null = base, small
  },
  text: {
    type: String,
    default: null
  },
  disabled: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    default: null
  },
  iconPosition: {
    type: String,
    default: null // left, right
  },
  iconImg: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: 'primary' // primary, error, secondary, neutral, success
  },
  rounded: {
    type: Boolean,
    default: false // false = rounded-lg; true = rounded-full
  },
  textColor: {
    type: String,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

function sizeIcon () {
  if (props.size === 'small' && props.type === 'text') {
    return {
      size: '12',
      d: 'M10 6.5H6.5V10H5.5V6.5H2V5.5H5.5V2H6.5V5.5H10V6.5Z'
    }
  } else if (props.size === 'small') {
    return {
      size: '16',
      d: 'M15 10.25H9.75V15.5H8.25V10.25H3V8.75H8.25V3.5H9.75V8.75H15V10.25Z'
    }
  } else {
    return {
      size: '28',
      d: 'M15 10.25H9.75V15.5H8.25V10.25H3V8.75H8.25V3.5H9.75V8.75H15V10.25Z'
    }
  }
}

function fillIcon () {
  if ((props.type === 'filled' && props.disabled) || props.type === 'outlined') {
    return '#696969'
  } else if (props.type === 'filled' && props.color !== 'neutral') {
    return 'white'
  } else if (props.type === 'text' || props.color === 'neutral') {
    return '#2953A1'
  } else {
    return 'current'
  }
}
</script>
<template>
  <button
    class="w-fit h-fit font-semibold py-2"
    :class="[
      rounded ? 'rounded-full' : 'rounded-lg',
      size === 'small' && text ? 'text-sm px-4' : size === 'small' ? 'px-1' : 'px-5',
      { 'border-dashed': dashed && type === 'outlined' },
      {
        'bg-primary-500': type === 'filled' && !disabled && color === 'primary',
        'bg-error': type === 'filled' && !disabled && color === 'error',
        'bg-success-400': type === 'filled' && !disabled && color === 'success',
        'bg-secondary': type === 'filled' && !disabled && color === 'secondary',
        'bg-neutral-100 text-primary hover:shadow-md': type === 'filled' && !disabled && color === 'neutral',
        'text-white hover:shadow-md': type === 'filled' && !disabled && color !== 'neutral',
        'bg-stroke text-neutral/50 cursor-not-allowed': type === 'filled' && disabled,
        'border-2 border-stroke bg-none text-neutral hover:bg-neutral/10': type === 'outlined' && !disabled && (color === 'primary' || color === 'neutral'),
        'border-2 border-error-100 bg-none text-error hover:bg-error/10': type === 'outlined' && !disabled && color === 'error',
        'border-2 border-success-100 bg-none text-success hover:bg-success/10': type === 'outlined' && !disabled && color === 'success',
        'border-2 border-secondary-100 bg-none text-secondary hover:bg-secondary/10': type === 'outlined' && !disabled && color === 'secondary',
        'border-2 border-stroke bg-none text-neutral/50 cursor-not-allowed': type === 'outlined' && disabled,
        'text-neutral/50 cursor-not-allowed': type === 'text' && disabled,
        'text-primary hover:bg-primary-500/10': type === 'text' && !disabled && color === 'primary',
        'text-error hover:bg-error/10': type === 'text' && !disabled && color === 'error',
        'text-secondary hover:bg-secondary/10': type === 'text' && !disabled && color === 'secondary',
        'text-neutral-100 hover:bg-neutral-100/10': type === 'text' && !disabled && color === 'neutral',
        'text-success-500 hover:bg-success-500/10': type === 'text' && !disabled && color === 'success'
      }
    ]"
    :disabled="disabled || loading"
  >
    <div class="flex flex-row gap-2 items-center justify-center">
      <Icon v-if="loading" name="eos-icons:loading" :color="fillIcon()" :size="sizeIcon().size" />
      <img v-if="iconImg && (iconPosition === 'left' || (iconPosition!=='right' && icon))" :src="icon" :alt="icon" :width="sizeIcon().size">
      <Icon v-else-if="iconPosition==='left' || (iconPosition!=='right' && icon)" :name="!icon ? 'clarity:plus-line' : icon" :color="fillIcon()" :size="sizeIcon().size" />
      <h1 v-if="text" :class="textColor">
        {{ text }}
      </h1>
      <img v-if="iconImg && iconPosition === 'right'" :src="icon" :alt="icon">
      <Icon v-else-if="iconPosition==='right'" :name="!icon ? 'clarity:plus-line' : icon" :color="fillIcon()" :size="sizeIcon().size" />
    </div>
  </button>
</template>
