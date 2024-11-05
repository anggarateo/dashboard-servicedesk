<template>
  <div>
    <ul class="flex flex-wrap">
      <li v-for="tab in tabs" :key="tab.label" class="mr-2 text-sm font-medium text-center text-gray-500">
        <a
          :href="tab.link"
          class="inline-block p-4"
          :class="[tabClasses(tab)]"
          :aria-current="tab.current ? 'page' : null"
          @click.prevent="selectTab(tab)"
        >
          {{ tab.label }}
        </a>
      </li>
    </ul>
    <div v-if="selectedTab">
      <slot :name="selectedTab.slotName" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tabs: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      selectedTab: null
    }
  },
  created () {
    this.selectedTab = this.tabs.find(tab => tab.current)
  },
  methods: {
    tabClasses (tab) {
      return {
        'border-transparent': !tab.current,
        'hover:text-gray-600 hover:border-gray-300': !tab.current,
        'border-b-2 text-primary border-primary': tab.current,
        'cursor-not-allowed text-gray-400': tab.disabled
      }
    },
    selectTab (tab) {
      if (!tab.disabled) {
        this.tabs.forEach((t) => {
          t.current = t.label === tab.label
        })
        this.selectedTab = tab
      }
    }
  }
}
</script>
