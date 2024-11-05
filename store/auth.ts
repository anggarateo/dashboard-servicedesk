import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  // other options...
  state: () => ({ token_fcm: '', device_id: '' })
})
