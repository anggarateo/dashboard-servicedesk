export const useNotifStore = defineStore('notif', {
  state: () => ({
    list: {
      data: []
    },
    totalUnread: {
      data: 0
    }
  })
})
