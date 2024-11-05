export default defineNuxtRouteMiddleware(async (to, from) => {
  const code = to.meta?.alias?.replace(/\//g, '')
  const { $checkPermission, $toast, $isLoggedIn, $localUser } = useNuxtApp()
  const authorized = await $isLoggedIn()

  // skip
  if (
    to.name?.includes('auth')
    || to.name === 'dashboard'
    || to.path === '/'
    || code === 'invited-user'
    || code === 'profil'
    || code === 'notifikasi'
  ) return
  // skip

  // unauthorize
  if (!authorized || !$localUser() || !localStorage.getItem('permissions') || !$localUser()?.roles.find((el) => el.name.toLowerCase() !== 'pengadu')) return navigateTo('/auth/login', { replace: true })
  // unauthorize

  // check permission
  if (authorized && !($checkPermission(code, 'view_all') || $checkPermission(code, 'view'))) {
    $toast.error('Anda tidak memiliki akses')
    return navigateTo('/dashboard', { replace: true })
  }
  // check permission
})
