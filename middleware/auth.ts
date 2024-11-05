import { removeToken } from '@/composables/useToken'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { $toast, $localUser, $isLoggedIn } = useNuxtApp()
  const authorized = await $isLoggedIn()

  if (!authorized || !$localUser()?.roles.find((el: { name: string }) => el.name.toLowerCase() !== 'pengadu')) {
    $toast.error('Anda belum login')
    localStorage.clear()
    await removeToken()
    return navigateTo('/', { replace: true })
  }
})
