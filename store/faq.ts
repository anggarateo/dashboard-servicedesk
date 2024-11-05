export const useFaqStore = defineStore('faq', {
  state: () => ({
    detail: {},
    category: {
      title: '',
      count: 0
    },
    others: []
  })
})