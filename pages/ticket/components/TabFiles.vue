<script lang="ts" setup>
const props = defineProps({
  idTicket: {
    type: String,
    required: true
  }
})
const { $api, $toast } = useNuxtApp()

const loading = ref(false)
const files = ref(Array())
// const initPagination = () => ({
//   page: 1,
//   pages: 1,
//   perPage: 5
// })
// const pagination = ref(initPagination())

onMounted(() => {
  getData()
})

// watch(() => pagination.value.page, () => {
//   getData()
// })
// watch(() => pagination.value.perPage, () => {
//   pagination.value.page = 1
//   getData()
// })

async function getData () {
  loading.value = true

  const {
    data,
    error,
    pending
  } = await $api.ticket.getFiles(props.idTicket, {
    // page: pagination.value.page,
    // per_page: pagination.value.perPage
  })

  if (data.value) {
    files.value = data.value.data
  }
  if (error.value) {
    const err: any = error.value
    $toast.error(err.data.message)
  }
  if (pending.value) loading.value = pending.value

  loading.value = false
}
</script>

<template>
  <div v-if="!loading" class="space-y-8">
    <div
      v-if="!files.length"
      class="font-semibold"
    >
      Tidak ada berkas
    </div>

    <template v-else>
      <div class="space-y-1">
        <div
          v-for="(file, i) in files"
          :key="i"
          class="flex"
        >
          <Icon name="material-symbols:image" color="#2953A1" size="24" />
          
          <div
            class="text-neutral-500 hover:underline cursor-pointer"
            @click="$onPreviewFile(file)"
          >
            <span class="text-primary-600">{{ file.filename }}</span> {{ file.size && file.size > 0 ? file.size + ' KB' : '' }}
          </div>
        </div>
      </div>

      <!-- <ButtonPagination
        v-if="files.length"
        v-model="pagination.page"
        :pages="pagination.pages"
        :per-page="pagination.perPage"
        @per-page="pagination.perPage = $event"
      /> -->
    </template>
  </div>
</template>
