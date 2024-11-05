<script lang="ts" setup>
const { $isLoggedIn } = useNuxtApp()
onBeforeMount(async () => {
  if (await $isLoggedIn()) {
    useRouter().push('/dashboard')
  } else {
    useRouter().push('/auth/login')
  }
})
</script>
<template>
  <div />
</template>