export const useTicketStore = defineStore('ticket', {
  state: () => ({
    codeTicket: '',
    list: {
      activeTab: {
        id: '',
        name: ''
      },
      data: [],
      total: 0,
      serverParams: {},
      serverOptions: {},
      scrollY: 0,
      sortBy: {},
      filterParams: {},
      showFilter: false
    },
    getStore: false
  })
})
