// https://www.npmjs.com/package/@vuepic/vue-datepicker
import VueDatePicker from '@vuepic/vue-datepicker'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('vue-datepicker', VueDatePicker)
})
