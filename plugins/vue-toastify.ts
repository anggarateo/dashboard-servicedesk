import { toast, updateGlobalOptions } from 'vue3-toastify'

export default defineNuxtPlugin((nuxtApp) => {
  // nuxtApp.vueApp.use(Vue3Toastify, { autoClose: 1000 });
  nuxtApp.vueApp.config.globalProperties.Vue3Toastify = {
    install: () => {
      updateGlobalOptions({ autoClose: 1000 })
    }
  }

  return {
    provide: {
      toast
    }
  }
})
