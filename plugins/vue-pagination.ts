// https://www.npmjs.com/package/@hennge/vue3-pagination
import VPagination from "@hennge/vue3-pagination"

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('VPagination', VPagination)
})