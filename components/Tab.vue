<template>
  <div
    class="relative flex overflow-x-auto"
    :class="{
      'space-x-2': type === 'pill',
    }"
  >
    <template v-if="skeletonMode">
      <div v-for="index in 5" :key="index">
        <SkeletonBlock :class="{ 'rounded-md': type === 'pill' }" style="height: 2.7rem;" :style="{ width: `${Math.floor(Math.random() * (11 - 6 + 1) + 6)}ch` }" />
      </div>
    </template>
    <template v-if="!skeletonMode">
      <div
        v-for="(tab, index) in tabs"
        :key="index"
        class="transform duration-300"
        :class="[
          {
            'p-2 rounded-md border btn-effect': type === 'pill',
            'border-stroke bg-white': type === 'pill' && activeTab !== tab.id,
            'border-primary bg-primary/10 text-primary': type === 'pill' && activeTab === tab.id,

            'w-full p-2 border-b-2 bg-white text-center ': type === 'underlined',
            'border-transparent': type === 'underlined' && activeTab !== tab.id,
            'border-primary-500 text-primary': type === 'underlined' && activeTab === tab.id,

            'w-full p-2 text-center': type === 'underlined-primary',
            'bg-white': type === 'underlined-primary' && activeTab !== tab.id,
            'bg-primary text-white shadow-md': type === 'underlined-primary' && activeTab === tab.id
          },
          styling,
          disabled ? 'cursor-not-allowed' : 'cursor-pointer'
        ]"
        @click="disabled ? '' : clickTab(tab)"
      >
        <span class="whitespace-nowrap text-center transform duration-300">{{ tab.name }}</span>
      </div>
    </template>
  </div>
</template>

<script>
import SkeletonBlock from '~/components/SKeleton'

export default {
  name: 'TabComponent',

  components: { SkeletonBlock },

  props: {
    tabs: {
      type: Array,
      default: () => []
    },
    activeTab: {
      type: String,
      default: null
    },
    type: {
      type: String,
      default: 'pill'
    },
    styles: {
      type: String,
      default: ''
    },
    skeletonMode: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    styling () {
      return this.styles
    }
  },

  methods: {
    clickTab (tab) { this.$emit('switchTab', tab) }
  }
}
</script>
