<script setup>
import { addDays } from 'date-fns'

defineProps({
  data: Array
})
</script>

<template>
  <div class="space-y-4 text-sm">
    <div v-for="(item) in data" :key="item.id" class="flex flex-col lg:flex-row justify-between gap-1">
      <div class="flex gap-2 w-full lg:w-2/3">
        <Avatar
          :avatar="item.user.avatar"
          :name="item.user.name"
          :size="8"
          text-class="w-8 h-8"
        />
        <h1 class="space-x-1 w-full">
          <span class="font-bold">{{ item.user.name }}</span>
          <span v-html="item.label_html" />
        </h1>
      </div>
      <h1 class="text-neutral-400">
        {{
          addDays(new Date(item.date), 3) >= new Date() ?
          $distanceDate(item.date, new Date(), { addSuffix: true, locale: $localeId() })
          : $formatDate(item.date, 'dd MMMM yyyy - HH:mm').replace('-', 'Pukul')
        }}
      </h1>
    </div>
  </div>
</template>
