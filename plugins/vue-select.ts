// https://www.npmjs.com/package/vue-select/v/3.20.2
import VueSelect from 'vue-select'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('v-select', VueSelect)
})
