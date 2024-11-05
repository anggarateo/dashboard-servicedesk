<script lang="ts" setup>
import { removeToken } from '~/composables/useToken'
import { useProfileStore } from '~/store/profile'

const profileStore = useProfileStore()

const menu = ref()
const { $localUser, $isLoggedIn } = useNuxtApp()
onBeforeMount(async () => {
  const authorized = await $isLoggedIn()

  if (!authorized || !$localUser()?.roles.find((el) => el.name.toLowerCase() !== 'pengadu')) {
    let userLog
    if (localStorage.getItem('userLog')) userLog = localStorage.getItem('userLog')
    localStorage.clear()
    await removeToken()
    if (userLog) localStorage.setItem('userLog', userLog)
    useRouter().push('/auth/login')
  }

  profileStore.$patch({
    user: $localUser()
  })
})
</script>
<template>
  <div class="flex flex-row bg-primary/10 min-h-screen">
    <LayoutSideBar @menu="menu = $event" />
    <div class="w-full">
      <LayoutSideNav :menu="menu" />
      <slot />
    </div>
  </div>
</template>