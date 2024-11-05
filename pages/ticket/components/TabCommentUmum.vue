<script lang="ts" setup>
const props = defineProps({
  chats: {
    type: Array,
    default: () => []
  }
})
</script>

<template>
  <div
    v-for="(chat) in chats"
    :key="chat.id"
    :class="{
      'justify-end': chat.position === 'right',
      'justify-start': chat.position === 'left'
    }"
    class="flex flex-row gap-2 items-start"
  >
    <Avatar
      v-if="chat.position === 'left'"
      :avatar="chat.user.avatar"
      :name="chat.user.name"
      :size="8"
    />
    <div class="flex flex-col gap-2">
      <h1 class="font-medium" :class="{ 'text-right': chat.position === 'right' }">
        {{ chat.user.id === $localUser().id ? 'Anda' : chat.user.name }}
      </h1>
      <ChatBox :value="chat.message" :position="chat.position" :files="chat.image" />
      <h1 class="text-xs text-secondary-text">
        {{ chat.send_date }}
      </h1>
    </div>
    <Avatar
      v-if="chat.position === 'right'"
      :avatar="chat.user.avatar"
      :name="chat.user.name"
      :size="8"
    />
  </div>
</template>
