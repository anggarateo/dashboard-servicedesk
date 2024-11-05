<script setup>
import TabAgentService from '@/pages/master/agent/detail/components/TabAgentService.vue'
import TabHistoryLog from '@/pages/master/agent/detail/components/TabHistoryLog.vue'

const tabs = ref([
  {
    link: '#',
    label: 'Layanan',
    slotName: 'tab1',
    current: true
  },
  {
    link: '#',
    label: 'History Perubahan',
    slotName: 'tab2'
  }
])

</script>

<template>
  <NavigationTab :tabs="tabs">
    <template #tab1>
      <TabAgentService />
    </template>
    <template #tab2>
      <TabHistoryLog />
    </template>
  </NavigationTab>
</template>
