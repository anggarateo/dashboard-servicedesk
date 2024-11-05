<script setup>

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const { $api, $toast } = useNuxtApp()
const isLoading = ref(false)
const emits = defineEmits(['close'])

const submitDeleteAgent = async () => {
  try {
    isLoading.value = true

    const {
      data,
      error
    } = await $api.agent.deleteAgent(props.user.id, null)

    if (data.value) {
      $toast.success(data.value.message, {
        position: $toast.POSITION.BOTTOM_RIGHT
      })
      router.go(-1)
    }
    if (error.value) {
      $toast.error(error.value.data.message, {
        position: $toast.POSITION.BOTTOM_RIGHT
      })
    }

    isLoading.value = false
  } catch (e) {
    isLoading.value = false
    $toast.error(e.value.data.message)
  }
  emits('close')
}
</script>

<template>
  <ModalInfo
    :title="'Anda akan menghapus ' + props.user.name"
    :info="true"
    type="delete"
    :disabled-button="isLoading"
    @close-all="submitDeleteAgent"
  />
</template>
