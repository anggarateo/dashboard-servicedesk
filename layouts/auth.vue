<script lang="ts" setup>
const {
  $localUser,
  $isLoggedIn,
  $config: {
    public: {
      apiBaseUrl
    }
  },
  $api,
  $toast
} = useNuxtApp()
const {
  query,
  fullPath
} = useRoute()

onBeforeMount(async () => {
  let auth

  if (query?.auth) {
    auth = JSON.parse(query.auth?.toString())

    function onError () {
      navigateTo(fullPath)
    }

    if (auth) {
      const { auth: { token } } = auth

      const {
        data: { value },
        error
      } = await useFetch(
        apiBaseUrl + 'auth/profile',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const profile: any = value
  
      if (profile) {
        const userRole: any = await $api.role.get.getRoleUser(token)
  
        if (profile.data.roles.length === 1 && profile.data.roles.find((el: any) => el.name.toLowerCase() === 'pengadu')) {
          return $toast.warn('Anda tidak dapat mengakses website ini')
        }
  
        if (userRole.data.value) {
          const permissions = {
            roles: profile.data.roles,
            menus: userRole.data.value.data
          }
          localStorage.setItem('permissions', JSON.stringify(permissions))
          // get current role user
  
          localStorage.setItem('avatar', profile.data?.avatar ?? '')
          localStorage.setItem('user', JSON.stringify(profile.data))
          
          await setToken(auth)
          
          useRouter().replace('/')
        }

        if (userRole.error.value) {
          $toast.error(userRole.error.value.data.message)
          onError()
        }
      }
      
      if (error.value) {
        $toast.error(error.value.data.message)
        onError()
      }
    }
  }

  return await $isLoggedIn() && $localUser()?.roles.find((el: any) => el.name.toLowerCase() !== 'pengadu') ? useRouter().push('/dashboard') : null
})
</script>
<template>
  <div>
    <slot />
  </div>
</template>
