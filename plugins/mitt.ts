import mitt from 'mitt'

export default defineNuxtPlugin((nuxtApp) => {
  const emitt = mitt()
  return {
    provide: {
      mitt: {
        on: emitt.on,
        off: emitt.off,
        all: emitt.all,
        emit: emitt.emit
      }
    }
  }
})