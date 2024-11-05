<script setup>
import FormPassword from './component/FormPassword.vue'
import FormProfile from './component/FormProfile.vue'

useHead({ title: 'Pengaturan' })
definePageMeta({
  components: {
    FormPassword,
    FormProfile
  }
})

const tabActive = ref('tab1')

const tabs = [
  { id: 'tab1', name: 'Profile' },
  { id: 'tab2', name: 'Kata Sandi' }
]
const switchTab = (val) => {
  tabActive.value = val.id
}
</script>
<template>
  <div class="m-4 p-6 rounded-lg shadow space-y-8">
    <div class="flex flex-row justify-between">
      <div class="flex flex-col">
        <h1 class="text-xl font-bold">
          Pengaturan
        </h1>
      </div>
    </div>
    <div class=" w-4/12">
      <Tab :tabs="tabs" :active-tab="tabActive" type="underlined" @switchTab="switchTab" />
    </div>
    <FormProfile v-if="tabActive === 'tab1'" />
    <FormPassword v-if="tabActive === 'tab2'" />
  </div>
</template>
