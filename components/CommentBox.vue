<script setup>

const tabsData = ref([
  { label: 'Komentar Umum', link: '#', current: true, slotName: 'tab1' },
  { label: 'Komentar Internal', link: '#', current: false, slotName: 'tab2' }
])

</script>

<template>
  <NavigationTab :tabs="tabsData">
    <template #tab1>
      <TextEditor :is-top-rounded="false" />
    </template>
    <template #tab2>
      <p>This is the komentar internal.</p>
    </template>
  </NavigationTab>
</template>
