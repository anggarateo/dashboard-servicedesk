<script lang="ts" setup>
const { $api, $toast } = useNuxtApp()
const list = ref(Array())
const categoryService = ref()
const params = ref({
  service_id: ''
})

async function getData () {
  const {
    data,
    error
  } = await $api.dashboard.getTicketTodolist(params.value)
  if (data.value) list.value = data.value.data
  if (error.value) $toast.error(error.value.data.message)
}
getData()

watch(() => categoryService.value, (val) => {
  if (val) {
    const result = val.split(',')
    params.value.service_id = result[0]
  } else {
    params.value.service_id = ''
  }
  getData()
})
</script>
<template>
  <div class="p-7 space-y-8 bg-white rounded-lg">
    <div class="flex flex-col justify-between gap-2">
      <h1 class="text-xl font-semibold w-2/3">
        To-do List
      </h1>
      <DropdownPagination
        v-model="categoryService"
        api-module="ticket"
        api-method="getServices"
        option-label="name"
        :option-value="['id', 'service_category', 'id']"
        option-custom
        :required="false"
        placeholder="Pilih layanan"
        class="w-full"
        clearable
      />
    </div>
    <div
      v-for="(todo) in list"
      :key="todo.id"
      class="space-y-4"
    >
      <div class="p-4 space-y-4 text-xs border rounded-lg">
        <div class="flex flex-row justify-between items-center">
          <div>
            <h1 class="text-secondary-text">
              {{ todo.code_ticket }}
            </h1>
            <h1 class="text-base font-semibold">
              {{ todo.title }}
            </h1>
          </div>
          <CLabelText
            :text="todo.impact_level.name"
            text-color="text-error-500"
            bg-color="bg-error-100"
            text-size="text-xs"
          />
        </div>
        <ChatBox
          :value="todo.content"
          class-wrapper="text-secondary-text line-clamp-2"
        />
        <div class="border-t" />
        <div class="flex flex-row justify-between items-center">
          <div class="flex flex-row gap-1 text-secondary-text">
            <Icon name="material-symbols:calendar-month" />
            <h1>
              {{ todo.transaction_date ? $formatDate(todo.transaction_date, 'dd MMMM yyyy') : '-' }}
            </h1>
          </div>
          <CButton
            text="Detail"
            @click="$router.push(`/ticket/${todo.id}`)"
          />
        </div>
      </div>
    </div>
    <div class="flex justify-center text-xs">
      <CButton
        text="Lihat Semua"
        type="text"
        icon-position="right"
        icon="material-symbols:arrow-forward"
        @click="$router.push('/ticket')"
      />
    </div>
  </div>
</template>