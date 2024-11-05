// https://www.npmjs.com/package/vue3-easy-data-table
import vue3EasyDataTable from 'vue3-easy-data-table'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('EasyDataTable', vue3EasyDataTable)
})
