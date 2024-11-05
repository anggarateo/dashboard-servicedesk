// eslint-disable-next-line import/default
import Vue3EasyDataTable from 'vue3-easy-data-table'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('vue-table', Vue3EasyDataTable)
})
