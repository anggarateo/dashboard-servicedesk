import { defineStore } from 'pinia'

export const useProfileStore = defineStore('profile', {
  // other options...
  state: () => ({ user: null })
})
