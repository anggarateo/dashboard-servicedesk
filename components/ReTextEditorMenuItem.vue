<script setup>
import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg'

const props = defineProps({
  icon: {
    type: String,
    required: true
  },

  title: {
    type: String,
    required: true
  },

  action: {
    type: Function,
    required: true
  },

  isActive: {
    type: Function,
    default: null
  }
})

const iRmx = ref(remixiconUrl)

</script>

<template>
  <button
    class="menu-item"
    :class="{ 'is-active': props.isActive ? props.isActive(): null }"
    :title="props.title"
    @click="props.action"
  >
    <svg class="remix">
      <use :xlink:href="`${iRmx}#ri-${props.icon}`" />
    </svg>
  </button>
</template>

<style>
.menu-item {
  background: transparent;
  border: none;
  border-radius: 0.4rem;
  color: #636060;
  cursor: pointer;
  height: 1.75rem;
  padding: 0.25rem;
  margin-right: 0.25rem;
  width: 1.75rem;
}

.menu-item svg {
  fill: currentColor;
  height: 100%;
  width: 100%;
}

.menu-item.is-active,
.menu-item:hover {
  background-color: #e4e1e1;
}

</style>
